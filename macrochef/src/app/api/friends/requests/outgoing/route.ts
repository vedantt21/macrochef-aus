import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const requests = await getDb().friendRequest.findMany({
    where: { senderId: user!.id, status: "PENDING" },
    include: { receiver: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
