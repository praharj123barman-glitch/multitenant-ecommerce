"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useTRPC } from "@/trpc/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Shield,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import type { SessionUser } from "@/types";

export default function CheckoutPage() {
  const { items, getTotal } = useCart();
  const trpc = useTRPC();
  const total = getTotal();
  const platformFee = Math.round(total * 0.05);
  const grandTotal = total + platformFee;

  const [checkoutError, setCheckoutError] = useState("");

  const { data: rawSession } = useQuery(trpc.auth.session.queryOptions());
  const user = (rawSession as unknown as { user: SessionUser | null } | undefined)?.user;

  const checkout = useMutation({
    mutationFn: async (input: { items: { productId: string; tenantId: string }[] }) => {
      const res = await fetch("/api/trpc/stripe.createCheckoutSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      return json.result?.data as { sessionId: string; url: string | null };
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: Error) => {
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
      <div className="mx-auto max-w-7xl px-4 py-24 text-center lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 text-2xl font-bold">Nothing to checkout</h1>
        <p className="mt-2 text-muted-foreground">Add items to your cart first</p>
        <Link
          href="/search"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left — checkout form */}
        <div className="lg:col-span-3">
          {/* Auth check */}
          {!user ? (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-bold">Sign in to continue</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You need an account to complete your purchase
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/sign-in"
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Create account
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Account info */}
              <div className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-bold">Account</h2>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-pink-500 text-sm font-bold text-white">
                    {user.email[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border bg-white p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  You&apos;ll be redirected to Stripe&apos;s secure checkout to complete
                  your payment.
                </p>

                {checkoutError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {checkoutError}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkout.isPending}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50"
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

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    SSL Encrypted
                  </span>
                  <span>·</span>
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Order ({items.length} item{items.length !== 1 ? "s" : ""})
            </h2>

            <div className="mt-4 divide-y">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.tenantName}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    ${(item.price / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform fee (5%)</span>
                <span>${(platformFee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>${(grandTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
