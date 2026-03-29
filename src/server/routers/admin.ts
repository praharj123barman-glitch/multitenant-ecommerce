import { z } from "zod/v4";
import type { Where } from "payload";
import { createTRPCRouter, protectedProcedure } from "../trpc/init";
import { TRPCError } from "@trpc/server";

// Middleware: require admin role
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = (ctx.user as Record<string, unknown>).role as string;
  if (role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const adminRouter = createTRPCRouter({
  // Platform-wide statistics
  stats: adminProcedure.query(async ({ ctx }) => {
    const [tenants, users, products, orders] = await Promise.all([
      ctx.payload.find({ collection: "tenants", limit: 0 }),
      ctx.payload.find({ collection: "users", limit: 0 }),
      ctx.payload.find({ collection: "products", limit: 0 }),
      ctx.payload.find({
        collection: "orders",
        limit: 0,
        where: { status: { equals: "paid" } },
      }),
    ]);

    // Calculate total revenue from paid orders
    const paidOrders = await ctx.payload.find({
      collection: "orders",
      where: { status: { equals: "paid" } },
      limit: 1000,
    });
    const totalRevenue = paidOrders.docs.reduce(
      (sum, order) => sum + ((order.total as number) || 0),
      0
    );

    // Count verified tenants
    const verifiedTenants = await ctx.payload.find({
      collection: "tenants",
      where: { verified: { equals: true } },
      limit: 0,
    });

    return {
      totalTenants: tenants.totalDocs,
      totalUsers: users.totalDocs,
      totalProducts: products.totalDocs,
      totalOrders: orders.totalDocs,
      totalRevenue,
      verifiedTenants: verifiedTenants.totalDocs,
    };
  }),

  // List tenants for management table
  tenants: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
        search: z.string().optional(),
        verified: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions: Where[] = [];

      if (input?.search) {
        conditions.push({
          or: [
            { name: { like: input.search } },
            { slug: { like: input.search } },
          ],
        });
      }

      if (input?.verified !== undefined) {
        conditions.push({ verified: { equals: input.verified } });
      }

      const where: Where =
        conditions.length > 1
          ? { and: conditions }
          : conditions[0] || {};

      const result = await ctx.payload.find({
        collection: "tenants",
        where,
        limit: input?.limit || 10,
        page: input?.page || 1,
        depth: 2,
        sort: "-createdAt",
      });

      // Get product counts and order stats per tenant
      const tenantsWithStats = await Promise.all(
        result.docs.map(async (doc) => {
          const [productResult, orderResult] = await Promise.all([
            ctx.payload.find({
              collection: "products",
              where: { tenant: { equals: doc.id } },
              limit: 0,
            }),
            ctx.payload.find({
              collection: "orders",
              where: {
                "items.tenant": { equals: doc.id },
                status: { equals: "paid" },
              },
              limit: 0,
            }),
          ]);

          const owner = doc.owner as Record<string, unknown> | string | null;

          return {
            id: doc.id as string,
            name: doc.name as string,
            slug: doc.slug as string,
            description: (doc.description as string) || null,
            verified: (doc.verified as boolean) || false,
            stripeOnboardingComplete:
              (doc.stripeOnboardingComplete as boolean) || false,
            owner:
              owner && typeof owner === "object"
                ? {
                    id: owner.id as string,
                    name: (owner.name as string) || (owner.email as string),
                    email: owner.email as string,
                  }
                : null,
            productCount: productResult.totalDocs,
            orderCount: orderResult.totalDocs,
            createdAt: doc.createdAt as string,
          };
        })
      );

      return {
        tenants: tenantsWithStats,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      };
    }),

  // Toggle tenant verified status
  toggleVerified: adminProcedure
    .input(z.object({ tenantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await ctx.payload.findByID({
        collection: "tenants",
        id: input.tenantId,
      });

      await ctx.payload.update({
        collection: "tenants",
        id: input.tenantId,
        data: { verified: !tenant.verified },
      });

      return { verified: !tenant.verified };
    }),

  // Delete a tenant
  deleteTenant: adminProcedure
    .input(z.object({ tenantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.payload.delete({
        collection: "tenants",
        id: input.tenantId,
      });

      return { success: true };
    }),
});
