"use client";

import { use } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  BadgeCheck,
  Globe,
  ExternalLink,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: { url: string; alt: string } | null;
  banner: { url: string; alt: string } | null;
  owner: { id: string; name: string } | null;
  verified: boolean;
  socialLinks: {
    website: string | null;
    twitter: string | null;
    instagram: string | null;
  } | null;
  createdAt: string;
}

interface ProductListResult {
  products: Product[];
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
}

export default function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trpc = useTRPC();

  const { data: rawTenant, isLoading: tenantLoading } = useQuery(
    trpc.tenants.getBySlug.queryOptions({ slug })
  );
  const tenant = rawTenant as unknown as Tenant | null;

  const { data: rawProducts, isLoading: productsLoading } = useQuery({
    ...trpc.products.list.queryOptions({
      tenantId: tenant?.id,
      limit: 20,
    }),
    enabled: !!tenant?.id,
  });
  const productsData = rawProducts as unknown as ProductListResult | undefined;

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Store not found</h1>
        <p className="mt-2 text-muted-foreground">
          This store doesn&apos;t exist or has been removed.
        </p>
        <Link href="/" className="mt-4 inline-block text-accent hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-accent via-accent-dark to-purple-700 md:h-64">
        {tenant.banner && (
          <Image
            src={tenant.banner.url}
            alt={tenant.banner.alt || tenant.name}
            fill
            className="object-cover"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Store info */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative -mt-16 mb-8 flex flex-col items-start gap-6 md:flex-row md:items-end">
          {/* Logo */}
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
            {tenant.logo ? (
              <Image
                src={tenant.logo.url}
                alt={tenant.logo.alt || tenant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent to-pink-500 text-3xl font-bold text-white">
                {tenant.name[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{tenant.name}</h1>
              {tenant.verified && (
                <BadgeCheck className="h-5 w-5 text-accent" />
              )}
            </div>
            {tenant.description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {tenant.description}
              </p>
            )}

            {/* Social links */}
            {tenant.socialLinks && (
              <div className="mt-3 flex items-center gap-3">
                {tenant.socialLinks.website && (
                  <a
                    href={tenant.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {tenant.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${tenant.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    @{tenant.socialLinks.twitter}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Product count */}
          <div className="rounded-xl border bg-white px-5 py-3 text-center shadow-sm">
            <div className="text-2xl font-bold">{productsData?.totalDocs || 0}</div>
            <div className="text-xs text-muted-foreground">Products</div>
          </div>
        </div>

        {/* Products */}
        <section className="pb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Products</h2>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : productsData && productsData.products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {productsData.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 px-8 py-16 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                No products yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This store hasn&apos;t added any products yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
