"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    images: Array<{ url: string; alt: string } | null>;
    category: { name: string; slug: string } | null;
    tenant: { id: string; name: string } | null;
    averageRating: number;
    reviewCount: number;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const firstImage = product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.05,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="glass-card group relative block overflow-hidden rounded-3xl"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl accent-gradient">
                <span className="text-xl font-bold text-background">M</span>
              </div>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

          {/* Discount badge */}
          {hasDiscount && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.2, type: "spring", stiffness: 280 }}
              className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-background shadow-glow"
            >
              −{discountPercent}%
            </motion.span>
          )}

          {/* Category tag */}
          {product.category && (
            <span className="glass-base absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium text-foreground">
              {product.category.name}
            </span>
          )}

          {/* Hover arrow */}
          <div className="glass-elevated absolute right-3 bottom-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </div>

          {/* Info — overlaid on bottom of image */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            {product.tenant && (
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {product.tenant.name}
              </p>
            )}
            <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent">
              {product.name}
            </h3>
            <div className="mt-3 flex items-end justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-foreground">
                  ${(product.price / 100).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${(product.compareAtPrice! / 100).toFixed(2)}
                  </span>
                )}
              </div>

              {product.reviewCount > 0 && (
                <div className="flex items-center gap-1" role="img" aria-label={`Rated ${product.averageRating} of 5`}>
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-[11px] text-muted-foreground">
                    {product.averageRating.toFixed(1)} ({product.reviewCount})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
