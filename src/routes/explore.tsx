import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor, severityLabel } from "@/lib/mock-data";
import { Clock, Users, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { ReportSheet } from "@/components/ReportSheet";
import { ReportCTA } from "@/components/ReportCTA";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — SkipTheLine" },
      { name: "description", content: "Browse live wait times near you, sorted and ranked." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<"wait" | "distance" | "trending">("trending");
  const [reportOpen, setReportOpen] = useState(false);
  let list = cat === "all" ? venues : venues.filter((v) => v.category === cat);
  list = [...list].sort((a, b) => {
    if (sort === "wait") return a.waitMinutes - b.waitMinutes;
    if (sort === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
    return b.liveReporters - a.liveReporters;
  });

  return (
    <div className="page-enter px-5 pt-6">
      <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
        {list.length} venues live
      </p>
      <h1 className="font-display text-4xl font-semibold leading-none tracking-tight">Explore</h1>

      <div className="mt-5">
        <CategoryChips active={cat} onChange={setCat} />
      </div>

      <div className="mt-3 flex gap-2">
        {(["trending", "wait", "distance"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className="font-grotesk rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize transition-colors"
            style={{
              background: sort === s ? "var(--foreground)" : "transparent",
              color: sort === s ? "var(--background)" : "var(--muted-foreground)",
              border: "1px solid",
              borderColor: sort === s ? "var(--foreground)" : "var(--border)",
            }}
          >
            {s === "wait" ? "Shortest wait" : s === "distance" ? "Closest" : "Trending"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {list.map((v) => {
          const TrendIcon = v.trend === "up" ? ArrowUpRight : v.trend === "down" ? ArrowDownRight : Minus;
          return (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="block overflow-hidden rounded-3xl bg-white"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="relative h-44 w-full">
                <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
                {v.event && (
                  <span className="font-grotesk absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                    🎉 {v.event}
                  </span>
                )}
                <span
                  className="font-grotesk absolute right-3 top-3 inline-flex items-baseline gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                  style={{ background: severityColor(v.severity) }}
                >
                  <span className="text-sm tabular-nums">{v.waitMinutes}m</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-90">{severityLabel(v.severity)}</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[0.18em] opacity-90">
                    {v.categoryLabel} · {v.distance}
                  </p>
                  <h3 className="font-display text-2xl font-semibold leading-tight">{v.name}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                <span className="font-grotesk inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>{v.liveReporters}</span> live now
                </span>
                <span className="font-grotesk inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {v.lastReportMinutes}m ago
                </span>
                <span className="font-grotesk inline-flex items-center gap-1" style={{ color: severityColor(v.severity) }}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  <span className="font-semibold capitalize">{v.trend}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="h-24" />
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-5">
        <div className="pointer-events-auto">
          <ReportCTA onClick={() => setReportOpen(true)} />
        </div>
      </div>
      {reportOpen && <ReportSheet onClose={() => setReportOpen(false)} />}
    </div>
  );
}
