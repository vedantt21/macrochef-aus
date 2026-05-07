"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, ChefHat, Home, LogOut, Menu, Settings, UserRound, UsersRound, X } from "lucide-react";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Navbar";

type Me = {
  id: string;
  username: string;
  displayName: string;
  isVerified: boolean;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/tracker", label: "Tracker", icon: BarChart3 },
  { href: "/recipes", label: "Recipes", icon: ChefHat },
  { href: "/friends", label: "Friends", icon: UsersRound },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) throw new Error("Not authenticated");
        return response.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (!data.user?.isVerified) {
          router.replace(`/verify-email${data.user?.email ? `?email=${encodeURIComponent(data.user.email)}` : ""}`);
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.replace("/login"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 text-zinc-200">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-sm">Loading MacroChef...</div>
      </main>
    );
  }

  if (!user) return null;

  const navigation = (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/92 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <button
            className="grid size-10 place-items-center rounded-lg border border-zinc-800 text-zinc-100"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen ? <div className="border-t border-zinc-800 p-3">{navigation}</div> : null}
      </header>

      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-zinc-800 bg-zinc-950 p-5 lg:block">
          <Logo />
          <div className="mt-8">{navigation}</div>
          <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm font-semibold text-white">{user.displayName}</p>
            <p className="text-xs text-zinc-400">@{user.username}</p>
            <Button className="mt-4 w-full" variant="secondary" onClick={logout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
