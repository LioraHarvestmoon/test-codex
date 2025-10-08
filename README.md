# Brand Intelligence Explorer

A ready-to-run Next.js (App Router) + TypeScript project that aggregates brand intelligence from multiple mocked providers, merges the results with confidence scoring, and renders an interactive dashboard using Tailwind CSS and shadcn-inspired UI primitives. React Query handles caching/state, Zod secures all I/O boundaries, and Vitest covers core behaviors.

## Features

- **Next.js App Router** with React Query provider wrapper and memory caching on the server API route.
- **Mocked providers** (`wiki`, `ecommerce`, `social`, `internal`) that can be replaced with live APIs later (`// TODO(api)` markers included).
- **Zod schemas** that type BrandProfile inputs/outputs and power validation in the API handler and tests.
- **Tailwind CSS + shadcn/ui primitives** (Button, Card, Input, Tabs, Badge, Table, Tooltip, Skeleton) for consistent UI.
- **React Query** mutation flow with loading skeletons, error handling, and demo data banner.
- **Vitest + Testing Library** with API, merge-logic, and UI behavior tests.
- **ESLint + Prettier + typecheck** wired into `npm run check` for self-inspection.

## Getting Started

### Prerequisites

- Node.js 18.17+ (Next.js 14 requirement)
- npm 9+ (or a compatible package manager)

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and try the preset buttons (Anker, Nike, DJI). Without real provider credentials the UI displays a "Demo data" badge.

### Build & Production

```bash
npm run build
npm run start
```

### Quality & Self-check Commands

Run the aggregated self-check pipeline:

```bash
npm run check
```

This executes:

1. `npm run typecheck` – strict TypeScript validation
2. `npm run lint` – ESLint with Next.js + Prettier rules
3. `npm run test` – Vitest suite (API contract, merge scoring, UI behavior)

### Targeted Scripts

- `npm run test:watch` – interactive Vitest mode
- `npm run lint` – ESLint only
- `npm run typecheck` – `tsc --noEmit`

## Provider Configuration

Current behavior always uses mocked data. To integrate real data sources, set the following environment flag when the providers are implemented:

```bash
# .env.local
ENABLE_REAL_PROVIDERS=true
```

Each provider file (`src/providers/*.ts`) contains `// TODO(api)` markers showing the insertion points for real API calls (encyclopedia, marketplace, social listening, internal CRM). Swap the mock loaders with network requests conditioned on `process.env.ENABLE_REAL_PROVIDERS`.

## Editing Internal Experience Notes

The internal provider reads `src/providers/internal-data.json`. Update conversion insights, promos, and notes here to inject first-party expertise. After edits, restart the dev server (or invalidate the cache by waiting 5 minutes) to see the changes.

```json
{
  "brands": {
    "anker": {
      "conversion": { "estStrength": "strong" },
      "sources": [{ "label": "Internal playbook", "confidence": 0.8 }]
    }
  }
}
```

## Troubleshooting

- **No data / API errors**: The UI surfaces a red error card. Confirm the API route logs in the terminal. When running without live credentials the system falls back to mock data automatically.
- **Cross-origin issues**: Not expected in local mode; the API is served from the same Next.js instance. If deploying behind a proxy ensure `/api/brand` is reachable and CORS headers are configured when calling from a different origin.
- **Type errors**: Run `npm run typecheck` to identify schema mismatches. Most provider outputs go through `brandProfileSchema` so the stack trace points to the offending field.
- **Stale internal notes**: The API caches responses for 5 minutes. Clear the cache by restarting the dev server or editing `CACHE_TTL_MS` in `src/app/api/brand/route.ts` during development.

## Project Structure

```
src/
  app/
    globals.css           # Tailwind entry point
    layout.tsx            # Root layout with React Query provider
    page.tsx              # Interactive search page
    api/brand/route.ts    # POST endpoint merging provider data
  components/
    BrandSearch.tsx
    BrandSummary.tsx
    KPIStat.tsx
    CardSection.tsx
    ConfidenceTag.tsx
    SourceList.tsx
    Providers.tsx
    ui/                   # shadcn-inspired primitives
  lib/
    schema.ts
    merge.ts
    scoring.ts
    timeWindows.ts
    mock.ts
  providers/
    wiki.ts
    ecommerce.ts
    social.ts
    internal.ts
    internal-data.json
  mock/
    anker.json
    nike.json
    default.json
  styles/
    globals.css
```

Tests live in `tests/` and cover API, merge logic, and UI rendering.

## Mock Data

- `src/mock/anker.json`
- `src/mock/nike.json`
- `src/mock/default.json`

Each file conforms to `BrandProfile` and powers the mocked providers.

## Developer Self-checklist

- [ ] `npm run check` passes (typecheck, lint, test)
- [ ] `npm run dev` serves the dashboard, preset brands load successfully
- [ ] API `POST /api/brand` with `{ "brandName": "Anker" }` returns a schema-valid `BrandProfile`
- [ ] UI renders demo badge when `ENABLE_REAL_PROVIDERS` is unset
- [ ] Internal notes editable via `src/providers/internal-data.json`
