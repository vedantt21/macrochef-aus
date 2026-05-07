import { Lock, Unlock } from "lucide-react";
import { Card } from "@/components/Card";

export default function ProfileCard({
  user,
}: {
  user: {
    displayName: string;
    username: string;
    bio?: string | null;
    isPrivate: boolean;
    dailyCalorieGoal?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatGoal?: number;
  };
}) {
  return (
    <Card>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid size-20 place-items-center rounded-lg bg-emerald-400 text-2xl font-black text-zinc-950">
          {user.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-white">{user.displayName}</h1>
            <span className="inline-flex items-center gap-1 rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-300">
              {user.isPrivate ? <Lock size={13} /> : <Unlock size={13} />}
              {user.isPrivate ? "Private" : "Public"}
            </span>
          </div>
          <p className="text-sm text-zinc-400">@{user.username}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{user.bio || "No bio yet."}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Goal label="Calories" value={user.dailyCalorieGoal} suffix="" />
        <Goal label="Protein" value={user.proteinGoal} suffix="g" />
        <Goal label="Carbs" value={user.carbsGoal} suffix="g" />
        <Goal label="Fat" value={user.fatGoal} suffix="g" />
      </div>
    </Card>
  );
}

function Goal({ label, value, suffix }: { label: string; value?: number; suffix: string }) {
  return (
    <div className="rounded-lg bg-zinc-900 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">
        {value ?? "-"}
        {value ? suffix : ""}
      </p>
    </div>
  );
}
