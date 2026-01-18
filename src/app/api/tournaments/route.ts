import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
          },
        },
        winner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Turniere" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, date, location, price, maxParticipants, status, imageUrl, type } = body;

    const tournament = await prisma.tournament.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        price: parseFloat(price),
        maxParticipants: parseInt(maxParticipants),
        status: status || "DRAFT",
        type: type || "SOLO",
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Turniers" },
      { status: 500 }
    );
  }
}

