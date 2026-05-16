"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Loader2,
  FileText,
  GraduationCap,
  BookOpen,
  Palette,
  Code2,
  Music2,
  Camera,
  Video,
  Box,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";

const ease = [0.16, 1, 0.3, 1] as const;

const fallbackCategories: Array<{ name: string; slug: string; icon: LucideIcon }> = [
  { name: "Templates", slug: "templates", icon: FileText },
  { name: "Courses", slug: "courses", icon: GraduationCap },
  { name: "E-Books", slug: "e-books", icon: BookOpen },
  { name: "Design Assets", slug: "design-assets", icon: Palette },
  { name: "Software", slug: "software", icon: Code2 },
  { name: "Music", slug: "music", icon: Music2 },
  { name: "Photography", slug: "photography", icon: Camera },
  { name: "Videos", slug: "videos", icon: Video },
];

const fallbackIconMap: Record<string, LucideIcon> = Object.fromEntries(
  fallbackCategories.map((c) => [c.slug, c.icon]),
);

export default function CategoriesPage() {
  const trpc = useTRPC();
  const { data: rawCategories, isLoading } = trpc.categories.getAll.useQuery();
  const categories = (rawCategories || []) as unknown as Category[];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mb-12"
      >
        <p className="label-mono text-accent">Browse</p>
        <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">All categories</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {displayCategories.length} categories · thousands of digital products
        </p>
      </motion.header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayCategories.map((category, i) => {
            const slug = category.slug;
            const Icon =
              "icon" in category && typeof (category as { icon: unknown }).icon !== "string"
                ? ((category as { icon: LucideIcon }).icon as LucideIcon)
                : fallbackIconMap[slug] || Box;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.05 + i * 0.04 }}
              >
                <Link
                  href={`/categories/${slug}`}
                  className="glass-card hover-3d group flex items-center justify-between rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="glass-elevated flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                        {category.name}
                      </h3>
                      {"description" in category && (category as { description?: string }).description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {(category as { description: string }).description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
