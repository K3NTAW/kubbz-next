# Stripe Payment Integration Setup

## Overview

The website now includes full Stripe payment integration for tournament registrations. Users must pay the tournament price before their registration is confirmed.

## Environment Variables Required

Add these to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key (use sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret from Stripe dashboard
NEXTAUTH_URL=http://localhost:3000 # Your app URL (update for production)
```

## Stripe Dashboard Setup

1. **Get API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Copy your **Publishable key** (if needed for client-side, currently not used)

2. **Set up Webhook:**
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
   - Select events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copy the **Signing secret** (starts with `whsec_`)

## How It Works

### Registration Flow

1. User fills out registration form
2. Clicks "Zur Zahlung" button
3. System creates:
   - Registration record (status: PENDING)
   - Payment record (status: PENDING)
   - Stripe Checkout Session
4. User is redirected to Stripe Checkout
5. After payment:
   - Stripe webhook updates payment status to COMPLETED
   - Registration status changes to CONFIRMED
   - User is redirected back to tournament page

### Admin Payment Management

The admin dashboard now includes a "Zahlungen" (Payments) tab where you can:

- View all payments with status, amount, user, and tournament
- See total revenue from completed payments
- Search payments by user, tournament, or Stripe ID
- Process refunds (which automatically cancel the registration)

### Payment Statuses

- **PENDING**: Payment session created, awaiting payment
- **COMPLETED**: Payment successful, registration confirmed
- **FAILED**: Payment failed
- **REFUNDED**: Payment refunded, registration cancelled

## API Endpoints

- `POST /api/tournaments/[id]/checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhook events (public, secured by signature)
- `GET /api/payments` - Get all payments (admin only)
- `POST /api/payments/[id]/refund` - Process refund (admin only)

## Testing

For testing, use Stripe test mode:
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC
- Use test API keys (start with `sk_test_`)

## Production Checklist

- [ ] Switch to live Stripe API keys
- [ ] Set up production webhook endpoint
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Test payment flow end-to-end
- [ ] Test refund functionality
- [ ] Verify webhook events are being received

