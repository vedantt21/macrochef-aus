"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/Button";
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

const inputClass = "rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400";
const emptyForm = {
  foodName: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  mealType: "LUNCH",
  servingSize: "",
  notes: "",
};

export default function TrackerPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

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

  function edit(log: FoodLog) {
    setEditingId(log.id);
    setForm({
      foodName: log.foodName,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fat: log.fat,
      mealType: log.mealType,
      servingSize: log.servingSize || "",
      notes: log.notes || "",
    });
  }

  async function remove(id: string) {
    await fetch(`/api/food-logs/${id}`, { method: "DELETE" });
    load();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const payload = { ...form, logDate: date };
    const response = await fetch(editingId ? `/api/food-logs/${editingId}` : "/api/food-logs", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to save food log.");
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    load();
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-300">Tracker</p>
            <h1 className="mt-2 text-3xl font-black text-white">Daily food log</h1>
          </div>
          <input className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MacroProgressCard label="Calories" value={summary?.totals.calories || 0} goal={summary?.goals.calories || 0} unit="" />
          <MacroProgressCard label="Protein" value={summary?.totals.protein || 0} goal={summary?.goals.protein || 0} />
          <MacroProgressCard label="Carbs" value={summary?.totals.carbs || 0} goal={summary?.goals.carbs || 0} />
          <MacroProgressCard label="Fat" value={summary?.totals.fat || 0} goal={summary?.goals.fat || 0} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader title={editingId ? "Edit food entry" : "Add food entry"} eyebrow="Entry" />
            <form onSubmit={submit} className="grid gap-3">
              <input className={inputClass} value={form.foodName} onChange={(event) => setForm({ ...form, foodName: event.target.value })} placeholder="Food name" required />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} value={form.calories} onChange={(event) => setForm({ ...form, calories: Number(event.target.value) })} type="number" min="0" placeholder="Calories" />
                <select className={inputClass} value={form.mealType} onChange={(event) => setForm({ ...form, mealType: event.target.value })}>
                  {["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"].map((meal) => <option key={meal}>{meal}</option>)}
                </select>
                <input className={inputClass} value={form.protein} onChange={(event) => setForm({ ...form, protein: Number(event.target.value) })} type="number" min="0" placeholder="Protein" />
                <input className={inputClass} value={form.carbs} onChange={(event) => setForm({ ...form, carbs: Number(event.target.value) })} type="number" min="0" placeholder="Carbs" />
                <input className={inputClass} value={form.fat} onChange={(event) => setForm({ ...form, fat: Number(event.target.value) })} type="number" min="0" placeholder="Fat" />
                <input className={inputClass} value={form.servingSize} onChange={(event) => setForm({ ...form, servingSize: event.target.value })} placeholder="Serving" />
              </div>
              <textarea className={`${inputClass} min-h-24`} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" />
              {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
              <div className="flex gap-2">
                <Button>{editingId ? "Save changes" : "Add food"}</Button>
                {editingId ? <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button> : null}
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader title="Entries" eyebrow={date} />
            <div className="grid gap-3">
              {logs.length ? logs.map((log) => <FoodLogCard key={log.id} log={log} onEdit={edit} onDelete={remove} />) : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No entries for this date.</p>}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
