import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, mePayload } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return apiError("Authentication required.", 401);
  return NextResponse.json({ user: mePayload(user) });
}
