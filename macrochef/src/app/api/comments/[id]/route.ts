import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/utils";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const comment = await getDb().recipeComment.findUnique({ where: { id } });
  if (!comment) return apiError("Comment not found.", 404);
  if (comment.userId !== user!.id) return apiError("You can only delete your own comments.", 403);

  await getDb().recipeComment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
