import { NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function GET() {
  const xata = getXataClient();
  const users = await xata.db.users.getAll();
  const result = users.map(user => ({
    xata_id: user.xata_id,
    xata_createdat: user.xata_createdat,
    xata_updatedat: user.xata_updatedat,
    name: user.name ?? null,
    email: user.email ?? null,
    // add other fields as needed
  }));
  return NextResponse.json(result);
} 