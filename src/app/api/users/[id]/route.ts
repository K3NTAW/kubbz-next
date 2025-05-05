import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
// import { z } from "zod"; // Uncomment if you want to use zod

const prisma = new PrismaClient();

// Optional: zod schema for validation
// const UserUpdateSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().optional(),
//   user_metadata: z.object({ role: z.string().optional() }).optional(),
// });

export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { id } = context.params;
  try {
    await prisma.users.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { id } = context.params;
  try {
    const body = await req.json();
    // const data = UserUpdateSchema.parse(body); // Use if validating
    const data = body; // Use this if not validating

    const user = await prisma.users.update({
      where: { id },
      data,
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 }
    );
  }
} 