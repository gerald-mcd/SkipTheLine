import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Settings, Check, Heart, Moon, Search, SlidersHorizontal, Sun, TrendingUp, TrendingDown, Minus, Plus, Mail, Phone, CalendarDays, Bell, Shield, LogOut, X, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { venues, Category, categories, profile, staleVenues, type Venue } from "@/lib/mock-data";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";
import { useFavorites } from "@/hooks/use-favorites";
import { useTheme } from "@/hooks/use-theme";
import { WaitBadge } from "@/components/WaitBadge";
import { PeopleSkipGlyph } from "@/components/ReportFab";
import { useVenueSheet } from "@/components/VenueSheet";

type SortKey = "trending" | "wait" | "distance" | "rated";
const sortOptions: { id: SortKey; label: string; emoji: string }[] = [
  { id: "trending", label: "Trending", emoji: "🔥" },
  { id: "wait", label: "Shortest wait", emoji: "⏱️" },
  { id: "distance", label: "Closest", emoji: "📍" },
  { id: "rated", label: "Top rated", emoji: "⭐" },
];

// Deterministic synthetic rating (4.0 – 4.9) seeded by venue id so the
// "Top rated" sort stays stable across renders without adding a backend field.
function venueRating(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 4 + (h % 90) / 100;
}

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
  const [sort, setSort] = useState<SortKey>("trending");
  const [reportVenue, setReportVenue] = useState<Venue | null | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [radius, setRadius] = useState<number>(5);
  // Draft state for the filter sheet — only commits on "Show results"
  const [draftCat, setDraftCat] = useState<Category | "all">("all");
  const [draftSort, setDraftSort] = useState<SortKey>("trending");
  const [draftRadius, setDraftRadius] = useState<number>(5);
  // Reactive arrival nudge — simulate geofence detecting user has arrived at a venue.
  const [arrival, setArrival] = useState<Venue | null>(null);
  const [arrivalDismissed, setArrivalDismissed] = useState(false);
  const { isFav, toggle } = useFavorites();
  const { theme, toggle: toggleTheme } = useTheme();
  const { open: openVenueSheet } = useVenueSheet();

  useEffect(() => {
    if (arrivalDismissed) return;
    const t = window.setTimeout(() => {
      setArrival(venues.find((v) => v.id === "v1") ?? null);
    }, 4000);
    return () => window.clearTimeout(t);
  }, [arrivalDismissed]);

  const filtered = useMemo(
    () =>
      venues.filter((v) => {
        if (cat !== "all" && v.category !== cat) return false;
        if (parseFloat(v.distance) > radius) return false;
        return true;
      }),
    [cat, radius],
  );
  const popular = useMemo(() => {
    const list = [...filtered];
    if (sort === "wait") return list.sort((a, b) => a.waitMinutes - b.waitMinutes);
    if (sort === "distance") return list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    if (sort === "rated") return list.sort((a, b) => venueRating(b.id) - venueRating(a.id));
    return list.sort((a, b) => b.liveReporters - a.liveReporters);
  }, [filtered, sort]);

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
    setDraftRadius(5);
  };
  const filtersActive = cat !== "all" || sort !== "trending" || radius !== 5;
  const draftCount = useMemo(
    () =>
      venues.filter((v) => {
        if (draftCat !== "all" && v.category !== draftCat) return false;
        if (parseFloat(v.distance) > draftRadius) return false;
        return true;
      }).length,
    [draftCat, draftRadius],
  );

  return (
    <div className="relative overflow-hidden">
      {/* Soft ambient — very light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 6%, var(--background)) 0%, var(--background) 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 -z-10 h-[280px] w-[280px] rounded-full opacity-25 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--primary) 35%, transparent)" }}
      />

      <header className="relative px-5 pt-5">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 rounded-full bg-card py-1 pl-1 pr-2"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <button
              type="button"
              onClick={() => toast("Sign in coming soon")}
              className="btn-pop flex items-center gap-2 rounded-full pr-1"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-xs"
                style={{ background: "var(--primary)" }}
              >
                K
              </span>
              <span className="font-display text-sm font-bold tracking-tight">Hi, Kate!</span>
            </button>
            <Link
              to="/profile"
              aria-label={`Your ${profile.neighborhood} rank`}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1"
              style={{
                background:
                  profile.rankTrend === "up"
                    ? "color-mix(in oklab, var(--success, #16a34a) 14%, transparent)"
                    : profile.rankTrend === "down"
                      ? "color-mix(in oklab, var(--destructive, #dc2626) 14%, transparent)"
                      : "var(--secondary)",
                color:
                  profile.rankTrend === "up"
                    ? "var(--success, #16a34a)"
                    : profile.rankTrend === "down"
                      ? "var(--destructive, #dc2626)"
                      : "var(--muted-foreground)",
              }}
            >
              <span className="font-display text-xs font-bold tabular-nums">#{profile.rank}</span>
              {profile.rankTrend === "up" ? (
                <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
              ) : profile.rankTrend === "down" ? (
                <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <Minus className="h-3 w-3" strokeWidth={2.5} />
              )}
              {profile.rankDelta > 0 && (
                <span className="font-grotesk text-[10px] font-bold tabular-nums">{profile.rankDelta}</span>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="btn-pop-icon inline-flex h-10 w-10 items-center justify-center rounded-full bg-card"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" style={{ color: "var(--primary)" }} />
              ) : (
                <Moon className="h-4 w-4" style={{ color: "var(--foreground)" }} />
              )}
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
              className="btn-pop-icon relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-card"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <Settings className="h-4 w-4" style={{ color: "var(--foreground)" }} />
            </button>
          </div>
        </div>

        {/* Sponsored ad slot — placeholder styled like OpenTable / Yelp featured */}
        <SponsoredAd />

        {/* Search */}
        <div
          className="mt-5 flex items-center gap-2 rounded-full bg-card px-3 py-2.5"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <input
            placeholder="Search venues, food, vibes..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="button"
            onClick={openFilter}
            className="btn-pop-icon inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ background: "var(--primary)" }}
            aria-label="Filters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="14" y2="7" /><circle cx="17" cy="7" r="2.2" fill="currentColor" />
              <line x1="10" y1="17" x2="20" y2="17" /><circle cx="7" cy="17" r="2.2" fill="currentColor" />
            </svg>
            {filtersActive && (
              <span
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--card)]"
                style={{ background: "var(--wait-short)" }}
              />
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight">Categories</h2>
          <Link
            to="/discover"
            className="font-grotesk text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            See all
          </Link>
        </div>
        <div className="mt-3">
          <CategoryRow active={cat} onChange={setCat} />
        </div>

        {/* Around you */}
        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight">Around you</h2>
            <p className="font-grotesk mt-0.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              Sorted by <span className="font-bold" style={{ color: "var(--foreground)" }}>
                {sortOptions.find((s) => s.id === sort)?.label.toLowerCase()}
              </span>
              {radius !== 5 && (
                <> · within <span className="font-bold" style={{ color: "var(--foreground)" }}>{radius} mi</span></>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-3 grid grid-cols-2 gap-3 px-5">
        {popular.slice(0, 6).map((v, idx) => {
          const fav = isFav(v.id);
          const isWaitSort = sort === "wait";
          const stale = staleVenues.some((s) => s.venue.id === v.id);
          return (
            <button
              type="button"
              key={v.id}
              onClick={() => openVenueSheet(v.id)}
              className="card-lift animate-fade-in-up group block overflow-hidden rounded-2xl bg-card text-left"
              style={{
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                animationDelay: `${idx * 60}ms`,
              }}
            >
              <div className="relative h-32 w-full">
                <img
                  src={v.image}
                  alt={v.name}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop";
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                  {stale && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setReportVenue(v);
                      }}
                      className="absolute left-0 bottom-0 right-0 flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-bold backdrop-blur transition-transform active:scale-[0.97]"
                      style={{
                        background: "color-mix(in oklab, var(--primary) 88%, transparent)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      <PeopleSkipGlyph className="h-3 w-3" />
                      <span className="whitespace-nowrap">First report · +15 pts</span>
                    </button>
                  )}
                <button
                  type="button"
                  aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(v.id);
                  }}
                  className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 backdrop-blur transition-transform active:scale-90 ${fav ? "heart-pop" : ""}`}
                >
                  <Heart
                    className="h-3.5 w-3.5 transition-colors"
                    fill={fav ? "var(--primary)" : "transparent"}
                    style={{ color: fav ? "var(--primary)" : "var(--foreground)" }}
                  />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-display truncate text-sm font-bold tracking-tight">{v.name}</h3>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <p className="font-grotesk text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    <span className="font-bold" style={{ color: "var(--foreground)" }}>{v.liveReporters}</span> reporting · {v.distance}
                  </p>
                  <WaitBadge
                    minutes={v.waitMinutes}
                    severity={v.severity}
                    size={isWaitSort ? "md" : "sm"}
                    variant="solid"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {reportVenue !== undefined && (
        <ReportSheet
          venue={reportVenue}
          onClose={() => setReportVenue(undefined)}
        />
      )}

      {/* Reactive arrival nudge — geofence-style prompt */}
      {arrival && !arrivalDismissed && (
        <PushNotificationMock
          venue={arrival}
          onReport={() => {
            setReportVenue(arrival);
            setArrival(null);
            setArrivalDismissed(true);
          }}
          onDismiss={() => {
            setArrival(null);
            setArrivalDismissed(true);
          }}
        />
      )}

      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
      {filterOpen && (
        <FilterSheet
          draftCat={draftCat}
          draftSort={draftSort}
          draftRadius={draftRadius}
          draftCount={draftCount}
          setDraftCat={setDraftCat}
          setDraftSort={setDraftSort}
          setDraftRadius={setDraftRadius}
          onApply={applyFilter}
          onReset={resetFilter}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}

function PushNotificationMock({
  venue,
  onReport,
  onDismiss,
}: {
  venue: Venue;
  onReport: () => void;
  onDismiss: () => void;
}) {
  // Mocks how a real OS push notification would look when the geofence
  // fires outside the app (lock screen / banner). Tap = open report sheet.
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex max-w-md justify-center px-3"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
    >
      <button
        type="button"
        onClick={onReport}
        className="pointer-events-auto animate-fade-in-up group relative flex w-full items-start gap-2.5 rounded-[1.4rem] p-3 text-left"
        style={{
          background: "color-mix(in oklab, var(--card) 92%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)",
          boxShadow: "0 18px 40px -12px oklch(0 0 0 / 0.35), 0 2px 6px oklch(0 0 0 / 0.15)",
        }}
      >
        {/* App icon — mimics OS lock-screen notification icon */}
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.7rem]"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, white))",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <PeopleSkipGlyph className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--muted-foreground)" }}>
              SkipTheLine · now
            </p>
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>swipe to dismiss</span>
          </div>
          <p className="mt-0.5 text-[13px] font-bold leading-tight">You arrived at {venue.name}</p>
          <p className="text-[12px] leading-snug" style={{ color: "var(--muted-foreground)" }}>
            Tap to drop a wait time · earn +15 pts
          </p>
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          role="button"
          aria-label="Dismiss"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: "var(--secondary)" }}
        >
          <X className="h-3 w-3" />
        </span>
      </button>
    </div>
  );
}

function SettingsSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 animate-fade-in bg-black/40" />
      <div
        className="relative max-h-[88vh] w-full max-w-md animate-slide-up overflow-y-auto rounded-t-3xl bg-card px-4 pb-8 pt-4"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Account
            </p>
            <h3 className="font-display text-lg font-bold tracking-tight">Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "var(--secondary)" }}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="mt-3">
          <h4 className="mb-2.5 text-sm font-semibold">Contact</h4>
          <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "1px solid var(--border)" }}>
            <SettingsRow icon={<Mail className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Email" value={profile.email} />
            <SettingsRow icon={<Phone className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Phone" value={profile.phone} top />
            <SettingsRow icon={<CalendarDays className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Joined" value={profile.joined} top />
          </div>
        </section>

        <section className="mt-6">
          <h4 className="mb-2.5 text-sm font-semibold">Settings</h4>
          <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "1px solid var(--border)" }}>
            <SettingsItem icon={<Bell className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Notifications" />
            <SettingsItem icon={<Shield className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Privacy" top />
            <SettingsItem icon={<Settings className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Preferences" top />
            <ReplayTourItem />
            <SettingsItem icon={<LogOut className="h-4 w-4" style={{ color: "var(--destructive, #c33)" }} />} label="Log out" top destructive />
          </div>
        </section>
      </div>
    </div>
  );
}

function ReplayTourItem() {
  return (
    <button
      onClick={() => {
        try {
          window.localStorage.removeItem("stl:tour-seen");
        } catch {}
        toast("Reloading to replay the tour…");
        window.setTimeout(() => window.location.reload(), 400);
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
      <span className="flex-1 text-sm font-medium">Replay app tour</span>
      <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
    </button>
  );
}

function SettingsRow({ icon, label, value, top }: { icon: React.ReactNode; label: string; value: string; top?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderTop: top ? "1px solid var(--border)" : "none" }}
    >
      {icon}
      <span className="flex-1 text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SettingsItem({ icon, label, top, destructive }: { icon: React.ReactNode; label: string; top?: boolean; destructive?: boolean }) {
  return (
    <button
      onClick={() => toast(`${label} coming soon`)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
      style={{ borderTop: top ? "1px solid var(--border)" : "none" }}
    >
      {icon}
      <span className="flex-1 text-sm font-medium" style={{ color: destructive ? "var(--destructive, #c33)" : "var(--foreground)" }}>{label}</span>
      <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
    </button>
  );
}

function FilterSheet({
  draftCat,
  draftSort,
  draftRadius,
  draftCount,
  setDraftCat,
  setDraftSort,
  setDraftRadius,
  onApply,
  onReset,
  onClose,
}: {
  draftCat: Category | "all";
  draftSort: SortKey;
  draftRadius: number;
  draftCount: number;
  setDraftCat: (c: Category | "all") => void;
  setDraftSort: (s: SortKey) => void;
  setDraftRadius: (r: number | ((r: number) => number)) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-black/45"
      />
      <div
        className="animate-slide-up absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl bg-card"
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
            onClick={onClose}
            className="justify-self-start inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--muted)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-display text-center text-base font-bold tracking-tight">Filter</h2>
          <button
            type="button"
            onClick={onReset}
            className="font-grotesk justify-self-end text-xs font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            Reset
          </button>
        </div>

        <div className="space-y-6 px-5 pb-32 pt-5">
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

        <div
          className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-card px-5 pb-5 pt-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={onApply}
            className="font-display flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
          >
            Show {draftCount} {draftCount === 1 ? "result" : "results"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortMenu({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Sort"
        className="btn-pop-icon inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
        style={{ background: "var(--primary)", boxShadow: "var(--shadow-sm)" }}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="animate-fade-in-up absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl bg-card p-1.5"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          <p className="font-grotesk px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
            Sort by
          </p>
          {sortOptions.map((s) => {
            const on = s.id === value;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
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
  );
}

function CategoryRow({
  active,
  onChange,
}: {
  active: Category | "all";
  onChange: (c: Category | "all") => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => {
        const on = c.id === active;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="chip-pop shrink-0 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              background: on ? "var(--primary)" : "var(--card)",
              color: on ? "var(--primary-foreground)" : "var(--primary)",
              border: "1.5px solid var(--primary)",
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function SponsoredAd() {
  // Swipeable stack of sponsored placements — mixes categories so "sponsored"
  // doesn't read as restaurant-only. No reservation CTA (not our niche);
  // tapping a card opens the venue sheet.
  const { open: openVenueSheet } = useVenueSheet();
  const sponsors: { id: string; name: string; subtitle: string; tag: string; image: string; venueId?: string }[] = [
    {
      id: "s1",
      name: "La Mar by Gastón Acurio",
      subtitle: "Peruvian · 0.5 mi · $$$",
      tag: "Featured restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
      venueId: "v5",
    },
    {
      id: "s2",
      name: "Brickell Key Sunset Loop",
      subtitle: "Landmark · 0.7 mi · Free",
      tag: "Featured experience",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80&auto=format&fit=crop",
      venueId: "v8",
    },
    {
      id: "s3",
      name: "Sugar Rooftop",
      subtitle: "Lounge · 0.4 mi · 28th floor",
      tag: "Featured nightlife",
      image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=1200&q=80&auto=format&fit=crop",
      venueId: "v2",
    },
  ];
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  // Auto-advance like the welcome carousel; pauses briefly after a manual swipe.
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % sponsors.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [paused, sponsors.length]);
  const onDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setPaused(true);
  };
  const onUp = (e: React.PointerEvent) => {
    // Resume auto-advance a moment after the user finishes interacting.
    window.setTimeout(() => setPaused(false), 6000);
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    setIdx((i) => {
      const next = dx < 0 ? i + 1 : i - 1;
      return Math.max(0, Math.min(sponsors.length - 1, next));
    });
  };
  return (
    <div className="mt-5">
      <div
        className="relative overflow-hidden"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (startX.current = null)}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {sponsors.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => s.venueId && openVenueSheet(s.venueId)}
              className="card-lift block w-full shrink-0 overflow-hidden rounded-3xl bg-card text-left"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="relative h-32 w-full">
                <img
                  src={s.image}
                  alt={`Sponsored — ${s.name}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />
                <span
                  className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                >
                  Sponsored
                </span>
                <span
                  className="font-grotesk absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white"
                  style={{ background: "color-mix(in oklab, black 55%, transparent)" }}
                >
                  {s.tag}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="font-display truncate text-sm font-bold tracking-tight">{s.name}</p>
                  <p className="font-grotesk text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    {s.subtitle}
                  </p>
                </div>
                <span
                  className="font-grotesk shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold"
                  style={{
                    background: "color-mix(in oklab, var(--primary) 12%, transparent)",
                    color: "var(--primary)",
                  }}
                >
                  View
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Pager dots */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {sponsors.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Go to sponsor ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === idx ? 18 : 6,
              background: i === idx ? "var(--primary)" : "var(--border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}