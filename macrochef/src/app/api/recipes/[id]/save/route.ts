import { NextRequest, NextResponse } from "next/server";
import { canViewRecipe, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/utils";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const recipe = await getDb().recipe.findUnique({ where: { id } });
  if (!recipe || !(await canViewRecipe(user!.id, recipe))) return apiError("Recipe not found.", 404);

  await getDb().recipeSave.upsert({
    where: { userId_recipeId: { userId: user!.id, recipeId: id } },
    update: {},
    create: { userId: user!.id, recipeId: id },
  });
  return NextResponse.json({ saved: true });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  await getDb().recipeSave.deleteMany({ where: { userId: user!.id, recipeId: id } });
  return NextResponse.json({ saved: false });
}
