import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { venues, severityColor, severityLabel, liveFeed, profile, type Severity } from "@/lib/mock-data";
import { ArrowLeft, Heart, Share2, Clock, MapPin, Calendar, Timer, MessageSquare, UserCircle2 } from "lucide-react";
import { ReportSheet } from "@/components/ReportSheet";
import { ReportCTA } from "@/components/ReportCTA";

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
        <ReportCTA onClick={() => setReportOpen(true)} />
      </div>
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
    <div className="rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">{icon}<span className="text-sm font-bold">{value}</span></div>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</p>
    </div>
  );
}
