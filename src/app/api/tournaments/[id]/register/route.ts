import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = new PrismaClient();
  const { id: tournamentId } = await params;
  let name: string;

  // Get user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await req.json();
    name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name ist erforderlich." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    if (
      typeof tournament.maxPeople === "number" &&
      typeof tournament.registeredPeople === "number" &&
      tournament.registeredPeople >= tournament.maxPeople
    ) {
      return NextResponse.json({ error: "Das Turnier ist bereits voll." }, { status: 400 });
    }
    // Check if user is already registered for this tournament
    const alreadyRegistered = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_tournamentId: {
          userId,
          tournamentId,
        },
      },
    });
    if (alreadyRegistered) {
      return NextResponse.json({ error: "Du bist bereits für dieses Turnier registriert." }, { status: 400 });
    }
    // Register the user
    await prisma.tournamentRegistration.create({
      data: {
        userId,
        tournamentId,
        name,
      },
    });
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        registeredPeople: { increment: 1 },
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler bei der Registrierung." }, { status: 500 });
  }
} 