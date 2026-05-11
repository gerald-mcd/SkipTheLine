import { useEffect, useState } from "react";

/**
 * Slot-machine style digit roller. Each digit column slides vertically to its
 * target value, giving numeric changes a tactile, "alive" feel.
 */
interface RollingNumberProps {
  value: number;
  minDigits?: number;
  className?: string;
  digitClassName?: string;
}

export function RollingNumber({
  value,
  minDigits = 1,
  className,
  digitClassName,
}: RollingNumberProps) {
  const str = Math.max(0, Math.floor(value)).toString().padStart(minDigits, "0");
  const digits = str.split("");

  return (
    <span className={className} style={{ display: "inline-flex" }}>
      {digits.map((d, i) => (
        <Digit key={i} digit={parseInt(d, 10)} className={digitClassName} />
      ))}
    </span>
  );
}

function Digit({ digit, className }: { digit: number; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        height: "1em",
        overflow: "hidden",
        lineHeight: 1,
        verticalAlign: "baseline",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          transform: `translateY(-${digit}em)`,
          transition: mounted
            ? "transform 520ms cubic-bezier(0.22,1,0.36,1)"
            : "none",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} style={{ height: "1em", lineHeight: 1 }}>
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}
