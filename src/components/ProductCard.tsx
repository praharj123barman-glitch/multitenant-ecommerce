"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-400 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover-lift"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                <span className="text-2xl text-accent">M</span>
              </div>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

          {/* Discount badge */}
          {hasDiscount && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.06 + 0.2, type: "spring", stiffness: 300 }}
              className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/30"
            >
              -{discountPercent}%
            </motion.span>
          )}

          {/* Category badge */}
          {product.category && (
            <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-card/90 px-2.5 py-1 text-xs font-medium text-card-foreground backdrop-blur-md">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Seller */}
          {product.tenant && (
            <p className="text-xs text-muted-foreground">
              {product.tenant.name}
            </p>
          )}

          {/* Name */}
          <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-card-foreground transition-colors duration-200 group-hover:text-accent">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5" role="img" aria-label={`Rated ${product.averageRating} out of 5 stars`}>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(product.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-card-foreground">
              ${(product.price / 100).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${(product.compareAtPrice! / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
