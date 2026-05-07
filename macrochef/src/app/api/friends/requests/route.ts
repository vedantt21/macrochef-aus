import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { friendshipExists } from "@/lib/friends";
import { apiError } from "@/lib/utils";
import { friendRequestSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const { user, response } = await requireUser(request);
  if (response) return response;

  const parsed = friendRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Choose a member to add.");

  const receiverId = parsed.data.receiverId;
  if (receiverId === user!.id) return apiError("You cannot friend yourself.");

  const receiver = await getDb().user.findFirst({ where: { id: receiverId, isVerified: true } });
  if (!receiver) return apiError("Verified member not found.", 404);
  if (await friendshipExists(user!.id, receiverId)) return apiError("You are already friends.", 409);

  const existing = await getDb().friendRequest.findFirst({
    where: {
      status: "PENDING",
      OR: [
        { senderId: user!.id, receiverId },
        { senderId: receiverId, receiverId: user!.id },
      ],
    },
  });
  if (existing) return apiError("A pending request already exists.", 409);

  const requestRecord = await getDb().friendRequest.create({
    data: { senderId: user!.id, receiverId },
    include: { receiver: true },
  });

  return NextResponse.json({ request: requestRecord }, { status: 201 });
}
