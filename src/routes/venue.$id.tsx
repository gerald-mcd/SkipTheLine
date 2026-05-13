import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { venues, severityColor, severityLabel, liveFeed, profile, type Severity } from "@/lib/mock-data";
import { ArrowLeft, Heart, Share2, Clock, MapPin, Calendar, Timer, MessageSquare, UserCircle2, Navigation, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";

type MyReport = { id: string; minutes: number; note?: string; ago: string };

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

  const [myReports, setMyReports] = useState<MyReport[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  // Photo gallery — hero image plus a couple of complementary shots.
  const photos = useMemo(
    () => [
      v.image,
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80&auto=format&fit=crop",
    ],
    [v.image],
  );

  // Synthetic reviews — deterministic per venue id.
  const reviews = useMemo(() => {
    const pool = [
      { author: "Jasmine K.", rating: 5, text: "Vibes are unreal. Worth the wait every time.", ago: "2d" },
      { author: "Rico M.", rating: 4, text: "Great spot. Hit the bar — line moves twice as fast.", ago: "5d" },
      { author: "Priya S.", rating: 5, text: "Friendly staff and the patio is a gem.", ago: "1w" },
    ];
    return pool;
  }, [v.id]);
  const avgRating = useMemo(
    () => (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
    [reviews],
  );

  const openDirections = () => {
    const dest = encodeURIComponent(`${v.name}, ${v.address}`);
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua);
    const url = isApple
      ? `https://maps.apple.com/?daddr=${dest}`
      : `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Build a simple wait-trend sparkline (mock)
  const trend = [22, 28, 31, 35, 30, 38, 45, 42, v.waitMinutes];
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const norm = trend.map((t) => ((t - min) / Math.max(1, max - min)) * 40 + 4);

  const recent = liveFeed.slice(0, 4);
  const color = severityColor(v.severity);

  const liveWait = myReports[0]?.minutes ?? v.waitMinutes;
  const liveSeverity: Severity =
    myReports[0] != null
      ? liveWait < 15
        ? "short"
        : liveWait < 45
          ? "moderate"
          : "long"
      : v.severity;
  const liveColor = severityColor(liveSeverity);
  const reportsCount = v.reportsCount + myReports.length;
  const lastUpdatedMin = myReports[0] ? 0 : v.lastReportMinutes;

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-80 w-full overflow-hidden">
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${v.name} photo ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: i === photoIdx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)" }} />
        {/* Carousel controls */}
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => setPhotoIdx((i) => (i === 0 ? photos.length - 1 : i - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => setPhotoIdx((i) => (i === photos.length - 1 ? 0 : i + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => setPhotoIdx(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === photoIdx ? 18 : 6,
                background: i === photoIdx ? "white" : "rgba(255,255,255,0.55)",
              }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate({ to: "/explore" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur">
              <Heart className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.2em] opacity-90">
            {v.categoryLabel} · {v.vibe}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">{v.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-xs opacity-90">
            <MapPin className="h-3 w-3" /> {v.address}
          </p>
        </div>
      </div>

      {/* Action row — directions deep-link to native maps */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={openDirections}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-transform active:scale-95"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Navigation className="h-4 w-4" /> Directions
        </button>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
          style={{
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        >
          <Clock className="h-4 w-4" /> Report wait
        </button>
      </div>

      <div className="px-4 pt-5" style={{ background: "var(--surface-elevated)", borderBottom: "1px solid var(--border)" }}>
        {/* Big number */}
        <div className="flex items-end justify-between pb-5">
          <div>
            <p className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
              Live wait
            </p>
            <div className="flex items-baseline gap-2">
              <span key={liveWait} className="font-display animate-fade-in text-7xl font-bold leading-none tabular-nums tracking-tight" style={{ color: liveColor }}>
                {liveWait}
              </span>
              <span className="text-xl font-medium" style={{ color: liveColor }}>min</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${liveColor}1f`, color: liveColor }}>
                {severityLabel(liveSeverity)} line
              </span>
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                <Clock className="h-3 w-3" /> Updated {lastUpdatedMin === 0 ? "just now" : `${lastUpdatedMin}m ago`}
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
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
          <Calendar className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Driving the crowd</p>
            <p className="text-sm font-semibold">{v.event}</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        <Mini icon={<Timer className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`${v.typicalWaitMinutes}m`} label="Avg wait" />
        <Mini icon={<MessageSquare className="h-3.5 w-3.5" style={{ color: color as any }} />} value={`${reportsCount}`} label="Reports" />
        <Mini icon={<Clock className="h-3.5 w-3.5" />} value={v.hours} label="Open" />
      </div>

      {/* Reviews */}
      <section className="mt-6 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold">Reviews</h2>
          <p className="flex items-center gap-1 text-[12px] font-bold">
            <Star className="h-3.5 w-3.5" fill="currentColor" style={{ color: "var(--primary)" }} />
            {avgRating}
            <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>· {reviews.length}</span>
          </p>
        </div>
        <div className="mt-2 space-y-2">
          {reviews.map((r) => (
            <div key={r.author} className="rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.author}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3"
                      fill={i < r.rating ? "currentColor" : "transparent"}
                      style={{ color: i < r.rating ? "var(--primary)" : "var(--muted-foreground)" }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-[12px]" style={{ color: "var(--foreground)" }}>"{r.text}"</p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>{r.ago} ago</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent reports */}
      <section className="mt-6 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold">Recent reports</h2>
          <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Names shown for friends only</p>
        </div>
        <div className="mt-2 space-y-2">
          {myReports.map((r) => (
            <div key={r.id} className="animate-fade-in flex items-start gap-3 rounded-xl bg-card p-3" style={{ border: "1px solid var(--primary)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                {profile.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  You
                  <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                    Your report
                  </span>
                </p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>walk-in · {r.ago}</p>
                {r.note && (
                  <p className="mt-1 text-[12px]" style={{ color: "var(--foreground)" }}>"{r.note}"</p>
                )}
              </div>
              <span className="text-base font-semibold tabular-nums" style={{ color: liveColor }}>{r.minutes}m</span>
            </div>
          ))}
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
                  <p className="text-sm font-medium">
                    {friend ? r.user : "Someone nearby"}
                    {friend && (
                      <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                        Friend
                      </span>
                    )}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>walk-in · {r.ago}</p>
                </div>
                <span className="text-base font-semibold tabular-nums" style={{ color: severityColor(v.severity) }}>{r.minutes}m</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-4" />

      {reportOpen && (
        <ReportSheet
          venue={v}
          onClose={() => setReportOpen(false)}
          onSubmit={({ minutes, note, points }) => {
            const r: MyReport = {
              id: `me-${Date.now()}`,
              minutes,
              note,
              ago: "just now",
            };
            setMyReports((prev) => [r, ...prev]);
            setReportOpen(false);
            toast("Report submitted", { description: `${minutes} min wait · +${points} pts` });
          }}
        />
      )}
    </div>
  );
}

function Mini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">{icon}<span className="text-sm font-bold">{value}</span></div>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</p>
    </div>
  );
}
