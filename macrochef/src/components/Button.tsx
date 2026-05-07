import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-emerald-400 text-zinc-950 hover:bg-emerald-300",
  secondary: "border border-zinc-700 bg-zinc-900 text-zinc-50 hover:border-emerald-400/60 hover:bg-zinc-800",
  ghost: "text-zinc-300 hover:bg-zinc-900 hover:text-white",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({ className = "", variant = "primary", href, children, ...props }: LinkButtonProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} href={href} {...props}>
      {children}
    </Link>
  );
}
