import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// This creates a handler with GET and POST implementations
const handler = NextAuth(authOptions);

// Export the handler functions for Next.js App Router
export const GET = handler.GET;
export const POST = handler.POST; 