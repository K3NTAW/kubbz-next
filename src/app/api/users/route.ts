import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
} 