"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useState, Suspense } from "react";
import { Search, SlidersHorizontal, X, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import type { Category, ProductListResult } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trpc = useTRPC();

  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sort") || "newest") as "newest" | "oldest" | "price-asc" | "price-desc" | "trending";
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
    minPrice: minPriceParam ? Number(minPriceParam) * 100 : undefined, // convert dollars to cents
    maxPrice: maxPriceParam ? Number(maxPriceParam) * 100 : undefined,
  });
  const productsData = rawProducts as unknown as ProductListResult | undefined;

  const updateSearch = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filters change
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
      {/* Search header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {query ? (
            <>
              Results for &ldquo;<span className="text-accent">{query}</span>&rdquo;
            </>
          ) : (
            "Browse Products"
          )}
        </h1>
        {productsData && (
          <p className="mt-1 text-sm text-muted-foreground">
            {productsData.totalDocs} product{productsData.totalDocs !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </form>
      </div>

      {/* Filters bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            showFilters
              ? "border-accent bg-accent/5 text-accent"
              : "hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => updateSearch({ sort: e.target.value })}
          className="rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:border-accent focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="trending">Trending</option>
        </select>

        {/* Active filter tags */}
        {selectedCategory && (
          <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
            {selectedCategory}
            <button onClick={() => updateSearch({ category: "" })}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-8 overflow-hidden"
          >
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      updateSearch({
                        category: selectedCategory === cat.slug ? "" : cat.slug,
                      })
                    }
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all ${
                      selectedCategory === cat.slug
                        ? "border-accent bg-accent text-white"
                        : "hover:border-accent hover:bg-accent/5"
                    }`}
                  >
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                  </button>
                ))}
                {categoriesList.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories yet. Add some from the admin panel.
                  </p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Price Range ($)
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onBlur={() => updateSearch({ minPrice: minPrice })}
                      onKeyDown={(e) => { if (e.key === "Enter") updateSearch({ minPrice: minPrice }); }}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    />
                    <span className="text-muted-foreground">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onBlur={() => updateSearch({ maxPrice: maxPrice })}
                      onKeyDown={(e) => { if (e.key === "Enter") updateSearch({ maxPrice: maxPrice }); }}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:border-accent focus:outline-none"
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
                className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
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
                      <span key={`ellipsis-${idx}`} className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => updateSearch({ page: String(page) })}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-accent text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
              </div>
              <button
                onClick={() => updateSearch({ page: String(currentPage + 1) })}
                disabled={!productsData.hasNextPage}
                className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 px-8 py-24 text-center">
          <Package className="mx-auto h-14 w-14 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
            No products found
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {query
              ? "Try adjusting your search or filters"
              : "Products will appear here once sellers add them"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110"
            >
              Clear filters
            </button>
          )}
        </div>
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
