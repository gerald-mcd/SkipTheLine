import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Sparkles, X, MapPin, ChevronLeft, Zap } from "lucide-react";
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
    else
      toast("Report submitted", {
        description: `${m} min wait at ${picked.name} · +${points} pts`,
      });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="animate-fade-in absolute inset-0 bg-black/40" />
      <div
        className="animate-slide-up relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
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
      </div>
    </div>
  );
}
