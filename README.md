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
- Secrets are stored in Cloudflare (Workers/Pages) as encrypted bindings (AWS, SMTP, JWT, BLOG_API_KEY). Avoid committing secrets to the repo; keep `.env.example` placeholders if needed for local.

## Scripts
- `npm run dev` – Start dev server
- `npm run build` – Next build
- `npm run lint` – ESLint
- `npm run check` – TypeScript check
- `npm run deploy` – Build + deploy via OpenNext to Cloudflare
- `npm run preview` – Preview deployment locally

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
