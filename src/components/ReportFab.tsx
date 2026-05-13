import { Link, useLocation } from "@tanstack/react-router";

/* ─────────── Static glyph library (no animation) ─────────── */
/* Shared sizing pattern: 24x24 viewBox, currentColor stroke. */

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* 1. Tap-to-Time — finger tap meeting a clock face. */
export function TapTimeGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="10" cy="11" r="6" />
      <path d="M10 8v3l2 1.5" />
      <path d="M17 17l3 3M19 14l1.5 1.5M14 19l1.5 1.5" />
    </svg>
  );
}

/* 2. Queue + Clock — three queued dots meeting a small clock badge. */
export function QueueClockGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="4" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="8" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <path d="M14 14h2.5" />
      <circle cx="18" cy="9" r="5" />
      <path d="M18 6.5V9l1.7 1.1" />
    </svg>
  );
}

/* 3. Pin + Timer — map pin enclosing a clock. */
export function PinTimerGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="3" />
      <path d="M12 7.5V9l1.2 0.8" />
    </svg>
  );
}

/* 4. Stopwatch + Tap — classic stopwatch with a tap dot. */
export function StopwatchTapGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M10 2h4" />
      <path d="M12 4v2" />
      <circle cx="12" cy="14" r="7" />
      <path d="M12 11v3l2 1.5" />
      <circle cx="19" cy="6" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* 5. Signal Wave + Clock — broadcasting wait data. */
export function SignalClockGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="9" cy="13" r="5" />
      <path d="M9 10.5V13l1.7 1.1" />
      <path d="M16 8c2 1.5 2 7 0 8.5" />
      <path d="M18.5 5.5c4 3 4 10 0 13" />
    </svg>
  );
}

/* 6. Check + Clock — confirmation timer. */
export function CheckClockGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </svg>
  );
}

/* 7. Radar Ping — concentric pulses with a center dot. */
export function RadarPingGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" opacity="0.5" />
    </svg>
  );
}

/* 8. People + Clock — community/crowd timing. */
export function CrowdClockGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="7" cy="8" r="2.5" />
      <path d="M2.5 17c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5" />
      <circle cx="17" cy="9" r="4" />
      <path d="M17 7v2l1.4 0.9" />
    </svg>
  );
}

/* 9. Bell + Timer — alert when wait is dropped. */
export function BellTimerGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z" />
      <path d="M10.5 21a2 2 0 0 0 3 0" />
      <path d="M12 8v3l1.5 1" />
    </svg>
  );
}

/* 10. Speed Gauge — quick read of wait conditions. */
export function SpeedGaugeGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 16a9 9 0 1 1 18 0" />
      <path d="M12 16l4-4" />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* 11. Send + Clock — submit a wait time. */
export function SendClockGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 11l16-7-7 16-2-7-7-2z" />
      <circle cx="17" cy="17" r="3.5" />
      <path d="M17 15.5V17l1 0.7" />
    </svg>
  );
}

/* Catalog for preview/picker. */
export const GLYPH_CATALOG = [
  { key: "queue", label: "Queue + Clock", node: QueueClockGlyph },
  { key: "tap", label: "Tap-to-Time", node: TapTimeGlyph },
  { key: "pin", label: "Pin + Timer", node: PinTimerGlyph },
  { key: "stopwatch", label: "Stopwatch Tap", node: StopwatchTapGlyph },
  { key: "signal", label: "Signal + Clock", node: SignalClockGlyph },
  { key: "check", label: "Check Clock", node: CheckClockGlyph },
  { key: "radar", label: "Radar Ping", node: RadarPingGlyph },
  { key: "crowd", label: "Crowd + Clock", node: CrowdClockGlyph },
  { key: "bell", label: "Bell Timer", node: BellTimerGlyph },
  { key: "gauge", label: "Speed Gauge", node: SpeedGaugeGlyph },
  { key: "send", label: "Send + Clock", node: SendClockGlyph },
] as const;

/**
 * Subtle floating contributor entry-point.
 * Sits above the bottom nav, bottom-right. Visible but unobtrusive.
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
      className="pointer-events-none fixed inset-x-0 z-30 mx-auto flex max-w-md justify-end px-4"
      style={{ bottom: "calc(72px + env(safe-area-inset-bottom) + 12px)" }}
    >
      <Link
        to="/report"
        aria-label="Report a wait time"
        className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-card pl-2.5 pr-3.5 py-2.5 text-xs font-semibold transition-transform active:scale-95"
        style={{
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, white))",
            color: "var(--primary-foreground)",
          }}
        >
          <TapTimeGlyph />
        </span>
        <span className="font-grotesk tracking-tight">Report wait</span>
      </Link>
    </div>
  );
}
