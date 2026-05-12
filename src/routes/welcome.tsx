import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { venues, liveFeed } from "@/lib/mock-data";
import { RollingNumber } from "@/components/RollingNumber";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "SkipTheLine — When to go, where you want to go" },
      {
        name: "description",
        content:
          "Live, crowd-powered wait times for restaurants, nightlife, and more — SkipTheLine tells you when to go, where you want to go.",
      },
    ],
  }),
  component: Welcome,
});

const featured = venues.find((v) => v.id === "v1")!; // Komodo

function Welcome() {
  // Ticking wait time + live reporter count for ambient liveness
  const [wait, setWait] = useState(featured.waitMinutes);
  const [reporters, setReporters] = useState(featured.liveReporters);
  const [pulseTick, setPulseTick] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 22 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setWait((w) => Math.max(28, Math.min(58, w + (Math.random() > 0.5 ? 1 : -1))));
      setReporters((r) => Math.max(3, Math.min(12, r + (Math.random() > 0.5 ? 1 : -1))));
      setPulseTick((n) => n + 1);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  function handleMove(e: React.MouseEvent) {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  // Live ticker — duplicate the feed for seamless loop
  const ticker = [...liveFeed, ...liveFeed];

  // Mini live-pulse spark bars
  const bars = Array.from({ length: 14 });

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMove}
      className="font-grotesk relative min-h-screen w-full overflow-hidden"
      style={{ background: "color-mix(in oklab, var(--primary) 5%, white)" }}
    >
      {/* Ambient atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Cursor-following spotlight */}
        <div
          className="absolute inset-0 transition-[background] duration-300"
          style={{
            background: `radial-gradient(420px circle at ${spotlight.x}% ${spotlight.y}%, color-mix(in oklab, var(--primary-glow) 22%, transparent), transparent 60%)`,
          }}
        />
        <div
          className="animate-drift absolute -left-32 top-[-120px] h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--primary) 32%, transparent)", opacity: 0.55 }}
        />
        <div
          className="animate-drift absolute -right-24 top-[40%] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: "color-mix(in oklab, var(--primary-glow) 38%, transparent)",
            opacity: 0.5,
            animationDelay: "3s",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--primary) 40%, transparent) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(circle at 50% 30%, black 30%, transparent 75%)",
          }}
        />
      </div>

      {/* Top brand strip */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-7">
        <div className="animate-fade-in-up flex items-center gap-2">
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span
              className="animate-ping-soft absolute inset-0 rounded-2xl"
              style={{ background: "var(--primary)", opacity: 0.3 }}
            />
          </span>
          <span className="font-display text-[17px] font-extrabold tracking-tight">SkipTheLine</span>
        </div>
        <Link
          to="/"
          className="press-depth text-[13px] font-semibold"
          style={{ color: "var(--muted-foreground)" }}
        >
          Skip →
        </Link>
      </div>

      {/* Live status pill — with mini equalizer spark */}
      <div className="relative z-10 mt-6 flex justify-center px-6">
        <div
          className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
          style={{
            background: "white",
            border: "1px solid color-mix(in oklab, var(--primary) 18%, var(--border))",
            boxShadow: "var(--shadow-sm)",
            animationDelay: "60ms",
          }}
        >
          <span className="flex items-end gap-[2px]" aria-hidden>
            {bars.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className="block w-[2px] origin-bottom rounded-full"
                style={{
                  height: "10px",
                  background: "var(--wait-short)",
                  animation: `spark-bar ${0.7 + (i % 3) * 0.18}s ease-in-out ${i * 0.08}s infinite`,
                }}
              />
            ))}
          </span>
          <span className="text-[11px] font-bold tracking-tight">
            <span style={{ color: "var(--foreground)" }} className="tabular-nums">
              <RollingNumber value={2418 + (pulseTick % 12)} minDigits={4} />
            </span>{" "}
            <span style={{ color: "var(--foreground)" }}>people</span>{" "}
            <span style={{ color: "var(--muted-foreground)" }}>reporting around you</span>
          </span>
        </div>
      </div>

      {/* Headline — asymmetric, mixed weights, with shimmering accent */}
      <div className="relative z-10 mt-7 px-6">
        <h1 className="font-display text-[44px] font-extrabold leading-[0.98] tracking-tight">
          <span className="animate-fade-in-up block" style={{ animationDelay: "120ms" }}>
            When to go.
          </span>
          <span
            className="animate-fade-in-up block italic"
            style={{
              animationDelay: "220ms",
              backgroundImage:
                "linear-gradient(90deg, var(--primary) 0%, var(--primary-glow) 40%, var(--primary) 80%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation:
                "fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) 220ms both, shimmer-text 6s linear infinite",
            }}
          >
            Where you want
          </span>
          <span className="animate-fade-in-up block" style={{ animationDelay: "320ms" }}>
            to go.
          </span>
        </h1>
        <p
          className="animate-fade-in-up mt-3 max-w-[340px] text-[13px] leading-snug"
          style={{ color: "var(--muted-foreground)", animationDelay: "420ms" }}
        >
          Crowd-powered wait times, updated by humans on the ground — right now,
          a few blocks from you.
        </p>
      </div>

      {/* Live preview composition */}
      <div className="relative z-10 mx-6 mt-7 h-[260px]">
        {/* Floating venue card — tilted */}
        <div
          className="animate-fade-in-up tilt-hover absolute left-0 top-0 w-[78%] origin-bottom-left overflow-hidden rounded-3xl bg-white"
          style={{
            transform: "rotate(-3deg)",
            ["--tilt-hover" as string]: "-1.5deg",
            border: "1px solid var(--border)",
            boxShadow:
              "0 28px 60px -20px color-mix(in oklab, var(--primary) 30%, transparent), 0 4px 12px color-mix(in oklab, var(--foreground) 8%, transparent)",
            animationDelay: "520ms",
          }}
        >
          <div className="relative h-[140px]">
            <img
              src={featured.image}
              alt={featured.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, color-mix(in oklab, black 70%, transparent) 100%)",
              }}
            />
            <span
              className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold backdrop-blur"
              style={{ color: "var(--primary)" }}
            >
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: "var(--primary)" }}
              />
              LIVE
            </span>
            <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
              <div>
                <div className="font-display text-[15px] font-bold leading-tight">
                  {featured.name}
                </div>
                <div className="text-[10px] opacity-85">
                  {featured.vibe} · {featured.distance}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div
                className="text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                Wait now
              </div>
              <div className="flex items-baseline gap-1">
                <RollingNumber
                  value={wait}
                  minDigits={2}
                  className="font-display text-[26px] font-extrabold leading-none tabular-nums"
                  digitClassName=""
                />
                <span className="text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
                  min
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex -space-x-1.5">
                {["S", "M", "D"].map((c, i) => (
                  <span
                    key={i}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{
                      background: ["oklch(0.62 0.16 30)", "oklch(0.62 0.14 200)", "oklch(0.62 0.14 140)"][i],
                      border: "1.5px solid white",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <span
                className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold tabular-nums"
                style={{ color: "var(--muted-foreground)" }}
              >
                <RollingNumber value={reporters} /> reporting now
              </span>
            </div>
          </div>
        </div>

        {/* Mini map chip — tilted opposite */}
        <div
          className="animate-fade-in-up tilt-hover absolute right-0 top-[110px] w-[58%] origin-top-right overflow-hidden rounded-3xl"
          style={{
            transform: "rotate(4deg)",
            ["--tilt-hover" as string]: "2deg",
            border: "1px solid var(--border)",
            background: "white",
            boxShadow:
              "0 24px 50px -16px color-mix(in oklab, var(--primary) 24%, transparent), 0 2px 8px color-mix(in oklab, var(--foreground) 6%, transparent)",
            animationDelay: "660ms",
          }}
        >
          <div
            className="relative h-[150px]"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 8%, white), color-mix(in oklab, var(--primary-glow) 14%, white))",
            }}
          >
            {/* Faux map grid */}
            <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 200 150">
              <path
                d="M0,40 Q60,30 120,55 T220,50"
                stroke="color-mix(in oklab, var(--primary) 40%, transparent)"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M-10,90 Q70,80 130,110 T230,100"
                stroke="color-mix(in oklab, var(--primary) 30%, transparent)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="3 3"
              />
              <path
                d="M40,0 L60,150"
                stroke="color-mix(in oklab, var(--primary) 22%, transparent)"
                strokeWidth="0.8"
              />
              <path
                d="M140,0 L160,150"
                stroke="color-mix(in oklab, var(--primary) 22%, transparent)"
                strokeWidth="0.8"
              />
              {/* Animated route from "you" to nearest pin */}
              <path
                d="M100,120 Q70,90 44,42"
                stroke="var(--primary)"
                strokeWidth="1.6"
                fill="none"
                strokeDasharray="4 6"
                strokeLinecap="round"
                style={{ animation: "route-flow 2.4s linear infinite" }}
              />
            </svg>

            {/* Wait-time pin badges */}
            {[
              { left: "22%", top: "28%", min: 8, color: "var(--wait-short)" },
              { left: "58%", top: "20%", min: 42, color: "var(--wait-long)" },
              { left: "38%", top: "62%", min: 15, color: "var(--wait-moderate)" },
              { left: "76%", top: "58%", min: 25, color: "var(--wait-moderate)" },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: p.left, top: p.top }}
              >
                <div className="relative">
                  <span
                    className="animate-ping-soft absolute inset-0 rounded-full"
                    style={{ background: p.color, opacity: 0.35, animationDelay: `${i * 0.4}s` }}
                  />
                  <span
                    className="relative inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[9px] font-extrabold text-white tabular-nums"
                    style={{ background: p.color, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
                  >
                    {p.min}m
                  </span>
                </div>
              </div>
            ))}

            {/* "You" dot */}
            <div className="absolute left-[50%] top-[80%] -translate-x-1/2 -translate-y-1/2">
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping-soft absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "oklch(0.55 0.18 250)" }}
                />
                <span
                  className="relative inline-flex h-3 w-3 rounded-full"
                  style={{ background: "oklch(0.55 0.18 250)", border: "2px solid white" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth section — feels like a continuation, not a card-in-a-card */}
      <div
        className="animate-fade-in-up relative z-10 mt-8 px-6 pb-10"
        style={{ animationDelay: "880ms" }}
      >
        <form
          className="space-y-2.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl bg-white px-5 py-4 text-[15px] outline-none transition-all placeholder:text-neutral-400"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow =
                "0 0 0 4px color-mix(in oklab, var(--primary) 16%, transparent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          />
          <Link
            to="/"
            className="press-depth font-display animate-gradient flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold text-white"
            style={{
              background:
                "linear-gradient(120deg, var(--primary) 0%, var(--primary-glow) 50%, var(--primary) 100%)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <span>Get started — it's free</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            or
          </span>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="press-depth flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold"
            style={{ border: "1px solid var(--border)" }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="press-depth flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white"
            style={{ background: "var(--foreground)" }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.96.95-2.13 1.72-3.32 1.72-1.19 0-1.61-.72-3.08-.72-1.47 0-1.94.7-3.04.72-1.11.02-2.31-.83-3.29-1.78-2-1.92-3.04-5.32-2.06-7.85 1-2.51 3.51-4.04 5.76-4.04 1.16 0 2.14.39 3 .39.86 0 2.1-.51 3.44-.51 1.41 0 2.67.5 3.51 1.48-2.61 1.45-2.19 5.38.45 6.51-.55 1.57-1.47 3.08-2.47 4.08zM12.03 7.25c-.02-2.23 1.84-4.13 4.04-4.25.13 2.19-1.92 4.2-4.04 4.25z" />
            </svg>
            Apple
          </button>
        </div>

        <p
          className="mt-5 text-center text-[12px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          By continuing you agree to the{" "}
          <span style={{ color: "var(--foreground)" }}>Terms</span> &{" "}
          <span style={{ color: "var(--foreground)" }}>Privacy</span>.
        </p>
      </div>
    </div>
  );
}
