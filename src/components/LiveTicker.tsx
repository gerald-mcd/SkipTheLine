import { liveFeed } from "@/lib/mock-data";
import { Activity } from "lucide-react";

export function LiveTicker() {
  const items = [...liveFeed, ...liveFeed];
  return (
    <div className="glass relative h-9 overflow-hidden rounded-full px-3">
      <div className="flex h-full items-center gap-2">
        <div className="flex h-5 items-center gap-1 rounded-full px-2" style={{ background: "var(--destructive)", color: "var(--destructive-foreground)" }}>
          <Activity className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
        </div>
        <div className="relative h-full flex-1 overflow-hidden">
          <div className="absolute inset-y-0 flex flex-col animate-ticker">
            {items.map((it, i) => (
              <div key={i} className="flex h-9 items-center gap-1.5 whitespace-nowrap text-xs">
                <span className="font-semibold" style={{ color: "var(--primary)" }}>{it.user}</span>
                <span style={{ color: "var(--muted-foreground)" }}>reported</span>
                <span className="font-bold tabular-nums">{it.minutes}m</span>
                <span style={{ color: "var(--muted-foreground)" }}>at</span>
                <span className="font-semibold">{it.venue}</span>
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>· {it.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}