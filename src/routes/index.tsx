import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell, Heart, Search, MapPin, TrendingUp, Star, Clock, Navigation } from "lucide-react";
import { venues, Category, categories } from "@/lib/mock-data";
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
  const [sort, setSort] = useState<"trending" | "wait" | "distance" | "rating">("trending");
  const { isFav, toggle } = useFavorites();

  const filtered = useMemo(
    () => (cat === "all" ? venues : venues.filter((v) => v.category === cat)),
    [cat],
  );

  // Synthetic rating derived from id so it's stable
  const ratingFor = (id: string) => 4 + ((id.charCodeAt(1) % 9) + 1) / 10;

  const trendingNearby = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => {
          const ta = a.trend === "up" ? 0 : a.trend === "flat" ? 1 : 2;
          const tb = b.trend === "up" ? 0 : b.trend === "flat" ? 1 : 2;
          if (ta !== tb) return ta - tb;
          const da = parseFloat(a.distance);
          const db = parseFloat(b.distance);
          if (da !== db) return da - db;
          return b.liveReporters - a.liveReporters;
        })
        .slice(0, 8),
    [filtered],
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "wait") list.sort((a, b) => a.waitMinutes - b.waitMinutes);
    else if (sort === "distance")
      list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    else if (sort === "rating") list.sort((a, b) => ratingFor(b.id) - ratingFor(a.id));
    else list.sort((a, b) => b.liveReporters - a.liveReporters);
    return list;
  }, [filtered, sort]);

  const sortOptions: { id: typeof sort; label: string; icon: typeof Clock }[] = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "wait", label: "Shortest wait", icon: Clock },
    { id: "distance", label: "Closest", icon: Navigation },
    { id: "rating", label: "Top rated", icon: Star },
  ];
  const sortLabel = sortOptions.find((s) => s.id === sort)?.label ?? "Popular";

  return (
    <div className="relative overflow-hidden pb-4">
      {/* Soft ambient — very light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 5%, white) 0%, white 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 -z-10 h-[280px] w-[280px] rounded-full opacity-25 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--primary) 35%, transparent)" }}
      />

      {/* Top bar: greeting + bell */}
      <header className="relative px-5 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toast("Sign in coming soon")}
            className="flex items-center gap-2.5 rounded-full bg-white py-1 pl-1 pr-4"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-xs"
              style={{ background: "var(--primary)" }}
            >
              K
            </span>
            <span className="font-display text-sm font-bold tracking-tight">Hi, Kate!</span>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <Bell className="h-4 w-4" style={{ color: "var(--foreground)" }} />
            <span
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full ring-2 ring-white"
              style={{ background: "var(--primary)" }}
            />
          </button>
        </div>

        {/* Voucher banner */}
        <div
          className="relative mt-5 overflow-hidden rounded-3xl p-5 text-white"
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
              className="font-grotesk mt-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-bold text-white"
              style={{ background: "var(--primary)", boxShadow: "var(--shadow-sm)" }}
            >
              Claim voucher
            </button>
          </div>
          {/* Decorative food disc */}
          <div
            aria-hidden
            className="absolute -right-6 -top-6 h-44 w-44 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80&auto=format&fit=crop)",
              boxShadow: "inset 0 0 0 6px white",
            }}
          />
        </div>

        {/* Search */}
        <div
          className="mt-5 flex items-center gap-2 rounded-full bg-white px-3 py-2.5"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
        >
          <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <input
            placeholder="Restaurant name or dish..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
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

        {/* Trending nearby */}
        <div className="mt-7 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight">Trending nearby</h2>
            <p className="font-grotesk mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              <MapPin className="h-3 w-3" style={{ color: "var(--primary)" }} />
              Within 2 mi of you
            </p>
          </div>
          <Link
            to="/discover"
            className="font-grotesk text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            See all
          </Link>
        </div>
      </header>

      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
        {trendingNearby.map((v) => {
          const rating = 4 + ((v.id.charCodeAt(1) % 9) + 1) / 10;
          return (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="block w-44 shrink-0 overflow-hidden rounded-2xl bg-white"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="relative h-28 w-full">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
                <span
                  className="font-grotesk absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  Trending
                </span>
              </div>
              <div className="p-2.5">
                <h3 className="font-display truncate text-sm font-bold tracking-tight">{v.name}</h3>
                <div className="mt-1 flex items-center justify-between text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="font-grotesk inline-flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5" fill="var(--primary)" style={{ color: "var(--primary)" }} />
                    <span className="font-bold" style={{ color: "var(--foreground)" }}>{rating.toFixed(1)}</span>
                  </span>
                  <span className="font-grotesk">{v.distance}</span>
                  <span className="font-grotesk font-bold tabular-nums" style={{ color: "var(--primary)" }}>{v.waitMinutes}m</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <header className="relative px-5">
        {/* Sortable list */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight">{sortLabel}</h2>
          <Link
            to="/discover"
            className="font-grotesk text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            See all
          </Link>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {sortOptions.map((s) => {
            const on = s.id === sort;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className="font-grotesk inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold transition-all"
                style={{
                  background: on ? "var(--foreground)" : "white",
                  color: on ? "var(--background)" : "var(--foreground)",
                  border: "1px solid",
                  borderColor: on ? "var(--foreground)" : "var(--border)",
                  boxShadow: on ? "var(--shadow-sm)" : "none",
                }}
              >
                <Icon className="h-3 w-3" />
                {s.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="mt-3 grid grid-cols-2 gap-3 px-5">
        {sorted.slice(0, 6).map((v) => {
          const fav = isFav(v.id);
          const rating = ratingFor(v.id);
          return (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="group block overflow-hidden rounded-2xl bg-white"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="relative h-32 w-full">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(v.id);
                  }}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 backdrop-blur"
                >
                  <Heart
                    className="h-3.5 w-3.5"
                    fill={fav ? "var(--primary)" : "transparent"}
                    style={{ color: fav ? "var(--primary)" : "var(--foreground)" }}
                  />
                </button>
                <span
                  className="font-grotesk absolute bottom-2 left-2 inline-flex items-baseline gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  <span className="tabular-nums">{v.waitMinutes}m</span>
                  <span className="text-[8px] uppercase tracking-wider opacity-90">wait</span>
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-display truncate text-sm font-bold tracking-tight">{v.name}</h3>
                <div className="mt-1 flex items-center justify-between text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="font-grotesk inline-flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5" fill="var(--primary)" style={{ color: "var(--primary)" }} />
                    <span className="font-bold" style={{ color: "var(--foreground)" }}>{rating.toFixed(1)}</span>
                  </span>
                  <span className="font-grotesk">{v.distance}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
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
            className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all"
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
  );
}