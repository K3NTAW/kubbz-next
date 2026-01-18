import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const images = await prisma.galleryImage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Error fetching gallery images:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    return NextResponse.json(
      { 
        error: "Fehler beim Laden der Galerie",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, title, description, tournamentId } = body;

    const image = await prisma.galleryImage.create({
      data: {
        url,
        title: title || null,
        description: description || null,
        tournamentId: tournamentId || null,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Bildes" },
      { status: 500 }
    );
  }
}

