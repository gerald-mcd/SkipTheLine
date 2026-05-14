import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { X, Clock, MapPin, Navigation, Timer, MessageSquare, ExternalLink, Calendar } from "lucide-react";
import { venues, severityColor, severityLabel, type Venue } from "@/lib/mock-data";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";

type Ctx = { open: (id: string) => void; close: () => void };
const VenueSheetContext = createContext<Ctx | null>(null);

export function useVenueSheet() {
  const ctx = useContext(VenueSheetContext);
  if (!ctx) throw new Error("useVenueSheet must be used within VenueSheetProvider");
  return ctx;
}

export function VenueSheetProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((next: string) => setId(next), []);
  const close = useCallback(() => setId(null), []);
  const venue = id ? venues.find((v) => v.id === id) ?? null : null;

  useEffect(() => {
    if (!venue) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [venue, close]);

  return (
    <VenueSheetContext.Provider value={{ open, close }}>
      {children}
      {venue && <VenueSheet venue={venue} onClose={close} />}
    </VenueSheetContext.Provider>
  );
}

function VenueSheet({ venue: v, onClose }: { venue: Venue; onClose: () => void }) {
  const [reportOpen, setReportOpen] = useState(false);
  const color = severityColor(v.severity);

  const openDirections = () => {
    const dest = encodeURIComponent(`${v.name}, ${v.address}`);
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua);
    const url = isApple
      ? `https://maps.apple.com/?daddr=${dest}`
      : `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="animate-fade-in absolute inset-0 bg-black/40" />
      <div
        className="animate-slide-up relative flex h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-card"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {/* Hero */}
        <div className="relative h-44 w-full shrink-0">
          <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)" }} />
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
              {v.categoryLabel} · {v.vibe}
            </p>
            <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight">{v.name}</h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-90">
              <MapPin className="h-3 w-3" /> {v.address}
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4">
          {/* Live wait */}
          <div className="flex items-end justify-between">
            <div>
              <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
                Live wait
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-bold leading-none tabular-nums tracking-tight" style={{ color }}>
                  {v.waitMinutes}
                </span>
                <span className="text-base font-medium" style={{ color }}>min</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${color}1f`, color }}>
                  {severityLabel(v.severity)} line
                </span>
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <Clock className="h-3 w-3" /> {v.lastReportMinutes === 0 ? "just now" : `${v.lastReportMinutes}m ago`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{v.distance} away</p>
              <p className="text-[11px] font-semibold">{v.liveReporters} reporting now</p>
            </div>
          </div>

          {v.event && (
            <div className="mt-3 flex items-center gap-2 rounded-xl p-2.5" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
              <Calendar className="h-4 w-4" style={{ color: "var(--primary)" }} />
              <div className="flex-1">
                <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Driving the crowd</p>
                <p className="text-xs font-semibold">{v.event}</p>
              </div>
            </div>
          )}

          {/* Mini stats */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Mini icon={<Timer className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`${v.typicalWaitMinutes}m`} label="Avg wait" />
            <Mini icon={<MessageSquare className="h-3.5 w-3.5" style={{ color }} />} value={`${v.reportsCount}`} label="Reports" />
            <Mini icon={<Clock className="h-3.5 w-3.5" />} value={v.hours} label="Open" />
          </div>

          {/* Latest quote */}
          <div className="mt-3 rounded-xl p-3" style={{ border: "1px solid var(--border)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Latest report</p>
            <p className="mt-1 text-sm">"{v.recentQuote.text}"</p>
            <p className="mt-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>{v.recentQuote.author} · {v.recentQuote.ago} ago</p>
          </div>

          {/* See full page link */}
          <Link
            to="/venue/$id"
            params={{ id: v.id }}
            onClick={onClose}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-semibold"
            style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          >
            See full page · photos, reviews, history <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Sticky action row */}
        <div className="grid shrink-0 grid-cols-2 gap-2 border-t bg-card p-3" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={openDirections}
            className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
          >
            <Navigation className="h-4 w-4" /> Directions
          </button>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
            style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          >
            <Clock className="h-4 w-4" /> Report wait
          </button>
        </div>
      </div>

      {reportOpen && (
        <ReportSheet venue={v} onClose={() => setReportOpen(false)} />
      )}
    </div>
  );
}

function Mini({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl p-2.5" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1">{icon}<span className="text-xs font-bold tabular-nums">{value}</span></div>
      <p className="mt-0.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>{label}</p>
    </div>
  );
}