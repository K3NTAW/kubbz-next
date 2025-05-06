import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const tournamentId = params.id;
  let name: string;

  try {
    const body = await req.json();
    name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name ist erforderlich." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Optionally: store registration in a separate table, for now just increment registeredPeople
  try {
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    // Optionally: check for maxPeople limit
    if (
      typeof tournament.maxPeople === "number" &&
      typeof tournament.registeredPeople === "number" &&
      tournament.registeredPeople >= tournament.maxPeople
    ) {
      return NextResponse.json({ error: "Das Turnier ist bereits voll." }, { status: 400 });
    }
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        registeredPeople: { increment: 1 },
        // Optionally: registrations: { create: { name } }
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler bei der Registrierung." }, { status: 500 });
  }
} 