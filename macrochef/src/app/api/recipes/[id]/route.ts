import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { canViewRecipe, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, cleanTags } from "@/lib/utils";
import { recipeUpdateSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

const includeRecipe = {
  user: true,
  likes: true,
  saves: true,
  comments: { include: { user: true }, orderBy: { createdAt: "desc" as const } },
  _count: { select: { likes: true, saves: true, comments: true } },
};

export async function GET(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const recipe = await getDb().recipe.findUnique({
    where: { id },
    include: includeRecipe,
  });

  if (!recipe) return apiError("Recipe not found.", 404);
  if (!(await canViewRecipe(user!.id, recipe))) return apiError("Recipe not found.", 404);

  return NextResponse.json({
    recipe: {
      ...recipe,
      likedByMe: recipe.likes.some((like) => like.userId === user!.id),
      savedByMe: recipe.saves.some((save) => save.userId === user!.id),
      canEdit: recipe.userId === user!.id,
    },
  });
}

export async function PATCH(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const recipe = await getDb().recipe.findUnique({ where: { id } });
  if (!recipe) return apiError("Recipe not found.", 404);
  if (recipe.userId !== user!.id) return apiError("Only the recipe owner can edit this recipe.", 403);

  const parsed = recipeUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid recipe update.");

  const { tags, imageUrl, ...recipeData } = parsed.data;
  const data: Prisma.RecipeUpdateInput = { ...recipeData };
  if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
  if (tags !== undefined) data.tags = { set: cleanTags(tags) };

  const updated = await getDb().recipe.update({
    where: { id },
    data,
    include: { user: true, _count: { select: { likes: true, saves: true, comments: true } } },
  });

  return NextResponse.json({ recipe: updated });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const recipe = await getDb().recipe.findUnique({ where: { id } });
  if (!recipe) return apiError("Recipe not found.", 404);
  if (recipe.userId !== user!.id) return apiError("Only the recipe owner can delete this recipe.", 403);

  await getDb().recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
