import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
const CityMap = lazy(() =>
  import("@/components/CityMap").then((m) => ({ default: m.CityMap })),
);
import { venues, Category, categories } from "@/lib/mock-data";
import { WaitBadge } from "@/components/WaitBadge";
import { MapPin, Search, SlidersHorizontal, Users, X, Minus, Plus } from "lucide-react";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";
import { ReportCTA } from "@/components/ReportCTA";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover nearby — SkipTheLine" },
      { name: "description", content: "Map-first discovery of restaurants and spots near you with live wait times." },
    ],
  }),
  component: Discover,
});

type SortKey = "trending" | "wait" | "distance";
const sortOptions: { id: SortKey; label: string; emoji: string }[] = [
  { id: "trending", label: "Trending", emoji: "🔥" },
  { id: "wait", label: "Shortest wait", emoji: "⏱️" },
  { id: "distance", label: "Closest", emoji: "📍" },
];

const DEFAULT_RADIUS_MI = 5;

function Discover() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortKey>("trending");
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS_MI);
  const [reportOpen, setReportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  // Draft state — only commits on "Show results"
  const [draftCat, setDraftCat] = useState<Category | "all">("all");
  const [draftSort, setDraftSort] = useState<SortKey>("trending");
  const [draftRadius, setDraftRadius] = useState<number>(DEFAULT_RADIUS_MI);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const list = useMemo(() => {
    const filtered = venues.filter((v) => {
      if (cat !== "all" && v.category !== cat) return false;
      if (parseFloat(v.distance) > radius) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "wait") sorted.sort((a, b) => a.waitMinutes - b.waitMinutes);
    else if (sort === "distance") sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else sorted.sort((a, b) => b.liveReporters - a.liveReporters);
    return sorted;
  }, [cat, sort, radius]);

  const openFilter = () => {
    setDraftCat(cat);
    setDraftSort(sort);
    setDraftRadius(radius);
    setFilterOpen(true);
  };
  const applyFilter = () => {
    setCat(draftCat);
    setSort(draftSort);
    setRadius(draftRadius);
    setFilterOpen(false);
  };
  const resetFilter = () => {
    setDraftCat("all");
    setDraftSort("trending");
    setDraftRadius(DEFAULT_RADIUS_MI);
  };

  const filtersActive = cat !== "all" || sort !== "trending" || radius !== DEFAULT_RADIUS_MI;

  // Preview count under the current draft filter
  const draftCount = useMemo(
    () =>
      venues.filter((v) => {
        if (draftCat !== "all" && v.category !== draftCat) return false;
        if (parseFloat(v.distance) > draftRadius) return false;
        return true;
      }).length,
    [draftCat, draftRadius],
  );

  useEffect(() => {
    if (!selectedId) return;
    const el = cardRefs.current[selectedId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  const handleSelect = (id: string) => {
    if (selectedId === id) {
      navigate({ to: "/venue/$id", params: { id } });
      return;
    }
    setSelectedId(id);
  };

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden">
      {/* Map layer */}
      <Suspense fallback={<div className="absolute inset-0" style={{ background: "oklch(0.965 0.005 245)" }} />}>
        <CityMap venues={list} focusedId={selectedId} />
      </Suspense>

      {/* Floating search + filter */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
        <div className="flex items-center gap-2">
          <div
            className="flex flex-1 items-center gap-2 rounded-full bg-card px-4 py-3"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
          >
            <Search className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <input
              placeholder="Search venues, food, vibes..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          <button
            type="button"
            onClick={openFilter}
            className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform active:scale-95"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {filtersActive && (
              <span
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white"
                style={{ background: "var(--wait-short)" }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Bottom card sheet */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-card"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 -8px 32px -12px color-mix(in oklab, var(--primary) 25%, transparent)",
          maxHeight: "55%",
        }}
      >
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        <div className="px-5 pt-1">
          <ReportCTA onClick={() => setReportOpen(true)} />
        </div>
        <div className="mt-3 flex items-center justify-between px-5">
          <h2 className="font-display text-base font-bold tracking-tight">
            {list.length} {list.length === 1 ? "place" : "places"} nearby
          </h2>
          <p className="font-grotesk text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            {cat === "all" ? "All categories" : categories.find((c) => c.id === cat)?.label} ·{" "}
            <span className="font-bold" style={{ color: "var(--foreground)" }}>
              {sortOptions.find((s) => s.id === sort)?.label.toLowerCase()}
            </span>
          </p>
        </div>

        <div className="no-scrollbar mt-3 max-h-[300px] space-y-2.5 overflow-y-auto px-4 pb-5">
          {list.map((v) => {
            const on = v.id === selectedId;
            return (
              <button
                key={v.id}
                type="button"
                ref={(el) => {
                  cardRefs.current[v.id] = el;
                }}
                onClick={() => handleSelect(v.id)}
                className="card-lift animate-fade-in-up flex w-full items-center gap-3 rounded-2xl bg-card p-2.5 text-left transition-all active:scale-[0.98]"
                style={{
                  border: on
                    ? "1.5px solid var(--primary)"
                    : "1px solid var(--border)",
                  boxShadow: on
                    ? "0 8px 24px -10px color-mix(in oklab, var(--primary) 45%, transparent)"
                    : "var(--shadow-sm)",
                }}
              >
                <img
                  src={v.image}
                  alt={v.name}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display truncate text-sm font-bold tracking-tight">
                    {v.name}
                  </h3>
                  <div className="font-grotesk mt-0.5 flex items-center gap-2 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0" style={{ color: "var(--primary)" }} />
                      <span className="truncate">{v.distance}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3 shrink-0" style={{ color: "var(--primary)" }} />
                      <span className="font-bold tabular-nums" style={{ color: "var(--foreground)" }}>{v.liveReporters}</span>
                    </span>
                  </div>
                </div>
                <WaitBadge
                  minutes={v.waitMinutes}
                  severity={v.severity}
                  size="sm"
                  variant="solid"
                  className="shrink-0"
                />
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
              No places match this filter.
            </p>
          )}
        </div>
      </div>

      {/* Filter bottom sheet */}
      {filterOpen && (
        <div className="absolute inset-0 z-50">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFilterOpen(false)}
            className="animate-fade-in absolute inset-0 bg-black/45"
          />
          <div
            className="animate-slide-up absolute inset-x-0 bottom-0 rounded-t-3xl bg-card"
            style={{
              boxShadow: "0 -16px 40px -12px color-mix(in oklab, black 35%, transparent)",
              maxHeight: "92%",
            }}
          >
            <div className="flex justify-center pt-2.5">
              <span className="h-1 w-10 rounded-full" style={{ background: "var(--border)" }} />
            </div>
            <div className="grid grid-cols-3 items-center px-5 pt-2">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="justify-self-start inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--muted)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <h2 className="font-display text-center text-base font-bold tracking-tight">
                Filter
              </h2>
              <button
                type="button"
                onClick={resetFilter}
                className="font-grotesk justify-self-end text-xs font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Reset
              </button>
            </div>

            <div className="space-y-6 px-5 pb-32 pt-5">
              {/* Categories */}
              <section>
                <h3 className="font-display text-sm font-bold tracking-tight">Categories</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = c.id === draftCat;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setDraftCat(c.id)}
                        className="rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95"
                        style={{
                          background: on ? "var(--primary)" : "var(--card)",
                          color: on ? "var(--primary-foreground)" : "var(--foreground)",
                          border: on ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                          boxShadow: on ? "var(--shadow-sm)" : "none",
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="h-px" style={{ background: "var(--border)" }} />

              {/* Distance */}
              <section>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold tracking-tight">Distance to me</h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease distance"
                      onClick={() => setDraftRadius((r) => Math.max(1, r - 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-95"
                      style={{ border: "1.5px solid var(--border)" }}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className="font-display min-w-[3.5rem] text-center text-sm font-bold tabular-nums"
                      style={{ color: "var(--primary)" }}
                    >
                      {draftRadius} mi
                    </span>
                    <button
                      type="button"
                      aria-label="Increase distance"
                      onClick={() => setDraftRadius((r) => Math.min(25, r + 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-95"
                      style={{ border: "1.5px solid var(--border)" }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </section>

              <div className="h-px" style={{ background: "var(--border)" }} />

              {/* Sort */}
              <section>
                <h3 className="font-display text-sm font-bold tracking-tight">Sort by</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sortOptions.map((s) => {
                    const on = s.id === draftSort;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setDraftSort(s.id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95"
                        style={{
                          background: on ? "var(--primary)" : "var(--card)",
                          color: on ? "var(--primary-foreground)" : "var(--foreground)",
                          border: on ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                          boxShadow: on ? "var(--shadow-sm)" : "none",
                        }}
                      >
                        <span aria-hidden>{s.emoji}</span>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Sticky CTA */}
            <div
              className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-card px-5 pb-5 pt-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                type="button"
                onClick={applyFilter}
                className="font-display flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
                style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
              >
                Show {draftCount} {draftCount === 1 ? "result" : "results"}
              </button>
            </div>
          </div>
        </div>
      )}
      {reportOpen && <ReportSheet onClose={() => setReportOpen(false)} />}
    </div>
  );
}
