import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "./prisma";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.emailVerified?.toISOString() || null,
      updatedAt: currentUser.emailVerified?.toISOString() || null,
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch {
    return null;
  }
} 