import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function DELETE(
  req: NextRequest,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  const xata = getXataClient();
  const { id: tournamentId, registrationId } = params;
  try {
    // Find the registration to get the tournamentId (for safety)
    const registration = await xata.db.tournament_registrations.read(registrationId);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }
    // Delete the registration
    await xata.db.tournament_registrations.delete(registrationId);
    // Decrement registered_people for the tournament
    const tournament = await xata.db.tournaments.read(tournamentId);
    if (tournament && typeof tournament.registered_people === "number") {
      await xata.db.tournaments.update(tournamentId, {
        registered_people: Math.max(0, tournament.registered_people - 1),
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete registration." }, { status: 500 });
  }
} 