<!-- e0bf96dc-f7dd-4cbc-9aa0-cd9d0897f986 0c7c3839-e063-416c-8bff-6cdc8c3a4708 -->
# Portfolio UI Redesign Master Plan

## Overview

Complete transformation of the portfolio from a long single-page scroll to a focused, path-based experience with 3-card selection screen. This plan integrates with the security hardening plan and includes comprehensive cleanup of unused components.

## Core Requirements

1. **Homepage**: Hero section (with animated title) + 3 path selection cards
2. **Models**: Lion → Employers, Bull → Clients, Horse → Viewers
3. **Colors**: Silver shades (bright in light mode, dark in dark mode)
4. **Storage**: localStorage for path preference (`portfolio_user_path`)
5. **Navigation**: Dedicated pages `/employer`, `/client`, `/viewer`
6. **SEO**: Enhanced `generateMetadata` in layout.tsx
7. **Keep**: GlobeBackground, Hero with AnimatedHeroTitle
8. **Remove**: Almost everything else (About, QA, Services, Career, Certifications, Projects, Contact, SkillShowcase, etc.)
9. **Security**: All changes must align with security-hardening-plan-0130e3ac.plan.md

## Implementation Phases

### Phase 1: Path Selection System & Homepage Redesign

#### 1.1 Update PathSelection3DCard Component

- **File**: `Components/PathSelection3DCard/PathSelection3DCard.const.tsx`
- Update model mappings:
  - Lion → Employers (type: "employer")
  - Bull → Clients (type: "client")  
  - Horse → Viewers (type: "viewer")
- Update colors to silver shades:
  - Light mode: `#E8E8E8` (bright silver)
  - Dark mode: `#4A4A4A` (dark silver)
- Use theme-aware colors via `useTheme()` hook

#### 1.2 Create Path Selection Component

- **New File**: `Components/PathSelection/PathSelection.tsx`
- Component that renders 3 PathSelection3DCard components in a grid
- Handles click events and saves to localStorage
- Redirects to appropriate path page
- Shows on homepage when no path is selected or `?reset=true` query param

#### 1.3 Create Path Preference Hook

- **New File**: `lib/hooks/usePathPreference.ts`
- Hook to read/write `portfolio_user_path` from localStorage
- Returns: `{ path: "employer" | "client" | "viewer" | null, setPath, clearPath }`
- Handles SSR safely (returns null on server)

#### 1.4 Redesign Homepage

- **File**: `src/app/[locale]/page.tsx`
- Remove all current sections (About, QA, Services, Career, Certifications, Projects, Contact)
- Keep Hero component (with animated title)
- Add PathSelection component below Hero
- Server-rendered with SEO-friendly text content
- Conditional rendering: Show path selection if no path selected, otherwise redirect to selected path

### Phase 2: Create Path-Specific Pages

#### 2.1 Employer Page

- **New File**: `src/app/[locale]/employer/page.tsx`
- Content focused on full-time employment opportunities
- Professional summary, career timeline, technical skills, achievements
- Resume download CTA
- "Hire Me" contact form
- Uses GlobeBackground (from ClientLayout)
- Server-rendered for SEO

#### 2.2 Client Page

- **New File**: `src/app/[locale]/client/page.tsx`
- Content focused on freelance/consulting clients
- Services overview, portfolio/projects showcase, pricing section
- Process/timeline, client testimonials
- Project intake form link
- Uses GlobeBackground
- Server-rendered for SEO

#### 2.3 Viewer Page

- **New File**: `src/app/[locale]/viewer/page.tsx`
- Curated view of entire website for potential customers
- Compact sections: About, Skills, Projects, Certifications, Contact
- Optimized spacing, no excessive empty space
- Uses GlobeBackground
- Server-rendered for SEO

### Phase 3: SEO Enhancement

#### 3.1 Update generateMetadata

- **File**: `src/app/[locale]/layout.tsx`
- Enhance metadata with path-specific information
- Add dynamic metadata based on route:
  - `/employer`: Focus on employment keywords
  - `/client`: Focus on services/freelance keywords
  - `/viewer`: General portfolio keywords
- Update OpenGraph and Twitter card metadata per path
- Add structured data (JSON-LD) for each path type

#### 3.2 Path-Specific Metadata

- **New File**: `src/app/[locale]/employer/metadata.ts`
- **New File**: `src/app/[locale]/client/metadata.ts`
- **New File**: `src/app/[locale]/viewer/metadata.ts`
- Export metadata functions for each path
- Import and use in respective page.tsx files

### Phase 4: Navigation & Header Updates

#### 4.1 Update Header Component

- **File**: `Components/Header/Header.tsx`
- Add "Change Path" button/link (visible when path is selected)
- Button clears localStorage and redirects to homepage with `?reset=true`
- Update navigation menu to include path-specific links
- Ensure security: All admin routes protected per security hardening plan

#### 4.2 Update Locale Files

- **Files**: `locales/en.json`, `locales/he.json`, `locales/es.json`, `locales/fr.json`
- Add new keys for:
  - Path selection titles and descriptions
  - Employer/Client/Viewer page content
  - "Change Path" button text
  - Path-specific metadata

### Phase 5: Component Cleanup & Deletion

#### 5.1 Identify Unused Components

Components to DELETE (not used in new design):

- `Components/About/` (entire folder)
- `Components/QA/` (entire folder)
- `Components/Services/` (entire folder)
- `Components/Career/` (entire folder) - **EXCEPT** if used in employer page
- `Components/Certifications/` (entire folder) - **EXCEPT** if used in viewer page
- `Components/Projects/` (entire folder) - **EXCEPT** if used in client/viewer pages
- `Components/Contact/` (entire folder) - **EXCEPT** if contact form is needed
- `Components/SkillShowcase/` (entire folder)
- `Components/ScrollingSections/ResponsiveBackground.tsx` (replaced by GlobeBackground)
- `Components/AnimatedBackground/` (if not used)
- `Components/Background/` (if not used, GlobeBackground is the replacement)

#### 5.2 Clean Up Component Exports

- **File**: `Components/index.ts`
- Remove exports for deleted components
- Remove type exports for deleted components
- Keep only: Hero, GlobeBackground, Header, Footer, PathSelection3DCard, PathSelection, and utility components

#### 5.3 Update Imports Across Codebase

- Search for imports of deleted components
- Remove or replace with new components
- Update any admin pages that might reference deleted components

### Phase 6: Security Hardening Integration

#### 6.1 Verify Admin Routes Protection

- **File**: `src/middleware.ts`
- Ensure all admin routes (`/[locale]/admin/**`) are protected
- Verify role-based access per security hardening plan
- Add security headers (per security hardening plan Step 8)

#### 6.2 Verify Public Content Filtering

- **Files**: All public tRPC queries
- Ensure all public queries filter by `isVisible = true`
- Admin queries (via adminProcedure/editorProcedure) can see all content
- Per security hardening plan Step 11

#### 6.3 Update Auth & RBAC

- Ensure new pages don't bypass security
- All admin functionality remains protected
- Public pages (employer, client, viewer) are accessible without auth

### Phase 7: Testing & Verification

#### 7.1 Functional Testing

- Test path selection and localStorage persistence
- Test navigation between paths
- Test "Change Path" functionality
- Test SEO metadata for each path
- Test responsive design (mobile, tablet, desktop)

#### 7.2 Security Testing

- Verify admin routes still protected
- Verify public content filtering works
- Test role-based access (admin, editor, user, visitor)
- Verify security headers are applied

#### 7.3 Cleanup Verification

- Verify no broken imports
- Verify no unused components remain
- Run build and check for errors
- Run linter and fix issues

## File Structure After Implementation

```
src/app/[locale]/
  ├── page.tsx (Homepage: Hero + PathSelection)
  ├── employer/
  │   └── page.tsx (Employer-focused content)
  ├── client/
  │   └── page.tsx (Client-focused content)
  ├── viewer/
  │   └── page.tsx (Curated portfolio view)
  └── layout.tsx (Enhanced generateMetadata)

Components/
  ├── PathSelection/ (NEW)
  │   ├── PathSelection.tsx
  │   ├── PathSelection.style.tsx
  │   ├── PathSelection.type.ts
  │   └── index.ts
  ├── Hero/ (KEEP - with AnimatedHeroTitle)
  ├── GlobeBackground/ (KEEP)
  ├── ModelCard/ (RENAMED from PathSelection3DCard - UPDATE - silver colors, model mappings)
  ├── Header/ (UPDATE - add Change Path button)
  └── [Other utility components kept as needed]

lib/hooks/
  └── usePathPreference.ts (NEW)
```

## Acceptance Criteria

1. Homepage shows Hero + 3 path selection cards
2. Models correctly mapped: Lion→Employers, Bull→Clients, Horse→Viewers
3. Cards use silver colors (bright in light mode, dark in dark mode)
4. Path preference saved to localStorage
5. Navigation to `/employer`, `/client`, `/viewer` works
6. "Change Path" button clears preference and returns to homepage
7. SEO metadata enhanced for each path
8. GlobeBackground and Hero with animated title are the only visual elements kept
9. All unused components deleted
10. No broken imports or build errors
11. Security hardening plan requirements met
12. All text in locale files
13. Responsive design works on all devices
14. TypeScript compilation passes
15. Linter passes with no errors

## Implementation Order

1. Phase 1: Path Selection System (foundation)
2. Phase 2: Create Path Pages (content)
3. Phase 3: SEO Enhancement (optimization)
4. Phase 4: Navigation Updates (UX)
5. Phase 5: Component Cleanup (maintenance)
6. Phase 6: Security Integration (security)
7. Phase 7: Testing & Verification (quality)

## Notes

- Maintain backward compatibility for admin routes
- Keep all admin functionality intact
- Preserve existing API routes and tRPC routers
- All deletions should be verified before removal
- Use git to track deletions for easy rollback if needed
- Test thoroughly after each phase before proceeding

### To-dos

- [ ] Update PathSelection3DCard: Change model mappings (Lion→Employers, Bull→Clients, Horse→Viewers) and implement silver colors (bright in light mode, dark in dark mode)
- [ ] Create usePathPreference hook in lib/hooks/usePathPreference.ts for localStorage management
- [ ] Create PathSelection component that renders 3 cards and handles selection
- [ ] Redesign homepage (src/app/[locale]/page.tsx): Keep Hero, add PathSelection, remove all other sections
- [ ] Create /employer page with employer-focused content (career, skills, resume download)
- [ ] Create /client page with client-focused content (services, portfolio, pricing)
- [ ] Create /viewer page with curated portfolio view (compact sections, optimized spacing)
- [ ] Enhance generateMetadata in layout.tsx and create path-specific metadata files
- [ ] Update Header component: Add 'Change Path' button and update navigation menu
- [ ] Update all locale files (en, he, es, fr) with new path selection and page content
- [ ] Identify and list all unused components to be deleted (About, QA, Services, etc.)
- [ ] Delete unused component folders and update Components/index.ts exports
- [ ] Search and remove/replace all imports of deleted components across codebase
- [ ] Verify security hardening plan requirements: admin route protection, public content filtering, RBAC
- [ ] Test path selection, localStorage, navigation, responsive design, and SEO metadata
- [ ] Test admin route protection, role-based access, and security headers
- [ ] Run build, typecheck, lint, and verify no errors or broken imports