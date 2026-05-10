import { Link, useLocation } from "@tanstack/react-router";
import { Map, List, Plus, Trophy } from "lucide-react";

const tabs: { to: string; label: string; icon: typeof Map; hero?: boolean }[] = [
  { to: "/", label: "Map", icon: Map },
  { to: "/explore", label: "Explore", icon: List },
  { to: "/report", label: "Report", icon: Plus, hero: true },
  { to: "/profile", label: "You", icon: Trophy },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
      <div className="glass-strong mx-3 mb-3 flex items-center justify-around rounded-3xl px-2 py-2 shadow-[var(--shadow-elevated)]">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname === t.to || (t.to === "/explore" && pathname.startsWith("/venue"));
          if (t.hero) {
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--gradient-aurora)", boxShadow: "var(--shadow-glow)" }}
              >
                <span className="absolute inset-0 animate-pulse-ring rounded-full" style={{ background: "var(--gradient-aurora)" }} />
                <Icon className="relative h-7 w-7" style={{ color: "var(--primary-foreground)" }} strokeWidth={2.5} />
              </Link>
            );
          }
          return (
            <Link
              key={t.to}
              to={t.to as any}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors"
              style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}