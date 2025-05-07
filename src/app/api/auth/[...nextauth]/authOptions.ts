import type { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getXataClient } from "@/xata";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const xata = getXataClient();
        const user = await xata.db.users.filter({ email: credentials.email }).getFirst();
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.xata_id,
          name: user.name,
          email: user.email,
          xata_id: user.xata_id,
        };
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          is_admin: token.is_admin,
          xata_id: token.xata_id || token.id,
        },
      };
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const xata = getXataClient();
        // Try to find the user in Xata
        let dbUser = await xata.db.users.filter({ email: user.email }).getFirst();
        // If not found (e.g., OAuth login), create the user in Xata
        if (!dbUser) {
          dbUser = await xata.db.users.create({
            email: user.email,
            name: user.name,
          });
        }
        token.xata_id = dbUser.xata_id || dbUser.id;
        if (typeof dbUser.is_admin === 'boolean') {
          token.is_admin = dbUser.is_admin;
        }
      }
      return token;
    },
  },
}; 