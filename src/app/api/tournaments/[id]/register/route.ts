import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const { id: tournamentId } = params;
  try {
    const tournament = await xata.db.tournaments.read(tournamentId);
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json(tournament);
  } catch {
    return NextResponse.json({ error: "Fehler beim Abrufen des Turniers." }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const { id: tournamentId } = params;

  // Get user session
  const session = await getServerSession(authOptions);
  const user = session?.user as { xata_id?: string } | undefined;
  if (!session || !user?.xata_id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }
  const userXataId = user.xata_id;

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

  try {
    const tournament = await xata.db.tournaments.read(tournamentId);
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    if (
      typeof tournament.max_people === "number" &&
      typeof tournament.registered_people === "number" &&
      tournament.registered_people >= tournament.max_people
    ) {
      return NextResponse.json({ error: "Das Turnier ist bereits voll." }, { status: 400 });
    }
    // Check if user is already registered for this tournament
    const alreadyRegistered = await xata.db.tournament_registrations.filter({
      user_id: userXataId,
      tournament_id: tournamentId,
    }).getFirst();
    if (alreadyRegistered) {
      return NextResponse.json({ error: "Du bist bereits für dieses Turnier registriert." }, { status: 400 });
    }
    // Register the user
    await xata.db.tournament_registrations.create({
      user_id: userXataId,
      tournament_id: tournamentId,
      name,
    });
    // Update registered_people count
    await xata.db.tournaments.update(tournamentId, {
      registered_people: (tournament.registered_people || 0) + 1,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler bei der Registrierung." }, { status: 500 });
  }
} 