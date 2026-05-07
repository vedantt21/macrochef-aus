import { NextRequest, NextResponse } from "next/server";
import { areFriends, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { publicUser } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 2) return NextResponse.json({ users: [] });

  const users = await getDb().user.findMany({
    where: {
      isVerified: true,
      id: { not: user!.id },
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { displayName: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 12,
    orderBy: { username: "asc" },
  });

  const shaped = await Promise.all(
    users.map(async (member) => ({
      ...publicUser(member),
      isFriend: await areFriends(user!.id, member.id),
    })),
  );

  return NextResponse.json({ users: shaped });
}
