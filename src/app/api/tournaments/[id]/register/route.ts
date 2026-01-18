import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        registrations: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Turnier nicht gefunden" },
        { status: 404 }
      );
    }

    if (tournament.status !== "OPEN") {
      return NextResponse.json(
        { error: "Anmeldung für dieses Turnier ist nicht möglich" },
        { status: 400 }
      );
    }

    if (tournament.registrations.length >= tournament.maxParticipants) {
      return NextResponse.json(
        { error: "Turnier ist bereits voll" },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_tournamentId: {
          userId: session.user.id,
          tournamentId: id,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Sie sind bereits für dieses Turnier registriert" },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        tournamentId: id,
        teamName: body.teamName || null,
        notes: body.notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error registering for tournament:", error);
    return NextResponse.json(
      { error: "Fehler bei der Anmeldung" },
      { status: 500 }
    );
  }
}

