import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function POST(req: NextRequest) {
  const xata = getXataClient();
  try {
    const body = await req.json();
    // Convert date to ISO string if needed
    let date = body.date;
    if (date && typeof date === "string" && !date.includes("T")) {
      date = new Date(date).toISOString();
    }
    // Map snake_case fields from frontend to Xata
    const created = await xata.db.tournaments.create({
      name: body.name,
      date,
      description: body.description,
      google_maps_url: body.google_maps_url,
      price: body.price,
      max_people: body.max_people !== undefined ? Number(body.max_people) : undefined,
      registered_people: body.registered_people !== undefined ? Number(body.registered_people) : 0,
      // Do not set registered_people on creation
      // title: body.title, // removed as per user request
      // add any other fields as needed
    });
    return NextResponse.json(created);
  } catch (err) {
    console.error("Tournament creation error:", err);
    return NextResponse.json({ error: "Failed to create tournament." }, { status: 500 });
  }
}

export async function GET() {
  const xata = getXataClient();
  const tournaments = await xata.db.tournaments.getAll();
  return NextResponse.json(tournaments.map(t => ({
    xata_id: t.xata_id,
    name: t.name,
    description: t.description,
    google_maps_url: t.google_maps_url,
    price: t.price,
    max_people: t.max_people,
    registered_people: t.registered_people,
    date: t.date,
    // add any other fields you need
  })));
} 