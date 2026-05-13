import type { ReactElement } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Map, Trophy, Compass } from "lucide-react";
import { TapTimeGlyph } from "./ReportFab";

type Tab = {
  to: string;
  label: string;
  icon?: typeof Map;
  glyph?: (props: { className?: string }) => ReactElement;
};

const tabs: Tab[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/report", label: "Report", glyph: TapTimeGlyph },
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
          const Glyph = t.glyph;
          const active =
            pathname === t.to ||
            (t.to === "/discover" && pathname.startsWith("/venue"));
          const isReport = t.to === "/report";
          if (isReport) {
            return (
              <Link
                key={t.to}
                to={t.to as any}
                aria-label={t.label}
                className="flex flex-1 flex-col items-center gap-0.5"
                style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                <span
                  className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, white))",
                    color: "var(--primary-foreground)",
                    boxShadow: "var(--shadow-glow), var(--shadow-md)",
                    border: "3px solid var(--card)",
                  }}
                >
                  {Glyph ? <Glyph className="h-6 w-6" /> : null}
                </span>
                <span className="text-[10px] font-semibold">{t.label}</span>
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
              {Icon ? (
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              ) : Glyph ? (
                <Glyph className="h-5 w-5" />
              ) : null}
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}