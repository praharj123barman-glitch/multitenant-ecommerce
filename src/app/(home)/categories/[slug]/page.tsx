"use client";

import { use } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import type { Category } from "@/types";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trpc = useTRPC();

  const { data: rawCategory, isLoading } = useQuery(
    trpc.categories.getBySlug.queryOptions({ slug })
  );
  const category = rawCategory as unknown as Category | null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Categories
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          {category?.icon && <span className="text-4xl">{category.icon}</span>}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {category?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            {category?.description && (
              <p className="mt-1 text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products grid — placeholder until we build Products */}
      <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 px-8 py-20 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
          No products yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Products in this category will appear here once we build the Products
          feature.
        </p>
      </div>
    </div>
  );
}
