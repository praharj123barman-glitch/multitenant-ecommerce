import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export const createTRPCContext = async () => {
  const headers = await getHeaders();
  const payload = await getPayload({ config });

  return {
    payload,
    headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Protected procedure — requires authenticated user
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders();
  const { user } = await ctx.payload.auth({ headers });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
