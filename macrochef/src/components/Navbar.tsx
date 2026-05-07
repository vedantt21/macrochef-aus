import Link from "next/link";
import { LinkButton } from "@/components/Button";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-black text-white">
      <span className="grid size-9 place-items-center rounded-lg bg-emerald-400 text-zinc-950">MC</span>
      <span>MacroChef</span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo />
        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-300 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white">
            How it works
          </a>
          <a href="#recipes" className="hover:text-white">
            Recipes
          </a>
        </div>
        <div className="flex items-center gap-2">
          <LinkButton href="/login" variant="ghost" className="hidden sm:inline-flex">
            Login
          </LinkButton>
          <LinkButton href="/register">Get Started</LinkButton>
        </div>
      </nav>
    </header>
  );
}
