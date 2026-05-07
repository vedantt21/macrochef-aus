import { BarChart3, ChefHat, LockKeyhole, Sparkles, UsersRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";

const features = [
  {
    icon: BarChart3,
    title: "Macro tracking that feels fast",
    body: "Log meals, copy recipes into your day, and keep calories, protein, carbs, and fat in one clean view.",
  },
  {
    icon: ChefHat,
    title: "A recipe feed with real context",
    body: "Browse public posts, friends-only meals, saved recipes, and high-protein ideas without leaving your tracker.",
  },
  {
    icon: UsersRound,
    title: "Accountability with boundaries",
    body: "Add friends, manage requests, and keep profile or recipe visibility public, friends-only, or private.",
  },
  {
    icon: LockKeyhole,
    title: "Secure from the first signup",
    body: "Email verification, hashed passwords, HTTP-only session cookies, and privacy checks protect the core flows.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-28"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#080b0a_0%,rgba(8,11,10,.88)_45%,rgba(8,11,10,.55)_100%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[1fr_440px]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase text-emerald-300">Nutrition plus social momentum</p>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                Track your macros. Share your meals. Eat better together.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                MacroChef combines calorie tracking, macro goals, recipe sharing, and social accountability into one simple web app.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/register">Get Started</LinkButton>
                <LinkButton href="#features" variant="secondary">
                  Explore Features
                </LinkButton>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-zinc-950/82 p-4 shadow-2xl">
              <div className="rounded-lg bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">Today</p>
                  <p className="rounded bg-emerald-400 px-2 py-1 text-xs font-black text-zinc-950">1,640 / 2,200</p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {["Protein", "Carbs", "Fat"].map((macro, index) => (
                    <div key={macro} className="rounded-lg bg-zinc-950 p-3">
                      <p className="text-xs text-zinc-500">{macro}</p>
                      <div className="mt-3 h-20 rounded bg-zinc-800">
                        <div
                          className="mt-auto rounded bg-emerald-400"
                          style={{ height: `${[72, 58, 44][index]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {["Salmon rice bowl", "Greek yoghurt crunch", "Chicken pesto pasta"].map((meal, index) => (
                  <div key={meal} className="flex items-center justify-between rounded-lg bg-zinc-900 p-3">
                    <div>
                      <p className="font-semibold text-white">{meal}</p>
                      <p className="text-xs text-zinc-500">{["Lunch", "Snack", "Dinner"][index]}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-300">{[520, 240, 610][index]} cal</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-3">
          {[
            ["The problem", "Most trackers are lonely spreadsheets. Most social feeds ignore nutrition. MacroChef gives both jobs one home."],
            ["The value", "Your recipes carry calories and macros, so inspiration can become a logged meal in a few clicks."],
            ["The habit", "Friends, saves, comments, and privacy controls make food tracking easier to keep up without oversharing."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h2 className="text-xl font-black text-white">{title}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{body}</p>
            </Card>
          ))}
        </section>

        <section id="features" className="border-y border-white/10 bg-zinc-900/45 py-16">
          <div className="mx-auto max-w-7xl px-5">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase text-emerald-300">Features</p>
              <h2 className="mt-3 text-4xl font-black text-white">Built for people who actually cook, train, and share food.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <Icon className="text-emerald-300" size={28} />
                    <h3 className="mt-5 font-black text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.body}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-300">How it works</p>
            <h2 className="mt-3 text-4xl font-black text-white">One loop: set goals, log food, learn from the feed.</h2>
            <p className="mt-5 leading-8 text-zinc-400">
              Register, verify your email, set your macro targets, then log meals from scratch or from shared recipes. The app keeps your daily nutrition totals in sync while your recipe profile grows.
            </p>
          </div>
          <div className="grid gap-4">
            {["Verify your account with a six-digit SMTP code.", "Add food logs or copy recipe macros into the tracker.", "Post recipes with tags, visibility, likes, saves, and comments.", "Use friends and privacy settings to decide who sees what."].map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-400 font-black text-zinc-950">{index + 1}</span>
                <p className="leading-7 text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="recipes" className="border-y border-white/10 bg-zinc-900/45 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-3">
            <Card>
              <ChefHat className="text-emerald-300" />
              <h2 className="mt-4 text-2xl font-black text-white">Social recipe feed</h2>
              <p className="mt-3 text-zinc-400">Letterboxd-inspired cards make recipes feel collectible, searchable, and easy to revisit.</p>
            </Card>
            <Card>
              <BarChart3 className="text-emerald-300" />
              <h2 className="mt-4 text-2xl font-black text-white">Macro dashboard</h2>
              <p className="mt-3 text-zinc-400">Daily calories, remaining targets, protein, carbs, fat, and recent logs stay visible.</p>
            </Card>
            <Card>
              <UsersRound className="text-emerald-300" />
              <h2 className="mt-4 text-2xl font-black text-white">Friends and privacy</h2>
              <p className="mt-3 text-zinc-400">Public, friends-only, and private visibility rules are enforced by the API layer.</p>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-400 p-8 text-zinc-950 md:p-10">
            <Sparkles size={28} />
            <h2 className="mt-4 max-w-3xl text-4xl font-black">Make every meal easier to track, save, and share.</h2>
            <p className="mt-4 max-w-2xl text-zinc-900">
              Build better food habits with clear daily targets, a social recipe feed, and privacy controls that fit how you eat.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/register" className="bg-zinc-950 text-white hover:bg-zinc-900">
                Create Account
              </LinkButton>
              <LinkButton href="/login" variant="secondary" className="border-zinc-950 text-zinc-950 hover:bg-emerald-300">
                Login
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
