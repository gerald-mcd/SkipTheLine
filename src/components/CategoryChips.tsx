import { categories, Category } from "@/lib/mock-data";

export function CategoryChips({
  active,
  onChange,
}: {
  active: Category | "all";
  onChange: (c: Category | "all") => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => {
        const on = c.id === active;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all"
            style={{
              background: on ? "var(--gradient-aurora)" : "oklch(0.21 0.025 260 / 0.7)",
              color: on ? "var(--primary-foreground)" : "var(--foreground)",
              border: "1px solid",
              borderColor: on ? "transparent" : "oklch(1 0 0 / 0.08)",
              boxShadow: on ? "var(--shadow-glow)" : "none",
              backdropFilter: "blur(12px)",
            }}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}