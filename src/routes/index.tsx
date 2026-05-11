import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor } from "@/lib/mock-data";
import { Search, MapPin, Flame, Users, Clock, ArrowUpRight, Sparkles, ChevronRight, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkipTheLine — Live wait times in your city" },
      { name: "description", content: "Real-time, crowd-powered wait times. See the line before you go." },
    ],
  }),
  component: Home,
});

function Home() {
  const [cat, setCat] = useState<Category | "all">("all");
  const filtered = cat === "all" ? venues : venues.filter((v) => v.category === cat);
  const hero = [...filtered].sort((a, b) => b.liveReporters - a.liveReporters)[0] ?? venues[0];
  const rest = filtered.filter((v) => v.id !== hero.id);
  const trending = [...rest].sort((a, b) => b.liveReporters - a.liveReporters).slice(0, 6);
  const shortest = [...rest].sort((a, b) => a.waitMinutes - b.waitMinutes).slice(0, 6);
  const totalReporters = venues.reduce((s, v) => s + v.liveReporters, 0);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
            <span className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
              Miami · Brickell
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={"/social" as any}
              className="font-grotesk rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
            >
              Try Social →
            </Link>
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: "var(--accent-mint)" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--success)" }} />
                <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
              </span>
              <span className="font-grotesk text-[11px] font-bold tabular-nums" style={{ color: "var(--accent-mint-fg)" }}>{totalReporters}</span>
              <span className="text-[10px] font-semibold" style={{ color: "var(--accent-mint-fg)" }}>live</span>
            </div>
          </div>
        </div>

        <h1 className="font-display mt-3 text-[44px] leading-[0.95] tracking-tight">
          Skip the
          <br />
          <span style={{ color: "var(--primary)" }}>line</span>
          <span style={{ color: "var(--accent-rose-fg)" }}>.</span>
        </h1>
        <p className="font-jakarta mt-2 max-w-[280px] text-[13px] font-medium leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Real-time crowd waits for the spots people actually want to be at tonight.
        </p>

        <button
          className="mt-4 flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-left"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <span className="font-jakarta text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>Search restaurants, clubs, barbers…</span>
        </button>

        <div className="mt-4">
          <CategoryChips active={cat} onChange={setCat} />
        </div>
      </div>

      {/* Hero card */}
      <div className="mt-5 px-5">
        <Link
          to="/venue/$id"
          params={{ id: hero.id }}
          className="relative block overflow-hidden rounded-[28px]"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="relative h-72 w-full">
            <img src={hero.image} alt={hero.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.82) 100%)" }} />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <span
                className="font-grotesk inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "var(--accent-rose)", color: "var(--accent-rose-fg)" }}
              >
                <Flame className="h-3 w-3" /> Hottest now
              </span>
              {hero.event && (
                <span className="font-grotesk rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: "var(--primary)" }}>
                  {hero.event}
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">
                {hero.categoryLabel} · {hero.vibe}
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <h2 className="font-display text-[40px] leading-none">{hero.name}</h2>
                <ArrowUpRight className="h-7 w-7 shrink-0" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[12px]">
                <span
                  className="font-grotesk inline-flex items-baseline gap-1 rounded-full px-2.5 py-1 font-bold"
                  style={{ background: severityColor(hero.severity), color: "white" }}
                >
                  <span className="text-base tabular-nums">{hero.waitMinutes}</span>
                  <span className="text-[10px] uppercase tracking-wider">min</span>
                </span>
                <span className="font-jakarta inline-flex items-center gap-1 font-semibold opacity-95">
                  <Users className="h-3.5 w-3.5" /> {hero.liveReporters} live
                </span>
                <span className="font-jakarta inline-flex items-center gap-1 font-semibold opacity-95">
                  <Clock className="h-3.5 w-3.5" /> {hero.lastReportMinutes}m ago
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Trending — horizontal swipe (OpenTable style) */}
      <section
        className="mt-8 py-6"
        style={{ background: "var(--accent-peach)" }}
      >
        <div className="flex items-end justify-between px-5">
          <div>
            <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent-peach-fg)" }}>
              <Flame className="mr-0.5 inline h-3 w-3" /> Trending nearby
            </p>
            <h3 className="font-display text-[26px] leading-tight" style={{ color: "var(--accent-peach-fg)" }}>The buzz tonight</h3>
          </div>
          <Link to="/explore" className="font-grotesk inline-flex items-center text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-peach-fg)" }}>
            See all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1 snap-x snap-mandatory">
          {trending.map((v) => (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="snap-start shrink-0 w-[230px] overflow-hidden rounded-2xl bg-white"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="relative h-40 w-full">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
                <span
                  className="font-grotesk absolute right-2 top-2 inline-flex items-baseline gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums text-white"
                  style={{ background: severityColor(v.severity) }}
                >
                  {v.waitMinutes}<span className="text-[9px]">m</span>
                </span>
                <button className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 backdrop-blur">
                  <Heart className="h-3.5 w-3.5" style={{ color: "var(--foreground)" }} />
                </button>
              </div>
              <div className="p-3">
                <p className="font-grotesk text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  {v.categoryLabel} · {v.distance}
                </p>
                <p className="font-display mt-0.5 truncate text-[19px] leading-tight">{v.name}</p>
                <p className="font-jakarta mt-0.5 text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {v.vibe}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-grotesk inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: "var(--success)" }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
                    {v.liveReporters} live
                  </span>
                  <span className="font-grotesk text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                    Book →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shortest waits — editorial list with color block */}
      <section
        className="mt-2 py-6 px-5"
        style={{ background: "var(--accent-mint)" }}
      >
        <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent-mint-fg)" }}>
          <Sparkles className="mr-0.5 inline h-3 w-3" /> Walk straight in
        </p>
        <h3 className="font-display text-[26px] leading-tight" style={{ color: "var(--accent-mint-fg)" }}>Shortest waits</h3>

        <div className="mt-3 space-y-2">
          {shortest.map((v, i) => (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="flex items-center gap-3 rounded-2xl bg-white p-2 pr-3"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-grotesk text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  {String(i + 1).padStart(2, "0")} · {v.categoryLabel}
                </p>
                <p className="font-display truncate text-[19px] leading-tight">{v.name}</p>
                <p className="font-jakarta text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {v.distance} · {v.liveReporters} live
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl tabular-nums leading-none" style={{ color: severityColor(v.severity) }}>
                  {v.waitMinutes}
                </p>
                <p className="font-grotesk text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
