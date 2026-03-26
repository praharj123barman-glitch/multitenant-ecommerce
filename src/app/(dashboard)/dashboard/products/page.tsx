"use client";

import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import { Plus, Package, Loader2 } from "lucide-react";
import type { Product } from "@/types";

export default function DashboardProductsPage() {
  const trpc = useTRPC();

  const { data: rawProducts, isLoading } = trpc.products.myProducts.useQuery();
  const products = (rawProducts || []) as unknown as Product[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : products.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Sales</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {product.name}
                    </Link>
                    {product.shortDescription && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {product.shortDescription}
                      </p>
                    )}
                  </td>
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
                  <td className="px-5 py-3.5 font-medium">
                    ${(product.price / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">{product.salesCount || 0}</td>
                  <td className="px-5 py-3.5">
                    {product.averageRating ? `${product.averageRating} ★` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border-2 border-dashed py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold text-muted-foreground">No products yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first product to start selling
          </p>
          <Link
            href="/dashboard/products/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}
