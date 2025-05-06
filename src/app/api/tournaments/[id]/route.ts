import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
// import { z } from "zod"; // Uncomment if you want to use zod

const prisma = new PrismaClient();

// Optional: zod schema for validation
// const TournamentUpdateSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   date: z.string().optional(),
// });

type TournamentUpdateBody = {
  title?: string;
  name?: string;
  date?: string;
  description?: string;
  googleMapsUrl?: string;
  price?: string;
  maxPeople?: string;
  registeredPeople?: string;
};

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete tournament." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body: TournamentUpdateBody = await req.json();
    const {
      title,
      name,
      date,
      description,
      googleMapsUrl,
      price,
      maxPeople,
      registeredPeople
    } = body;
    const data: Record<string, unknown> = {
      ...(title !== undefined && { title }),
      ...(name !== undefined && { name }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(description !== undefined && { description }),
      ...(googleMapsUrl !== undefined && { googleMapsUrl }),
      ...(price !== undefined && { price: price ? parseFloat(price) : null }),
      ...(maxPeople !== undefined && { maxPeople: maxPeople ? parseInt(maxPeople, 10) : undefined }),
      ...(registeredPeople !== undefined && { registeredPeople: registeredPeople ? parseInt(registeredPeople, 10) : undefined }),
    };
    const tournament = await prisma.tournament.update({
      where: { id },
      data,
    });
    return NextResponse.json({ tournament });
  } catch {
    return NextResponse.json(
      { error: "Failed to update tournament." },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json(tournament);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden des Turniers." },
      { status: 500 }
    );
  }
} 