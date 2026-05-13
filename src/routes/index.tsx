import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Settings, Check, Heart, Moon, Search, SlidersHorizontal, Sparkles, Sun, TrendingUp, TrendingDown, Minus, Mail, Phone, CalendarDays, Bell, Shield, LogOut, X, ChevronRight } from "lucide-react";
import { venues, Category, categories, profile } from "@/lib/mock-data";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";
import { useFavorites } from "@/hooks/use-favorites";
import { useTheme } from "@/hooks/use-theme";
import { WaitBadge } from "@/components/WaitBadge";

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
  const [reportOpen, setReportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isFav, toggle } = useFavorites();
  const { theme, toggle: toggleTheme } = useTheme();

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

        {/* Voucher banner */}
        <div
          className="animate-fade-in-up relative mt-5 overflow-hidden rounded-3xl p-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.32 0.04 40) 0%, oklch(0.22 0.03 40) 100%)",
          }}
        >
          <div className="max-w-[60%]">
            <p className="font-display text-[13px] font-medium opacity-90">Get special discount</p>
            <p className="font-display mt-0.5 text-2xl font-bold leading-tight tracking-tight">
              up to 45%
            </p>
            <button
              type="button"
              onClick={() => toast("Voucher claimed", { description: "Check your profile for details." })}
              className="btn-pop btn-shine font-grotesk mt-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-bold text-white"
              style={{ background: "var(--primary)", boxShadow: "var(--shadow-sm)" }}
            >
              Claim voucher
            </button>
          </div>
          {/* Decorative food disc */}
          <div
            aria-hidden
            className="animate-drift absolute -right-6 -top-6 h-44 w-44 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80&auto=format&fit=crop)",
              boxShadow: "inset 0 0 0 6px white",
            }}
          />
        </div>

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
          <SortMenu value={sort} onChange={setSort} />
        </div>
      </header>

      <div className="mt-3 grid grid-cols-2 gap-3 px-5">
        {popular.slice(0, 6).map((v, idx) => {
          const fav = isFav(v.id);
          const isWaitSort = sort === "wait";
          return (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="card-lift animate-fade-in-up group block overflow-hidden rounded-2xl bg-card"
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

      {reportOpen && (
        <ReportSheet onClose={() => setReportOpen(false)} />
      )}

      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
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