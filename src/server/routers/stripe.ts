import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../trpc/init";
import { TRPCError } from "@trpc/server";
import { stripe, PLATFORM_FEE_PERCENT } from "@/lib/stripe";

export const stripeRouter = createTRPCRouter({
  // Create Stripe Connect account for seller
  createConnectAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // Find user's tenant
    const tenantResult = await ctx.payload.find({
      collection: "tenants",
      where: { owner: { equals: ctx.user.id } },
      limit: 1,
    });

    if (tenantResult.docs.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Create a store first" });
    }

    const tenant = tenantResult.docs[0];

    // Check if already has a Connect account
    if (tenant.stripeConnectId) {
      throw new TRPCError({ code: "CONFLICT", message: "Stripe account already exists" });
    }

    // Create Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      email: ctx.user.email as string,
      metadata: {
        tenantId: tenant.id as string,
      },
    });

    // Save Connect account ID to tenant
    await ctx.payload.update({
      collection: "tenants",
      id: tenant.id as string,
      data: { stripeConnectId: account.id },
    });

    return { accountId: account.id };
  }),

  // Get Stripe Connect onboarding link
  getOnboardingLink: protectedProcedure.mutation(async ({ ctx }) => {
    const tenant = await getUserTenant(ctx);

    if (!tenant.stripeConnectId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No Stripe account. Create one first." });
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeConnectId as string,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?stripe=success`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  }),

  // Get Stripe Connect dashboard link (for sellers to view their earnings)
  getDashboardLink: protectedProcedure.mutation(async ({ ctx }) => {
    const tenant = await getUserTenant(ctx);

    if (!tenant.stripeConnectId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No Stripe account" });
    }

    const loginLink = await stripe.accounts.createLoginLink(
      tenant.stripeConnectId as string
    );

    return { url: loginLink.url };
  }),

  // Get Connect account status
  getConnectStatus: protectedProcedure.query(async ({ ctx }) => {
    const tenant = await getUserTenant(ctx);

    if (!tenant.stripeConnectId) {
      return { status: "not_created" as const };
    }

    const account = await stripe.accounts.retrieve(tenant.stripeConnectId as string);

    const isComplete = account.charges_enabled && account.payouts_enabled;

    // Update tenant if onboarding just completed
    if (isComplete && !tenant.stripeOnboardingComplete) {
      await ctx.payload.update({
        collection: "tenants",
        id: tenant.id as string,
        data: { stripeOnboardingComplete: true },
      });
    }

    return {
      status: isComplete ? ("complete" as const) : ("incomplete" as const),
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };
  }),

  // Create checkout session for buying products
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            tenantId: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.items.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
      }

      // Group items by tenant for split payments
      const groupedByTenant: Record<string, { tenantDoc: Record<string, unknown>; products: Array<Record<string, unknown>> }> = {};

      for (const item of input.items) {
        // Fetch product
        const product = await ctx.payload.findByID({
          collection: "products",
          id: item.productId,
          depth: 1,
        });

        // Fetch tenant
        const tenant = await ctx.payload.findByID({
          collection: "tenants",
          id: item.tenantId,
          depth: 0,
        });

        if (!tenant.stripeConnectId || !tenant.stripeOnboardingComplete) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Store "${tenant.name}" hasn't set up payments yet`,
          });
        }

        if (!groupedByTenant[item.tenantId]) {
          groupedByTenant[item.tenantId] = { tenantDoc: tenant, products: [] };
        }
        groupedByTenant[item.tenantId].products.push(product);
      }

      // For simplicity, create one checkout session
      // In production, you'd handle multi-seller split differently
      const lineItems: Array<{
        price_data: {
          currency: string;
          product_data: { name: string; description?: string };
          unit_amount: number;
        };
        quantity: number;
      }> = [];

      let totalAmount = 0;

      for (const group of Object.values(groupedByTenant)) {
        for (const product of group.products) {
          const price = product.price as number;
          totalAmount += price;

          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name as string,
                description: (product.shortDescription as string) || undefined,
              },
              unit_amount: price,
            },
            quantity: 1,
          });
        }
      }

      const platformFee = Math.round(totalAmount * (PLATFORM_FEE_PERCENT / 100));

      // Get first tenant's Connect account for payment (simplified)
      const firstGroup = Object.values(groupedByTenant)[0];
      const connectAccountId = firstGroup.tenantDoc.stripeConnectId as string;

      // Create order in database
      const order = await ctx.payload.create({
        collection: "orders",
        data: {
          customer: ctx.user.id as string,
          items: input.items.map((item) => {
            const group = groupedByTenant[item.tenantId];
            const product = group.products.find((p) => (p.id as string) === item.productId)!;
            return {
              product: item.productId,
              tenant: item.tenantId,
              price: product.price as number,
            };
          }),
          total: totalAmount,
          status: "pending",
        },
      });

      // Create Stripe Checkout Session with Connect
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: {
          orderId: order.id as string,
        },
        payment_intent_data: {
          application_fee_amount: platformFee,
          transfer_data: {
            destination: connectAccountId,
          },
        },
      });

      // Save checkout session ID to order
      await ctx.payload.update({
        collection: "orders",
        id: order.id as string,
        data: { stripeCheckoutSessionId: session.id },
      });

      return { sessionId: session.id, url: session.url };
    }),
});

async function getUserTenant(ctx: { payload: { find: Function }; user: { id: unknown } }) {
  const result = await ctx.payload.find({
    collection: "tenants",
    where: { owner: { equals: ctx.user.id } },
    limit: 1,
  });

  if (result.docs.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "You don't have a store" });
  }

  return result.docs[0];
}
