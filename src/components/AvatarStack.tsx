interface AvatarStackProps {
  names: string[];
  max?: number;
  size?: number;
  ring?: string;
  className?: string;
}

const PALETTE = [
  "oklch(0.62 0.16 30)",
  "oklch(0.62 0.14 200)",
  "oklch(0.62 0.14 140)",
  "oklch(0.62 0.16 320)",
  "oklch(0.62 0.14 80)",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function AvatarStack({ names, max = 3, size = 22, ring = "white", className }: AvatarStackProps) {
  const shown = names.slice(0, max);
  const extra = Math.max(0, names.length - shown.length);
  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      <div style={{ display: "inline-flex" }}>
        {shown.map((n, i) => {
          const initial = n.charAt(0).toUpperCase();
          const bg = PALETTE[hash(n) % PALETTE.length];
          return (
            <span
              key={n + i}
              style={{
                width: size,
                height: size,
                marginLeft: i === 0 ? 0 : -size / 3,
                background: bg,
                border: `2px solid ${ring}`,
                borderRadius: 9999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--card)",
                fontFamily: "var(--font-grotesk, Space Grotesk)",
                fontWeight: 700,
                fontSize: Math.round(size * 0.45),
                zIndex: shown.length - i,
              }}
            >
              {initial}
            </span>
          );
        })}
      </div>
      {extra > 0 && (
        <span
          style={{
            marginLeft: 6,
            fontFamily: "var(--font-grotesk, Space Grotesk)",
            fontWeight: 600,
            fontSize: 11,
            color: "currentColor",
            opacity: 0.85,
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
