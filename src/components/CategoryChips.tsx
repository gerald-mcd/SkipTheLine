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
            className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style={{
              background: on ? "var(--primary)" : "white",
              color: on ? "var(--primary-foreground)" : "var(--primary)",
              border: "1.5px solid var(--primary)",
              boxShadow: on ? "var(--shadow-sm)" : "none",
            }}
          >
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}