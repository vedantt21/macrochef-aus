import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError } from "@/lib/utils";
import { foodLogUpdateSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const parsed = foodLogUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid food log update.");

  const existing = await getDb().foodLog.findFirst({ where: { id, userId: user!.id } });
  if (!existing) return apiError("Food log not found.", 404);

  const data = {
    ...parsed.data,
    ...(parsed.data.logDate ? { logDate: new Date(`${parsed.data.logDate}T12:00:00.000Z`) } : {}),
  };

  const log = await getDb().foodLog.update({
    where: { id },
    data,
  });

  return NextResponse.json({ log });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { user, response } = await requireUser(request);
  if (response) return response;
  const { id } = await context.params;

  const existing = await getDb().foodLog.findFirst({ where: { id, userId: user!.id } });
  if (!existing) return apiError("Food log not found.", 404);

  await getDb().foodLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
