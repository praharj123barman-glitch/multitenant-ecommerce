import { z } from "zod/v4";
import { baseProcedure, createTRPCRouter } from "../trpc/init";

export const categoriesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    const result = await ctx.payload.find({
      collection: "categories",
      limit: 100,
      sort: "name",
    });

    return result.docs.map((doc) => ({
      id: doc.id as string,
      name: doc.name as string,
      slug: doc.slug as string,
      description: (doc.description as string) || null,
      icon: (doc.icon as string) || null,
      color: (doc.color as string) || null,
      parent: doc.parent ? (typeof doc.parent === "object" ? (doc.parent as Record<string, unknown>).id as string : doc.parent as string) : null,
    }));
  }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.payload.find({
        collection: "categories",
        where: {
          slug: { equals: input.slug },
        },
        limit: 1,
      });

      const doc = result.docs[0];
      if (!doc) return null;

      return {
        id: doc.id as string,
        name: doc.name as string,
        slug: doc.slug as string,
        description: (doc.description as string) || null,
        icon: (doc.icon as string) || null,
        color: (doc.color as string) || null,
      };
    }),

  getSubcategories: baseProcedure
    .input(z.object({ parentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.payload.find({
        collection: "categories",
        where: {
          parent: { equals: input.parentId },
        },
        sort: "name",
      });

      return result.docs.map((doc) => ({
        id: doc.id as string,
        name: doc.name as string,
        slug: doc.slug as string,
        icon: (doc.icon as string) || null,
      }));
    }),
});
