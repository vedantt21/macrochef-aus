import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border border-zinc-800 bg-zinc-950/72 p-5 shadow-sm ${className}`} {...props} />;
}

export function CardHeader({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase text-emerald-300">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-semibold text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}
