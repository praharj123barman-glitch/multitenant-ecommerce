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
    { label: "Pricing", href: "#" },
    { label: "Seller Guide", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-pink-500">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-lg font-bold">MultiMart</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              The marketplace where creators build their own storefronts and
              sell digital products directly to customers.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                {title}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-white"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MultiMart. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-300">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-300">
              GitHub
            </Link>
            <Link href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-300">
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
