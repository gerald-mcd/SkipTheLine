import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "SkipTheLine — When to go, where you want to go" },
      {
        name: "description",
        content:
          "SkipTheLine tells you when to go, where you want to go. Live, crowd-powered wait times for restaurants, nightlife, and more.",
      },
      { property: "og:title", content: "SkipTheLine — When to go, where you want to go" },
      {
        property: "og:description",
        content: "Live, crowd-powered wait times for the city around you.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div
      className="font-grotesk relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: "color-mix(in oklab, var(--primary) 4%, white)" }}
    >
      {/* Animated map background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-drift absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 55%)",
          }}
        />
        <div
          className="animate-drift absolute -left-1/4 top-1/3 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{
            background: "color-mix(in oklab, var(--primary-glow) 40%, transparent)",
            animationDelay: "2s",
          }}
        />

        {/* Topographic / route lines */}
        <svg
          className="absolute left-1/2 top-1/4 h-[460px] w-[900px] -translate-x-1/2 opacity-25"
          viewBox="0 0 800 400"
          fill="none"
        >
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M50,300 C150,250 250,350 400,200 S650,50 750,150"
            stroke="url(#routeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 10"
            style={{ animation: "route-flow 2.4s linear infinite" }}
          />
          <path
            d="M-20,180 C120,200 220,80 360,140 S620,260 820,200"
            stroke="var(--primary)"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
          <circle cx="50" cy="300" r="5" fill="var(--primary)" />
          <circle cx="750" cy="150" r="5" fill="var(--primary)" />
        </svg>

        {/* Pulsing pins */}
        <div className="absolute left-[28%] top-[24%]">
          <span className="relative flex h-3 w-3">
            <span
              className="animate-ping-soft absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "var(--primary)" }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{ background: "var(--primary)", boxShadow: "0 0 0 3px white" }}
            />
          </span>
        </div>
        <div className="absolute right-[22%] top-[40%]">
          <span className="relative flex h-3.5 w-3.5">
            <span
              className="animate-ping-soft absolute inline-flex h-full w-full rounded-full opacity-70"
              style={{ background: "var(--primary)", animationDelay: "0.8s" }}
            />
            <span
              className="relative inline-flex h-3.5 w-3.5 rounded-full"
              style={{ background: "var(--primary)", boxShadow: "0 0 0 3px white" }}
            />
          </span>
        </div>
        <div className="absolute left-[18%] bottom-[18%]">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping-soft absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: "var(--primary)", animationDelay: "1.6s" }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--primary)", boxShadow: "0 0 0 3px white" }}
            />
          </span>
        </div>

        {/* Floating sparkles */}
        <div
          className="absolute right-10 top-20 h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "color-mix(in oklab, var(--primary) 60%, transparent)" }}
        />
        <div
          className="absolute bottom-24 left-12 h-2 w-2 animate-pulse rounded-full"
          style={{
            background: "color-mix(in oklab, var(--primary-glow) 70%, transparent)",
            animationDelay: "0.6s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 py-12">
        {/* Brand chip */}
        <div
          className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{
            background: "color-mix(in oklab, var(--primary) 10%, white)",
            border: "1px solid color-mix(in oklab, var(--primary) 20%, transparent)",
          }}
        >
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ background: "var(--primary)" }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--primary)" }}
          >
            Real-time Navigation
          </span>
        </div>

        {/* Headline */}
        <div className="animate-fade-in-up mb-8 text-center" style={{ animationDelay: "80ms" }}>
          <h1 className="font-display text-[40px] font-extrabold leading-[1.02] tracking-tight">
            Skip<span style={{ color: "var(--primary)" }}>TheLine</span>
          </h1>
          <p
            className="mt-3 text-[15px] font-medium leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            When to go,{" "}
            <span className="italic" style={{ color: "var(--primary)" }}>
              where
            </span>{" "}
            you want to go.
          </p>
        </div>

        {/* Auth card */}
        <div
          className="animate-fade-in-up w-full rounded-3xl bg-white p-7"
          style={{
            border: "1px solid color-mix(in oklab, var(--primary) 10%, var(--border))",
            boxShadow:
              "0 32px 64px -12px color-mix(in oklab, var(--primary) 18%, transparent), 0 2px 6px color-mix(in oklab, var(--primary) 8%, transparent)",
            animationDelay: "160ms",
          }}
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label
                className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-2xl px-5 py-4 text-[15px] outline-none transition-all placeholder:text-neutral-300 focus:ring-2"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 4px color-mix(in oklab, var(--primary) 18%, transparent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  className="ml-1 block text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl px-5 py-4 text-[15px] outline-none transition-all placeholder:text-neutral-300"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 4px color-mix(in oklab, var(--primary) 18%, transparent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            <Link
              to="/"
              className="font-display flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold text-white transition-all active:scale-[0.98]"
              style={{
                background: "var(--primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Get started
            </Link>
          </form>

          <div className="relative my-7 flex items-center">
            <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
            <span
              className="mx-4 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--muted-foreground)" }}
            >
              or continue with
            </span>
            <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold transition-all hover:bg-neutral-50 active:scale-95"
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
              className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold transition-all hover:bg-neutral-50 active:scale-95"
              style={{ border: "1px solid var(--border)" }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.96.95-2.13 1.72-3.32 1.72-1.19 0-1.61-.72-3.08-.72-1.47 0-1.94.7-3.04.72-1.11.02-2.31-.83-3.29-1.78-2-1.92-3.04-5.32-2.06-7.85 1-2.51 3.51-4.04 5.76-4.04 1.16 0 2.14.39 3 .39.86 0 2.1-.51 3.44-.51 1.41 0 2.67.5 3.51 1.48-2.61 1.45-2.19 5.38.45 6.51-.55 1.57-1.47 3.08-2.47 4.08zM12.03 7.25c-.02-2.23 1.84-4.13 4.04-4.25.13 2.19-1.92 4.2-4.04 4.25z" />
              </svg>
              Apple
            </button>
          </div>
        </div>

        <p
          className="animate-fade-in-up mt-7 text-center text-sm font-medium"
          style={{ color: "var(--muted-foreground)", animationDelay: "240ms" }}
        >
          New here?{" "}
          <Link to="/" className="font-bold hover:underline" style={{ color: "var(--primary)" }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
