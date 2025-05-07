import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string; registrationId: string } }
) {
  const xata = getXataClient();
  const { id: tournamentId, registrationId } = context.params;
  try {
    // Find the registration to get the tournamentId (for safety)
    const registration = await xata.db.TournamentRegistration.read(registrationId);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }
    // Delete the registration
    await xata.db.TournamentRegistration.delete(registrationId);
    // Decrement registeredPeople for the tournament
    const tournament = await xata.db.Tournament.read(tournamentId);
    if (tournament && typeof tournament.registeredPeople === "number") {
      await xata.db.Tournament.update(tournamentId, {
        registeredPeople: Math.max(0, tournament.registeredPeople - 1),
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete registration." }, { status: 500 });
  }
} 