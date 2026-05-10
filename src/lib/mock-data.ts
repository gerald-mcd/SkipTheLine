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
}

export const venues: Venue[] = [
  { id: "v1", name: "Komodo", category: "food", categoryLabel: "Restaurant", waitMinutes: 42, severity: "long", distance: "0.3 mi", reportsCount: 18, lastReportMinutes: 2, trend: "up", event: "Friday Rush", x: 28, y: 35, hours: "5pm – 2am", address: "801 Brickell Ave", liveReporters: 6 },
  { id: "v2", name: "LIV Nightclub", category: "nightlife", categoryLabel: "Nightclub", waitMinutes: 65, severity: "long", distance: "1.2 mi", reportsCount: 31, lastReportMinutes: 1, trend: "up", event: "DJ Diesel tonight", x: 70, y: 22, hours: "11pm – 5am", address: "4441 Collins Ave", liveReporters: 14 },
  { id: "v3", name: "LA Barber Co.", category: "barber", categoryLabel: "Barbershop", waitMinutes: 8, severity: "short", distance: "0.5 mi", reportsCount: 5, lastReportMinutes: 4, trend: "down", x: 45, y: 60, hours: "9am – 8pm", address: "118 NE 1st Ave", liveReporters: 2 },
  { id: "v4", name: "Miami DMV", category: "gov", categoryLabel: "Government", waitMinutes: 95, severity: "long", distance: "2.1 mi", reportsCount: 22, lastReportMinutes: 6, trend: "flat", x: 18, y: 72, hours: "8am – 5pm", address: "200 NW 2nd Ave", liveReporters: 9 },
  { id: "v5", name: "Joe's Stone Crab", category: "food", categoryLabel: "Restaurant", waitMinutes: 25, severity: "moderate", distance: "0.8 mi", reportsCount: 12, lastReportMinutes: 3, trend: "down", x: 58, y: 48, hours: "11am – 11pm", address: "11 Washington Ave", liveReporters: 4 },
  { id: "v6", name: "Coyo Taco", category: "food", categoryLabel: "Taqueria", waitMinutes: 15, severity: "moderate", distance: "0.4 mi", reportsCount: 8, lastReportMinutes: 5, trend: "flat", x: 38, y: 50, hours: "11am – 3am", address: "2300 NW 2nd Ave", liveReporters: 3 },
  { id: "v7", name: "Story Nightclub", category: "nightlife", categoryLabel: "Nightclub", waitMinutes: 35, severity: "moderate", distance: "1.5 mi", reportsCount: 14, lastReportMinutes: 2, trend: "up", x: 80, y: 40, hours: "11pm – 5am", address: "136 Collins Ave", liveReporters: 7 },
  { id: "v8", name: "Jackson Health ER", category: "health", categoryLabel: "Emergency", waitMinutes: 110, severity: "long", distance: "3.2 mi", reportsCount: 9, lastReportMinutes: 8, trend: "up", x: 12, y: 30, hours: "24h", address: "1611 NW 12th Ave", liveReporters: 5 },
  { id: "v9", name: "Fade Lounge", category: "barber", categoryLabel: "Barbershop", waitMinutes: 0, severity: "short", distance: "0.7 mi", reportsCount: 3, lastReportMinutes: 12, trend: "flat", x: 62, y: 70, hours: "10am – 9pm", address: "455 NE 24th St", liveReporters: 1 },
];

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