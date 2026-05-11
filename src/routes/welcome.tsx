import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Sparkles } from "lucide-react";
import heroImg from "@/assets/welcome-hero.jpg";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "SkipTheLine — The only app that tells you when to go" },
      {
        name: "description",
        content:
          "SkipTheLine tells you when to go, where you want to go. Live, crowd-powered wait times for restaurants, nightlife, barbers, and more.",
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
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 14%, white) 0%, white 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-40 -z-10 h-[280px] w-[280px] rounded-full opacity-40 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--primary) 45%, transparent)" }}
      />

      <div className="flex min-h-screen flex-col px-6 pb-8 pt-10">
        {/* Brand */}
        <div className="animate-fade-in-up flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-md)" }}
          >
            <MapPin className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">SkipTheLine</span>
        </div>

        {/* Hero */}
        <div
          className="animate-fade-in-up relative mt-10 overflow-hidden rounded-[2rem] bg-white"
          style={{
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            animationDelay: "80ms",
          }}
        >
          <img
            src={heroImg}
            alt="A warm orange map pin marking a place with a short wait"
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover"
          />
          <span
            className="font-grotesk absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold backdrop-blur"
            style={{ color: "var(--primary)", boxShadow: "var(--shadow-sm)" }}
          >
            <Sparkles className="h-3 w-3" />
            Live across your city
          </span>
        </div>

        {/* Copy */}
        <div className="animate-fade-in-up mt-8" style={{ animationDelay: "160ms" }}>
          <h1 className="font-display text-[34px] font-extrabold leading-[1.05] tracking-tight">
            When to go,
            <br />
            <span style={{ color: "var(--primary)" }}>where you want to go.</span>
          </h1>
          <p
            className="font-grotesk mt-4 max-w-[22rem] text-[15px] leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            The only app that tells you the best time to head out — powered by real
            people reporting live wait times around you.
          </p>
        </div>

        {/* Feature row */}
        <div className="animate-fade-in-up mt-6 grid grid-cols-3 gap-2" style={{ animationDelay: "240ms" }}>
          {[
            { icon: Clock, label: "Live waits" },
            { icon: MapPin, label: "Near you" },
            { icon: Sparkles, label: "Crowd-powered" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-3"
              style={{ border: "1px solid var(--border)" }}
            >
              <f.icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
              <span className="font-grotesk text-[11px] font-semibold">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* CTAs */}
        <div className="animate-fade-in-up mt-8 space-y-3" style={{ animationDelay: "320ms" }}>
          <Link
            to="/"
            className="font-display flex h-14 items-center justify-center rounded-2xl text-base font-bold text-white transition-transform active:scale-[0.98]"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Get started
          </Link>
          <Link
            to="/"
            className="font-grotesk flex h-12 items-center justify-center rounded-2xl text-sm font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}