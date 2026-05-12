import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CityMap } from "@/components/CityMap";
import { venues, Category, categories } from "@/lib/mock-data";
import { WaitBadge } from "@/components/WaitBadge";
import { MapPin, Search, SlidersHorizontal, Check, Users } from "lucide-react";

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

function Discover() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortKey>("trending");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const list = useMemo(() => {
    const filtered = cat === "all" ? venues : venues.filter((v) => v.category === cat);
    const sorted = [...filtered];
    if (sort === "wait") sorted.sort((a, b) => a.waitMinutes - b.waitMinutes);
    else if (sort === "distance") sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else sorted.sort((a, b) => b.liveReporters - a.liveReporters);
    return sorted;
  }, [cat, sort]);

  useEffect(() => {
    if (!filterOpen) return;
    const onClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [filterOpen]);

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
      <CityMap venues={list} focusedId={selectedId} />

      {/* Floating search + filter */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
        <div className="flex items-center gap-2">
          <div
            className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
          >
            <Search className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <input
              placeholder="Restaurant name or dish..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform active:scale-95"
              style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
              aria-label="Filters"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {(cat !== "all" || sort !== "trending") && (
                <span
                  className="absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white"
                  style={{ background: "var(--wait-short)" }}
                />
              )}
            </button>
            {filterOpen && (
              <div
                className="animate-fade-in-up absolute right-0 top-14 z-40 w-72 overflow-hidden rounded-2xl bg-white p-3"
                style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
              >
                <p className="font-grotesk px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
                  Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => {
                    const on = c.id === cat;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCat(c.id)}
                        className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all"
                        style={{
                          background: on ? "var(--primary)" : "white",
                          color: on ? "var(--primary-foreground)" : "var(--primary)",
                          border: "1.5px solid var(--primary)",
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
                <p className="font-grotesk px-1 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
                  Sort by
                </p>
                {sortOptions.map((s) => {
                  const on = s.id === sort;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSort(s.id)}
                      className="font-grotesk flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors"
                      style={{
                        background: on ? "color-mix(in oklab, var(--primary) 10%, white)" : "transparent",
                        color: on ? "var(--primary)" : "var(--foreground)",
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden>{s.emoji}</span>
                        {s.label}
                      </span>
                      {on && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom card sheet */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 -8px 32px -12px color-mix(in oklab, var(--primary) 25%, transparent)",
          maxHeight: "55%",
        }}
      >
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        <div className="mt-2 flex items-center justify-between px-5">
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
                className="card-lift animate-fade-in-up flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left transition-all active:scale-[0.98]"
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
    </div>
  );
}
