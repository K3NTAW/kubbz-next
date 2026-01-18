import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
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
            payment: true,
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
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Turnier nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des Turniers" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, date, location, price, maxParticipants, status, winnerId, imageUrl, type } = body;

    // If winnerId is being updated, handle win count changes
    let oldWinnerId: string | null = null;
    if (winnerId !== undefined) {
      const currentTournament = await prisma.tournament.findUnique({
        where: { id },
        select: { winnerId: true },
      });
      oldWinnerId = currentTournament?.winnerId || null;
      const newWinnerId = winnerId || null;

      // If there was a previous winner and it's different from the new winner, decrement their wins
      if (oldWinnerId && oldWinnerId !== newWinnerId) {
        await prisma.user.update({
          where: { id: oldWinnerId },
          data: {
            wins: {
              decrement: 1,
            },
          },
        });
      }

      // If a new winner is set and it's different from the old winner, increment their wins
      if (newWinnerId && newWinnerId !== oldWinnerId) {
        await prisma.user.update({
          where: { id: newWinnerId },
          data: {
            wins: {
              increment: 1,
            },
          },
        });
      }
    }

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        name,
        description,
        date: date ? new Date(date) : undefined,
        location,
        price: price !== undefined ? parseFloat(price) : undefined,
        maxParticipants: maxParticipants !== undefined ? parseInt(maxParticipants) : undefined,
        status,
        type: type !== undefined ? type : undefined,
        winnerId: winnerId !== undefined ? (winnerId || null) : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      },
      include: {
        winner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error updating tournament:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Turniers" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.tournament.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Turnier gelöscht" });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Turniers" },
      { status: 500 }
    );
  }
}

