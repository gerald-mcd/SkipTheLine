import { Link } from "@tanstack/react-router";
import { Venue } from "@/lib/mock-data";

/**
 * Map placeholder. This is the surface where Google Maps SDK will eventually
 * mount. Until then we render a static light-themed street grid that resembles
 * a real map so layout, pin sizing, and overlays can be tuned.
 *
 * When `focusedId` is set, the entire map content pans so the focused pin
 * sits at the center of the viewport, and that pin briefly scales + glows.
 */
export function CityMap({
  venues,
  focusedId,
  onPinClick,
}: {
  venues: Venue[];
  focusedId?: string | null;
  onPinClick?: (id: string) => void;
}) {
  const focused = focusedId ? venues.find((v) => v.id === focusedId) : null;
  // Translate the inner map so the focused pin lands at 50/50.
  const tx = focused ? 50 - focused.x : 0;
  const ty = focused ? 50 - focused.y : 0;

  return (
    <div className="absolute inset-0 overflow-hidden" data-map-root>
      {/* Map base */}
      <div className="absolute inset-0" style={{ background: "oklch(0.965 0.005 245)" }} />
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${tx}%, ${ty}%)`,
          transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >

      {/* Water + parks */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 800">
        <path
          d="M -20 520 C 80 480, 180 560, 280 500 S 420 480, 440 510 L 440 600 L -20 620 Z"
          fill="oklch(0.9 0.04 230)"
        />
        <rect x="40" y="120" width="80" height="60" rx="6" fill="oklch(0.92 0.05 150)" />
        <rect x="260" y="260" width="100" height="70" rx="6" fill="oklch(0.92 0.05 150)" />
        <rect x="80" y="660" width="120" height="80" rx="6" fill="oklch(0.92 0.05 150)" />
      </svg>

      {/* Streets */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 800">
        <g stroke="oklch(1 0 0)" fill="none">
          {/* Major roads (white) */}
          <line x1="0" y1="80" x2="400" y2="76" strokeWidth="3" />
          <line x1="0" y1="400" x2="400" y2="404" strokeWidth="3" />
          <line x1="220" y1="0" x2="222" y2="800" strokeWidth="3" />
        </g>
        <g stroke="oklch(1 0 0)" strokeOpacity="0.85" fill="none">
          <line x1="0" y1="160" x2="400" y2="158" strokeWidth="1.6" />
          <line x1="0" y1="240" x2="400" y2="244" strokeWidth="1.6" />
          <line x1="0" y1="320" x2="400" y2="318" strokeWidth="1.6" />
          <line x1="0" y1="640" x2="400" y2="644" strokeWidth="1.6" />
          <line x1="0" y1="720" x2="400" y2="718" strokeWidth="1.6" />
          <line x1="60" y1="0" x2="62" y2="800" strokeWidth="1.6" />
          <line x1="140" y1="0" x2="138" y2="800" strokeWidth="1.6" />
          <line x1="300" y1="0" x2="298" y2="800" strokeWidth="1.6" />
          <line x1="360" y1="0" x2="362" y2="800" strokeWidth="1.6" />
        </g>
        <g stroke="oklch(0.9 0.06 60)" fill="none" opacity="0.9">
          <path d="M -10 200 Q 200 180, 410 220" strokeWidth="3" />
          <path d="M -10 480 Q 200 450, 410 470" strokeWidth="3" />
        </g>
      </svg>

      {/* User location dot — anchored to the map content so it pans with it */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span
            className="absolute inset-0 -m-3 animate-ping-soft rounded-full"
            style={{ background: "var(--primary)", opacity: 0.25 }}
          />
          <span
            className="relative block h-4 w-4 rounded-full"
            style={{
              background: "var(--primary)",
              boxShadow: "0 0 0 3px white, 0 2px 8px oklch(0.2 0.02 260 / 0.25)",
            }}
          />
        </div>
      </div>

      {/* Venue pins — dark teardrop markers */}
      {venues.map((v) => {
        const isFocused = v.id === focusedId;
        const pinStyle = {
          left: `${v.x}%`,
          top: `${v.y}%`,
          transition: "transform 300ms ease",
          transform: `translate(-50%, -100%) scale(${isFocused ? 1.35 : 1})`,
          zIndex: isFocused ? 20 : 10,
        } as const;
        const inner = (
          <>
            {isFocused && (
              <span
                aria-hidden
                className="absolute left-1/2 top-[14px] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping-soft"
                style={{ background: "var(--primary)", opacity: 0.4 }}
              />
            )}
            <svg
              width="28"
              height="36"
              viewBox="0 0 28 36"
              fill="none"
              style={{
                filter: isFocused
                  ? "drop-shadow(0 6px 14px color-mix(in oklab, var(--primary) 55%, transparent))"
                  : "drop-shadow(0 4px 6px oklch(0.2 0.02 260 / 0.25))",
              }}
            >
              <path
                d="M14 0C6.27 0 0 6.27 0 14c0 9.5 12.2 20.8 13.2 21.7a1.2 1.2 0 0 0 1.6 0C15.8 34.8 28 23.5 28 14 28 6.27 21.73 0 14 0Z"
                fill={isFocused ? "var(--primary)" : "var(--foreground)"}
              />
              <circle cx="14" cy="14" r="4.5" fill="white" />
            </svg>
          </>
        );
        return onPinClick ? (
          <button
            key={v.id}
            type="button"
            onClick={() => onPinClick(v.id)}
            className="absolute z-10 -translate-x-1/2 -translate-y-full animate-float-up"
            style={pinStyle}
            aria-label={v.name}
          >
            {inner}
          </button>
        ) : (
          <Link
            key={v.id}
            to="/venue/$id"
            params={{ id: v.id }}
            className="absolute z-10 -translate-x-1/2 -translate-y-full animate-float-up"
            style={pinStyle}
            aria-label={v.name}
          >
            {inner}
          </Link>
        );
      })}
      </div>
    </div>
  );
}
