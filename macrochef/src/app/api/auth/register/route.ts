import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sendVerificationEmail, verificationCode } from "@/lib/mailer";
import { apiError, publicUser } from "@/lib/utils";
import { registerSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid registration details.");

  const db = getDb();
  const code = verificationCode();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  try {
    const user = await db.user.create({
      data: {
        email: parsed.data.email,
        username: parsed.data.username,
        displayName: parsed.data.displayName,
        passwordHash: await hashPassword(parsed.data.password),
        verificationTokens: {
          create: { code, expiresAt },
        },
      },
    });

    await sendVerificationEmail(user.email, code);
    return NextResponse.json({ user: publicUser(user), verificationRequired: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return apiError("Email or username is already registered.", 409);
    }
    console.error(error);
    return apiError("Unable to create account.", 500);
  }
}
