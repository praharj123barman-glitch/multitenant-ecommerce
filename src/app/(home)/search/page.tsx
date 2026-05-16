"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useState, Suspense } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Package,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import type { Category, ProductListResult } from "@/types";

const ease = [0.16, 1, 0.3, 1] as const;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trpc = useTRPC();

  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sort") || "newest") as
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "trending";
  const currentPage = Number(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const { data: rawCategories } = trpc.categories.getAll.useQuery();
  const categoriesList = (rawCategories || []) as unknown as Category[];

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const { data: rawProducts, isLoading: productsLoading } = trpc.products.list.useQuery({
    search: query || undefined,
    category: selectedCategory || undefined,
    sort: sortBy,
    page: currentPage,
    limit: 12,
    minPrice: minPriceParam ? Number(minPriceParam) * 100 : undefined,
    maxPrice: maxPriceParam ? Number(maxPriceParam) * 100 : undefined,
  });
  const productsData = rawProducts as unknown as ProductListResult | undefined;

  const updateSearch = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!updates.page) params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSearch({ q: searchInput });
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/search");
  };

  const hasActiveFilters = query || selectedCategory || sortBy !== "newest";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mb-8"
      >
        <p className="label-mono text-accent">Marketplace</p>
        <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">
          {query ? (
            <>
              Results for <span className="gradient-text-cyan">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Browse all products"
          )}
        </h1>
        {productsData && (
          <p className="mt-2 text-sm text-muted-foreground">
            {productsData.totalDocs} {productsData.totalDocs === 1 ? "product" : "products"} found
          </p>
        )}

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, creators, categories..."
              className="w-full rounded-full border py-3 pl-11 pr-4 text-sm"
              style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
            />
          </div>
        </form>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.1 }}
        className="mb-8 flex flex-wrap items-center gap-2"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
            showFilters ? "border-accent text-accent" : "hover:text-foreground"
          }`}
          style={{ backgroundColor: showFilters ? "var(--glass-bg)" : "transparent", borderColor: showFilters ? "var(--accent)" : "var(--border)" }}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>

        <select
          value={sortBy}
          onChange={(e) => updateSearch({ sort: e.target.value })}
          className="rounded-full border px-4 py-2 text-xs font-medium"
          style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="trending">Trending</option>
        </select>

        {selectedCategory && (
          <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-[11px] font-medium text-accent">
            {selectedCategory}
            <button onClick={() => updateSearch({ category: "" })} aria-label="Clear category">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </motion.div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass-card rounded-2xl p-6">
              <p className="label-mono mb-4 text-muted-foreground">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      updateSearch({ category: selectedCategory === cat.slug ? "" : cat.slug })
                    }
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? "border-accent bg-accent text-background"
                        : "border-transparent hover:border-accent/40 text-foreground"
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory === cat.slug ? undefined : "var(--glass-bg)",
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
                {categoriesList.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No categories yet — add some from the admin panel.
                  </p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="label-mono mb-3 text-muted-foreground">Price range ($)</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onBlur={() => updateSearch({ minPrice })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateSearch({ minPrice });
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: "var(--surface-raised)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <span className="text-muted-foreground">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onBlur={() => updateSearch({ maxPrice })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateSearch({ maxPrice });
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: "var(--surface-raised)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products grid */}
      {productsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : productsData && productsData.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData.products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {productsData.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => updateSearch({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--glass-bg)" }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {(() => {
                  const total = productsData.totalPages;
                  const current = currentPage;
                  const pages: (number | "ellipsis")[] = [];
                  if (total <= 7) {
                    for (let i = 1; i <= total; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (current > 3) pages.push("ellipsis");
                    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                      pages.push(i);
                    }
                    if (current < total - 2) pages.push("ellipsis");
                    pages.push(total);
                  }
                  return pages.map((page, idx) =>
                    page === "ellipsis" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => updateSearch({ page: String(page) })}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                          currentPage === page
                            ? "accent-gradient text-background shadow-glow"
                            : "text-foreground hover:bg-white/5"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  );
                })()}
              </div>
              <button
                onClick={() => updateSearch({ page: String(currentPage + 1) })}
                disabled={!productsData.hasNextPage}
                className="flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--glass-bg)" }}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="glass-card rounded-3xl py-20 text-center"
        >
          <div className="glass-elevated mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
            <Package className="h-6 w-6 text-accent" />
          </div>
          <p className="label-mono mt-7 text-accent">No matches</p>
          <h3 className="display mt-3 text-2xl text-foreground">No products found</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            {query
              ? "Try adjusting your search or filters — or browse all products."
              : "Products will appear here once sellers add them."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
