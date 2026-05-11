import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CityMap } from "@/components/CityMap";
import { venues, Category } from "@/lib/mock-data";
import { MapPin, Search, SlidersHorizontal, Star } from "lucide-react";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover nearby — SkipTheLine" },
      { name: "description", content: "Map-first discovery of restaurants and spots near you with live wait times." },
    ],
  }),
  component: Discover,
});

// Deterministic synthetic rating (4.0 – 4.9) seeded by venue id.
function venueRating(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 4 + (h % 90) / 100;
}

function Discover() {
  const [cat] = useState<Category | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const list = useMemo(
    () => (cat === "all" ? venues : venues.filter((v) => v.category === cat)),
    [cat],
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
          <button
            type="button"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform active:scale-95"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
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
        <h2 className="font-display mt-2 text-center text-base font-bold tracking-tight">
          List of restaurants
        </h2>

        <div className="no-scrollbar mt-3 max-h-[300px] space-y-2.5 overflow-y-auto px-4 pb-5">
          {list.map((v) => {
            const rating = venueRating(v.id);
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
                  <p className="font-grotesk mt-0.5 flex items-center gap-1 truncate text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    <MapPin className="h-3 w-3 shrink-0" style={{ color: "var(--primary)" }} />
                    <span className="truncate">{v.address}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Star className="h-3.5 w-3.5" fill="oklch(0.78 0.16 75)" stroke="oklch(0.78 0.16 75)" />
                  <span className="font-grotesk text-xs font-bold tabular-nums">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
