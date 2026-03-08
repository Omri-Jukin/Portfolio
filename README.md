# Portfolio & Blog

A professional, full‑stack personal portfolio and blog built with Next.js and deployed to Cloudflare. It highlights experience, projects, and writing with a fast, visual, and reliable UX.

## Highlights

- Visual hero with a full cobe globe and a prominent profile photo
- Type‑safe APIs (tRPC) with Drizzle ORM on Cloudflare D1
- Internationalization with `next-intl`; accessible, responsive UI with MUI
- Secure secrets via Cloudflare environment bindings

## Tech Stack

- Next.js 15, React 19, TypeScript
- MUI, Tailwind (utility where helpful)
- tRPC, React Query, Zod
- Drizzle ORM, Cloudflare D1
- OpenNext, Cloudflare Workers/Pages, Wrangler

## Project Structure

```
Portfolio/
├── Components/                 # Reusable UI (MUI styled components)
├── src/app/                    # App Router pages, API routes, server code
├── lib/                        # DB client, schema, services
├── public/                     # Static assets
├── roadmap/                    # Consolidated roadmap (see ROADMAP.md)
└── drizzle/                    # Drizzle migrations
```

## Getting Started

- Prerequisites: Node 18+
- Install: `npm install`
- Dev: `npm run dev` → http://localhost:3000

### Environment

- Secrets are stored in Cloudflare (Workers/Pages) as encrypted bindings (AWS, SMTP, JWT, BLOG_API_KEY). Avoid committing secrets to the repo; copy and fill `backend/config/env.example` for local development.
- Core vars: `AUTH_SECRET`/`NEXTAUTH_SECRET`, `DATABASE_URL`/`DIRECT_DATABASE_URL`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`, rate-limit + logging knobs, email provider keys, `BLOG_API_KEY`, and Supabase storage keys (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`).

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Next build
- `npm run lint` – ESLint
- `npm run check` – TypeScript check
- `npm run deploy` – Build + deploy via OpenNext to Cloudflare
- `npm run preview` – Preview deployment locally

### Database & migrations

- Configure `DATABASE_URL`/`DIRECT_DATABASE_URL` (Neon/Supabase/Postgres) before running any Drizzle command.
- Local migration cycle: `npm run db:generate` → `npm run db:migrate` (or `npm run db:update` for generate+migrate+push).
- Health check: `npm run test:db` to validate connectivity before deploy.

### Release checklist

- Preflight: `npm run lint && npm run typecheck && npm test && npm run build`.
- Env/Secrets: ensure Cloudflare bindings + local `.env` mirror `backend/config/env.example`.
- Data: apply migrations (`npm run db:update`) and run `npm run test:db` against the target database.
- Deploy: `npm run nbuild` then `wrangler pages deploy .open-next` (or worker deploy).
- Smoke: hit `/api/health`, `/api/debug` (admin), and key admin flows (login, blog publish).
- Rollback: keep previous build artifact + DB snapshot; disable new deploy via Pages/Workers if smoke fails.

## Testing

- Run: `npm run test`
- Current status: some tests failing; address gradually while keeping focus on user‑visible quality.

## Deployment

- Uses OpenNext to target Cloudflare. Deploy with: `npm run deploy`.
- Ensure Cloudflare environment variables are configured for DB/SMTP/JWT/API keys.

## Documentation

- Roadmap: `roadmap/ROADMAP.md` (single, consolidated plan)
- Project rules: `PROJECT_RULES_AND_MEMORIES.md`

## Notes

- Profile photo can be refined (e.g., watercolor, transparent background) with your preferred image tool.

## License

Personal and proprietary.
