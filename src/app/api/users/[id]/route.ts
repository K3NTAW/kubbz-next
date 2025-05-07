import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
// import { z } from "zod"; // Uncomment if you want to use zod

// Optional: zod schema for validation
// const UserUpdateSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().optional(),
//   user_metadata: z.object({ role: z.string().optional() }).optional(),
// });

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const xata = getXataClient();
  const { id: xata_id } = context.params;
  try {
    await xata.db.users.delete(xata_id);
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
  context: { params: { id: string } }
) {
  const xata = getXataClient();
  const { id: xata_id } = context.params;
  try {
    const body = await req.json();
    // const data = UserUpdateSchema.parse(body); // Use if validating
    const user = await xata.db.users.update(xata_id, body);
    return NextResponse.json({
      user: {
        xata_id: user?.xata_id,
        xata_createdat: user?.xata_createdat,
        xata_updatedat: user?.xata_updatedat,
        name: user?.name ?? null,
        email: user?.email ?? null,
        // add other fields as needed
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 }
    );
  }
} 