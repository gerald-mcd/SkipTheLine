import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { profile, peoplePool, incomingRequests, type Person } from "@/lib/mock-data";
import { Flame, Trophy, MapPin, Sparkles, ChevronRight, Settings, Mail, Phone, UserPlus, Bell, Shield, LogOut, CalendarDays, Search, X, Check, Clock } from "lucide-react";
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
  const [findOpen, setFindOpen] = useState(false);
  // Local extra friends added during this session
  const [extraFriends, setExtraFriends] = useState<Person[]>([]);
  const allFriends = useMemo(
    () => [...profile.friends, ...extraFriends.map((p) => ({ id: p.id, name: p.name, handle: p.handle, initial: p.initial }))],
    [extraFriends],
  );

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
          <h2 className="text-sm font-semibold">
            Friends <span className="ml-1 text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>{allFriends.length}</span>
          </h2>
          <button
            onClick={() => setFindOpen(true)}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <UserPlus className="h-3.5 w-3.5" /> Find friends
          </button>
        </div>
        <p className="mb-2 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          Friends' names appear on their reports. Strangers stay anonymous.
        </p>
        {incomingRequests.length > 0 && (
          <div className="mb-3 rounded-2xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
              {incomingRequests.length} pending request{incomingRequests.length === 1 ? "" : "s"}
            </p>
            <div className="space-y-2">
              {incomingRequests.map((p) => (
                <RequestRow key={p.id} person={p} onAccept={() => {
                  setExtraFriends((prev) => prev.some((x) => x.id === p.id) ? prev : [...prev, p]);
                  toast(`You're now friends with ${p.name}`);
                }} />
              ))}
            </div>
          </div>
        )}
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--border)" }}>
          {allFriends.map((f, i) => (
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

      {findOpen && (
        <FindFriendsSheet
          existingFriendIds={new Set(allFriends.map((f) => f.id))}
          onClose={() => setFindOpen(false)}
          onAccept={(p) => {
            setExtraFriends((prev) => prev.some((x) => x.id === p.id) ? prev : [...prev, p]);
          }}
        />
      )}
    </div>
  );
}

function RequestRow({ person, onAccept }: { person: Person; onAccept: () => void }) {
  const [state, setState] = useState<"pending" | "accepted" | "declined">("pending");
  if (state === "declined") return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold" style={{ background: "var(--accent)", color: "var(--primary)" }}>
        {person.initial}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{person.name}</p>
        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {person.mutuals} mutual{person.mutuals === 1 ? "" : "s"} · {person.city}
        </p>
      </div>
      {state === "pending" ? (
        <div className="flex gap-1.5">
          <button
            onClick={() => setState("declined")}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "var(--secondary)" }}
            aria-label="Decline"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => { setState("accepted"); onAccept(); }}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Check className="h-3 w-3" /> Accept
          </button>
        </div>
      ) : (
        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: "var(--accent)", color: "var(--primary)" }}>
          Friends
        </span>
      )}
    </div>
  );
}

function FindFriendsSheet({
  existingFriendIds,
  onClose,
  onAccept,
}: {
  existingFriendIds: Set<string>;
  onClose: () => void;
  onAccept: (p: Person) => void;
}) {
  const [q, setQ] = useState("");
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [accepted, setAccepted] = useState<Set<string>>(new Set());

  const results = useMemo(() => {
    const candidates = peoplePool.filter((p) => !existingFriendIds.has(p.id));
    const term = q.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter(
      (p) => p.name.toLowerCase().includes(term) || p.handle.toLowerCase().includes(term) || p.city.toLowerCase().includes(term),
    );
  }, [q, existingFriendIds]);

  const sendRequest = (p: Person) => {
    setRequested((prev) => new Set(prev).add(p.id));
    toast(`Request sent to ${p.name}`);
    // Mock acceptance after 1.4s for demo flow
    window.setTimeout(() => {
      setAccepted((prev) => new Set(prev).add(p.id));
      onAccept(p);
      toast(`${p.name} accepted your request`);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 animate-fade-in bg-black/40" />
      <div className="relative max-h-[85vh] w-full max-w-md animate-slide-up overflow-hidden rounded-t-3xl bg-white" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Connect</p>
            <h3 className="font-display text-lg font-bold tracking-tight">Find friends</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--secondary)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2.5" style={{ border: "1px solid var(--border)" }}>
            <Search className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value.slice(0, 60))}
              placeholder="Search by name, handle, neighborhood…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear" className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "var(--secondary)" }}>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-4 pb-5 pt-3">
          {results.length === 0 ? (
            <p className="py-10 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
              No one matches "{q}".
            </p>
          ) : (
            <div className="space-y-2">
              {results.map((p) => {
                const isRequested = requested.has(p.id);
                const isAccepted = accepted.has(p.id);
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                      {p.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{p.name} <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>{p.handle}</span></p>
                      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        {p.city} · {p.mutuals} mutual · {p.reportsCount} reports
                      </p>
                    </div>
                    {isAccepted ? (
                      <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: "var(--accent)", color: "var(--primary)" }}>
                        <Check className="h-3 w-3" /> Friends
                      </span>
                    ) : isRequested ? (
                      <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                        <Clock className="h-3 w-3" /> Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => sendRequest(p)}
                        className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        <UserPlus className="h-3 w-3" /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
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
