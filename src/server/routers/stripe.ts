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

      // Batch fetch all unique products and tenants to avoid N+1
      const uniqueProductIds = [...new Set(input.items.map((i) => i.productId))];
      const uniqueTenantIds = [...new Set(input.items.map((i) => i.tenantId))];

      const [productsResult, tenantsResult] = await Promise.all([
        ctx.payload.find({
          collection: "products",
          where: { id: { in: uniqueProductIds } },
          limit: uniqueProductIds.length,
          depth: 1,
        }),
        ctx.payload.find({
          collection: "tenants",
          where: { id: { in: uniqueTenantIds } },
          limit: uniqueTenantIds.length,
          depth: 0,
        }),
      ]);

      const productsMap = new Map(
        productsResult.docs.map((doc) => [doc.id as string, doc])
      );
      const tenantsMap = new Map(
        tenantsResult.docs.map((doc) => [doc.id as string, doc])
      );

      // Validate all tenants have Stripe setup
      for (const tenantId of uniqueTenantIds) {
        const tenant = tenantsMap.get(tenantId);
        if (!tenant) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Store not found` });
        }
        if (!tenant.stripeConnectId || !tenant.stripeOnboardingComplete) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Store "${tenant.name}" hasn't set up payments yet`,
          });
        }
      }

      // Group items by tenant for split payments
      const groupedByTenant: Record<string, {
        tenantDoc: Record<string, unknown>;
        products: Array<Record<string, unknown>>;
      }> = {};

      for (const item of input.items) {
        const product = productsMap.get(item.productId);
        if (!product) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Product not found" });
        }

        if (!groupedByTenant[item.tenantId]) {
          groupedByTenant[item.tenantId] = {
            tenantDoc: tenantsMap.get(item.tenantId)!,
            products: [],
          };
        }
        groupedByTenant[item.tenantId].products.push(product);
      }

      const tenantIds = Object.keys(groupedByTenant);
      const isSingleSeller = tenantIds.length === 1;

      // Build line items
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

      // Create order in database first
      const order = await ctx.payload.create({
        collection: "orders",
        data: {
          customer: ctx.user.id as string,
          items: input.items.map((item) => {
            const product = productsMap.get(item.productId)!;
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

      try {
        // For single-seller carts: use Stripe Connect direct charge with transfer
        // For multi-seller carts: use separate transfers after payment
        const sessionConfig: Record<string, unknown> = {
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
          metadata: {
            orderId: order.id as string,
          },
        };

        if (isSingleSeller) {
          // Single seller: direct transfer
          const connectAccountId = groupedByTenant[tenantIds[0]].tenantDoc.stripeConnectId as string;
          const platformFee = Math.round(totalAmount * (PLATFORM_FEE_PERCENT / 100));
          sessionConfig.payment_intent_data = {
            application_fee_amount: platformFee,
            transfer_data: {
              destination: connectAccountId,
            },
          };
        } else {
          // Multi-seller: use transfer_group and create separate transfers in webhook
          const transferGroup = `order_${order.id}`;
          sessionConfig.payment_intent_data = {
            transfer_group: transferGroup,
          };
          // Store transfer details in order metadata for webhook processing
          sessionConfig.metadata = {
            ...sessionConfig.metadata as Record<string, string>,
            transferGroup,
            sellerSplits: JSON.stringify(
              tenantIds.map((tenantId) => {
                const group = groupedByTenant[tenantId];
                const sellerTotal = group.products.reduce(
                  (sum, p) => sum + (p.price as number), 0
                );
                const sellerFee = Math.round(sellerTotal * (PLATFORM_FEE_PERCENT / 100));
                return {
                  tenantId,
                  connectAccountId: group.tenantDoc.stripeConnectId as string,
                  amount: sellerTotal - sellerFee,
                };
              })
            ),
          };
        }

        const session = await stripe.checkout.sessions.create(
          sessionConfig as Parameters<typeof stripe.checkout.sessions.create>[0]
        );

        // Save checkout session ID to order
        await ctx.payload.update({
          collection: "orders",
          id: order.id as string,
          data: { stripeCheckoutSessionId: session.id },
        });

        return { sessionId: session.id, url: session.url };
      } catch (err) {
        // Clean up the pending order if Stripe fails
        await ctx.payload.delete({
          collection: "orders",
          id: order.id as string,
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),
});

async function getUserTenant(ctx: { payload: { find: (...args: unknown[]) => Promise<{ docs: Record<string, unknown>[] }> }; user: { id: unknown } }) {
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
