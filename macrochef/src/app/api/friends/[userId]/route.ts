import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, normalizePair } from "@/lib/utils";

type Context = { params: Promise<{ userId: string }> };

export async function DELETE(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { userId } = await context.params;

  const [userAId, userBId] = normalizePair(user!.id, userId);
  const deleted = await getDb().friendship.deleteMany({
    where: { userAId, userBId },
  });

  if (deleted.count === 0) return apiError("Friendship not found.", 404);
  return NextResponse.json({ ok: true });
}
