import { z } from "zod/v4";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../trpc/init";
import { TRPCError } from "@trpc/server";

export const tenantsRouter = createTRPCRouter({
  // Public: get tenant by slug (storefront)
  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.payload.find({
        collection: "tenants",
        where: { slug: { equals: input.slug } },
        limit: 1,
        depth: 2,
      });

      const doc = result.docs[0];
      if (!doc) return null;

      return formatTenant(doc);
    }),

  // Public: get tenant by ID
  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.payload.findByID({
        collection: "tenants",
        id: input.id,
        depth: 2,
      });

      return formatTenant(doc);
    }),

  // Protected: create a tenant (become a seller)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already has a store
      const existing = await ctx.payload.find({
        collection: "tenants",
        where: { owner: { equals: ctx.user.id } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a store",
        });
      }

      // Check slug availability
      const slugCheck = await ctx.payload.find({
        collection: "tenants",
        where: { slug: { equals: input.slug } },
        limit: 1,
      });

      if (slugCheck.docs.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This store URL is already taken",
        });
      }

      const tenant = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description || "",
          owner: ctx.user.id as string,
        },
      });

      // Update user role to seller
      await ctx.payload.update({
        collection: "users",
        id: ctx.user.id as string,
        data: { role: "seller" },
      });

      return { id: tenant.id, slug: tenant.slug };
    }),

  // Protected: update tenant settings
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().max(500).optional(),
        logoId: z.string().optional(),
        bannerId: z.string().optional(),
        socialLinks: z.object({
          website: z.string().optional(),
          twitter: z.string().optional(),
          instagram: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = await findUserTenant(ctx);

      const data: Record<string, unknown> = {};
      if (input.name) data.name = input.name;
      if (input.description !== undefined) data.description = input.description;
      if (input.logoId) data.logo = input.logoId;
      if (input.bannerId) data.banner = input.bannerId;
      if (input.socialLinks) data.socialLinks = input.socialLinks;

      await ctx.payload.update({
        collection: "tenants",
        id: tenant.id as string,
        data,
      });

      return { success: true };
    }),

  // Protected: get current user's tenant
  myTenant: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.payload.find({
      collection: "tenants",
      where: { owner: { equals: ctx.user.id } },
      limit: 1,
      depth: 2,
    });

    const doc = result.docs[0];
    if (!doc) return null;

    return formatTenant(doc);
  }),

  // Public: list featured/all tenants
  list: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional(),
        page: z.number().min(1).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.payload.find({
        collection: "tenants",
        limit: input?.limit || 12,
        page: input?.page || 1,
        depth: 2,
        sort: "-createdAt",
      });

      return {
        tenants: result.docs.map((doc) => formatTenant(doc)),
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
      };
    }),
});

async function findUserTenant(ctx: { payload: { find: Function }; user: { id: unknown } }) {
  const result = await ctx.payload.find({
    collection: "tenants",
    where: { owner: { equals: ctx.user.id } },
    limit: 1,
  });

  if (result.docs.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "You don't have a store yet",
    });
  }

  return result.docs[0];
}

function formatTenant(doc: Record<string, unknown>) {
  const owner = doc.owner as Record<string, unknown> | string | null;
  const logo = doc.logo as Record<string, unknown> | null;
  const banner = doc.banner as Record<string, unknown> | null;
  const socialLinks = doc.socialLinks as Record<string, unknown> | null;

  return {
    id: doc.id as string,
    name: doc.name as string,
    slug: doc.slug as string,
    description: (doc.description as string) || null,
    logo: logo ? { url: logo.url as string, alt: (logo.alt as string) || "" } : null,
    banner: banner ? { url: banner.url as string, alt: (banner.alt as string) || "" } : null,
    owner: owner && typeof owner === "object"
      ? { id: owner.id as string, name: (owner.name as string) || (owner.email as string) }
      : null,
    stripeOnboardingComplete: (doc.stripeOnboardingComplete as boolean) || false,
    verified: (doc.verified as boolean) || false,
    socialLinks: socialLinks
      ? {
          website: (socialLinks.website as string) || null,
          twitter: (socialLinks.twitter as string) || null,
          instagram: (socialLinks.instagram as string) || null,
        }
      : null,
    createdAt: doc.createdAt as string,
  };
}
