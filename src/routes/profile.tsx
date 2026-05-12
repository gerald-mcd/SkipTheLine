import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/lib/mock-data";
import { Flame, Trophy, MapPin, Sparkles, ChevronRight, Settings, Mail, Phone, UserPlus, Bell, Shield, LogOut, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your account — SkipTheLine" },
      { name: "description", content: "Your activity, points and rank." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const goalPoints = 5000;
  const progress = Math.min(100, (profile.points / goalPoints) * 100);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold"
            style={{ background: "var(--accent)", color: "var(--primary)" }}
          >
            {profile.name[0]}
          </div>
          <div>
            <p className="text-base font-semibold">{profile.name}</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              <MapPin className="mr-0.5 inline h-3 w-3" />
              {profile.neighborhood}, {profile.city}
            </p>
          </div>
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Settings className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
        </button>
      </div>

      {/* Points card */}
      <div
        className="mt-5 rounded-2xl bg-white p-5"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          SkipPoints
        </p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tabular-nums tracking-tight">
            {profile.points.toLocaleString()}
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            / {goalPoints.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--secondary)" }}>
          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--primary)" }} />
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
          {goalPoints - profile.points} pts to next tier
        </p>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat icon={<Flame className="h-4 w-4" style={{ color: "var(--warning)" }} />} value={`${profile.streak}d`} label="Streak" />
        <Stat icon={<Trophy className="h-4 w-4" style={{ color: "var(--primary)" }} />} value={`#${profile.rank}`} label={profile.neighborhood} />
        <Stat icon={<Sparkles className="h-4 w-4" style={{ color: "var(--success)" }} />} value={`${profile.reportsThisWeek}`} label="This week" />
      </div>

      {/* Badges */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Badges</h2>
          <button className="flex items-center text-xs font-medium" style={{ color: "var(--primary)" }}>
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className="flex flex-col items-center rounded-xl bg-white p-3"
              style={{
                border: "1px solid var(--border)",
                opacity: b.earned ? 1 : 0.45,
              }}
            >
              <span className="text-2xl">{b.emoji}</span>
              <span className="mt-1 text-[11px] font-medium">{b.name}</span>
              {!b.earned && (
                <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                  Locked
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{profile.neighborhood} leaderboard</h2>
          <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
            This week
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--border)" }}>
          {profile.leaderboard.map((u, i) => (
            <div
              key={u.rank}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: u.you ? "var(--accent)" : "transparent",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              <span
                className="w-6 text-center text-xs font-semibold tabular-nums"
                style={{ color: u.you ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                {u.rank}
              </span>
              <span className="flex-1 text-sm font-medium" style={{ color: u.you ? "var(--primary)" : "var(--foreground)" }}>
                {u.name}
                {u.you && <span className="ml-1.5 text-[10px] uppercase tracking-wider">you</span>}
              </span>
              <span className="text-sm font-semibold tabular-nums" style={{ color: u.you ? "var(--primary)" : "var(--muted-foreground)" }}>
                {u.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Friends */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Friends</h2>
          <button
            onClick={() => toast("Find friends coming soon")}
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: "var(--primary)" }}
          >
            <UserPlus className="h-3 w-3" /> Add
          </button>
        </div>
        <p className="mb-2 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          Friends' names appear on their reports. Strangers stay anonymous.
        </p>
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--border)" }}>
          {profile.friends.map((f, i) => (
            <div
              key={f.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: "var(--accent)", color: "var(--primary)" }}
              >
                {f.initial}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{f.name}</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{f.handle}</p>
              </div>
              <button className="text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
                Friends
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact info */}
      <section className="mt-7">
        <h2 className="mb-2.5 text-sm font-semibold">Contact</h2>
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--border)" }}>
          <Row icon={<Mail className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Email" value={profile.email} />
          <Row icon={<Phone className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Phone" value={profile.phone} top />
          <Row icon={<CalendarDays className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Joined" value={profile.joined} top />
        </div>
      </section>

      {/* Settings */}
      <section className="mt-7">
        <h2 className="mb-2.5 text-sm font-semibold">Settings</h2>
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--border)" }}>
          <SettingItem icon={<Bell className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Notifications" />
          <SettingItem icon={<Shield className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Privacy" top />
          <SettingItem icon={<Settings className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />} label="Preferences" top />
          <SettingItem icon={<LogOut className="h-4 w-4" style={{ color: "var(--destructive, #c33)" }} />} label="Log out" top destructive />
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
}

function Row({ icon, label, value, top }: { icon: React.ReactNode; label: string; value: string; top?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderTop: top ? "1px solid var(--border)" : "none" }}
    >
      {icon}
      <span className="flex-1 text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SettingItem({ icon, label, top, destructive }: { icon: React.ReactNode; label: string; top?: boolean; destructive?: boolean }) {
  return (
    <button
      onClick={() => toast(`${label} coming soon`)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
      style={{ borderTop: top ? "1px solid var(--border)" : "none" }}
    >
      {icon}
      <span className="flex-1 text-sm font-medium" style={{ color: destructive ? "var(--destructive, #c33)" : "var(--foreground)" }}>
        {label}
      </span>
      <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
    </button>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-lg font-semibold tabular-nums">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
    </div>
  );
}
