"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle, Save, Trash2, Utensils } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card, CardHeader } from "@/components/Card";
import CommentBox from "@/components/CommentBox";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: { displayName: string; username: string };
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  ingredients: string;
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  visibility: string;
  likedByMe: boolean;
  savedByMe: boolean;
  canEdit: boolean;
  user: { displayName: string; username: string };
  comments: Comment[];
  _count: { likes: number; saves: number; comments: number };
};

const inputClass = "rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [mealType, setMealType] = useState("DINNER");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Recipe>>({});

  const load = useCallback(async () => {
    const response = await fetch(`/api/recipes/${params.id}`);
    const data = await response.json();
    if (response.ok) {
      setRecipe(data.recipe);
      setEditForm(data.recipe);
    } else {
      setError(data.error || "Recipe not found.");
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(path: "like" | "save", active: boolean) {
    await fetch(`/api/recipes/${params.id}/${path}`, { method: active ? "DELETE" : "POST" });
    load();
  }

  async function addComment(content: string) {
    await fetch(`/api/recipes/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    load();
  }

  async function deleteComment(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    load();
  }

  async function logRecipe() {
    const response = await fetch(`/api/recipes/${params.id}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logDate, mealType }),
    });
    if (response.ok) router.push(`/tracker`);
  }

  async function saveEdit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/recipes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to save recipe.");
      return;
    }
    setEditing(false);
    load();
  }

  async function deleteRecipe() {
    await fetch(`/api/recipes/${params.id}`, { method: "DELETE" });
    router.push("/recipes");
  }

  if (error) {
    return (
      <AppShell>
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-5 text-rose-200">{error}</p>
      </AppShell>
    );
  }

  if (!recipe) {
    return (
      <AppShell>
        <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">Loading recipe...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <div
              className="min-h-72 bg-cover bg-center"
              style={{
                backgroundImage: recipe.imageUrl
                  ? `linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.72)), url(${recipe.imageUrl})`
                  : "linear-gradient(135deg, #0f1f18, #314736 48%, #d9a33d)",
              }}
            />
            <div className="p-6">
              <p className="text-sm text-zinc-400">By {recipe.user.displayName} - {recipe.visibility.toLowerCase()}</p>
              <h1 className="mt-3 text-4xl font-black text-white">{recipe.title}</h1>
              <p className="mt-4 max-w-3xl leading-8 text-zinc-300">{recipe.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant={recipe.likedByMe ? "primary" : "secondary"} onClick={() => toggle("like", recipe.likedByMe)}>
                  <Heart size={16} /> {recipe.likedByMe ? "Unlike" : "Like"} ({recipe._count.likes})
                </Button>
                <Button variant={recipe.savedByMe ? "primary" : "secondary"} onClick={() => toggle("save", recipe.savedByMe)}>
                  <Save size={16} /> {recipe.savedByMe ? "Unsave" : "Save"} ({recipe._count.saves})
                </Button>
                {recipe.canEdit ? <Button variant="secondary" onClick={() => setEditing((value) => !value)}>Edit</Button> : null}
                {recipe.canEdit ? <Button variant="danger" onClick={deleteRecipe}><Trash2 size={16} /> Delete</Button> : null}
              </div>
            </div>
          </Card>

          {editing ? (
            <Card>
              <CardHeader title="Edit recipe" eyebrow="Owner" />
              <form onSubmit={saveEdit} className="grid gap-3">
                <input className={inputClass} value={editForm.title || ""} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} />
                <textarea className={`${inputClass} min-h-24`} value={editForm.description || ""} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} />
                <div className="grid gap-3 md:grid-cols-4">
                  {(["calories", "protein", "carbs", "fat"] as const).map((field) => (
                    <input key={field} className={inputClass} type="number" min="0" value={editForm[field] || 0} onChange={(event) => setEditForm({ ...editForm, [field]: Number(event.target.value) })} />
                  ))}
                </div>
                <textarea className={`${inputClass} min-h-32`} value={editForm.ingredients || ""} onChange={(event) => setEditForm({ ...editForm, ingredients: event.target.value })} />
                <textarea className={`${inputClass} min-h-32`} value={editForm.instructions || ""} onChange={(event) => setEditForm({ ...editForm, instructions: event.target.value })} />
                <select className={inputClass} value={editForm.visibility || "PUBLIC"} onChange={(event) => setEditForm({ ...editForm, visibility: event.target.value })}>
                  <option value="PUBLIC">Public</option>
                  <option value="FRIENDS">Friends</option>
                  <option value="PRIVATE">Private</option>
                </select>
                <Button>Save recipe</Button>
              </form>
            </Card>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader title="Ingredients" eyebrow="Prep" />
              <ul className="space-y-3 text-sm leading-6 text-zinc-300">
                {recipe.ingredients.split("\n").filter(Boolean).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>
            <Card>
              <CardHeader title="Instructions" eyebrow="Cook" />
              <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">{recipe.instructions}</div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Comments" eyebrow={`${recipe._count.comments} total`} />
            <CommentBox onSubmit={addComment} />
            <div className="mt-5 grid gap-3">
              {recipe.comments.length ? recipe.comments.map((comment) => (
                <div key={comment.id} className="rounded-lg bg-zinc-900 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{comment.user.displayName}</p>
                      <p className="text-xs text-zinc-500">@{comment.user.username}</p>
                    </div>
                    <Button variant="ghost" className="size-9 px-0 text-rose-300" onClick={() => deleteComment(comment.id)} aria-label="Delete comment">
                      <Trash2 size={15} />
                    </Button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{comment.content}</p>
                </div>
              )) : <p className="rounded-lg bg-zinc-900 p-5 text-sm text-zinc-400">No comments yet.</p>}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Nutrition" eyebrow="Per serving" />
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Calories" value={recipe.calories} />
              <Metric label="Protein" value={`${recipe.protein}g`} />
              <Metric label="Carbs" value={`${recipe.carbs}g`} />
              <Metric label="Fat" value={`${recipe.fat}g`} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Log recipe" eyebrow="Tracker" />
            <div className="grid gap-3">
              <input className={inputClass} type="date" value={logDate} onChange={(event) => setLogDate(event.target.value)} />
              <select className={inputClass} value={mealType} onChange={(event) => setMealType(event.target.value)}>
                {["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"].map((meal) => <option key={meal}>{meal}</option>)}
              </select>
              <Button onClick={logRecipe}><Utensils size={16} /> Log to tracker</Button>
            </div>
          </Card>
          <Card>
            <CardHeader title="Activity" eyebrow="Feed" />
            <div className="space-y-3 text-sm text-zinc-300">
              <p className="flex items-center gap-2"><Heart size={16} /> {recipe._count.likes} likes</p>
              <p className="flex items-center gap-2"><Save size={16} /> {recipe._count.saves} saves</p>
              <p className="flex items-center gap-2"><MessageCircle size={16} /> {recipe._count.comments} comments</p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}
