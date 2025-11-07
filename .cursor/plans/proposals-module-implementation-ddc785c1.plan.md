<!-- ddc785c1-f721-44b2-894e-b7d91bc5735c 41b26a54-8314-472c-8d5c-7959e87e49f9 -->
# Proposals Module Implementation Plan

## Overview

Build a complete Proposals module that integrates with existing intakes and pricing systems. Supports multi-tax calculations (VAT, surcharge, withholding), discount breakdowns, templates, public sharing, PDF export, and email sending. All configuration is data-driven via database tables.

## Implementation Steps

### 1. Database Schema & Migrations

**Files to create/modify:**

- `lib/db/schema/schema.tables.ts` - Add proposal tables
- `drizzle/XXXX_*.sql` - Migration file
- `lib/db/schema/schema.types.ts` - Add proposal types

**Tables to add:**

- `proposal_templates`: `id`, `name`, `description`, `defaultCurrency`, `defaultTaxProfileKey`, `defaultPriceDisplay`, `templateData` (jsonb), `isActive`, `displayOrder`, timestamps
- `proposals`: `id`, `clientUserId?`, `intakeId?`, `templateId?`, `clientName`, `clientEmail`, `clientCompany?`, `status` (text, not enum), `currency`, `taxProfileKey?`, `priceDisplay` ('taxExclusive'|'taxInclusive'), `validUntil?`, `shareToken?`, `notesInternal`, `notesClient`, `pricingSnapshot` (jsonb), `meta` (jsonb), `createdBy`, `updatedBy`, timestamps
- `proposal_sections`: `id`, `proposalId`, `key`, `label`, `description?`, `sortOrder`, `meta` (jsonb)
- `proposal_line_items`: `id`, `proposalId`, `sectionId?`, `featureKey?`, `label`, `description?`, `quantity`, `unitPriceMinor` (integer), `isOptional`, `isSelected`, `taxClass?` (text), `meta` (jsonb)
- `proposal_discounts`: `id`, `proposalId`, `scope` ('overall'|'section'|'line'), `sectionId?`, `lineItemId?`, `sourceDiscountId?`, `label`, `type` ('percent'|'fixed'), `amountMinor` (integer) or `percent` (numeric), `appliesMeta` (jsonb)
- `proposal_taxes`: `id`, `proposalId`, `scope` ('overall'|'section'|'line'), `sectionId?`, `lineItemId?`, `label`, `kind` ('vat'|'surcharge'|'withholding'), `type` ('percent'|'fixed'), `rateOrAmount` (numeric), `orderIndex` (integer), `meta` (jsonb)
- `proposal_events`: `id`, `proposalId`, `actorId?`, `event` (text), `payload` (jsonb), `occurredAt`

**Seed data:**

- `pricing_meta` entries: `tax_profiles` (JSON array with `IL_VAT_17`, `Zero` profiles), `proposal_statuses` (draft/sent/accepted/declined/expired)
- One starter `proposal_templates` entry

**Reference existing patterns:**

- Follow `pricing_discounts` table structure for discount scoping
- Use `intakes` table pattern for client linking
- Use `emailTemplates` pattern for template structure

### 2. Pricing Engine - Multi-Tax Calculation

**Files to create:**

- `lib/pricing/calcProposalTotals.ts` - Core calculation engine
- `lib/pricing/__tests__/calcProposalTotals.test.ts` - Unit tests

**Key functions:**

- `calcProposalTotals(input: ProposalTotalsInput): ProposalTotalsOutput`
- Input: currency, priceDisplay, taxProfileKey/taxLines, sections, lineItems, discounts
- Money handling: all internal calculations in minor units (integers)
- Rounding: `ROUND_HALF_UP` at each scope (line → section → overall)
- Discount stacking: line → section → overall (sequential application)
- Tax calculation:
- Support multi-tax stacks with `orderIndex`
- Types: `vat` (positive), `surcharge` (positive), `withholding` (negative)
- Per-line `taxClass` can opt-out (`exempt`, `zero`)
- Compute `preTaxTotalMinor`, `taxTotalMinor` (by label), `grandTotalMinor`
- Output: `{ subtotalMinor, discountsBreakdown, taxBreakdown, grandTotalMinor, currency, computedAt }`

**Helper functions:**

- `formatMoney(amountMinor: number, currency: string): string`
- `resolveTaxProfile(key: string, meta: PricingMeta[]): TaxLine[]`
- `applyDiscounts(base: number, discounts: Discount[], scope: 'line'|'section'|'overall'): number`
- `applyTaxes(base: number, taxes: TaxLine[], taxClass?: string): number`

**Reference existing:**

- Extend `lib/pricing/discount.ts` patterns for discount application
- Use `lib/pricing/calculate.ts` as reference for calculation structure

### 3. Database Access Layer

**Files to create:**

- `lib/db/proposals/proposals.ts` - CRUD operations for proposals
- `lib/db/proposals/sections.ts` - Section management
- `lib/db/proposals/lineItems.ts` - Line item management
- `lib/db/proposals/discounts.ts` - Proposal discount management
- `lib/db/proposals/taxes.ts` - Proposal tax management
- `lib/db/proposals/templates.ts` - Template CRUD
- `lib/db/proposals/events.ts` - Event logging

**Key functions:**

- `createProposal(input)`, `updateProposal(id, input)`, `getProposalById(id)`, `getProposals(filters)`, `deleteProposal(id)`
- `createSection(proposalId, input)`, `updateSection(id, input)`, `deleteSection(id)`, `reorderSections(proposalId, order)`
- `createLineItem(proposalId, input)`, `updateLineItem(id, input)`, `toggleLineItemSelection(id)`, `deleteLineItem(id)`
- `addDiscount(proposalId, input)`, `updateDiscount(id, input)`, `deleteDiscount(id)`
- `addTax(proposalId, input)`, `updateTax(id, input)`, `reorderTaxes(proposalId, order)`, `deleteTax(id)`
- `getTemplateById(id)`, `getTemplates()`, `createTemplate(input)`, `updateTemplate(id, input)`, `deleteTemplate(id)`
- `logEvent(proposalId, event, payload, actorId?)`

**Reference existing:**

- Follow `lib/db/intakes/intakes.ts` patterns for CRUD
- Use `lib/db/intakes/calculatorSettings.ts` for template-like structures

### 4. tRPC Router

**Files to create:**

- `src/app/server/routers/proposals.ts` - Main proposals router

**Procedures:**

- `getAll` - List proposals with filters (status, client, date range) - uses `adminProcedure`
- `getById` - Get full proposal with sections, items, discounts, taxes - uses `adminProcedure`
- `create` - Create from template or blank - uses `adminProcedure`
- `update` - Update proposal header fields - uses `adminProcedure`
- `delete` - Soft delete or hard delete - uses `adminProcedure`
- `duplicate` - Clone proposal - uses `adminProcedure`
- `setStatus` - Update status and log event - uses `adminProcedure`
- `generateShareToken` - Create/regenerate share token - uses `adminProcedure`
- `getByShareToken` - Public access (no auth) - uses `publicProcedure`
- `acceptProposal` - Public action, sets status, logs event, stores snapshot - uses `publicProcedure`
- `declineProposal` - Public action, sets status, logs event - uses `publicProcedure`
- `applyTaxes` - Add/update tax lines or apply tax profile - uses `adminProcedure`
- `setPriceDisplay` - Toggle inclusive/exclusive - uses `adminProcedure`
- `calculateTotals` - Compute totals (for live preview) - uses `adminProcedure`
- `sendProposal` - Send email with PDF attachment - uses `adminProcedure`
- `exportPDF` - Generate PDF blob - uses `adminProcedure` or `publicProcedure` (for share token)

**Sections router:**

- `createSection`, `updateSection`, `deleteSection`, `reorderSections` - all use `adminProcedure`

**Line items router:**

- `createLineItem`, `updateLineItem`, `toggleSelection`, `deleteLineItem` - all use `adminProcedure`

**Discounts router:**

- `addDiscount`, `updateDiscount`, `deleteDiscount` - all use `adminProcedure`

**Taxes router:**

- `addTax`, `updateTax`, `reorderTaxes`, `deleteTax` - all use `adminProcedure`

**Templates router:**

- `getTemplates`, `getTemplateById`, `createTemplate`, `updateTemplate`, `deleteTemplate` - all use `adminProcedure`

**Reference existing:**

- Follow `src/app/server/routers/intakes.ts` structure
- Use `src/app/server/routers/discounts.ts` for discount patterns
- Use `adminProcedure` from `src/app/server/trpc.ts` for admin endpoints
- Use `publicProcedure` for share token access (no auth required)

### 5. Admin UI - List Page

**Files to create:**

- `src/app/[locale]/(admin)/dashboard/proposals/page.tsx` - List view

**Features:**

- MUI DataGrid with columns: Client, Status, Total (incl. tax), Created, Valid Until, Actions
- Total column shows formatted amount with tooltip showing tax breakdown
- Filters: status, date range, client search
- Actions: Create, View, Edit, Duplicate, Send, Delete
- Status badges with colors
- "Create from Intake" button that opens intake selector

**Reference existing:**

- Follow `src/app/[locale]/(admin)/dashboard/intakes/page.tsx` structure
- Use `Components/DataGrid` component
- Use status filtering pattern from intakes page
- Layout automatically handled by `(admin)/dashboard/layout.tsx` and `AdminLayoutClient`

### 6. Admin UI - Editor

**Files to create:**

- `src/app/[locale]/(admin)/dashboard/proposals/[id]/page.tsx` - Editor page
- `src/app/[locale]/(admin)/dashboard/proposals/[id]/components/DetailsCard.tsx`
- `src/app/[locale]/(admin)/dashboard/proposals/[id]/components/ContentBuilder.tsx`
- `src/app/[locale]/(admin)/dashboard/proposals/[id]/components/ChargesPanel.tsx`
- `src/app/[locale]/(admin)/dashboard/proposals/[id]/components/TotalsPanel.tsx`

**Layout:**

- Split layout: left sidebar (Details), main content (Sections/Items), right panel (Charges + Totals)

**Details Card:**

- Client fields (name, email, company) - can link to `users` or free text
- Intake link (if from intake)
- Template selector (if creating from template)
- Tax Profile select (from `pricing_meta` tax_profiles)
- Price Display toggle (Inclusive/Exclusive)
- Currency select
- Valid Until date
- Internal notes, Client notes
- Tax notes, Withholding notes, Invoice hint (free text)

**Content Builder:**

- Sections list (draggable with `@dnd-kit`)
- Add section button
- Per section: line items table
- Line item fields: label, description, quantity, unit price, optional toggle, selected toggle, tax class select (standard/zero/exempt from meta)
- Feature key autocomplete (from `pricing_features`)
- Add line item button

**Charges Panel (Tabs):**

- **Discounts Tab:**
- Table of discounts with scope, label, type, amount
- Add discount button (scope selector: line/section/overall)
- Can reference `pricing_discounts` or create ad-hoc
- Orderable rows
- **Taxes Tab:**
- Table of tax lines with kind, label, type, rate/amount, order
- Add tax button
- Can apply tax profile (populates from meta) or add custom
- Orderable rows (drag to reorder)

**Totals Panel:**

- Live calculation display:
- Subtotal
- Discounts breakdown (by scope, with labels)
- Tax breakdown (each line with label and amount)
- Grand Total (incl. tax)
- Currency display
- Price display mode indicator (Inclusive/Exclusive)

**Reference existing:**

- Use `Components/IntakeReview` for split layout inspiration
- Use `@dnd-kit` patterns from admin dashboard
- Use MUI Tabs for Charges panel
- Use `lib/pricing/calcProposalTotals` for live totals

### 7. Admin UI - Templates Management

**Files to create:**

- `src/app/[locale]/admin/proposals/templates/page.tsx` - Templates list
- `src/app/[locale]/admin/proposals/templates/[id]/page.tsx` - Template editor

**Features:**

- List templates with DataGrid
- Create/Edit template dialog
- Template fields: name, description, default currency, default tax profile, default price display
- Template structure: sections and line item presets (stored in `templateData` jsonb)
- Apply template when creating proposal

**Reference existing:**

- Follow `src/app/[locale]/admin/intake-templates/page.tsx` pattern

### 8. Admin UI - Tax Profiles CRUD

**Files to create:**

- `src/app/[locale]/admin/proposals/tax-profiles/page.tsx` - Tax profiles management

**Features:**

- DataGrid listing tax profiles from `pricing_meta` key `tax_profiles`
- Create/Edit dialog:
- Profile key, label
- Tax lines table (kind: vat/surcharge/withholding, type: percent/fixed, value, order)
- Add/remove/reorder tax lines
- Seed entries: `IL_VAT_17` (17% VAT), `Zero` (no taxes)

**Reference existing:**

- Follow `src/app/[locale]/admin/calculator-settings/page.tsx` pattern for meta CRUD

### 9. Public Share Page

**Files to create:**

- `src/app/[locale]/p/[token]/page.tsx` - Public proposal view

**Features:**

- No auth required, access via `shareToken`
- Display proposal with client-facing styling
- Show totals (inclusive or exclusive per proposal setting)
- Tax breakdown section (clear labels)
- Accept/Decline buttons
- Accept action:
- Shows confirmation dialog
- Calls `acceptProposal` tRPC procedure
- Stores snapshot (all totals, tax lines, selections)
- Sets status to `accepted`
- Logs event
- Decline action:
- Shows optional reason field
- Calls `declineProposal` procedure
- Sets status to `declined`
- Logs event
- PDF download button
- Responsive design

**Reference existing:**

- Follow `src/app/[locale]/intake/[slug]/CustomLinkIntakeForm.tsx` for public page pattern

### 10. PDF Generation

**Files to create:**

- `lib/utils/proposalPdfGenerator.ts` - PDF generation using jsPDF

**Features:**

- Use jsPDF (already in project)
- Layout:
- Header: Proposal title, client info, proposal number, date, valid until
- Sections with line items table
- Totals section:
- Subtotal
- Discounts (grouped by scope, with labels)
- Tax breakdown (each line with label and amount)
- Grand Total (incl. tax)
- Footer: Tax notes, Withholding notes, Invoice hint (if provided)
- Support RTL for Hebrew if needed
- Professional styling (match resume PDF themes)

**Reference existing:**

- Use `lib/utils/pdfGenerator.ts` as reference
- Use `lib/utils/technicalPortfolioGenerator.ts` for table layouts

### 11. Email Integration

**Files to create/modify:**

- `lib/email/proposal.ts` - Proposal email templates
- `src/app/server/routers/proposals.ts` - Add `sendProposal` procedure

**Features:**

- Email template for proposal sending
- Variables: client name, proposal link, PDF attachment
- Mention whether totals are VAT-inclusive or exclusive
- Use existing `EmailManager` from `backend/email/EmailManager.ts`
- Attach PDF (generate on send)
- Track email send in `emailSends` table

**Reference existing:**

- Use `lib/email/intake.ts` for email template patterns
- Use `lib/email/sendEmail.ts` for sending logic

### 12. Intake Integration

**Files to modify:**

- `src/app/[locale]/admin/intakes/page.tsx` - Add "Create Proposal" action

**Features:**

- From intake row, "Create Proposal" button
- Prefill: client name/email from intake
- Suggest sections/items from `pricing_*` tables based on intake data
- Suggest discounts (e.g., "Early client", "Portfolio share consent")
- Store `intakeId` on proposal
- Navigate to proposal editor

**Reference existing:**

- Use intake data structure from `lib/db/intakes/intakes.ts`

### 13. Type Definitions

**Files to create/modify:**

- `lib/db/schema/schema.types.ts` - Add proposal types
- `lib/pricing/types.ts` - Add proposal calculation types

**Types:**

- `Proposal`, `NewProposal`, `UpdateProposal`
- `ProposalSection`, `ProposalLineItem`
- `ProposalDiscount`, `ProposalTax`
- `ProposalTemplate`
- `ProposalTotalsInput`, `ProposalTotalsOutput`
- `TaxProfile`, `TaxLine`

**Reference existing:**

- Follow type patterns from `lib/db/schema/schema.types.ts`
- Use `InferSelect`/`InferInsert` from Drizzle

### 14. Testing

**Files to create:**

- `lib/pricing/__tests__/calcProposalTotals.test.ts` - Unit tests

**Test cases:**

- Basic calculation (subtotal, discounts, taxes, grand total)
- Discount stacking order (line → section → overall)
- Multi-tax stacking (VAT + surcharge, VAT + withholding)
- Tax class opt-out (exempt, zero)
- Rounding edge cases
- Optional items (only count if selected)
- Zero tax scenarios
- Percent vs fixed discounts
- Percent vs fixed taxes
- Withholding (negative tax) calculation

**Reference existing:**

- Follow `lib/pricing/__tests__/calculate.test.ts` patterns
- Use `lib/pricing/__tests__/discount.test.ts` for discount tests

### 15. Localization

**Files to modify:**

- `locales/en.json`, `locales/he.json`, `locales/es.json`, `locales/fr.json`

**Keys to add:**

- Proposal status labels
- Tax profile labels
- Tax kind labels (vat, surcharge, withholding)
- Price display labels (inclusive, exclusive)
- Tax class labels (standard, zero, exempt)
- UI labels for all proposal components

**Reference existing:**

- Follow existing locale structure

### 16. Router Integration

**Files to modify:**

- `src/app/server/router.ts` - Add proposals router

**Changes:**

- Import `proposalsRouter` from `./routers/proposals`
- Add to `appRouter`: `proposals: proposalsRouter`

**Reference existing:**

- Follow pattern from other routers

## Implementation Order

1. **Database schema + migrations + seeds** (Step 1)
2. **Pricing engine with tests** (Step 2, 14)
3. **Database access layer** (Step 3)
4. **tRPC router** (Step 4)
5. **Type definitions** (Step 13)
6. **Admin list page** (Step 5)
7. **Admin editor** (Step 6)
8. **Templates management** (Step 7)
9. **Tax profiles CRUD** (Step 8)
10. **Public share page** (Step 9)
11. **PDF generation** (Step 10)
12. **Email integration** (Step 11)
13. **Intake integration** (Step 12)
14. **Localization** (Step 15)
15. **Router integration** (Step 16)
16. **E2E testing + polish**

## Key Design Decisions

- **Money storage**: Minor units (integers) in logic, `numeric` in DB for flexibility
- **Rounding**: Single strategy (`ROUND_HALF_UP`) at each scope boundary
- **Tax profiles**: Stored in `pricing_meta` as JSON, CRUD via admin UI
- **Statuses**: Text fields (not enums) for flexibility, managed via meta
- **Discounts**: Can reference `pricing_discounts` or be ad-hoc per proposal
- **Taxes**: Can come from tax profile or be custom per proposal
- **Snapshots**: Store complete totals on send/accept for audit trail
- **Share tokens**: UUID-based, regeneratable, no expiration (can add later)

## Acceptance Criteria Verification

- ✅ Create proposal from template or blank
- ✅ Attach to client/intake
- ✅ Add sections and line items with optional toggles
- ✅ Apply discounts with scope breakdown
- ✅ Select tax profile, set price display, set per-line tax class
- ✅ See correct tax breakdown
- ✅ Live totals match snapshot totals
- ✅ Send proposal via email with PDF
- ✅ Public page with accept/decline
- ✅ Acceptance locks selections and stores snapshot
- ✅ All configuration is CRUD-able (no hard-coded enums)
- ✅ Migrations + seeds run clean
- ✅ No TypeScript errors
- ✅ Tests pass (including multi-tax and withholding cases)