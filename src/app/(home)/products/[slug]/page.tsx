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
} from "lucide-react";
import type { Product } from "@/types";

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
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/search" className="mt-4 inline-block text-accent hover:underline">
          Browse products
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
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/search" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left — Images */}
        <div>
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
            {product.images[selectedImage] ? (
              <Image
                src={(product.images[selectedImage] as { url: string }).url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-muted-foreground/30">
                📦
              </div>
            )}

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Discount */}
            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === i
                      ? "border-accent shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
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
                    <div className="flex h-full items-center justify-center bg-muted text-lg">
                      📦
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Product info */}
        <div>
          {/* Category */}
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20"
            >
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {product.name}
          </h1>

          {/* Seller */}
          {product.tenant && (
            <Link
              href={`/store/${product.tenant.id}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Store className="h-4 w-4" />
              {product.tenant.name}
            </Link>
          )}

          {/* Rating */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
            <span className="text-sm text-muted-foreground">
              · {product.salesCount} sales
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold">
              ${(product.price / 100).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                ${(product.compareAtPrice! / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
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
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 ${
                addedToCart
                  ? "bg-emerald-500 shadow-emerald-500/25"
                  : "bg-gradient-to-r from-accent to-accent-dark shadow-accent/25"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {addedToCart ? "Added!" : "Add to Cart"}
            </button>
            <button className="rounded-xl border p-3.5 transition-colors hover:bg-muted">
              <Heart className="h-5 w-5" />
            </button>
            <button className="rounded-xl border p-3.5 transition-colors hover:bg-muted">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
              <Download className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Instant Download</p>
                <p className="text-xs text-muted-foreground">
                  Get it right after purchase
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  Powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t pt-12">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
        <ReviewSection productId={product.id} />
      </section>
    </div>
  );
}
