import { NextRequest, NextResponse } from "next/server";
import { canViewRecipe, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/utils";
import { commentSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const recipe = await getDb().recipe.findUnique({ where: { id } });
  if (!recipe || !(await canViewRecipe(user!.id, recipe))) return apiError("Recipe not found.", 404);

  const comments = await getDb().recipeComment.findMany({
    where: { recipeId: id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const recipe = await getDb().recipe.findUnique({ where: { id } });
  if (!recipe || !(await canViewRecipe(user!.id, recipe))) return apiError("Recipe not found.", 404);

  const parsed = commentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Comment cannot be empty.");

  const comment = await getDb().recipeComment.create({
    data: { userId: user!.id, recipeId: id, content: parsed.data.content },
    include: { user: true },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
