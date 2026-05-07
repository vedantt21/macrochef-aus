"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button, LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import RecipeCard from "@/components/RecipeCard";
import RecipeFilters from "@/components/RecipeFilters";

type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  visibility: string;
  user?: { displayName: string; username: string };
  _count?: { likes: number; comments: number; saves: number };
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState("recent");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (nextPage = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ filter, page: String(nextPage) });
    if (q) params.set("q", q);
    const response = await fetch(`/api/recipes?${params}`);
    const data = await response.json();
    if (response.ok) {
      setRecipes((current) => (nextPage === 1 ? data.recipes : [...current, ...data.recipes]));
      setHasMore(data.hasMore);
      setPage(nextPage);
    }
    setLoading(false);
  }, [filter, q]);

  useEffect(() => {
    load(1);
  }, [load]);

  function search(event: React.FormEvent) {
    event.preventDefault();
    load(1);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-300">Recipes</p>
            <h1 className="mt-2 text-3xl font-black text-white">Social recipe feed</h1>
            <p className="mt-2 text-zinc-400">Browse public posts, friends-only meals, saves, and your own recipes.</p>
          </div>
          <LinkButton href="/recipes/new">
            <Plus size={16} />
            New Recipe
          </LinkButton>
        </div>

        <Card>
          <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-400"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search recipes, descriptions, or tags"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          <div className="mt-4">
            <RecipeFilters value={filter} onChange={setFilter} />
          </div>
        </Card>

        {loading && recipes.length === 0 ? <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">Loading recipes...</p> : null}
        {!loading && recipes.length === 0 ? <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No recipes found yet.</p> : null}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        {hasMore ? (
          <Button variant="secondary" onClick={() => load(page + 1)} disabled={loading}>
            Load more
          </Button>
        ) : null}
      </div>
    </AppShell>
  );
}
