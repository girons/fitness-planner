# Fitness Planner — CLAUDE.md

## Project overview

A personal fitness tracker for a 12-week HIIT programme (1 June – 24 August 2026).
Tracks workouts with Polar HR monitor data, compares sessions over time, and monitors weight progress toward a goal.

**Owner context:**
- Current weight: 106 kg → goal: 90 kg (−16 kg)
- Training: 45-min HIIT with 15 kg dumbbells, 6×/week
- Location: UK — use metric units throughout (kg, kcal, bpm)
- Device: primarily mobile, but also used on laptop browser

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Persistence | localStorage (`fp_workouts`, `fp_weights`) |
| Deployment | GitHub Pages via `peaceiris/actions-gh-pages` |

No backend. All data lives in the browser.

---

## Project structure

```
src/
  App.jsx                  # Root layout — sidebar (desktop) + tab bar (mobile)
  index.css                # Tailwind directives + .input component class

  hooks/
    useWorkouts.js         # CRUD for workouts array in localStorage
    useWeights.js          # CRUD for weights array in localStorage (seeds 106 kg on first load)

  components/
    PlanView.jsx           # 12-week calendar grid, up to 2 workouts/day
    WorkoutsView.jsx       # Chronological list + log button; table layout on desktop
    CompareView.jsx        # Line chart + HR zone bars for repeated workout types
    WeightView.jsx         # Stat cards, progress bar, dual-line chart, weight log
    CaloriesView.jsx       # Static nutrition guide (2,300 kcal/day target)
    WorkoutModal.jsx       # Shared modal for logging/editing a workout (all Polar fields)
```

---

## Data models

```typescript
interface Workout {
  id: number;           // Date.now() timestamp
  date: string;         // "YYYY-MM-DD"
  name: string;         // e.g. "Workout 1"
  duration: number;     // minutes
  hrAvg: number;        // bpm
  hrMax: number;        // bpm
  calories: number;     // kcal
  fatPct: number;       // %
  zones: [number, number, number, number, number]; // minutes in Z1–Z5
  notes: string;
}

interface WeightEntry {
  date: string;   // "YYYY-MM-DD"
  kg: number;
}
```

localStorage keys: `fp_workouts` (array), `fp_weights` (array, seeded with `{ date: "2026-06-01", kg: 106 }`).

---

## Key design decisions

- **Up to 2 workouts per day** on the calendar. Tapping an empty day opens the log modal directly. Tapping a day with existing workouts opens a `DaySheet` bottom sheet showing the existing sessions with Edit links and an "+ Add second workout" button (hidden once limit is reached).
- **Responsive layout**: desktop (≥768px) uses a fixed left sidebar (`w-52`) with vertical nav; mobile uses a top tab bar. All views use `max-w-4xl mx-auto` with responsive padding — no mobile-only width caps.
- **Accent colour**: `#E24B4A` (configured as `accent` in `tailwind.config.js`, usable as `bg-accent`, `text-accent`, etc.)
- **HR zone colours**: Z1 grey · Z2 blue · Z3 green · Z4 amber · Z5 red
- **Target weight trajectory**: linear from 106 kg on 1 Jun to 90 kg on 24 Aug, plotted as a green dashed line alongside actual weight (red).
- **Calendar base**: `new Date('2026-06-01T00:00:00')` — always Monday week 1, 12 weeks exactly.
- **Vite base path**: `/fitness-planner/` — required for GitHub Pages subdirectory routing.

---

## Design style

- Flat, minimal — no heavy gradients or shadows
- White cards with `border border-gray-100 rounded-xl` (or `rounded-2xl` for larger sections)
- `bg-gray-50` for alternating rows / section headers
- Mobile-first Tailwind classes, override with `md:` prefix for desktop

---

## Development

```bash
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

---

## Deployment

- **Repo**: https://github.com/girons/fitness-planner
- **Live URL**: https://girons.github.io/fitness-planner/
- GitHub Actions workflow at `.github/workflows/deploy.yml` builds on every push to `main` and deploys `dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`.
- GitHub Pages is configured to serve from the `gh-pages` branch.
- The workflow uses `npm install` (not `npm ci`) because the lock file is generated on macOS and the CI runner is Linux — `npm ci` fails on cross-platform optional dependency mismatches.

---

## Plan dates

| | Date |
|---|---|
| Week 1 starts | Monday 2 June 2026 |
| Week 12 ends | Sunday 24 August 2026 |
| Today (when built) | 1 June 2026 |
