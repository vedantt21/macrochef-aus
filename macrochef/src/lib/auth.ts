import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import type { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { apiError, normalizePair, publicUser } from "@/lib/utils";

export const SESSION_COOKIE = "macrochef_session";
const encoder = new TextEncoder();

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters.");
  }
  return encoder.encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(userId)
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(jwtSecret());
}

export async function readSessionUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, jwtSecret());
    const userId = verified.payload.userId;
    return typeof userId === "string" ? userId : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(response: NextResponse, userId: string) {
  const token = await createSessionToken(userId);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(request: NextRequest) {
  const userId = await readSessionUserId(request);
  if (!userId) return null;

  return getDb().user.findUnique({
    where: { id: userId },
  });
}

export async function requireUser(request: NextRequest, requireVerified = true) {
  const user = await getCurrentUser(request);

  if (!user) {
    return { user: null, response: apiError("Authentication required.", 401) };
  }

  if (requireVerified && !user.isVerified) {
    return { user: null, response: apiError("Please verify your email first.", 403) };
  }

  return { user, response: null };
}

export async function areFriends(userAId: string, userBId: string) {
  if (userAId === userBId) return true;
  const [userA, userB] = normalizePair(userAId, userBId);
  const friendship = await getDb().friendship.findUnique({
    where: {
      userAId_userBId: { userAId: userA, userBId: userB },
    },
  });
  return Boolean(friendship);
}

export async function canViewProfile(viewerId: string, profile: { id: string; isPrivate: boolean }) {
  return profile.id === viewerId || !profile.isPrivate || areFriends(viewerId, profile.id);
}

export async function canViewRecipe(
  viewerId: string,
  recipe: { userId: string; visibility: "PUBLIC" | "FRIENDS" | "PRIVATE" },
) {
  if (recipe.userId === viewerId) return true;
  if (recipe.visibility === "PUBLIC") return true;
  if (recipe.visibility === "PRIVATE") return false;
  return areFriends(viewerId, recipe.userId);
}

export function mePayload(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  return publicUser(user);
}
