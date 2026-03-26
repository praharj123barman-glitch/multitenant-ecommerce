"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Store, Loader2, Check, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateStorePage() {
  const router = useRouter();
  const trpc = useTRPC();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createStore = useMutation({
    ...trpc.tenants.create.mutationOptions(),
    onSuccess: (data: { slug: string }) => {
      router.push(`/store/${data.slug}`);
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50)
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    createStore.mutate({ name, slug, description: description || undefined });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-pink-500">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Create Your Store
          </h1>
          <p className="mt-2 text-muted-foreground">
            Set up your storefront and start selling digital products
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          {/* Store name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Store name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              maxLength={100}
              className="w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Sarah's Design Studio"
            />
          </div>

          {/* Store URL */}
          <div>
            <label htmlFor="slug" className="mb-1.5 block text-sm font-medium">
              Store URL
            </label>
            <div className="flex items-center overflow-hidden rounded-xl border bg-white transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
              <span className="flex items-center gap-1.5 bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                multimart.com/store/
              </span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "")
                      .slice(0, 50)
                  )
                }
                required
                className="flex-1 px-4 py-3 text-sm focus:outline-none"
                placeholder="sarahs-studio"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              This will also be your subdomain: <strong>{slug || "your-store"}.multimart.com</strong>
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Tell customers what your store is about..."
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          {/* What you get */}
          <div className="rounded-xl border bg-muted/30 p-5">
            <h3 className="text-sm font-semibold">What you get</h3>
            <ul className="mt-3 space-y-2.5">
              {[
                "Your own branded storefront",
                "Custom subdomain (your-store.multimart.com)",
                "Product management dashboard",
                "Direct payments via Stripe Connect",
                "Customer reviews and analytics",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={createStore.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-dark px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
          >
            {createStore.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating store...
              </>
            ) : (
              <>
                <Store className="h-4 w-4" />
                Create Store
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
