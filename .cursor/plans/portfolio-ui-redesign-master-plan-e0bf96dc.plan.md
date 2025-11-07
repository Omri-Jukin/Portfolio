<!-- e0bf96dc-f7dd-4cbc-9aa0-cd9d0897f986 20583d87-65dc-477f-a485-4b300d513897 -->
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

**IMPORTANT**: Before deletion, verify each component is not used elsewhere:

**Components to DELETE from homepage (verify usage first):**

- `Components/About/` - Only used in homepage, can delete
- `Components/QA/` - Only used in homepage, can delete
- `Components/Services/` - Only used in homepage, can delete
- `Components/SkillShowcase/` - Only used in homepage, can delete

**Components to KEEP (used in other pages or will be reused):**

- `Components/Career/` - **KEEP** - May be used in `/employer` page or `/career` page
- `Components/Certifications/` - **KEEP** - Used in `/certifications` page, may be used in `/viewer` page
- `Components/Projects/` - **KEEP** - May be used in `/client` and `/viewer` pages
- `Components/Contact/` - **KEEP** - Used in `/contact` page, contact form needed
- `Components/ScrollingSections/ResponsiveBackground.tsx` - **KEEP** - Used in:
  - `/intake/[slug]` pages
  - `/contact` page
  - `/meeting` page
  - `/technical-portfolio` page
  - Only remove from homepage, not delete component

**Components to VERIFY before deletion:**

- `Components/AnimatedBackground/` - Check if used anywhere
- `Components/Background/` - Check if used anywhere (GlobeBackground is in ClientLayout)
- `Components/PathSelection3D/` - Check if this is different from PathSelection3DCard/ModelCard

**Deletion Process:**

1. Search codebase for each component import
2. Verify it's only used in homepage
3. Delete component folder
4. Update `Components/index.ts` exports
5. Remove type exports from `Components/index.ts`

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

## Detailed To-Do List

### Phase 1: Path Selection System & Homepage Redesign

**1.1 Rename PathSelection3DCard to ModelCard**

- [ ] Create new `Components/ModelCard/` directory
- [ ] Copy all files from `Components/PathSelection3DCard/` to `Components/ModelCard/`
- [ ] Rename `PathSelection3DCard.tsx` → `ModelCard.tsx`
- [ ] Rename `PathSelection3DCard.type.ts` → `ModelCard.type.ts`
- [ ] Rename `PathSelection3DCard.const.tsx` → `ModelCard.const.tsx`
- [ ] Rename `PathSelection3DCard.style.tsx` → `ModelCard.style.tsx`
- [ ] Update component name: `PathSelection3DCard` → `ModelCard` in ModelCard.tsx
- [ ] Update type name: `PathSelection3DCardProps` → `ModelCardProps` in ModelCard.type.ts
- [ ] Update all internal references in ModelCard files
- [ ] Update exports in `Components/ModelCard/index.ts`
- [ ] Update import in `Components/index.ts` (line 7: change PathSelection3DCard to ModelCard)
- [ ] Search codebase for all imports of PathSelection3DCard and update to ModelCard
- [ ] Delete `Components/PathSelection3DCard/` directory
- [ ] Verify no broken imports after rename

**1.2 Update ModelCard Component**

- [ ] Update `ModelCard.type.ts`: Add path type mapping or extend ModelType
- [ ] Update `ModelCard.const.tsx`: 
  - [ ] Create mapping: Lion → employer, Bull → client, Horse → viewer
  - [ ] Update MODEL_COLORS to be theme-aware (function instead of static object)
- [ ] Update `ModelCard.tsx`:
  - [ ] Import `useTheme` from MUI
  - [ ] Get theme mode (light/dark)
  - [ ] Calculate silver colors based on theme:
    - Light mode: `#E8E8E8` (bright silver)
    - Dark mode: `#4A4A4A` (dark silver)
  - [ ] Apply theme-aware colors to card background
  - [ ] Update model URL mapping logic if needed
- [ ] Test ModelCard in both light and dark modes
- [ ] Verify models display correctly (Lion, Bull, Horse)

**1.3 Create Path Preference Hook**

- [ ] Create `lib/hooks/usePathPreference.ts`
- [ ] Implement hook with:
  - [ ] `path` state: `"employer" | "client" | "viewer" | null`
  - [ ] `setPath(path: string)` function
  - [ ] `clearPath()` function
  - [ ] SSR-safe implementation (returns null on server)
  - [ ] localStorage key: `portfolio_user_path`
- [ ] Add error handling for localStorage access
- [ ] Test hook in isolation

**1.4 Create Path Selection Component**

- [ ] Create `Components/PathSelection/` directory
- [ ] Create `PathSelection.tsx`:
  - [ ] Import ModelCard component (3 instances)
  - [ ] Import usePathPreference hook
  - [ ] Create responsive grid layout (1 col mobile, 3 cols desktop)
  - [ ] Handle click events on each card
  - [ ] Save path to localStorage via hook
  - [ ] Redirect to appropriate path page
  - [ ] Handle `?reset=true` query parameter
- [ ] Create `PathSelection.style.tsx`:
  - [ ] Styled container with responsive grid
  - [ ] Card spacing and layout styles
- [ ] Create `PathSelection.type.ts`:
  - [ ] Define component props interface
- [ ] Create `PathSelection/index.ts`:
  - [ ] Export component and types
- [ ] Add PathSelection to `Components/index.ts` exports
- [ ] Test component renders 3 cards correctly
- [ ] Test click handlers and navigation

**1.5 Redesign Homepage**

- [ ] Update `src/app/[locale]/page.tsx`:
  - [ ] Remove imports: About, QA, Services, Career, Certifications, Projects, Contact, SkillShowcase
  - [ ] Remove import: ResponsiveBackground (GlobeBackground is in ClientLayout)
  - [ ] Add import: PathSelection component
  - [ ] Add import: usePathPreference hook (if needed client-side)
  - [ ] Remove all event handlers for deleted sections
  - [ ] Remove SkillShowcase modal state and logic
  - [ ] Add SEO-friendly text content (server-rendered):
    - [ ] Brief introduction/description section
    - [ ] Value proposition text
    - [ ] Call-to-action text
  - [ ] Implement conditional rendering:
    - [ ] Check localStorage for path preference (client-side)
    - [ ] If path exists and not `?reset=true`, redirect to path page
    - [ ] Otherwise, show Hero + PathSelection
  - [ ] Keep Hero component with animated title
  - [ ] Add PathSelection component below Hero
  - [ ] Remove ResponsiveBackground wrapper (GlobeBackground is global)
- [ ] Test homepage renders correctly
- [ ] Test path selection flow
- [ ] Test redirect logic

### Phase 2: Create Path-Specific Pages

**2.1 Employer Page**

- [ ] Create `src/app/[locale]/employer/` directory
- [ ] Create `page.tsx`:
  - [ ] Server-rendered component
  - [ ] Import Career component (if reusing)
  - [ ] Import Certifications component (summary)
  - [ ] Import Resume download component/button
  - [ ] Add professional summary section
  - [ ] Add career timeline section
  - [ ] Add technical skills section
  - [ ] Add key achievements section
  - [ ] Add education & certifications summary
  - [ ] Add resume download CTA
  - [ ] Add "Hire Me" contact form or link
  - [ ] Use GlobeBackground (already in ClientLayout)
  - [ ] Add SEO-friendly content
- [ ] Create `metadata.ts` (optional, or use in page.tsx):
  - [ ] Export generateMetadata function
  - [ ] Employment-focused keywords
  - [ ] OpenGraph metadata
  - [ ] Twitter card metadata
- [ ] Test page renders correctly
- [ ] Test responsive design

**2.2 Client Page**

- [ ] Create `src/app/[locale]/client/` directory
- [ ] Create `page.tsx`:
  - [ ] Server-rendered component
  - [ ] Import Services component (if reusing)
  - [ ] Import Projects component
  - [ ] Import ProjectCostCalculator or pricing section
  - [ ] Add services overview section
  - [ ] Add portfolio/projects showcase section
  - [ ] Add pricing section (detailed)
  - [ ] Add process/timeline section
  - [ ] Add client testimonials (if available)
  - [ ] Add project intake form link
  - [ ] Use GlobeBackground
  - [ ] Add SEO-friendly content
- [ ] Create `metadata.ts` (optional):
  - [ ] Services/freelance-focused keywords
  - [ ] OpenGraph metadata
  - [ ] Twitter card metadata
- [ ] Test page renders correctly
- [ ] Test responsive design

**2.3 Viewer Page**

- [ ] Create `src/app/[locale]/viewer/` directory
- [ ] Create `page.tsx`:
  - [ ] Server-rendered component
  - [ ] Import About component (compact version or recreate)
  - [ ] Import Skills section (compact)
  - [ ] Import Projects component (curated)
  - [ ] Import Certifications component (summary)
  - [ ] Import Contact component or link
  - [ ] Create compact, optimized layout:
    - [ ] Reduce spacing between sections
    - [ ] Use MUI Grid for density
    - [ ] Remove excessive empty space
    - [ ] Maintain readability
  - [ ] Add curated content for potential customers
  - [ ] Use GlobeBackground
  - [ ] Add SEO-friendly content
- [ ] Create `metadata.ts` (optional):
  - [ ] General portfolio keywords
  - [ ] OpenGraph metadata
  - [ ] Twitter card metadata
- [ ] Test page renders correctly
- [ ] Test responsive design
- [ ] Verify spacing is optimized

### Phase 3: SEO Enhancement

**3.1 Update generateMetadata in Layout**

- [ ] Update `src/app/[locale]/layout.tsx`:
  - [ ] Enhance generateMetadata function
  - [ ] Add path detection logic (check route)
  - [ ] Add dynamic metadata based on path:
    - [ ] `/employer`: Employment keywords
    - [ ] `/client`: Services/freelance keywords
    - [ ] `/viewer`: General portfolio keywords
  - [ ] Update OpenGraph metadata per path
  - [ ] Update Twitter card metadata per path
  - [ ] Add structured data (JSON-LD) per path type
- [ ] Test metadata generation for each path
- [ ] Verify SEO tags in browser dev tools

**3.2 Path-Specific Metadata (Optional Enhancement)**

- [ ] Create `src/app/[locale]/employer/metadata.ts`:
  - [ ] Export generateMetadata function
  - [ ] Employment-focused metadata
- [ ] Create `src/app/[locale]/client/metadata.ts`:
  - [ ] Export generateMetadata function
  - [ ] Services-focused metadata
- [ ] Create `src/app/[locale]/viewer/metadata.ts`:
  - [ ] Export generateMetadata function
  - [ ] Portfolio-focused metadata
- [ ] Import and use in respective page.tsx files
- [ ] Test metadata is correct for each page

### Phase 4: Navigation & Header Updates

**4.1 Update Header Component**

- [ ] Update `Components/Header/Header.tsx`:
  - [ ] Import usePathPreference hook
  - [ ] Add "Change Path" button/link:
    - [ ] Visible when path is selected
    - [ ] Clears localStorage path preference
    - [ ] Redirects to homepage with `?reset=true`
  - [ ] Update navigation menu:
    - [ ] Add path-specific links (if needed)
    - [ ] Ensure admin routes still protected
  - [ ] Test button appears/disappears correctly
  - [ ] Test "Change Path" functionality
- [ ] Verify security: All admin routes protected per security hardening plan

**4.2 Update Locale Files**

- [ ] Update `locales/en.json`:
  - [ ] Add path selection section:
    - [ ] `pathSelection.title`
    - [ ] `pathSelection.employer.title`
    - [ ] `pathSelection.employer.description`
    - [ ] `pathSelection.client.title`
    - [ ] `pathSelection.client.description`
    - [ ] `pathSelection.viewer.title`
    - [ ] `pathSelection.viewer.description`
  - [ ] Add employer page content keys
  - [ ] Add client page content keys
  - [ ] Add viewer page content keys
  - [ ] Add `header.changePath` button text
  - [ ] Add path-specific metadata keys
- [ ] Update `locales/he.json`:
  - [ ] Translate all new keys to Hebrew
- [ ] Update `locales/es.json`:
  - [ ] Translate all new keys to Spanish
- [ ] Update `locales/fr.json`:
  - [ ] Translate all new keys to French
- [ ] Test all translations display correctly

### Phase 5: Component Cleanup & Deletion

**5.1 Verify Component Usage**

- [ ] Search codebase for `About` component imports
- [ ] Search codebase for `QA` component imports
- [ ] Search codebase for `Services` component imports
- [ ] Search codebase for `SkillShowcase` component imports
- [ ] Search codebase for `Career` component imports (verify if used in employer page)
- [ ] Search codebase for `Certifications` component imports (verify if used in viewer/certifications page)
- [ ] Search codebase for `Projects` component imports (verify if used in client/viewer pages)
- [ ] Search codebase for `Contact` component imports (verify if used in contact page)
- [ ] Search codebase for `ResponsiveBackground` imports (verify all usage locations)
- [ ] Document which components are safe to delete

**5.2 Delete Unused Components**

- [ ] Delete `Components/About/` folder (if only used in homepage)
- [ ] Delete `Components/QA/` folder (if only used in homepage)
- [ ] Delete `Components/Services/` folder (if only used in homepage)
- [ ] Delete `Components/SkillShowcase/` folder (if only used in homepage)
- [ ] **DO NOT DELETE** Career, Certifications, Projects, Contact (used elsewhere)
- [ ] **DO NOT DELETE** ResponsiveBackground (used in intake, contact, meeting, technical-portfolio pages)

**5.3 Clean Up Component Exports**

- [ ] Update `Components/index.ts`:
  - [ ] Remove exports for deleted components (About, QA, Services, SkillShowcase)
  - [ ] Remove type exports for deleted components
  - [ ] Keep: Hero, GlobeBackground, Header, Footer, ModelCard, PathSelection
  - [ ] Keep: Career, Certifications, Projects, Contact (used in path pages)
  - [ ] Keep: All utility components (Button, Card, Typography, etc.)
- [ ] Verify no broken exports

**5.4 Update Imports Across Codebase**

- [ ] Search for all imports of deleted components
- [ ] Remove or replace imports in:
  - [ ] Homepage (already done in Phase 1.5)
  - [ ] Any admin pages
  - [ ] Any other pages that might reference them
- [ ] Run build to check for broken imports
- [ ] Fix any import errors

### Phase 6: Security Hardening Integration

**6.1 Verify Admin Routes Protection**

- [ ] Check `src/middleware.ts`:
  - [ ] Verify all admin routes (`/[locale]/admin/**`) are protected
  - [ ] Verify role-based access per security hardening plan
  - [ ] Verify security headers are implemented (Step 8 of security plan)
- [ ] Test admin route access with different roles
- [ ] Verify unauthorized users are redirected

**6.2 Verify Public Content Filtering**

- [ ] Check all public tRPC queries:
  - [ ] Verify they filter by `isVisible = true`
  - [ ] Verify admin queries (via adminProcedure/editorProcedure) can see all content
- [ ] Test public pages show only visible content
- [ ] Test admin can see hidden content

**6.3 Verify New Pages Don't Bypass Security**

- [ ] Verify `/employer` page is public (no auth required)
- [ ] Verify `/client` page is public (no auth required)
- [ ] Verify `/viewer` page is public (no auth required)
- [ ] Verify admin functionality remains protected
- [ ] Test role-based access still works

### Phase 7: Testing & Verification

**7.1 Functional Testing**

- [ ] Test path selection on homepage:
  - [ ] Click employer card → redirects to `/employer`
  - [ ] Click client card → redirects to `/client`
  - [ ] Click viewer card → redirects to `/viewer`
- [ ] Test localStorage persistence:
  - [ ] Select path, refresh page → should redirect to selected path
  - [ ] Clear localStorage → should show selection screen
- [ ] Test "Change Path" button:
  - [ ] Click button → clears preference and returns to homepage
  - [ ] Selection screen shows again
- [ ] Test `?reset=true` query parameter:
  - [ ] Add to URL → shows selection screen even if path is set
- [ ] Test navigation between paths
- [ ] Test responsive design:
  - [ ] Mobile: Cards stack vertically
  - [ ] Tablet: Cards in grid
  - [ ] Desktop: Cards in 3-column grid
- [ ] Test SEO metadata:
  - [ ] Check homepage metadata
  - [ ] Check `/employer` metadata
  - [ ] Check `/client` metadata
  - [ ] Check `/viewer` metadata
  - [ ] Verify OpenGraph tags
  - [ ] Verify Twitter card tags

**7.2 Security Testing**

- [ ] Test admin routes are protected:
  - [ ] Unauthenticated user → redirected to login
  - [ ] Non-admin user → redirected to 403
  - [ ] Admin user → can access
- [ ] Test role-based access:
  - [ ] Admin can access all admin routes
  - [ ] Editor can access content editing routes
  - [ ] User/visitor cannot access admin routes
- [ ] Test public content filtering:
  - [ ] Public pages show only visible content
  - [ ] Admin can see hidden content
- [ ] Verify security headers are applied:
  - [ ] Check response headers in browser dev tools
  - [ ] Verify CSP, HSTS, XFO, etc.

**7.3 Cleanup Verification**

- [ ] Run `npm run typecheck`:
  - [ ] Fix all TypeScript errors
  - [ ] Verify no type errors
- [ ] Run `npm run lint`:
  - [ ] Fix all linting errors
  - [ ] Verify no linting warnings
- [ ] Run `npm run build`:
  - [ ] Verify build succeeds
  - [ ] Check for build warnings
  - [ ] Verify no broken imports
- [ ] Search for any remaining references to deleted components
- [ ] Verify no unused components remain
- [ ] Check bundle size (optional)

**7.4 Visual & UX Testing**

- [ ] Test light mode: Silver colors are bright
- [ ] Test dark mode: Silver colors are dark
- [ ] Test model animations work correctly
- [ ] Test hover effects on ModelCard
- [ ] Test GlobeBackground displays correctly on all pages
- [ ] Test Hero animated title works correctly
- [ ] Test spacing is optimized (no excessive empty space)
- [ ] Test all pages are readable and accessible
- [ ] Test keyboard navigation works
- [ ] Test screen reader compatibility (optional)

### Phase 8: Documentation & Finalization

**8.1 Update Documentation**

- [ ] Update README.md if needed
- [ ] Document new path selection system
- [ ] Document component structure changes
- [ ] Update any architecture documentation

**8.2 Final Checks**

- [ ] Review all changes
- [ ] Verify all acceptance criteria are met
- [ ] Test in production-like environment (if possible)
- [ ] Get user approval
- [ ] Commit changes with descriptive messages