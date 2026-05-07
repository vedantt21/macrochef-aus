"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChefHat, Plus, UserRound, UsersRound } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button, LinkButton } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";
import FoodLogCard from "@/components/FoodLogCard";
import MacroProgressCard from "@/components/MacroProgressCard";

type FoodLog = {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  servingSize?: string | null;
  notes?: string | null;
};

type Summary = {
  totals: { calories: number; protein: number; carbs: number; fat: number };
  goals: { calories: number; protein: number; carbs: number; fat: number };
  remaining: { calories: number; protein: number; carbs: number; fat: number };
};

const today = () => new Date().toISOString().slice(0, 10);
const inputClass = "rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400";

export default function DashboardPage() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const date = today();

  const load = useCallback(async () => {
    const [logsResponse, summaryResponse] = await Promise.all([
      fetch(`/api/food-logs?date=${date}`),
      fetch(`/api/food-logs/summary?date=${date}`),
    ]);
    if (logsResponse.ok) setLogs((await logsResponse.json()).logs);
    if (summaryResponse.ok) setSummary(await summaryResponse.json());
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  async function quickAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(form.entries()), logDate: date };
    const response = await fetch("/api/food-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to add food.");
      return;
    }
    event.currentTarget.reset();
    load();
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-white">Today&apos;s nutrition</h1>
            <p className="mt-2 text-zinc-400">Calories, macros, and quick actions for {date}.</p>
          </div>
          <LinkButton href="/tracker" variant="secondary">Open Tracker</LinkButton>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MacroProgressCard label="Calories" value={summary?.totals.calories || 0} goal={summary?.goals.calories || 0} unit="" />
          <MacroProgressCard label="Protein" value={summary?.totals.protein || 0} goal={summary?.goals.protein || 0} />
          <MacroProgressCard label="Carbs" value={summary?.totals.carbs || 0} goal={summary?.goals.carbs || 0} />
          <MacroProgressCard label="Fat" value={summary?.totals.fat || 0} goal={summary?.goals.fat || 0} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader title="Quick add food" eyebrow="Log" />
            <form onSubmit={quickAdd} className="grid gap-3 md:grid-cols-4">
              <input className={`${inputClass} md:col-span-2`} name="foodName" placeholder="Food name" required />
              <input className={inputClass} name="servingSize" placeholder="Serving" />
              <select className={inputClass} name="mealType" defaultValue="LUNCH">
                {["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"].map((meal) => (
                  <option key={meal}>{meal}</option>
                ))}
              </select>
              <input className={inputClass} name="calories" type="number" min="0" placeholder="Calories" required />
              <input className={inputClass} name="protein" type="number" min="0" placeholder="Protein" required />
              <input className={inputClass} name="carbs" type="number" min="0" placeholder="Carbs" required />
              <input className={inputClass} name="fat" type="number" min="0" placeholder="Fat" required />
              <input className={`${inputClass} md:col-span-3`} name="notes" placeholder="Notes" />
              <Button>
                <Plus size={16} />
                Add
              </Button>
            </form>
            {error ? <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
          </Card>

          <Card>
            <CardHeader title="Shortcuts" eyebrow="Move" />
            <div className="grid gap-3">
              <Shortcut href="/recipes" icon={<ChefHat size={18} />} label="Browse recipes" />
              <Shortcut href="/recipes/new" icon={<Plus size={18} />} label="Create recipe" />
              <Shortcut href="/friends" icon={<UsersRound size={18} />} label="Friends" />
              <Shortcut href="/profile" icon={<UserRound size={18} />} label="Profile" />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Today&apos;s food logs" eyebrow="Meals" />
          <div className="grid gap-3">
            {logs.length ? logs.map((log) => <FoodLogCard key={log.id} log={log} />) : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No food logged yet today.</p>}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Shortcut({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg bg-zinc-900 p-3 text-sm font-semibold text-zinc-200 hover:text-white">
      {icon}
      {label}
    </Link>
  );
}
