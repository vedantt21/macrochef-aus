import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, normalizePair } from "@/lib/utils";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const db = getDb();
  const friendRequest = await db.friendRequest.findFirst({
    where: { id, receiverId: user!.id, status: "PENDING" },
  });

  if (!friendRequest) return apiError("Friend request not found.", 404);
  const [userAId, userBId] = normalizePair(friendRequest.senderId, friendRequest.receiverId);

  await db.$transaction([
    db.friendRequest.update({ where: { id }, data: { status: "ACCEPTED" } }),
    db.friendship.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      update: {},
      create: { userAId, userBId },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
