import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/utils";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const existing = await getDb().friendRequest.findFirst({
    where: { id, receiverId: user!.id, status: "PENDING" },
  });
  if (!existing) return apiError("Friend request not found.", 404);

  await getDb().friendRequest.update({ where: { id }, data: { status: "REJECTED" } });
  return NextResponse.json({ ok: true });
}
