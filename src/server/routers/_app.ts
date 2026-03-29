import { createTRPCRouter } from "../trpc/init";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { categoriesRouter } from "./categories";
import { productsRouter } from "./products";
import { tenantsRouter } from "./tenants";
import { stripeRouter } from "./stripe";
import { reviewsRouter } from "./reviews";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  categories: categoriesRouter,
  products: productsRouter,
  tenants: tenantsRouter,
  stripe: stripeRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;
