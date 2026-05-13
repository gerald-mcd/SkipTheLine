import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
const CityMap = lazy(() =>
  import("@/components/CityMap").then((m) => ({ default: m.CityMap })),
);
import {
  venues,
  Category,
  categories,
  severityColor,
  severityLabel,
  liveFeed,
  profile,
  type Severity,
} from "@/lib/mock-data";
import { WaitBadge } from "@/components/WaitBadge";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
  Minus,
  Plus,
  ArrowLeft,
  Clock,
  Calendar,
  Timer,
  MessageSquare,
  UserCircle2,
  Heart,
  Share2,
} from "lucide-react";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";

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
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Sheet snap state — draggable with two snap points: peek and full.
  const PEEK = 0.55;
  const FULL = 1.0;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerH, setContainerH] = useState(0);
  const [snap, setSnap] = useState<"peek" | "full">("peek");
  const [sheetH, setSheetH] = useState(0); // px
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startY: number; startH: number; lastY: number; lastT: number; vy: number } | null>(null);

  // Track container height
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerH(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // When snap changes (and not dragging), animate sheet to that height.
  useEffect(() => {
    if (containerH === 0) return;
    if (dragging) return;
    const target = snap === "full" ? containerH * FULL : containerH * PEEK;
    setSheetH(target);
  }, [snap, containerH, dragging]);

  const onHandleDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const startH = sheetH || (snap === "full" ? containerH : containerH * PEEK);
    dragRef.current = {
      startY: e.clientY,
      startH,
      lastY: e.clientY,
      lastT: performance.now(),
      vy: 0,
    };
    setDragging(true);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dy = d.startY - e.clientY; // up = +
    const next = Math.max(containerH * PEEK, Math.min(containerH * FULL, d.startH + dy));
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vy = (d.lastY - e.clientY) / dt; // px/ms, up positive
    d.lastY = e.clientY;
    d.lastT = now;
    setSheetH(next);
  };
  const onHandleUp = () => {
    const d = dragRef.current;
    setDragging(false);
    dragRef.current = null;
    if (!d || containerH === 0) return;
    const peekH = containerH * PEEK;
    const fullH = containerH * FULL;
    const mid = (peekH + fullH) / 2;
    // Velocity-aware snap
    let next: "peek" | "full";
    if (d.vy > 0.5) next = "full";
    else if (d.vy < -0.5) next = "peek";
    else next = sheetH >= mid ? "full" : "peek";
    setSnap(next);
  };

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

  const openVenue = useCallback((id: string) => {
    setSelectedId(id);
    setSnap("full");
  }, []);

  const closeVenue = useCallback(() => {
    setSelectedId(null);
    setSnap("peek");
  }, []);

  const selectedVenue = selectedId ? venues.find((v) => v.id === selectedId) ?? null : null;

  return (
    <div ref={containerRef} className="relative h-[calc(100vh-80px)] overflow-hidden">
      {/* Map layer */}
      <Suspense fallback={<div className="absolute inset-0" style={{ background: "oklch(0.965 0.005 245)" }} />}>
        <CityMap venues={list} focusedId={selectedId} onPinClick={openVenue} />
      </Suspense>

      {/* Floating search + filter */}
      <div
        className="absolute inset-x-0 top-0 z-20 px-4 pt-4 transition-opacity duration-200"
        style={{ opacity: snap === "full" ? 0 : 1, pointerEvents: snap === "full" ? "none" : "auto" }}
      >
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

      {/* Draggable bottom sheet */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-3xl bg-card"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 -8px 32px -12px color-mix(in oklab, var(--primary) 25%, transparent)",
          height: sheetH ? `${sheetH}px` : `${PEEK * 100}%`,
          transition: dragging ? "none" : "height 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          touchAction: "none",
        }}
      >
        {/* Drag handle — captures the drag gesture */}
        <div
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          className="flex shrink-0 cursor-grab justify-center pt-2.5 pb-1 active:cursor-grabbing"
          style={{ touchAction: "none" }}
          aria-label="Drag to resize"
        >
          <span className="h-1 w-10 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        {selectedVenue ? (
          <VenuePanel
            venue={selectedVenue}
            onBack={closeVenue}
            onReport={() => setReportOpen(true)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between px-5">
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
            <div className="no-scrollbar mt-3 flex-1 space-y-2.5 overflow-y-auto px-4 pb-5">
              {list.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  ref={(el) => {
                    cardRefs.current[v.id] = el;
                  }}
                  onClick={() => openVenue(v.id)}
                  className="card-lift animate-fade-in-up flex w-full items-center gap-3 rounded-2xl bg-card p-2.5 text-left transition-all active:scale-[0.98]"
                  style={{
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
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
              ))}
              {list.length === 0 && (
                <p className="py-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No places match this filter.
                </p>
              )}
            </div>
          </>
        )}
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
      {reportOpen && (
        <ReportSheet
          venue={selectedVenue ?? undefined}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
}

function VenuePanel({
  venue: v,
  onBack,
  onReport,
}: {
  venue: (typeof venues)[number];
  onBack: () => void;
  onReport: () => void;
}) {
  // Wait-trend sparkline (mock, mirrors /venue/$id)
  const trend = [22, 28, 31, 35, 30, 38, 45, 42, v.waitMinutes];
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const norm = trend.map((t) => ((t - min) / Math.max(1, max - min)) * 36 + 4);
  const color = severityColor(v.severity);
  const liveSeverity: Severity = v.severity;
  const recent = liveFeed.slice(0, 3);

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
      {/* Hero */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={v.image}
          alt={v.name}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)" }}
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to list"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur transition-transform active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Save"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur transition-transform active:scale-95"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur transition-transform active:scale-95"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onBack}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur transition-transform active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
            {v.categoryLabel} · {v.vibe}
          </p>
          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight">{v.name}</h1>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-90">
            <MapPin className="h-3 w-3" /> {v.address}
          </p>
        </div>
      </div>

      {/* Live wait + sparkline */}
      <div className="flex items-end justify-between px-5 pt-4">
        <div>
          <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
            Live wait
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold leading-none tabular-nums tracking-tight" style={{ color }}>
              {v.waitMinutes}
            </span>
            <span className="text-base font-medium" style={{ color }}>min</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: `${color}1f`, color }}
            >
              {severityLabel(liveSeverity)} line
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              <Clock className="h-3 w-3" /> {v.lastReportMinutes}m ago
            </span>
          </div>
        </div>
        <svg width="100" height="48" viewBox="0 0 100 48">
          <defs>
            <linearGradient id={`spark-${v.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={norm.map((y, i) => `${(i / (norm.length - 1)) * 100},${48 - y}`).join(" ")}
          />
          <polygon
            fill={`url(#spark-${v.id})`}
            points={`0,48 ${norm.map((y, i) => `${(i / (norm.length - 1)) * 100},${48 - y}`).join(" ")} 100,48`}
          />
        </svg>
      </div>

      {v.event && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
          <Calendar className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Driving the crowd
            </p>
            <p className="text-sm font-semibold">{v.event}</p>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 px-5">
        <MiniStat icon={<Timer className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`${v.typicalWaitMinutes}m`} label="Avg wait" />
        <MiniStat icon={<MessageSquare className="h-3.5 w-3.5" style={{ color }} />} value={`${v.reportsCount}`} label="Reports" />
        <MiniStat icon={<Clock className="h-3.5 w-3.5" />} value={v.hours} label="Open" />
      </div>

      <section className="mt-5 px-5">
        <h2 className="text-sm font-semibold">Recent reports</h2>
        <div className="mt-2 space-y-2">
          {recent.map((r) => {
            const friend = profile.friends.find((f) => f.name === r.user);
            return (
              <div key={r.id} className="flex items-center gap-3 rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
                {friend ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                    {r.user[0]}
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{friend ? r.user : "Someone nearby"}</p>
                  <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>walk-in · {r.ago}</p>
                </div>
                <span className="text-base font-semibold tabular-nums" style={{ color }}>{r.minutes}m</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="px-5 pb-6 pt-5">
        <button
          type="button"
          onClick={onReport}
          className="font-display flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
          style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
        >
          Report current wait
        </button>
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-sm font-bold">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
    </div>
  );
}
