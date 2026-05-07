import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, toDateRange } from "@/lib/utils";
import { foodLogSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const { start, end } = toDateRange(date);

  const logs = await getDb().foodLog.findMany({
    where: { userId: user!.id, logDate: { gte: start, lt: end } },
    orderBy: [{ mealType: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const parsed = foodLogSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid food log.");

  const log = await getDb().foodLog.create({
    data: {
      ...parsed.data,
      logDate: new Date(`${parsed.data.logDate}T12:00:00.000Z`),
      userId: user!.id,
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}
