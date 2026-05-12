import { useEffect, useRef, useState } from "react";
import { RollingNumber } from "./RollingNumber";
import { Severity } from "@/lib/mock-data";

interface WaitBadgeProps {
  minutes: number;
  severity?: Severity;
  size?: "sm" | "md" | "lg";
  variant?: "pill" | "chip" | "solid";
  className?: string;
}

/**
 * Wait-time badge with smooth digit transitions and a pulse ring whenever
 * the value changes. Pulse only fires on subsequent updates, not on mount.
 */
export function WaitBadge({
  minutes,
  severity,
  size = "md",
  variant = "solid",
  className = "",
}: WaitBadgeProps) {
  const [pulseKey, setPulseKey] = useState(0);
  const prev = useRef(minutes);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prev.current = minutes;
      return;
    }
    if (minutes !== prev.current) {
      prev.current = minutes;
      setPulseKey((k) => k + 1);
    }
  }, [minutes]);

  const sev: Severity =
    severity ?? (minutes <= 15 ? "short" : minutes <= 45 ? "moderate" : "long");
  const color =
    sev === "short"
      ? "var(--wait-short)"
      : sev === "moderate"
        ? "var(--wait-moderate)"
        : "var(--wait-long)";

  const sz =
    size === "sm"
      ? { pad: "px-2 py-0.5", num: "text-[10px]", unit: "text-[9px]" }
      : size === "lg"
        ? { pad: "px-3 py-1.5", num: "text-base", unit: "text-[11px]" }
        : { pad: "px-2.5 py-1", num: "text-xs", unit: "text-[10px]" };

  const styles =
    variant === "solid"
      ? { background: color, color: "var(--card)", border: "none" }
      : variant === "chip"
        ? {
            background: "var(--card)",
            color,
            border: `1px solid color-mix(in oklab, ${color} 35%, var(--border))`,
          }
        : {
            background: `color-mix(in oklab, ${color} 12%, white)`,
            color,
            border: `1px solid color-mix(in oklab, ${color} 25%, transparent)`,
          };

  return (
    <span
      className={`relative inline-flex items-center gap-0.5 rounded-full font-bold tabular-nums leading-none ${sz.pad} ${className}`}
      style={styles}
    >
      {/* Pulse ring — keyed to remount each change so the animation replays */}
      {pulseKey > 0 && (
        <span
          key={pulseKey}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            animation: "wait-pulse 900ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      )}
      <RollingNumber value={minutes} className={`font-display ${sz.num}`} />
      <span className={`font-semibold ${sz.unit} ml-0.5 opacity-90`}>min</span>
    </span>
  );
}
