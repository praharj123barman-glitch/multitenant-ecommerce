"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Store, Loader2, Check, Globe, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const benefits = [
  "Your own branded storefront",
  "Custom subdomain (your-store.multimart.com)",
  "Product management dashboard",
  "Direct payments via Stripe Connect",
  "Customer reviews + analytics",
  "Instant file delivery via CDN",
];

export default function CreateStorePage() {
  const router = useRouter();
  const trpc = useTRPC();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createStore = trpc.tenants.create.useMutation({
    onSuccess: (data: { slug: string }) => {
      router.push(`/store/${data.slug}`);
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
        .slice(0, 50),
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    createStore.mutate({ name, slug, description: description || undefined });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="text-center"
      >
        <div className="glass-elevated mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
          <Store className="h-7 w-7 text-accent" />
        </div>
        <p className="label-mono mt-7 text-accent">Get started</p>
        <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Create your store</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Claim a subdomain, drop in your brand, start shipping. Takes 30 seconds.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
        className="glass-card mt-10 space-y-6 rounded-3xl p-7"
      >
        {/* Store name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Store name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-xl border px-4 py-3 text-sm"
            style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
            placeholder="Sarah's Design Studio"
          />
        </div>

        {/* Store URL */}
        <div>
          <label htmlFor="slug" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Store URL
          </label>
          <div
            className="flex items-center overflow-hidden rounded-xl border"
            style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
          >
            <span className="flex items-center gap-1.5 border-r px-4 py-3 text-sm text-muted-foreground" style={{ borderColor: "var(--border)" }}>
              <Globe className="h-3.5 w-3.5" />
              multimart.com/store/
            </span>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 50))
              }
              required
              className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
              placeholder="sarahs-studio"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Also your subdomain: <span className="font-medium text-foreground">{slug || "your-store"}.multimart.com</span>
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description <span className="ml-1 text-muted-foreground/60">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full resize-none rounded-xl border px-4 py-3 text-sm"
            style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
            placeholder="Tell customers what your store is about..."
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">{description.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={createStore.isPending}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createStore.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating store...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Launch store
            </>
          )}
        </button>
      </motion.form>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.2 }}
        className="glass-card mt-6 rounded-3xl p-7"
      >
        <p className="label-mono text-accent">What's included</p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">Every store gets</h3>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
              <span className="glass-elevated mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <Check className="h-3 w-3 text-accent" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
