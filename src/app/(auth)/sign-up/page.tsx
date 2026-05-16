"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const register = trpc.auth.register.useMutation({
    onSuccess: async () => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          router.push("/dashboard");
          router.refresh();
          return;
        }
      } catch {
        /* fall through */
      }
      router.push("/sign-in");
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    register.mutate({ name, email, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Mobile logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl accent-gradient shadow-glow">
          <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Multi<span className="gradient-text-cyan">Mart</span>
        </span>
      </Link>

      <h1 className="display text-3xl text-foreground">Create an account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Already have one?{" "}
        <Link href="/sign-in" className="font-medium text-accent transition-colors hover:text-accent-light">
          Sign in
        </Link>
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-xl border px-4 py-3 text-sm"
            style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border px-4 py-3 text-sm"
            style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border px-4 py-3 pr-11 text-sm"
              style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border)" }}
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={register.isPending}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {register.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="#" className="text-foreground/80 underline-offset-2 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-foreground/80 underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </motion.div>
  );
}
