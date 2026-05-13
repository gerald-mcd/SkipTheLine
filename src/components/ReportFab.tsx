import { Link, useLocation } from "@tanstack/react-router";
import { Plus } from "lucide-react";

/**
 * Subtle floating contributor entry-point.
 * Sits above the bottom nav, bottom-right. Visible but unobtrusive —
 * styled like a small floating card (à la iOS app shortcuts).
 */
export function ReportFab() {
  const { pathname } = useLocation();

  // Hide where it would be redundant or in the way.
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
        className="pointer-events-auto group flex items-center gap-2 rounded-2xl bg-card pl-2.5 pr-3.5 py-2.5 text-xs font-semibold transition-transform active:scale-95"
        style={{
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-xl"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2.75} />
        </span>
        <span className="font-grotesk tracking-tight">Report wait</span>
      </Link>
    </div>
  );
}
