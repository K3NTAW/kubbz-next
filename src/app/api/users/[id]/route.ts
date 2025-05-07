import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/xata";
// import { z } from "zod"; // Uncomment if you want to use zod

// Optional: zod schema for validation
// const UserUpdateSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().optional(),
//   user_metadata: z.object({ role: z.string().optional() }).optional(),
// });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: { params: any }) {
  const awaitedParams = await params;
  const id = awaitedParams.id;
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }
  const xata = getXataClient();
  try {
    const user = await xata.db.users.read(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const awaitedParams = await params;
  const id = awaitedParams.id;
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }
  const xata = getXataClient();
  try {
    await xata.db.users.delete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: { params: any }) {
  const awaitedParams = await params;
  const id = awaitedParams.id;
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }
  const xata = getXataClient();
  try {
    const body = await req.json();
    // const data = UserUpdateSchema.parse(body); // Use if validating
    const user = await xata.db.users.update(id, body);
    return NextResponse.json({
      user: {
        ...user,
        xata_id: user?.xata_id || user?.id,
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 }
    );
  }
} 