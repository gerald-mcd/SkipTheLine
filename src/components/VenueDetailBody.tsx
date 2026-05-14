import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Clock, MapPin, Calendar, Timer, MessageSquare, UserCircle2, Navigation, Star, ChevronLeft, ChevronRight, Camera, X } from "lucide-react";
import { severityColor, severityLabel, liveFeed, profile, type Venue, type Severity } from "@/lib/mock-data";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";

type MyReport = { id: string; minutes: number; note?: string; ago: string };
type UserReview = { id: string; author: string; rating: number; text: string; ago: string };

/**
 * Full venue detail UI used by both the /venue/$id route and the venue sheet
 * overlay. Header overlay (back/close button) is supplied by the parent so
 * each surface can render its own affordance over the hero image.
 */
export function VenueDetailBody({
  venue: v,
  headerOverlay,
  heroHeightClass = "h-80",
}: {
  venue: Venue;
  headerOverlay?: ReactNode;
  heroHeightClass?: string;
}) {
  const [myReports, setMyReports] = useState<MyReport[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);

  const photos = useMemo(
    () => [
      v.image,
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80&auto=format&fit=crop",
      ...userPhotos,
    ],
    [v.image, userPhotos],
  );

  const addPhoto = () => {
    const pool = [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
    ];
    const next = pool[userPhotos.length % pool.length];
    setUserPhotos((prev) => [...prev, next]);
    setPhotoIdx(photos.length);
    toast("Photo added", { description: "Thanks for contributing!" });
  };

  const sourcedReviews = useMemo(
    () => [
      { id: "g1", author: "Jasmine K.", rating: 5, text: "Vibes are unreal. Worth the wait every time.", ago: "2d", source: "Google" as const },
      { id: "g2", author: "Rico M.", rating: 4, text: "Great spot. Hit the bar — line moves twice as fast.", ago: "5d", source: "Google" as const },
      { id: "g3", author: "Priya S.", rating: 5, text: "Friendly staff and the patio is a gem.", ago: "1w", source: "Google" as const },
    ],
    [v.id],
  );
  const reviews = useMemo(
    () => [...userReviews.map((r) => ({ ...r, source: "You" as const })), ...sourcedReviews],
    [userReviews, sourcedReviews],
  );
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

  const trend = [22, 28, 31, 35, 30, 38, 45, 42, v.waitMinutes];
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const norm = trend.map((t) => ((t - min) / Math.max(1, max - min)) * 40 + 4);

  const recent = liveFeed.slice(0, 4);
  const color = severityColor(v.severity);

  const liveWait = myReports[0]?.minutes ?? v.waitMinutes;
  const liveSeverity: Severity =
    myReports[0] != null
      ? liveWait < 15 ? "short" : liveWait < 45 ? "moderate" : "long"
      : v.severity;
  const liveColor = severityColor(liveSeverity);
  const reportsCount = v.reportsCount + myReports.length;
  const lastUpdatedMin = myReports[0] ? 0 : v.lastReportMinutes;

  return (
    <div>
      {/* Hero photo carousel */}
      <div className={`relative ${heroHeightClass} w-full overflow-hidden`}>
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
        {headerOverlay}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.2em] opacity-90">
            {v.categoryLabel} · {v.vibe}
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight">{v.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-xs opacity-90">
            <MapPin className="h-3 w-3" /> {v.address}
          </p>
        </div>
      </div>

      {/* Action row */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={openDirections}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-transform active:scale-95"
          style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        >
          <Navigation className="h-4 w-4" /> Directions
        </button>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-transform active:scale-95"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
        >
          <Clock className="h-4 w-4" /> Report wait
        </button>
      </div>

      {/* Live wait */}
      <div className="mt-4 px-4 pt-4" style={{ background: "var(--surface-elevated)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-end justify-between pb-5">
          <div>
            <p className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
              Live wait
            </p>
            <div className="flex items-baseline gap-2">
              <span key={liveWait} className="font-display animate-fade-in text-6xl font-bold leading-none tabular-nums tracking-tight" style={{ color: liveColor }}>
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

      {v.event && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
          <Calendar className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Driving the crowd</p>
            <p className="text-sm font-semibold">{v.event}</p>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        <Mini icon={<Timer className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`${v.typicalWaitMinutes}m`} label="Avg wait" />
        <Mini icon={<MessageSquare className="h-3.5 w-3.5" style={{ color: color as any }} />} value={`${reportsCount}`} label="Reports" />
        <Mini icon={<Clock className="h-3.5 w-3.5" />} value={v.hours} label="Open" />
      </div>

      {/* Reviews */}
      <section className="mt-6 px-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold">Reviews</h2>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Pulled from Google · plus the community
            </p>
          </div>
          <p className="flex items-center gap-1 text-[12px] font-bold">
            <Star className="h-3.5 w-3.5" fill="currentColor" style={{ color: "var(--primary)" }} />
            {avgRating}
            <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>· {reviews.length}</span>
          </p>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setReviewOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[12px] font-bold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Star className="h-3.5 w-3.5" fill="currentColor" /> Write a review
          </button>
          <button
            type="button"
            onClick={addPhoto}
            className="flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-bold"
            style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          >
            <Camera className="h-3.5 w-3.5" /> Add photo
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      background: r.source === "You" ? "var(--primary)" : "var(--accent)",
                      color: r.source === "You" ? "var(--primary-foreground)" : "var(--primary)",
                    }}
                  >
                    {r.source}
                  </span>
                </div>
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
                {r.note && <p className="mt-1 text-[12px]" style={{ color: "var(--foreground)" }}>"{r.note}"</p>}
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
            const r: MyReport = { id: `me-${Date.now()}`, minutes, note, ago: "just now" };
            setMyReports((prev) => [r, ...prev]);
            setReportOpen(false);
            toast("Report submitted", { description: `${minutes} min wait · +${points} pts` });
          }}
        />
      )}

      {reviewOpen && (
        <WriteReviewSheet
          venueName={v.name}
          onClose={() => setReviewOpen(false)}
          onSubmit={(rating, text) => {
            setUserReviews((prev) => [
              { id: `me-${Date.now()}`, author: "You", rating, text, ago: "just now" },
              ...prev,
            ]);
            setReviewOpen(false);
            toast("Review posted", { description: `Thanks for sharing!` });
          }}
        />
      )}
    </div>
  );
}

function Mini({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">{icon}<span className="text-sm font-bold">{value}</span></div>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</p>
    </div>
  );
}

function WriteReviewSheet({
  venueName,
  onClose,
  onSubmit,
}: {
  venueName: string;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const MAX = 240;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="animate-fade-in absolute inset-0 bg-black/40" />
      <div className="animate-slide-up relative w-full max-w-md rounded-t-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Review</p>
            <h3 className="font-display text-lg font-bold tracking-tight">{venueName}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--secondary)" }} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n === 1 ? "" : "s"}`} className="transition-transform active:scale-90">
              <Star className="h-8 w-8" fill={n <= rating ? "currentColor" : "transparent"} style={{ color: n <= rating ? "var(--primary)" : "var(--muted-foreground)" }} />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          placeholder="Share what made it special (or not)…"
          rows={4}
          className="mt-3 w-full resize-none rounded-xl bg-card p-3 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          style={{ border: "1px solid var(--border)" }}
        />
        <p className="mt-1 text-right text-[10px]" style={{ color: "var(--muted-foreground)" }}>{text.length}/{MAX}</p>
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => onSubmit(rating, text.trim())}
          className="mt-3 w-full rounded-xl py-3.5 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
        >
          Post review
        </button>
      </div>
    </div>
  );
}