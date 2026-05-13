import { Link, useLocation } from "@tanstack/react-router";

/* Tap-to-Time — finger tap meeting a clock face. Shared glyph for FAB + BottomNav. */
export function TapTimeGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="11" r="6" />
      <path d="M10 8v3l2 1.5" className="fab-clock-hand" style={{ transformOrigin: "10px 11px" }} />
      <path d="M17 17l3 3M19 14l1.5 1.5M14 19l1.5 1.5" className="fab-tap-ripple" />
    </svg>
  );
}

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
