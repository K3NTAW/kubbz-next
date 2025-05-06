import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";


export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const prisma = new PrismaClient();
  const { id: tournamentId, registrationId } = context.params;
  try {
    // Find the registration to get the tournamentId (for safety)
    const registration = await prisma.tournamentRegistration.findUnique({
      where: { id: registrationId },
    });
    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }
    // Delete the registration
    await prisma.tournamentRegistration.delete({ where: { id: registrationId } });
    // Decrement registeredPeople for the tournament
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { registeredPeople: { decrement: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete registration." }, { status: 500 });
  }
} 