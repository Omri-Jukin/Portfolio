<!-- 36e84b87-c4ec-407e-9402-5e1af5e8c618 0b26bf37-93f5-46ea-a504-78b9e53785ac -->
# Proposals Module Implementation Plan

## Overview

This plan implements a complete proposals module from scratch. Currently, only a basic `renderProposal` function exists that generates markdown from intake data. The module will include database schema, tRPC router, admin pages, public share functionality, and menu integration.

## Current State Analysis

### ✅ Already Exists

1. **Proposal Rendering Function** - `lib/proposal/renderProposal.ts`

   - Generates markdown proposal from intake form data
   - Basic proposal structure

2. **Intakes Table** - `lib/db/schema/schema.tables.ts`

   - Has `proposalMd` field (text) for storing generated proposal markdown
   - Status includes "proposal_sent" option

3. **Related Infrastructure**:

   - tRPC setup in `src/app/server/routers/`
   - Admin dashboard structure in `src/app/[locale]/(admin)/dashboard/`
   - Public page patterns in `src/app/[locale]/(public)/`
   - AdminFAB component in `Components/AdminFAB/AdminFAB.tsx`
   - Email sending via `lib/email/sendEmail.ts`

### ❌ Missing (Needs Implementation)

1. **Database Schema** - No proposals table exists
2. **tRPC Router** - No proposals router exists
3. **Admin Pages** - No proposals pages exist
4. **Public Share Page** - No `/p/[token]` route exists
5. **Dashboard Section** - Not in `SECTION_CONFIG`
6. **AdminFAB Integration** - Not in quick access menu
7. **Localization** - No proposal-related translations

---

## Implementation Tasks

### Phase 0: Database Schema & Types (Foundation)

**Priority**: Critical (must be done first)

**Files to Create/Modify**:

- `lib/db/schema/schema.tables.ts` - Add proposals table and related tables
- `lib/db/schema/schema.types.ts` - Add proposal-related types
- `lib/db/proposals/` - Create proposals database functions directory
  - `proposals.ts` - CRUD operations for proposals
  - `proposalTemplates.ts` - Template management
  - `taxProfiles.ts` - Tax profile management

**Schema to Implement**:

1. **proposals table**:

   - id (uuid, primary key)
   - title (text)
   - clientName (text)
   - clientEmail (text)
   - status (enum: draft, sent, accepted, declined, expired)
   - shareToken (uuid, unique, nullable)
   - validUntil (timestamp, nullable)
   - currency (text)
   - priceDisplayMode (enum: hourly, fixed, both)
   - content (jsonb) - sections, line items structure
   - charges (jsonb) - pricing breakdown
   - discounts (jsonb) - discount configuration
   - taxes (jsonb) - tax configuration
   - metadata (jsonb) - additional data
   - intakeId (uuid, foreign key to intakes, nullable)
   - templateId (uuid, foreign key to proposal_templates, nullable)
   - createdAt, updatedAt (timestamps)

2. **proposal_templates table**:

   - id (uuid, primary key)
   - name (text)
   - description (text)
   - content (jsonb) - template structure
   - isDefault (boolean)
   - createdAt, updatedAt (timestamps)

3. **tax_profiles table**:

   - id (uuid, primary key)
   - name (text)
   - description (text)
   - taxLines (jsonb) - array of tax configurations
   - isDefault (boolean)
   - createdAt, updatedAt (timestamps)

4. **proposal_snapshots table** (for accepted proposals):

   - id (uuid, primary key)
   - proposalId (uuid, foreign key)
   - snapshotData (jsonb) - full proposal state at acceptance
   - acceptedAt (timestamp)
   - acceptedBy (text) - email or identifier
   - declineReason (text, nullable)
   - createdAt (timestamp)

**Types to Add**:

- ProposalStatus: "draft" | "sent" | "accepted" | "declined" | "expired"
- PriceDisplayMode: "hourly" | "fixed" | "both"
- ProposalSection, ProposalLineItem, ProposalCharge types

**Reference Files**:

- `lib/db/schema/schema.tables.ts` - Existing table patterns
- `lib/db/intakes/intakes.ts` - Database function patterns
- `lib/db/schema/schema.types.ts` - Type definition patterns

**Acceptance Criteria**:

- ✅ All tables created with proper relationships
- ✅ Types defined in schema.types.ts
- ✅ Migration file generated
- ✅ Database functions created for CRUD operations

---

### Phase 1: tRPC Router

**Priority**: Critical

**Files to Create**:

- `src/app/server/routers/proposals.ts` - Main proposals router
- `lib/db/proposals/proposals.ts` - Database functions
- `lib/db/proposals/proposalTemplates.ts` - Template functions
- `lib/db/proposals/taxProfiles.ts` - Tax profile functions

**Procedures to Implement**:

1. **Main Router** (`proposals`):

   - `list` - Get all proposals with filters
   - `getById` - Get single proposal
   - `create` - Create new proposal
   - `update` - Update proposal
   - `delete` - Delete proposal
   - `duplicate` - Duplicate existing proposal
   - `getByShareToken` - Get proposal by share token (public)
   - `generateShareToken` - Generate/regenerate share token
   - `acceptProposal` - Accept proposal (public)
   - `declineProposal` - Decline proposal (public)
   - `sendProposal` - Send proposal via email
   - `exportPDF` - Generate and return PDF

2. **Templates Sub-router** (`proposals.templates`):

   - `list` - Get all templates
   - `getById` - Get single template
   - `create` - Create template
   - `update` - Update template
   - `delete` - Delete template

3. **Tax Profiles Sub-router** (`proposals.taxProfiles`):

   - `list` - Get all tax profiles
   - `getById` - Get single tax profile
   - `create` - Create tax profile
   - `update` - Update tax profile
   - `delete` - Delete tax profile

**Reference Files**:

- `src/app/server/routers/intakes.ts` - Router structure pattern
- `src/app/server/trpc.ts` - tRPC setup
- `lib/db/intakes/intakes.ts` - Database function patterns

**Acceptance Criteria**:

- ✅ All procedures implemented
- ✅ Proper error handling
- ✅ Input validation with Zod schemas
- ✅ Admin authentication where required
- ✅ Public procedures work without auth

---

### Phase 2: Admin Pages - List & Editor

**Priority**: High

**Files to Create**:

- `src/app/[locale]/(admin)/dashboard/proposals/page.tsx` - Proposals list page
- `src/app/[locale]/(admin)/dashboard/proposals/[id]/page.tsx` - Proposal editor page
- `src/app/[locale]/(admin)/dashboard/proposals/new/page.tsx` - Create new proposal page
- `src/app/[locale]/(admin)/dashboard/proposals/templates/page.tsx` - Templates management
- `src/app/[locale]/(admin)/dashboard/proposals/tax-profiles/page.tsx` - Tax profiles management

**List Page Features** (`/dashboard/proposals`):

1. DataGrid with columns:

   - Title
   - Client Name
   - Status (with color coding)
   - Total Amount
   - Created Date
   - Valid Until
   - Actions (View, Edit, Duplicate, Delete, Share, Send, Export PDF)

2. Filters:

   - Status filter
   - Date range filter
   - Search by title/client name

3. Actions:

   - Create new proposal button
   - Bulk actions (delete, status update)
   - Row actions (view, edit, duplicate, delete, share, send, export)

**Editor Page Features** (`/dashboard/proposals/[id]`):

1. Tabs/Panels:

   - Details (title, client info, dates, status)
   - Content Builder (sections with line items)
   - Charges (pricing configuration)
   - Totals (subtotal, discounts, taxes, grand total)

2. Actions:

   - Save Draft
   - Send Proposal
   - Export PDF
   - Duplicate
   - Delete
   - Generate Share Link

**Reference Files**:

- `src/app/[locale]/(admin)/dashboard/intakes/page.tsx` - List page pattern
- `src/app/[locale]/(admin)/dashboard/intakes/[id]/page.tsx` - Detail page pattern
- `Components/DataGrid/DataGrid.tsx` - DataGrid component

**Acceptance Criteria**:

- ✅ List page displays proposals correctly
- ✅ Editor page allows full proposal editing
- ✅ All CRUD operations work
- ✅ Status changes work
- ✅ Share token generation works
- ✅ Responsive design

---

### Phase 3: Public Share Page

**Priority**: High

**Files to Create**:

- `src/app/[locale]/(public)/p/[token]/page.tsx` - Public proposal view page
- `src/app/[locale]/(public)/p/[token]/not-found.tsx` - 404 page for invalid tokens

**Features to Implement**:

1. **Page Structure**:

   - Client-facing design (no admin UI elements)
   - Responsive layout
   - Professional styling matching portfolio theme
   - Print-friendly styles

2. **Data Fetching**:

   - Use `api.proposals.getByShareToken.useQuery({ token })`
   - Handle loading and error states
   - Show 404 if token invalid or proposal not found

3. **Display Sections**:

   - Proposal header (title, client name, date, valid until)
   - Client information card
   - Sections with line items
   - Totals panel:
     - Subtotal
     - Discounts breakdown
     - Tax breakdown
     - Grand Total
     - Currency and price display mode

4. **Actions**:

   - **Accept Proposal Button**:
     - Shows confirmation dialog
     - Calls `api.proposals.acceptProposal.useMutation()`
     - On success: Show success message, disable buttons
     - Creates snapshot automatically

   - **Decline Proposal Button**:
     - Shows dialog with optional reason field
     - Calls `api.proposals.declineProposal.useMutation({ token, reason })`
     - On success: Show success message, disable buttons

   - **Download PDF Button**:
     - Calls `api.proposals.exportPDF.useQuery({ token })`
     - Downloads PDF file
     - Shows loading state

5. **Status Handling**:

   - If accepted: Show message, disable actions
   - If declined: Show message, disable actions
   - If expired: Show expiration notice, disable actions
   - If draft: Show "not available" message

6. **Styling**:

   - Use MUI components
   - Match portfolio color scheme
   - Support RTL for Hebrew locale

**Reference Files**:

- `src/app/[locale]/(public)/intake/[slug]/page.tsx` - Public page pattern
- `src/app/[locale]/(public)/intake/[slug]/CustomLinkIntakeForm.tsx` - Client component pattern

**Acceptance Criteria**:

- ✅ Public page accessible without authentication
- ✅ Displays proposal data correctly
- ✅ Accept/Decline actions work
- ✅ PDF download works
- ✅ Status-based UI states work
- ✅ Responsive design
- ✅ RTL support for Hebrew

---

### Phase 4: Dashboard Section & AdminFAB Integration

**Priority**: Medium

**Files to Modify**:

- `src/app/[locale]/(admin)/dashboard/page.tsx` - Add proposals section
- `Components/AdminFAB/AdminFAB.tsx` - Add proposals menu items

**Dashboard Section**:

Add to `SECTION_CONFIG`:

```typescript
proposals: {
  title: "Proposals",
  description: "Create, manage, and send professional proposals to clients.",
  route: "/dashboard/proposals",
  buttonText: "Manage Proposals",
  secondaryRoute: "/dashboard/proposals/templates",
  secondaryButtonText: "Manage Templates",
}
```

**AdminFAB Integration**:

Add to `quickAccessButtons` array:

```typescript
{
  icon: <DescriptionIcon />,
  label: "Proposals",
  onClick: () => navigateTo("/dashboard/proposals"),
  color: "secondary",
},
{
  icon: <FileCopyIcon />,
  label: "Proposal Templates",
  onClick: () => navigateTo("/dashboard/proposals/templates"),
  color: "default",
},
{
  icon: <ReceiptIcon />,
  label: "Tax Profiles",
  onClick: () => navigateTo("/dashboard/proposals/tax-profiles"),
  color: "default",
},
```

**Acceptance Criteria**:

- ✅ Proposals section appears in dashboard
- ✅ Proposals button appears in AdminFAB
- ✅ Clicking navigates to correct pages
- ✅ Icons are appropriate

---

### Phase 5: PDF Generation & Email Integration

**Priority**: Medium

**Files to Create/Modify**:

- `lib/utils/proposalPdfGenerator.ts` - PDF generation logic
- `lib/email/proposalEmailTemplates.ts` - Email templates for proposals

**PDF Generation**:

- Use library like `@react-pdf/renderer` or `puppeteer`
- Generate professional PDF with:
  - Proposal header
  - Client information
  - Sections and line items
  - Totals breakdown
  - Terms and conditions
  - Signature area (optional)

**Email Integration**:

- Send proposal email with:
  - Customizable message
  - Share link
  - Optional PDF attachment
  - Professional HTML template

**Reference Files**:

- `lib/proposal/renderProposal.ts` - Existing markdown generation
- `lib/email/sendEmail.ts` - Email sending infrastructure

**Acceptance Criteria**:

- ✅ PDF generation works correctly
- ✅ PDF includes all proposal data
- ✅ Email sending works
- ✅ Share link included in email
- ✅ PDF attachment optional

---

### Phase 6: Localization

**Priority**: Low

**Files to Modify**:

- `locales/en.json`
- `locales/he.json`
- `locales/es.json`
- `locales/fr.json`

**Keys to Add**:

```json
{
  "proposals": {
    "title": "Proposals",
    "create": "Create Proposal",
    "edit": "Edit Proposal",
    "list": {
      "title": "All Proposals",
      "noProposals": "No proposals found",
      "status": "Status",
      "client": "Client",
      "total": "Total",
      "created": "Created",
      "validUntil": "Valid Until"
    },
    "public": {
      "title": "Proposal",
      "client": "Client",
      "validUntil": "Valid Until",
      "accept": "Accept Proposal",
      "decline": "Decline Proposal",
      "downloadPDF": "Download PDF",
      "acceptConfirm": "Are you sure you want to accept this proposal?",
      "declineReason": "Reason for declining (optional)",
      "accepted": "This proposal has been accepted.",
      "declined": "This proposal has been declined.",
      "expired": "This proposal has expired.",
      "draft": "This proposal is not yet available.",
      "loading": "Loading proposal...",
      "error": "Proposal not found or link is invalid."
    },
    "status": {
      "draft": "Draft",
      "sent": "Sent",
      "accepted": "Accepted",
      "declined": "Declined",
      "expired": "Expired"
    },
    "actions": {
      "create": "Create New",
      "edit": "Edit",
      "duplicate": "Duplicate",
      "delete": "Delete",
      "send": "Send",
      "share": "Share",
      "exportPDF": "Export PDF",
      "save": "Save Draft"
    }
  }
}
```

**Acceptance Criteria**:

- ✅ All text is localized
- ✅ All languages have translations
- ✅ RTL works for Hebrew

---

## Implementation Order

1. **Phase 0: Database Schema** (Foundation - must be first)
2. **Phase 1: tRPC Router** (Backend API)
3. **Phase 2: Admin Pages** (Core admin functionality)
4. **Phase 3: Public Share Page** (Client-facing feature)
5. **Phase 4: Dashboard & AdminFAB** (Navigation integration)
6. **Phase 5: PDF & Email** (Enhanced features)
7. **Phase 6: Localization** (Polish)

---

## Technical Considerations

### Database Schema Design

- Use UUID for all primary keys
- Share tokens should be UUID-based and non-guessable
- Use JSONB for flexible content structures
- Add proper indexes for performance
- Foreign key relationships with cascade deletes where appropriate

### Security

- Validate share token format before querying database
- Rate limit public endpoints to prevent abuse
- Log access attempts for security monitoring
- Ensure public procedures don't expose sensitive admin data
- Sanitize user inputs in all procedures

### Performance

- Lazy load PDF generation (don't block page load)
- Cache proposal data for share token (short TTL)
- Optimize database queries with proper indexes
- Paginate list queries for large datasets

### Error Handling

- Handle invalid tokens gracefully (404 page)
- Handle expired proposals (show message)
- Handle network errors (retry mechanism)
- Handle PDF generation failures (show error message)
- Proper error messages in all procedures

---

## Dependencies

- Database migrations must be run after Phase 0
- tRPC router must be added to main router after Phase 1
- PDF generation library needs to be installed
- Email infrastructure already exists

---

## Testing Checklist

- [ ] Database schema created and migrations run
- [ ] All tRPC procedures work correctly
- [ ] List page displays proposals
- [ ] Editor page allows full editing
- [ ] Public share page loads with valid token
- [ ] Public share page shows 404 for invalid token
- [ ] Accept proposal action works
- [ ] Decline proposal action works
- [ ] PDF download works
- [ ] Email sending works
- [ ] Share link generation works
- [ ] Status changes work
- [ ] Dashboard section appears
- [ ] AdminFAB menu items work
- [ ] Localization works for all languages
- [ ] RTL support works for Hebrew
- [ ] Mobile responsive design works

---

## Notes

- This is a complete new feature implementation
- Start with database schema as foundation
- Build backend (tRPC) before frontend
- Public share page is critical for client interaction
- PDF generation can use existing patterns from resume generation
- Email templates should match portfolio style