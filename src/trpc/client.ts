import { createTRPCContext } from "@/server/trpc/init";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc/init";

// Server-side caller — use this in Server Components
export const createCaller = createCallerFactory(appRouter);

export const createServerCaller = async () => {
  const context = await createTRPCContext();
  return createCaller(context);
};
