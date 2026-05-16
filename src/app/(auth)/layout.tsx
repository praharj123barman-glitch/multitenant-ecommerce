import Link from "next/link";
import { Sparkles, Shield, Zap, Layers } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full">
      {/* Left side — dark glass brand panel */}
      <div className="hero-orbs hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl accent-gradient shadow-glow transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Multi<span className="gradient-text-cyan">Mart</span>
          </span>
        </Link>

        {/* Middle: pitch + feature chips */}
        <div className="relative max-w-md">
          <h2 className="display text-4xl leading-tight text-foreground">
            The infrastructure for{" "}
            <span className="gradient-text">digital commerce.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Launch your storefront, ship digital products, accept payments — in minutes.
          </p>

          <ul className="mt-10 space-y-3">
            {[
              { icon: Layers, label: "Multi-tenant — your own subdomain" },
              { icon: Zap, label: "Instant file delivery via CDN" },
              { icon: Shield, label: "Stripe Connect with fraud protection" },
            ].map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <div className="glass-elevated flex h-8 w-8 items-center justify-center rounded-lg">
                  <f.icon className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm text-foreground/80">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MultiMart · Built for creators
        </p>
      </div>

      {/* Right side — form */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 lg:px-8">
        {/* Subtle glow on right panel too */}
        <div className="hero-orbs absolute inset-0 lg:hidden" aria-hidden="true" />
        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
