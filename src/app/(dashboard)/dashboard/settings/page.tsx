"use client";

import { useTRPC } from "@/trpc/react";
import { Loader2, ExternalLink, CheckCircle, AlertCircle, Wallet, Store } from "lucide-react";
import { motion } from "framer-motion";

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

const ease = [0.16, 1, 0.3, 1] as const;

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
    <div className="mx-auto max-w-3xl space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <p className="label-mono text-accent">Configuration</p>
        <h1 className="display mt-3 text-4xl text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your store profile and payment integrations.
        </p>
      </motion.header>

      {/* Store info */}
      {tenant && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.08 }}
          className="glass-card rounded-3xl p-7"
        >
          <div className="flex items-start gap-4">
            <div className="glass-elevated flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Store className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">Store Profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your storefront identity. Visible to customers.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="label-mono text-muted-foreground">Store Name</p>
              <p className="mt-2 text-sm font-medium text-foreground">{tenant.name}</p>
            </div>
            <div>
              <p className="label-mono text-muted-foreground">Store URL</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                multimart.com/store/<span className="text-accent">{tenant.slug}</span>
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* Stripe Connect */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.15 }}
        className="glass-card rounded-3xl p-7"
      >
        <div className="flex items-start gap-4">
          <div className="glass-elevated flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Wallet className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Payment Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Stripe Connect powers your payouts. Direct deposits, automatic tax handling.
            </p>
          </div>
        </div>

        {statusLoading ? (
          <div className="mt-6 flex items-center gap-2.5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            Checking Stripe status...
          </div>
        ) : connectStatus?.status === "complete" ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="pill pill-success">
                <CheckCircle className="h-3 w-3" />
                Connected
              </span>
              <span className="text-xs text-muted-foreground">
                Charges {connectStatus.chargesEnabled ? "enabled" : "disabled"} · Payouts{" "}
                {connectStatus.payoutsEnabled ? "enabled" : "disabled"}
              </span>
            </div>
            <button
              onClick={() => getDashboard.mutate()}
              disabled={getDashboard.isPending}
              className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="pill pill-warning">
                <AlertCircle className="h-3 w-3" />
                Onboarding incomplete
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Finish your Stripe onboarding to start receiving payouts.
            </p>
            <button
              onClick={handleSetupStripe}
              disabled={isSettingUp}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Complete onboarding"
              )}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="pill pill-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Not connected
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect Stripe to start accepting customer payments.
            </p>
            <button
              onClick={handleSetupStripe}
              disabled={isSettingUp}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
      </motion.section>
    </div>
  );
}
