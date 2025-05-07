import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.xata_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, name, date, description, googleMapsUrl, price, maxPeople, registeredPeople } = body;
    if (!title || !name || !date || !maxPeople) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const xata = getXataClient();
    const tournament = await xata.db.Tournament.create({
      title,
      name,
      date,
      description: description ?? null,
      googleMapsUrl: googleMapsUrl ?? null,
      price: price ? parseFloat(price) : null,
      maxPeople: parseInt(maxPeople, 10),
      registeredPeople: registeredPeople ? parseInt(registeredPeople, 10) : 0,
      createdBy: session.user.xata_id,
    });
    return NextResponse.json({
      xata_id: tournament.xata_id,
      xata_createdat: tournament.xata_createdat,
      xata_updatedat: tournament.xata_updatedat,
      title: tournament.title,
      name: tournament.name,
      // add other fields as needed
    });
  } catch (error) {
    console.error("Failed to create tournament:", error);
    return NextResponse.json({ error: "Failed to create tournament." }, { status: 500 });
  }
} 