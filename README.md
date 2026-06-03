# Aether — Next-Gen Student Learning Dashboard

A high-fidelity **Bento Grid** student dashboard built for the Frontend Intern Challenge. Features server-rendered live data from Supabase, hardware-accelerated Framer Motion animations with spring physics, and a dark glassmorphism design system.

🔗 **Live Demo**: [nextgen-learning-dashboard-delta.vercel.app](https://nextgen-learning-dashboard-delta.vercel.app)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| SSR Client | `@supabase/ssr` |
| Deployment | Vercel |

---

## Architecture: Server / Client Component Split

```
app/dashboard/page.tsx          ← Server Component (RSC)
  │  getCourses() via @supabase/ssr
  │  Passes data as props ↓
  └─ DashboardClient.tsx         ← Client Component ("use client")
       ├─ Sidebar.tsx            ← layoutId spring nav highlight
       └─ BentoGrid.tsx          ← staggerChildren container
            ├─ BentoGridItem     ← spring entrance + spring hover
            │    ├─ HeroTile     ← greeting, streak, daily quote
            │    └─ ActivityTile ← contribution heatmap (SSR-disabled)
            └─ CourseCard ×N     ← motion.article, spring progress bar
```

### Why this split?

**Server Components** (`page.tsx`, `lib/actions.ts`, `lib/supabase.ts`) run exclusively on the server — they have access to `process.env` secrets, perform the Supabase query, and ship zero JavaScript to the client. This means the first HTML response already contains the rendered course data (no client-side waterfall).

**Client Components** handle all interactivity: tab switching, Framer Motion animations, hover states, and the date/quote display (which must run in the browser to avoid hydration mismatches from `new Date()`).

The `ActivityTile` is dynamically imported with `ssr: false` because it uses browser-only `requestAnimationFrame` logic and would cause a hydration mismatch if SSR'd.

---

## Animation Design

### Staggered Entrance
`BentoGrid` uses Framer Motion `variants` with `staggerChildren: 0.12`. Each `BentoGridItem` and `CourseCard` declares a `hidden → visible` variant, so they cascade in sequentially — fading in while translating 30px upward on the Y axis.

### Spring Physics
All entrance and hover transitions use `type: "spring", stiffness: 300, damping: 20` — producing a natural, non-linear deceleration instead of a CSS cubic-bezier curve.

### Zero Layout Shifts
Every hover and entrance animation touches **only `transform` (scale, translateY) and `opacity`**. No `width`, `height`, `margin`, `padding`, or `top/left` properties are animated, which keeps the browser in the compositor thread and eliminates layout repaints.

### Sidebar `layoutId`
The active nav highlight is a shared `motion.div` with `layoutId="active-tab"`. When you switch tabs, Framer Motion automatically calculates the delta between the old and new positions and animates between them using spring physics — without any manual position calculation.

### Progress Bars
Each course card's progress bar animates from `width: 0%` to `width: {progress}%` using `type: "spring", stiffness: 80, damping: 15`, delayed by the card's index to reinforce the stagger.

---

## Data Integration

### Supabase Schema

```sql
create table courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  progress      integer not null check (progress between 0 and 100),
  icon_name     text not null,
  created_at    timestamp with time zone default now(),
  -- Extended fields (optional, gracefully fallback if absent)
  subject       text default 'General',
  color         text default 'purple',
  lessons_total integer default 20,
  lessons_done  integer default 0,
  instructor    text default 'Instructor'
);

-- Enable RLS + allow anon read
alter table courses enable row level security;
create policy "anon_select" on courses for select to anon using (true);
grant select on courses to anon;
```

### Loading States
`app/dashboard/loading.tsx` renders a full skeleton grid (via `SkeletonBentoGrid`) that matches the real layout exactly — same column spans, same card heights — so there is no visual jump when data resolves.

### Error Handling
If Supabase is unreachable or the table doesn't exist, `getCourses()` catches the error, logs a warning, and returns 8 high-fidelity fallback courses. The UI never crashes or shows an error screen on first load.

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> The anon key is safe for `NEXT_PUBLIC_` because Supabase RLS restricts which rows it can read. It cannot perform writes unless an explicit INSERT policy exists.

---

## Responsive Behaviour

| Breakpoint | Sidebar | Grid |
|---|---|---|
| Desktop `> 1024px` | Full sidebar (icons + labels) | 4-column bento |
| Tablet `768–1024px` | Icon-only sidebar (`w-20`) | 2-column bento |
| Mobile `< 768px` | Hidden; bottom nav bar | Single-column scroll |

---

## Challenges Faced

### 1. Next.js 15 Async Cookie Store
`@supabase/ssr`'s `createServerClient` requires synchronous cookie access, but Next.js 15 made `cookies()` return a `Promise`. The fix was to `await cookies()` before passing it to `createServerClient`, and mark the wrapper function `async`.

### 2. Hydration Mismatches from `new Date()`
`HeroTile` originally rendered the current date on the server and client. Since the server renders during build/request time and the client renders milliseconds later, React threw a hydration mismatch. Fix: moved date formatting into a `useEffect` with an empty initial state (`""`), so the server always renders an empty string and the client fills it in after mount.

### 3. ActivityTile SSR Incompatibility
The heatmap uses `requestAnimationFrame` and canvas-like DOM measurements. Running this on the server would crash with "window is not defined". Fix: `next/dynamic` with `ssr: false` — the server ships a placeholder skeleton, the client hydrates and mounts the real tile.

### 4. Framer Motion `layoutId` Across Tab Re-renders
When `AnimatePresence` unmounts a tab and remounts another, shared `layoutId` elements can flicker if not wrapped correctly. Fix: ensured the `layoutId="active-tab"` div is always rendered inside the same `AnimatePresence` boundary, with a stable `key` on the outer animated wrapper.

### 5. Tailwind v4 Config Differences
Tailwind CSS v4 removed `tailwind.config.js` and replaced it with CSS-native `@theme` blocks inside `globals.css`. All custom design tokens (colors, animations, keyframes) were migrated to the `@theme {}` block.

---

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

To seed the Supabase database, run the SQL in [`supabase/seed.sql`](./supabase/seed.sql) in your Supabase SQL Editor.
