import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET route to fetch the profile of the currently authenticated user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user with additional profile data
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create a safe version of the user to return
    // removing sensitive fields like password
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.emailVerified,
      // Add fake data for demonstration purposes
      // In a real app, these would come from your database
      location: "San Francisco, CA",
      company: "Kubbz Inc.",
      website: "https://example.com",
      joinedAt: user.emailVerified || new Date(),
      bio: "Passionate Kubb player and tournament enthusiast.",
      stats: {
        tournaments: 12,
        matches: 48,
        wins: 32,
        ranking: 42
      },
      social: {
        github: "https://github.com/",
        twitter: "https://twitter.com/",
        linkedin: "https://linkedin.com/",
        instagram: "https://instagram.com/"
      }
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH route to update the profile of the currently authenticated user
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, bio, location, company, website, social } = body;

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        name: name || undefined,
        // Add fields for bio, location, etc. once we extend the schema
      }
    });

    // For now, return a response with both database fields and 
    // the additional fields we're planning to add to the schema
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      bio,
      location,
      company,
      website,
      social
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 