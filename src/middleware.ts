import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip for API routes, admin, _next, and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the base domain from env
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

  // Check if request is from a subdomain
  // e.g., sarahs-studio.multimart.com or sarahs-studio.localhost:3000
  const currentHost = hostname.replace(`:${request.nextUrl.port}`, "");
  const baseDomain = appDomain.replace(`:${request.nextUrl.port}`, "").replace(/:\d+$/, "");

  // If the hostname has a subdomain
  if (currentHost !== baseDomain && currentHost.endsWith(baseDomain)) {
    const subdomain = currentHost.replace(`.${baseDomain}`, "");

    // Rewrite to the store page with the subdomain as slug
    const url = request.nextUrl.clone();
    url.pathname = `/store/${subdomain}${pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
