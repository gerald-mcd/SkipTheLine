import { createFileRoute, Link } from "@tanstack/react-router";
import { venues, severityColor, liveFeed } from "@/lib/mock-data";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Search, Home as HomeIcon, Zap, Users, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/social")({
  head: () => ({
    meta: [
      { title: "SkipTheLine Social — the city's live feed" },
      { name: "description", content: "Real-time wait drops from your city, social-feed style." },
    ],
  }),
  component: Social,
});

const userAvatars = [
  "https://i.pravatar.cc/100?img=12",
  "https://i.pravatar.cc/100?img=47",
  "https://i.pravatar.cc/100?img=32",
  "https://i.pravatar.cc/100?img=8",
  "https://i.pravatar.cc/100?img=23",
  "https://i.pravatar.cc/100?img=56",
  "https://i.pravatar.cc/100?img=15",
];

function Social() {
  const posts = venues.slice(0, 6).map((v, i) => ({
    ...v,
    user: liveFeed[i % liveFeed.length].user,
    avatar: userAvatars[i % userAvatars.length],
    ago: liveFeed[i % liveFeed.length].ago,
    likes: 80 + ((i * 53) % 420),
    comments: 4 + ((i * 7) % 38),
    caption:
      i === 0
        ? "tell me why the line is wrapped around the block 😭 worth it tho — the lychee martini"
        : i === 1
          ? "VIP ropes open rn, security said walk-ins after midnight 🔥"
          : i === 2
            ? "no wait, my barber is free, run don't walk 💈"
            : i === 3
              ? "DMV update: ticket B247 — moving fast for once"
              : i === 4
                ? "stone crab claws hitting different tonight 🦀 25 min outside"
                : "tacos al pastor + no line = perfect tuesday",
  }));

  return (
    <div className="pb-4" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h1 className="font-display text-2xl leading-none" style={{ letterSpacing: "-0.04em" }}>
            skip<span style={{ color: "var(--primary)" }}>.</span>line
          </h1>
          <p className="font-grotesk text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
            <MapPin className="mr-0.5 -mt-0.5 inline h-2.5 w-2.5" /> Miami live
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-full bg-white"
            style={{ border: "1px solid var(--border)" }}
          >
            <Zap className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </button>
          <Link
            to="/"
            className="font-grotesk rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            ← Classic
          </Link>
        </div>
      </header>

      {/* Stories rail */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 py-4">
        <button className="flex shrink-0 flex-col items-center gap-1">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white" style={{ border: "2px dashed var(--primary)" }}>
            <Plus className="h-5 w-5" style={{ color: "var(--primary)" }} />
          </div>
          <span className="font-grotesk text-[10px] font-bold">Drop wait</span>
        </button>
        {posts.slice(0, 6).map((p) => (
          <button key={p.id} className="flex shrink-0 flex-col items-center gap-1">
            <div
              className="rounded-full p-[2.5px]"
              style={{
                background: `conic-gradient(from 180deg, var(--primary), var(--accent-rose-fg), var(--wait-moderate), var(--primary))`,
              }}
            >
              <div className="rounded-full bg-white p-[2px]">
                <img src={p.avatar} alt={p.user} className="h-14 w-14 rounded-full object-cover" />
              </div>
            </div>
            <span className="font-grotesk max-w-[64px] truncate text-[10px] font-bold">{p.user.toLowerCase()}</span>
          </button>
        ))}
      </div>

      {/* Live ticker pill */}
      <div className="px-5">
        <div
          className="flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{ background: "var(--accent-lemon)", border: "1px solid var(--border)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: "var(--destructive)" }} />
            <span className="relative h-2 w-2 rounded-full" style={{ background: "var(--destructive)" }} />
          </span>
          <span className="font-grotesk text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-lemon-fg)" }}>
            42 people just dropped a wait time
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="mt-3 space-y-3">
        {posts.map((p, i) => (
          <Post key={p.id} post={p} bgIdx={i} />
        ))}
      </div>

      {/* Bottom social nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
        <div
          className="mx-3 mb-3 flex items-center justify-around rounded-full bg-white px-4 py-3"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          <Link to={"/social" as any}><HomeIcon className="h-5 w-5" style={{ color: "var(--primary)" }} strokeWidth={2.5} /></Link>
          <Link to="/explore"><Search className="h-5 w-5" style={{ color: "var(--muted-foreground)" }} /></Link>
          <Link
            to="/report"
            className="grid h-11 w-11 -mt-1 place-items-center rounded-full"
            style={{ background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
          </Link>
          <Link to="/explore"><Users className="h-5 w-5" style={{ color: "var(--muted-foreground)" }} /></Link>
          <Link to="/profile">
            <img src={userAvatars[0]} alt="you" className="h-7 w-7 rounded-full object-cover" style={{ border: "2px solid var(--primary)" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Post({ post, bgIdx }: { post: any; bgIdx: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const tones = ["accent-peach", "accent-mint", "accent-sky", "accent-lilac", "accent-lemon", "accent-rose"];
  const tone = tones[bgIdx % tones.length];

  return (
    <article className="bg-white" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-full p-[2px]"
            style={{ background: `var(--${tone}-fg)` }}
          >
            <img src={post.avatar} alt={post.user} className="h-9 w-9 rounded-full object-cover" style={{ border: "2px solid white" }} />
          </div>
          <div>
            <p className="font-grotesk text-[13px] font-bold leading-tight">
              {post.user.toLowerCase()} <span className="font-jakarta font-medium" style={{ color: "var(--muted-foreground)" }}>· {post.ago}</span>
            </p>
            <p className="font-jakarta text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
              at <span className="font-bold" style={{ color: "var(--foreground)" }}>{post.name}</span> · {post.distance}
            </p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5" style={{ color: "var(--muted-foreground)" }} />
      </div>

      {/* Image */}
      <Link to="/venue/$id" params={{ id: post.id }} className="relative block">
        <img src={post.image} alt={post.name} className="aspect-square w-full object-cover" />

        {/* Wait time badge — the killer feature */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <div
            className="font-grotesk inline-flex items-baseline gap-1 rounded-2xl px-3 py-1.5 text-white shadow-lg"
            style={{ background: severityColor(post.severity) }}
          >
            <span className="text-xl font-bold tabular-nums">{post.waitMinutes}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-95">min wait</span>
          </div>
        </div>

        <span
          className="font-grotesk absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
          {post.liveReporters} live
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked((l) => !l)} className="transition-transform active:scale-90">
            <Heart
              className="h-6 w-6"
              fill={liked ? "var(--destructive)" : "none"}
              style={{ color: liked ? "var(--destructive)" : "var(--foreground)" }}
              strokeWidth={2}
            />
          </button>
          <button><MessageCircle className="h-6 w-6" strokeWidth={2} /></button>
          <button><Send className="h-6 w-6" strokeWidth={2} /></button>
        </div>
        <button onClick={() => setSaved((s) => !s)} className="transition-transform active:scale-90">
          <Bookmark className="h-6 w-6" fill={saved ? "var(--foreground)" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Likes + caption */}
      <div className="px-4 pb-4 pt-2">
        <p className="font-grotesk text-[13px] font-bold">{post.likes + (liked ? 1 : 0)} likes</p>
        <p className="font-jakarta mt-1 text-[13px] leading-snug">
          <span className="font-bold">{post.user.toLowerCase()}</span>{" "}
          <span style={{ color: "var(--foreground)" }}>{post.caption}</span>
        </p>
        <p className="font-grotesk mt-1.5 text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
          View all {post.comments} comments
        </p>

        {/* Inline chip strip */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span
            className="font-grotesk inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: `var(--${tone})`, color: `var(--${tone}-fg)` }}
          >
            {post.categoryLabel}
          </span>
          <span
            className="font-grotesk inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            {post.vibe}
          </span>
          {post.event && (
            <span className="font-grotesk inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: "var(--primary)" }}>
              {post.event}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
