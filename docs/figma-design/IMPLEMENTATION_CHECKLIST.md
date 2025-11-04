# Implementation Checklist

Use this checklist to track your progress as you convert the three-page design to MUI.

---

## Phase 1: Project Setup ⏱️ 2-4 hours

### Environment Setup
- [ ] Create Next.js 15 app with App Router
  ```bash
  npx create-next-app@latest portfolio --typescript --app --no-src-dir
  ```
- [ ] Install MUI dependencies
  ```bash
  npm install @mui/material @emotion/react @emotion/styled @mui/material-nextjs
  ```
- [ ] Install Lucide React (icons)
  ```bash
  npm install lucide-react
  ```
- [ ] Install additional dependencies (if needed)
  ```bash
  npm install @fontsource/inter
  ```

### File Structure
- [ ] Create `app/theme.ts` for MUI theme
- [ ] Create `app/components/layout/` directory
- [ ] Create `app/components/sections/` directory
- [ ] Create `app/components/shared/` directory
- [ ] Create `app/data/` directory for project data
- [ ] Create `app/employers/page.tsx`
- [ ] Create `app/clients/page.tsx`

### Configuration Files
- [ ] Update `app/layout.tsx` with theme provider
- [ ] Create `app/theme.ts` with color palette
- [ ] Set up TypeScript interfaces
- [ ] Configure environment variables (`.env.local`)

---

## Phase 2: Shared Components ⏱️ 4-6 hours

### Header Component
- [ ] Create `components/layout/Header.tsx`
- [ ] Add logo (40px circle with gradient)
- [ ] Add name and title
- [ ] Add navigation links (hide on mobile)
- [ ] Add CTA button (context-aware)
- [ ] Implement active state highlighting
- [ ] Test on all three pages

### Footer Component
- [ ] Create `components/layout/Footer.tsx`
- [ ] Add copyright text
- [ ] Add privacy/terms links
- [ ] Make responsive (stack on mobile)
- [ ] Test on all pages

### Featured Projects Component
- [ ] Create `components/shared/FeaturedProjects.tsx`
- [ ] Define TypeScript interface for props
- [ ] Implement neutral variant
- [ ] Implement employer variant
- [ ] Implement client variant
- [ ] Create project data file (`data/projects.ts`)
- [ ] Add project cards with gradients
- [ ] Test all three variants

### Contact Section Component
- [ ] Create `components/shared/ContactSection.tsx`
- [ ] Define TypeScript interface for props
- [ ] Implement employer variant (company/role fields)
- [ ] Implement client variant (project/budget fields)
- [ ] Add contact info section (right column)
- [ ] Add form validation
- [ ] Test both variants

---

## Phase 3: Landing Page ⏱️ 6-8 hours

### Hero Section
- [ ] Create hero with centered layout
- [ ] Add availability badge
- [ ] Add main heading (responsive font size)
- [ ] Add subtext (max-width 672px)
- [ ] Add dual CTAs (I'm Hiring + I Need Development)
- [ ] Add stats grid (4 columns desktop, 2x2 mobile)
- [ ] Test responsive behavior

### Path Selection Cards
- [ ] Create `components/sections/PathSelectionCards.tsx`
- [ ] Create employer card (blue gradient icon)
- [ ] Create client card (purple gradient icon)
- [ ] Add features list with checkmarks
- [ ] Add CTAs to respective pages
- [ ] Add hover effects
- [ ] Test on mobile (stack vertically)

### Integration
- [ ] Combine all sections in `app/page.tsx`
- [ ] Add header and footer
- [ ] Add FeaturedProjects (neutral, limit: 3)
- [ ] Set SEO metadata
- [ ] Test full page flow
- [ ] Test navigation

### SEO & Metadata
- [ ] Add page title
- [ ] Add meta description
- [ ] Add keywords
- [ ] Add Open Graph tags
- [ ] Add Twitter card tags
- [ ] Test with SEO tools

---

## Phase 4: Employer Page ⏱️ 10-12 hours

### Hero Section
- [ ] Create employer hero variant
- [ ] Add "Available for Full-Time" badge (green)
- [ ] Add heading "Hire a Senior Full Stack Developer"
- [ ] Add employer-focused subtext
- [ ] Add "Download Resume" CTA (blue gradient)
- [ ] Add "Schedule Call" CTA (outlined)

### Content Cards
- [ ] Create `components/sections/ProfessionalSummary.tsx`
  - [ ] Add heading and description
  - [ ] Add tech stack badges
- [ ] Create `components/sections/ExperienceTimeline.tsx`
  - [ ] Add timeline with left border
  - [ ] Add timeline dots (blue for active, gray for past)
  - [ ] Add job titles, companies, dates
  - [ ] Add bullet points
  - [ ] Make responsive (stack on mobile)
- [ ] Create `components/sections/KeyAchievements.tsx`
  - [ ] Add 3 achievements with colored icons
  - [ ] Add titles and descriptions
- [ ] Create `components/sections/SkillsTechnologies.tsx`
  - [ ] Add 4 categories (Frontend, Backend, DevOps, Tools)
  - [ ] Add skill badges for each category
- [ ] Create `components/sections/EducationCertifications.tsx`
  - [ ] Add education section
  - [ ] Add certifications with badges

### Featured Projects
- [ ] Integrate FeaturedProjects (employer variant, limit: 6)
- [ ] Verify employer-specific metrics display
- [ ] Test grid layout (3 columns desktop, 1 mobile)

### CTA Card
- [ ] Create `components/sections/EmployerCTA.tsx`
- [ ] Add blue gradient background
- [ ] Add "Ready to Hire?" heading
- [ ] Add "Download Resume" + "Contact Me" buttons
- [ ] Test responsive layout

### Contact Section
- [ ] Integrate ContactSection (employer variant)
- [ ] Verify company/role fields appear
- [ ] Test form submission (to your tRPC endpoint)

### Integration
- [ ] Combine all sections in `app/employers/page.tsx`
- [ ] Add header (activePath="employers")
- [ ] Add footer
- [ ] Set SEO metadata (employer-focused)
- [ ] Test full page flow
- [ ] Test navigation from landing page

---

## Phase 5: Client Page ⏱️ 10-12 hours

### Hero Section
- [ ] Create client hero variant
- [ ] Add "Accepting New Projects" badge (green)
- [ ] Add heading "Build Your Next Product"
- [ ] Add client-focused subtext
- [ ] Add "Request Quote" CTA (purple gradient)
- [ ] Add "View Pricing" CTA (outlined)

### Content Cards
- [ ] Create `components/sections/ServicesOverview.tsx`
  - [ ] Add 3 service cards (Full Stack, Optimization, Consulting)
  - [ ] Add colored icons
  - [ ] Make responsive (3→2→1 columns)
- [ ] Create `components/sections/PricingPackages.tsx`
  - [ ] Add 3 pricing tiers
  - [ ] Add "Most Popular" badge to middle tier
  - [ ] Add feature lists with checkmarks
  - [ ] Add CTAs
  - [ ] Make responsive (stack on mobile)
- [ ] Create `components/sections/ProcessSection.tsx`
  - [ ] Add 4 process steps
  - [ ] Add numbered circles
  - [ ] Add titles and descriptions
  - [ ] Make responsive (4→2→1 columns)

### Featured Projects
- [ ] Integrate FeaturedProjects (client variant, limit: 6)
- [ ] Verify client-specific metrics display (ROI, timeline)
- [ ] Test grid layout

### CTA Card
- [ ] Create `components/sections/ClientCTA.tsx`
- [ ] Add purple gradient background
- [ ] Add "Ready to Start Your Project?" heading
- [ ] Add "Request Quote" + "Schedule Consultation" buttons
- [ ] Test responsive layout

### Contact Section
- [ ] Integrate ContactSection (client variant)
- [ ] Verify project type/budget fields appear
- [ ] Test form submission

### Integration
- [ ] Combine all sections in `app/clients/page.tsx`
- [ ] Add header (activePath="clients")
- [ ] Add footer
- [ ] Set SEO metadata (client-focused)
- [ ] Test full page flow
- [ ] Test navigation from landing page

---

## Phase 6: Data Integration ⏱️ 2-3 hours

### Project Data
- [ ] Create `app/data/projects.ts`
- [ ] Define Project interface
- [ ] Add project data with all variants
- [ ] Add gradient colors
- [ ] Add technologies arrays
- [ ] Add metrics for all variants

### Experience Data
- [ ] Create `app/data/experience.ts`
- [ ] Define Experience interface
- [ ] Add job history with dates
- [ ] Add responsibilities

### Skills Data
- [ ] Create `app/data/skills.ts`
- [ ] Organize by category
- [ ] Add skill arrays

### Education Data
- [ ] Create `app/data/education.ts`
- [ ] Add degree information
- [ ] Add certifications

---

## Phase 7: Styling & Polish ⏱️ 4-6 hours

### Colors & Theme
- [ ] Verify all colors match specifications
- [ ] Test blue gradient (employer)
- [ ] Test purple gradient (client)
- [ ] Test neutral colors (landing)
- [ ] Verify text colors (primary, secondary)
- [ ] Verify border colors

### Typography
- [ ] Verify heading sizes (H1-H5)
- [ ] Verify body text sizes
- [ ] Verify font weights
- [ ] Verify line heights
- [ ] Test responsive typography

### Spacing
- [ ] Verify section padding (48px/32px)
- [ ] Verify card padding (24px)
- [ ] Verify grid gaps
- [ ] Verify button padding
- [ ] Test responsive spacing

### Shadows & Effects
- [ ] Verify card shadows
- [ ] Test hover effects on cards
- [ ] Test hover effects on buttons
- [ ] Verify transitions (200ms)
- [ ] Test border radius values

---

## Phase 8: Responsive Design ⏱️ 3-4 hours

### Mobile (<600px)
- [ ] Test header (hide title, hide nav)
- [ ] Test hero (stack CTAs, 2x2 stats)
- [ ] Test path cards (stack vertically)
- [ ] Test projects (single column)
- [ ] Test all content cards
- [ ] Test forms (full width inputs)
- [ ] Test footer (stack vertically)

### Tablet (600-899px)
- [ ] Test header (show title, hide nav)
- [ ] Test hero (row CTAs, 4 column stats)
- [ ] Test path cards (2 columns)
- [ ] Test projects (2 columns)
- [ ] Test pricing (stack or 2 columns)
- [ ] Test footer (horizontal)

### Desktop (≥900px)
- [ ] Test header (full layout)
- [ ] Test hero (full layout)
- [ ] Test path cards (2 columns)
- [ ] Test projects (3 columns)
- [ ] Test all grids
- [ ] Test footer (horizontal)

### Edge Cases
- [ ] Test at 320px width (small mobile)
- [ ] Test at 1920px width (large desktop)
- [ ] Test with long content (overflow handling)
- [ ] Test with short content (centering)

---

## Phase 9: Dark Mode ⏱️ 2-3 hours

### Theme Setup
- [ ] Add dark mode toggle
- [ ] Update theme with dark palette
- [ ] Test background gradients
- [ ] Test card backgrounds
- [ ] Test text colors
- [ ] Test border colors

### Component Testing
- [ ] Test header in dark mode
- [ ] Test hero sections in dark mode
- [ ] Test cards in dark mode
- [ ] Test buttons in dark mode
- [ ] Test forms in dark mode
- [ ] Test gradients in dark mode

### Color Adjustments
- [ ] Verify employer gradient in dark mode
- [ ] Verify client gradient in dark mode
- [ ] Verify text contrast (4.5:1 minimum)
- [ ] Verify shadow opacity

---

## Phase 10: SEO & Analytics ⏱️ 2-3 hours

### SEO Implementation
- [ ] Add unique title to each page
- [ ] Add unique description to each page
- [ ] Add keywords to each page
- [ ] Add Open Graph tags
- [ ] Add Twitter card tags
- [ ] Add structured data (JSON-LD)
- [ ] Create `robots.txt`
- [ ] Create `sitemap.xml`

### Analytics Setup
- [ ] Install Google Analytics
- [ ] Add GA script to layout
- [ ] Create tracking functions
- [ ] Add event tracking to CTAs
- [ ] Add event tracking to forms
- [ ] Test events in GA dashboard

### Tracking Events
- [ ] Landing page view
- [ ] Employer CTA clicks
- [ ] Client CTA clicks
- [ ] Project views
- [ ] Resume downloads
- [ ] Form submissions
- [ ] Navigation clicks

---

## Phase 11: Performance Optimization ⏱️ 2-3 hours

### Image Optimization
- [ ] Use Next.js Image component
- [ ] Optimize logo (PNG → WebP)
- [ ] Optimize project images
- [ ] Add width/height attributes
- [ ] Test lazy loading

### Font Optimization
- [ ] Use `next/font` for Inter
- [ ] Subset fonts (latin only)
- [ ] Preload critical fonts
- [ ] Test font loading

### Code Optimization
- [ ] Remove unused imports
- [ ] Remove unused CSS
- [ ] Minimize bundle size
- [ ] Use dynamic imports where appropriate
- [ ] Test bundle analysis

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Test Time to Interactive
- [ ] Test First Contentful Paint
- [ ] Test Largest Contentful Paint
- [ ] Fix any performance issues

---

## Phase 12: Testing & QA ⏱️ 3-4 hours

### Functionality Testing
- [ ] Test all internal links
- [ ] Test all external links
- [ ] Test form submissions
- [ ] Test resume download
- [ ] Test navigation between pages
- [ ] Test back button behavior

### Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test in mobile browsers

### Device Testing
- [ ] Test on iPhone (iOS Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad
- [ ] Test on desktop
- [ ] Test on laptop

### Accessibility Testing
- [ ] Run aXe DevTools scan
- [ ] Test keyboard navigation
- [ ] Test screen reader (VoiceOver/NVDA)
- [ ] Verify color contrast
- [ ] Verify focus states
- [ ] Verify ARIA labels
- [ ] Fix any a11y issues

### Content Review
- [ ] Proofread all text
- [ ] Verify all data is accurate
- [ ] Check for typos
- [ ] Verify dates are correct
- [ ] Verify links are correct

---

## Phase 13: Deployment ⏱️ 1-2 hours

### Pre-Deployment
- [ ] Create production build
  ```bash
  npm run build
  ```
- [ ] Test production build locally
  ```bash
  npm run start
  ```
- [ ] Fix any build errors
- [ ] Verify all pages work

### Vercel Deployment
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy to production

### Post-Deployment
- [ ] Test live site
- [ ] Verify all pages load
- [ ] Test navigation
- [ ] Test forms (if connected to backend)
- [ ] Verify analytics tracking
- [ ] Test on mobile devices

### Domain & SSL
- [ ] Configure custom domain (if applicable)
- [ ] Verify SSL certificate
- [ ] Test HTTPS redirect
- [ ] Update DNS records

---

## Final Checklist ✅

### Documentation Review
- [ ] I've read THREE_PAGE_STRUCTURE_COMPLETE_GUIDE.md
- [ ] I've read LANDING_PAGE_DESIGN.md
- [ ] I've read EMPLOYER_PAGE_DESIGN.md
- [ ] I've read CLIENT_PAGE_DESIGN.md
- [ ] I've read CONTEXT_AWARE_COMPONENTS.md
- [ ] I've read ROUTING_IMPLEMENTATION.md
- [ ] I've read TAILWIND_TO_MUI_MAPPING.md

### Pages Complete
- [ ] Landing page fully implemented
- [ ] Employer page fully implemented
- [ ] Client page fully implemented
- [ ] All three pages are responsive
- [ ] All three pages have correct SEO

### Components Complete
- [ ] Header (context-aware) works on all pages
- [ ] Footer works on all pages
- [ ] FeaturedProjects (all variants) works correctly
- [ ] ContactSection (both variants) works correctly
- [ ] All section components work correctly

### Quality Checks
- [ ] Design matches specifications
- [ ] All colors are correct
- [ ] All spacing is correct
- [ ] All typography is correct
- [ ] Dark mode works (if implemented)
- [ ] Responsive design works
- [ ] Performance is optimized
- [ ] SEO is implemented
- [ ] Analytics is tracking
- [ ] Accessibility is good

### Launch Ready
- [ ] Site is deployed to production
- [ ] Custom domain is configured (if applicable)
- [ ] All links work
- [ ] All forms work (if connected)
- [ ] Analytics is collecting data
- [ ] Site is fast and responsive
- [ ] No console errors
- [ ] No broken images

---

## Estimated Total Time

| Phase | Estimated Time |
|-------|----------------|
| Project Setup | 2-4 hours |
| Shared Components | 4-6 hours |
| Landing Page | 6-8 hours |
| Employer Page | 10-12 hours |
| Client Page | 10-12 hours |
| Data Integration | 2-3 hours |
| Styling & Polish | 4-6 hours |
| Responsive Design | 3-4 hours |
| Dark Mode | 2-3 hours |
| SEO & Analytics | 2-3 hours |
| Performance | 2-3 hours |
| Testing & QA | 3-4 hours |
| Deployment | 1-2 hours |
| **TOTAL** | **51-70 hours** |

---

## Tips for Success

1. **Follow the documentation** - All specifications are exact
2. **Build incrementally** - Complete one phase before moving to next
3. **Test as you go** - Don't wait until the end to test
4. **Use the mapping guide** - TAILWIND_TO_MUI_MAPPING.md is your friend
5. **Commit frequently** - Small commits make debugging easier
6. **Take breaks** - This is a lot of work!
7. **Ask for help** - If stuck, review the docs again

---

## You've Got This! 🚀

All documentation is complete and ready. Follow this checklist step-by-step and you'll have a beautiful, functional three-page portfolio optimized for both employers and clients.

Good luck with the implementation!
