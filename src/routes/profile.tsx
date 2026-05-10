import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/lib/mock-data";
import { Flame, Trophy, MapPin, Sparkles, Crown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your SkipPoints — SkipTheLine" },
      { name: "description", content: "Your points, streak, badges and city rank." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const goalPoints = 5000;
  const progress = Math.min(100, (profile.points / goalPoints) * 100);

  return (
    <div className="px-4 pt-6">
      {/* Hero card */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{ background: "var(--gradient-aurora)", boxShadow: "var(--shadow-glow)" }}
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-30" style={{ background: "white" }} />
        <div className="absolute -bottom-12 -left-6 h-36 w-36 rounded-full opacity-20" style={{ background: "var(--accent)" }} />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black" style={{ background: "oklch(0.14 0.03 260)", color: "var(--primary)" }}>
                {profile.name[0]}
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: "var(--primary-foreground)" }}>{profile.name}</p>
                <p className="text-[11px]" style={{ color: "oklch(0.14 0.03 260 / 0.7)" }}>
                  <MapPin className="mr-0.5 inline h-3 w-3" />
                  {profile.neighborhood}, {profile.city}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: "oklch(0.14 0.03 260)", color: "var(--primary)" }}>
            ⚡ Pro
          </div>
        </div>

        <div className="relative mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "oklch(0.14 0.03 260 / 0.65)" }}>
            SkipPoints
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black tabular-nums" style={{ color: "oklch(0.14 0.03 260)" }}>
              {profile.points.toLocaleString()}
            </span>
            <span className="text-sm font-bold" style={{ color: "oklch(0.14 0.03 260 / 0.7)" }}>
              / {goalPoints.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "oklch(0.14 0.03 260 / 0.25)" }}>
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "oklch(0.14 0.03 260)" }} />
          </div>
          <p className="mt-1.5 text-[11px] font-semibold" style={{ color: "oklch(0.14 0.03 260 / 0.75)" }}>
            {goalPoints - profile.points} pts to <strong>Skip Legend</strong>
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat icon={<Flame className="h-4 w-4" style={{ color: "var(--warning)" }} />} value={`${profile.streak}d`} label="Streak" />
        <Stat icon={<Trophy className="h-4 w-4" style={{ color: "var(--primary)" }} />} value={`#${profile.rank}`} label={`${profile.neighborhood}`} />
        <Stat icon={<Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} />} value={`${profile.reportsThisWeek}`} label="This week" />
      </div>

      {/* Badges */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Badges</h2>
          <button className="flex items-center text-xs font-semibold" style={{ color: "var(--primary)" }}>
            All <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className="flex flex-col items-center rounded-2xl p-3"
              style={{
                background: b.earned ? "var(--surface)" : "oklch(0.18 0.02 260 / 0.4)",
                border: "1px solid",
                borderColor: b.earned ? "var(--border)" : "oklch(1 0 0 / 0.04)",
                opacity: b.earned ? 1 : 0.5,
              }}
            >
              <span className={"text-3xl " + (b.earned ? "" : "grayscale")}>{b.emoji}</span>
              <span className="mt-1 text-[11px] font-bold">{b.name}</span>
              {!b.earned && <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>Locked</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">{profile.neighborhood} leaderboard</h2>
          <span className="text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>This week</span>
        </div>
        <div className="overflow-hidden rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {profile.leaderboard.map((u, i) => (
            <div
              key={u.rank}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: u.you ? "oklch(0.85 0.19 165 / 0.1)" : "transparent",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black tabular-nums"
                style={{
                  background: u.rank <= 3 ? "var(--gradient-aurora)" : "var(--surface-elevated)",
                  color: u.rank <= 3 ? "var(--primary-foreground)" : "var(--foreground)",
                }}
              >
                {u.rank <= 3 ? <Crown className="h-3.5 w-3.5" /> : u.rank}
              </div>
              <span className="flex-1 text-sm font-semibold" style={{ color: u.you ? "var(--primary)" : "var(--foreground)" }}>
                {u.name} {u.you && <span className="ml-1 text-[10px] uppercase tracking-wider">you</span>}
              </span>
              <span className="text-sm font-black tabular-nums" style={{ color: u.you ? "var(--primary)" : "var(--muted-foreground)" }}>
                {u.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xl font-black">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
    </div>
  );
}
