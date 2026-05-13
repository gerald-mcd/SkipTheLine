import { createFileRoute, Link } from "@tanstack/react-router";
import { GLYPH_CATALOG } from "@/components/ReportFab";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/glyphs")({
  head: () => ({
    meta: [{ title: "Glyph options — SkipTheLine" }],
  }),
  component: Glyphs,
});

function Glyphs() {
  return (
    <div className="px-5 pt-6 pb-24">
      <div className="mb-5 flex items-center gap-2">
        <Link
          to="/"
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
          style={{ border: "1px solid var(--border)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            Bottom nav
          </p>
          <h1 className="font-display text-xl font-bold tracking-tight">Glyph options</h1>
        </div>
      </div>

      <p className="mb-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
        Each row shows the glyph in its three real-world contexts: <strong>raised pill (24px)</strong>{" "}
        as it appears in the bottom nav, <strong>20px outline</strong> for chips, and{" "}
        <strong>32px tile</strong> for cards.
      </p>

      <div className="space-y-3">
        {GLYPH_CATALOG.map((g) => {
          const G = g.node;
          return (
            <div
              key={g.key}
              className="flex items-center gap-4 rounded-2xl bg-card p-4"
              style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              {/* Raised pill preview */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, white))",
                  color: "var(--primary-foreground)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <G className="h-6 w-6" />
              </div>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--accent)", color: "var(--primary)" }}
              >
                <G className="h-5 w-5" />
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "var(--secondary)", color: "var(--foreground)" }}
              >
                <G className="h-8 w-8" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{g.label}</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  Option · {g.key}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
