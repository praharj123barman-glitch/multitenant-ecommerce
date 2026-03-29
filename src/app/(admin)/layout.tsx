"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  LayoutDashboard,
  Store,
  ArrowLeft,
  Shield,
  Loader2,
} from "lucide-react";
import type { SessionUser } from "@/types";

const navItems = [
  { href: "/admin-panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin-panel/tenants", label: "Tenants", icon: Store },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: rawSession, isLoading } = trpc.auth.session.useQuery();
  const user = (
    rawSession as unknown as { user: SessionUser | null } | undefined
  )?.user;

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || (user as unknown as { role: string }).role !== "admin") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4">
        <Shield className="h-12 w-12 text-muted-foreground/40" />
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground">
          You need admin privileges to access this page.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Admin<span className="text-red-500">Panel</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin-panel" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back */}
        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-muted/30 p-8">{children}</main>
    </div>
  );
}
