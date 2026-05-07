import { NextRequest, NextResponse } from "next/server";
import { canViewRecipe, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/utils";
import { recipeLogSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const parsed = recipeLogSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid log request.");

  const recipe = await getDb().recipe.findUnique({ where: { id } });
  if (!recipe || !(await canViewRecipe(user!.id, recipe))) return apiError("Recipe not found.", 404);

  const log = await getDb().foodLog.create({
    data: {
      userId: user!.id,
      foodName: recipe.title,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      mealType: parsed.data.mealType,
      servingSize: parsed.data.servingSize || "1 recipe serving",
      notes: parsed.data.notes || `Logged from recipe ${recipe.title}`,
      logDate: new Date(`${parsed.data.logDate}T12:00:00.000Z`),
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}
