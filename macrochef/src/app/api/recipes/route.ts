import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { canViewRecipe, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { friendIdsFor } from "@/lib/friends";
import { apiError, cleanTags } from "@/lib/utils";
import { recipeSchema } from "@/lib/validation";

const includeRecipe = {
  user: true,
  _count: { select: { likes: true, saves: true, comments: true } },
} satisfies Prisma.RecipeInclude;

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const db = getDb();
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const filter = request.nextUrl.searchParams.get("filter") || "recent";
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || 1));
  const take = 12;
  const friendIds = await friendIdsFor(user!.id);

  const baseWhere: Prisma.RecipeWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { tags: { has: q.toLowerCase() } },
        ],
      }
    : {};

  let recipes;

  if (filter === "saved") {
    const saves = await db.recipeSave.findMany({
      where: { userId: user!.id, recipe: baseWhere },
      orderBy: { createdAt: "desc" },
      include: { recipe: { include: includeRecipe } },
      take: 80,
    });
    recipes = saves.map((save) => save.recipe);
  } else {
    const where: Prisma.RecipeWhereInput = { ...baseWhere };
    if (filter === "mine") where.userId = user!.id;
    if (filter === "friends") where.userId = { in: friendIds };
    if (filter === "public") where.visibility = "PUBLIC";
    if (filter === "high-protein") where.protein = { gte: 30 };
    if (filter === "low-calorie") where.calories = { lte: 500 };

    recipes = await db.recipe.findMany({
      where,
      orderBy: filter === "popular" ? [{ likes: { _count: "desc" } }, { createdAt: "desc" }] : { createdAt: "desc" },
      include: includeRecipe,
      take: 80,
    });
  }

  const visible = [];
  for (const recipe of recipes) {
    if (await canViewRecipe(user!.id, recipe)) visible.push(recipe);
  }

  return NextResponse.json({
    recipes: visible.slice((page - 1) * take, page * take),
    page,
    hasMore: visible.length > page * take,
  });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const parsed = recipeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid recipe.");

  const { tags, imageUrl, ...recipeData } = parsed.data;
  const recipe = await getDb().recipe.create({
    data: {
      ...recipeData,
      imageUrl: imageUrl || null,
      tags: cleanTags(tags),
      userId: user!.id,
    },
    include: includeRecipe,
  });

  return NextResponse.json({ recipe }, { status: 201 });
}
