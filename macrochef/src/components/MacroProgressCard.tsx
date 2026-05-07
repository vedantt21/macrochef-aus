import { Card } from "@/components/Card";

export default function MacroProgressCard({
  label,
  value,
  goal,
  unit = "g",
}: {
  label: string;
  value: number;
  goal: number;
  unit?: string;
}) {
  const progress = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;

  return (
    <Card>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-white">
            {value}
            <span className="text-sm font-semibold text-zinc-500">/{goal}{unit}</span>
          </p>
        </div>
        <p className="text-sm font-semibold text-emerald-300">{progress}%</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
      </div>
    </Card>
  );
}
