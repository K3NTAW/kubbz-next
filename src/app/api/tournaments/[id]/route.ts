import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
// import { z } from "zod"; // Uncomment if you want to use zod

// Optional: zod schema for validation
// const TournamentUpdateSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   date: z.string().optional(),
// });

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const xata = getXataClient();
  const { id: xata_id } = context.params;
  try {
    await xata.db.Tournament.delete(xata_id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete tournament." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const xata = getXataClient();
  const { id: xata_id } = context.params;
  try {
    const body = await req.json();
    const tournament = await xata.db.Tournament.update(xata_id, body);
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

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const xata = getXataClient();
  const { id: xata_id } = context.params;
  try {
    const tournament = await xata.db.Tournament.read(xata_id);
    if (!tournament) {
      return NextResponse.json({ error: "Turnier nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({
      xata_id: tournament.xata_id,
      xata_createdat: tournament.xata_createdat,
      xata_updatedat: tournament.xata_updatedat,
      title: tournament.title,
      name: tournament.name,
      // add other fields as needed
    });
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden des Turniers." },
      { status: 500 }
    );
  }
} 