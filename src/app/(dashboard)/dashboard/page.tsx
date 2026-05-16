"use client";

import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import {
  Package,
  DollarSign,
  ShoppingBag,
  Star,
  Plus,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/types";
import { motion } from "framer-motion";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  stripeOnboardingComplete: boolean;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function DashboardPage() {
  const trpc = useTRPC();

  const { data: rawTenant, isLoading: tenantLoading } = trpc.tenants.myTenant.useQuery();
  const tenant = rawTenant as unknown as Tenant | null;

  const { data: rawProducts } = trpc.products.myProducts.useQuery(undefined, {
    enabled: !!tenant,
  });
  const products = (rawProducts || []) as unknown as Product[];

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mx-auto max-w-xl py-16 text-center"
      >
        <div className="glass-elevated mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
          <Sparkles className="h-7 w-7 text-accent" />
        </div>
        <p className="label-mono mt-8 text-accent">Get Started</p>
        <h1 className="display mt-3 text-3xl text-foreground">Create your store</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          You need a store to access the seller dashboard. It takes 30 seconds —
          claim a subdomain, drop in your brand, start shipping.
        </p>
        <Link
          href="/create-store"
          className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
        >
          <Plus className="h-4 w-4" />
          Create store
        </Link>
      </motion.div>
    );
  }

  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const totalRevenue = products.reduce(
    (sum, p) => sum + (p.salesCount || 0) * p.price,
    0
  );
  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length
      : 0;

  const stats = [
    { label: "Products", value: products.length.toString(), icon: Package, hint: "active items" },
    { label: "Total Sales", value: totalSales.toLocaleString(), icon: ShoppingBag, hint: "units sold" },
    { label: "Revenue", value: `$${(totalRevenue / 100).toFixed(2)}`, icon: DollarSign, hint: "all time" },
    { label: "Avg Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Star, hint: "out of 5" },
  ];

  const topProducts = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="label-mono text-accent">{tenant.stripeOnboardingComplete ? "Live · Accepting Orders" : "Setup Required"}</p>
          <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">
            Welcome back, <span className="gradient-text-cyan">{tenant.name}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            multimart.com/store/<span className="text-foreground">{tenant.slug}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/store/${tenant.slug}`}
            target="_blank"
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            View store
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/dashboard/products/new"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            New product
          </Link>
        </div>
      </motion.header>

      {/* Stat bento */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.04 }}
            className="glass-card hover-3d rounded-2xl p-6"
          >
            <div className="flex items-start justify-between">
              <p className="label-mono text-muted-foreground">{stat.label}</p>
              <div className="glass-elevated flex h-8 w-8 items-center justify-center rounded-lg">
                <stat.icon className="h-3.5 w-3.5 text-accent" />
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="display text-3xl text-foreground">{stat.value}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{stat.hint}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom row — top products + Stripe status */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.35 }}
          className="glass-card rounded-3xl p-6 lg:col-span-2"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="label-mono text-accent">Top movers</p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Best-selling products</h2>
            </div>
            <Link href="/dashboard/products" className="link-underline text-xs font-medium text-foreground">
              View all
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="mt-8 flex flex-col items-center py-12 text-center">
              <div className="glass-elevated flex h-12 w-12 items-center justify-center rounded-2xl">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">No products yet</p>
              <Link href="/dashboard/products/new" className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Add your first product
              </Link>
            </div>
          ) : (
            <ul className="mt-5 divide-y" style={{ borderColor: "var(--glass-border)" }}>
              {topProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      ${(p.price / 100).toFixed(2)} · {p.salesCount || 0} sold
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    <span className="label-mono text-accent">+{Math.max(p.salesCount || 0, 1)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        {/* Stripe status card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.4 }}
          className="glass-card rounded-3xl p-6"
        >
          <p className="label-mono text-accent">Payments</p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Stripe Connect</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {tenant.stripeOnboardingComplete
              ? "You're set. Customers can check out and you'll receive payouts directly."
              : "Connect Stripe to accept payments and receive payouts from customers."}
          </p>

          <div className="mt-5">
            <span className={tenant.stripeOnboardingComplete ? "pill pill-success" : "pill pill-warning"}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {tenant.stripeOnboardingComplete ? "Connected" : "Not connected"}
            </span>
          </div>

          <Link
            href="/dashboard/settings"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-light"
          >
            {tenant.stripeOnboardingComplete ? "Manage" : "Connect now"}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
