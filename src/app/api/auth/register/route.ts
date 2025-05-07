import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
import { hash } from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const normalizedEmail = email.toLowerCase();
  const xata = getXataClient();
  const existing = await xata.db.users.filter({ email: normalizedEmail }).getFirst();
  if (existing) {
    return NextResponse.json({ error: "User already exists." }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  const user = await xata.db.users.create({
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password: hashed,
    name,
  });
  return NextResponse.json({ user: { xata_id: user.xata_id, email: user.email, name: user.name } });
} 