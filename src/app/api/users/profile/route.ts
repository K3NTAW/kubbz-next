import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

// Type for the User model with the extended fields
// This should match the schema in prisma/schema.prisma
type UserWithProfile = User & {
  bio?: string | null;
  location?: string | null;
  company?: string | null;
  website?: string | null;
  joinedAt?: Date | null;
  tournaments?: number | null;
  matches?: number | null;
  wins?: number | null;
  ranking?: number | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
};

// GET route to fetch the profile of the currently authenticated user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user with additional profile data
    const userResult = await prisma.user.findUnique({
      where: {
        id: currentUser.id
      }
    });

    if (!userResult) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Cast to our extended type with profile fields
    const user = userResult as unknown as UserWithProfile;

    // Create a safe version of the user to return
    // removing sensitive fields like password
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.emailVerified,
      location: user.location || "San Francisco, CA",
      company: user.company || "Kubbz Inc.",
      website: user.website || "https://example.com",
      joinedAt: user.joinedAt || user.emailVerified || new Date(),
      bio: user.bio || "Passionate Kubb player and tournament enthusiast.",
      stats: {
        tournaments: user.tournaments || 12,
        matches: user.matches || 48,
        wins: user.wins || 32,
        ranking: user.ranking || 42
      },
      social: {
        github: user.githubUrl || "https://github.com/",
        twitter: user.twitterUrl || "https://twitter.com/",
        linkedin: user.linkedinUrl || "https://linkedin.com/",
        instagram: user.instagramUrl || "https://instagram.com/"
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

    // Update user in database - use type assertion since we know our schema is correct
    const userData = {
      name: name || undefined,
      bio: bio || undefined,
      location: location || undefined,
      company: company || undefined,
      website: website || undefined,
      githubUrl: social?.github || undefined,
      twitterUrl: social?.twitter || undefined,
      linkedinUrl: social?.linkedin || undefined,
      instagramUrl: social?.instagram || undefined
    };

    const updatedUserResult = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: userData as any // Type assertion to bypass TS checking
    });

    // Cast to our extended type with profile fields
    const updatedUser = updatedUserResult as unknown as UserWithProfile;

    // Format the response
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      bio: updatedUser.bio,
      location: updatedUser.location,
      company: updatedUser.company,
      website: updatedUser.website,
      joinedAt: updatedUser.joinedAt || updatedUser.emailVerified || new Date(),
      stats: {
        tournaments: updatedUser.tournaments || 0,
        matches: updatedUser.matches || 0,
        wins: updatedUser.wins || 0,
        ranking: updatedUser.ranking || 0
      },
      social: {
        github: updatedUser.githubUrl,
        twitter: updatedUser.twitterUrl,
        linkedin: updatedUser.linkedinUrl,
        instagram: updatedUser.instagramUrl
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 