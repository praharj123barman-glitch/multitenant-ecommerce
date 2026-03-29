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
  { name: "Templates", slug: "templates", icon: Store, color: "from-blue-500 to-blue-600", count: "2.4k" },
  { name: "Courses", slug: "courses", icon: Globe, color: "from-purple-500 to-purple-600", count: "1.8k" },
  { name: "E-Books", slug: "e-books", icon: Upload, color: "from-amber-500 to-amber-600", count: "3.1k" },
  { name: "Design Assets", slug: "design-assets", icon: Star, color: "from-pink-500 to-pink-600", count: "5.2k" },
  { name: "Software", slug: "software", icon: Zap, color: "from-emerald-500 to-emerald-600", count: "890" },
  { name: "Music", slug: "music", icon: Shield, color: "from-red-500 to-red-600", count: "1.2k" },
  { name: "Photography", slug: "photography", icon: CreditCard, color: "from-cyan-500 to-cyan-600", count: "2.7k" },
  { name: "Videos", slug: "videos", icon: ArrowRight, color: "from-orange-500 to-orange-600", count: "640" },
];

const stats = [
  { label: "Active Creators", value: "12K+" },
  { label: "Digital Products", value: "48K+" },
  { label: "Happy Customers", value: "200K+" },
  { label: "Paid to Creators", value: "$8M+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 dot-pattern opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Zap className="h-3.5 w-3.5 text-accent" />
                Trusted by 12,000+ creators worldwide
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-foreground lg:text-7xl"
            >
              Sell Digital Products{" "}
              <span className="gradient-text">Your Way</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground lg:text-xl"
            >
              Launch your own storefront, upload digital products, and start
              earning. We handle payments, delivery, and everything in between.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="btn-primary group flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold"
              >
                Start Selling for Free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:border-accent/30 hover:bg-muted hover:shadow-md"
              >
                Browse Products
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-24 grid max-w-2xl grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md hover-lift"
              >
                <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Browse by Category
              </h2>
              <p className="mt-2 text-muted-foreground">
                Find exactly what you need from thousands of digital products
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden items-center gap-1 text-sm font-medium text-accent transition-all duration-200 hover:gap-2 md:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
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
                  href={`/categories/${category.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-400 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 hover-lift"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-card-foreground transition-colors duration-200 group-hover:text-accent">
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
      <section className="relative overflow-hidden border-t border-border py-24">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
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
                className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-400 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover-lift"
              >
                <div className="absolute -top-3 left-8">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-md shadow-accent/30">
                    {i + 1}
                  </span>
                </div>
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${step.color} p-3.5 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-card-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="mt-2 text-muted-foreground">
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
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-400 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover-lift"
              >
                <div className="inline-flex rounded-xl bg-accent/10 p-3 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-card-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent-dark to-purple-700 px-8 py-20 text-center text-white lg:px-16"
          >
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight lg:text-5xl">
                Ready to start your creator journey?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
                Join thousands of creators already earning on MultiMart. No
                monthly fees — only pay when you sell.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-accent-dark shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Create Your Store
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/search"
                  className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
