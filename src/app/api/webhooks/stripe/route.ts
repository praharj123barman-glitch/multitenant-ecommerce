import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — rejecting webhook");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = await getPayload({ config });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Idempotency: check if order is already paid
        const order = await payload.findByID({
          collection: "orders",
          id: orderId,
          depth: 0,
        });

        if ((order.status as string) === "paid") {
          // Already processed — skip
          break;
        }

        // Update order status to paid
        await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            status: "paid",
            stripePaymentIntentId: session.payment_intent,
          },
        });

        // Update product sales counts
        const items = order.items as Array<{ product: string }>;
        for (const item of items) {
          const productId = typeof item.product === "object"
            ? (item.product as Record<string, unknown>).id as string
            : item.product;

          // Use a fresh read + update to minimize race window
          const product = await payload.findByID({
            collection: "products",
            id: productId,
            depth: 0,
          });

          await payload.update({
            collection: "products",
            id: productId,
            data: {
              salesCount: ((product.salesCount as number) || 0) + 1,
            },
          });
        }
      }
      break;
    }

    case "account.updated": {
      // Stripe Connect account updated (onboarding completed)
      const account = event.data.object;

      if (account.charges_enabled && account.payouts_enabled) {
        const tenantResult = await payload.find({
          collection: "tenants",
          where: { stripeConnectId: { equals: account.id } },
          limit: 1,
        });

        if (tenantResult.docs[0]) {
          await payload.update({
            collection: "tenants",
            id: tenantResult.docs[0].id as string,
            data: { stripeOnboardingComplete: true },
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
