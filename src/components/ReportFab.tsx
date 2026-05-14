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

/* ─────────── "Skip the line" themed glyphs ─────────── */

/* 12. Line Jump — arrow leaping over queued dots. */
export function LineJumpGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="4" cy="17" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16" cy="17" r="1.4" fill="currentColor" stroke="none" />
      <path d="M3 12c3-7 13-7 18 0" />
      <path d="M17 8l4 4-4 4" />
    </svg>
  );
}

/* 13. Fast Pass — ticket with a lightning bolt. */
export function FastPassGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
      <path d="M13 8l-3 5h3l-1 3 3-5h-3l1-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* 14. Velvet Rope — stanchion posts with a curving rope and a skip arrow. */
export function VelvetRopeGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="5" cy="7" r="1.6" />
      <path d="M5 8.5V20" />
      <circle cx="15" cy="7" r="1.6" />
      <path d="M15 8.5V20" />
      <path d="M6.5 7.5c2 3 6.5 3 8.5 0" />
      <path d="M18 14h3m-2-2 2 2-2 2" />
    </svg>
  );
}

/* 15. Door Skip — open door with a forward arrow. */
export function DoorSkipGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
      <path d="M3 21h13" />
      <circle cx="11.5" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <path d="M16 13h5m-2-2 2 2-2 2" />
    </svg>
  );
}

/* 16. Skip Arrow — chevron-double "skip forward" mark with a clock dot. */
export function SkipArrowGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 7l5 5-5 5" />
      <path d="M11 7l5 5-5 5" />
      <circle cx="20" cy="12" r="2" />
    </svg>
  );
}

/* 17. VIP Wristband — wristband loop with a star. */
export function VipBandGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 9a8 4 0 1 0 16 0 8 4 0 1 0-16 0" />
      <path d="M4 9v4a8 4 0 0 0 16 0V9" />
      <path d="M12 7l0.7 1.4 1.6.2-1.2 1.1.3 1.5-1.4-.7-1.4.7.3-1.5L9.7 8.6l1.6-.2L12 7z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* 18. Cut-the-Line — scissors snipping through a queue line. */
export function CutLineGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 12h18" strokeDasharray="2 2" />
      <circle cx="7" cy="7" r="2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 8.5l10 7M9 15.5l10-7" />
    </svg>
  );
}

/* 19. People Skip — two heads moving forward with a double-chevron skip. */
export function PeopleSkipGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      {/* Back person */}
      <circle cx="4" cy="8" r="2" />
      <path d="M1.5 17c0-2.5 1.5-4 3.5-4" />
      {/* Front person (slightly ahead) */}
      <circle cx="9" cy="7" r="2.2" />
      <path d="M5.5 17c0-3 1.8-5 4-5s3.5 1.5 3.5 3.5V17" />
      {/* Double-chevron skip forward */}
      <path d="M14 8l4 4-4 4" />
      <path d="M19 8l4 4-4 4" />
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
  { key: "linejump", label: "Line Jump", node: LineJumpGlyph },
  { key: "fastpass", label: "Fast Pass", node: FastPassGlyph },
  { key: "velvetrope", label: "Velvet Rope", node: VelvetRopeGlyph },
  { key: "doorskip", label: "Door Skip", node: DoorSkipGlyph },
  { key: "skiparrow", label: "Skip Arrow", node: SkipArrowGlyph },
  { key: "vipband", label: "VIP Wristband", node: VipBandGlyph },
  { key: "cutline", label: "Cut the Line", node: CutLineGlyph },
  { key: "peopleskip", label: "People Skip", node: PeopleSkipGlyph },
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
          <PeopleSkipGlyph />
        </span>
        <span className="font-grotesk tracking-tight">Report wait</span>
      </Link>
    </div>
  );
}
