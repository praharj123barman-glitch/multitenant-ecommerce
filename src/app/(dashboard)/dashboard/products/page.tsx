"use client";

import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import { Plus, Package, Loader2, Star, MoreHorizontal } from "lucide-react";
import type { Product } from "@/types";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

function statusPill(status?: string) {
  if (status === "active") return "pill pill-success";
  if (status === "draft") return "pill pill-warning";
  return "pill pill-muted";
}

export default function DashboardProductsPage() {
  const trpc = useTRPC();

  const { data: rawProducts, isLoading } = trpc.products.myProducts.useQuery();
  const products = (rawProducts || []) as unknown as Product[];

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="label-mono text-accent">Catalog</p>
          <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} in your store
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          New product
        </Link>
      </motion.header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : products.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="glass-card overflow-hidden rounded-3xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  <th className="label-mono px-6 py-4 text-left text-muted-foreground">Product</th>
                  <th className="label-mono px-6 py-4 text-left text-muted-foreground">Status</th>
                  <th className="label-mono px-6 py-4 text-left text-muted-foreground">Price</th>
                  <th className="label-mono px-6 py-4 text-left text-muted-foreground">Sales</th>
                  <th className="label-mono px-6 py-4 text-left text-muted-foreground">Rating</th>
                  <th className="label-mono px-6 py-4 text-left text-muted-foreground">Created</th>
                  <th className="w-8 px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.03 }}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid var(--glass-border)" }}
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-medium text-foreground hover:text-accent"
                      >
                        {product.name}
                      </Link>
                      {product.shortDescription && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {product.shortDescription}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={statusPill(product.status)}>
                        {product.status || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      ${(product.price / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {product.salesCount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {product.averageRating ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          {product.averageRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="More actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="glass-card rounded-3xl py-20 text-center"
        >
          <div className="glass-elevated mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
            <Package className="h-6 w-6 text-accent" />
          </div>
          <p className="label-mono mt-7 text-accent">Empty catalog</p>
          <h3 className="display mt-3 text-2xl text-foreground">No products yet</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            Drop in your first digital product — files, pricing, descriptions. Customers can buy in seconds.
          </p>
          <Link
            href="/dashboard/products/new"
            className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add your first product
          </Link>
        </motion.div>
      )}
    </div>
  );
}
