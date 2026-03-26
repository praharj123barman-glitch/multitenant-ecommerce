import { z } from "zod/v4";
import { baseProcedure, createTRPCRouter } from "../trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const { user } = await ctx.payload.auth({ headers });

    return {
      user: user
        ? {
            id: user.id as string,
            email: user.email as string,
            name: (user as Record<string, unknown>).name as string,
            role: (user as Record<string, unknown>).role as string,
          }
        : null,
    };
  }),

  register: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUsers = await ctx.payload.find({
        collection: "users",
        where: {
          email: { equals: input.email },
        },
        limit: 1,
      });

      if (existingUsers.docs.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      }

      const user = await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          name: input.name,
          role: "customer",
        },
      });

      return { user };
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!result.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      return {
        user: result.user,
        token: result.token,
      };
    }),
});
