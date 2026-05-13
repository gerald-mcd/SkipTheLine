import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { profile, peoplePool, incomingRequests, type Person, geoChildren, geoById, type GeoNode, tierFor, quests, rewards, communityImpact, type Quest, type Reward } from "@/lib/mock-data";
import { Flame, Trophy, MapPin, ChevronRight, Settings, UserPlus, Search, X, Check, Clock, TrendingUp, TrendingDown, Minus, List, Map as MapIcon, ChevronLeft, Crosshair, Zap, Target, Gift, Users, Lock, Sparkles } from "lucide-react";
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
  const { current: tier, next: nextTier, progress } = tierFor(profile.points);
  const pointsToNext = nextTier ? Math.max(0, nextTier.min - profile.points) : 0;
  const [findOpen, setFindOpen] = useState(false);
  // Local extra friends added during this session
  const [extraFriends, setExtraFriends] = useState<Person[]>([]);
  const allFriends = useMemo(
    () => [...profile.friends, ...extraFriends.map((p) => ({ id: p.id, name: p.name, handle: p.handle, initial: p.initial, avatar: p.avatar }))],
    [extraFriends],
  );

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: "var(--accent)" }}
          >
            {profile.name?.charAt(0)}
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

      {/* Hero gamification card */}
      <div
        className="relative mt-5 overflow-hidden rounded-3xl p-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--primary-glow) 65%, color-mix(in oklab, var(--primary) 60%, #fff) 100%)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        {/* Decorative glow blobs */}
        <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: "rgba(255,255,255,0.18)", filter: "blur(8px)" }} />
        <span aria-hidden className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.10)", filter: "blur(10px)" }} />
        <span aria-hidden className="pointer-events-none absolute inset-0 animate-ping-soft rounded-3xl" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25), transparent 50%)" }} />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-base" style={{ background: "rgba(255,255,255,0.22)" }}>
              {tier.emoji}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-90">Tier · {tier.name}</p>
              <p className="text-[10px] opacity-80">{tier.perks[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.22)" }}>
            <Zap className="h-3 w-3" /> +{communityImpact.weeklyXP} this week
          </div>
        </div>

        <div className="relative mt-3 flex items-baseline gap-1.5">
          <span className="font-display text-5xl font-bold tabular-nums tracking-tight">
            {profile.points.toLocaleString()}
          </span>
          <span className="text-sm font-semibold opacity-90">SkipPoints</span>
        </div>

        <div className="relative mt-4">
          <div className="flex items-center justify-between text-[11px] font-semibold opacity-90">
            <span>{tier.name}</span>
            <span>{nextTier ? `${pointsToNext.toLocaleString()} to ${nextTier.name} ${nextTier.emoji}` : "Max tier"}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.22)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #fff, rgba(255,255,255,0.85))",
                boxShadow: "0 0 12px rgba(255,255,255,0.6)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        <Stat icon={<Flame className="h-3.5 w-3.5" style={{ color: "var(--warning)" }} />} value={`${profile.streak}d`} label="Streak" />
        <Stat icon={<Trophy className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />} value={`#${profile.rank}`} label="Rank" />
        <Stat
          icon={
            profile.rankTrend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
            ) : profile.rankTrend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5" style={{ color: "var(--destructive)" }} />
            ) : (
              <Minus className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />
            )
          }
          value={`${profile.rankTrend === "down" ? "−" : "+"}${profile.rankDelta}`}
          label="Trend"
        />
        <Stat icon={<Users className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />} value={communityImpact.peopleHelped > 999 ? `${(communityImpact.peopleHelped / 1000).toFixed(1)}k` : `${communityImpact.peopleHelped}`} label="Helped" />
      </div>

      {/* Active Quests — community participation drivers */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display flex items-center gap-1.5 text-base font-bold tracking-tight">
            <Target className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} /> Active quests
          </h2>
          <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
            Resets in 6h
          </span>
        </div>
        <div className="space-y-2">
          {quests.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Rewards marketplace — incentive */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display flex items-center gap-1.5 text-base font-bold tracking-tight">
            <Gift className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} /> Redeem rewards
          </h2>
          <button className="flex items-center text-xs font-medium" style={{ color: "var(--primary)" }}>
            Shop all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
          {rewards.map((r) => (
            <RewardCard key={r.id} reward={r} userPoints={profile.points} />
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display flex items-center gap-1.5 text-base font-bold tracking-tight">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} /> Badges
          </h2>
          <button className="flex items-center text-xs font-medium" style={{ color: "var(--primary)" }}>
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className="flex flex-col items-center rounded-xl bg-card p-3"
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
      <LeaderboardSection />

      {/* Friends */}
      <section className="mt-7">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display text-base font-bold tracking-tight">
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
          <div className="mb-3 rounded-2xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
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
        <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "1px solid var(--border)" }}>
          {allFriends.map((f, i) => (
            <div
              key={f.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: "var(--accent)" }}
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
      <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold" style={{ background: "var(--accent)" }}>
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
      <div className="relative max-h-[85vh] w-full max-w-md animate-slide-up overflow-hidden rounded-t-3xl bg-card" style={{ boxShadow: "var(--shadow-lg)" }}>
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
          <div className="flex items-center gap-2 rounded-full bg-card px-3 py-2.5" style={{ border: "1px solid var(--border)" }}>
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
                  <div key={p.id} className="flex items-center gap-3 rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" style={{ background: "var(--accent)" }}>
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
    <div className="rounded-xl bg-card p-3" style={{ border: "1px solid var(--border)" }}>
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

function QuestCard({ quest }: { quest: Quest }) {
  const pct = Math.min(100, (quest.progress / quest.goal) * 100);
  const done = quest.progress >= quest.goal;
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-card p-3"
      style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ background: "var(--accent)" }}
        >
          {quest.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{quest.title}</p>
            <span
              className="flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                background: done ? "var(--success)" : "var(--accent)",
                color: done ? "#fff" : "var(--primary)",
              }}
            >
              <Zap className="h-2.5 w-2.5" /> {quest.reward}
            </span>
          </div>
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            {quest.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "var(--secondary)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: done
                    ? "var(--success)"
                    : "linear-gradient(90deg, var(--primary), var(--primary-glow))",
                }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: "var(--muted-foreground)" }}>
              {quest.progress}/{quest.goal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardCard({ reward, userPoints }: { reward: Reward; userPoints: number }) {
  const affordable = userPoints >= reward.cost;
  const locked = !reward.unlocked || !affordable;
  return (
    <button
      onClick={() => toast(locked ? `Reach ${reward.cost.toLocaleString()} pts to unlock` : `Redeemed ${reward.title}`)}
      className="relative flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl bg-card p-3 text-left transition-transform hover:scale-[1.02]"
      style={{
        border: "1px solid var(--border)",
        boxShadow: !locked ? "var(--shadow-glow)" : "var(--shadow-sm)",
        opacity: locked ? 0.85 : 1,
      }}
    >
      {!locked && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full"
          style={{ background: "color-mix(in oklab, var(--primary) 18%, transparent)", filter: "blur(6px)" }}
        />
      )}
      <div className="flex items-center justify-between">
        <span className="text-2xl">{reward.emoji}</span>
        {locked ? (
          <Lock className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />
        ) : (
          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "var(--success)", color: "#fff" }}>
            Ready
          </span>
        )}
      </div>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
        {reward.brand}
      </p>
      <p className="mt-0.5 text-sm font-semibold leading-tight">{reward.title}</p>
      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold" style={{ color: locked ? "var(--muted-foreground)" : "var(--primary)" }}>
        <Zap className="h-3 w-3" /> {reward.cost.toLocaleString()}
      </div>
    </button>
  );
}

// ---------- Leaderboard with map / list drill-down ----------
function LeaderboardSection() {
  const [view, setView] = useState<"map" | "list">("map");
  // Drill path: undefined → state, "fl" → cities, "miami" → neighborhoods
  const [parentId, setParentId] = useState<string | undefined>("miami");
  const [focusYou, setFocusYou] = useState(false);
  const nodes = geoChildren(parentId);
  const parent = parentId ? geoById(parentId) : undefined;

  // When "Focus on You" is on, jump to the deepest scope where the user is ranked
  // (neighborhoods under Miami) and filter the list to only ranked regions.
  const handleFocusToggle = () => {
    setFocusYou((on) => {
      const next = !on;
      if (next) setParentId("miami");
      return next;
    });
  };
  const visibleNodes = focusYou ? nodes.filter((n) => n.yourPoints > 0) : nodes;

  const scopeLabel =
    nodes[0]?.scope === "state"
      ? "Nation"
      : nodes[0]?.scope === "city"
        ? parent?.name ?? "State"
        : parent?.name ?? "City";

  const crumbs: { id: string | undefined; name: string }[] = [
    { id: undefined, name: "USA" },
    ...(parentId ? [{ id: "fl", name: "Florida" }] : []),
    ...(parentId === "miami" ? [{ id: "miami", name: "Miami" }] : []),
  ];

  return (
    <section className="mt-7">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="font-display text-base font-bold tracking-tight">Rank · {scopeLabel}</h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFocusToggle}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors"
            style={{
              background: focusYou ? "var(--primary)" : "var(--secondary)",
              color: focusYou ? "var(--primary-foreground)" : "var(--muted-foreground)",
              boxShadow: focusYou ? "var(--shadow-sm)" : "none",
            }}
            aria-pressed={focusYou}
            title="Highlight your neighborhood and ranked regions only"
          >
            <Crosshair className="h-3 w-3" /> Focus on You
          </button>
          <div className="flex items-center gap-1 rounded-full p-0.5" style={{ background: "var(--secondary)" }}>
          <button
            onClick={() => setView("map")}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: view === "map" ? "var(--card)" : "transparent",
              color: view === "map" ? "var(--primary)" : "var(--muted-foreground)",
              boxShadow: view === "map" ? "var(--shadow-sm)" : "none",
            }}
          >
            <MapIcon className="h-3 w-3" /> Map
          </button>
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: view === "list" ? "var(--card)" : "transparent",
              color: view === "list" ? "var(--primary)" : "var(--muted-foreground)",
              boxShadow: view === "list" ? "var(--shadow-sm)" : "none",
            }}
          >
            <List className="h-3 w-3" /> List
          </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
        {parentId && (
          <button
            onClick={() => setParentId(parentId === "miami" ? "fl" : undefined)}
            className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: "var(--secondary)" }}
            aria-label="Back"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        )}
        {crumbs.map((c, i) => (
          <span key={`${c.id ?? "root"}-${i}`} className="inline-flex items-center gap-1">
            <button
              onClick={() => setParentId(c.id)}
              className="font-semibold"
              style={{ color: i === crumbs.length - 1 ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              {c.name}
            </button>
            {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
          </span>
        ))}
      </div>

      {view === "map" ? (
        <LeaderboardMap nodes={nodes} focusYou={focusYou} onDrill={(n) => n.scope !== "neighborhood" && setParentId(n.id)} />
      ) : (
        <LeaderboardList nodes={visibleNodes} onDrill={(n) => n.scope !== "neighborhood" && setParentId(n.id)} />
      )}
      {focusYou && view === "list" && visibleNodes.length === 0 && (
        <p className="mt-2 text-center text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          You're not ranked in any region at this scope yet.
        </p>
      )}
    </section>
  );
}

function trendColor(t: GeoNode["trend"]) {
  return t === "up" ? "var(--success, #16a34a)" : t === "down" ? "var(--destructive, #dc2626)" : "var(--muted-foreground)";
}
function TrendIcon({ t }: { t: GeoNode["trend"] }) {
  if (t === "up") return <TrendingUp className="h-3 w-3" strokeWidth={2.5} style={{ color: trendColor(t) }} />;
  if (t === "down") return <TrendingDown className="h-3 w-3" strokeWidth={2.5} style={{ color: trendColor(t) }} />;
  return <Minus className="h-3 w-3" strokeWidth={2.5} style={{ color: trendColor(t) }} />;
}

function LeaderboardMap({ nodes, onDrill, focusYou }: { nodes: GeoNode[]; onDrill: (n: GeoNode) => void; focusYou?: boolean }) {
  return (
    <div
      className="relative h-56 w-full overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--primary) 6%, var(--card)) 0%, var(--card) 100%)",
        border: "1px solid var(--border)",
      }}
    >
      {nodes.map((n) => {
        const youHere = n.yourPoints > 0;
        const dimmed = focusYou && !youHere;
        return (
          <button
            key={n.id}
            onClick={() => onDrill(n)}
            className="absolute flex flex-col items-start justify-end rounded-xl p-2 text-left transition-transform hover:scale-[1.03]"
            style={{
              left: `${n.shape.x}%`,
              top: `${n.shape.y}%`,
              width: `${n.shape.w}%`,
              height: `${n.shape.h}%`,
              background: youHere
                ? "color-mix(in oklab, var(--primary) 22%, transparent)"
                : "color-mix(in oklab, var(--foreground) 6%, transparent)",
              border: youHere ? "1.5px solid var(--primary)" : "1px dashed var(--border)",
              opacity: dimmed ? 0.25 : 1,
              boxShadow: focusYou && youHere ? "0 0 0 3px color-mix(in oklab, var(--primary) 35%, transparent)" : undefined,
              zIndex: focusYou && youHere ? 2 : 1,
            }}
          >
            {focusYou && youHere && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl animate-ping-soft"
                style={{ background: "color-mix(in oklab, var(--primary) 18%, transparent)" }}
              />
            )}
            <div className="flex w-full items-center justify-between gap-1">
              <span
                className="font-display truncate text-[11px] font-bold"
                style={{ color: youHere ? "var(--primary)" : "var(--foreground)" }}
              >
                {n.name}
              </span>
              <TrendIcon t={n.trend} />
            </div>
            {youHere ? (
              <span className="font-grotesk text-[10px] font-bold tabular-nums" style={{ color: "var(--primary)" }}>
                #{n.rank}
              </span>
            ) : (
              <span className="font-grotesk text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                {n.reporters} active
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LeaderboardList({ nodes, onDrill }: { nodes: GeoNode[]; onDrill: (n: GeoNode) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card" style={{ border: "1px solid var(--border)" }}>
      {nodes.map((n, i) => {
        const youHere = n.yourPoints > 0;
        const drillable = n.scope !== "neighborhood";
        return (
          <button
            key={n.id}
            onClick={() => onDrill(n)}
            disabled={!drillable}
            className="flex w-full items-center gap-3 px-4 py-3 text-left"
            style={{
              background: youHere ? "var(--accent)" : "transparent",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
              cursor: drillable ? "pointer" : "default",
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold" style={{ color: youHere ? "var(--primary)" : "var(--foreground)" }}>
                  {n.name}
                </p>
                <TrendIcon t={n.trend} />
              </div>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                Top: {n.topName} · {n.topPoints.toLocaleString()} pts · {n.reporters} active
              </p>
            </div>
            {youHere ? (
              <span className="text-sm font-bold tabular-nums" style={{ color: "var(--primary)" }}>
                #{n.rank}
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                Not ranked
              </span>
            )}
            {drillable && <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />}
          </button>
        );
      })}
    </div>
  );
}
