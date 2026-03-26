"use client";

import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  const clearCart = useCart((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <CheckCircle className="mx-auto h-20 w-20 text-emerald-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. Your digital products are ready for
          download.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/library"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:brightness-110"
          >
            <Download className="h-4 w-4" />
            Go to My Library
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
