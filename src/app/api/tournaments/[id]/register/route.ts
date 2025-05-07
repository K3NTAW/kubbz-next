import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const xata = getXataClient();
  const { id: tournamentId } = params;

  // Get user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.xata_id) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }
  const userXataId = session.user.xata_id;

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
    const tournament = await xata.db.Tournament.read(tournamentId);
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
    const alreadyRegistered = await xata.db.TournamentRegistration.filter({
      userId: userXataId,
      tournamentId: tournamentId,
    }).getFirst();
    if (alreadyRegistered) {
      return NextResponse.json({ error: "Du bist bereits für dieses Turnier registriert." }, { status: 400 });
    }
    // Register the user
    await xata.db.TournamentRegistration.create({
      userId: userXataId,
      tournamentId: tournamentId,
      name,
    });
    // Update registeredPeople count
    await xata.db.Tournament.update(tournamentId, {
      registeredPeople: (tournament.registeredPeople || 0) + 1,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler bei der Registrierung." }, { status: 500 });
  }
} 