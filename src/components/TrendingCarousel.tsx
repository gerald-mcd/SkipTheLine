import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { severityColor, type Venue } from "@/lib/mock-data";
import { VenueImage } from "@/components/VenueImage";
import { useFavorites } from "@/hooks/use-favorites";

export function TrendingCarousel({ items, loading }: { items: Venue[]; loading?: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { isFav, toggle } = useFavorites();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const slideWidth = el.scrollWidth / Math.max(items.length, 1);
      const idx = Math.round(el.scrollLeft / slideWidth);
      setActive(Math.min(items.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollTo = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slideWidth = el.scrollWidth / Math.max(items.length, 1);
    el.scrollTo({ left: slideWidth * idx, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="mt-3 flex gap-3 overflow-hidden px-5 pb-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-72 w-[78%] shrink-0 animate-pulse rounded-3xl"
            style={{ background: "var(--muted)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        ref={scrollerRef}
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((v) => {
          const fav = isFav(v.id);
          return (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="group relative block w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="relative h-72 w-full bg-[var(--muted)]">
                <VenueImage
                  src={v.image}
                  alt={v.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform group-active:scale-[0.98]"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)" }}
                />
                <button
                  type="button"
                  aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(v.id);
                  }}
                  className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur"
                  style={{ background: "rgba(255,255,255,0.92)" }}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={fav ? "var(--destructive)" : "transparent"}
                    style={{ color: fav ? "var(--destructive)" : "var(--foreground)" }}
                  />
                </button>
                <span
                  className="font-grotesk absolute right-3 top-3 inline-flex items-baseline gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums text-white"
                  style={{ background: severityColor(v.severity) }}
                >
                  {v.waitMinutes}
                  <span className="text-[9px] font-semibold">m wait</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.18em] opacity-90">
                    {v.categoryLabel} · {v.vibe}
                  </p>
                  <p className="font-display text-2xl font-semibold leading-tight">{v.name}</p>
                  <p className="mt-1 text-[11px] opacity-90">
                    {v.liveReporters} live · {v.distance}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Controls + pagination */}
      <div className="mt-3 flex items-center justify-between px-5">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollTo(Math.max(0, active - 1))}
          disabled={active === 0}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white disabled:opacity-40"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === active ? 22 : 6,
                background: i === active ? "var(--primary)" : "var(--border)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}
          disabled={active === items.length - 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white disabled:opacity-40"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}