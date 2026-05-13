import { Sparkles } from "lucide-react";

export function ReportFab({
  onClick,
  label = "Report the wait",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="cta-report group fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform active:scale-95"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)",
        color: "var(--primary-foreground)",
      }}
    >
      <span className="absolute inset-0 animate-ping-soft rounded-full bg-white/20" />
      <Sparkles className="relative h-6 w-6" />
    </button>
  );
}
