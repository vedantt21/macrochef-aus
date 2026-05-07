import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendVerificationEmail, verificationCode } from "@/lib/mailer";
import { apiError } from "@/lib/utils";
import { resendVerificationSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = resendVerificationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Enter a valid email address.");

  const db = getDb();
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return apiError("No account found for that email.", 404);
  if (user.isVerified) return NextResponse.json({ ok: true, alreadyVerified: true });

  const code = verificationCode();
  await db.verificationToken.deleteMany({ where: { userId: user.id } });
  await db.verificationToken.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });
  await sendVerificationEmail(user.email, code);
  return NextResponse.json({ ok: true });
}
