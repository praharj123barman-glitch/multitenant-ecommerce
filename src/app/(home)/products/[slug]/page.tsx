"use client";

import { use, useState } from "react";
import { useTRPC } from "@/trpc/react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { ReviewSection } from "@/components/ReviewSection";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Store,
  Package,
  Check,
} from "lucide-react";
import type { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trpc = useTRPC();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const cart = useCart();

  const { data: rawProduct, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const product = rawProduct as unknown as Product | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="glass-elevated mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
          <Package className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="label-mono mt-7 text-muted-foreground">404</p>
        <h1 className="display mt-3 text-3xl text-foreground">Product not found</h1>
        <Link
          href="/search"
          className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
        >
          Browse marketplace
        </Link>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/search" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left — Images */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Main image */}
          <div className="glass-card relative aspect-square overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              {product.images[selectedImage] ? (
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0"
                >
                  <Image
                    src={(product.images[selectedImage] as { url: string }).url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </AnimatePresence>

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1,
                    )
                  }
                  aria-label="Previous image"
                  className="glass-elevated absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 transition-all hover:border-accent"
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  aria-label="Next image"
                  className="glass-elevated absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 transition-all hover:border-accent"
                >
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <span className="pill pill-error absolute left-4 top-4">
                −{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImage === i
                      ? "border-accent shadow-glow"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {img ? (
                    <Image
                      src={(img as { url: string }).url}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface">
                      <Package className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right — Product info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.08 }}
        >
          {/* Category */}
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="glass-base inline-flex rounded-full px-3 py-1 text-[11px] font-medium text-accent transition-colors hover:border-accent"
            >
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="display mt-4 text-3xl text-foreground sm:text-4xl">{product.name}</h1>

          {/* Seller */}
          {product.tenant && (
            <Link
              href={`/store/${product.tenant.slug || product.tenant.id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent"
            >
              <Store className="h-3.5 w-3.5" />
              {product.tenant.name}
            </Link>
          )}

          {/* Rating */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product.averageRating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
            <span className="text-xs text-muted-foreground">· {product.salesCount} sold</span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="display text-5xl text-foreground">${(product.price / 100).toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-base text-muted-foreground line-through">
                ${(product.compareAtPrice! / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-2.5">
            <button
              onClick={() => {
                if (!product) return;
                const firstImg = product.images[0];
                cart.addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: firstImg ? (firstImg as { url: string }).url : null,
                  tenantId: product.tenant?.id || "",
                  tenantName: product.tenant?.name || "Unknown",
                  slug: product.slug,
                });
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
                addedToCart
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "btn-primary"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </>
              )}
            </button>
            <button
              aria-label="Add to wishlist"
              className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              aria-label="Share product"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href });
                } else if (typeof navigator !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="glass-base flex items-center gap-3 rounded-2xl p-4">
              <div className="glass-elevated flex h-9 w-9 items-center justify-center rounded-xl">
                <Download className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Instant delivery</p>
                <p className="text-[11px] text-muted-foreground">Right after purchase</p>
              </div>
            </div>
            <div className="glass-base flex items-center gap-3 rounded-2xl p-4">
              <div className="glass-elevated flex h-9 w-9 items-center justify-center rounded-xl">
                <Shield className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Secure payment</p>
                <p className="text-[11px] text-muted-foreground">Powered by Stripe</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.2 }}
        className="mt-16 border-t pt-12"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <p className="label-mono text-accent">Reviews</p>
        <h2 className="display mt-3 text-2xl text-foreground">What customers say</h2>
        <div className="mt-6">
          <ReviewSection productId={product.id} />
        </div>
      </motion.section>
    </div>
  );
}
