import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { venues } from "@/lib/mock-data";
import { MapPin, Check, Sparkles, Zap, ChevronRight, X, Search } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report wait time — SkipTheLine" },
      { name: "description", content: "Drop a wait time. Earn SkipPoints." },
    ],
  }),
  component: Report,
});

const PRESETS = [0, 5, 15, 30, 45, 60];
const POINTS = 15;
const NOTE_MAX = 140;

function Report() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState(venues[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [minutes, setMinutes] = useState(15);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? venues.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.categoryLabel.toLowerCase().includes(q) ||
            v.address.toLowerCase().includes(q),
        )
      : venues;
    return list.slice(0, 8);
  }, [query]);

  if (submitted) {
    // Confirmation mirrors exactly what was submitted in the form / ReportSheet.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <Check className="h-9 w-9" strokeWidth={2.5} style={{ color: "var(--primary-foreground)" }} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Report submitted</h1>
        <p className="mt-1.5 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          Live for everyone nearby right now.
        </p>

        <div
          className="mt-5 w-full max-w-xs space-y-2 rounded-2xl bg-card p-4"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--muted-foreground)" }}>Venue</span>
            <span className="font-semibold">{picked.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--muted-foreground)" }}>Wait</span>
            <span className="font-semibold tabular-nums">
              {minutes === 0 ? "No wait" : `${minutes} min`}
            </span>
          </div>
          {note.trim() && (
            <div className="flex items-start justify-between gap-3 text-xs">
              <span style={{ color: "var(--muted-foreground)" }}>Note</span>
              <span className="text-right font-medium">{note.trim()}</span>
            </div>
          )}
        </div>

        <div
          className="mt-4 flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{ background: "var(--accent)" }}
        >
          <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            +{POINTS} SkipPoints
          </span>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold"
          style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        >
          Back home
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            New report
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight">Report a wait</h1>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Venue picker trigger */}
      <button
        type="button"
        onClick={() => setPickerOpen((v) => !v)}
        className="mt-5 flex w-full items-center gap-3 rounded-xl bg-card p-3.5"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "var(--accent)" }}>
          <MapPin className="h-5 w-5" style={{ color: "var(--primary)" }} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            You're at
          </p>
          <p className="truncate text-sm font-semibold">{picked.name}</p>
        </div>
        <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
      </button>

      {pickerOpen && (
        <div className="mt-2 rounded-2xl bg-card p-2" style={{ border: "1px solid var(--border)" }}>
          <div
            className="flex items-center gap-2 rounded-full bg-card px-3 py-2"
            style={{ border: "1px solid var(--border)" }}
          >
            <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search venues near you"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          <div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
            {results.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setPicked(v);
                  setMinutes(v.waitMinutes);
                  setPickerOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[var(--accent)]"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "var(--accent)" }}
                >
                  <MapPin className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{v.name}</p>
                  <p className="truncate text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    {v.categoryLabel} · {v.distance}
                  </p>
                </div>
                <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--muted-foreground)" }}>
                  ~{v.waitMinutes}m
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wait minutes */}
      <div
        className="mt-5 rounded-2xl p-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          How long is the wait?
        </p>
        <div className="mt-3 flex items-baseline justify-center gap-1.5">
          <span
            className="font-display text-6xl font-bold tabular-nums tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            {minutes}
          </span>
          <span className="text-base font-medium" style={{ color: "var(--muted-foreground)" }}>
            min
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {PRESETS.map((p) => {
            const on = p === minutes;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setMinutes(p)}
                className="rounded-xl py-2 text-xs font-semibold transition-colors"
                style={{
                  background: on ? "var(--primary)" : "var(--card)",
                  color: on ? "var(--primary-foreground)" : "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {p === 0 ? "No wait" : `${p}m`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional note */}
      <label className="mt-4 block">
        <span
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "var(--muted-foreground)" }}
        >
          Add a note <span className="lowercase">(optional)</span>
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
          placeholder="e.g. bar seating moves faster"
          rows={2}
          maxLength={NOTE_MAX}
          className="mt-1.5 w-full resize-none rounded-xl bg-card p-3 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          style={{ border: "1px solid var(--border)" }}
        />
        <p className="mt-1 text-right text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {note.length}/{NOTE_MAX}
        </p>
      </label>

      {/* Reward summary */}
      <div
        className="mt-2 flex items-center justify-between rounded-xl bg-card p-3"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            You'll earn
          </span>
        </div>
        <span className="text-base font-bold tabular-nums" style={{ color: "var(--primary)" }}>
          +{POINTS} pts
        </span>
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <Zap className="h-4 w-4" strokeWidth={2.25} />
        Submit report · +{POINTS} pts
      </button>
    </div>
  );
}
