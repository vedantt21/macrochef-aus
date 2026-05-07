import { getDb } from "@/lib/db";
import { normalizePair } from "@/lib/utils";

export async function friendIdsFor(userId: string) {
  const friendships = await getDb().friendship.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });
  return friendships.map((friendship) => (friendship.userAId === userId ? friendship.userBId : friendship.userAId));
}

export async function friendshipExists(userAId: string, userBId: string) {
  const [userA, userB] = normalizePair(userAId, userBId);
  const friendship = await getDb().friendship.findUnique({
    where: { userAId_userBId: { userAId: userA, userBId: userB } },
  });
  return Boolean(friendship);
}
