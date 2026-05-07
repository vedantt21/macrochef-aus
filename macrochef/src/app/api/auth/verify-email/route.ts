import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, publicUser } from "@/lib/utils";
import { verifyEmailSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = verifyEmailSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Enter the six-digit verification code.");

  const db = getDb();
  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
    include: {
      verificationTokens: {
        where: {
          code: parsed.data.code,
          expiresAt: { gt: new Date() },
        },
        take: 1,
      },
    },
  });

  if (!user || user.verificationTokens.length === 0) {
    return apiError("Invalid or expired verification code.", 400);
  }

  const verified = await db.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationTokens: { deleteMany: {} },
    },
  });

  const response = NextResponse.json({ user: publicUser(verified) });
  await setSessionCookie(response, verified.id);
  return response;
}
