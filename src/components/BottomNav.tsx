import { Link, useLocation } from "@tanstack/react-router";
import { Home, Map, Trophy, Compass } from "lucide-react";

const tabs: { to: string; label: string; icon: typeof Map }[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/discover", label: "Map", icon: Map },
  { to: "/profile", label: "You", icon: Trophy },
];

export function BottomNav() {
  const { pathname } = useLocation();
  if (pathname === "/welcome") return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
      <div
        className="flex items-center justify-around bg-card px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        style={{ borderTop: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const active =
            pathname === t.to ||
            (t.to === "/discover" && pathname.startsWith("/venue"));
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