import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { 
          error: "Database configuration error",
          code: "MISSING_DATABASE_URL",
          message: "DATABASE_URL environment variable is not set"
        },
        { status: 500 }
      );
    }

    const tournaments = await prisma.tournament.findMany({
      include: {
        registrations: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
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
    
    // Sort registrations client-side if needed
    tournaments.forEach(tournament => {
      if (tournament.registrations) {
        tournament.registrations.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });

    return NextResponse.json(tournaments);
  } catch (error: any) {
    // Log full error details for debugging
    console.error("Error fetching tournaments:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    
    // Return error with code for better debugging (even in production)
    return NextResponse.json(
      { 
        error: "Fehler beim Laden der Turniere",
        code: error?.code || "UNKNOWN_ERROR",
        // Include message in production for debugging (can remove later)
        message: error?.message || "Unknown error occurred",
      },
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

