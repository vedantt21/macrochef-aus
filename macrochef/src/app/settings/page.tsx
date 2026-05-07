"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, LinkButton } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";

export default function SettingsPage() {
  const [message, setMessage] = useState("");

  async function forgotPassword() {
    const response = await fetch("/api/auth/forgot-password", { method: "POST" });
    const data = await response.json();
    setMessage(data.message || "Password reset is coming soon.");
  }

  return (
    <AppShell>
      <div className="mx-auto grid max-w-4xl gap-6">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-300">Settings</p>
          <h1 className="mt-2 text-3xl font-black text-white">Account settings</h1>
        </div>
        <Card>
          <CardHeader title="Privacy" eyebrow="Profile" action={<LinkButton href="/profile/edit" variant="secondary">Edit</LinkButton>} />
          <p className="leading-7 text-zinc-400">Manage your public/private profile setting, bio, and macro goals from edit profile.</p>
        </Card>
        <Card>
          <CardHeader title="Password reset" eyebrow="Security" />
          <p className="leading-7 text-zinc-400">Password reset emails are coming soon. For now, keep your password somewhere safe and contact support if you lose access.</p>
          <Button className="mt-4" variant="secondary" onClick={forgotPassword}>Request reset</Button>
          {message ? <p className="mt-3 rounded-lg bg-zinc-900 p-3 text-sm text-emerald-200">{message}</p> : null}
        </Card>
        <Card>
          <CardHeader title="Preferences" eyebrow="Account" />
          <p className="leading-7 text-zinc-400">More account preferences, notifications, and export controls will live here as MacroChef grows.</p>
        </Card>
      </div>
    </AppShell>
  );
}
