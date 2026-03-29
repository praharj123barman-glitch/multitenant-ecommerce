"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import type { SessionUser } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { ThemeToggle } from "./ThemeToggle";
import { ShoppingCart, Search, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const trpc = useTRPC();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const session = trpc.auth.session.useQuery();
  const user = (session.data as unknown as { user: SessionUser | null } | undefined)?.user;
  const cartCount = useCart((s) => s.items.length);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-border shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-pink-500 shadow-md shadow-accent/25 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/40 group-hover:scale-105">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Multi<span className="text-accent">Mart</span>
          </span>
        </Link>

        {/* Search — desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center px-12 md:flex"
        >
          <div
            className={`relative w-full max-w-lg transition-all duration-400 ${
              searchFocused ? "max-w-xl" : ""
            }`}
          >
            <Search
              className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
                searchFocused ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products, creators, categories..."
              className={`w-full rounded-full border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground focus:border-accent focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                searchFocused ? "shadow-lg shadow-accent/5" : ""
              }`}
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Cart — visible to all users */}
          <Link
            href="/cart"
            className="relative rounded-full p-2.5 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm shadow-accent/30"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <>
              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full p-1 transition-all duration-200 hover:bg-muted"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-pink-500 text-xs font-bold text-white shadow-sm shadow-accent/25 transition-shadow duration-300 hover:shadow-md hover:shadow-accent/40">
                    {user.email[0]?.toUpperCase() || "U"}
                  </div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl"
                    >
                      <div className="border-b border-border px-3 py-2.5">
                        <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted"
                        >
                          <User className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          onClick={async () => {
                            await fetch("/api/logout", {
                              method: "POST",
                              credentials: "include",
                            });
                            window.location.replace("/");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary rounded-full px-5 py-2 text-sm font-medium"
              >
                Start selling
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="bg-card px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-full border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </form>

              <div className="space-y-1">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/cart" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted">
                      <ShoppingCart className="h-4 w-4" /> Cart
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch("/api/logout", {
                          method: "POST",
                          credentials: "include",
                        });
                        window.location.replace("/");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted">
                      Sign in
                    </Link>
                    <Link href="/sign-up" className="block rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-medium text-white">
                      Start selling
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
