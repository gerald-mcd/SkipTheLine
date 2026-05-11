import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor } from "@/lib/mock-data";
import { Search, MapPin, Flame, Users, Clock, ArrowUpRight } from "lucide-react";

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
  const trending = [...rest].sort((a, b) => b.liveReporters - a.liveReporters).slice(0, 4);
  const shortest = [...rest].sort((a, b) => a.waitMinutes - b.waitMinutes).slice(0, 6);
  const totalReporters = venues.reduce((s, v) => s + v.liveReporters, 0);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
            <span className="text-[11px] font-grotesk font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
              Miami · Brickell
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1"
            style={{ border: "1px solid var(--border)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--success)" }} />
              <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
            </span>
            <span className="text-[11px] font-grotesk font-semibold tabular-nums">{totalReporters}</span>
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>live</span>
          </div>
        </div>

        <h1 className="font-display mt-3 text-[40px] font-semibold leading-[1.02] tracking-tight">
          Skip the
          <br />
          <span style={{ fontStyle: "italic", color: "var(--primary)" }}>line</span> tonight.
        </h1>
        <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Crowd-powered wait times for the spots people actually want to be at.
        </p>

        {/* Search */}
        <button
          className="mt-4 flex w-full items-center gap-2 rounded-full bg-white px-4 py-3 text-left"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Search restaurants, clubs, barbers…</span>
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
          className="relative block overflow-hidden rounded-3xl"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="relative h-72 w-full">
            <img src={hero.image} alt={hero.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.78) 100%)" }} />

            {/* Top tags */}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <span className="font-grotesk inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                <Flame className="h-3 w-3" style={{ color: "var(--destructive)" }} /> Hottest right now
              </span>
              {hero.event && (
                <span className="font-grotesk rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white" style={{ background: "var(--primary)" }}>
                  {hero.event}
                </span>
              )}
            </div>

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.2em] opacity-90">
                {hero.categoryLabel} · {hero.vibe}
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <h2 className="font-display text-4xl font-semibold leading-none tracking-tight">{hero.name}</h2>
                <ArrowUpRight className="h-7 w-7 shrink-0" />
              </div>
              <div className="mt-3 flex items-center gap-3 text-[12px]">
                <span
                  className="font-grotesk inline-flex items-baseline gap-1 rounded-full px-2.5 py-1 font-semibold"
                  style={{ background: severityColor(hero.severity), color: "white" }}
                >
                  <span className="text-base tabular-nums">{hero.waitMinutes}</span>
                  <span className="text-[10px] uppercase tracking-wider">min wait</span>
                </span>
                <span className="inline-flex items-center gap-1 opacity-95">
                  <Users className="h-3.5 w-3.5" /> {hero.liveReporters} live
                </span>
                <span className="inline-flex items-center gap-1 opacity-95">
                  <Clock className="h-3.5 w-3.5" /> {hero.lastReportMinutes}m ago
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Trending carousel */}
      <div className="mt-8">
        <div className="flex items-end justify-between px-5">
          <div>
            <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
              Trending nearby
            </p>
            <h3 className="font-display text-2xl font-semibold tracking-tight">The buzz tonight</h3>
          </div>
          <Link to="/explore" className="font-grotesk text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
            See all →
          </Link>
        </div>

        <div
          className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {trending.map((v) => (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="group relative block w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="relative h-72 w-full">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover transition-transform group-active:scale-[0.98]" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)" }} />
                <span
                  className="font-grotesk absolute right-3 top-3 inline-flex items-baseline gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums text-white"
                  style={{ background: severityColor(v.severity) }}
                >
                  {v.waitMinutes}<span className="text-[9px] font-semibold">m wait</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.18em] opacity-90">
                    {v.categoryLabel} · {v.vibe}
                  </p>
                  <p className="font-display text-2xl font-semibold leading-tight">{v.name}</p>
                  <p className="mt-1 text-[11px] opacity-90">{v.liveReporters} live · {v.distance}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shortest waits — editorial list */}
      <div className="mt-8 px-5">
        <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
          Walk straight in
        </p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">Shortest waits</h3>

        <div className="mt-3 space-y-2">
          {shortest.map((v, i) => (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="flex items-center gap-3 rounded-2xl bg-white p-2 pr-3"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-grotesk text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  {String(i + 1).padStart(2, "0")} · {v.categoryLabel}
                </p>
                <p className="font-display truncate text-lg font-semibold leading-tight">{v.name}</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {v.distance} · {v.liveReporters} live
                </p>
              </div>
              <div className="text-right">
                <p className="font-grotesk text-2xl font-bold tabular-nums leading-none" style={{ color: severityColor(v.severity) }}>
                  {v.waitMinutes}
                </p>
                <p className="font-grotesk text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
