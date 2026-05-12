import { Sparkles } from "lucide-react";

export function ReportCTA({
  onClick,
  label = "Report the wait",
  sub = "Help the crowd · earn +10 pts",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  sub?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`cta-report group relative flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-white transition-transform ${className}`}
      style={{ color: "var(--primary-foreground)" }}
    >
      <span className="relative flex items-center gap-3">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-white/30" />
          <Sparkles className="relative h-5 w-5" />
        </span>
        <span className="relative leading-tight">
          <span className="font-display block text-base font-bold tracking-tight">{label}</span>
          <span className="font-grotesk block text-[11px] font-medium opacity-90">{sub}</span>
        </span>
      </span>
      <span className="relative flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Live
      </span>
    </button>
  );
}
