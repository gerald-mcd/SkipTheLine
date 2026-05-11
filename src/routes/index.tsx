import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor } from "@/lib/mock-data";
import { Search, MapPin, Flame, Users, Clock, ArrowUpRight, Heart, Zap } from "lucide-react";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { VenueImage } from "@/components/VenueImage";
import { useFavorites } from "@/hooks/use-favorites";

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
  const [loading, setLoading] = useState(true);
  const { isFav, toggle } = useFavorites();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  // Re-trigger skeletons when filter changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [cat]);

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
          <div className="relative h-72 w-full bg-[var(--muted)]">
            {loading ? (
              <div className="absolute inset-0 animate-pulse" style={{ background: "var(--muted)" }} />
            ) : (
              <VenueImage src={hero.image} alt={hero.name} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.78) 100%)" }} />

            {/* Top tags */}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <span className="font-grotesk inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                <Flame className="h-3 w-3" style={{ color: "var(--destructive)" }} /> Hottest right now
              </span>
              <div className="flex items-center gap-2">
                {hero.event && (
                  <span className="font-grotesk rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white" style={{ background: "var(--primary)" }}>
                    {hero.event}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={isFav(hero.id) ? "Remove from favorites" : "Add to favorites"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(hero.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur"
                  style={{ background: "rgba(255,255,255,0.92)" }}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={isFav(hero.id) ? "var(--destructive)" : "transparent"}
                    style={{ color: isFav(hero.id) ? "var(--destructive)" : "var(--foreground)" }}
                  />
                </button>
              </div>
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

        <TrendingCarousel items={trending} loading={loading} />
      </div>

      {/* Shortest waits — editorial poster row */}
      <div className="mt-8">
        <div className="flex items-end justify-between px-5">
          <div>
            <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
              Walk straight in
            </p>
            <h3 className="font-display text-2xl font-semibold tracking-tight">Shortest waits</h3>
          </div>
          <span
            className="font-grotesk inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ border: "1px solid var(--border)", color: "var(--success)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--success)" }} />
              <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
            </span>
            Updated now
          </span>
        </div>

        {loading ? (
          <div className="mt-3 flex gap-3 overflow-hidden px-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-56 w-40 shrink-0 animate-pulse rounded-2xl" style={{ background: "var(--muted)" }} />
            ))}
          </div>
        ) : (
          <>
            {/* Featured #1 */}
            {shortest[0] && (
              <div className="mt-3 px-5">
                <Link
                  to="/venue/$id"
                  params={{ id: shortest[0].id }}
                  className="relative block overflow-hidden rounded-3xl"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <div className="relative h-44 w-full bg-[var(--muted)]">
                    <VenueImage src={shortest[0].image} alt={shortest[0].name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 100%)" }} />

                    {/* Fastest tag */}
                    <span
                      className="font-grotesk absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                      style={{ background: "var(--success)" }}
                    >
                      <Zap className="h-3 w-3" /> Fastest in
                    </span>

                    <div className="absolute inset-y-0 left-0 flex w-3/5 flex-col justify-center p-5 text-white">
                      <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.22em] opacity-90">
                        #01 · {shortest[0].categoryLabel}
                      </p>
                      <p className="font-display mt-1 text-2xl font-semibold leading-tight">{shortest[0].name}</p>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-display text-5xl font-semibold tabular-nums leading-none">{shortest[0].waitMinutes}</span>
                        <span className="font-grotesk text-[10px] font-semibold uppercase tracking-wider opacity-90">min · {shortest[0].distance}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={isFav(shortest[0].id) ? "Remove from favorites" : "Add to favorites"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(shortest[0].id);
                      }}
                      className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur"
                      style={{ background: "rgba(255,255,255,0.92)" }}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={isFav(shortest[0].id) ? "var(--destructive)" : "transparent"}
                        style={{ color: isFav(shortest[0].id) ? "var(--destructive)" : "var(--foreground)" }}
                      />
                    </button>
                  </div>
                </Link>
              </div>
            )}

            {/* Poster row */}
            <div
              className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {shortest.slice(1).map((v, idx) => {
                const rank = idx + 2;
                const fav = isFav(v.id);
                return (
                  <Link
                    key={v.id}
                    to="/venue/$id"
                    params={{ id: v.id }}
                    className="group relative block w-40 shrink-0 snap-start overflow-hidden rounded-2xl"
                    style={{ boxShadow: "var(--shadow-sm)" }}
                  >
                    <div className="relative h-56 w-full bg-[var(--muted)]">
                      <VenueImage src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover transition-transform group-active:scale-[0.97]" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)" }} />

                      {/* Oversized rank watermark */}
                      <span
                        className="font-display absolute -left-1 -top-3 select-none text-[88px] font-semibold leading-none tracking-tight text-white"
                        style={{ opacity: 0.22 }}
                      >
                        {String(rank).padStart(2, "0")}
                      </span>

                      {/* Wait pill */}
                      <span
                        className="font-grotesk absolute right-2 top-2 inline-flex items-baseline gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums text-white"
                        style={{ background: severityColor(v.severity) }}
                      >
                        {v.waitMinutes}<span className="text-[9px] font-semibold">m</span>
                      </span>

                      <button
                        type="button"
                        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggle(v.id);
                        }}
                        className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full backdrop-blur"
                        style={{ background: "rgba(255,255,255,0.92)" }}
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          fill={fav ? "var(--destructive)" : "transparent"}
                          style={{ color: fav ? "var(--destructive)" : "var(--foreground)" }}
                        />
                      </button>

                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="font-grotesk text-[9px] font-semibold uppercase tracking-[0.18em] opacity-90">
                          {v.categoryLabel}
                        </p>
                        <p className="font-display truncate text-base font-semibold leading-tight">{v.name}</p>
                        <p className="mt-0.5 text-[10px] opacity-90">{v.distance} · {v.liveReporters} live</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
