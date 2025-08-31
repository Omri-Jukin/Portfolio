# Portfolio Implementation Todolist

> **Status**: In Progress - Core Infrastructure Incomplete
> **Last Updated**: December 2024
> **Guideline Source**: [PORTFOLIO_CONSOLIDATED_MUI_TRPC.md](./PORTFOLIO_CONSOLIDATED_MUI_TRPC.md) > **Migration Target**: Move from `./portfolio/` to parent directory as new main portfolio

---

## 🚀 COMPLETED TASKS

### ✅ Bootstrap & Project Setup

- [x] **Create `portfolio/` directory** - New project folder created
- [x] **Scaffold Payload website template** - Basic Next.js 15 + React 19 structure
- [x] **Copy allowed assets from parent** - MUI components, generic styles, utilities copied
- [x] **Remove Tailwind/shadcn** - Deleted `tailwind.config.js` and `postcss.config.js`
- [x] **Remove custom import aliases** - Fixed `imports` field causing module resolution issues
- [x] **Run `npm i`** - Dependencies installed (tRPC, MUI, Payload, Drizzle, etc.)
- [x] **Copy ESLint config** - `eslint.config.mjs` copied from parent directory

### ✅ Core Pages Implementation

- [x] **Projects page (`/projects`)** - Created with:
  - Header with gradient title
  - Project grid using MUI Grid and Card components
  - Placeholder project data (ready for Payload integration)
- [ ] **Home page (`/`)** - NEEDS IMPLEMENTATION:
  - Hero section with gradient background
  - Positioning bar (3 metrics: 47%, 99.9%, 3x)
  - Featured projects grid with cards
  - Testimonials section
  - CTA strip
- [ ] **About page (`/about`)** - NEEDS IMPLEMENTATION:
  - Philosophy section
  - Process timeline using MUI Lab Timeline components
  - Core values grid
- [ ] **Contact page (`/contact`)** - NEEDS IMPLEMENTATION:
  - Contact form integration
  - Contact information display
  - Grid layout for form and info

### ✅ Dynamic Routes & Case Study Templates

- [x] **Project detail page (`/projects/[slug]`)** - Complete case study template with:
  - Problem → Approach → Architecture → Stack → Metrics → Next steps
  - Before/after metrics comparison with visual indicators
  - Tech stack and skills applied
  - Architecture diagram placeholder
  - Live demo and GitHub links
- [x] **Blog listing page (`/blog`)** - Featured posts and full listing with:
  - Reading time calculation
  - Category and tag filtering
  - Responsive grid layout
- [x] **Blog detail page (`/blog/[slug]`)** - Article display with:
  - Rich content rendering
  - Meta information (author, date, reading time)
  - Tag system and sidebar

### ✅ tRPC Infrastructure

- [x] **Create `server/trpc/*` structure** - Partial tRPC server setup with:
  - `context.ts` - User auth, procedures, and middleware
  - `init.ts` - tRPC initialization and base procedures
  - `routers/` - Partial router modules (auth, users, testimonials implemented)
- [ ] **Create `/api/trpc` route** - NEEDS IMPLEMENTATION: `/api/trpc/[trpc]/route.ts`
- [ ] **Implement server callers** - NEEDS IMPLEMENTATION: For RSC/pages data fetching
- [ ] **Router structure** - NEEDS COMPLETION: Missing projects, posts, skills, index routers
- [x] **Authentication system** - Login, registration, and user approval workflow (backend only)

---

## 🔄 IN PROGRESS

### 🚧 Content Management Integration

- [ ] **Connect tRPC to dynamic routes** - Replace mock data with actual tRPC calls
- [ ] **Implement ISR and revalidation** - Cache management for dynamic content

---

## ❌ PENDING TASKS

### 🔴 Critical Missing Infrastructure

- [ ] **ThemeRegistry.tsx** - MUI + Emotion SSR setup (required for MUI to work)
- [ ] **Root layout.tsx** - Main application layout with ThemeRegistry
- [ ] **tRPC API route** - `/api/trpc/[trpc]/route.ts` endpoint
- [ ] **tRPC client setup** - Frontend tRPC provider and client
- [ ] **Missing tRPC routers** - projects.ts, posts.ts, skills.ts, index.ts
- [ ] **Missing core pages** - Home page, About page, Contact page
- [ ] **Missing components** - Header, Footer, Navigation, ContactForm, etc.

### 🔴 Content Wiring

- [ ] **Implement collections/globals in `payload.config.ts`**:
  - Projects, Posts, Pages, Skills, WorkExperience
  - Certifications, Testimonials, Categories, Media
  - Home and Navigation globals
- [ ] **Hook revalidation on publish/update** - ISR and cache invalidation
- [ ] **Replace mock data** - Connect all pages to tRPC endpoints

### 🔴 Admin & Authentication

- [x] **tRPC auth routes** - JWT handling, user management (backend implemented)
- [x] **Approvals flow** - Admin user approval system (backend implemented)
- [ ] **Admin users page** - User management interface (frontend needed)
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

### 🔴 Advanced Features

- [ ] **Project filters** - Category/Skill/Impact filtering
- [ ] **Live proof metrics** - PSI/Lighthouse/p95/error rate snapshots
- [ ] **Code credibility snippets** - Focused code examples per project
- [ ] **Downloadables** - PDF resume and one-pagers
- [ ] **Process page** - Development methodology
- [ ] **Services cards** - Service offerings display

---

## 📊 PROGRESS SUMMARY

**Overall Completion**: ~35%

- **Bootstrap**: 60% ✅
- **Core Pages**: 25% ✅
- **Components**: 20% ❌
- **MUI Design**: 15% ❌
- **tRPC Setup**: 40% ✅
- **Dynamic Routes**: 85% ✅
- **Content Management**: 5% ❌
- **Admin & Auth**: 40% ❌
- **SEO & A11y**: 0% ❌

---

## 🎯 MIGRATION PRIORITIES

### **Phase 1: Complete Core Infrastructure (CRITICAL)**

1. **Create ThemeRegistry.tsx** - MUI + Emotion SSR setup
2. **Create root layout.tsx** - Main application layout with ThemeRegistry
3. **Complete tRPC API route** - `/api/trpc/[trpc]/route.ts`
4. **Add missing tRPC routers** - projects.ts, posts.ts, skills.ts, index.ts
5. **Create tRPC client** - Frontend provider setup
6. **Create missing components** - Header, Footer, Navigation, ContactForm

### **Phase 2: Restore Core Pages**

1. **Home page (`/`)** - Hero, positioning bar, featured projects, testimonials, CTA
2. **About page (`/about`)** - Philosophy, process timeline, core values
3. **Contact page (`/contact`)** - Contact form with server action, contact information

### **Phase 3: Content Integration**

1. **Connect tRPC to dynamic routes** - Replace mock data with real API calls
2. **Implement Payload collections** - Content management system setup
3. **Add authentication frontend** - Login/register forms and user management
4. **Implement contact form backend** - Server actions with tRPC

### **Phase 4: Polish & Launch**

1. **Add SEO and accessibility** - Meta tags, structured data, sitemap, RSS
2. **Performance optimization** - Image optimization, lazy loading, error boundaries
3. **Testing and deployment** - Build verification, deployment, monitoring

---

## 📝 NOTES & ISSUES

### Critical Blockers

- 🔴 **ThemeRegistry missing** - MUI components won't render without this
- 🔴 **Root layout missing** - Application structure incomplete
- 🔴 **tRPC API route missing** - Backend API not accessible
- 🔴 **Core pages missing** - Home, About, Contact pages not implemented
- 🔴 **Missing components** - Header, Footer, Navigation, ContactForm needed

### Resolved Issues

- ✅ Custom import aliases causing module resolution failures
- ✅ Tailwind CSS completely removed
- ✅ Dynamic routes with case study templates created
- ✅ tRPC router structure implemented

### Current Challenges

- Need to complete core infrastructure before pages can work
- Mock data still in place (projects, testimonials, blog posts)
- Need to implement proper error boundaries
- Performance optimization pending
- Missing essential components for navigation and layout

### Technical Debt

- Incomplete tRPC setup blocking content integration
- Missing core application structure
- Need to add proper TypeScript types for all data structures
- Missing component library and design system setup
- Need to implement proper error handling and loading states

---

## 🔗 RELATED FILES

- **Guidelines**: [PORTFOLIO_CONSOLIDATED_MUI_TRPC.md](./PORTFOLIO_CONSOLIDATED_MUI_TRPC.md)
- **Current Project**: `../portfolio/`
- **Target Location**: Parent directory (replace old portfolio)
- **Key Components**: `../portfolio/src/components/`
- **Pages**: `../portfolio/src/app/(my-app)/`
- **tRPC**: `../portfolio/src/server/trpc/`
- **Configuration**: `../portfolio/package.json`, `../portfolio/payload.config.ts`

---

## 🚨 MIGRATION CHECKLIST

### **Before Migration**

- [ ] Complete Phase 1 (Core Infrastructure)
- [ ] Verify all pages render correctly
- [ ] Test tRPC API endpoints
- [ ] Run full build and lint

### **Migration Steps**

- [ ] Backup current portfolio directory
- [ ] Move `./portfolio/` contents to parent directory
- [ ] Update import paths and references
- [ ] Test all functionality
- [ ] Update deployment configuration

### **Post-Migration**

- [ ] Remove old portfolio files
- [ ] Update documentation
- [ ] Deploy to production
- [ ] Monitor for issues

---

_Last updated: 30/08/2025 - 12:00PM_
_Status: Core Infrastructure Incomplete - Migration Blocked_
_Next Action: Complete Phase 1 tasks to enable migration_
_Current Focus: Build missing infrastructure before moving to content integration_
