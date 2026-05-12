import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { venues, severityColor, severityLabel, liveFeed, profile, type Severity } from "@/lib/mock-data";
import { ArrowLeft, Heart, Share2, Clock, MapPin, Sparkles, Calendar, Timer, MessageSquare, UserCircle2, X, Minus, Plus } from "lucide-react";

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
        <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)" }} />
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
        <Mini icon={<Timer className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`${v.typicalWaitMinutes}m`} label="Avg wait" />
        <Mini icon={<MessageSquare className="h-3.5 w-3.5" style={{ color: color as any }} />} value={`${reportsCount}`} label="Reports" />
        <Mini icon={<Clock className="h-3.5 w-3.5" />} value={v.hours} label="Open" />
      </div>

      {/* Recent reports */}
      <section className="mt-6 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold">Recent reports</h2>
          <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Names shown for friends only</p>
        </div>
        <div className="mt-2 space-y-2">
          {myReports.map((r) => (
            <div key={r.id} className="animate-fade-in flex items-start gap-3 rounded-xl bg-white p-3" style={{ border: "1px solid var(--primary)", boxShadow: "var(--shadow-sm)" }}>
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
              <div key={r.id} className="flex items-center gap-3 rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
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

      {/* CTA */}
      <div className="sticky bottom-24 mt-6 px-4">
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          aria-label="Report current wait time"
          className="cta-report group relative flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-white transition-transform"
          style={{ color: "var(--primary-foreground)" }}
        >
          <span className="relative flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-white/30" />
              <Sparkles className="relative h-5 w-5" />
            </span>
            <span className="relative leading-tight">
              <span className="font-display block text-base font-bold tracking-tight">
                Report the wait
              </span>
              <span className="font-grotesk block text-[11px] font-medium opacity-90">
                Help the crowd · earn +10 pts
              </span>
            </span>
          </span>
          <span className="relative flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live
          </span>
        </button>
      </div>
      <div className="h-4" />

      {reportOpen && (
        <ReportSheet
          venueName={v.name}
          initialMinutes={v.waitMinutes}
          onClose={() => setReportOpen(false)}
          onSubmit={(minutes, note) => {
            const r: MyReport = {
              id: `me-${Date.now()}`,
              minutes,
              note: note || undefined,
              ago: "just now",
            };
            setMyReports((prev) => [r, ...prev]);
            setReportOpen(false);
            toast("Report submitted", { description: `${minutes} min wait at ${v.name}` });
          }}
        />
      )}
    </div>
  );
}

function ReportSheet({
  venueName,
  initialMinutes,
  onClose,
  onSubmit,
}: {
  venueName: string;
  initialMinutes: number;
  onClose: () => void;
  onSubmit: (minutes: number, note: string) => void;
}) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [note, setNote] = useState("");
  const presets = [0, 5, 15, 30, 45, 60, 90];
  const NOTE_MAX = 140;

  const submit = () => {
    const m = Math.max(0, Math.min(240, Math.round(minutes)));
    onSubmit(m, note.trim().slice(0, NOTE_MAX));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />
      <div
        className="relative w-full max-w-md animate-slide-up rounded-t-3xl bg-white p-5"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Report wait at</p>
            <h3 className="font-display text-lg font-bold tracking-tight">{venueName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "var(--secondary)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Minute stepper */}
        <div className="rounded-2xl p-4" style={{ background: "var(--surface, #f7f7f8)", border: "1px solid var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Wait time</p>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMinutes((m) => Math.max(0, m - 5))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
              style={{ border: "1px solid var(--border)" }}
              aria-label="Decrease"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-bold tabular-nums tracking-tight" style={{ color: "var(--primary)" }}>{minutes}</span>
              <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>min</span>
            </div>
            <button
              type="button"
              onClick={() => setMinutes((m) => Math.min(240, m + 5))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
              style={{ border: "1px solid var(--border)" }}
              aria-label="Increase"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {presets.map((p) => {
              const on = p === minutes;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMinutes(p)}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors"
                  style={{
                    background: on ? "var(--primary)" : "white",
                    color: on ? "var(--primary-foreground)" : "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {p === 0 ? "No wait" : `${p}m`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <label className="mt-4 block">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            Add a note <span className="lowercase">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
            placeholder="e.g. bar seating moves faster"
            rows={2}
            maxLength={NOTE_MAX}
            className="mt-1.5 w-full resize-none rounded-xl bg-white p-3 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            style={{ border: "1px solid var(--border)" }}
          />
          <p className="mt-1 text-right text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            {note.length}/{NOTE_MAX}
          </p>
        </label>

        <button
          type="button"
          onClick={submit}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
        >
          <Sparkles className="h-4 w-4" />
          Submit report
        </button>
      </div>
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
