import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, name, date, description, googleMapsUrl, price, maxPeople, registeredPeople } = body;
    if (!title || !name || !date || !maxPeople) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const tournament = await prisma.tournament.create({
      data: {
        title,
        name,
        date: new Date(date),
        description: description ?? null,
        googleMapsUrl: googleMapsUrl ?? null,
        price: price ? parseFloat(price) : null,
        maxPeople: parseInt(maxPeople, 10),
        registeredPeople: registeredPeople ? parseInt(registeredPeople, 10) : 0,
        createdBy: session.user.id,
      },
    });
    return NextResponse.json({ tournament });
  } catch (error) {
    console.error("Failed to create tournament:", error);
    return NextResponse.json({ error: "Failed to create tournament." }, { status: 500 });
  }
} 