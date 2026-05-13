import { Link, useLocation } from "@tanstack/react-router";

/* ---------- Custom glyphs (Copilot-style, branded) ---------- */

function HourglassPulse() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fab-hourglass" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10M7 21h10M8 3v3.5c0 1.5 1 2.5 2 3.3l2 1.2 2-1.2c1-.8 2-1.8 2-3.3V3M8 21v-3.5c0-1.5 1-2.5 2-3.3l2-1.2 2 1.2c1 .8 2 1.8 2 3.3V21" />
      <circle cx="18.5" cy="5.5" r="1.8" fill="currentColor" stroke="none" className="fab-pulse-dot" />
    </svg>
  );
}

function QueueClock() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="2.4" />
      <path d="M3 18c.5-2.4 2.2-3.6 4-3.6s3.5 1.2 4 3.6" />
      <circle cx="15" cy="14.5" r="4.5" />
      <path d="M15 12.5v2l1.3 1.3" className="fab-clock-hand" style={{ transformOrigin: "15px 14.5px" }} />
    </svg>
  );
}

function RadialGauge() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M12 16l4-4" className="fab-gauge-needle" style={{ transformOrigin: "12px 16px" }} />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 3v2M21 12h-2M5 12H3" />
    </svg>
  );
}

function WaveDot() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" className="fab-pulse-dot" />
      <path d="M11 8.5a5 5 0 0 1 0 7" className="fab-wave-1" />
      <path d="M15 5.5a9 9 0 0 1 0 13" className="fab-wave-2" />
    </svg>
  );
}

const GLYPHS = [
  { key: "hourglass", label: "Hourglass", node: <HourglassPulse /> },
  { key: "queue", label: "Queue + Clock", node: <QueueClock /> },
  { key: "gauge", label: "Gauge", node: <RadialGauge /> },
  { key: "wave", label: "Wave", node: <WaveDot /> },
  { key: "tap", label: "Tap-to-Time", node: <TapTime /> },
  { key: "bolt", label: "Bolt Clock", node: <BoltClock /> },
  { key: "pin", label: "Pin + Ring", node: <PinRing /> },
  { key: "beacon", label: "Live Beacon", node: <Beacon /> },
  { key: "loop", label: "Contribution Loop", node: <Loop /> },
  { key: "uparrow", label: "Send-Up Clock", node: <SendUp /> },
] as const;

/**
 * Subtle floating contributor entry-point.
 * Sits above the bottom nav, bottom-right. Visible but unobtrusive —
 * styled like a small floating card (à la iOS app shortcuts).
 */
export function ReportFab() {
  const { pathname } = useLocation();

  const hide =
    pathname === "/welcome" ||
    pathname === "/report" ||
    pathname.startsWith("/venue");
  if (hide) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-30 mx-auto flex max-w-md flex-col items-end gap-2 px-4"
      style={{ bottom: "calc(72px + env(safe-area-inset-bottom) + 12px)" }}
    >
      {GLYPHS.map((g) => (
        <Link
          key={g.key}
          to="/report"
          aria-label={`Report a wait time (${g.label})`}
          className="pointer-events-auto group flex items-center gap-2 rounded-2xl bg-card pl-2.5 pr-3.5 py-2.5 text-xs font-semibold transition-transform active:scale-95"
          style={{
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, white))",
              color: "var(--primary-foreground)",
            }}
          >
            {g.node}
          </span>
          <span className="font-grotesk tracking-tight">Report wait</span>
          <span className="text-[10px] opacity-50 ml-1">{g.label}</span>
        </Link>
      ))}
    </div>
  );
}
