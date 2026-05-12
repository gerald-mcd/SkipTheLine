import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import heroImage from "@/assets/welcome-hero.jpg";

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

function Welcome() {
  return (
    <div
      className="font-grotesk relative min-h-screen w-full overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Full-bleed abstract city-at-dusk backdrop — category-neutral */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, black 55%, transparent) 0%, color-mix(in oklab, black 40%, transparent) 38%, color-mix(in oklab, black 85%, transparent) 100%)",
          }}
        />
      </div>

      {/* Content over photo */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 pb-10 pt-8">
        {/* Brand */}
        <div className="animate-fade-in-up flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <MapPin className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-display text-[16px] font-extrabold tracking-tight text-white">
            SkipTheLine
          </span>
        </div>

        {/* Headline + auth — pushed to bottom */}
        <div className="mt-auto">
          <h1
            className="font-display animate-fade-in-up text-[44px] font-extrabold leading-[0.95] tracking-tight text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}
          >
            Know the wait
            <br />
            <span style={{ color: "var(--primary-glow)" }}>before you go.</span>
          </h1>
          <p
            className="animate-fade-in-up mt-4 max-w-[320px] text-[14px] font-medium text-white/85"
            style={{ animationDelay: "120ms" }}
          >
            Live, crowd-powered wait times for restaurants, clubs, barbers, landmarks — anywhere you'd rather not stand in line.
          </p>

          {/* Auth — flush with content, same width and rhythm */}
          <div
            className="animate-fade-in-up mt-8 flex flex-col gap-2.5"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              to="/"
              className="press-depth font-display flex h-12 w-full items-center justify-center rounded-2xl text-[15px] font-bold text-white"
              style={{
                background: "var(--primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Continue with email
            </Link>
            <button
              type="button"
              className="press-depth flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold text-white backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#fff" opacity=".85" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              className="press-depth flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold text-white backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.96.95-2.13 1.72-3.32 1.72-1.19 0-1.61-.72-3.08-.72-1.47 0-1.94.7-3.04.72-1.11.02-2.31-.83-3.29-1.78-2-1.92-3.04-5.32-2.06-7.85 1-2.51 3.51-4.04 5.76-4.04 1.16 0 2.14.39 3 .39.86 0 2.1-.51 3.44-.51 1.41 0 2.67.5 3.51 1.48-2.61 1.45-2.19 5.38.45 6.51-.55 1.57-1.47 3.08-2.47 4.08zM12.03 7.25c-.02-2.23 1.84-4.13 4.04-4.25.13 2.19-1.92 4.2-4.04 4.25z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <p
            className="animate-fade-in-up mt-5 text-center text-[11px] text-white/65"
            style={{ animationDelay: "260ms" }}
          >
            By continuing you agree to the Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
