import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, publicUser } from "@/lib/utils";
import { profileUpdateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const db = getDb();
  const [recipes, savedRecipes, likedRecipes] = await Promise.all([
    db.recipe.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      include: { user: true, _count: { select: { likes: true, saves: true, comments: true } } },
    }),
    db.recipeSave.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      include: { recipe: { include: { user: true, _count: { select: { likes: true, saves: true, comments: true } } } } },
    }),
    db.recipeLike.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      include: { recipe: { include: { user: true, _count: { select: { likes: true, saves: true, comments: true } } } } },
    }),
  ]);

  return NextResponse.json({
    user: publicUser(user!),
    recipes,
    savedRecipes: savedRecipes.map((item) => item.recipe),
    likedRecipes: likedRecipes.map((item) => item.recipe),
  });
}

export async function PATCH(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const parsed = profileUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid profile update.");

  const updated = await getDb().user.update({
    where: { id: user!.id },
    data: parsed.data,
  });

  return NextResponse.json({ user: publicUser(updated) });
}
