import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
// import { z } from "zod"; // Uncomment if you want to use zod

const prisma = new PrismaClient();

// Optional: zod schema for validation
// const TournamentUpdateSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   date: z.string().optional(),
// });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { id } = context.params;
  try {
    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete tournament." },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { id } = context.params;
  try {
    const body = await req.json();
    // const data = TournamentUpdateSchema.parse(body); // Use if validating
    const data = body; // Use this if not validating

    const tournament = await prisma.tournament.update({
      where: { id },
      data,
    });
    return NextResponse.json({ tournament });
  } catch {
    return NextResponse.json(
      { error: "Failed to update tournament." },
      { status: 500 }
    );
  }
} 