import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Clock, Users, Swords, CalendarDays, ShieldCheck, Download, Sparkles } from "lucide-react";
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
    <div className="font-grotesk min-h-screen text-white" style={{ background: "#0b1020" }}>
      {/* Header */}
      <div className="relative overflow-hidden px-5 pb-10 pt-5"
        style={{ background: "linear-gradient(135deg, #0b1020 0%, #1a1f3a 45%, #3a2960 100%)" }}
      >
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.45), transparent 65%)", filter: "blur(10px)" }} />
        <span aria-hidden className="pointer-events-none absolute -left-16 bottom-[-40px] h-56 w-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 65%)", filter: "blur(14px)" }} />

        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-semibold"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>

        <div className="relative mt-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
              <path d="M32 4 L60 24 L32 60 L4 24 Z" fill="#fff" opacity="0.95" />
              <path d="M4 24 L60 24 M20 24 L32 60 M44 24 L32 60 M20 24 L32 4 M44 24 L32 4" stroke="rgba(11,16,32,0.35)" strokeWidth="0.8" fill="none" />
            </svg>
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-85">Premium Pass · For business owners</p>
            <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight">
              Turn your line into your edge.
            </h1>
          </div>
        </div>

        <p className="relative mt-3 max-w-md text-[13px] opacity-90">
          Live wait intel, foot-traffic patterns, competitor pulse and event lift —
          built from the same crowd signal powering SkipTheLine. From $29–$199/mo.
        </p>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toast("Early access — we'll be in touch")}
            className="press-depth rounded-full px-4 py-2 text-[13px] font-bold"
            style={{ background: "#fff", color: "#3a2960" }}
          >
            Request early access
          </button>
          <button
            type="button"
            onClick={() => toast("Demo deck coming soon")}
            className="press-depth rounded-full px-4 py-2 text-[13px] font-semibold"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            Watch the demo
          </button>
        </div>
      </div>

      {/* Suite preview */}
      <div className="px-5 py-7">
        <div className="mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" style={{ color: "#c4b5fd" }} />
          <h2 className="font-display text-base font-bold tracking-tight">What's inside</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tabs.map(({ icon: Icon, name, blurb }) => (
            <div
              key={name}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(167,139,250,0.18)" }}>
                  <Icon className="h-4 w-4" style={{ color: "#c4b5fd" }} />
                </span>
                <p className="font-display text-sm font-bold tracking-tight">{name}</p>
              </div>
              <p className="mt-2 text-[12px] opacity-80">{blurb}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] opacity-60">
          Preview using demo data. Full suite ships with a claimed venue.
        </p>
      </div>
    </div>
  );
}