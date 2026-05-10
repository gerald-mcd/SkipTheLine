import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CityMap } from "@/components/CityMap";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor } from "@/lib/mock-data";
import { Search, Users, TrendingUp, Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkipTheLine — Live map of your city" },
      { name: "description", content: "See live wait times around you. Open the radar." },
    ],
  }),
  component: MapScreen,
});

function MapScreen() {
  const [cat, setCat] = useState<Category | "all">("all");
  const filtered = cat === "all" ? venues : venues.filter((v) => v.category === cat);
  const trending = [...venues].sort((a, b) => b.liveReporters - a.liveReporters).slice(0, 4);
  const totalReporters = venues.reduce((s, v) => s + v.liveReporters, 0);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <CityMap venues={filtered} />

      {/* Top overlay */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
              Miami · Brickell
            </p>
            <h1 className="text-xl font-bold leading-tight">Live near you</h1>
          </div>
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--primary)" }} />
              <span className="relative h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
            </span>
            <Users className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
            <span className="text-xs font-bold tabular-nums">{totalReporters}</span>
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>nearby</span>
          </div>
        </div>

        {/* Search */}
        <button className="glass-strong mt-3 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left">
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Search restaurants, clubs, anything…</span>
        </button>

        {/* Categories */}
        <div className="mt-3">
          <CategoryChips active={cat} onChange={setCat} />
        </div>
      </div>

      {/* Bottom sheet — trending */}
      <div className="absolute inset-x-0 bottom-24 z-20 px-4">
        <div className="glass-strong rounded-3xl p-4 shadow-[var(--shadow-elevated)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4" style={{ color: "var(--warning)" }} />
              <h2 className="text-sm font-bold">Trending near you</h2>
            </div>
            <Link to="/explore" className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
              See all
            </Link>
          </div>
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
            {trending.map((v) => (
              <Link
                key={v.id}
                to="/venue/$id"
                params={{ id: v.id }}
                className="group relative shrink-0 overflow-hidden rounded-2xl p-3"
                style={{
                  width: 180,
                  background: "oklch(0.24 0.03 262 / 0.8)",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                      {v.categoryLabel}
                    </p>
                    <p className="truncate text-sm font-bold">{v.name}</p>
                  </div>
                  <TrendingUp className="h-3.5 w-3.5" style={{ color: severityColor(v.severity) }} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black tabular-nums" style={{ color: severityColor(v.severity) }}>
                    {v.waitMinutes}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>min</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Zap className="h-3 w-3" style={{ color: "var(--primary)" }} />
                  <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    {v.liveReporters} live · {v.distance}
                  </span>
                </div>
                {v.event && (
                  <div className="mt-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "oklch(0.7 0.22 290 / 0.2)", color: "var(--accent)" }}>
                    ★ {v.event}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
