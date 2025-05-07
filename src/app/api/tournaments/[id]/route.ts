import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
// import { z } from "zod"; // Uncomment if you want to use zod

// Optional: zod schema for validation
// const TournamentUpdateSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   date: z.string().optional(),
// });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const { id } = params;
  try {
    await xata.db.tournaments.delete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete tournament." },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const { id } = params;
  try {
    const body = await req.json();
    const tournament = await xata.db.tournaments.update(id, body);
    return NextResponse.json({
      tournament: {
        xata_id: tournament?.xata_id,
        xata_createdat: tournament?.xata_createdat,
        xata_updatedat: tournament?.xata_updatedat,
        title: tournament?.title ?? null,
        name: tournament?.name ?? null,
        // add other fields as needed
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update tournament." },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const xata = getXataClient();
  const { id } = params;
  try {
    const tournament = await xata.db.tournaments.read(id);
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json(tournament);
  } catch {
    return NextResponse.json({ error: "Fehler beim Abrufen des Turniers." }, { status: 500 });
  }
} 