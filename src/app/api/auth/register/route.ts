import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const normalizedEmail = email.toLowerCase();
  const existing = await prisma.users.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
  });
  if (existing) {
    return NextResponse.json({ error: "User already exists." }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  const user = await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password: hashed,
      name,
    },
  });
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
} 