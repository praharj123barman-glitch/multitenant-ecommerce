"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Category } from "@/types";

const fallbackCategories: Array<{ name: string; slug: string; icon: string; color: string; description?: string }> = [
  { name: "Templates", slug: "templates", icon: "📄", color: "from-blue-500/10 to-blue-600/10" },
  { name: "Courses", slug: "courses", icon: "🎓", color: "from-purple-500/10 to-purple-600/10" },
  { name: "E-Books", slug: "e-books", icon: "📚", color: "from-amber-500/10 to-amber-600/10" },
  { name: "Design Assets", slug: "design-assets", icon: "🎨", color: "from-pink-500/10 to-pink-600/10" },
  { name: "Software", slug: "software", icon: "💻", color: "from-emerald-500/10 to-emerald-600/10" },
  { name: "Music", slug: "music", icon: "🎵", color: "from-red-500/10 to-red-600/10" },
  { name: "Photography", slug: "photography", icon: "📷", color: "from-cyan-500/10 to-cyan-600/10" },
  { name: "Videos", slug: "videos", icon: "🎬", color: "from-orange-500/10 to-orange-600/10" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function CategoriesPage() {
  const trpc = useTRPC();
  const { data: rawCategories, isLoading } = useQuery(
    trpc.categories.getAll.queryOptions()
  );
  const categories = (rawCategories || []) as unknown as Category[];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">All Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Browse thousands of digital products organized by category
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayCategories.map((category, i) => (
            <motion.div
              key={category.slug}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={`/categories/${category.slug}`}
                className={`group flex items-center justify-between rounded-2xl border bg-gradient-to-br ${
                  category.color || "from-gray-500/10 to-gray-600/10"
                } p-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{category.icon || "📦"}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
