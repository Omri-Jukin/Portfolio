# Portfolio & Personal Website Documentation

## Project Overview
This project is a personal portfolio and blog website built with Next.js, deployed via Cloudflare, and using Drizzle ORM with SQLite for dynamic content. The site is designed for recruiters and personal branding, featuring About, Career Path, Contact, Resume, and Blog sections, as well as a dark mode toggle.

## Directory Structure
- `src/app/` — Main application pages and routing
- `src/components/` — Reusable React components
- `src/lib/drizzle/` — Database (Drizzle ORM) setup and schema
- `public/` — Static assets (images, icons, etc.)
- `roadmap/` — Project documentation (this file)

## Setup Instructions
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run development server:**
   ```bash
   npm run dev
   ```
3. **Lint, format, and type-check:**
   ```bash
   npm run lint
   npm run format
   npm run typecheck
   ```
4. **Run tests:**
   ```bash
   npm run test
   ```

## Deployment
- The project is deployed via Cloudflare (see `wrangler.jsonc` for configuration).
- Ensure environment variables and database setup are configured for production.

## Features
- About, Career Path, Contact, Resume, and Blog pages
- Blog section with dynamic content from SQLite via Drizzle ORM
- Dark mode toggle
- Clean, modular code structure
- High test coverage

## Next Steps
- Follow the TODO list for implementation order
- Update this documentation as the project evolves 