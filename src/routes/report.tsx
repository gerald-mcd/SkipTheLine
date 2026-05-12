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
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <Check className="h-9 w-9" strokeWidth={2.5} style={{ color: "var(--primary-foreground)" }} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Report submitted</h1>
        <p className="mt-1.5 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          Thanks — your report is now live for everyone nearby.
        </p>
        <div
          className="mt-5 flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{ background: "var(--accent)" }}
        >
          <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>+{points} SkipPoints</span>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold"
          style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        >
          Back to map
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            New report
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Report a wait</h1>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Venue */}
      <button
        className="mt-5 flex w-full items-center gap-3 rounded-xl bg-card p-3.5"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "var(--accent)" }}>
          <MapPin className="h-5 w-5" style={{ color: "var(--primary)" }} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            You're at
          </p>
          <p className="truncate text-sm font-semibold">{venue.name}</p>
        </div>
        <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
      </button>

      {/* Wait selector */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Current wait
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-6xl font-bold tabular-nums tracking-tight" style={{ color: "var(--foreground)" }}>
            {wait}
          </span>
          <span className="text-xl font-medium" style={{ color: "var(--muted-foreground)" }}>min</span>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {waits.map((w) => (
            <button
              key={w}
              onClick={() => setWait(w)}
              className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tabular-nums transition-colors"
              style={{
                background: w === wait ? "var(--primary)" : "var(--card)",
                color: w === wait ? "var(--primary-foreground)" : "var(--foreground)",
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
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Entry type
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className="rounded-xl bg-card p-3 text-center transition-colors"
              style={{
                background: type === t.id ? "var(--accent)" : "var(--card)",
                border: "1px solid",
                borderColor: type === t.id ? "var(--primary)" : "var(--border)",
              }}
            >
              <div className="text-lg">{t.emoji}</div>
              <div className="mt-0.5 text-[11px] font-semibold">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Event tag */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          What's driving this? <span className="font-normal normal-case">(optional)</span>
        </p>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {events.map((e) => (
            <button
              key={e}
              onClick={() => setEvent(e)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: event === e ? "var(--primary)" : "var(--card)",
                color: event === e ? "var(--primary-foreground)" : "var(--muted-foreground)",
                border: "1px solid",
                borderColor: event === e ? "transparent" : "var(--border)",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Reward + submit */}
      <div
        className="mt-6 flex items-center justify-between rounded-xl bg-card p-3.5"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>You'll earn</span>
        </div>
        <span className="text-base font-semibold" style={{ color: "var(--primary)" }}>+{points} pts</span>
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
      >
        <Zap className="h-4 w-4" strokeWidth={2.25} />
        Submit report
      </button>
    </div>
  );
}
