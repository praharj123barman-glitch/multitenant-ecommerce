"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [error, setError] = useState("");

  const { data: rawCategories } = trpc.categories.getAll.useQuery();
  const categories = (rawCategories || []) as unknown as Category[];

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard/products");
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 100)
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const priceInCents = Math.round(parseFloat(price) * 100);
    if (isNaN(priceInCents) || priceInCents < 0) {
      setError("Please enter a valid price");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    createProduct.mutate({
      name,
      slug,
      shortDescription: shortDescription || undefined,
      price: priceInCents,
      categoryId,
      status,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <h1 className="text-2xl font-bold">Add New Product</h1>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Product Details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Premium React Template"
              />
            </div>

            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium">
                URL Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                Short Description
              </label>
              <textarea
                id="description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Brief description of your product..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Pricing & Category</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full rounded-lg border py-2.5 pl-8 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="9.99"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Publishing</h2>
          <div className="flex gap-3">
            <label className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors ${status === "draft" ? "border-accent bg-accent/5 text-accent" : "border-border"}`}>
              <input type="radio" name="status" value="draft" checked={status === "draft"} onChange={() => setStatus("draft")} className="sr-only" />
              Save as Draft
            </label>
            <label className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors ${status === "active" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-border"}`}>
              <input type="radio" name="status" value="active" checked={status === "active"} onChange={() => setStatus("active")} className="sr-only" />
              Publish Now
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={createProduct.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:brightness-110 disabled:opacity-50"
        >
          {createProduct.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
}
