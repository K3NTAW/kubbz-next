import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get payment and registration
        const payment = await prisma.payment.findUnique({
          where: { stripeSessionId: session.id },
          include: { registration: true },
        });

        if (payment) {
          // Get receipt URL from invoice if available
          let receiptUrl: string | null = null;
          if (session.invoice) {
            if (typeof session.invoice === "string") {
              // If invoice is just an ID, fetch the invoice object
              try {
                const invoice = await stripe.invoices.retrieve(session.invoice);
                receiptUrl = invoice.hosted_invoice_url || null;
              } catch (err) {
                console.error("Error fetching invoice:", err);
              }
            } else {
              // Invoice is already expanded
              receiptUrl = session.invoice.hosted_invoice_url || null;
            }
          }

          // Update payment status
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              stripePaymentId: session.payment_intent as string,
              receiptUrl,
            },
          });

          // Update registration status to CONFIRMED
          await prisma.registration.update({
            where: { id: payment.registrationId },
            data: { status: "CONFIRMED" },
          });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentId: paymentIntent.id },
          include: { registration: true },
        });

        if (payment && payment.status !== "COMPLETED") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED" },
          });

          await prisma.registration.update({
            where: { id: payment.registrationId },
            data: { status: "CONFIRMED" },
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentId: paymentIntent.id },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentId: charge.payment_intent as string },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "REFUNDED" },
          });

          // Optionally cancel registration on refund
          await prisma.registration.update({
            where: { id: payment.registrationId },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

