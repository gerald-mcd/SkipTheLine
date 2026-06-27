import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Clock, Users, Swords, CalendarDays, ShieldCheck, Download, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Premium Pass — SkipTheLine for business owners" },
      {
        name: "description",
        content:
          "Wait intel, foot traffic, competitor pulse, event lift and reporter quality — built from live SkipTheLine signals.",
      },
    ],
  }),
  component: BusinessPreview,
});

const tabs = [
  { icon: Clock, name: "Wait Intel", blurb: "Hour-by-hour wait curves, peak windows, weekend vs. weekday deltas." },
  { icon: Users, name: "Foot Traffic", blurb: "Reporter density, dwell time, walk-by share for your venue." },
  { icon: Swords, name: "Competitor Pulse", blurb: "How your line compares to the 5 closest venues in your category." },
  { icon: CalendarDays, name: "Event Lift", blurb: "What concerts, games and weather did to demand last week." },
  { icon: ShieldCheck, name: "Reporter Quality", blurb: "Confidence-weighted reports, dispute rate, anomaly flags." },
  { icon: Download, name: "CSV Exports", blurb: "Pull every metric into your BI tool. White-glove onboarding." },
];

function BusinessPreview() {
  const navigate = useNavigate();
  return (
    <div className="font-grotesk relative min-h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Soft ambient — same recipe as home */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 9%, var(--background)) 0%, var(--background) 85%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 -z-10 h-[300px] w-[300px] rounded-full opacity-30 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--primary) 40%, transparent)" }}
      />

      {/* Header */}
      <header className="px-5 pt-5">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="btn-pop inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[12px] font-semibold"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", color: "var(--foreground)" }}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>

        <div className="mt-5 flex items-start gap-3">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--gradient-aurora)", boxShadow: "var(--shadow-glow)" }}
            aria-hidden
          >
            <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden fill="none">
              <path d="M32 4 L60 24 L32 60 L4 24 Z" fill="currentColor" opacity="0.96" />
              <path d="M4 24 L60 24 M20 24 L32 60 M44 24 L32 60 M20 24 L32 4 M44 24 L32 4" stroke="rgba(0,0,0,0.22)" strokeWidth="0.9" fill="none" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{
                background: "color-mix(in oklab, var(--primary) 14%, transparent)",
                color: "var(--primary)",
              }}
            >
              Premium · For business owners
            </span>
            <h1 className="font-display mt-1.5 text-[26px] font-extrabold leading-[1.05] tracking-tight">
              Turn your line<br />into your edge.
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-md text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          Live wait intel, foot-traffic patterns, competitor pulse and event lift —
          built from the same crowd signal powering SkipTheLine.{" "}
          <span className="font-semibold" style={{ color: "var(--foreground)" }}>$29–$199/mo.</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toast("Early access — we'll be in touch")}
            className="press-depth font-grotesk inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-white"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Request early access <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toast("Demo deck coming soon")}
            className="press-depth font-grotesk inline-flex items-center rounded-full bg-card px-4 py-2 text-[13px] font-semibold"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", color: "var(--foreground)" }}
          >
            Watch the demo
          </button>
        </div>
      </header>

      {/* Suite preview */}
      <section className="mt-7 px-5 pb-10">
        <div className="mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
          <h2 className="font-display text-base font-bold tracking-tight">What's inside</h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {tabs.map(({ icon: Icon, name, blurb }, i) => (
            <div
              key={name}
              className="card-lift animate-fade-in-up rounded-2xl bg-card p-4"
              style={{
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                animationDelay: `${i * 50}ms`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: "color-mix(in oklab, var(--primary) 12%, transparent)",
                  }}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                </span>
                <p className="font-display text-sm font-bold tracking-tight">{name}</p>
              </div>
              <p className="mt-2 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                {blurb}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          Preview using demo data. Full suite ships with a claimed venue.
        </p>
      </section>
    </div>
  );
}