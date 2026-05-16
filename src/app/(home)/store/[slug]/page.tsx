"use client";

import { use } from "react";
import { useTRPC } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  BadgeCheck,
  Globe,
  ExternalLink,
  Package,
  Store as StoreIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

const ease = [0.16, 1, 0.3, 1] as const;

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

  const { data: rawTenant, isLoading: tenantLoading } = trpc.tenants.getBySlug.useQuery({ slug });
  const tenant = rawTenant as unknown as Tenant | null;

  const { data: rawProducts, isLoading: productsLoading } = trpc.products.list.useQuery(
    { tenantId: tenant?.id, limit: 20 },
    { enabled: !!tenant?.id },
  );
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
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="glass-elevated mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
          <StoreIcon className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="label-mono mt-7 text-muted-foreground">404</p>
        <h1 className="display mt-3 text-3xl text-foreground">Store not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          This store doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="hero-orbs">
      {/* Banner with cyan-blue gradient if no banner image */}
      <div className="relative h-48 overflow-hidden md:h-72">
        {tenant.banner ? (
          <>
            <Image
              src={tenant.banner.url}
              alt={tenant.banner.alt || tenant.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 accent-gradient opacity-30" />
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}
      </div>

      {/* Store header */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="relative -mt-20 mb-12 flex flex-col items-start gap-6 md:flex-row md:items-end"
        >
          {/* Logo */}
          <div className="glass-elevated relative h-28 w-28 overflow-hidden rounded-3xl shadow-glow">
            {tenant.logo ? (
              <Image
                src={tenant.logo.url}
                alt={tenant.logo.alt || tenant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center accent-gradient text-3xl font-bold text-background">
                {tenant.name[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="label-mono text-accent">Storefront</p>
            <div className="mt-2 flex items-center gap-2">
              <h1 className="display text-3xl text-foreground sm:text-4xl">{tenant.name}</h1>
              {tenant.verified && (
                <BadgeCheck className="h-5 w-5 text-accent" aria-label="Verified store" />
              )}
            </div>
            {tenant.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {tenant.description}
              </p>
            )}

            {/* Social links */}
            {tenant.socialLinks && (
              <div className="mt-4 flex items-center gap-3">
                {tenant.socialLinks.website && (
                  <a
                    href={tenant.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-base flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-foreground transition-colors hover:border-accent"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
                {tenant.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${tenant.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-base rounded-full px-3 py-1.5 text-[11px] text-foreground transition-colors hover:border-accent"
                  >
                    @{tenant.socialLinks.twitter}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Product count card */}
          <div className="glass-card rounded-2xl px-5 py-4 text-center">
            <div className="display text-2xl text-foreground">{productsData?.totalDocs || 0}</div>
            <div className="label-mono mt-1 text-muted-foreground">Products</div>
          </div>
        </motion.div>

        {/* Products */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="pb-20"
        >
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="label-mono text-accent">Catalog</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">All products</h2>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : productsData && productsData.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsData.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl py-16 text-center">
              <div className="glass-elevated mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="label-mono mt-6 text-muted-foreground">Empty store</p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">No products yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                This store hasn&apos;t added any products yet. Check back soon.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
