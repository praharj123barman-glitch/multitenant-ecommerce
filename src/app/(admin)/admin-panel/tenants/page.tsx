"use client";

import { useState, useCallback } from "react";
import { useTRPC } from "@/trpc/react";
import {
  Search,
  BadgeCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Store,
  ExternalLink,
  Filter,
} from "lucide-react";

export default function AdminTenantsPage() {
  const trpc = useTRPC();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<
    boolean | undefined
  >(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = trpc.admin.tenants.useQuery({
    page,
    limit: 10,
    search: search || undefined,
    verified: verifiedFilter,
  });

  const toggleVerified = trpc.admin.toggleVerified.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteTenant = trpc.admin.deleteTenant.useMutation({
    onSuccess: () => {
      setDeletingId(null);
      refetch();
    },
  });

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearch(searchInput);
      setPage(1);
    },
    [searchInput]
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View, verify, and manage all platform tenants
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </form>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={
              verifiedFilter === undefined ? "all" : String(verifiedFilter)
            }
            onChange={(e) => {
              const val = e.target.value;
              setVerifiedFilter(
                val === "all" ? undefined : val === "true"
              );
              setPage(1);
            }}
            className="rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="all">All Tenants</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : !data || data.tenants.length === 0 ? (
        <div className="mt-8 rounded-xl border-2 border-dashed py-16 text-center">
          <Store className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            {search
              ? "No tenants match your search."
              : "No tenants yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3">Store</th>
                    <th className="px-5 py-3">Owner</th>
                    <th className="px-5 py-3">Products</th>
                    <th className="px-5 py-3">Orders</th>
                    <th className="px-5 py-3">Stripe</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-muted/20">
                      <td className="px-5 py-3.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {tenant.name}
                            </span>
                            {tenant.verified && (
                              <BadgeCheck className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <a
                            href={`/store/${tenant.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
                          >
                            /{tenant.slug}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {tenant.owner ? (
                          <div>
                            <div className="text-sm">
                              {tenant.owner.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tenant.owner.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm">
                        {tenant.productCount}
                      </td>
                      <td className="px-5 py-3.5 text-sm">
                        {tenant.orderCount}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tenant.stripeOnboardingComplete
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {tenant.stripeOnboardingComplete
                            ? "Connected"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tenant.verified
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tenant.verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setTogglingId(tenant.id);
                              toggleVerified.mutate({
                                tenantId: tenant.id,
                              });
                            }}
                            disabled={toggleVerified.isPending && togglingId === tenant.id}
                            className={`rounded-lg p-2 text-sm transition-colors ${
                              tenant.verified
                                ? "text-blue-600 hover:bg-blue-50"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                            title={
                              tenant.verified
                                ? "Remove verification"
                                : "Verify tenant"
                            }
                          >
                            <BadgeCheck className="h-4 w-4" />
                          </button>

                          {deletingId === tenant.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  deleteTenant.mutate({
                                    tenantId: tenant.id,
                                  })
                                }
                                disabled={deleteTenant.isPending}
                                className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600"
                              >
                                {deleteTenant.isPending
                                  ? "..."
                                  : "Confirm"}
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(tenant.id)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete tenant"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages} (
                {data.totalDocs} tenants)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!data.hasPrevPage}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.hasNextPage}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
