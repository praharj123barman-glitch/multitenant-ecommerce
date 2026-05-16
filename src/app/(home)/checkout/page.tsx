"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Shield,
  Loader2,
  ShoppingBag,
  Package,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { SessionUser } from "@/types";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CheckoutPage() {
  const { items, getTotal } = useCart();
  const trpc = useTRPC();
  const total = getTotal();
  const platformFee = Math.round(total * 0.05);
  const grandTotal = total + platformFee;

  const [checkoutError, setCheckoutError] = useState("");

  const { data: rawSession } = trpc.auth.session.useQuery();
  const user = (rawSession as unknown as { user: SessionUser | null } | undefined)?.user;

  const checkout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      setCheckoutError(err.message);
    },
  });

  const handleCheckout = () => {
    setCheckoutError("");
    checkout.mutate({
      items: items.map((item) => ({
        productId: item.productId,
        tenantId: item.tenantId,
      })),
    });
  };

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
        <p className="label-mono mt-8 text-accent">No items</p>
        <h1 className="display mt-3 text-3xl text-foreground">Nothing to checkout</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Add items to your cart first, then come back here to complete your purchase.
        </p>
        <Link href="/search" className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
          Browse marketplace
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to cart
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <p className="label-mono text-accent">Final step</p>
        <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Checkout</h1>
      </motion.header>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left — checkout form */}
        <div className="space-y-6 lg:col-span-3">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="glass-card rounded-3xl p-7"
            >
              <p className="label-mono text-accent">Account required</p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Sign in to continue</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You need an account to complete your purchase and receive your files.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/sign-in"
                  className="btn-primary rounded-full px-5 py-2.5 text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-ghost rounded-full px-5 py-2.5 text-sm font-medium"
                >
                  Create account
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Account info */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 }}
                className="glass-card rounded-3xl p-7"
              >
                <p className="label-mono text-accent">Account</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">Buyer info</h2>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full accent-gradient text-sm font-bold text-background shadow-glow">
                    {user.email[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.18 }}
                className="glass-card rounded-3xl p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                    <CreditCard className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="label-mono text-accent">Payment</p>
                    <h2 className="mt-0.5 text-lg font-semibold text-foreground">Pay with Stripe</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  You&apos;ll be redirected to Stripe&apos;s secure checkout to complete payment. Files deliver instantly after.
                </p>

                {checkoutError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </motion.div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkout.isPending}
                  className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkout.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Pay ${(grandTotal / 100).toFixed(2)}
                    </>
                  )}
                </button>

                <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-accent" />
                    SSL Encrypted
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-accent" />
                    Powered by Stripe
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Right — order summary */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="glass-card sticky top-24 rounded-3xl p-6">
            <p className="label-mono text-accent">Order</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </h2>

            <div className="mt-5 divide-y" style={{ borderColor: "var(--glass-border)" }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 py-3"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.tenantName}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    ${(item.price / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-5 space-y-2 border-t pt-4 text-sm"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${(total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee (5%)</span>
                <span className="text-foreground">${(platformFee / 100).toFixed(2)}</span>
              </div>
              <div
                className="flex justify-between border-t pt-3"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <span className="font-semibold text-foreground">Total</span>
                <span className="display text-2xl text-foreground">${(grandTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
