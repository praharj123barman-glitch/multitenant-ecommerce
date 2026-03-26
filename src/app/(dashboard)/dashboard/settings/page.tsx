"use client";

import { useTRPC } from "@/trpc/react";
import { Loader2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  stripeOnboardingComplete: boolean;
}

interface ConnectStatus {
  status: "not_created" | "incomplete" | "complete";
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

export default function DashboardSettingsPage() {
  const trpc = useTRPC();

  const { data: rawTenant } = trpc.tenants.myTenant.useQuery();
  const tenant = rawTenant as unknown as Tenant | null;

  const { data: rawStatus, isLoading: statusLoading } = trpc.stripe.getConnectStatus.useQuery(undefined, {
    enabled: !!tenant,
  });
  const connectStatus = rawStatus as unknown as ConnectStatus | undefined;

  const createAccount = trpc.stripe.createConnectAccount.useMutation({
    onSuccess: () => {
      getOnboarding.mutate();
    },
  });

  const getOnboarding = trpc.stripe.getOnboardingLink.useMutation({
    onSuccess: (data: { url: string }) => {
      window.location.href = data.url;
    },
  });

  const getDashboard = trpc.stripe.getDashboardLink.useMutation({
    onSuccess: (data: { url: string }) => {
      window.open(data.url, "_blank");
    },
  });

  const handleSetupStripe = () => {
    if (connectStatus?.status === "not_created") {
      createAccount.mutate();
    } else {
      getOnboarding.mutate();
    }
  };

  const isSettingUp = createAccount.isPending || getOnboarding.isPending;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Store info */}
      {tenant && (
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="font-semibold">Store Information</h2>
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Store Name</span>
              <p className="font-medium">{tenant.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Store URL</span>
              <p className="font-medium">multimart.com/store/{tenant.slug}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Connect */}
      <div className="mt-6 rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">Payment Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your Stripe account to receive payments from customers.
        </p>

        {statusLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking status...
          </div>
        ) : connectStatus?.status === "complete" ? (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Stripe Connected</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account is fully set up. You can receive payments.
            </p>
            <button
              onClick={() => getDashboard.mutate()}
              disabled={getDashboard.isPending}
              className="mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {getDashboard.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Open Stripe Dashboard
            </button>
          </div>
        ) : connectStatus?.status === "incomplete" ? (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Onboarding Incomplete</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete your Stripe onboarding to start receiving payments.
            </p>
            <button
              onClick={handleSetupStripe}
              disabled={isSettingUp}
              className="mt-4 flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              No Stripe account connected. Set up Stripe to start receiving payments.
            </p>
            <button
              onClick={handleSetupStripe}
              disabled={isSettingUp}
              className="mt-4 flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Connect Stripe"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
