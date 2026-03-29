"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import { motion, type Variants } from "framer-motion";
import {
  Store,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  BadgeCheck,
  Loader2,
  ArrowRight,
  TrendingUp,
  Zap,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const GRADIENTS = [
  "from-blue-500/20 via-blue-400/10 to-cyan-500/5",
  "from-indigo-500/20 via-violet-400/10 to-purple-500/5",
  "from-emerald-500/20 via-green-400/10 to-teal-500/5",
  "from-orange-500/20 via-amber-400/10 to-yellow-500/5",
  "from-amber-500/20 via-yellow-400/10 to-orange-500/5",
  "from-purple-500/20 via-fuchsia-400/10 to-pink-500/5",
];

const ICON_RINGS = [
  "ring-blue-400/30 shadow-blue-500/25",
  "ring-indigo-400/30 shadow-indigo-500/25",
  "ring-emerald-400/30 shadow-emerald-500/25",
  "ring-orange-400/30 shadow-orange-500/25",
  "ring-amber-400/30 shadow-amber-500/25",
  "ring-purple-400/30 shadow-purple-500/25",
];

const ORB_COLORS = [
  "bg-blue-400/40",
  "bg-indigo-400/40",
  "bg-emerald-400/40",
  "bg-orange-400/40",
  "bg-amber-400/40",
  "bg-purple-400/40",
];

export default function AdminDashboardPage() {
  const trpc = useTRPC();

  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Tenants",
      value: stats.totalTenants,
      icon: Store,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Paid Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
    {
      label: "Platform Revenue",
      value: `$${(stats.totalRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Verified Tenants",
      value: stats.verifiedTenants,
      icon: BadgeCheck,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
  ];

  const verificationPct =
    stats.totalTenants > 0
      ? Math.round((stats.verifiedTenants / stats.totalTenants) * 100)
      : 0;

  return (
    <div className="admin-mesh min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform overview and management
          </p>
        </div>
        <Link
          href="/admin-panel/tenants"
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:brightness-110"
        >
          Manage Tenants
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            className={`glass-card relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${GRADIENTS[i]}`}
          >
            {/* Orb glow behind icon */}
            <div
              className={`orb-glow absolute -right-3 -top-3 h-20 w-20 rounded-full blur-2xl ${ORB_COLORS[i]}`}
              style={{ animationDelay: `${i * 0.4}s` }}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {stat.label}
                </span>
                <div
                  className="count-enter mt-2 text-3xl font-extrabold tracking-tight"
                  style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                >
                  {stat.value}
                </div>
              </div>
              <div
                className={`rounded-xl ${stat.bg} p-3 ring-2 ${ICON_RINGS[i]} shadow-lg`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>

            {/* Subtle bottom sparkle bar */}
            <div className="mt-4 flex items-center gap-2">
              <div className={`h-1 flex-1 rounded-full ${stat.bg}`}>
                <motion.div
                  className={`h-1 rounded-full ${stat.bg} brightness-150`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4 + i * 0.1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                />
              </div>
              <TrendingUp className={`h-3 w-3 ${stat.color} opacity-60`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Panels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        {/* Platform Health */}
        <div className="glass-card relative overflow-hidden rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold">Platform Health</h2>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Verification Rate
                </span>
                <span className="font-semibold">{verificationPct}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/50">
                <motion.div
                  className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${verificationPct}%` }}
                  transition={{
                    duration: 1.4,
                    delay: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/30 px-4 py-3 text-sm">
              <span className="text-muted-foreground">
                Avg Products / Tenant
              </span>
              <span className="font-semibold">
                {stats.totalTenants > 0
                  ? (stats.totalProducts / stats.totalTenants).toFixed(1)
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/30 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Avg Order Value</span>
              <span className="font-semibold">
                {stats.totalOrders > 0
                  ? `$${(stats.totalRevenue / stats.totalOrders / 100).toFixed(2)}`
                  : "$0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card relative overflow-hidden rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold">Quick Actions</h2>
          </div>
          <div className="mt-5 space-y-2">
            <Link
              href="/admin-panel/tenants"
              className="flex items-center justify-between rounded-xl bg-white/30 px-4 py-3.5 text-sm transition-all hover:bg-white/50 hover:shadow-sm"
            >
              <span>Review unverified tenants</span>
              <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                {stats.totalTenants - stats.verifiedTenants} pending
              </span>
            </Link>
            <Link
              href="/admin-panel/tenants"
              className="flex items-center justify-between rounded-xl bg-white/30 px-4 py-3.5 text-sm transition-all hover:bg-white/50 hover:shadow-sm"
            >
              <span>View all tenants</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-xl bg-white/30 px-4 py-3.5 text-sm transition-all hover:bg-white/50 hover:shadow-sm"
            >
              <span>Payload CMS Admin</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
