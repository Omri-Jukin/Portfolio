# Proposal Auto-Generation, TaxManager, and PDF Enhancement

## 1. Auto-Generate Proposals from Intake Data

### Overview

When creating a proposal from an intake, automatically populate it with predefined sections and line items based on intake data. Prices are calculated and editable.

### Implementation

#### 1.1 Create Proposal Generation Service

- **File**: `lib/proposals/generateFromIntake.ts`
- **Function**: `generateProposalFromIntake(intakeId: string, proposalId: string)`
- **Logic**:
- Fetch intake data and pricing model
- **Create predefined sections**: "Project Base", "Features", "Additional Services"
- Map intake data to pricing items:
- Project type from `project.title`/`project.type` → `pricingProjectTypes` → "Project Base" section
- Features from `project.requirements` array → `pricingFeatures` → "Features" section
- Consider multipliers (complexity, timeline, tech stack) from intake if available
- Calculate suggested prices using pricing model (base rates, multipliers, feature costs)
- Create line items with calculated prices (editable by user)
- Store `featureKey` in line items for reference

#### 1.2 Update Proposal Creation Flow

- **File**: `src/app/[locale]/(admin)/dashboard/intakes/page.tsx`
- After creating proposal, automatically call generation service
- **File**: `src/app/server/routers/proposals.ts`
- Add `generateFromIntake` procedure

#### 1.3 Enhance Line Item Creation UI

- **File**: `src/app/[locale]/(admin)/dashboard/proposals/[id]/components/ContentBuilder.tsx`
- **Changes**:
- Add "Add Line Item" dialog with two tabs:
- **Tab 1: "From Pricing Tables"** (default, editable)
- Grouped interface: Project Types section, Features section
- Searchable/filterable for both groups
- Auto-populate label, description, price from pricing tables
- Set `featureKey` field
- Prices are editable
- **Tab 2: "Custom Billing Item"**
- Manual inputs: label, description (required), quantity, price
- No `featureKey` set
- Update `createLineItemMutation` to handle both cases

### Files to Create/Modify

- `lib/proposals/generateFromIntake.ts` (new)
- `src/app/server/routers/proposals.ts`
- `src/app/[locale]/(admin)/dashboard/proposals/[id]/components/ContentBuilder.tsx`
- `src/app/[locale]/(admin)/dashboard/intakes/page.tsx`

---

## 2. TaxManager with Hebrew Documentation

### Overview

Create centralized TaxManager class that replaces all tax calculation logic. Include comprehensive Hebrew documentation explaining both system logic and Israeli tax context.

### Implementation

#### 2.1 Create TaxManager Class

- **File**: `lib/pricing/TaxManager.ts`
- **Class**: `TaxManager`
- **Methods**:
- `calculateTaxes(baseAmount: number, taxes: ProposalTax[], taxClass?: string): TaxCalculationResult`
- `applyTaxProfile(baseAmount: number, taxProfileKey: string, pricingMeta: PricingMeta[]): TaxCalculationResult`
- `extractTaxFromInclusive(total: number, taxes: ProposalTax[]): TaxExtractionResult`
- `getTaxExplanation(taxKind: "vat" | "surcharge" | "withholding"): string` (Hebrew)

#### 2.2 Hebrew Documentation

- **File**: `docs/TAX_SYSTEM_HEBREW.md` (new)
- **Content** (in Hebrew):
- **מערכת המיסים בהצעות מחיר**
- **סוגי מיסים**:
- **מע"מ (VAT)**: מס ערך מוסף בשיעור של 17% (או שיעור אחר) המוטל על סכום לפני מיסים
- **תוספת (Surcharge)**: מס נוסף המוטל על סכום (לפני או אחרי מע"מ, תלוי ב-orderIndex)
- **ניכוי במקור (Withholding)**: ניכוי מס מהתשלום (שלילי, מפחית מהסכום)
- **סדר חישוב**: מיסים מחושבים לפי `orderIndex` - כל מס מחושב על הסכום לאחר המיסים הקודמים
- **Tax Exclusive vs Inclusive**:
- **Tax Exclusive**: המחיר לא כולל מיסים, מיסים מתווספים
- **Tax Inclusive**: המחיר כולל מיסים, מיסים מחולצים מהסכום
- **Tax Classes**: `exempt` = פטור ממיסים, `zero` = שיעור 0%, `standard` = שיעור רגיל
- **הקשר ישראלי**: מע"מ 17% בישראל, מדרגות מס הכנסה, וכו'

#### 2.3 Replace All Tax Calculation Logic

- **File**: `lib/pricing/calcProposalTotals.ts`
- Remove inline `applyTaxes` function
- Replace all tax calculation calls with `TaxManager.calculateTaxes`
- Use TaxManager for all tax-related operations

#### 2.4 Add Tax Explanation API

- **File**: `src/app/server/routers/proposals.ts`
- Add `getTaxExplanation` query that returns Hebrew explanation

### Files to Create/Modify

- `lib/pricing/TaxManager.ts` (new)
- `docs/TAX_SYSTEM_HEBREW.md` (new)
- `lib/pricing/calcProposalTotals.ts`
- `src/app/server/routers/proposals.ts`

---

## 3. Migrate PDF Generation to @react-pdf/renderer

### Overview

Replace jsPDF with @react-pdf/renderer throughout the entire app. This allows PDF generation using JSX/TSX components with native SVG support.

### Implementation

#### 3.1 Install and Setup

- **Package**: `@react-pdf/renderer`
- **File**: `package.json`
- Add `@react-pdf/renderer`
- Remove `jspdf` and `jspdf-autotable` if not used elsewhere

#### 3.2 Create New PDF Generator

- **File**: `lib/utils/proposalPdfGenerator.tsx` (rename from .ts to .tsx)
- **Implementation**:
- Convert PDF generation to React PDF components using JSX/TSX
- Use `Document`, `Page`, `View`, `Text`, `Image` components from @react-pdf/renderer
- Add SVG support using `Svg`, `Path`, `Circle`, etc. components for logos/icons
- Maintain same API interface for compatibility

#### 3.3 Update All PDF Generation

- **File**: `src/app/server/routers/proposals.ts`
- Update `exportPDF` procedure to use new generator
- **Files**: Search for all jsPDF usage and replace with @react-pdf/renderer
- Update imports
- Convert PDF generation logic to React components

### Files to Create/Modify

- `lib/utils/proposalPdfGenerator.tsx` (rewrite)
- `package.json`
- `src/app/server/routers/proposals.ts`
- Any other files using PDF generation

### Dependencies

- Add: `@react-pdf/renderer`
- Remove: `jspdf`, `jspdf-autotable` (if not used elsewhere)

---

## Implementation Order

1. **TaxManager** (foundation, used by other features)
2. **PDF Migration** (independent feature)
3. **Proposal Auto-Generation** (uses pricing model)

---

## To-dos

### Phase 1: TaxManager

- [ ] Create `lib/pricing/TaxManager.ts` class with all tax calculation methods
- [ ] Create `docs/TAX_SYSTEM_HEBREW.md` with system logic + Israeli tax context
- [ ] Replace `applyTaxes` function in `lib/pricing/calcProposalTotals.ts` with `TaxManager.calculateTaxes`
- [ ] Update all tax-related logic in `calcProposalTotals.ts` to use TaxManager
- [ ] Add `getTaxExplanation` query to `src/app/server/routers/proposals.ts`
- [ ] Test TaxManager with existing tax calculation scenarios

### Phase 2: PDF Migration

- [ ] Install `@react-pdf/renderer` and remove jsPDF dependencies
- [ ] Convert `lib/utils/proposalPdfGenerator.ts` to `.tsx` and rewrite using React PDF components
- [ ] Add SVG support for logos/icons using @react-pdf/renderer's SVG components
- [ ] Update `src/app/server/routers/proposals.ts` exportPDF procedure
- [ ] Find and replace all jsPDF usage throughout the app
- [ ] Test PDF generation with SVG content

### Phase 3: Proposal Auto-Generation

- [ ] Create `lib/proposals/generateFromIntake.ts` service
- [ ] Implement intake data mapping (project type, features, multipliers)
- [ ] Create predefined sections: "Project Base", "Features", "Additional Services"
- [ ] Generate line items with calculated suggested prices (editable)
- [ ] Add `generateFromIntake` procedure to `src/app/server/routers/proposals.ts`
- [ ] Update `src/app/[locale]/(admin)/dashboard/intakes/page.tsx` to call generation after proposal creation
- [ ] Test proposal generation with various intake data scenarios

### Phase 4: Enhanced Line Item Creation UI

- [ ] Update `ContentBuilder.tsx` "Add Line Item" dialog with two tabs
- [ ] Implement "From Pricing Tables" tab:
- Grouped interface (Project Types, Features)
- Searchable/filterable for both groups
- Auto-populate label, description, price from pricing tables
- Set `featureKey` field
- Default selection
- Editable prices
- [ ] Implement "Custom Billing Item" tab:
- Manual inputs for label, description (required), quantity, price
- No `featureKey` set
- [ ] Update `createLineItemMutation` to handle both cases
- [ ] Test both creation flows