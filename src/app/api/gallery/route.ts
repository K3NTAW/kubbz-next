import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Galerie" },
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

