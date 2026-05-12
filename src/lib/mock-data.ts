export type Severity = "short" | "moderate" | "long";
export type Category = "restaurants" | "barbershops" | "grocery" | "government" | "healthcare" | "retail" | "entertainment" | "landmarks" | "attractions";

export interface Venue {
  id: string;
  name: string;
  category: Category;
  categoryLabel: string;
  waitMinutes: number;
  severity: Severity;
  distance: string;
  reportsCount: number;
  lastReportMinutes: number;
  trend: "up" | "down" | "flat";
  event?: string;
  x: number; // map position % (0-100)
  y: number;
  hours: string;
  address: string;
  liveReporters: number;
  image: string;
  vibe: string;
  typicalWaitMinutes: number;
  reporterNames: string[];
  recentQuote: { text: string; author: string; ago: string };
}

export const venues: Venue[] = [
  { id: "v1", name: "Komodo", category: "restaurants", categoryLabel: "Restaurant", waitMinutes: 42, severity: "long", distance: "0.3 mi", reportsCount: 18, lastReportMinutes: 2, trend: "up", event: "Friday Rush", x: 28, y: 35, hours: "5pm – 2am", address: "801 Brickell Ave", liveReporters: 6, vibe: "Pan-Asian · Buzzy", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 55, reporterNames: ["Sofía", "Marcus", "Devon", "Aisha", "Tyler", "Maya"], recentQuote: { text: "Seated in 38 — bar moves faster.", author: "Sofía", ago: "2m" } },
  { id: "v2", name: "LIV Nightclub", category: "entertainment", categoryLabel: "Nightclub", waitMinutes: 65, severity: "long", distance: "1.2 mi", reportsCount: 31, lastReportMinutes: 1, trend: "up", event: "DJ Diesel tonight", x: 70, y: 22, hours: "11pm – 5am", address: "4441 Collins Ave", liveReporters: 14, vibe: "EDM · VIP", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 75, reporterNames: ["Devon", "Priya", "Rico", "Nina", "Jasmine", "Tyler", "Carlos", "Maya"], recentQuote: { text: "Guest list line is moving — main is brutal.", author: "Devon", ago: "1m" } },
  { id: "v3", name: "LA Barber Co.", category: "barbershops", categoryLabel: "Barbershop", waitMinutes: 8, severity: "short", distance: "0.5 mi", reportsCount: 5, lastReportMinutes: 4, trend: "down", x: 45, y: 60, hours: "9am – 8pm", address: "118 NE 1st Ave", liveReporters: 2, vibe: "Classic cuts", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 20, reporterNames: ["Marcus", "Theo"], recentQuote: { text: "Walked right in. Chair open.", author: "Marcus", ago: "4m" } },
  { id: "v4", name: "Miami DMV", category: "government", categoryLabel: "Government", waitMinutes: 95, severity: "long", distance: "2.1 mi", reportsCount: 22, lastReportMinutes: 6, trend: "flat", x: 18, y: 72, hours: "8am – 5pm", address: "200 NW 2nd Ave", liveReporters: 9, vibe: "Renewals open", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 90, reporterNames: ["Carlos", "Nina", "Theo", "Priya"], recentQuote: { text: "Renewals window has no line.", author: "Carlos", ago: "6m" } },
  { id: "v5", name: "Joe's Stone Crab", category: "restaurants", categoryLabel: "Restaurant", waitMinutes: 25, severity: "moderate", distance: "0.8 mi", reportsCount: 12, lastReportMinutes: 3, trend: "down", x: 58, y: 48, hours: "11am – 11pm", address: "11 Washington Ave", liveReporters: 4, vibe: "Seafood · Iconic", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 45, reporterNames: ["Aisha", "Rico", "Sofía", "Jasmine"], recentQuote: { text: "Dropped 15 min in the last half hour.", author: "Aisha", ago: "3m" } },
  { id: "v6", name: "Coyo Taco", category: "restaurants", categoryLabel: "Taqueria", waitMinutes: 15, severity: "moderate", distance: "0.4 mi", reportsCount: 8, lastReportMinutes: 5, trend: "flat", x: 38, y: 50, hours: "11am – 3am", address: "2300 NW 2nd Ave", liveReporters: 3, vibe: "Late-night tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 18, reporterNames: ["Maya", "Tyler", "Devon"], recentQuote: { text: "Quick line — taco window is fastest.", author: "Maya", ago: "5m" } },
  { id: "v7", name: "Story Nightclub", category: "entertainment", categoryLabel: "Nightclub", waitMinutes: 35, severity: "moderate", distance: "1.5 mi", reportsCount: 14, lastReportMinutes: 2, trend: "up", x: 80, y: 40, hours: "11pm – 5am", address: "136 Collins Ave", liveReporters: 7, vibe: "Hip-hop night", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 40, reporterNames: ["Tyler", "Jasmine", "Rico", "Priya"], recentQuote: { text: "Hip-hop room is packed — VIP entry moves.", author: "Tyler", ago: "2m" } },
  { id: "v8", name: "Jackson Health ER", category: "healthcare", categoryLabel: "Emergency", waitMinutes: 110, severity: "long", distance: "3.2 mi", reportsCount: 9, lastReportMinutes: 8, trend: "up", x: 12, y: 30, hours: "24h", address: "1611 NW 12th Ave", liveReporters: 5, vibe: "ER · 24h", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 80, reporterNames: ["Nina", "Carlos", "Theo"], recentQuote: { text: "Triage is backed up tonight.", author: "Nina", ago: "8m" } },
  { id: "v9", name: "Fade Lounge", category: "barbershops", categoryLabel: "Barbershop", waitMinutes: 0, severity: "short", distance: "0.7 mi", reportsCount: 3, lastReportMinutes: 12, trend: "flat", x: 62, y: 70, hours: "10am – 9pm", address: "455 NE 24th St", liveReporters: 1, vibe: "Walk-in ready", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 15, reporterNames: ["Theo"], recentQuote: { text: "Empty chair waiting. Just walk in.", author: "Theo", ago: "12m" } },
];

/** Crude walking-time estimate from a "0.3 mi" distance string. ~20 min per mile. */
export function walkMinutes(distance: string): number {
  const n = parseFloat(distance);
  if (Number.isNaN(n)) return 0;
  return Math.max(1, Math.round(n * 20));
}

export const liveFeed: { id: string; user: string; venue: string; minutes: number; ago: string }[] = [
  { id: "f1", user: "Marcus", venue: "LA Barber Co.", minutes: 8, ago: "now" },
  { id: "f2", user: "Sofía", venue: "Komodo", minutes: 42, ago: "1m" },
  { id: "f3", user: "Devon", venue: "LIV Nightclub", minutes: 65, ago: "1m" },
  { id: "f4", user: "Aisha", venue: "Joe's Stone Crab", minutes: 25, ago: "3m" },
  { id: "f5", user: "Tyler", venue: "Story Nightclub", minutes: 35, ago: "2m" },
  { id: "f6", user: "Maya", venue: "Coyo Taco", minutes: 15, ago: "5m" },
  { id: "f7", user: "Carlos", venue: "Miami DMV", minutes: 95, ago: "6m" },
];

export type FeedItem =
  | {
      id: string;
      kind: "venue";
      ago: string;
      venueId: string;
    }
  | {
      id: string;
      kind: "drop";
      ago: string;
      venueId: string;
      from: number;
      to: number;
    }
  | {
      id: string;
      kind: "report";
      ago: string;
      venueId: string;
      user: string;
      initial: string;
      minutes: number;
      quote?: string;
    }
  | {
      id: string;
      kind: "system";
      ago: string;
      title: string;
      body: string;
      emoji: string;
    };

export const exploreFeed: FeedItem[] = [
  { id: "fd1", kind: "drop", ago: "now", venueId: "v5", from: 40, to: 25 },
  { id: "fd2", kind: "report", ago: "1m", venueId: "v1", user: "Sofía", initial: "S", minutes: 42, quote: "Seated in 38 — bar moves faster." },
  { id: "fd3", kind: "venue", ago: "2m", venueId: "v2" },
  { id: "fd4", kind: "system", ago: "3m", title: "+25 SkipPoints", body: "Your report at Coyo Taco was confirmed by 4 people.", emoji: "✨" },
  { id: "fd5", kind: "report", ago: "4m", venueId: "v3", user: "Marcus", initial: "M", minutes: 8, quote: "Walked right in. Chair open." },
  { id: "fd6", kind: "drop", ago: "6m", venueId: "v7", from: 50, to: 35 },
  { id: "fd7", kind: "venue", ago: "8m", venueId: "v6" },
  { id: "fd8", kind: "system", ago: "12m", title: "Voucher unlocked", body: "20% off at Joe's Stone Crab — tap to claim.", emoji: "🎟️" },
  { id: "fd9", kind: "report", ago: "14m", venueId: "v4", user: "Carlos", initial: "C", minutes: 95, quote: "Renewals window has no line." },
  { id: "fd10", kind: "venue", ago: "18m", venueId: "v8" },
  { id: "fd11", kind: "drop", ago: "22m", venueId: "v9", from: 15, to: 0 },
  { id: "fd12", kind: "system", ago: "1h", title: "Badge earned: Night Owl", body: "Reported 5 venues after 11pm this week.", emoji: "🦉" },
];

export const categories: { id: Category | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "restaurants", label: "Restaurants", emoji: "🍽️" },
  { id: "barbershops", label: "Barbershops", emoji: "💈" },
  { id: "grocery", label: "Grocery", emoji: "🛒" },
  { id: "government", label: "Government", emoji: "🏛️" },
  { id: "healthcare", label: "Healthcare", emoji: "⚕️" },
  { id: "retail", label: "Retail", emoji: "🛍️" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "landmarks", label: "Landmarks", emoji: "🗽" },
  { id: "attractions", label: "Attractions", emoji: "🎡" },
];

export function severityColor(s: Severity) {
  return s === "short" ? "var(--wait-short)" : s === "moderate" ? "var(--wait-moderate)" : "var(--wait-long)";
}
export function severityLabel(s: Severity) {
  return s === "short" ? "Short" : s === "moderate" ? "Moderate" : "Long";
}

export const profile = {
  name: "Alex Rivera",
  handle: "@alexr",
  city: "Miami",
  neighborhood: "Wynwood",
  points: 2840,
  streak: 12,
  rank: 47,
  cityRank: 312,
  reportsThisWeek: 23,
  email: "alex@skiptheline.app",
  phone: "+1 (305) 555-0142",
  joined: "Mar 2024",
  friends: [
    { id: "fr1", name: "Sofía", handle: "@sofia", initial: "S" },
    { id: "fr2", name: "Marcus", handle: "@marcus", initial: "M" },
    { id: "fr3", name: "Maya", handle: "@maya", initial: "M" },
    { id: "fr4", name: "Theo", handle: "@theo", initial: "T" },
  ],
  badges: [
    { id: "b1", name: "First Drop", emoji: "🎯", earned: true },
    { id: "b2", name: "Night Owl", emoji: "🦉", earned: true },
    { id: "b3", name: "Streak x10", emoji: "🔥", earned: true },
    { id: "b4", name: "Local Hero", emoji: "🏆", earned: true },
    { id: "b5", name: "Event Scout", emoji: "🎪", earned: false },
    { id: "b6", name: "100 Club", emoji: "💯", earned: false },
  ],
  leaderboard: [
    { rank: 1, name: "Jasmine K.", points: 8420, you: false },
    { rank: 2, name: "Rico M.", points: 7110, you: false },
    { rank: 3, name: "Priya S.", points: 6890, you: false },
    { rank: 46, name: "Theo W.", points: 2895, you: false },
    { rank: 47, name: "You", points: 2840, you: true },
    { rank: 48, name: "Nina B.", points: 2770, you: false },
  ],
};

export interface Person {
  id: string;
  name: string;
  handle: string;
  initial: string;
  city: string;
  reportsCount: number;
  mutuals: number;
}

export const peoplePool: Person[] = [
  { id: "p1", name: "Jasmine K.", handle: "@jasmine", initial: "J", city: "Wynwood", reportsCount: 412, mutuals: 4 },
  { id: "p2", name: "Rico M.", handle: "@ricom", initial: "R", city: "Brickell", reportsCount: 318, mutuals: 3 },
  { id: "p3", name: "Priya S.", handle: "@priyas", initial: "P", city: "Midtown", reportsCount: 287, mutuals: 2 },
  { id: "p4", name: "Devon W.", handle: "@devon", initial: "D", city: "South Beach", reportsCount: 196, mutuals: 5 },
  { id: "p5", name: "Aisha N.", handle: "@aishan", initial: "A", city: "Coral Gables", reportsCount: 154, mutuals: 1 },
  { id: "p6", name: "Tyler B.", handle: "@tylerb", initial: "T", city: "Wynwood", reportsCount: 132, mutuals: 3 },
  { id: "p7", name: "Nina B.", handle: "@ninab", initial: "N", city: "Edgewater", reportsCount: 98, mutuals: 0 },
  { id: "p8", name: "Carlos R.", handle: "@carlos", initial: "C", city: "Little Havana", reportsCount: 76, mutuals: 2 },
  { id: "p9", name: "Maya T.", handle: "@mayat", initial: "M", city: "Wynwood", reportsCount: 64, mutuals: 4 },
];

// People who have requested to be your friend (mock).
export const incomingRequests: Person[] = [
  { id: "r1", name: "Liam O.", handle: "@liamo", initial: "L", city: "Brickell", reportsCount: 41, mutuals: 2 },
  { id: "r2", name: "Zoe P.", handle: "@zoep", initial: "Z", city: "Midtown", reportsCount: 22, mutuals: 1 },
];