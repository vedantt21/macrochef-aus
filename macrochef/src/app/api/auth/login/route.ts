import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { apiError, publicUser } from "@/lib/utils";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid login details.");

  const identifier = parsed.data.identifier.toLowerCase();
  const user = await getDb().user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return apiError("Incorrect email, username, or password.", 401);
  }

  if (!user.isVerified) {
    return NextResponse.json(
      { error: "Please verify your email before logging in.", verificationRequired: true, email: user.email },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ user: publicUser(user) });
  await setSessionCookie(response, user.id);
  return response;
}
