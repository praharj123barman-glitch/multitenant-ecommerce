"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Trash2, ShoppingBag, ArrowRight, Store, Package, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CartPage() {
  const { items, removeItem, clearCart, getTotal, getGroupedByTenant } = useCart();
  const grouped = getGroupedByTenant();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8"
      >
        <div className="glass-elevated mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
          <ShoppingBag className="h-7 w-7 text-accent" />
        </div>
        <p className="label-mono mt-8 text-accent">Empty cart</p>
        <h1 className="display mt-3 text-3xl text-foreground">Nothing here yet</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Browse the marketplace and add products to your cart. Digital delivery happens instantly after checkout.
        </p>
        <Link
          href="/search"
          className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
        >
          Browse marketplace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="label-mono text-accent">Checkout</p>
          <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Your cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} from {Object.keys(grouped).length}{" "}
            {Object.keys(grouped).length === 1 ? "store" : "stores"}
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Remove all items from cart?")) clearCart();
          }}
          className="text-xs text-muted-foreground hover:text-red-400 self-start sm:self-auto"
        >
          Clear all
        </button>
      </motion.header>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart items */}
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {Object.entries(grouped).map(([tenantId, group], gi) => (
              <motion.div
                key={tenantId}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease, delay: gi * 0.05 }}
                className="glass-card overflow-hidden rounded-3xl"
              >
                {/* Tenant header */}
                <div
                  className="flex items-center gap-2 border-b px-5 py-3"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <Store className="h-3.5 w-3.5 text-accent" />
                  <span className="label-mono text-foreground">{group.tenantName}</span>
                </div>

                {/* Items */}
                <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
                  {group.items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 p-5"
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      {/* Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.slug}`}
                          className="line-clamp-1 text-sm font-semibold text-foreground hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Digital · Instant delivery
                        </p>
                      </div>

                      {/* Price & remove */}
                      <div className="flex items-center gap-4">
                        <span className="text-base font-semibold text-foreground">
                          ${(item.price / 100).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
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
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
          className="lg:col-span-1"
        >
          <div className="glass-card sticky top-24 rounded-3xl p-6">
            <p className="label-mono text-accent">Summary</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Order total</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
                <span className="text-foreground">${(total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee (5%)</span>
                <span className="text-foreground">${((total * 0.05) / 100).toFixed(2)}</span>
              </div>
              <div
                className="border-t pt-3"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="display text-2xl text-foreground">
                    ${((total * 1.05) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm"
            >
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" />
              Secure checkout · Powered by Stripe
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
