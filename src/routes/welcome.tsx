import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { venues } from "@/lib/mock-data";
import { RollingNumber } from "@/components/RollingNumber";
import { WaitBadge } from "@/components/WaitBadge";
import { MapPin, Star, Flame, Clock3, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "SkipTheLine — When to go, where you want to go" },
      {
        name: "description",
        content:
          "Live, crowd-powered wait times for restaurants, nightlife, and more — SkipTheLine tells you when to go, where you want to go.",
      },
    ],
  }),
  component: Welcome,
});

const hero = venues.find((v) => v.id === "v1")!; // Komodo
const trending = venues.filter((v) => v.id !== "v1").slice(0, 5);

const moods = [
  { emoji: "🔥", label: "Trending" },
  { emoji: "🍽️", label: "Dinner" },
  { emoji: "🍸", label: "Cocktails" },
  { emoji: "🌃", label: "Late-night" },
  { emoji: "☕", label: "Coffee" },
  { emoji: "🍣", label: "Sushi" },
];

function Welcome() {
  const [heroWait, setHeroWait] = useState(hero.waitMinutes);
  const [reporters, setReporters] = useState(2418);
  const [trendWaits, setTrendWaits] = useState(
    trending.map((t) => t.waitMinutes),
  );

  // Live-feel ticking — small drift every 2s
  useEffect(() => {
    const t = setInterval(() => {
      setHeroWait((w) => Math.max(22, Math.min(58, w + (Math.random() > 0.5 ? 1 : -1))));
      setReporters((r) => Math.max(2400, Math.min(2450, r + (Math.random() > 0.5 ? 1 : -1))));
      setTrendWaits((arr) => {
        const i = Math.floor(Math.random() * arr.length);
        return arr.map((m, idx) =>
          idx === i ? Math.max(2, m + (Math.random() > 0.5 ? 1 : -1)) : m,
        );
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="font-grotesk relative min-h-screen w-full overflow-x-hidden pb-[260px]"
      style={{ background: "var(--background)" }}
    >
      {/* HERO IMAGE */}
      <div className="relative h-[58vh] min-h-[440px] w-full overflow-hidden">
        <img
          src={hero.image}
          alt={hero.name}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.04)" }}
        />
        {/* Gradient scrim */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, black 25%, transparent) 0%, transparent 30%, color-mix(in oklab, black 35%, transparent) 65%, var(--background) 100%)",
          }}
        />
        {/* Warm color wash */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--primary) 22%, transparent) 0%, transparent 55%)",
          }}
        />

        {/* Brand row */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-6">
          <div className="animate-fade-in-up flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-2xl text-white"
              style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <MapPin className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="font-display text-[16px] font-extrabold tracking-tight text-white drop-shadow">
              SkipTheLine
            </span>
          </div>
          <Link
            to="/"
            className="press-depth rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md"
            style={{ border: "1px solid rgba(255,255,255,0.25)" }}
          >
            Skip →
          </Link>
        </div>

        {/* Live status — top-left chip */}
        <div className="relative z-10 mt-4 px-5">
          <div
            className="animate-fade-in-up inline-flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              animationDelay: "60ms",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping-soft absolute inline-flex h-full w-full rounded-full"
                style={{ background: "var(--wait-short)" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "var(--wait-short)" }}
              />
            </span>
            <span className="text-[11px] font-semibold text-white">
              <RollingNumber value={reporters} minDigits={4} /> people reporting nearby
            </span>
          </div>
        </div>

        {/* Headline anchored to bottom-left of hero */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8">
          <h1
            className="font-display animate-fade-in-up text-[40px] font-extrabold leading-[0.95] tracking-tight text-white"
            style={{ animationDelay: "120ms", textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}
          >
            Know the wait
            <br />
            <span style={{ color: "var(--primary-glow)" }}>before you go.</span>
          </h1>
          <p
            className="animate-fade-in-up mt-3 max-w-[320px] text-[13px] font-medium text-white/90"
            style={{ animationDelay: "200ms" }}
          >
            The only app that tells you{" "}
            <span className="font-bold text-white">when to go</span>, where you
            want to go.
          </p>

          {/* Featured venue overlay card */}
          <div
            className="animate-fade-in-up mt-5 flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 backdrop-blur-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 20px 50px -16px rgba(0,0,0,0.4)",
              animationDelay: "280ms",
            }}
          >
            <img
              src={hero.image}
              alt=""
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[9px] font-extrabold uppercase tracking-[0.14em]"
                  style={{ color: "var(--primary)" }}
                >
                  <Flame className="mr-0.5 inline h-2.5 w-2.5" />
                  Trending now
                </span>
              </div>
              <h3 className="font-display truncate text-[14px] font-bold tracking-tight">
                {hero.name}
              </h3>
              <p
                className="font-grotesk truncate text-[10px]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {hero.vibe} · {hero.distance}
              </p>
            </div>
            <WaitBadge minutes={heroWait} severity={hero.severity} size="md" />
          </div>
        </div>
      </div>

      {/* MOOD CHIPS — horizontal scroller, restaurant-app style */}
      <div className="-mt-2 px-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 pt-2">
          {moods.map((m, i) => (
            <span
              key={m.label}
              className="animate-fade-in-up shrink-0 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold"
              style={{
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                animationDelay: `${360 + i * 40}ms`,
              }}
            >
              <span className="mr-1">{m.emoji}</span>
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* TRENDING TONIGHT RAIL */}
      <div className="mt-6 px-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-[17px] font-bold tracking-tight">
              Tonight near you
            </h2>
            <p
              className="font-grotesk text-[11px]"
              style={{ color: "var(--muted-foreground)" }}
            >
              Live waits, updated by people on the ground
            </p>
          </div>
          <span
            className="font-grotesk inline-flex items-center text-[11px] font-bold"
            style={{ color: "var(--primary)" }}
          >
            See all <ChevronRight className="h-3 w-3" />
          </span>
        </div>

        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-2">
          {trending.map((v, i) => (
            <div
              key={v.id}
              className="animate-fade-in-up card-lift relative w-[150px] shrink-0 overflow-hidden rounded-2xl bg-white"
              style={{
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                animationDelay: `${480 + i * 70}ms`,
              }}
            >
              <div className="relative h-[100px]">
                <img
                  src={v.image}
                  alt={v.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
                <div className="absolute bottom-1.5 right-1.5">
                  <WaitBadge minutes={trendWaits[i]} severity={v.severity} size="sm" />
                </div>
                <div className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur">
                  <Star
                    className="h-2.5 w-2.5"
                    fill="oklch(0.78 0.16 75)"
                    stroke="oklch(0.78 0.16 75)"
                  />
                  <span className="tabular-nums">
                    {(4 + ((i * 7) % 9) / 10).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="font-display truncate text-[12px] font-bold tracking-tight">
                  {v.name}
                </h3>
                <p
                  className="font-grotesk mt-0.5 flex items-center gap-1 truncate text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Clock3 className="h-2.5 w-2.5" />
                  {v.distance} · {v.vibe.split("·")[0].trim()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="mt-5 px-5">
        <div
          className="animate-fade-in-up flex items-center gap-3 rounded-2xl bg-white p-3.5"
          style={{
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            animationDelay: "780ms",
          }}
        >
          <div className="flex -space-x-2">
            {[
              { c: "S", bg: "oklch(0.62 0.16 30)" },
              { c: "M", bg: "oklch(0.62 0.14 200)" },
              { c: "D", bg: "oklch(0.62 0.14 140)" },
              { c: "A", bg: "oklch(0.62 0.16 280)" },
            ].map((p, i) => (
              <span
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: p.bg, border: "2px solid white" }}
              >
                {p.c}
              </span>
            ))}
          </div>
          <div className="flex-1">
            <p className="font-display text-[12px] font-bold tracking-tight">
              Sofía, Marcus & 2,416 others
            </p>
            <p
              className="font-grotesk text-[10px]"
              style={{ color: "var(--muted-foreground)" }}
            >
              reported wait times in the last hour
            </p>
          </div>
          <Flame
            className="h-5 w-5"
            style={{ color: "var(--primary)" }}
            fill="currentColor"
          />
        </div>
      </div>

      {/* AUTH — sticky bottom sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 rounded-t-3xl px-5 pb-7 pt-5"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -12px 40px -12px rgba(0,0,0,0.12)",
        }}
      >
        <Link
          to="/"
          className="press-depth font-display animate-gradient flex h-13 w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold text-white"
          style={{
            background:
              "linear-gradient(120deg, var(--primary) 0%, var(--primary-glow) 50%, var(--primary) 100%)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          Continue with email
        </Link>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            or
          </span>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="press-depth flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13px] font-semibold"
            style={{ border: "1px solid var(--border)" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="press-depth flex items-center justify-center gap-2 rounded-2xl py-3 text-[13px] font-semibold text-white"
            style={{ background: "var(--foreground)" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.96.95-2.13 1.72-3.32 1.72-1.19 0-1.61-.72-3.08-.72-1.47 0-1.94.7-3.04.72-1.11.02-2.31-.83-3.29-1.78-2-1.92-3.04-5.32-2.06-7.85 1-2.51 3.51-4.04 5.76-4.04 1.16 0 2.14.39 3 .39.86 0 2.1-.51 3.44-.51 1.41 0 2.67.5 3.51 1.48-2.61 1.45-2.19 5.38.45 6.51-.55 1.57-1.47 3.08-2.47 4.08zM12.03 7.25c-.02-2.23 1.84-4.13 4.04-4.25.13 2.19-1.92 4.2-4.04 4.25z" />
            </svg>
            Apple
          </button>
        </div>

        <p
          className="mt-3 text-center text-[11px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          By continuing you agree to the{" "}
          <span style={{ color: "var(--foreground)" }}>Terms</span> &{" "}
          <span style={{ color: "var(--foreground)" }}>Privacy</span>.
        </p>
      </div>
    </div>
  );
}
