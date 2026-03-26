"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Store,
  Upload,
  CreditCard,
  Star,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const categories = [
  { name: "Templates", icon: "📄", color: "from-blue-500/10 to-blue-600/10", border: "hover:border-blue-400", count: "2.4k" },
  { name: "Courses", icon: "🎓", color: "from-purple-500/10 to-purple-600/10", border: "hover:border-purple-400", count: "1.8k" },
  { name: "E-Books", icon: "📚", color: "from-amber-500/10 to-amber-600/10", border: "hover:border-amber-400", count: "3.1k" },
  { name: "Design Assets", icon: "🎨", color: "from-pink-500/10 to-pink-600/10", border: "hover:border-pink-400", count: "5.2k" },
  { name: "Software", icon: "💻", color: "from-emerald-500/10 to-emerald-600/10", border: "hover:border-emerald-400", count: "890" },
  { name: "Music", icon: "🎵", color: "from-red-500/10 to-red-600/10", border: "hover:border-red-400", count: "1.2k" },
  { name: "Photography", icon: "📷", color: "from-cyan-500/10 to-cyan-600/10", border: "hover:border-cyan-400", count: "2.7k" },
  { name: "Videos", icon: "🎬", color: "from-orange-500/10 to-orange-600/10", border: "hover:border-orange-400", count: "640" },
];

const stats = [
  { label: "Active Creators", value: "12K+" },
  { label: "Digital Products", value: "48K+" },
  { label: "Happy Customers", value: "200K+" },
  { label: "Paid to Creators", value: "$8M+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-pink-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Zap className="h-3.5 w-3.5 text-accent" />
                Trusted by 12,000+ creators worldwide
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-5xl font-bold leading-tight tracking-tight lg:text-7xl"
            >
              Sell Digital Products{" "}
              <span className="gradient-text">Your Way</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground lg:text-xl"
            >
              Launch your own storefront, upload digital products, and start
              earning. We handle payments, delivery, and everything in between.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-dark px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:brightness-110"
              >
                Start Selling for Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Browse Products
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border bg-white p-5 text-center shadow-sm"
              >
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Browse by Category
              </h2>
              <p className="mt-2 text-muted-foreground">
                Find exactly what you need from thousands of digital products
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden items-center gap-1 text-sm font-medium text-accent hover:underline md:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  href={`/categories/${category.name.toLowerCase()}`}
                  className={`group flex items-center gap-4 rounded-xl border bg-gradient-to-br ${category.color} p-5 transition-all duration-300 hover:shadow-md ${category.border}`}
                >
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <span className="font-semibold group-hover:text-foreground">
                      {category.name}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {category.count} products
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden border-t py-20">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Start Selling in Minutes
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three simple steps to launch your digital product business
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Create Your Store",
                description:
                  "Sign up and get your own branded storefront with a custom subdomain. No coding required.",
                color: "from-accent to-blue-600",
              },
              {
                icon: Upload,
                title: "Upload Products",
                description:
                  "Add digital products with rich descriptions, pricing tiers, and instant file delivery.",
                color: "from-pink-500 to-rose-600",
              },
              {
                icon: CreditCard,
                title: "Get Paid Instantly",
                description:
                  "Receive payments directly via Stripe Connect. We handle fees, taxes, and payouts.",
                color: "from-amber-500 to-orange-600",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute -top-3 left-8">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${step.color} p-3 text-white`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-foreground py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="mt-2 text-gray-400">
              Built for creators who want full control over their business
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Globe,
                title: "Custom Storefronts",
                description: "Each seller gets their own branded subdomain and storefront.",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Stripe-powered checkout with automatic fraud protection.",
              },
              {
                icon: Zap,
                title: "Instant Delivery",
                description: "Files delivered automatically after purchase, every time.",
              },
              {
                icon: Star,
                title: "Reviews & Ratings",
                description: "Build trust with verified customer reviews on every product.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <feature.icon className="h-5 w-5 text-accent-light" />
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent-dark to-purple-700 px-8 py-16 text-center text-white lg:px-16">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Ready to start your creator journey?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
                Join thousands of creators already earning on MultiMart. No
                monthly fees — only pay when you sell.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="group flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-accent-dark shadow-lg transition-all hover:shadow-xl"
                >
                  Create Your Store
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/search"
                  className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
