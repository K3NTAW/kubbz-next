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
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { winnerId } = await request.json();

    // Get the current tournament to check for existing winner
    const currentTournament = await prisma.tournament.findUnique({
      where: { id },
      select: { winnerId: true },
    });

    const oldWinnerId = currentTournament?.winnerId;
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

    // Update tournament with new winner
    const tournament = await prisma.tournament.update({
      where: { id },
      data: { winnerId: newWinnerId },
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

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error setting tournament winner:", error);
    return NextResponse.json(
      { error: "Fehler beim Setzen des Gewinners" },
      { status: 500 }
    );
  }
}

