import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user || session.user.id !== id) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen" },
        { status: 400 }
      );
    }

    // Get existing user to check for old avatar
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { image: true },
    });

    // Delete old avatar from Vercel Blob if it exists
    if (existingUser?.image && existingUser.image.startsWith("https://")) {
      try {
        await del(existingUser.image, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (blobError) {
        console.error("Error deleting old avatar:", blobError);
        // Continue even if deletion fails
      }
    }

    // Upload to Vercel Blob
    const blob = await put(`avatars/${id}-${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Update user with image URL
    const user = await prisma.user.update({
      where: { id },
      data: { image: blob.url },
      select: {
        id: true,
        image: true,
      },
    });

    return NextResponse.json({ imageUrl: user.image });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Fehler beim Hochladen des Bildes" },
      { status: 500 }
    );
  }
}

