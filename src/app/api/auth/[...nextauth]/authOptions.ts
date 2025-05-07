import type { AuthOptions, SessionStrategy, DefaultSession } from "next-auth";
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
    async session({ session }: { session: DefaultSession }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userWithXata = session.user as any;
      if (userWithXata?.email) {
        const xata = getXataClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await (xata.db.users.filter({ email: userWithXata.email } as any).getFirst());
        console.log("Xata user by email:", user);
        if (
          user &&
          user.user_metadata &&
          typeof user.user_metadata === "object" &&
          user.user_metadata !== null &&
          "role" in user.user_metadata
        ) {
          userWithXata.role = user.user_metadata.role;
        }
        if (user) {
          userWithXata.xata_id = user.id;
        }
      }
      return session;
    },
  },
}; 