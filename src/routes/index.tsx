import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CityMap } from "@/components/CityMap";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor } from "@/lib/mock-data";
import { Search, Users, TrendingUp, Zap } from "lucide-react";
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
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Miami · Brickell
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Live near you</h1>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
            <Users className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />
            <span className="text-xs font-semibold tabular-nums">{totalReporters}</span>
            <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>live</span>
          </div>
        </div>

        {/* Search */}
        <button
          className="mt-3 flex w-full items-center gap-2 rounded-xl bg-white px-4 py-3 text-left"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Search venues</span>
        </button>

        {/* Categories */}
        <div className="mt-3">
          <CategoryChips active={cat} onChange={setCat} />
        </div>
      </div>

      {/* Bottom sheet — trending */}
      <div className="absolute inset-x-0 bottom-24 z-20 px-4">
        <div
          className="rounded-2xl bg-white p-3.5"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Trending near you</h2>
            <Link to="/explore" className="text-xs font-medium" style={{ color: "var(--primary)" }}>
              See all
            </Link>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {trending.map((v) => (
              <Link
                key={v.id}
                to="/venue/$id"
                params={{ id: v.id }}
                className="shrink-0 rounded-xl p-2.5"
                style={{ width: 168, background: "var(--surface-elevated)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                      {v.categoryLabel}
                    </p>
                    <p className="truncate text-sm font-semibold">{v.name}</p>
                  </div>
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" style={{ color: severityColor(v.severity) }} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-semibold tabular-nums" style={{ color: severityColor(v.severity) }}>
                    {v.waitMinutes}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>min</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  <Zap className="h-3 w-3" />
                  {v.liveReporters} live · {v.distance}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
