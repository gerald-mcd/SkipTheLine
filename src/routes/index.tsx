import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor, walkMinutes } from "@/lib/mock-data";
import {
  Search, Flame, Users, Clock, ArrowUpRight, Heart, ArrowRight,
  TrendingUp, TrendingDown, Minus, Bell, BellRing, Footprints, Quote,
  LogIn, Radio, Crosshair,
} from "lucide-react";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { VenueImage } from "@/components/VenueImage";
import { CountUp } from "@/components/CountUp";
import { AvatarStack } from "@/components/AvatarStack";
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
  const [shortFilter, setShortFilter] = useState<"all" | "under10" | "walk5" | "late">("all");
  const [notifyIds, setNotifyIds] = useState<Set<string>>(new Set());
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locating, setLocating] = useState(false);
  const [radiusMi, setRadiusMi] = useState<number>(1.5);
  const [area] = useState({ city: "Miami", neighborhood: "Brickell" });
  const heroParallaxRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  // Parallax on the #1 featured hero image
  useEffect(() => {
    const onScroll = () => {
      if (!heroParallaxRef.current || !heroImgRef.current) return;
      const rect = heroParallaxRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // -1 (off-top) … 0 (centered) … 1 (off-bottom)
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      heroImgRef.current.style.transform = `translate3d(0, ${(-clamped * 18).toFixed(1)}px, 0) scale(1.08)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

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

  const locScoped = locationEnabled
    ? venues.filter((v) => {
        const d = parseFloat(v.distance);
        return Number.isNaN(d) ? true : d <= radiusMi;
      })
    : venues;
  const filtered = cat === "all" ? locScoped : locScoped.filter((v) => v.category === cat);
  const inRangeCount = locScoped.length;
  const hero = [...filtered].sort((a, b) => b.liveReporters - a.liveReporters)[0] ?? venues[0];
  const rest = filtered.filter((v) => v.id !== hero.id);
  const trending = [...rest].sort((a, b) => b.liveReporters - a.liveReporters).slice(0, 4);
  const shortestAll = useMemo(() => [...rest].sort((a, b) => a.waitMinutes - b.waitMinutes), [rest]);
  const shortest = useMemo(() => {
    const filteredList = shortestAll.filter((v) => {
      if (shortFilter === "under10") return v.waitMinutes <= 10;
      if (shortFilter === "walk5") return walkMinutes(v.distance) <= 5;
      if (shortFilter === "late") return /([2-5])am|24h/i.test(v.hours);
      return true;
    });
    return filteredList.slice(0, 6);
  }, [shortestAll, shortFilter]);
  const totalReporters = venues.reduce((s, v) => s + v.liveReporters, 0);

  const toggleNotify = (id: string, name: string) => {
    setNotifyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast(`Notifications off for ${name}`);
      } else {
        next.add(id);
        toast(`We'll ping you when ${name} drops`, {
          description: "Threshold: under 10 min wait",
        });
      }
      return next;
    });
  };

  const enableLocation = () => {
    if (locationEnabled || locating) return;
    setLocating(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          setLocating(false);
          toast.success("Location on — showing spots near you");
        },
        () => {
          setLocating(false);
          toast.error("Couldn't get your location", { description: "Showing Miami · Brickell by default." });
        },
        { timeout: 6000 }
      );
    } else {
      setTimeout(() => {
        setLocationEnabled(true);
        setLocating(false);
        toast.success("Location on — showing spots near you");
      }, 600);
    }
  };

  return (
    <div className="relative overflow-hidden pb-4">
      {/* Ambient background — soft gradient + blurred color blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 22%, var(--background)) 0%, color-mix(in oklab, var(--primary) 10%, var(--background)) 45%, var(--background) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 -z-10 h-[440px] w-[440px] rounded-full opacity-90 blur-3xl animate-breathe"
        style={{ background: "color-mix(in oklab, var(--primary) 70%, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 -z-10 h-[500px] w-[500px] rounded-full opacity-85 blur-3xl animate-breathe"
        style={{ background: "color-mix(in oklab, var(--warning) 65%, transparent)", animationDelay: "1.2s" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[520px] -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-80 blur-3xl animate-breathe"
        style={{ background: "color-mix(in oklab, var(--success) 55%, transparent)", animationDelay: "2.1s" }}
      />
      {/* Subtle dot grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 38%, transparent) 1.4px, transparent 1.4px)",
          backgroundSize: "20px 20px",
          maskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
          opacity: 0.6,
        }}
      />

      {/* Top bar: location + sign in */}
      <div className="relative px-5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="font-display text-[15px] font-bold tracking-tight">SkipTheLine</span>
            <span className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
              · Live
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden items-center gap-1.5 rounded-full bg-white px-2.5 py-1 sm:flex"
              style={{ border: "1px solid var(--border)" }}
            >
              <Radio className="h-3 w-3" style={{ color: "var(--destructive)" }} />
              <span className="text-[11px] font-grotesk font-semibold tabular-nums">{totalReporters}</span>
              <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>reporting now</span>
            </div>
            <button
              type="button"
              onClick={() => toast("Sign in coming soon", { description: "Save favorites, earn reporter cred, and unlock notifications." })}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-grotesk font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--foreground)" }}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
          </div>
        </div>

        {/* Location preview card */}
        {locationEnabled ? (
          <div
            className="mt-3 overflow-hidden rounded-2xl bg-white animate-fade-in"
            style={{
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md), 0 16px 40px -24px color-mix(in oklab, var(--primary) 50%, transparent)",
            }}
          >
            <div className="flex items-stretch gap-3 p-3">
              {/* Mini radar map */}
              <div
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                style={{
                  background:
                    "radial-gradient(circle at center, color-mix(in oklab, var(--primary) 30%, white) 0%, white 70%)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* concentric rings */}
                <div className="absolute inset-2 rounded-full" style={{ border: "1px dashed color-mix(in oklab, var(--primary) 40%, transparent)" }} />
                <div className="absolute inset-5 rounded-full" style={{ border: "1px dashed color-mix(in oklab, var(--primary) 55%, transparent)" }} />
                {/* venue dots */}
                {locScoped.slice(0, 5).map((v, i) => (
                  <span
                    key={v.id}
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{
                      left: `${20 + ((i * 17) % 60)}%`,
                      top: `${22 + ((i * 23) % 56)}%`,
                      background: severityColor(v.severity),
                      boxShadow: "0 0 0 2px white",
                    }}
                  />
                ))}
                {/* center pin with sweep */}
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "color-mix(in oklab, var(--primary) 50%, transparent)" }} />
                  <span className="relative block h-3 w-3 rounded-full border-2 border-white" style={{ background: "var(--primary)" }} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--success)" }} />
                    <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
                  </span>
                  <span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--success)" }}>
                    Location on
                  </span>
                </div>
                <p className="font-display mt-0.5 truncate text-[20px] font-bold leading-tight tracking-tight">
                  {area.neighborhood}, {area.city}
                </p>
                <p className="font-grotesk mt-0.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="font-bold tabular-nums" style={{ color: "var(--foreground)" }}>{inRangeCount}</span> spots within {radiusMi} mi
                </p>
              </div>
            </div>
            {/* Radius chips */}
            <div
              className="flex items-center gap-1.5 border-t px-3 py-2"
              style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--primary) 3%, white)" }}
            >
              <span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
                Radius
              </span>
              <div className="flex flex-1 items-center gap-1.5">
                {[0.5, 1, 1.5, 3, 5].map((r) => {
                  const active = radiusMi === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadiusMi(r)}
                      className="font-grotesk flex-1 rounded-full px-2 py-1 text-[10px] font-bold tabular-nums transition-colors"
                      style={{
                        background: active ? "var(--foreground)" : "white",
                        color: active ? "white" : "var(--muted-foreground)",
                        border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
                      }}
                    >
                      {r} mi
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={enableLocation}
            disabled={locating}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left transition-transform active:scale-[0.99]"
            style={{
              border: "1px solid color-mix(in oklab, var(--primary) 30%, var(--border))",
              boxShadow: "var(--shadow-sm), 0 12px 32px -20px color-mix(in oklab, var(--primary) 60%, transparent)",
            }}
          >
            <div
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "color-mix(in oklab, var(--primary) 12%, white)" }}
            >
              {locating ? (
                <span className="absolute inset-0 animate-radar rounded-xl" style={{
                  background: "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--primary) 40%, transparent) 90deg, transparent 180deg)",
                }} />
              ) : (
                <span className="absolute inset-0 animate-ping-soft rounded-xl" style={{ background: "color-mix(in oklab, var(--primary) 20%, transparent)" }} />
              )}
              <Crosshair className="relative h-5 w-5" style={{ color: "var(--primary)" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--primary)" }}>
                {locating ? "Finding you…" : "Tap to enable location"}
              </p>
              <p className="font-display mt-0.5 text-[17px] font-bold leading-tight tracking-tight">
                See waits within walking distance
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
          </button>
        )}

        <h1 className="font-display mt-4 text-[52px] font-bold leading-[0.98] tracking-tight">
          Skip the
          <br />
          <span style={{ fontStyle: "italic", color: "var(--primary)" }}>line</span> tonight.
        </h1>
        <p className="mt-2 max-w-[280px] text-[14px] font-medium leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
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
          style={{ boxShadow: "var(--shadow-lg), 0 24px 60px -24px color-mix(in oklab, var(--primary) 55%, transparent)" }}
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
        <div className="px-5">
          <div
            className="relative overflow-hidden rounded-[28px] p-5"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--primary) 4%, white) 0%, white 60%)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md), 0 20px 50px -28px color-mix(in oklab, var(--primary) 40%, transparent)",
            }}
          >
            {/* Header */}
            <div>
              <span
                className="font-grotesk inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ background: "color-mix(in oklab, var(--success) 14%, white)", color: "var(--success)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--success)" }} />
                  <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
                </span>
                Updated now
              </span>
              <h3 className="font-display mt-3 text-[48px] font-bold leading-[0.92] tracking-tight">
                Walk
                <br />
                <span style={{ fontStyle: "italic", color: "var(--primary)" }}>straight</span> in.
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Real-time tracking for the best spots with the shortest queues right now.
              </p>
            </div>

            {/* Filter chips */}
            <div
              className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {([
                { id: "all", label: "All", icon: null },
                { id: "under10", label: "Under 10 min", icon: <Clock className="h-3 w-3" /> },
                { id: "walk5", label: "Walk < 5 min", icon: <Footprints className="h-3 w-3" /> },
                { id: "late", label: "Open late", icon: <Flame className="h-3 w-3" /> },
              ] as const).map((chip) => {
                const active = shortFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setShortFilter(chip.id)}
                    className="font-grotesk inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                    style={{
                      background: active ? "var(--foreground)" : "white",
                      color: active ? "white" : "var(--muted-foreground)",
                      border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
                    }}
                  >
                    {chip.icon}
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="mt-5 space-y-3">
                <div className="h-52 w-full animate-pulse rounded-3xl" style={{ background: "var(--muted)" }} />
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-40 animate-pulse rounded-2xl" style={{ background: "var(--muted)" }} />
                  ))}
                </div>
              </div>
            ) : shortest.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed py-8 text-center" style={{ borderColor: "var(--border)" }}>
                <p className="font-grotesk text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  No spots match that filter
                </p>
                <button
                  type="button"
                  onClick={() => setShortFilter("all")}
                  className="font-grotesk mt-3 inline-flex items-center gap-1 text-[12px] font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Reset filter →
                </button>
              </div>
            ) : (
              <div className="mt-5 grid animate-fade-in grid-cols-2 gap-3">
                {/* #1 Featured — full width */}
                {shortest[0] && (() => {
                  const v = shortest[0];
                  const fav = isFav(v.id);
                  const notif = notifyIds.has(v.id);
                  const walkMin = walkMinutes(v.distance);
                  return (
                    <Link
                      to="/venue/$id"
                      params={{ id: v.id }}
                      ref={heroParallaxRef as any}
                      className="group relative col-span-2 block aspect-[16/10] overflow-hidden rounded-3xl"
                      style={{ boxShadow: "var(--shadow-sm)" }}
                    >
                      <VenueImage
                        src={v.image}
                        alt={v.name}
                        imgRef={heroImgRef}
                        className="absolute inset-0 h-full w-full object-cover will-change-transform"
                        style={{ transform: "scale(1.08)", transition: "transform 200ms linear" }}
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.92) 100%)" }} />

                      {/* Dynamic top-left label removed per design */}

                      {/* Action stack */}
                      <div className="absolute right-3 top-3 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={notif ? "Turn off notifications" : "Notify when wait drops"}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleNotify(v.id, v.name); }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-xl"
                          style={{ background: notif ? "var(--primary)" : "rgba(255,255,255,0.18)" }}
                        >
                          {notif ? <BellRing className="h-4 w-4 text-white" /> : <Bell className="h-4 w-4 text-white" />}
                        </button>
                        <button
                          type="button"
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(v.id); }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-xl"
                          style={{ background: "rgba(255,255,255,0.18)" }}
                        >
                          <Heart className="h-4 w-4" fill={fav ? "var(--destructive)" : "transparent"} style={{ color: fav ? "var(--destructive)" : "white" }} />
                        </button>
                      </div>

                      {/* Recent quote */}
                      <div className="absolute left-4 right-4 top-14 max-w-[78%]">
                        <div className="inline-flex items-start gap-1.5 rounded-2xl bg-black/35 px-2.5 py-1.5 text-white backdrop-blur-md">
                          <Quote className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
                          <p className="text-[11px] font-medium leading-snug">
                            "{v.recentQuote.text}" <span className="opacity-70">— {v.recentQuote.author}, {v.recentQuote.ago}</span>
                          </p>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
                        <div className="min-w-0 flex-1">
                          <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "color-mix(in oklab, var(--success) 60%, white)" }}>
                            {v.categoryLabel}
                          </p>
                          <h4 className="font-display mt-1 truncate text-[26px] font-semibold leading-tight">{v.name}</h4>
                          <div className="font-grotesk mt-1.5 flex items-center gap-2 text-[10px] font-medium">
                            <span className="inline-flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5">
                              <Footprints className="h-3 w-3" /> {walkMin} min walk · {v.distance}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <AvatarStack names={v.reporterNames} max={3} size={22} ring="rgba(0,0,0,0.4)" />
                            <span className="font-grotesk text-[10px] font-semibold text-white/90">
                              {v.reporterNames[0]} + {Math.max(0, v.liveReporters - 1)} reporting
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right text-white">
                          <div className="inline-flex items-baseline gap-1">
                            <CountUp end={v.waitMinutes} className="font-grotesk text-4xl font-bold leading-none tabular-nums" />
                            <span className="font-grotesk text-sm font-semibold opacity-80">m</span>
                          </div>
                          <p className="font-grotesk mt-1 text-[9px] font-bold uppercase tracking-widest opacity-70">min wait</p>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

                {/* #2 — tall card */}
                {shortest[1] && (() => {
                  const v = shortest[1];
                  const fav = isFav(v.id);
                  const notif = notifyIds.has(v.id);
                  const walkMin = walkMinutes(v.distance);
                  const Trend = v.trend === "up" ? TrendingUp : v.trend === "down" ? TrendingDown : Minus;
                  const trendColor = v.trend === "up" ? "var(--destructive)" : v.trend === "down" ? "var(--success)" : "var(--muted-foreground)";
                  return (
                    <Link
                      to="/venue/$id"
                      params={{ id: v.id }}
                      className="group relative col-span-2 block aspect-[16/9] overflow-hidden rounded-3xl"
                      style={{ boxShadow: "var(--shadow-sm)" }}
                    >
                      <VenueImage src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-active:scale-[0.98]" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.88) 100%)" }} />
                      <div className="absolute right-2.5 top-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={notif ? "Turn off notifications" : "Notify me"}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleNotify(v.id, v.name); }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl"
                          style={{ background: notif ? "var(--primary)" : "rgba(255,255,255,0.18)" }}
                        >
                          {notif ? <BellRing className="h-3.5 w-3.5 text-white" /> : <Bell className="h-3.5 w-3.5 text-white" />}
                        </button>
                        <button
                          type="button"
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(v.id); }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl"
                          style={{ background: "rgba(255,255,255,0.18)" }}
                        >
                          <Heart className="h-3.5 w-3.5" fill={fav ? "var(--destructive)" : "transparent"} style={{ color: fav ? "var(--destructive)" : "white" }} />
                        </button>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white">
                        <div className="min-w-0">
                          <p className="font-grotesk text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "color-mix(in oklab, var(--success) 60%, white)" }}>
                            {v.categoryLabel}
                          </p>
                          <h4 className="font-display mt-0.5 truncate text-lg font-semibold leading-tight">{v.name}</h4>
                          <div className="mt-1.5 flex items-center gap-2">
                            <AvatarStack names={v.reporterNames} max={3} size={18} ring="rgba(0,0,0,0.4)" />
                            <span className="font-grotesk text-[10px] font-medium opacity-90 inline-flex items-center gap-1">
                              <Footprints className="h-3 w-3" /> {walkMin}m walk
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="inline-flex items-baseline gap-1">
                            <CountUp end={v.waitMinutes} className="font-grotesk text-3xl font-bold leading-none tabular-nums" />
                            <span className="text-xs font-semibold opacity-80">m</span>
                          </div>
                          <p className="font-grotesk mt-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: trendColor === "var(--muted-foreground)" ? "rgba(255,255,255,0.7)" : trendColor }}>
                            <Trend className="h-3 w-3" />
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

                {/* #3-6 — square cards with meta under */}
                {shortest.slice(2, 6).map((v, idx) => {
                  const rank = idx + 3;
                  const fav = isFav(v.id);
                  const walkMin = walkMinutes(v.distance);
                  const Trend = v.trend === "up" ? TrendingUp : v.trend === "down" ? TrendingDown : Minus;
                  const trendColor = v.trend === "up" ? "var(--destructive)" : v.trend === "down" ? "var(--success)" : "var(--muted-foreground)";
                  return (
                    <Link
                      key={v.id}
                      to="/venue/$id"
                      params={{ id: v.id }}
                      className="group flex animate-fade-in flex-col"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-sm)" }}>
                        <VenueImage src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-active:scale-[0.97]" />
                        <span
                          className="font-grotesk absolute left-2 top-2 inline-flex items-center rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur"
                          style={{ color: "var(--foreground)" }}
                        >
                          {String(rank).padStart(2, "0")}
                        </span>
                        {fav && (
                          <span
                            className="font-grotesk absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur"
                            style={{ color: "var(--destructive)" }}
                          >
                            <Heart className="h-2.5 w-2.5" fill="var(--destructive)" /> Saved
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggle(v.id);
                          }}
                          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full backdrop-blur"
                          style={{ background: "rgba(255,255,255,0.92)" }}
                        >
                          <Heart
                            className="h-3.5 w-3.5"
                            fill={fav ? "var(--destructive)" : "transparent"}
                            style={{ color: fav ? "var(--destructive)" : "var(--foreground)" }}
                          />
                        </button>
                      </div>
                      <div className="mt-2.5 px-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-grotesk truncate text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
                            {v.categoryLabel}
                          </p>
                          <span className="font-grotesk inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: trendColor }}>
                            <Trend className="h-2.5 w-2.5" />
                          </span>
                        </div>
                        <h4 className="font-display mt-0.5 truncate text-[15px] font-semibold leading-tight">{v.name}</h4>
                        <div className="mt-2 flex items-center justify-between border-t pt-1.5" style={{ borderColor: "var(--border)" }}>
                          <span className="font-grotesk text-lg font-bold leading-none tabular-nums">
                            <CountUp end={v.waitMinutes} />
                            <span className="ml-0.5 text-[10px] font-semibold" style={{ color: "var(--muted-foreground)" }}>m</span>
                          </span>
                          <span className="font-grotesk inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                            <Footprints className="h-2.5 w-2.5" /> {walkMin}m
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Footer CTA */}
            <Link
              to="/explore"
              className="font-grotesk mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-transform active:scale-[0.98]"
              style={{ background: "var(--foreground)" }}
            >
              Discover more short waits
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
