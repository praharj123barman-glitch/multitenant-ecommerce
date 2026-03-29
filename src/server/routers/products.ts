import { z } from "zod/v4";
import type { Where } from "payload";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../trpc/init";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  // Public: list products with filters
  list: baseProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        sort: z.enum(["newest", "oldest", "price-asc", "price-desc", "trending"]).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        tenantId: z.string().optional(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(50).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page || 1;
      const limit = input?.limit || 12;

      const where: Where = {
        status: { equals: "active" },
      };

      if (input?.category) {
        // Find category by slug first
        const cat = await ctx.payload.find({
          collection: "categories",
          where: { slug: { equals: input.category } },
          limit: 1,
        });
        if (cat.docs[0]) {
          where.category = { equals: cat.docs[0].id };
        }
      }

      if (input?.search) {
        where.name = { contains: input.search };
      }

      if (input?.minPrice !== undefined || input?.maxPrice !== undefined) {
        where.price = {
          ...(input?.minPrice !== undefined ? { greater_than_equal: input.minPrice } : {}),
          ...(input?.maxPrice !== undefined ? { less_than_equal: input.maxPrice } : {}),
        };
      }

      if (input?.tenantId) {
        where.tenant = { equals: input.tenantId };
      }

      let sort = "-createdAt";
      switch (input?.sort) {
        case "oldest": sort = "createdAt"; break;
        case "price-asc": sort = "price"; break;
        case "price-desc": sort = "-price"; break;
        case "trending": sort = "-salesCount"; break;
      }

      const result = await ctx.payload.find({
        collection: "products",
        where,
        sort,
        page,
        limit,
        depth: 2,
      });

      return {
        products: result.docs.map((doc) => formatProduct(doc)),
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page || 1,
        hasNextPage: result.hasNextPage,
      };
    }),

  // Public: get single product by slug
  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.payload.find({
        collection: "products",
        where: { slug: { equals: input.slug } },
        limit: 1,
        depth: 2,
      });

      const doc = result.docs[0];
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      return formatProduct(doc);
    }),

  // Protected: create product (sellers only)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        shortDescription: z.string().optional(),
        price: z.number().min(0),
        compareAtPrice: z.number().optional(),
        categoryId: z.string(),
        imageIds: z.array(z.string()).optional(),
        status: z.enum(["draft", "active"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find the user's tenant
      const tenantResult = await ctx.payload.find({
        collection: "tenants",
        where: { owner: { equals: ctx.user.id } },
        limit: 1,
      });

      if (tenantResult.docs.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You need to create a store first" });
      }

      const product = await ctx.payload.create({
        collection: "products",
        data: {
          name: input.name,
          slug: input.slug,
          shortDescription: input.shortDescription || "",
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          category: input.categoryId,
          images: input.imageIds?.map((id) => ({ image: id })) || [],
          tenant: tenantResult.docs[0].id as string,
          status: input.status || "draft",
        },
      });

      return { id: product.id };
    }),

  // Protected: update product
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        shortDescription: z.string().optional(),
        price: z.number().min(0).optional(),
        compareAtPrice: z.number().optional(),
        categoryId: z.string().optional(),
        imageIds: z.array(z.string()).optional(),
        status: z.enum(["draft", "active", "archived"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existing = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
      });

      const tenant = typeof existing.tenant === "object"
        ? (existing.tenant as Record<string, unknown>)
        : null;
      const tenantOwnerId = tenant
        ? (tenant.owner && typeof tenant.owner === "object"
          ? (tenant.owner as Record<string, unknown>).id
          : tenant.owner)
        : null;

      // If tenant wasn't populated, look it up
      let ownerId = tenantOwnerId;
      if (!ownerId) {
        const tenantId = typeof existing.tenant === "object"
          ? (existing.tenant as Record<string, unknown>).id as string
          : existing.tenant as string;
        const tenantDoc = await ctx.payload.findByID({
          collection: "tenants",
          id: tenantId,
          depth: 0,
        });
        ownerId = tenantDoc.owner;
      }

      if (ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your product" });
      }

      const data: Record<string, unknown> = {};
      if (input.name) data.name = input.name;
      if (input.shortDescription !== undefined) data.shortDescription = input.shortDescription;
      if (input.price !== undefined) data.price = input.price;
      if (input.compareAtPrice !== undefined) data.compareAtPrice = input.compareAtPrice;
      if (input.categoryId) data.category = input.categoryId;
      if (input.imageIds) data.images = input.imageIds.map((id) => ({ image: id }));
      if (input.status) data.status = input.status;

      await ctx.payload.update({
        collection: "products",
        id: input.id,
        data,
      });

      return { success: true };
    }),

  // Protected: delete product
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
      });

      // Look up tenant to verify ownership via owner field
      const tenantId = typeof existing.tenant === "object"
        ? (existing.tenant as Record<string, unknown>).id as string
        : existing.tenant as string;
      const tenantDoc = await ctx.payload.findByID({
        collection: "tenants",
        id: tenantId,
        depth: 0,
      });
      const ownerId = typeof tenantDoc.owner === "object"
        ? (tenantDoc.owner as Record<string, unknown>).id
        : tenantDoc.owner;

      if (ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your product" });
      }

      await ctx.payload.delete({
        collection: "products",
        id: input.id,
      });

      return { success: true };
    }),

  // Protected: get seller's own products
  myProducts: protectedProcedure.query(async ({ ctx }) => {
    // First find the user's tenant
    const tenantResult = await ctx.payload.find({
      collection: "tenants",
      where: { owner: { equals: ctx.user.id } },
      limit: 1,
      depth: 0,
    });

    if (tenantResult.docs.length === 0) {
      return [];
    }

    const result = await ctx.payload.find({
      collection: "products",
      where: { tenant: { equals: tenantResult.docs[0].id } },
      sort: "-createdAt",
      depth: 2,
    });

    return result.docs.map((doc) => formatProduct(doc));
  }),
});

// Helper to format product doc into a clean typed object
function formatProduct(doc: Record<string, unknown>) {
  const category = doc.category as Record<string, unknown> | string | null;
  const tenant = doc.tenant as Record<string, unknown> | string | null;
  const images = (doc.images as Array<Record<string, unknown>>) || [];

  return {
    id: doc.id as string,
    name: doc.name as string,
    slug: doc.slug as string,
    shortDescription: (doc.shortDescription as string) || null,
    price: doc.price as number,
    compareAtPrice: (doc.compareAtPrice as number) || null,
    status: doc.status as string,
    category: category && typeof category === "object"
      ? {
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
        }
      : null,
    images: images.map((img) => {
      const media = img.image as Record<string, unknown> | null;
      return media
        ? {
            url: media.url as string,
            alt: (media.alt as string) || "",
          }
        : null;
    }).filter(Boolean),
    tenant: tenant && typeof tenant === "object"
      ? {
          id: tenant.id as string,
          name: (tenant.name as string) || (tenant.email as string),
          slug: (tenant.slug as string) || "",
        }
      : null,
    averageRating: (doc.averageRating as number) || 0,
    reviewCount: (doc.reviewCount as number) || 0,
    salesCount: (doc.salesCount as number) || 0,
    createdAt: doc.createdAt as string,
  };
}
