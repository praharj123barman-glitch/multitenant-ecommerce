"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Trash2, ShoppingBag, ArrowRight, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, clearCart, getTotal, getGroupedByTenant } = useCart();
  const grouped = getGroupedByTenant();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse products and add them to your cart
        </p>
        <Link
          href="/search"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
        >
          Browse Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <button
          onClick={() => {
            if (window.confirm("Remove all items from cart?")) clearCart();
          }}
          className="text-sm text-muted-foreground hover:text-red-600"
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {Object.entries(grouped).map(([tenantId, group]) => (
              <motion.div
                key={tenantId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="mb-6 overflow-hidden rounded-2xl border bg-white"
              >
                {/* Tenant header */}
                <div className="flex items-center gap-2 border-b bg-muted/30 px-5 py-3">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{group.tenantName}</span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {group.items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 p-5"
                    >
                      {/* Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold hover:text-accent line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Digital product · Instant delivery
                        </p>
                      </div>

                      {/* Price & remove */}
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">
                          ${(item.price / 100).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform fee</span>
                <span>${((total * 0.05) / 100).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${((total * 1.05) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:brightness-110"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
