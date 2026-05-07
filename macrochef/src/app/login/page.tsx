"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Logo } from "@/components/Navbar";

const inputClass = "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-white outline-none focus:border-emerald-400";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      if (data.verificationRequired && data.email) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        return;
      }
      setError(data.error || "Unable to login.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 lg:grid-cols-[1fr_520px]">
      <section className="hidden items-center p-10 lg:flex">
        <div>
          <Logo />
          <h1 className="mt-10 max-w-2xl text-5xl font-black text-white">Welcome back to your kitchen dashboard.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">Log today’s meals, check progress, and see what your friends are cooking.</p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-black text-white">Login</h2>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              Email or username
              <input className={inputClass} name="identifier" required />
            </label>
            <label className="grid gap-2 text-sm">
              Password
              <input className={inputClass} name="password" type="password" required />
            </label>
            {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
            <Button disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
          </form>
          <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-zinc-400">
            <Link href="/register" className="font-semibold text-emerald-300">
              Create account
            </Link>
            <button
              className="font-semibold text-zinc-300"
              onClick={() => alert("Password reset is coming soon.")}
              type="button"
            >
              Forgot password?
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
}
