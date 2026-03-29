"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
      // Auto-login after registration
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
        // Fall back to sign-in page
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
    <div>
      {/* Mobile logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-pink-500">
          <span className="text-sm font-bold text-white">M</span>
        </div>
        <span className="text-lg font-bold tracking-tight">
          Multi<span className="text-accent">Mart</span>
        </span>
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
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
              className="w-full rounded-lg border bg-white px-4 py-2.5 pr-11 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={register.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-dark px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
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
        <Link href="#" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
