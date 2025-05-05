import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, date, description, createdBy } = body;
    if (!name || !date || !createdBy) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const tournament = await prisma.tournament.create({
      data: {
        name,
        date: new Date(date),
        description: description ?? null,
        createdBy,
      },
    });
    return NextResponse.json({ tournament });
  } catch {
    return NextResponse.json({ error: "Failed to create tournament." }, { status: 500 });
  }
} 