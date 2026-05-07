"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Logo } from "@/components/Navbar";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Unable to verify email.");
      return;
    }
    router.push("/dashboard");
  }

  async function resend() {
    setError("");
    setMessage("");
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to resend code.");
      return;
    }
    setMessage("Verification code sent.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="text-2xl font-black text-white">Verify your email</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Enter the six-digit code sent to your inbox. In dev mode, the code is printed in the server terminal when SMTP_SKIP_SEND=true.</p>
          <form onSubmit={verify} className="mt-6 grid gap-4">
            <input
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-white outline-none focus:border-emerald-400"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-white outline-none focus:border-emerald-400"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              required
            />
            {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
            {message ? <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p> : null}
            <Button disabled={loading}>{loading ? "Verifying..." : "Verify Email"}</Button>
            <Button type="button" variant="secondary" onClick={resend}>
              Resend code
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
