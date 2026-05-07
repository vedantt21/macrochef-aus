import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sumMacros, toDateRange } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const { start, end } = toDateRange(date);

  const logs = await getDb().foodLog.findMany({
    where: { userId: user!.id, logDate: { gte: start, lt: end } },
  });

  const totals = sumMacros(logs);
  return NextResponse.json({
    date,
    totals,
    goals: {
      calories: user!.dailyCalorieGoal,
      protein: user!.proteinGoal,
      carbs: user!.carbsGoal,
      fat: user!.fatGoal,
    },
    remaining: {
      calories: Math.max(0, user!.dailyCalorieGoal - totals.calories),
      protein: Math.max(0, user!.proteinGoal - totals.protein),
      carbs: Math.max(0, user!.carbsGoal - totals.carbs),
      fat: Math.max(0, user!.fatGoal - totals.fat),
    },
  });
}
