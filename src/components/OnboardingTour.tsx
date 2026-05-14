import { useEffect, useState } from "react";
import { X, MapPin, Map as MapIcon, Trophy } from "lucide-react";
import { PeopleSkipGlyph } from "./ReportFab";

const KEY = "stl:tour-seen";

type Step = {
  title: string;
  body: string;
  icon: React.ReactNode;
  /** Approximate horizontal anchor (fraction across max-w-md) for the arrow */
  anchorX?: number;
  /** Whether the callout points down to the bottom nav (true) or sits centered */
  pointToNav?: boolean;
};

const steps: Step[] = [
  {
    title: "Welcome to SkipTheLine",
    body: "Live, crowd-powered wait times for restaurants, clubs, barbers, and more. Tap any venue to see the full story.",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "See the city at a glance",
    body: "Open the Map to spot short lines near you in real time.",
    icon: <MapIcon className="h-5 w-5" />,
    anchorX: 0.3,
    pointToNav: true,
  },
  {
    title: "Drop a wait, earn points",
    body: "Tap the center button to report a line in seconds — climb the ranks every time you contribute.",
    icon: <PeopleSkipGlyph className="h-5 w-5" />,
    anchorX: 0.5,
    pointToNav: true,
  },
  {
    title: "Track your rank & badges",
    body: "Your profile keeps score of every report and unlocks badges as you level up.",
    icon: <Trophy className="h-5 w-5" />,
    anchorX: 0.9,
    pointToNav: true,
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!window.localStorage.getItem(KEY)) {
        const t = window.setTimeout(() => setOpen(true), 600);
        return () => window.clearTimeout(t);
      }
    } catch {}
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  if (!open) return null;
  const step = steps[i];
  const isLast = i === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="App tour">
      {/* Dim layer */}
      <button aria-label="Skip tour" onClick={dismiss} className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Callout card — sits above the bottom nav */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-md justify-center px-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}>
        <div
          key={i}
          className="animate-fade-in-up pointer-events-auto relative w-full rounded-3xl p-5"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {/* Arrow pointing down to the corresponding nav item */}
          {step.pointToNav && step.anchorX != null && (
            <span
              aria-hidden
              className="absolute -bottom-2 h-4 w-4 rotate-45"
              style={{
                left: `calc(${step.anchorX * 100}% - 0.5rem)`,
                background: "var(--card)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            />
          )}

          <div className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, white))",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {step.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
                Step {i + 1} of {steps.length}
              </p>
              <h3 className="font-display mt-0.5 text-lg font-bold tracking-tight">{step.title}</h3>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Skip tour"
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-snug" style={{ color: "var(--muted-foreground)" }}>
            {step.body}
          </p>

          {/* Progress dots */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {steps.map((_, n) => (
              <span
                key={n}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 18 : 6,
                  background: n === i ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
              style={{ background: "var(--secondary)", color: "var(--foreground)" }}
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => (isLast ? dismiss() : setI((n) => n + 1))}
              className="flex-[2] rounded-xl py-2.5 text-sm font-bold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-glow)" }}
            >
              {isLast ? "Got it — let's go" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}