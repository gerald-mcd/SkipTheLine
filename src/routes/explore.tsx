import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { venues, Category, severityColor, severityLabel } from "@/lib/mock-data";
import { Clock, Users, Star, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

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
  let list = cat === "all" ? venues : venues.filter((v) => v.category === cat);
  list = [...list].sort((a, b) => {
    if (sort === "wait") return a.waitMinutes - b.waitMinutes;
    if (sort === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
    return b.liveReporters - a.liveReporters;
  });

  return (
    <div className="px-4 pt-6">
      <div className="mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
          {list.length} venues live
        </p>
        <h1 className="text-3xl font-semibold leading-tight">Explore</h1>
      </div>

      <div className="mt-4">
        <CategoryChips active={cat} onChange={setCat} />
      </div>

      <div className="mt-3 flex gap-2">
        {(["trending", "wait", "distance"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className="rounded-full px-3 py-1 text-[11px] font-semibold capitalize transition-colors"
            style={{
              background: sort === s ? "var(--primary)" : "var(--secondary)",
              color: sort === s ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {s === "wait" ? "Shortest wait" : s === "distance" ? "Closest" : "Trending"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {list.map((v) => {
          const TrendIcon = v.trend === "up" ? ArrowUpRight : v.trend === "down" ? ArrowDownRight : Minus;
          return (
            <Link
              key={v.id}
              to="/venue/$id"
              params={{ id: v.id }}
              className="block rounded-xl bg-white p-4 transition-transform active:scale-[0.99]"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                      {v.categoryLabel} · {v.distance}
                    </p>
                    {v.event && (
                      <span className="rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                        Event
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0.5 truncate text-base font-semibold">{v.name}</h3>
                  <div className="mt-2 flex items-center gap-3 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {v.lastReportMinutes}m ago
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      {v.liveReporters} live
                    </span>
                    <span>{v.reportsCount} reports</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="inline-flex items-baseline gap-0.5 rounded-lg px-2.5 py-1"
                    style={{ background: `${severityColor(v.severity)}1a` }}
                  >
                    <span className="text-2xl font-semibold tabular-nums" style={{ color: severityColor(v.severity) }}>
                      {v.waitMinutes}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: severityColor(v.severity) }}>m</span>
                  </div>
                  <p className="mt-1 flex items-center justify-end gap-0.5 text-[10px] font-medium" style={{ color: severityColor(v.severity) }}>
                    <TrendIcon className="h-3 w-3" />
                    {severityLabel(v.severity)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
