import Link from "next/link";

const footerLinks = {
  Marketplace: [
    { label: "Browse Products", href: "/search" },
    { label: "Categories", href: "/categories" },
    { label: "Trending", href: "/search?sort=trending" },
    { label: "New Arrivals", href: "/search?sort=newest" },
  ],
  Sellers: [
    { label: "Start Selling", href: "/sign-up" },
    { label: "Seller Dashboard", href: "/dashboard" },
    { label: "Create Store", href: "/create-store" },
  ],
  Company: [
    { label: "About", href: "/search" },
    { label: "Categories", href: "/categories" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/search" },
    { label: "Terms of Service", href: "/search" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-pink-500 shadow-md shadow-accent/25">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-lg font-bold text-foreground">MultiMart</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The marketplace where creators build their own storefronts and
              sell digital products directly to customers.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MultiMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
