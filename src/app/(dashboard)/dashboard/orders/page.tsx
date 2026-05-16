"use client";

import { ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const placeholderStats = [
  { label: "Orders Today", value: "—" },
  { label: "Revenue Today", value: "$0.00" },
  { label: "Pending Fulfillment", value: "0" },
];

export default function DashboardOrdersPage() {
  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <p className="label-mono text-accent">Fulfillment</p>
        <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track customer purchases and refunds as they happen.
        </p>
      </motion.header>

      {/* Placeholder stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {placeholderStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.04 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="label-mono text-muted-foreground">{stat.label}</p>
            <p className="display mt-5 text-3xl text-foreground/40">{stat.value}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">awaiting first sale</p>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.3 }}
        className="glass-card hover-3d rounded-3xl py-20 text-center"
      >
        <div className="glass-elevated mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
          <ShoppingBag className="h-6 w-6 text-accent" />
        </div>
        <p className="label-mono mt-7 text-accent">
          <Sparkles className="mr-1 inline h-3 w-3" />
          Live · listening for orders
        </p>
        <h3 className="display mt-3 text-2xl text-foreground">No orders yet</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          When customers buy from your store, their orders will appear here in real time with status, amount, and fulfillment actions.
        </p>
      </motion.div>
    </div>
  );
}
