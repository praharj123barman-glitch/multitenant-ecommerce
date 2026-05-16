"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ArrowLeft,
  Store,
  Loader2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import type { SessionUser } from "@/types";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: rawSession, isLoading } = trpc.auth.session.useQuery();
  const user = (rawSession as unknown as { user: SessionUser | null } | undefined)?.user;

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-5 px-4 py-20">
        <div className="glass-elevated flex h-14 w-14 items-center justify-center rounded-2xl">
          <Store className="h-6 w-6 text-accent" />
        </div>
        <h1 className="display text-2xl text-foreground">Sign in to your dashboard</h1>
        <p className="text-sm text-muted-foreground">You need to be signed in to manage your store.</p>
        <Link href="/sign-in" className="btn-primary rounded-full px-6 py-2.5 text-sm">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="hero-orbs flex min-h-full">
      {/* Sidebar — floating glass */}
      <aside className="sticky top-4 z-30 my-4 ml-4 hidden h-[calc(100vh-2rem)] w-64 flex-col rounded-3xl lg:flex glass-elevated">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b px-5" style={{ borderColor: "var(--glass-border)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient shadow-glow">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-foreground">
              Multi<span className="gradient-text-cyan">Mart</span>
            </div>
            <p className="label-mono text-[9px] text-muted-foreground">Vendor Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          <p className="label-mono mb-2 px-3 pt-2 text-[10px] text-muted-foreground/60">Workspace</p>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User card + back */}
        <div className="border-t p-3" style={{ borderColor: "var(--glass-border)" }}>
          <div className="glass-base mb-3 flex items-center gap-2.5 rounded-xl p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full accent-gradient text-xs font-bold text-background shadow-glow">
              {user.email[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Link href="/" className="nav-link">
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <a
            href="https://github.com/praharj123barman-glitch/multitenant-ecommerce/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </a>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="glass-elevated fixed inset-x-4 top-4 z-30 flex h-14 items-center justify-between rounded-2xl px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg accent-gradient shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-background" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Multi<span className="gradient-text-cyan">Mart</span>
          </span>
        </Link>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Store
        </Link>
      </div>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 px-4 pt-24 pb-12 lg:px-12 lg:pt-12"
      >
        {children}
      </motion.main>
    </div>
  );
}
