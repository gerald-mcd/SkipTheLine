import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { venues, severityColor, severityLabel, liveFeed } from "@/lib/mock-data";
import { ArrowLeft, Heart, Share2, Clock, Users, MapPin, TrendingUp, Sparkles, Calendar } from "lucide-react";

export const Route = createFileRoute("/venue/$id")({
  head: ({ params }) => {
    const v = venues.find((x) => x.id === params.id);
    return {
      meta: [
        { title: v ? `${v.name} — ${v.waitMinutes}m wait now` : "Venue" },
        { name: "description", content: v ? `Live wait time at ${v.name}: ${v.waitMinutes} minutes.` : "Venue details" },
      ],
    };
  },
  component: VenueDetail,
  notFoundComponent: () => <div className="p-8 text-center">Venue not found</div>,
});

function VenueDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const v = venues.find((x) => x.id === id);
  if (!v) return null;

  // Build a simple wait-trend sparkline (mock)
  const trend = [22, 28, 31, 35, 30, 38, 45, 42, v.waitMinutes];
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const norm = trend.map((t) => ((t - min) / Math.max(1, max - min)) * 40 + 4);

  const recent = liveFeed.slice(0, 4);
  const color = severityColor(v.severity);

  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-4 pb-6 pt-6"
        style={{ background: "var(--surface-elevated)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/explore" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
            style={{ border: "1px solid var(--border)" }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white" style={{ border: "1px solid var(--border)" }}>
              <Heart className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white" style={{ border: "1px solid var(--border)" }}>
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            {v.categoryLabel} · {v.distance}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{v.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <MapPin className="h-3 w-3" /> {v.address}
          </p>
        </div>

        {/* Big number */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Live wait
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-bold leading-none tabular-nums tracking-tight" style={{ color }}>
                {v.waitMinutes}
              </span>
              <span className="text-xl font-medium" style={{ color }}>min</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${color}1f`, color }}>
                {severityLabel(v.severity)} line
              </span>
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                <Clock className="h-3 w-3" /> Updated {v.lastReportMinutes}m ago
              </span>
            </div>
          </div>

          {/* Sparkline */}
          <svg width="110" height="56" viewBox="0 0 110 56">
            <defs>
              <linearGradient id={`g-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color as any} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color as any} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke={color as any}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={norm.map((y, i) => `${(i / (norm.length - 1)) * 110},${56 - y}`).join(" ")}
            />
            <polygon
              fill={`url(#g-${v.id})`}
              points={`0,56 ${norm.map((y, i) => `${(i / (norm.length - 1)) * 110},${56 - y}`).join(" ")} 110,56`}
            />
          </svg>
        </div>
      </div>

      {/* Event banner */}
      {v.event && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
          <Calendar className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Driving the crowd</p>
            <p className="text-sm font-semibold">{v.event}</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        <Mini icon={<Users className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`${v.liveReporters}`} label="Live reporters" />
        <Mini icon={<TrendingUp className="h-3.5 w-3.5" style={{ color: color as any }} />} value={v.trend === "up" ? "Rising" : v.trend === "down" ? "Falling" : "Steady"} label="Trend" />
        <Mini icon={<Clock className="h-3.5 w-3.5" />} value={v.hours} label="Open" />
      </div>

      {/* Recent reports */}
      <section className="mt-6 px-4">
        <h2 className="text-sm font-semibold">Recent reports</h2>
        <div className="mt-2 space-y-2">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                {r.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{r.user}</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>walk-in · {r.ago}</p>
              </div>
              <span className="text-base font-semibold tabular-nums" style={{ color: severityColor(v.severity) }}>{r.minutes}m</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="sticky bottom-24 mt-6 px-4">
        <Link
          to="/report"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
          style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
        >
          <Sparkles className="h-4 w-4" />
          Report wait here
        </Link>
      </div>
      <div className="h-4" />
    </div>
  );
}

function Mini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">{icon}<span className="text-sm font-bold">{value}</span></div>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</p>
    </div>
  );
}
