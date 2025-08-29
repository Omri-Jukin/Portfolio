# Portfolio Implementation Todolist

> **Status**: In Progress
> **Last Updated**: December 2024
> **Guideline Source**: [PORTFOLIO_CONSOLIDATED_MUI_TRPC.md](./PORTFOLIO_CONSOLIDATED_MUI_TRPC.md)

---

## 🚀 COMPLETED TASKS

### ✅ Bootstrap & Project Setup

- [x] **Create `portfolio/` directory** - New project folder created
- [x] **Scaffold Payload website template** - Basic Next.js 15 + React 19 structure
- [x] **Copy allowed assets from parent** - MUI components, generic styles, utilities copied
- [x] **Add `ThemeRegistry.tsx`** - MUI + Emotion SSR setup with proper cache handling
- [x] **Wrap `(my-app)/layout.tsx`** - ThemeRegistry integrated into root layout
- [x] **Remove Tailwind/shadcn** - Deleted `tailwind.config.js` and `postcss.config.js`
- [x] **Remove custom import aliases** - Fixed `imports` field causing module resolution issues
- [x] **Run `npm i`** - Dependencies installed (tRPC, MUI, Payload, Drizzle, etc.)
- [x] **Copy ESLint config** - `eslint.config.mjs` copied from parent directory

### ✅ Core Pages Implementation

- [x] **Home page (`/`)** - Refactored to MUI-only with:
  - Hero section with gradient background
  - Positioning bar (3 metrics: 47%, 99.9%, 3x)
  - Featured projects grid with cards
  - Testimonials section
  - CTA strip
- [x] **Projects page (`/projects`)** - Created with:
  - Header with gradient title
  - Project grid using MUI Grid and Card components
  - Placeholder project data (ready for Payload integration)
- [x] **About page (`/about`)** - Implemented with:
  - Philosophy section
  - Process timeline using MUI Lab Timeline components
  - Core values grid
- [x] **Contact page (`/contact`)** - Created with:
  - Contact form integration
  - Contact information display
  - Grid layout for form and info

### ✅ Component Migration & Fixes

- [x] **Convert components to MUI-only**:
  - `SkillsGrid` - Converted from Tailwind to MUI Box with grid layout
  - `Loading` - Converted to MUI CircularProgress and Box
  - `Badge` - Converted to MUI Chip component
  - `About` - Fixed tRPC client usage and imports
  - `Header` - Fixed import paths for theme and components
  - `LanguageSwitcher` - Fixed i18n import path
  - `Typography` - Fixed styles import path
- [x] **Fix import path issues** - Resolved all custom alias imports (`#/`, `~/`, `$/`, `!/`)
- [x] **Fix tRPC client usage** - Updated from `api.skills.getAll.useQuery` to `trpc.skills.getAll.useQuery`
- [x] **Fix component exports** - Corrected named vs default exports across components

### ✅ MUI Design System

- [x] **ThemeRegistry setup** - Complete Emotion cache + MUI theme integration
- [x] **Custom theme** - Primary/secondary colors, typography, button overrides
- [x] **SSR-safe styling** - `useServerInsertedHTML` for proper hydration
- [x] **Component styling** - Consistent use of `sx` props and MUI components

---

## 🔄 IN PROGRESS

### 🚧 tRPC Setup

- [ ] **Create `server/trpc/*` structure** - Need to implement:
  - `context.ts` - User auth, D1, Payload, revalidation
  - `init.ts` - tRPC initialization
  - `routers/` - Auth, users, projects, posts, testimonials
- [ ] **Create `/api/trpc` route** - Mount tRPC at correct endpoint
- [ ] **Implement server callers** - For RSC/pages data fetching

---

## ❌ PENDING TASKS

### 🔴 Bootstrap (Remaining)

- [ ] **Create `server/trpc/*` + `/api/trpc` route** - Core tRPC infrastructure
- [ ] **Run `npm run lint`** - Verify all linting issues resolved
- [ ] **Final Change Summary** - Document all completed work

### 🔴 Content Wiring

- [ ] **Implement collections/globals in `payload.config.ts`**:
  - Projects, Posts, Pages, Skills, WorkExperience
  - Certifications, Testimonials, Categories, Media
  - Home and Navigation globals
- [ ] **Hook revalidation on publish/update** - ISR and cache invalidation
- [ ] **Build dynamic routes with SSR**:
  - `/projects/[slug]` - Case study template
  - `/posts/[slug]` - Blog post detail
  - `/pages/[slug]` - Dynamic page content

### 🔴 Admin & Authentication

- [ ] **tRPC auth routes** - JWT handling, user management
- [ ] **Approvals flow** - Admin user approval system
- [ ] **Admin users page** - User management interface
- [ ] **Contact form via Action → tRPC** - Server action with rate limiting
- [ ] **Anti-spam measures** - Honeypot, timing guards, validation

### 🔴 SEO & Accessibility

- [ ] **JSON-LD structured data** - Person, Project, Article schemas
- [ ] **Open Graph meta tags** - Social media optimization
- [ ] **Sitemap generation** - XML sitemap for search engines
- [ ] **RSS feed** - Blog subscription functionality
- [ ] **Focus states** - Keyboard navigation support
- [ ] **Contrast compliance** - AA+ accessibility standards
- [ ] **Skip links** - Screen reader navigation
- [ ] **Reduced motion support** - Accessibility preference

### 🔴 Additional Pages

- [ ] **Experience page (`/experience`)** - Work history timeline
- [ ] **Skills page (`/skills`)** - Detailed skills showcase
- [ ] **Certifications page (`/certifications`)** - Professional certifications
- [ ] **Blog pages (`/blog`, `/blog/[slug]`)** - Blog listing and detail

### 🔴 Advanced Features

- [ ] **Project filters** - Category/Skill/Impact filtering
- [ ] **Case study template** - Problem → Approach → Architecture → Stack → Metrics → Next steps
- [ ] **Live proof metrics** - PSI/Lighthouse/p95/error rate snapshots
- [ ] **Code credibility snippets** - Focused code examples per project
- [ ] **Downloadables** - PDF resume and one-pagers
- [ ] **Process page** - Development methodology
- [ ] **Services cards** - Service offerings display

---

## 📊 PROGRESS SUMMARY

**Overall Completion**: ~35%

- **Bootstrap**: 80% ✅
- **Core Pages**: 70% ✅
- **Components**: 85% ✅
- **MUI Design**: 90% ✅
- **tRPC Setup**: 10% ❌
- **Content Management**: 0% ❌
- **Admin & Auth**: 0% ❌
- **SEO & A11y**: 0% ❌

---

## 🎯 NEXT PRIORITIES

1. **Complete tRPC setup** - This is blocking content integration
2. **Implement Payload collections** - Core content management
3. **Build dynamic routes** - Project and blog detail pages
4. **Add authentication** - User management and admin access
5. **Implement contact form** - Server action with tRPC backend

---

## 📝 NOTES & ISSUES

### Resolved Issues

- ✅ Custom import aliases causing module resolution failures
- ✅ Tailwind CSS completely removed
- ✅ Component export/import mismatches fixed
- ✅ MUI Grid API compatibility issues resolved
- ✅ tRPC client usage corrected

### Current Challenges

- 🔴 Need to implement full tRPC server infrastructure
- 🔴 Payload CMS configuration pending
- 🔴 Database schema and migrations not yet set up

### Technical Debt

- Some placeholder data still in place (projects, testimonials)
- Need to implement proper error boundaries
- Performance optimization (lazy loading, image optimization)

---

## 🔗 RELATED FILES

- **Guidelines**: [PORTFOLIO_CONSOLIDATED_MUI_TRPC.md](./PORTFOLIO_CONSOLIDATED_MUI_TRPC.md)
- **Project Root**: `../portfolio/`
- **Key Components**: `../portfolio/src/components/`
- **Pages**: `../portfolio/src/app/(my-app)/`
- **Configuration**: `../portfolio/package.json`, `../portfolio/payload.config.ts`

---

_Last updated: December 2024_
_Status: Active Development_
