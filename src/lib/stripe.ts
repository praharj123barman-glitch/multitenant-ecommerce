import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY must be set in production");
}

export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia",
});

// Platform fee percentage (5%)
export const PLATFORM_FEE_PERCENT = 5;
