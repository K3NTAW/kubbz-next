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

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { stripePaymentId } = body;

    if (!stripePaymentId) {
      return NextResponse.json(
        { error: "Stripe Payment ID ist erforderlich" },
        { status: 400 }
      );
    }

    // Get payment
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { registration: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Zahlung nicht gefunden" },
        { status: 404 }
      );
    }

    if (payment.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Nur abgeschlossene Zahlungen können erstattet werden" },
        { status: 400 }
      );
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: stripePaymentId,
    });

    // Update payment status
    await prisma.payment.update({
      where: { id },
      data: { status: "REFUNDED" },
    });

    // Cancel registration
    await prisma.registration.update({
      where: { id: payment.registrationId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ 
      success: true,
      refundId: refund.id 
    });
  } catch (error: any) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { error: error.message || "Fehler beim Erstatten" },
      { status: 500 }
    );
  }
}

