# SkipTheLine

Real-time, crowd-powered wait times for restaurants, nightlife, barbershops, grocery stores, government offices, healthcare, retail, entertainment, landmarks, and attractions. Know the wait before you go.

## Overview

SkipTheLine helps users discover venues nearby, see live wait times reported by the community, and decide when to go. The app features a welcome screen with auto-rotating hero slides, an interactive home feed with trending and sponsored venue carousels, a map-based discovery view, live report submissions, and an onboarding guided tour.

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (v1) — full-stack React with SSR/SSG
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 with custom design tokens (`src/styles.css`)
- **Language:** TypeScript (strict mode)
- **Routing:** File-based routing via `@tanstack/react-router`

## Project Structure

```
src/
  routes/           # Page routes (file-based routing)
    __root.tsx      # Root layout (shell + providers)
    index.tsx       # Home feed
    welcome.tsx     # Welcome / landing screen
    discover.tsx    # Map-based venue discovery
    explore.tsx     # Explore / live reports
    venue.$id.tsx   # Venue detail page
    profile.tsx     # User profile
    report.tsx      # Submit wait report
  components/       # Reusable UI components
    ui/             # shadcn/ui components
  hooks/            # Custom React hooks
  lib/              # Utilities, mock data, server functions
  styles.css        # Global styles & design tokens
```

## Key Features

- **Welcome Screen** — Full-bleed photo carousel with crossfading category slides, auto-advancing every 4.2 seconds
- **Home Feed** — Trending venues, sponsored carousel (auto-swipe + manual), category chips, live ticker
- **Map Discovery** — Leaflet-based map with venue pins and sheet-based detail views
- **Live Reports** — Real-time emoji-based wait reports from the community
- **Venue Detail** — Full venue info, directions, reviews, wait history, photo gallery
- **Onboarding Tour** — Interactive guided tour for first-time users
- **Push Notifications** — Toast-style notification with dismiss controls
- **Dark / Light Mode** — Theme-aware UI with system preference detection

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Build for production:

```bash
bun run build
```

## Design System

Colors, spacing, and effects are defined as CSS custom properties in `src/styles.css`. All components consume semantic tokens (e.g., `--primary`, `--background`, `--shadow-glow`) rather than hardcoded values. The app uses **Space Grotesk** for display headings and **Plus Jakarta Sans** for body text.

## Shared Preview Flow

The shared preview link (`/welcome`) always opens on the welcome screen. Tapping "Continue with email" enters the app and replays the onboarding tour so reviewers always see the full first-run experience.

## Notes

- This project uses **file-based routing**. New pages are created by adding files to `src/routes/` following the TanStack Start naming convention.
- Mock data lives in `src/lib/mock-data.ts` and drives venue listings, wait times, and reviews.
- The app targets a mobile-first experience with a max-width container (`max-w-md`) centered on larger screens.
