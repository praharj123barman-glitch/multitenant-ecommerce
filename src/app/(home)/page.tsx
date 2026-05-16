"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Store,
  Upload,
  CreditCard,
  Star,
  Shield,
  Zap,
  Globe,
  Sparkles,
  Boxes,
  Layers,
  Wallet,
} from "lucide-react";

const categories = [
  { name: "Templates", slug: "templates", count: "2.4k" },
  { name: "Courses", slug: "courses", count: "1.8k" },
  { name: "E-Books", slug: "e-books", count: "3.1k" },
  { name: "Design Assets", slug: "design-assets", count: "5.2k" },
  { name: "Software", slug: "software", count: "890" },
  { name: "Music", slug: "music", count: "1.2k" },
  { name: "Photography", slug: "photography", count: "2.7k" },
  { name: "Videos", slug: "videos", count: "640" },
];

const stats = [
  { value: "12K+", label: "Active creators" },
  { value: "48K+", label: "Digital products" },
  { value: "200K+", label: "Happy customers" },
  { value: "$8M+", label: "Paid to creators" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.06, duration: 0.7, ease },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function Home() {
  return (
    <div>
      {/* ═══════════════════════════════════════════════
         HERO — Massive type, mesh, single CTA
         ═══════════════════════════════════════════════ */}
      <section className="hero-orbs relative">
        <div className="grid-pattern absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-32 lg:px-8 lg:pt-32 lg:pb-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex justify-center"
            >
              <Link
                href="/categories"
                className="glass-base group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-foreground/80 transition-all hover:text-foreground"
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent pulse-glow" />
                Now serving 12,000+ creators worldwide
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Display headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="display mt-7 text-[3.5rem] text-foreground sm:text-7xl lg:text-[6.5rem]"
            >
              The infrastructure
              <br />
              for digital{" "}
              <span className="gradient-text">commerce.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Launch your storefront, ship digital products, accept payments —
              in minutes. Multi-tenant ecommerce built for creators who refuse
              to plug into someone else&apos;s platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="btn-primary group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm"
              >
                Start your store free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/search"
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
              >
                Browse marketplace
              </Link>
            </motion.div>

            {/* Inline stats ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground"
            >
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{s.value}</span>
                  <span>{s.label}</span>
                  {i < stats.length - 1 && (
                    <span className="hidden text-border-strong sm:inline">·</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         LOGO MARQUEE
         ═══════════════════════════════════════════════ */}
      <section className="relative py-14">
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Trusted by creators building on
        </p>
        <div className="fade-mask-x relative mt-8 overflow-hidden">
          <div className="marquee flex w-max items-center gap-16 whitespace-nowrap text-lg font-semibold text-foreground/50">
            {[
              "Stripe", "Vercel", "Resend", "PostHog", "Linear", "Cloudflare",
              "Supabase", "Notion", "Figma", "GitHub",
              "Stripe", "Vercel", "Resend", "PostHog", "Linear", "Cloudflare",
              "Supabase", "Notion", "Figma", "GitHub",
            ].map((name, i) => (
              <span key={i} className="opacity-60 hover:opacity-100">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         BENTO — Features grid (irregular layout)
         ═══════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Built for scale
            </p>
            <h2 className="display mt-4 text-4xl text-foreground sm:text-5xl">
              Everything you need to{" "}
              <span className="gradient-text-cyan">ship.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              The full stack — storefront, payments, file delivery, analytics, reviews — in one platform.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6"
          >
            {/* Big left card */}
            <motion.div variants={item} className="glass-card md:col-span-4 md:row-span-2 overflow-hidden rounded-3xl p-8 lg:p-10">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                    <Boxes className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Multi-tenant
                  </span>
                </div>
                <h3 className="display mt-6 text-3xl text-foreground lg:text-4xl">
                  Every seller, their own storefront.
                </h3>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Each creator gets a branded subdomain, custom theme, and isolated catalog.
                  Run as a marketplace or white-label the whole platform.
                </p>

                {/* Visual */}
                <div className="relative mt-auto pt-10">
                  <div className="grid grid-cols-3 gap-3">
                    {["acme", "studio", "labs"].map((sub, i) => (
                      <div key={sub} className="glass-base rounded-xl p-3" style={{ opacity: 1 - i * 0.2 }}>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {sub}.multimart.com
                        </div>
                        <div className="mt-2 h-1.5 w-12 rounded-full accent-gradient" />
                        <div className="mt-1.5 h-1.5 w-8 rounded-full bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top right */}
            <motion.div variants={item} className="glass-card md:col-span-2 overflow-hidden rounded-3xl p-7">
              <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">Stripe Connect</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Direct payouts to each seller. We handle fees, taxes, and 1099s.
              </p>
            </motion.div>

            {/* Bottom right */}
            <motion.div variants={item} className="glass-card md:col-span-2 overflow-hidden rounded-3xl p-7">
              <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">Instant delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Files served via CDN the moment payment clears. No webhooks to wire.
              </p>
            </motion.div>

            {/* Bottom row — three small */}
            <motion.div variants={item} className="glass-card md:col-span-2 overflow-hidden rounded-3xl p-7">
              <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">Fraud protection</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Stripe Radar + tenant-scoped rate limits ship by default.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card md:col-span-2 overflow-hidden rounded-3xl p-7">
              <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">Verified reviews</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Buyers only review purchases. Sellers earn social proof that converts.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card md:col-span-2 overflow-hidden rounded-3xl p-7">
              <div className="glass-elevated flex h-10 w-10 items-center justify-center rounded-xl">
                <Layers className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">Tiered pricing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Free + Pro + Enterprise tiers per product. Discounts run on schedule.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         CATEGORY SCROLLER
         ═══════════════════════════════════════════════ */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Browse
              </p>
              <h2 className="display mt-3 text-3xl text-foreground sm:text-4xl">
                What are you shipping?
              </h2>
            </motion.div>
            <Link
              href="/categories"
              className="link-underline hidden items-center gap-1 text-sm font-medium text-foreground md:flex"
            >
              View all categories <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4"
          >
            {categories.map((category, i) => (
              <motion.div
                key={category.name}
                variants={item}
                custom={i}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="glass-card group flex items-center justify-between rounded-2xl p-5"
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                      {category.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {category.count} products
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         3-STEP "How it works"
         ═══════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Get started
            </p>
            <h2 className="display mt-4 text-4xl text-foreground sm:text-5xl">
              From signup to first sale in{" "}
              <span className="gradient-text">under 10 minutes.</span>
            </h2>
          </motion.div>

          <div className="relative mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute inset-x-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent md:block" />

            {[
              { num: "01", icon: Store, title: "Create your store", desc: "Sign up, claim a subdomain, drop in your brand. You're live." },
              { num: "02", icon: Upload, title: "Upload products", desc: "Drag files, set prices, write descriptions. Tiers, discounts, the lot." },
              { num: "03", icon: CreditCard, title: "Get paid instantly", desc: "Customers buy, Stripe pays you. Files deliver themselves." },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="glass-card relative overflow-hidden rounded-3xl p-8"
              >
                <div className="flex items-center gap-4">
                  <div className="glass-elevated relative z-10 flex h-12 w-12 items-center justify-center rounded-xl">
                    <step.icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-foreground/15">
                    {step.num}
                  </span>
                </div>
                <h3 className="display mt-6 text-2xl text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         CTA — Final
         ═══════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="hero-orbs glass-elevated relative overflow-hidden rounded-[2.5rem] px-8 py-24 text-center lg:px-16 lg:py-32"
          >
            <div className="grid-pattern absolute inset-0 opacity-20" />

            <div className="relative">
              <Sparkles className="mx-auto h-8 w-8 text-accent" />
              <h2 className="display mt-8 text-4xl text-foreground sm:text-6xl lg:text-7xl">
                Stop renting.
                <br />
                <span className="gradient-text">Start owning.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-muted-foreground sm:text-lg">
                Your storefront, your subdomain, your customers, your data.
                Free to start — only pay when you sell.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm"
                >
                  Create your store
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/search"
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium"
                >
                  Explore marketplace
                </Link>
              </div>
              <p className="mt-8 text-xs text-muted-foreground">
                No credit card required · 2.5% per transaction · Free forever
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
