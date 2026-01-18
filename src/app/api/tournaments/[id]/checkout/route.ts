import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Get tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        registrations: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Turnier nicht gefunden" },
        { status: 404 }
      );
    }

    if (tournament.status !== "OPEN") {
      return NextResponse.json(
        { error: "Anmeldung für dieses Turnier ist nicht möglich" },
        { status: 400 }
      );
    }

    if (tournament.registrations.length >= tournament.maxParticipants) {
      return NextResponse.json(
        { error: "Turnier ist bereits voll" },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_tournamentId: {
          userId: session.user.id,
          tournamentId: id,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Sie sind bereits für dieses Turnier registriert" },
        { status: 400 }
      );
    }

    // Create registration first
    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        tournamentId: id,
        teamName: body.teamName || null,
        notes: body.notes || null,
        status: "PENDING",
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        registrationId: registration.id,
        amount: tournament.price,
        status: "PENDING",
      },
    });

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: tournament.name,
              description: tournament.description || `Turnier am ${new Date(tournament.date).toLocaleDateString("de-CH")}`,
            },
            unit_amount: Math.round(tournament.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/tournament/${id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/tournament/${id}/register?canceled=true`,
      client_reference_id: registration.id,
      metadata: {
        registrationId: registration.id,
        paymentId: payment.id,
        tournamentId: id,
        userId: session.user.id,
      },
    });

    // Update payment with Stripe session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ 
      sessionId: stripeSession.id,
      url: stripeSession.url 
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Zahlungssession" },
      { status: 500 }
    );
  }
}

