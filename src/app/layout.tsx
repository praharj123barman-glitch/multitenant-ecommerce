import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MultiMart — The infrastructure for digital commerce",
  description: "Launch your storefront, ship digital products, accept payments in minutes. Multi-tenant ecommerce built for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.className} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col grain">
        <div className="mesh-fixed" aria-hidden="true" />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
