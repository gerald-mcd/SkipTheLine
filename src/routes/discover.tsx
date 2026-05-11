import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CityMap } from "@/components/CityMap";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor, severityLabel, walkMinutes } from "@/lib/mock-data";
import { ChevronUp, Clock, Footprints, Search, Users } from "lucide-react";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover nearby — SkipTheLine" },
      { name: "description", content: "Map-first discovery of restaurants and spots near you with live wait times." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(true);

  const list = useMemo(
    () => (cat === "all" ? venues : venues.filter((v) => v.category === cat)),
    [cat],
  );

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden">
      {/* Map layer */}
      <CityMap venues={list} />

      {/* Floating search */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
        <div
          className="flex items-center gap-2 rounded-full bg-white px-3 py-2.5"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <input
            placeholder="Restaurant name or dish..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{ background: "var(--primary)" }}
            aria-label="Filters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="14" y2="7" /><circle cx="17" cy="7" r="2.2" />
              <line x1="10" y1="17" x2="20" y2="17" /><circle cx="7" cy="17" r="2.2" />
            </svg>
          </button>
        </div>

        <div className="mt-3">
          <CategoryChips active={cat} onChange={setCat} />
        </div>
      </div>

      {/* Bottom card sheet */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white transition-transform duration-300"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 -8px 32px -12px color-mix(in oklab, var(--primary) 25%, transparent)",
          transform: sheetOpen ? "translateY(0)" : "translateY(calc(100% - 80px))",
        }}
      >
        <button
          type="button"
          onClick={() => setSheetOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3"
        >
          <div className="flex items-center gap-2">
            <span className="h-1 w-10 rounded-full" style={{ background: "var(--border)" }} />
          </div>
        </button>
        <div className="-mt-2 flex items-center justify-between px-5 pb-2">
          <div>
            <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
              Nearby
            </p>
            <h2 className="font-display text-xl font-bold tracking-tight">
              {list.length} spots <span style={{ color: "var(--primary)" }}>around you</span>
            </h2>
          </div>
          <ChevronUp
            className="h-5 w-5 transition-transform"
            style={{ color: "var(--muted-foreground)", transform: sheetOpen ? "rotate(180deg)" : "none" }}
          />
        </div>

        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-5 pt-2">
          {list.map((v) => {
            const c = severityColor(v.severity);
            const walk = walkMinutes(v.distance);
            return (
              <Link
                key={v.id}
                to="/venue/$id"
                params={{ id: v.id }}
                className="block w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white transition-transform active:scale-[0.98]"
                style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="relative h-28 w-full">
                  <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
                  <span
                    className="font-grotesk absolute left-2 top-2 inline-flex items-baseline gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: c }}
                  >
                    <span className="tabular-nums">{v.waitMinutes}m</span>
                    <span className="text-[8px] uppercase tracking-wider opacity-90">{severityLabel(v.severity)}</span>
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-grotesk text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
                    {v.categoryLabel} · {v.distance}
                  </p>
                  <h3 className="font-display mt-0.5 truncate text-sm font-bold tracking-tight">{v.name}</h3>
                  <div className="font-grotesk mt-2 flex items-center gap-3 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      <span className="font-bold" style={{ color: "var(--foreground)" }}>{v.liveReporters}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Footprints className="h-3 w-3" /> {walk}m
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {v.lastReportMinutes}m
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}