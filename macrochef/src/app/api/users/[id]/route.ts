import { NextRequest, NextResponse } from "next/server";
import { canViewProfile, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, publicUser } from "@/lib/utils";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const profile = await getDb().user.findFirst({
    where: { id, isVerified: true },
  });
  if (!profile) return apiError("User not found.", 404);

  const fullAccess = await canViewProfile(user!.id, profile);
  if (!fullAccess) {
    return NextResponse.json({
      user: {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        bio: profile.bio,
        isPrivate: profile.isPrivate,
        restricted: true,
      },
    });
  }

  const recipes = await getDb().recipe.findMany({
    where: { userId: profile.id, visibility: profile.id === user!.id ? undefined : "PUBLIC" },
    orderBy: { createdAt: "desc" },
    include: { user: true, _count: { select: { likes: true, saves: true, comments: true } } },
  });

  return NextResponse.json({ user: publicUser(profile), recipes });
}
