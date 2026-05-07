"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Logo } from "@/components/Navbar";

const inputClass = "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-white outline-none focus:border-emerald-400";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Unable to register.");
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(String(payload.email))}`);
  }

  return (
    <main className="grid min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 lg:grid-cols-[1fr_520px]">
      <section className="hidden items-center p-10 lg:flex">
        <div>
          <Logo />
          <h1 className="mt-10 max-w-2xl text-5xl font-black text-white">Start tracking meals with a recipe feed that knows your macros.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">Create an account, verify your email, and begin logging food or sharing recipes with friends.</p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-black text-white">Create account</h2>
          <p className="mt-2 text-sm text-zinc-400">Email verification is required before using the app.</p>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              Email
              <input className={inputClass} name="email" type="email" required />
            </label>
            <label className="grid gap-2 text-sm">
              Username
              <input className={inputClass} name="username" required minLength={3} />
            </label>
            <label className="grid gap-2 text-sm">
              Display name
              <input className={inputClass} name="displayName" required />
            </label>
            <label className="grid gap-2 text-sm">
              Password
              <input className={inputClass} name="password" type="password" required minLength={8} />
            </label>
            {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
            <Button disabled={loading}>{loading ? "Creating..." : "Get Started"}</Button>
          </form>
          <p className="mt-5 text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-300">
              Login
            </Link>
          </p>
        </Card>
      </section>
    </main>
  );
}
