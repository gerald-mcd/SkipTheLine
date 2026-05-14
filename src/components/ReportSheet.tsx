import { useMemo, useState } from "react";
import { Search, Sparkles, X, MapPin, ChevronLeft, Zap, Check } from "lucide-react";
import { venues, type Venue } from "@/lib/mock-data";

export type ReportPayload = {
  venueId: string;
  minutes: number;
  entryType: string;
  driver: string;
  note?: string;
  points: number;
};

const NOTE_MAX = 140;

const POINTS = 15;

export function ReportSheet({
  venue,
  onClose,
  onSubmit,
}: {
  venue?: Venue | null;
  onClose: () => void;
  onSubmit?: (payload: ReportPayload) => void;
}) {
  const [picked, setPicked] = useState<Venue | null>(venue ?? null);
  const [query, setQuery] = useState("");
  const [minutes, setMinutes] = useState(venue?.waitMinutes ?? 15);
  const [note, setNote] = useState("");
  const [submittedPayload, setSubmittedPayload] = useState<ReportPayload | null>(null);

  const points = POINTS;
  const presets = [0, 5, 15, 30, 45, 60];

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

  const submit = () => {
    if (!picked) return;
    const m = Math.max(0, Math.min(240, Math.round(minutes)));
    const payload: ReportPayload = {
      venueId: picked.id,
      minutes: m,
      entryType: "walkin",
      driver: "none",
      note: note.trim().slice(0, NOTE_MAX) || undefined,
      points,
    };
    if (onSubmit) onSubmit(payload);
    setSubmittedPayload(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="animate-fade-in absolute inset-0 bg-black/40" />
      <div
        className="animate-slide-up relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {submittedPayload && picked ? (
          <div className="flex flex-col items-center py-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <Check className="h-7 w-7" strokeWidth={2.5} style={{ color: "var(--primary-foreground)" }} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight">Report submitted</h3>
            <p className="mt-1 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
              Live for everyone nearby right now.
            </p>
            <div
              className="mt-4 w-full space-y-2 rounded-2xl bg-card p-4"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--muted-foreground)" }}>Venue</span>
                <span className="font-semibold">{picked.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--muted-foreground)" }}>Wait</span>
                <span className="font-semibold tabular-nums">
                  {submittedPayload.minutes === 0 ? "No wait" : `${submittedPayload.minutes} min`}
                </span>
              </div>
              {submittedPayload.note && (
                <div className="flex items-start justify-between gap-3 text-xs">
                  <span style={{ color: "var(--muted-foreground)" }}>Note</span>
                  <span className="text-right font-medium">{submittedPayload.note}</span>
                </div>
              )}
            </div>
            <div
              className="mt-3 flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background: "var(--accent)" }}
            >
              <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
                +{submittedPayload.points} SkipPoints
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl py-3 text-sm font-semibold"
              style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {venue == null && picked && (
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "var(--secondary)" }}
                aria-label="Change venue"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                {picked ? "Report wait at" : "Where are you?"}
              </p>
              <h3 className="font-display text-lg font-bold tracking-tight">
                {picked ? picked.name : "Pick a venue"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "var(--secondary)" }}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!picked ? (
          <>
            <div
              className="flex items-center gap-2 rounded-full bg-card px-3 py-2.5"
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
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Nearby
            </p>
            <div className="mt-2 space-y-1.5">
              {results.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setPicked(v);
                    setMinutes(v.waitMinutes);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-card p-2.5 text-left"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "var(--accent)" }}
                  >
                    <MapPin className="h-4 w-4" style={{ color: "var(--primary)" }} />
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
              {results.length === 0 && (
                <p className="px-1 py-4 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
                  No venues match "{query}"
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Wait minutes */}
            <div className="rounded-2xl p-4" style={{ background: "var(--surface, #f7f7f8)", border: "1px solid var(--border)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                How long is the wait?
              </p>
              <div className="mt-3 flex items-baseline justify-center gap-1.5">
                <span className="font-display text-6xl font-bold tabular-nums tracking-tight" style={{ color: "var(--primary)" }}>
                  {minutes}
                </span>
                <span className="text-base font-medium" style={{ color: "var(--muted-foreground)" }}>min</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {presets.map((p) => {
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
              {/* Custom time entry */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
                  Or enter exact:
                </span>
                <div
                  className="flex flex-1 items-center gap-1.5 rounded-xl bg-card px-3 py-2"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={240}
                    value={minutes}
                    onChange={(e) => {
                      const n = parseInt(e.target.value || "0", 10);
                      setMinutes(Math.max(0, Math.min(240, isNaN(n) ? 0 : n)));
                    }}
                    className="w-full bg-transparent text-sm font-semibold tabular-nums outline-none"
                  />
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>min</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
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
              <span key={points} className="animate-fade-in text-base font-bold tabular-nums" style={{ color: "var(--primary)" }}>
                +{points} pts
              </span>
            </div>

            <button
              type="button"
              onClick={submit}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
            >
              <Zap className="h-4 w-4" strokeWidth={2.25} />
              Submit report · +{points} pts
            </button>
          </>
        )}
          </>
        )}
      </div>
    </div>
  );
}
