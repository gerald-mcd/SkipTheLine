import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bell, Clock, Heart, Search } from "lucide-react";
import { venues, Category, categories } from "@/lib/mock-data";
import { useFavorites } from "@/hooks/use-favorites";

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
  const { isFav, toggle } = useFavorites();

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

        {/* Popular this week */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight">Popular this week</h2>
          <Link
            to="/discover"
            className="font-grotesk text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            See all
          </Link>
        </div>
        <div className="mt-3 no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {sortOptions.map((s) => {
            const on = s.id === sort;
            return (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className="font-grotesk shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all"
                style={{
                  background: on ? "var(--foreground)" : "white",
                  color: on ? "white" : "var(--foreground)",
                  border: "1px solid",
                  borderColor: on ? "var(--foreground)" : "var(--border)",
                  boxShadow: on ? "var(--shadow-sm)" : "none",
                }}
              >
                <span aria-hidden>{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
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
              className="card-lift animate-fade-in-up group block overflow-hidden rounded-2xl bg-white"
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
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 backdrop-blur transition-transform active:scale-90"
                >
                  <Heart
                    className="h-3.5 w-3.5 transition-colors"
                    fill={fav ? "var(--primary)" : "transparent"}
                    style={{ color: fav ? "var(--primary)" : "var(--foreground)" }}
                  />
                </button>
                <span
                  key={`${v.id}-${v.waitMinutes}`}
                  className={`font-grotesk animate-pop-in absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full text-white ${
                    isWaitSort ? "px-2.5 py-1 text-[12px]" : "px-2 py-0.5 text-[10px]"
                  } font-bold`}
                  style={{
                    background: "var(--primary)",
                    boxShadow: isWaitSort ? "var(--shadow-md)" : "none",
                  }}
                >
                  <Clock className={isWaitSort ? "h-3 w-3" : "h-2.5 w-2.5"} />
                  <span className="tabular-nums">{v.waitMinutes}m</span>
                  <span className={`${isWaitSort ? "text-[9px]" : "text-[8px]"} uppercase tracking-wider opacity-90`}>
                    wait
                  </span>
                </span>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display truncate text-sm font-bold tracking-tight">{v.name}</h3>
                  {isWaitSort && (
                    <span
                      key={`wait-${v.id}-${v.waitMinutes}`}
                      className="font-display animate-pop-in shrink-0 text-base font-extrabold tabular-nums leading-none"
                      style={{ color: "var(--primary)" }}
                    >
                      {v.waitMinutes}
                      <span className="text-[10px] font-bold"> min</span>
                    </span>
                  )}
                </div>
                <p className="font-grotesk mt-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span className="font-bold" style={{ color: "var(--foreground)" }}>{v.liveReporters}</span> reporting · {v.distance}
                </p>
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