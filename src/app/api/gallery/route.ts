import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export const config = {
  api: {
    bodyParser: false, // Disables Next.js default body parsing
  },
};

export async function GET() {
  const xata = getXataClient();
  const images = await xata.db.gallery.select(["xata_id", "image", "xata_id", "tournament_id"]).getAll();
  console.log("Fetched images from Xata:", images);
  // Map to include image URL
  const result = images.map(img => ({
    xata_id: img.xata_id,
    image_url: img.image?.url ?? null,
    tournament_id: img.tournament_id,
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Explicitly type session.user to include xata_id for this route
  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null; is_admin?: boolean; xata_id?: string };

  if (!session || !user?.xata_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userXataId = user.xata_id; // Now this should be fine

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64Content = Buffer.from(arrayBuffer).toString("base64");

  const tournament_id = formData.get("tournament_id") as string | null;
  const xata = getXataClient();
  try {
    const record = await xata.db.gallery.create({
      image: {
        name: file.name,
        mediaType: file.type,
        base64Content,
        enablePublicUrl: true,
      },
      user_id: userXataId, // Store the uploading user's ID
      tournament_id: tournament_id || undefined, // Use undefined for optional links
      // Xata will auto-generate the primary key (xata_id for this table)
    });
    return NextResponse.json({
      id: record.id, // Prefer sending back the actual record id
      xata_id: record.xata_id, // Keep for consistency if frontend expects it
      image_url: record.image?.url ?? null,
      tournament_id: record.tournament_id,
    });
  } catch (error) {
    console.error("Error creating gallery record:", error);
    return NextResponse.json({ error: "Failed to create gallery record" }, { status: 500 });
  }
} 