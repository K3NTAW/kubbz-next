import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      is_admin?: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    is_admin?: boolean;
  }
} 