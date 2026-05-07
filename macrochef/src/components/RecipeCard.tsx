import Link from "next/link";
import { Heart, MessageCircle, Shield, Star } from "lucide-react";
import { Card } from "@/components/Card";

type RecipeCardProps = {
  recipe: {
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
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <Card className="h-full overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-emerald-400/60">
        <div
          className="h-44 bg-cover bg-center"
          style={{
            backgroundImage: recipe.imageUrl
              ? `linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.55)), url(${recipe.imageUrl})`
              : "linear-gradient(135deg, #0f1f18, #20362a 45%, #e0a642)",
          }}
        />
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
            <span>{recipe.user?.displayName || "MacroChef"}</span>
            <span className="inline-flex items-center gap-1">
              <Shield size={13} />
              {recipe.visibility.toLowerCase()}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-black text-white">{recipe.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{recipe.description}</p>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
            <span className="rounded bg-zinc-900 p-2 font-bold text-white">{recipe.calories} cal</span>
            <span className="rounded bg-zinc-900 p-2">P {recipe.protein}</span>
            <span className="rounded bg-zinc-900 p-2">C {recipe.carbs}</span>
            <span className="rounded bg-zinc-900 p-2">F {recipe.fat}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Heart size={14} /> {recipe._count?.likes || 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle size={14} /> {recipe._count?.comments || 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star size={14} /> {recipe._count?.saves || 0}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
