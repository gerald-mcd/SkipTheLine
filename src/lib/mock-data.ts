export type Severity = "short" | "moderate" | "long";
export type Category = "food" | "nightlife" | "barber" | "gov" | "health" | "attraction";

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
  { id: "v1", name: "Komodo", category: "food", categoryLabel: "Restaurant", waitMinutes: 42, severity: "long", distance: "0.3 mi", reportsCount: 18, lastReportMinutes: 2, trend: "up", event: "Friday Rush", x: 28, y: 35, hours: "5pm – 2am", address: "801 Brickell Ave", liveReporters: 6, vibe: "Pan-Asian · Buzzy", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 55, reporterNames: ["Sofía", "Marcus", "Devon", "Aisha", "Tyler", "Maya"], recentQuote: { text: "Seated in 38 — bar moves faster.", author: "Sofía", ago: "2m" } },
  { id: "v2", name: "LIV Nightclub", category: "nightlife", categoryLabel: "Nightclub", waitMinutes: 65, severity: "long", distance: "1.2 mi", reportsCount: 31, lastReportMinutes: 1, trend: "up", event: "DJ Diesel tonight", x: 70, y: 22, hours: "11pm – 5am", address: "4441 Collins Ave", liveReporters: 14, vibe: "EDM · VIP", image: "https://images.unsplash.com/photo-1571266028243-d220c6a9f7b4?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 75, reporterNames: ["Devon", "Priya", "Rico", "Nina", "Jasmine", "Tyler", "Carlos", "Maya"], recentQuote: { text: "Guest list line is moving — main is brutal.", author: "Devon", ago: "1m" } },
  { id: "v3", name: "LA Barber Co.", category: "barber", categoryLabel: "Barbershop", waitMinutes: 8, severity: "short", distance: "0.5 mi", reportsCount: 5, lastReportMinutes: 4, trend: "down", x: 45, y: 60, hours: "9am – 8pm", address: "118 NE 1st Ave", liveReporters: 2, vibe: "Classic cuts", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 20, reporterNames: ["Marcus", "Theo"], recentQuote: { text: "Walked right in. Chair open.", author: "Marcus", ago: "4m" } },
  { id: "v4", name: "Miami DMV", category: "gov", categoryLabel: "Government", waitMinutes: 95, severity: "long", distance: "2.1 mi", reportsCount: 22, lastReportMinutes: 6, trend: "flat", x: 18, y: 72, hours: "8am – 5pm", address: "200 NW 2nd Ave", liveReporters: 9, vibe: "Renewals open", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 90, reporterNames: ["Carlos", "Nina", "Theo", "Priya"], recentQuote: { text: "Renewals window has no line.", author: "Carlos", ago: "6m" } },
  { id: "v5", name: "Joe's Stone Crab", category: "food", categoryLabel: "Restaurant", waitMinutes: 25, severity: "moderate", distance: "0.8 mi", reportsCount: 12, lastReportMinutes: 3, trend: "down", x: 58, y: 48, hours: "11am – 11pm", address: "11 Washington Ave", liveReporters: 4, vibe: "Seafood · Iconic", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 45, reporterNames: ["Aisha", "Rico", "Sofía", "Jasmine"], recentQuote: { text: "Dropped 15 min in the last half hour.", author: "Aisha", ago: "3m" } },
  { id: "v6", name: "Coyo Taco", category: "food", categoryLabel: "Taqueria", waitMinutes: 15, severity: "moderate", distance: "0.4 mi", reportsCount: 8, lastReportMinutes: 5, trend: "flat", x: 38, y: 50, hours: "11am – 3am", address: "2300 NW 2nd Ave", liveReporters: 3, vibe: "Late-night tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 18, reporterNames: ["Maya", "Tyler", "Devon"], recentQuote: { text: "Quick line — taco window is fastest.", author: "Maya", ago: "5m" } },
  { id: "v7", name: "Story Nightclub", category: "nightlife", categoryLabel: "Nightclub", waitMinutes: 35, severity: "moderate", distance: "1.5 mi", reportsCount: 14, lastReportMinutes: 2, trend: "up", x: 80, y: 40, hours: "11pm – 5am", address: "136 Collins Ave", liveReporters: 7, vibe: "Hip-hop night", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 40, reporterNames: ["Tyler", "Jasmine", "Rico", "Priya"], recentQuote: { text: "Hip-hop room is packed — VIP entry moves.", author: "Tyler", ago: "2m" } },
  { id: "v8", name: "Jackson Health ER", category: "health", categoryLabel: "Emergency", waitMinutes: 110, severity: "long", distance: "3.2 mi", reportsCount: 9, lastReportMinutes: 8, trend: "up", x: 12, y: 30, hours: "24h", address: "1611 NW 12th Ave", liveReporters: 5, vibe: "ER · 24h", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 80, reporterNames: ["Nina", "Carlos", "Theo"], recentQuote: { text: "Triage is backed up tonight.", author: "Nina", ago: "8m" } },
  { id: "v9", name: "Fade Lounge", category: "barber", categoryLabel: "Barbershop", waitMinutes: 0, severity: "short", distance: "0.7 mi", reportsCount: 3, lastReportMinutes: 12, trend: "flat", x: 62, y: 70, hours: "10am – 9pm", address: "455 NE 24th St", liveReporters: 1, vibe: "Walk-in ready", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=80&auto=format&fit=crop", typicalWaitMinutes: 15, reporterNames: ["Theo"], recentQuote: { text: "Empty chair waiting. Just walk in.", author: "Theo", ago: "12m" } },
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

export const categories: { id: Category | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "food", label: "Food", emoji: "🍽️" },
  { id: "nightlife", label: "Nightlife", emoji: "🌃" },
  { id: "barber", label: "Barber", emoji: "💈" },
  { id: "gov", label: "Gov", emoji: "🏛️" },
  { id: "health", label: "Health", emoji: "⚕️" },
  { id: "attraction", label: "Spots", emoji: "🎡" },
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