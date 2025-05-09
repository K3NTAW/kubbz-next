import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const awaitedParams = await params;
  const { id: tournamentId } = awaitedParams;
  try {
    console.log('[GET] /api/tournaments/[id]/register - tournamentId:', tournamentId);
    const tournament = await xata.db.tournaments.read(tournamentId);
    console.log('[GET] /api/tournaments/[id]/register - tournament:', tournament);
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ...tournament, id: tournament.xata_id, tournament });
  } catch (err) {
    console.error('[GET] /api/tournaments/[id]/register error:', err);
    return NextResponse.json({ error: "Fehler beim Abrufen des Turniers." }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const awaitedParams = await params;
  const { id: tournamentId } = awaitedParams;

  const session = await getServerSession(authOptions);
  // console.log('[DEBUG] /api/tournaments/[id]/register POST session:', session);
  
  // Explicitly type session.user to include xata_id for this route
  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null; is_admin?: boolean; xata_id?: string };

  if (!session || !user?.xata_id) {
    return NextResponse.json({ error: "Nicht eingeloggt oder Benutzer-ID fehlt." }, { status: 401 });
  }
  const userXataId = user.xata_id; // Now this should be fine

  let nameFromBody: string;
  try {
    const body = await req.json();
    nameFromBody = (body.name || "").trim();
    if (!nameFromBody) {
      return NextResponse.json({ error: "Name ist erforderlich." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage-Body." }, { status: 400 });
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

    const alreadyRegistered = await xata.db.tournament_registrations.filter({
      user_id: userXataId, // Filter by the user_id column
      tournament_id: tournamentId,
    }).getFirst();

    if (alreadyRegistered) {
      return NextResponse.json({ error: "Du bist bereits für dieses Turnier registriert." }, { status: 400 });
    }

    await xata.db.tournament_registrations.create({
      user_id: userXataId, // Store user's xata_id in the user_id column
      tournament_id: tournamentId,
      name: nameFromBody, // Name of the person registering (from request body)
      // Xata will auto-generate the primary key (xata_id for this table)
    });

    await xata.db.tournaments.update(tournamentId, {
      registered_people: (tournament.registered_people || 0) + 1,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[REGISTRATION ERROR] Details:', err);
    return NextResponse.json({ error: "Fehler bei der Registrierung." }, { status: 500 });
  }
} 