"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";

const inputClass = "rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-emerald-400";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    dailyCalorieGoal: 2200,
    proteinGoal: 160,
    carbsGoal: 220,
    fatGoal: 70,
    isPrivate: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => response.json())
      .then((data) => {
        if (data.user) setForm((current) => ({ ...current, ...data.user, bio: data.user.bio || "" }));
      });
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to update profile.");
      return;
    }
    router.push("/profile");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader title="Edit profile" eyebrow="Goals and privacy" />
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-2 text-sm">
              Display name
              <input className={inputClass} value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
            </label>
            <label className="grid gap-2 text-sm">
              Bio
              <textarea className={`${inputClass} min-h-28`} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
            </label>
            <div className="grid gap-4 md:grid-cols-4">
              <NumberField label="Calories" value={form.dailyCalorieGoal} onChange={(value) => setForm({ ...form, dailyCalorieGoal: value })} />
              <NumberField label="Protein" value={form.proteinGoal} onChange={(value) => setForm({ ...form, proteinGoal: value })} />
              <NumberField label="Carbs" value={form.carbsGoal} onChange={(value) => setForm({ ...form, carbsGoal: value })} />
              <NumberField label="Fat" value={form.fatGoal} onChange={(value) => setForm({ ...form, fatGoal: value })} />
            </div>
            <label className="flex items-center gap-3 rounded-lg bg-zinc-900 p-4 text-sm">
              <input type="checkbox" checked={form.isPrivate} onChange={(event) => setForm({ ...form, isPrivate: event.target.checked })} />
              Make profile private
            </label>
            {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
            <Button>Save Profile</Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input className={inputClass} type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
