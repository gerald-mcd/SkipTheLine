import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  exploreFeed,
  venuesById,
  severityColor,
  profile,
  type FeedItem,
} from "@/lib/mock-data";
import { ArrowDownRight, Users, Clock, Sparkles, SmilePlus } from "lucide-react";
import { VenueImage } from "@/components/VenueImage";
import { LazyReportSheet as ReportSheet } from "@/components/LazyReportSheet";
import { useVenueSheet } from "@/components/VenueSheet";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — SkipTheLine" },
      { name: "description", content: "Live activity feed: wait drops, nearby reports, and updates from your city." },
    ],
  }),
  component: Explore,
});

type Filter = "all" | "drops" | "reports" | "venues" | "system";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "drops", label: "Wait drops" },
  { id: "reports", label: "Reports" },
  { id: "venues", label: "Venues" },
  { id: "system", label: "You" },
];

function Explore() {
  const [reportOpen, setReportOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  // Per-report reaction tally + which reaction the current user picked.
  // Emojis are open-ended — defaults plus any added via the "+" picker.
  const [reactions, setReactions] = useState<Record<string, { mine?: string; counts: Record<string, number> }>>({});

  const items = useMemo(() => {
    if (filter === "all") return exploreFeed;
    const map: Record<Exclude<Filter, "all">, FeedItem["kind"]> = {
      drops: "drop",
      reports: "report",
      venues: "venue",
      system: "system",
    };
    return exploreFeed.filter((i) => i.kind === map[filter]);
  }, [filter]);

  const react = (id: string, key: string, baseCounts: Record<string, number>) =>
    setReactions((prev) => {
      const cur = prev[id] ?? { mine: undefined, counts: { ...baseCounts } };
      const next = { ...cur, counts: { ...cur.counts } };
      // Remove previous selection
      if (cur.mine) next.counts[cur.mine] = Math.max(0, next.counts[cur.mine] - 1);
      if (cur.mine === key) {
        next.mine = undefined;
      } else {
        next.mine = key;
        next.counts[key] = (next.counts[key] ?? 0) + 1;
      }
      return { ...prev, [id]: next };
    });

  return (
    <div className="px-5 pt-6">
      <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
        Live activity · Miami
      </p>
      <h1 className="font-display text-4xl font-semibold leading-none tracking-tight">Explore</h1>
      <p className="mt-2 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
        What's moving right now — drops, reports, and updates.
      </p>

      <div className="mt-4 -mx-5 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="font-grotesk shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors chip-pop"
                style={{
                  background: active ? "var(--foreground)" : "transparent",
                  color: active ? "var(--background)" : "var(--muted-foreground)",
                  border: "1px solid",
                  borderColor: active ? "var(--foreground)" : "var(--border)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <FeedCard
            key={item.id}
            item={item}
            reactionState={reactions[item.id]}
            onReact={(key, base) => react(item.id, key, base)}
          />
        ))}
      </div>

      <div className="h-24" />
      {reportOpen && <ReportSheet onClose={() => setReportOpen(false)} />}
    </div>
  );
}

function FeedCard({
  item,
  reactionState,
  onReact,
}: {
  item: FeedItem;
  reactionState?: { mine?: string; counts: Record<string, number> };
  onReact: (key: string, base: Record<string, number>) => void;
}) {
  const venue =
    item.kind !== "system" ? venuesById.get(item.venueId) : undefined;
  const { open: openVenueSheet } = useVenueSheet();
  const isFriend =
    item.kind === "report" && profile.friends.some((f) => f.name === item.user);
  const displayName =
    item.kind === "report" ? (isFriend ? item.user : "Someone nearby") : "";

  return (
    <article
      className="overflow-hidden rounded-3xl bg-card animate-fade-in"
      style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <Header item={item} />

      {item.kind === "venue" && venue && (
        <button type="button" onClick={() => openVenueSheet(venue.id)} className="block w-full text-left">
          <div className="relative h-56 w-full">
            <VenueImage src={venue.image} alt={venue.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />
            <span
              className="font-grotesk absolute right-3 top-3 inline-flex items-baseline gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums text-white"
              style={{ background: severityColor(venue.severity) }}
            >
              {venue.waitMinutes}
              <span className="text-[9px] font-semibold">m wait</span>
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.18em] opacity-90">
                {venue.categoryLabel} · {venue.distance}
              </p>
              <h3 className="font-display text-2xl font-semibold leading-tight">{venue.name}</h3>
            </div>
          </div>
        </button>
      )}

      {item.kind === "drop" && venue && (
        <button type="button" onClick={() => openVenueSheet(venue.id)} className="block w-full px-4 pb-3 pt-1 text-left">
          <div
            className="flex items-center gap-3 rounded-2xl p-3"
            style={{
              background: "color-mix(in oklab, var(--wait-short) 14%, transparent)",
              border: "1px solid color-mix(in oklab, var(--wait-short) 30%, transparent)",
            }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--wait-short)", color: "white" }}
            >
              <ArrowDownRight className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold leading-tight">{venue.name} just dropped</p>
              <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                <span className="line-through">{item.from}m</span> → <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>{item.to}m wait</span> · {venue.distance}
              </p>
            </div>
          </div>
        </button>
      )}

      {item.kind === "report" && venue && (
        <button type="button" onClick={() => openVenueSheet(venue.id)} className="block w-full px-4 pb-3 pt-1 text-left">
          <div className="flex items-start gap-3">
            <div
              className="font-grotesk flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: "var(--muted)", color: "var(--foreground)" }}
            >
              {isFriend ? item.initial : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px]">
                <span className="font-semibold">{displayName}</span>
                <span style={{ color: "var(--muted-foreground)" }}> reported </span>
                <span className="font-semibold tabular-nums">{item.minutes}m</span>
                <span style={{ color: "var(--muted-foreground)" }}> at </span>
                <span className="font-semibold">{venue.name}</span>
              </p>
              {item.quote && (
                <p className="mt-1 text-[13px] italic" style={{ color: "var(--muted-foreground)" }}>
                  “{item.quote}”
                </p>
              )}
            </div>
            <span
              className="font-grotesk shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums text-white"
              style={{ background: severityColor(venue.severity) }}
            >
              {item.minutes}m
            </span>
          </div>
        </button>
      )}

      {item.kind === "system" && (
        <div className="px-4 pb-3 pt-1">
          <div
            className="flex items-start gap-3 rounded-2xl p-3"
            style={{
              background: "color-mix(in oklab, var(--primary) 10%, transparent)",
              border: "1px solid color-mix(in oklab, var(--primary) 25%, transparent)",
            }}
          >
            <div className="text-2xl leading-none">{item.emoji}</div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold leading-tight">{item.title}</p>
              <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>{item.body}</p>
            </div>
          </div>
        </div>
      )}

      {item.kind === "report" && (
        <ReactionBar itemId={item.id} reactionState={reactionState} onReact={onReact} />
      )}
    </article>
  );
}

function Header({ item }: { item: FeedItem }) {
  const venue = item.kind !== "system" ? venuesById.get(item.venueId) : undefined;
  const meta =
    item.kind === "venue"
      ? { icon: <Users className="h-3 w-3" />, text: `${venue?.liveReporters ?? 0} live now` }
      : item.kind === "drop"
        ? { icon: <ArrowDownRight className="h-3 w-3" />, text: "Wait drop" }
        : item.kind === "report"
          ? { icon: <Clock className="h-3 w-3" />, text: "Live report" }
          : { icon: <Sparkles className="h-3 w-3" />, text: "For you" };

  return (
    <div className="flex items-center justify-between px-4 pt-3">
      <span className="font-grotesk inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
        {meta.icon}
        {meta.text}
      </span>
      <span className="text-[10px] tabular-nums" style={{ color: "var(--muted-foreground)" }}>{item.ago}</span>
    </div>
  );
}

const DEFAULT_REACTIONS: { emoji: string; label: string }[] = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🔥", label: "Fire" },
];
const EXTRA_EMOJIS = ["😂", "😮", "😢", "🎉", "👏", "💯", "🙌", "✨"];
// Deterministic baseline counts per item id so reactions feel pre-populated.
function baseCountsFor(id: string): Record<string, number> {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return {
    "👍": 2 + (h % 7),
    "❤️": 1 + ((h >> 3) % 5),
    "🔥": (h >> 6) % 9,
  };
}

function ReactionBar({
  itemId,
  reactionState,
  onReact,
}: {
  itemId: string;
  reactionState?: { mine?: string; counts: Record<string, number> };
  onReact: (key: string, base: Record<string, number>) => void;
}) {
  const base = useMemo(() => baseCountsFor(itemId), [itemId]);
  const counts = reactionState?.counts ?? base;
  const mine = reactionState?.mine;
  const [pickerOpen, setPickerOpen] = useState(false);
  // Show defaults plus any extra emojis the user has added on this card.
  const extras = Object.keys(counts).filter(
    (e) => !DEFAULT_REACTIONS.some((d) => d.emoji === e),
  );
  return (
    <div
      className="relative flex flex-wrap items-center gap-1.5 px-3 py-2"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {[...DEFAULT_REACTIONS, ...extras.map((e) => ({ emoji: e, label: e }))].map((r) => {
        const active = mine === r.emoji;
        const count = counts[r.emoji] ?? 0;
        return (
          <button
            key={r.emoji}
            type="button"
            aria-label={r.label}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReact(r.emoji, base);
            }}
            className="font-grotesk inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all btn-pop"
            style={{
              background: active
                ? "color-mix(in oklab, var(--primary) 14%, transparent)"
                : "var(--muted)",
              color: active ? "var(--primary)" : "var(--muted-foreground)",
              border: active
                ? "1px solid color-mix(in oklab, var(--primary) 40%, transparent)"
                : "1px solid transparent",
            }}
          >
            <span aria-hidden className="text-[13px] leading-none">{r.emoji}</span>
            <span className="tabular-nums">{count}</span>
          </button>
        );
      })}
      <button
        type="button"
        aria-label="Add reaction"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPickerOpen((p) => !p);
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full btn-pop"
        style={{
          background: "var(--muted)",
          color: "var(--muted-foreground)",
          border: "1px solid transparent",
        }}
      >
        <SmilePlus className="h-3.5 w-3.5" />
      </button>
      {pickerOpen && (
        <>
          <button
            type="button"
            aria-label="Close reaction picker"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpen(false);
            }}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div
            className="absolute bottom-full right-3 z-40 mb-2 flex max-w-[16rem] flex-wrap gap-1 rounded-2xl bg-card p-2 animate-fade-in"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
          >
            {EXTRA_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                aria-label={`React with ${e}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  onReact(e, base);
                  setPickerOpen(false);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg btn-pop hover:bg-[var(--muted)]"
              >
                {e}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
