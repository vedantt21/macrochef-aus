import { NextResponse } from "next/server";

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function toDateRange(date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function sumMacros<T extends { calories: number; protein: number; carbs: number; fat: number }>(
  rows: T[],
) {
  return rows.reduce(
    (totals, row) => ({
      calories: totals.calories + row.calories,
      protein: totals.protein + row.protein,
      carbs: totals.carbs + row.carbs,
      fat: totals.fat + row.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function cleanTags(value: string | string[] | undefined) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : value.split(",");
  return raw
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);
}

export function publicUser(user: {
  id: string;
  email?: string;
  username: string;
  displayName: string;
  bio?: string | null;
  isVerified: boolean;
  isPrivate: boolean;
  dailyCalorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
  createdAt?: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    isVerified: user.isVerified,
    isPrivate: user.isPrivate,
    dailyCalorieGoal: user.dailyCalorieGoal,
    proteinGoal: user.proteinGoal,
    carbsGoal: user.carbsGoal,
    fatGoal: user.fatGoal,
    createdAt: user.createdAt,
  };
}

export function normalizePair(userAId: string, userBId: string) {
  return [userAId, userBId].sort() as [string, string];
}
