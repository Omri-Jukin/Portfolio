# Portfolio Guide — Next 15 · React 19 · **MUI** · Payload v3 · **tRPC** (SSR-first, MPA)

> **This doc is the contract.** If any other prompt conflicts, **this doc wins**. Cursor must follow the **Execution Protocol** below.

---

## 0) Execution Protocol (Cursor must obey)

```md
- Treat this file as the SINGLE source of truth.
- Before coding: print a 6-line PLAN (what/why/files/test/risks/rollback).
- After each task: run `npm run lint`, then print a CHANGE SUMMARY (files changed, warnings).
- Do NOT add Tailwind/shadcn or Pages Router. Design system is **MUI** only.
- Prefer server components + Actions + tRPC callers. No client fetch for content pages.
- Destructive ops require an inline approval comment: `// APPROVED_BY: Omri <date> <reason>`.
```

---

## 1) Project Intent (MPA, SSR-first)

- Modern, minimal aesthetic (agency polish, one accent).
- **MUI** components (you already have a kit).
- **tRPC** for app logic (auth, approvals, admin), optional wrapping of Payload reads.
- **Payload v3** for content (Projects, Posts/Blog, Pages, Skills, Experience, Certifications, Testimonials, Categories, Media; Globals: Home, Navigation).
- **No Pages Router**. App Router only.

---

## 2) Kept / Added / Trimmed (visual)

### ✅ Kept
- Clean/minimal UI, bold hero, projects with impact, skills grid, experience timeline, testimonials, contact/socials.
- Stack: Next 15, React 19, **MUI**, Payload v3, **tRPC**, Cloudflare D1 (users/approvals), SSR-first.

### 🚀 Added
- **Positioning bar** under hero (3 bullets with real metrics).
- **Case-study template** for project detail: *Problem → Approach → Architecture diagram → Stack → Before/After metrics → What’s next*.
- **Live proof** (PSI/Lighthouse/p95/error rate snapshots).
- **Code credibility**: small focused snippet per project (tRPC/router or perf component).
- **Process** page; optional **Services** cards.
- **Certifications** page (what it enabled).
- **/projects filters** (Category/Skill/Impact).
- **Downloadables**: PDF resume & one-pagers.
- **SEO & A11y**: JSON-LD, canonical/OG, sitemap/RSS; solid focus states.
- **Spam-safe** contact (server Action + tRPC w/ honeypot & timing).

### 🧹 Trimmed
- Logo walls → **micro case studies**.
- Generic “clean code” claims → **metrics**.
- Heavy JS carousels/animations → CSS scroll-snap + subtle MUI transitions.

---

## 3) Information Architecture

```
/
├─ /projects
│   └─ /projects/[slug]   (case-study template)
├─ /experience
├─ /skills
├─ /certifications
├─ /blog
│   └─ /blog/[slug]
├─ /about      (philosophy + process)
└─ /contact    (server action + tRPC)
```

**Home wireframe (ASCII)**  
Hero → Positioning bar → Featured Projects → Testimonials → Skills snapshot → Experience highlights → CTA strip

---

## 4) Tech & Repo Layout

```
<root>/
  portfolio/                  # NEW project folder
    src/
      app/
        (payload)/            # /admin + /api/*
          api/trpc/[trpc]/route.ts
          admin/              # Payload admin
        (my-app)/             # Public MPA
          layout.tsx
          page.tsx
          projects/page.tsx
          projects/[slug]/page.tsx
          posts/page.tsx
          posts/[slug]/page.tsx
          pages/[slug]/page.tsx
          about/page.tsx
          contact/page.tsx
        ThemeRegistry.tsx     # MUI + Emotion SSR
      components/
        <ComponentName>/
          <ComponentName>.tsx
          <ComponentName>.type.ts
          <ComponentName>.style.tsx
          <ComponentName>.util.ts
      server/trpc/
        context.ts
        init.ts
        routers/{index,auth,users,projects,posts,testimonials}.ts
      lib/                    # payload client, d1 drizzle, utils
      styles/                 # global.css, fonts
    payload.config.ts
    drizzle/{schema.ts,migrations/}
    next.config.mjs
    .env / .env.example
    package.json
    README.md
```

**Create in `./portfolio/` and copy from parent (if present):**

- Copy: `.editorconfig`, `.gitignore`, `LICENSE`, `README.md`, `public/` assets, **MUI components** under `src/components/**`, generic `src/styles/*`, utilities in `src/lib/*` (do not overwrite newer files).
- **Do NOT copy**: `.env*`, `node_modules`, build artifacts, Payload config files, Tailwind/shadcn bits.
- After copying: `npm i` → `npm run lint`.

---

## 5) Design System (MUI-only, App Router safe)

- Emotion engine w/ SSR: `ThemeRegistry.tsx` using `useServerInsertedHTML`.
- Prefer `sx` & `styled()`; avoid legacy `makeStyles`.
- Keep your component folder convention.
- Subtle transitions (`Fade/Grow/Collapse`) only.

---

## 6) Data & Content

- **Payload Collections**: Projects, Posts, Pages (modular), Skills, WorkExperience, Certifications, Testimonials, Categories, Media.  
- **Globals**: Home (featured arrays), Navigation.
- Projects include: `problem/approach/impact`, `metrics[]`, `roles[]`, `skills[]`, `categories[]`.

**Reads:** SSR in server components (optionally via tRPC caller).  
**Writes:** React 19 **Actions → tRPC**; then `revalidatePath/Tag`.

---

## 7) tRPC (server-first)

- Mount at `/api/trpc` in `(payload)` route group (Node runtime).
- `context.ts` attaches `user` (JWT), `d1` (Drizzle), `payload` (Local API), and `revalidatePath/Tag`.
- Middlewares: `authedProcedure`, `adminProcedure`.
- Routers: `auth`, `users`, `projects`, `posts`, `testimonials` (+ others as needed).
- **Server callers** in RSC/pages: `appRouter.createCaller(ctx)`.

---

## 8) Contact & Security

- Contact form: server Action → tRPC → mail/send/store; honeypot field + timing guard; rate limit in tRPC middleware.
- JWT (httpOnly cookie); role checks on admin pages; CSRF token on Actions if needed.
- Uploads: size/mime validation; strip EXIF; generate sizes.

---

## 9) SEO & A11y

- JSON-LD (`Person`, `Project`, `Article`), canonical URLs, OG meta, sitemap, RSS for blog.
- Contrast AA+; keyboard nav; skip links; reduced motion support.

---

## 10) Dev Workflow

- **Minimum gate each task**: `npm run lint` (build only for PRs/CI).
- Conventional Commits; small PRs; Change Summary after edits.
- Migrations note whenever schema changes (Payload/Drizzle).

---

## 11) Conflict-Removal Checklist (apply now)

Cursor, perform these edits **before coding**:

1. **Remove/replace all Tailwind/shadcn references** with **MUI** equivalents.  
2. **Delete any Pages Router mentions**; ensure App Router only.  
3. **Ensure “no client fetch for content”** is stated; use server components + Actions + tRPC.  
4. **Enforce component folder convention** (`.tsx/.type.ts/.style.tsx/.util.ts`).  
5. **Parent copy rules**: allow copying MUI components; block Tailwind assets; never copy envs.  
6. **Keep D1 for users/auth**; Payload for content; no attempt to point Payload at D1.

Print a short diff-style summary of removed/changed lines.

---

## 12) Page Requirements (for implementation)

### `/`
- Hero (outcome-first headline), subhead (stack), CTA.
- Positioning bar (3 bullets: speed/reliability/maintainability with metrics).
- 3 Featured projects (card: image, impact line, stack chips, link → case study).
- 2–3 Testimonials.
- Skills snapshot (category badges).
- Experience highlights (company/role/quant win).
- CTA strip (“Work together?”).

### `/projects`
- Filter bar (Category/Skill/Impact). SSR.  
- Grid of cards. Pagination or “load more” (server action).

### `/projects/[slug]`
- Case-study template block order (as above).
- Related testimonials.

### `/experience`, `/skills`, `/certifications`
- Grid/timeline with concise copy; links to relevant projects.

### `/blog`, `/blog/[slug]`
- ISR lists; SSR detail; reading time; code highlighting.

### `/about`
- Philosophy + process (RFC → slice → measure → iterate).

### `/contact`
- Server Action + tRPC; success/failure feedback; anti-spam.

---

## 13) Copy Standards

- **Project subline:** “Cut p95 by 47% + reduced errors 63% after streaming SSR + CDN tuning.”  
- **Case study CTA:** “Read the architecture →” (anchors to diagram block).  
- **Testimonials intro:** “What people say after shipping with me.”

---

## 14) Cursor Checklists

**Bootstrap**
- [ ] Create `portfolio/` & scaffold Payload website template  
- [ ] Copy allowed assets from parent (without overwriting critical files)  
- [ ] Add `ThemeRegistry.tsx`, wrap `(my-app)/layout.tsx`  
- [ ] Create `server/trpc/*` + `/api/trpc` route  
- [ ] Run `npm i` → `npm run lint` → output Change Summary

**Content wiring**
- [ ] Implement collections/globals (as spec) in `payload.config.ts`  
- [ ] Hook revalidation on publish/update  
- [ ] Build `/`, `/projects`, `/projects/[slug]` with SSR + MUI

**Admin & auth**
- [ ] tRPC auth routes; approvals flow; admin users page  
- [ ] Contact form via Action → tRPC with rate-limit

**SEO/A11y**
- [ ] JSON-LD + OG + sitemap + RSS  
- [ ] Focus states, contrast, skip links

---

## 15) Non-Negotiables (Guardrails)

- **App Router only**.  
- **MUI only** for UI (no Tailwind/shadcn/emotion swaps).  
- **Server components + Actions + tRPC** for page data.  
- **No destructive ops** without `// APPROVED_BY: Omri …`.  
- After each task: **PLAN** → **EXECUTE** → **LINT** → **CHANGE SUMMARY**.

---

### Appendix: What to copy from the parent repo
- ✅ `src/components/**` (MUI-based only), `src/styles/**` (generic), `public/**`, `.editorconfig`, `.gitignore`, `LICENSE`, `README.md`, `src/lib/**`.  
- ❌ `.env*`, `node_modules`, build artifacts, Payload config, Tailwind/shadcn assets.

---

**End of contract.** If Cursor cannot comply, it must stop and ask one precise question.
