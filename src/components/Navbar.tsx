"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import type { SessionUser } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { ThemeToggle } from "./ThemeToggle";
import { ShoppingCart, Search, Menu, X, User, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
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
          setScrolled(window.scrollY > 20);
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
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Floating pill nav */}
      <div className="mx-auto max-w-7xl px-4 pt-4 lg:px-8">
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`flex h-14 items-center justify-between rounded-full px-3 transition-all duration-500 ${
            scrolled
              ? "glass-elevated"
              : "border border-transparent bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 pl-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg accent-gradient shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Multi<span className="gradient-text-cyan">Mart</span>
            </span>
          </Link>

          {/* Search — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 items-center justify-center px-8 md:flex"
          >
            <div
              className={`relative w-full max-w-md transition-all duration-300 ${
                searchFocused ? "max-w-lg" : ""
              }`}
            >
              <Search
                className={`pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                  searchFocused ? "text-accent" : "text-muted-foreground"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products, creators, stores..."
                className="w-full rounded-full border border-glass-border bg-muted/40 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:bg-card"
                style={{ borderColor: "var(--glass-border)" }}
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border-strong bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
                ⌘K
              </kbd>
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center gap-1 pr-1">
            <ThemeToggle />

            <Link
              href="/cart"
              className="relative rounded-full p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-background shadow-glow"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full accent-gradient text-xs font-bold text-background shadow-glow transition-transform hover:scale-105"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  {user.email[0]?.toUpperCase() || "U"}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                      className="glass-overlay absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl p-1.5"
                    >
                      <div className="border-b border-glass-border px-3 py-2.5" style={{ borderColor: "var(--glass-border)" }}>
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-glass-border py-1" style={{ borderColor: "var(--glass-border)" }}>
                        <button
                          onClick={async () => {
                            await fetch("/api/logout", { method: "POST", credentials: "include" });
                            window.location.replace("/");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="ml-1 hidden items-center gap-1.5 md:flex">
                <Link
                  href="/sign-in"
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-primary rounded-full px-4 py-1.5 text-sm"
                >
                  Start selling
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-1 rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl px-4 md:hidden lg:px-8"
          >
            <div className="glass-elevated rounded-2xl p-4">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-full border border-border bg-surface-raised py-2.5 pl-10 pr-4 text-sm"
                  />
                </div>
              </form>

              <div className="space-y-1">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
                    </Link>
                    <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" /> Cart
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch("/api/logout", { method: "POST", credentials: "include" });
                        window.location.replace("/");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                      Sign in
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="btn-primary block rounded-full px-3 py-2.5 text-center text-sm">
                      Start selling
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
