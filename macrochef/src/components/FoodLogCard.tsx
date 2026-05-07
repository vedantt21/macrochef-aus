"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

type FoodLog = {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  servingSize?: string | null;
  notes?: string | null;
};

export default function FoodLogCard({
  log,
  onEdit,
  onDelete,
}: {
  log: FoodLog;
  onEdit?: (log: FoodLog) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-300">{log.mealType.toLowerCase()}</p>
          <h3 className="mt-1 font-semibold text-white">{log.foodName}</h3>
          <p className="text-sm text-zinc-400">
            {log.servingSize || "Serving"} {log.notes ? `- ${log.notes}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <span className="font-bold text-white">{log.calories} cal</span>
          <span>P {log.protein}g</span>
          <span>C {log.carbs}g</span>
          <span>F {log.fat}g</span>
          {onEdit ? (
            <Button variant="ghost" className="size-10 px-0" onClick={() => onEdit(log)} aria-label="Edit food log">
              <Pencil size={16} />
            </Button>
          ) : null}
          {onDelete ? (
            <Button variant="ghost" className="size-10 px-0 text-rose-300" onClick={() => onDelete(log.id)} aria-label="Delete food log">
              <Trash2 size={16} />
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
