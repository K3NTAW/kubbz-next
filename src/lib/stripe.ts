import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// Note: Webhook API version (2025-12-15.clover) is independent from SDK API version
// The SDK will use its default version, while webhooks use the version you configured
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

