# ديار الأحلام — Dayar Al-Ahlam

A luxury Arabic real estate platform for apartment rentals with a full admin panel, dark gold-on-black design, and rich animations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/dayar-al-ahlam run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Framer Motion + TailwindCSS + wouter + react-hook-form
- API: Express 5 + cookie-session
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/db/src/schema/apartments.ts` — Apartments DB schema
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/dayar-al-ahlam/src/` — React frontend

## Architecture decisions

- Admin credentials are hardcoded (`yezen57` / `12356789`) — change in `artifacts/api-server/src/routes/admin.ts`. Note in prod, move to env vars.
- Session stored via `cookie-session` (signed cookie, no DB session store).
- Images stored as text[] URLs in Postgres — no object storage on first build.
- RTL layout enforced at `index.html` level (`dir="rtl"`, `lang="ar"`, `class="dark"`).
- Dark mode only — no light mode toggle.

## Product

- **Homepage**: Hero with brand logo, animated stats counter, featured apartments
- **Apartments**: Full browse/search/filter by city, district, status, price with pagination
- **Apartment detail**: Image gallery, pricing table (day/week/month), contact CTA
- **Admin panel** at `/admin`: Hidden behind login (yezen57/12356789) — manage all apartments

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Run `pnpm --filter @workspace/db run push` after changing `lib/db/src/schema/`
- The `@assets` alias in Vite points to `attached_assets/` — logo files are there
- Cookie session requires `SESSION_SECRET` env var in production

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
