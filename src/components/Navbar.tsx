"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import type { SessionUser } from "@/types";
import { useCart } from "@/hooks/use-cart";
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

  const session = trpc.auth.session.useQuery();
  const user = (session.data as unknown as { user: SessionUser | null } | undefined)?.user;
  const cartCount = useCart((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
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
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-pink-500">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Multi<span className="text-accent">Mart</span>
          </span>
        </Link>

        {/* Search — desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center px-12 md:flex"
        >
          <div
            className={`relative w-full max-w-lg transition-all duration-300 ${
              searchFocused ? "max-w-xl" : ""
            }`}
          >
            <Search
              className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                searchFocused ? "text-accent" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products, creators, categories..."
              className={`w-full rounded-full border bg-muted py-2.5 pl-10 pr-4 text-sm transition-all duration-300 placeholder:text-muted-foreground focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                searchFocused ? "shadow-lg shadow-accent/5" : ""
              }`}
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/cart"
                className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-muted hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-pink-500 text-xs font-bold text-white">
                    {user.email[0]?.toUpperCase() || "U"}
                  </div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white p-1.5 shadow-xl"
                    >
                      <div className="border-b px-3 py-2.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-muted"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-muted"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t py-1">
                        <button
                          onClick={async () => {
                            await fetch("/api/logout", {
                              method: "POST",
                              credentials: "include",
                            });
                            window.location.replace("/");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
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
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-muted hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-gradient-to-r from-accent to-accent-dark px-5 py-2 text-sm font-medium text-white shadow-md shadow-accent/25 transition-all hover:shadow-lg hover:shadow-accent/30 hover:brightness-110"
              >
                Start selling
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2.5 text-gray-600 transition-colors hover:bg-muted md:hidden"
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t md:hidden"
          >
            <div className="bg-white px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-full border bg-muted py-2.5 pl-10 pr-4 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </form>

              <div className="space-y-1">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-muted">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/cart" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-muted">
                      <ShoppingCart className="h-4 w-4" /> Cart
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch("/api/users/logout", {
                          method: "POST",
                          credentials: "include",
                        });
                        window.location.href = "/";
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-muted">
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
