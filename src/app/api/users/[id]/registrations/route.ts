import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // Users can only view their own registrations unless they're admin
    if (!session?.user || (session.user.id !== id && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: id },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
            price: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Anmeldungen" },
      { status: 500 }
    );
  }
}

