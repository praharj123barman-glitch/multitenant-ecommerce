"use client";

import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import { Package, DollarSign, ShoppingBag, Star, Plus, Loader2 } from "lucide-react";
import type { Product } from "@/types";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  stripeOnboardingComplete: boolean;
}

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
      <div className="mx-auto max-w-lg py-20 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 text-2xl font-bold">Create Your Store</h1>
        <p className="mt-2 text-muted-foreground">
          You need a store to access the seller dashboard.
        </p>
        <Link
          href="/create-store"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Create Store
        </Link>
      </div>
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
    {
      label: "Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Sales",
      value: totalSales,
      icon: ShoppingBag,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Revenue",
      value: `$${(totalRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {tenant.name}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent products */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Recent Products</h2>
        {products.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-xl border bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Sales</th>
                  <th className="px-5 py-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-muted/20">
                    <td className="px-5 py-3.5 font-medium">{product.name}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : product.status === "draft"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">${(product.price / 100).toFixed(2)}</td>
                    <td className="px-5 py-3.5">{product.salesCount || 0}</td>
                    <td className="px-5 py-3.5">
                      {product.averageRating ? `${product.averageRating} ★` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border-2 border-dashed py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No products yet.{" "}
              <Link href="/dashboard/products/new" className="text-accent hover:underline">
                Add your first product
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Stripe status */}
      {!tenant.stripeOnboardingComplete && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-800">Complete Stripe Setup</h3>
          <p className="mt-1 text-sm text-amber-700">
            You need to complete Stripe onboarding before you can receive payments.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Go to Settings
          </Link>
        </div>
      )}
    </div>
  );
}
