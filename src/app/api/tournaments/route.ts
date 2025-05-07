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
    // Map camelCase fields from frontend to snake_case for Xata
    const created = await xata.db.tournaments.create({
      name: body.name,
      date,
      description: body.description,
      google_maps_url: body.googleMapsUrl,
      price: body.price,
      max_people: body.maxPeople !== undefined ? Number(body.maxPeople) : undefined,
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