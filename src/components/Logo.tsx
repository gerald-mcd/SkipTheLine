type LogoProps = {
  className?: string;
  title?: string;
};

export function Logo({ className, title = "SkipTheLine" }: LogoProps) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 760 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="stl-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="55%" stopColor="#F0407A" />
          <stop offset="100%" stopColor="#E83E8C" />
        </linearGradient>
      </defs>
      {/* Mark */}
      <circle cx="100" cy="100" r="90" fill="url(#stl-mark)" />
      {/* Double chevron >> */}
      <g fill="#FFFFFF">
        <path d="M62 58 L96 100 L62 142 L82 142 L116 100 L82 58 Z" />
        <path d="M104 58 L138 100 L104 142 L124 142 L158 100 L124 58 Z" />
      </g>
      {/* Wordmark — Plus Jakarta Sans 800 */}
      <text
        x="210"
        y="138"
        fontFamily='"Plus Jakarta Sans", "Inter", system-ui, sans-serif'
        fontWeight={800}
        fontSize="128"
        letterSpacing="-3"
      >
        <tspan fill="#111111">Skip</tspan>
        <tspan fill="#E83E8C">The</tspan>
        <tspan fill="#111111">Line</tspan>
      </text>
    </svg>
  );
}
