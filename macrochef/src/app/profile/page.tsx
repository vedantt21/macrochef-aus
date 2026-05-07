"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { LinkButton } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";
import ProfileCard from "@/components/ProfileCard";
import RecipeCard from "@/components/RecipeCard";

type User = {
  displayName: string;
  username: string;
  bio?: string | null;
  isPrivate: boolean;
  dailyCalorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
};

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

export default function ProfilePage() {
  const [data, setData] = useState<{ user: User; recipes: Recipe[]; savedRecipes: Recipe[]; likedRecipes: Recipe[] } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => response.json())
      .then(setData);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-300">Profile</p>
            <h1 className="mt-2 text-3xl font-black text-white">Your MacroChef profile</h1>
          </div>
          <div className="flex gap-2">
            <LinkButton href="/profile/edit" variant="secondary">Edit profile</LinkButton>
            <LinkButton href="/settings" variant="secondary">Settings</LinkButton>
          </div>
        </div>

        {data ? <ProfileCard user={data.user} /> : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">Loading profile...</p>}

        {data ? (
          <div className="grid gap-6">
            <RecipeSection title="Your recipes" recipes={data.recipes} />
            <RecipeSection title="Saved recipes" recipes={data.savedRecipes} />
            <RecipeSection title="Liked recipes" recipes={data.likedRecipes} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function RecipeSection({ title, recipes }: { title: string; recipes: Recipe[] }) {
  return (
    <Card>
      <CardHeader title={title} eyebrow={`${recipes.length} recipes`} />
      {recipes.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      ) : (
        <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">Nothing here yet.</p>
      )}
    </Card>
  );
}
