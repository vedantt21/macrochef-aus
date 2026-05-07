"use client";

const filters = ["recent", "friends", "public", "saved", "high-protein", "low-calorie", "popular", "mine"];

export default function RecipeFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (filter: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === filter ? "bg-emerald-400 text-zinc-950" : "bg-zinc-900 text-zinc-300 hover:text-white"
          }`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
