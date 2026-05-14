import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  exploreFeed,
  venuesById,
  severityColor,
  type FeedItem,
} from "@/lib/mock-data";
import { ArrowDownRight, ThumbsUp, ThumbsDown, Users, Clock, Sparkles } from "lucide-react";
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
  const [votes, setVotes] = useState<Record<string, "up" | "down" | undefined>>({});

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

  const vote = (id: string, dir: "up" | "down") =>
    setVotes((v) => ({ ...v, [id]: v[id] === dir ? undefined : dir }));

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
          <FeedCard key={item.id} item={item} vote={votes[item.id]} onVote={(d) => vote(item.id, d)} />
        ))}
      </div>

      <div className="h-24" />
      {reportOpen && <ReportSheet onClose={() => setReportOpen(false)} />}
    </div>
  );
}

function FeedCard({
  item,
  vote,
  onVote,
}: {
  item: FeedItem;
  vote?: "up" | "down";
  onVote: (dir: "up" | "down") => void;
}) {
  const venue =
    item.kind !== "system" ? venuesById.get(item.venueId) : undefined;
  const { open: openVenueSheet } = useVenueSheet();

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
              {item.initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px]">
                <span className="font-semibold">{item.user}</span>
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
        </Link>
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

      <VoteBar item={item} vote={vote} onVote={onVote} />
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

function VoteBar({
  item,
  vote,
  onVote,
}: {
  item: FeedItem;
  vote?: "up" | "down";
  onVote: (dir: "up" | "down") => void;
}) {
  const labels =
    item.kind === "report" || item.kind === "drop"
      ? { up: "Still accurate", down: "Not accurate" }
      : { up: "Helpful", down: "Not for me" };

  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote("up");
        }}
        className="font-grotesk inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors btn-pop"
        style={{
          background: vote === "up" ? "color-mix(in oklab, var(--wait-short) 18%, transparent)" : "transparent",
          color: vote === "up" ? "var(--wait-short)" : "var(--muted-foreground)",
        }}
      >
        <ThumbsUp className="h-3.5 w-3.5" fill={vote === "up" ? "currentColor" : "none"} />
        {labels.up}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote("down");
        }}
        className="font-grotesk inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors btn-pop"
        style={{
          background: vote === "down" ? "color-mix(in oklab, var(--wait-long) 18%, transparent)" : "transparent",
          color: vote === "down" ? "var(--wait-long)" : "var(--muted-foreground)",
        }}
      >
        <ThumbsDown className="h-3.5 w-3.5" fill={vote === "down" ? "currentColor" : "none"} />
        {labels.down}
      </button>
    </div>
  );
}
