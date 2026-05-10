import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { venues } from "@/lib/mock-data";
import { MapPin, Check, Sparkles, Zap, ChevronRight, X } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report wait time — SkipTheLine" },
      { name: "description", content: "Drop a wait time. Earn SkipPoints." },
    ],
  }),
  component: Report,
});

const waits = [0, 5, 10, 15, 20, 30, 45, 60, 90];
const types = [
  { id: "walkin", label: "Walk-in", emoji: "🚶" },
  { id: "reservation", label: "Reservation", emoji: "📅" },
  { id: "vip", label: "VIP / Guestlist", emoji: "👑" },
];
const events = ["No event", "Live DJ", "Sports", "Holiday", "Performer", "Other"];

function Report() {
  const navigate = useNavigate();
  const [venueId, setVenueId] = useState(venues[0].id);
  const [wait, setWait] = useState(15);
  const [type, setType] = useState("walkin");
  const [event, setEvent] = useState("No event");
  const [submitted, setSubmitted] = useState(false);

  const venue = venues.find((v) => v.id === venueId)!;
  const points = 10 + (event !== "No event" ? 15 : 0) + (type === "vip" ? 5 : 0);

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" style={{ background: "var(--gradient-aurora)" }} />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: "var(--gradient-aurora)", boxShadow: "var(--shadow-glow)" }}>
            <Check className="h-12 w-12" strokeWidth={3} style={{ color: "var(--primary-foreground)" }} />
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-black">Drop received</h1>
        <p className="mt-2 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          Thanks for keeping the city moving. Your report is now live.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full px-4 py-2" style={{ background: "oklch(0.85 0.19 165 / 0.15)", border: "1px solid var(--primary)" }}>
          <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>+{points} SkipPoints</span>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-8 rounded-2xl px-6 py-3 text-sm font-bold"
          style={{ background: "var(--surface-elevated)", color: "var(--foreground)" }}
        >
          Back to map
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--primary)" }}>
            Drop a wait
          </p>
          <h1 className="text-3xl font-black leading-tight">Report</h1>
        </div>
        <button onClick={() => navigate({ to: "/" })} className="rounded-full p-2" style={{ background: "var(--surface-elevated)" }}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Venue */}
      <button className="mt-5 flex w-full items-center gap-3 rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "oklch(0.85 0.19 165 / 0.15)" }}>
          <MapPin className="h-5 w-5" style={{ color: "var(--primary)" }} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            You're at
          </p>
          <p className="truncate text-sm font-bold">{venue.name}</p>
        </div>
        <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
      </button>

      {/* Wait selector */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Current wait
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-7xl font-black tabular-nums text-glow" style={{ color: "var(--primary)" }}>
            {wait}
          </span>
          <span className="text-2xl font-bold" style={{ color: "var(--muted-foreground)" }}>min</span>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {waits.map((w) => (
            <button
              key={w}
              onClick={() => setWait(w)}
              className="flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold tabular-nums transition-all"
              style={{
                background: w === wait ? "var(--gradient-aurora)" : "var(--surface)",
                color: w === wait ? "var(--primary-foreground)" : "var(--foreground)",
                boxShadow: w === wait ? "var(--shadow-glow)" : "none",
                border: "1px solid",
                borderColor: w === wait ? "transparent" : "var(--border)",
              }}
            >
              {w === 0 ? "0" : w}
            </button>
          ))}
        </div>
      </div>

      {/* Entry type */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Entry type
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className="rounded-2xl p-3 text-center transition-all"
              style={{
                background: type === t.id ? "oklch(0.85 0.19 165 / 0.15)" : "var(--surface)",
                border: "1px solid",
                borderColor: type === t.id ? "var(--primary)" : "var(--border)",
              }}
            >
              <div className="text-xl">{t.emoji}</div>
              <div className="mt-1 text-[11px] font-bold">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Event tag */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          What's driving this? <span className="font-normal normal-case">(optional)</span>
        </p>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {events.map((e) => (
            <button
              key={e}
              onClick={() => setEvent(e)}
              className="shrink-0 rounded-full px-3 py-2 text-xs font-semibold"
              style={{
                background: event === e ? "var(--accent)" : "var(--surface)",
                color: event === e ? "var(--accent-foreground)" : "var(--muted-foreground)",
                border: "1px solid",
                borderColor: event === e ? "transparent" : "var(--border)",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Reward preview + submit */}
      <div className="mt-6 rounded-2xl p-4" style={{ background: "oklch(0.85 0.19 165 / 0.08)", border: "1px solid oklch(0.85 0.19 165 / 0.3)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>You'll earn</span>
          </div>
          <span className="text-2xl font-black" style={{ color: "var(--primary)" }}>+{points}</span>
        </div>
        <p className="mt-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          Streak day 13 · Local rank #47
        </p>
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black"
        style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
      >
        <Zap className="h-5 w-5" strokeWidth={2.5} />
        Drop the wait
      </button>
    </div>
  );
}
