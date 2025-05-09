import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any // Use any for params and suppress linter warning
) {
  const xata = getXataClient();
  const awaitedParams = await params; // Await params as it's now of type any
  const { registrationId } = awaitedParams;

  // Check for null or undefined registrationId early
  if (!registrationId || registrationId === 'null' || registrationId === 'undefined') {
    return NextResponse.json({ error: "Invalid registration ID." }, { status: 400 });
  }

  try {
    // Find the registration to get the tournamentId (for safety and to ensure it exists)
    const registration = await xata.db.tournament_registrations.read(registrationId);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    // Optional: Verify tournamentId from params matches registration.tournament_id if needed
    // if (registration.tournament_id !== id) {
    //   return NextResponse.json({ error: "Mismatch in tournament ID." }, { status: 400 });
    // }

    await xata.db.tournament_registrations.delete(registrationId);

    // Decrement registered_people count on the tournament
    if (registration.tournament_id) {
      const tournamentToUpdateId = typeof registration.tournament_id === 'string' ? registration.tournament_id : registration.tournament_id.id;
      if (tournamentToUpdateId) {
        const tournament = await xata.db.tournaments.read(tournamentToUpdateId);
        if (tournament) {
            await xata.db.tournaments.update(tournamentToUpdateId, {
                registered_people: Math.max(0, (tournament.registered_people || 0) - 1),
            });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE REGISTRATION ERROR] Details:", error);
    return NextResponse.json(
      { error: "Failed to delete registration." },
      { status: 500 }
    );
  }
} 