import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";

export async function GET() {
  const xata = getXataClient();
  const images = await xata.db.Gallery.getAll();
  // Map to only include xata_id, xata_createdat, xata_updatedat, image.url, userId
  const result = images.map(img => ({
    xata_id: img.xata_id,
    xata_createdat: img.xata_createdat,
    xata_updatedat: img.xata_updatedat,
    imageUrl: img.image?.url ?? null,
    userId: img.userId ?? null,
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const xata = getXataClient();
  const formData = await req.formData();
  const file = formData.get("file");
  const userId = formData.get("userId") as string | undefined;
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  // Upload file to Xata
  const record = await xata.db.Gallery.create({
    userId,
    image: file,
  });
  // Return only the relevant fields
  return NextResponse.json({
    xata_id: record.xata_id,
    xata_createdat: record.xata_createdat,
    xata_updatedat: record.xata_updatedat,
    imageUrl: record.image?.url ?? null,
    userId: record.userId ?? null,
  });
} 