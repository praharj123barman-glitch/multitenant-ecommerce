import { z } from "zod/v4";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../trpc/init";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
  // Public: get reviews for a product
  getByProduct: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(50).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.payload.find({
        collection: "reviews",
        where: { product: { equals: input.productId } },
        sort: "-createdAt",
        page: input.page || 1,
        limit: input.limit || 10,
        depth: 1,
      });

      return {
        reviews: result.docs.map((doc) => formatReview(doc)),
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
      };
    }),

  // Public: get aggregate stats for a product
  getStats: baseProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const allReviews = await ctx.payload.find({
        collection: "reviews",
        where: { product: { equals: input.productId } },
        limit: 1000,
        depth: 0,
      });

      const ratings = allReviews.docs.map((doc) => doc.rating as number);
      const total = ratings.length;
      const average = total > 0 ? ratings.reduce((a, b) => a + b, 0) / total : 0;

      // Distribution (1-5 stars)
      const distribution = [0, 0, 0, 0, 0];
      for (const r of ratings) {
        distribution[r - 1]++;
      }

      return {
        average: Math.round(average * 10) / 10,
        total,
        distribution: distribution.map((count, i) => ({
          stars: i + 1,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        })),
      };
    }),

  // Protected: create a review
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        title: z.string().max(150).optional(),
        body: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if already reviewed
      const existing = await ctx.payload.find({
        collection: "reviews",
        where: {
          product: { equals: input.productId },
          customer: { equals: ctx.user.id },
        },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "You already reviewed this product" });
      }

      // Check if customer purchased this product
      const orders = await ctx.payload.find({
        collection: "orders",
        where: {
          customer: { equals: ctx.user.id },
          status: { equals: "paid" },
        },
        limit: 500,
        depth: 0,
      });

      const hasPurchased = orders.docs.some((order) => {
        const items = order.items as Array<{ product: string | Record<string, unknown> }>;
        return items.some((item) => {
          const pid = typeof item.product === "object" ? (item.product as Record<string, unknown>).id : item.product;
          return pid === input.productId;
        });
      });

      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          product: input.productId,
          customer: ctx.user.id as string,
          rating: input.rating,
          title: input.title || "",
          body: input.body || "",
          verified: hasPurchased,
        },
      });

      // Update product average rating
      await updateProductRating(ctx, input.productId);

      return { id: review.id };
    }),

  // Protected: delete own review
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.payload.findByID({
        collection: "reviews",
        id: input.id,
      });

      const customerId = typeof review.customer === "object"
        ? (review.customer as Record<string, unknown>).id
        : review.customer;

      if (customerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your review" });
      }

      const productId = typeof review.product === "object"
        ? (review.product as Record<string, unknown>).id as string
        : review.product as string;

      await ctx.payload.delete({
        collection: "reviews",
        id: input.id,
      });

      // Recalculate product rating
      await updateProductRating(ctx, productId);

      return { success: true };
    }),
});

async function updateProductRating(
  ctx: { payload: { find: Function; update: Function } },
  productId: string
) {
  const reviews = await ctx.payload.find({
    collection: "reviews",
    where: { product: { equals: productId } },
    limit: 1000,
    depth: 0,
  });

  const ratings = reviews.docs.map((doc: Record<string, unknown>) => doc.rating as number);
  const total = ratings.length;
  const average = total > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / total : 0;

  await ctx.payload.update({
    collection: "products",
    id: productId,
    data: {
      averageRating: Math.round(average * 10) / 10,
      reviewCount: total,
    },
  });
}

function formatReview(doc: Record<string, unknown>) {
  const customer = doc.customer as Record<string, unknown> | string;

  return {
    id: doc.id as string,
    rating: doc.rating as number,
    title: (doc.title as string) || null,
    body: (doc.body as string) || null,
    verified: (doc.verified as boolean) || false,
    customer: customer && typeof customer === "object"
      ? { id: customer.id as string, name: (customer.name as string) || "Anonymous" }
      : null,
    createdAt: doc.createdAt as string,
  };
}
