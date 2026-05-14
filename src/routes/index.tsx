import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Settings, Check, Heart, Moon, Search, SlidersHorizontal, Sun, TrendingUp, TrendingDown, Minus, Mail, Phone, CalendarDays, Bell, Shield, LogOut, X, ChevronRight, MapPin } from "lucide-react";
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
    () => (cat === "all" ? venues : venues.filter((v) => v.category === cat)),
    [cat],
  );
  const popular = useMemo(() => {
    const list = [...filtered];
    if (sort === "wait") return list.sort((a, b) => a.waitMinutes - b.waitMinutes);
    if (sort === "distance") return list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    if (sort === "rated") return list.sort((a, b) => venueRating(b.id) - venueRating(a.id));
    return list.sort((a, b) => b.liveReporters - a.liveReporters);
  }, [filtered, sort]);

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
            className="btn-pop-icon inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ background: "var(--primary)" }}
            aria-label="Filters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="14" y2="7" /><circle cx="17" cy="7" r="2.2" fill="currentColor" />
              <line x1="10" y1="17" x2="20" y2="17" /><circle cx="7" cy="17" r="2.2" fill="currentColor" />
            </svg>
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
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SortMenu value={sort} onChange={setSort} />
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
                      Be the first · +15 pts
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
            </Link>
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
            <SettingsItem icon={<LogOut className="h-4 w-4" style={{ color: "var(--destructive, #c33)" }} />} label="Log out" top destructive />
          </div>
        </section>
      </div>
    </div>
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
  // Placeholder for a paid placement (à la OpenTable / Yelp featured listing).
  // Same card shape as a venue, with a clear "Sponsored" tag so it doesn't
  // mislead. Intentionally no real CTA wiring — pure ad slot.
  return (
    <div
      className="animate-fade-in-up mt-5 overflow-hidden rounded-3xl bg-card"
      style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="relative h-32 w-full">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop"
          alt="Sponsored — La Mar Brickell"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span
          className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
        >
          Sponsored
        </span>
      </div>
      <div className="flex items-center gap-3 p-3">
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-sm font-bold tracking-tight">La Mar Brickell</p>
          <p className="font-grotesk text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            Peruvian · 0.4 mi · <span className="font-semibold" style={{ color: "var(--foreground)" }}>$$$</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast("Reservation flow coming soon")}
          className="font-grotesk shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Reserve
        </button>
      </div>
    </div>
  );
}