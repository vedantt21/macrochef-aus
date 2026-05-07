"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function FriendRequestCard({
  user,
  meta,
  onAccept,
  onReject,
  onRemove,
}: {
  user: { displayName: string; username: string };
  meta?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-white">{user.displayName}</p>
          <p className="text-sm text-zinc-400">@{user.username} {meta ? `- ${meta}` : ""}</p>
        </div>
        <div className="flex gap-2">
          {onAccept ? <Button onClick={onAccept}>Accept</Button> : null}
          {onReject ? <Button variant="secondary" onClick={onReject}>Reject</Button> : null}
          {onRemove ? <Button variant="danger" onClick={onRemove}>Remove</Button> : null}
        </div>
      </div>
    </Card>
  );
}
