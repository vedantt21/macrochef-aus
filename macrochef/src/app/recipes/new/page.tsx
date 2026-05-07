"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";

const inputClass = "rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-emerald-400";

export default function NewRecipePage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to create recipe.");
      return;
    }
    router.push(`/recipes/${data.recipe.id}`);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader title="Create recipe" eyebrow="Share" />
          <form onSubmit={submit} className="grid gap-4">
            <input className={inputClass} name="title" placeholder="Title" required />
            <textarea className={`${inputClass} min-h-24`} name="description" placeholder="Description" required />
            <input className={inputClass} name="imageUrl" placeholder="Image URL" />
            <div className="grid gap-4 md:grid-cols-4">
              <input className={inputClass} name="calories" type="number" min="0" placeholder="Calories" required />
              <input className={inputClass} name="protein" type="number" min="0" placeholder="Protein" required />
              <input className={inputClass} name="carbs" type="number" min="0" placeholder="Carbs" required />
              <input className={inputClass} name="fat" type="number" min="0" placeholder="Fat" required />
            </div>
            <textarea className={`${inputClass} min-h-36`} name="ingredients" placeholder="Ingredients, one per line" required />
            <textarea className={`${inputClass} min-h-44`} name="instructions" placeholder="Instructions" required />
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <input className={inputClass} name="tags" placeholder="Tags separated by commas" />
              <select className={inputClass} name="visibility" defaultValue="PUBLIC">
                <option value="PUBLIC">Public</option>
                <option value="FRIENDS">Friends</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
            <Button>Create Recipe</Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
