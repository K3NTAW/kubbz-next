import { NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function GET() {
  const xata = getXataClient();
  const users = await xata.db.users.getAll();
  // Optionally map to only include fields you want
  return NextResponse.json(users.map(u => ({
    xata_id: u.xata_id,
    name: u.name,
    email: u.email,
    user_metadata: u.user_metadata,
  })));
} 