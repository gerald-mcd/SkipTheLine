import { Link } from "@tanstack/react-router";
import { Venue, severityColor } from "@/lib/mock-data";

export function CityMap({ venues, onSelect }: { venues: Venue[]; onSelect?: (v: Venue) => void }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base map gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, oklch(0.28 0.06 270 / 0.6), transparent 50%), radial-gradient(circle at 70% 80%, oklch(0.3 0.08 200 / 0.4), transparent 55%), linear-gradient(180deg, oklch(0.14 0.025 260) 0%, oklch(0.1 0.02 260) 100%)",
        }}
      />
      {/* Grid streets */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="streets" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#streets)" />
      </svg>
      {/* Diagonal "highways" */}
      <svg className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M -10 30 Q 50 20, 110 50" stroke="oklch(0.85 0.19 165 / 0.4)" strokeWidth="0.4" fill="none" />
        <path d="M -10 75 Q 40 60, 110 80" stroke="oklch(0.7 0.22 290 / 0.4)" strokeWidth="0.4" fill="none" />
        <path d="M 25 -10 L 35 110" stroke="white" strokeOpacity="0.15" strokeWidth="0.3" fill="none" />
        <path d="M 65 -10 L 70 110" stroke="white" strokeOpacity="0.15" strokeWidth="0.3" fill="none" />
      </svg>

      {/* Radar sweep on user location */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-40 w-40">
          <div
            className="absolute inset-0 animate-radar rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, oklch(0.85 0.19 165 / 0.25) 60deg, transparent 120deg)",
            }}
          />
          <div className="absolute inset-0 rounded-full" style={{ background: "var(--gradient-pulse)" }} />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4" style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)", outlineColor: "var(--primary)" }} />
        </div>
      </div>

      {/* Venue pins */}
      {venues.map((v) => (
        <Link
          key={v.id}
          to="/venue/$id"
          params={{ id: v.id }}
          onClick={() => onSelect?.(v)}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-float-up"
          style={{ left: `${v.x}%`, top: `${v.y}%` }}
        >
          <div className="relative flex flex-col items-center">
            {/* Pulse */}
            <span
              className="absolute -top-1 h-10 w-10 animate-ping-soft rounded-full"
              style={{ background: severityColor(v.severity), opacity: 0.3 }}
            />
            <div
              className="glass-strong relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-lg"
              style={{ borderColor: severityColor(v.severity) }}
            >
              <span
                className="h-2 w-2 rounded-full animate-breathe"
                style={{ background: severityColor(v.severity), boxShadow: `0 0 12px ${severityColor(v.severity)}` }}
              />
              <span className="text-xs font-bold tabular-nums" style={{ color: severityColor(v.severity) }}>
                {v.waitMinutes}m
              </span>
            </div>
            {v.event && (
              <span className="mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>
                ★ event
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}