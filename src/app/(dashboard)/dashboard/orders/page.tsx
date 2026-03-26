"use client";

import { ShoppingBag } from "lucide-react";

export default function DashboardOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="mt-6 rounded-2xl border-2 border-dashed py-16 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h3 className="mt-4 font-semibold text-muted-foreground">
          No orders yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders from customers will appear here once you make your first sale.
        </p>
      </div>
    </div>
  );
}
