import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { friendIdsFor } from "@/lib/friends";
import { publicUser } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const ids = await friendIdsFor(user!.id);
  const friends = ids.length
    ? await getDb().user.findMany({
        where: { id: { in: ids } },
        orderBy: { displayName: "asc" },
      })
    : [];

  return NextResponse.json({ friends: friends.map(publicUser) });
}
