import { Link } from "@tanstack/react-router";
import { Venue, severityColor } from "@/lib/mock-data";

/**
 * Map placeholder. This is the surface where Google Maps SDK will eventually
 * mount. Until then we render a static dark-themed street grid that resembles
 * a real map (not a radar) so layout, pin sizing, and overlays can be tuned.
 */
export function CityMap({ venues }: { venues: Venue[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden" data-map-root>
      {/* Map base — dark Google-Maps-style canvas */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.18 0.018 250)" }}
      />

      {/* Water / parks */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 800">
        {/* River */}
        <path
          d="M -20 520 C 80 480, 180 560, 280 500 S 420 480, 440 510 L 440 600 L -20 620 Z"
          fill="oklch(0.22 0.04 235)"
          opacity="0.85"
        />
        {/* Park blocks */}
        <rect x="40" y="120" width="80" height="60" rx="6" fill="oklch(0.24 0.04 160)" opacity="0.5" />
        <rect x="260" y="260" width="100" height="70" rx="6" fill="oklch(0.24 0.04 160)" opacity="0.5" />
        <rect x="80" y="660" width="120" height="80" rx="6" fill="oklch(0.24 0.04 160)" opacity="0.5" />
      </svg>

      {/* Street grid — varied widths, slightly offset for realism */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 800">
        <g stroke="oklch(0.28 0.02 250)" fill="none">
          {/* Horizontal streets */}
          <line x1="0" y1="80" x2="400" y2="76" strokeWidth="1.2" />
          <line x1="0" y1="160" x2="400" y2="158" strokeWidth="1" />
          <line x1="0" y1="240" x2="400" y2="244" strokeWidth="1" />
          <line x1="0" y1="320" x2="400" y2="318" strokeWidth="1" />
          <line x1="0" y1="400" x2="400" y2="404" strokeWidth="1.2" />
          <line x1="0" y1="640" x2="400" y2="644" strokeWidth="1" />
          <line x1="0" y1="720" x2="400" y2="718" strokeWidth="1" />
          {/* Vertical streets */}
          <line x1="60" y1="0" x2="62" y2="800" strokeWidth="1" />
          <line x1="140" y1="0" x2="138" y2="800" strokeWidth="1" />
          <line x1="220" y1="0" x2="222" y2="800" strokeWidth="1.2" />
          <line x1="300" y1="0" x2="298" y2="800" strokeWidth="1" />
          <line x1="360" y1="0" x2="362" y2="800" strokeWidth="1" />
        </g>
        {/* Highway accents */}
        <g stroke="oklch(0.36 0.04 70)" fill="none" opacity="0.55">
          <path d="M -10 200 Q 200 180, 410 220" strokeWidth="2.5" />
          <path d="M -10 480 Q 200 450, 410 470" strokeWidth="2.5" />
        </g>
      </svg>

      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.12 0.02 260 / 0.5) 100%)",
        }}
      />

      {/* User location dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="absolute inset-0 -m-3 animate-ping-soft rounded-full" style={{ background: "var(--primary)", opacity: 0.4 }} />
          <span
            className="relative block h-4 w-4 rounded-full ring-4"
            style={{
              background: "var(--primary)",
              boxShadow: "0 0 0 3px oklch(0.16 0.02 260), 0 0 16px oklch(0.85 0.19 165 / 0.6)",
            }}
          />
        </div>
      </div>

      {/* Venue pins */}
      {venues.map((v) => {
        const c = severityColor(v.severity);
        return (
          <Link
            key={v.id}
            to="/venue/$id"
            params={{ id: v.id }}
            className="absolute z-10 -translate-x-1/2 -translate-y-full animate-float-up"
            style={{ left: `${v.x}%`, top: `${v.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-lg backdrop-blur-md"
                style={{
                  background: "oklch(0.18 0.025 260 / 0.92)",
                  border: `1px solid ${c}`,
                  boxShadow: `0 4px 14px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.04)`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: c, boxShadow: `0 0 8px ${c}` }}
                />
                <span className="text-[11px] font-bold tabular-nums" style={{ color: c }}>
                  {v.waitMinutes}m
                </span>
                <span className="max-w-[110px] truncate text-[11px] font-semibold text-foreground">
                  {v.name}
                </span>
              </div>
              {/* Pin tail */}
              <div
                className="-mt-px h-2 w-2 rotate-45"
                style={{
                  background: "oklch(0.18 0.025 260 / 0.92)",
                  borderRight: `1px solid ${c}`,
                  borderBottom: `1px solid ${c}`,
                }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
