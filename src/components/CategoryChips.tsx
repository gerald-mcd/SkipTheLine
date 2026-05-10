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
              background: on ? "var(--primary)" : "var(--surface)",
              color: on ? "var(--primary-foreground)" : "var(--foreground)",
              border: "1px solid",
              borderColor: on ? "transparent" : "var(--border)",
              boxShadow: on ? "var(--shadow-sm)" : "none",
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