# Pricing System Documentation

This document provides a comprehensive overview of the pricing system, including all database tables, calculation logic, and how pricing integrates with proposals and intakes.

## Table of Contents

1. [Overview](#overview)
2. [Database Tables](#database-tables)
3. [Pricing Model Structure](#pricing-model-structure)
4. [Calculation Flow](#calculation-flow)
5. [Discount System](#discount-system)
6. [Tax System](#tax-system)
7. [Proposal Integration](#proposal-integration)
8. [Database Architecture Recommendation](#database-architecture-recommendation)

---

## Overview

The pricing system is a **fully dynamic, database-driven** pricing engine that replaces hardcoded pricing logic. All pricing data is stored in database tables and can be modified without code changes.

### Key Features

- **Dynamic Project Types**: Project types (website, app, ecommerce, etc.) are stored in the database
- **Client-Type-Specific Rates**: Different base rates for different client types (charity, enterprise, etc.)
- **Feature-Based Pricing**: Additional features (CMS, auth, payments) have individual costs
- **Multiplier System**: Complexity, timeline, tech stack, and client type multipliers adjust pricing
- **Discount System**: Promotional codes with usage limits and scope-based application
- **Tax System**: Multi-tax support (VAT, surcharges, withholding) with tax profiles
- **Proposal Integration**: Automatic price calculation when generating proposals from intakes

---

## Database Tables

### 1. `pricing_project_types`

Stores the different types of projects that can be priced.

| Column          | Type      | Description                                             |
| --------------- | --------- | ------------------------------------------------------- |
| `id`            | UUID      | Primary key                                             |
| `key`           | TEXT      | Unique identifier (e.g., "website", "app", "ecommerce") |
| `display_name`  | TEXT      | Human-readable name (e.g., "Website (base)")            |
| `base_rate_ils` | INTEGER   | Default base rate in ILS (minor units: 4000 = ₪40.00)   |
| `order`         | INTEGER   | Display order for UI                                    |
| `is_active`     | BOOLEAN   | Whether this project type is active                     |
| `created_at`    | TIMESTAMP | Creation timestamp                                      |
| `updated_at`    | TIMESTAMP | Last update timestamp                                   |

**Example Data:**

- `landing-page`: Base rate 250 ILS
- `website`: Base rate 4000 ILS
- `portfolio`: Base rate 7000 ILS
- `app`: Base rate 12000 ILS
- `ecommerce`: Base rate 20000 ILS
- `saas`: Base rate 30000 ILS

---

### 2. `pricing_base_rates`

Stores base rates that can vary by client type. This allows different pricing for charities, enterprises, etc.

| Column             | Type      | Description                                                     |
| ------------------ | --------- | --------------------------------------------------------------- |
| `id`               | UUID      | Primary key                                                     |
| `project_type_key` | TEXT      | References `pricing_project_types.key`                          |
| `client_type_key`  | TEXT      | Client type (e.g., "charity", "enterprise") or NULL for default |
| `base_rate_ils`    | INTEGER   | Base rate in ILS (minor units)                                  |
| `order`            | INTEGER   | Display order                                                   |
| `is_active`        | BOOLEAN   | Whether this rate is active                                     |
| `created_at`       | TIMESTAMP | Creation timestamp                                              |
| `updated_at`       | TIMESTAMP | Last update timestamp                                           |

**Logic:**

- If `client_type_key` is `NULL`, this is the default rate for the project type
- If `client_type_key` is set, it overrides the default for that specific client type
- Unique constraint on `(project_type_key, client_type_key)` ensures one rate per combination

**Example:**

- Default website rate: 4000 ILS (`client_type_key = NULL`)
- Charity website rate: 3200 ILS (`client_type_key = "charity"`) - 20% discount
- Enterprise website rate: 6000 ILS (`client_type_key = "enterprise"`) - 50% premium

---

### 3. `pricing_features`

Stores additional features that can be added to projects, each with a cost.

| Column             | Type      | Description                                        |
| ------------------ | --------- | -------------------------------------------------- |
| `id`               | UUID      | Primary key                                        |
| `key`              | TEXT      | Unique identifier (e.g., "cms", "auth", "payment") |
| `display_name`     | TEXT      | Human-readable name (e.g., "CMS")                  |
| `default_cost_ils` | INTEGER   | Default cost in ILS (minor units)                  |
| `group`            | TEXT      | Optional grouping (e.g., "backend", "frontend")    |
| `order`            | INTEGER   | Display order                                      |
| `is_active`        | BOOLEAN   | Whether this feature is active                     |
| `created_at`       | TIMESTAMP | Creation timestamp                                 |
| `updated_at`       | TIMESTAMP | Last update timestamp                              |

**Example Data:**

- `cms`: 5000 ILS
- `auth`: 3500 ILS
- `payment`: 8000 ILS
- `api`: 5000 ILS
- `realtime`: 10000 ILS
- `analytics`: 3000 ILS

---

### 4. `pricing_multiplier_groups`

Stores groups of multipliers (complexity, timeline, tech stack, client type).

| Column         | Type      | Description                                                              |
| -------------- | --------- | ------------------------------------------------------------------------ |
| `id`           | UUID      | Primary key                                                              |
| `key`          | TEXT      | Unique identifier (e.g., "complexity", "timeline", "tech", "clientType") |
| `display_name` | TEXT      | Human-readable name (e.g., "Complexity")                                 |
| `order`        | INTEGER   | Display order                                                            |
| `is_active`    | BOOLEAN   | Whether this group is active                                             |
| `created_at`   | TIMESTAMP | Creation timestamp                                                       |
| `updated_at`   | TIMESTAMP | Last update timestamp                                                    |

**Standard Groups:**

- `complexity`: Simple (1.0), Moderate (1.6), Complex (2.4)
- `timeline`: Normal (1.0), Fast (1.3), Urgent (1.6)
- `tech`: Standard (1.0), Advanced (1.15), Cutting-edge (1.35)
- `clientType`: Personal (1.0), Startup (1.1), Enterprise (1.6), Charity (0.8)

---

### 5. `pricing_multiplier_values`

Stores individual multiplier values within each group.

| Column         | Type         | Description                                                            |
| -------------- | ------------ | ---------------------------------------------------------------------- |
| `id`           | UUID         | Primary key                                                            |
| `group_key`    | TEXT         | References `pricing_multiplier_groups.key`                             |
| `option_key`   | TEXT         | Unique identifier within group (e.g., "simple", "moderate", "complex") |
| `display_name` | TEXT         | Human-readable name (e.g., "Simple")                                   |
| `value`        | NUMERIC(6,3) | Multiplier value (e.g., 1.0, 1.6, 2.4)                                 |
| `is_fixed`     | BOOLEAN      | Whether this is a fixed multiplier (not adjustable)                    |
| `order`        | INTEGER      | Display order                                                          |
| `is_active`    | BOOLEAN      | Whether this value is active                                           |
| `created_at`   | TIMESTAMP    | Creation timestamp                                                     |
| `updated_at`   | TIMESTAMP    | Last update timestamp                                                  |

**Unique Constraint:** `(group_key, option_key)` ensures one value per group-option combination.

**Example Values:**

- Complexity: `simple` = 1.0, `moderate` = 1.6, `complex` = 2.4
- Timeline: `normal` = 1.0, `fast` = 1.3, `urgent` = 1.6
- Tech Stack: `standard` = 1.0, `advanced` = 1.15, `cutting-edge` = 1.35
- Client Type: `personal` = 1.0, `startup` = 1.1, `enterprise` = 1.6, `charity` = 0.8

---

### 6. `pricing_meta`

Stores metadata and configuration for the pricing system.

| Column       | Type      | Description                                                                 |
| ------------ | --------- | --------------------------------------------------------------------------- |
| `id`         | UUID      | Primary key                                                                 |
| `key`        | TEXT      | Unique identifier (e.g., "pageCostPerPage", "rangePercent", "tax_profiles") |
| `value`      | JSONB     | Configuration value (structure varies by key)                               |
| `order`      | INTEGER   | Display order                                                               |
| `is_active`  | BOOLEAN   | Whether this meta entry is active                                           |
| `created_at` | TIMESTAMP | Creation timestamp                                                          |
| `updated_at` | TIMESTAMP | Last update timestamp                                                       |

**Standard Meta Keys:**

1. **`pageCostPerPage`**: Cost per additional page

   ```json
   { "value": 600 }
   ```

2. **`rangePercent`**: Percentage for price range calculation (e.g., 0.18 = ±18%)

   ```json
   { "value": 0.18 }
   ```

3. **`defaultCurrency`**: Default currency code

   ```json
   { "value": "ILS" }
   ```

4. **`projectMinimums`**: Minimum prices per project type

   ```json
   {
     "landing-page": 250,
     "website": 4000,
     "portfolio": 7000,
     "app": 12000,
     "ecommerce": 20000,
     "saas": 30000
   }
   ```

5. **`tax_profiles`**: Tax profile configurations
   ```json
   [
     {
       "key": "israel-vat",
       "label": "Israel VAT (17%)",
       "lines": [
         {
           "kind": "vat",
           "type": "percent",
           "value": 17,
           "orderIndex": 0,
           "label": "מע\"מ"
         }
       ]
     },
     {
       "key": "israel-vat-surcharge",
       "label": "Israel VAT + Surcharge",
       "lines": [
         {
           "kind": "vat",
           "type": "percent",
           "value": 17,
           "orderIndex": 0,
           "label": "מע\"מ"
         },
         {
           "kind": "surcharge",
           "type": "percent",
           "value": 2,
           "orderIndex": 1,
           "label": "תוספת"
         }
       ]
     }
   ]
   ```

---

### 7. `pricing_discounts`

Stores promotional discount codes with usage limits and scope rules.

| Column           | Type          | Description                                   |
| ---------------- | ------------- | --------------------------------------------- |
| `id`             | UUID          | Primary key                                   |
| `code`           | TEXT          | Unique discount code (e.g., "WELCOME50")      |
| `description`    | TEXT          | Description of the discount                   |
| `discount_type`  | TEXT          | "percent" or "fixed"                          |
| `amount`         | NUMERIC(10,2) | Discount amount (percent 0-100 or fixed ILS)  |
| `currency`       | TEXT          | Currency for fixed discounts (default: "ILS") |
| `applies_to`     | JSONB         | Scope rules (see below)                       |
| `starts_at`      | TIMESTAMP     | When discount becomes active (optional)       |
| `ends_at`        | TIMESTAMP     | When discount expires (optional)              |
| `max_uses`       | INTEGER       | Maximum total uses (NULL = unlimited)         |
| `used_count`     | INTEGER       | Current usage count                           |
| `per_user_limit` | INTEGER       | Maximum uses per user (default: 1)            |
| `is_active`      | BOOLEAN       | Whether discount is active                    |
| `created_at`     | TIMESTAMP     | Creation timestamp                            |
| `updated_at`     | TIMESTAMP     | Last update timestamp                         |

**`applies_to` JSONB Structure:**

```json
{
  "projectTypes": ["website", "app"], // Only for these project types
  "features": ["cms", "auth"], // Only if these features are selected
  "clientTypes": ["startup", "small-business"], // Only for these client types
  "excludeClientTypes": ["charity", "non-profit"] // Exclude these client types
}
```

**Example Discounts:**

- `WELCOME50`: 50% off for first-time clients (percent, max 10 uses)
- `STARTUP20`: 20% off for startups (percent, applies to startups only)
- `FIXED1000`: ₪1000 off (fixed, applies to websites only)

---

## Pricing Model Structure

The `PricingModel` type is the in-memory representation of all pricing data, fetched from the database tables above.

```typescript
type PricingModel = {
  projectTypes: DynProjectType[]; // From pricing_project_types
  baseRates: DynBaseRate[]; // From pricing_base_rates
  features: DynFeature[]; // From pricing_features
  multiplierGroups: DynMultiplierGroup[]; // From pricing_multiplier_groups + values
  meta: PricingMetaValues; // From pricing_meta
};
```

### Fetching the Pricing Model

The `getPricingModel()` function in `lib/pricing/resolver.ts`:

1. Fetches all active records from pricing tables
2. Groups multiplier values by group
3. Parses meta settings
4. Returns a complete `PricingModel` object

**Caching:** The pricing model is fetched on-demand. Consider caching for high-traffic scenarios.

---

## Calculation Flow

### 1. Calculator Inputs

When a user fills out the pricing calculator, they provide:

```typescript
type CalculatorInputs = {
  projectTypeKey: string; // e.g., "website"
  numPages: number; // e.g., 5
  selectedFeatureKeys: string[]; // e.g., ["cms", "auth"]
  complexityKey: string; // e.g., "moderate"
  timelineKey: string; // e.g., "fast"
  techKey: string; // e.g., "advanced"
  clientTypeKey: string; // e.g., "startup"
  currency?: string; // Optional, defaults to ILS
};
```

### 2. Calculation Steps

The `calculateEstimate()` function in `lib/pricing/calculate.ts` performs:

1. **Base Cost**: Look up base rate (client-type-specific or default)

   ```typescript
   baseCost = clientSpecificRate?.baseRateIls ?? projectType.baseRateIls;
   ```

2. **Page Cost**: Multiply pages by cost per page

   ```typescript
   pageCost = numPages * pricingModel.meta.pageCostPerPage;
   ```

3. **Feature Costs**: Sum costs of selected features

   ```typescript
   totalFeatureCost = sum(selectedFeatureKeys.map((key) => feature.costIls));
   ```

4. **Apply Complexity Multiplier**: Multiply base + pages + features

   ```typescript
   subtotal = (baseCost + pageCost + totalFeatureCost) * complexityMultiplier;
   ```

5. **Apply Remaining Multipliers**: Timeline, tech stack, client type

   ```typescript
   total =
     subtotal * timelineMultiplier * techStackMultiplier * clientTypeMultiplier;
   ```

6. **Apply Discount** (if provided): Percent or fixed

   ```typescript
   discountedTotal = total * (1 - discountPercent / 100); // or total - fixedAmount
   ```

7. **Calculate Range**: ±rangePercent around final total
   ```typescript
   min = total * (1 - rangePercent);
   max = total * (1 + rangePercent);
   ```

### 3. Cost Breakdown Output

```typescript
type CostBreakdown = {
  baseCost: number;
  pageCost: number;
  featureCosts: Record<string, number>;
  totalFeatureCost: number;
  complexityMultiplier: number;
  timelineMultiplier: number;
  techStackMultiplier: number;
  clientTypeMultiplier: number;
  subtotal: number;
  total: number;
  range: { min: number; max: number };
  discountApplied?: {
    type: "percent" | "fixed";
    amount: number;
    discountedTotal: number;
  };
};
```

---

## Discount System

### Discount Application

The discount system (`lib/pricing/discount.ts`) validates and applies discounts:

1. **Validation Checks:**

   - Discount is active
   - Current date is within `starts_at` and `ends_at` (if set)
   - `used_count < max_uses` (if `max_uses` is set)
   - Scope matches (project type, features, client type)

2. **Scope Matching:**

   - `projectTypes`: Discount applies only if project type is in list
   - `features`: Discount applies only if at least one feature is selected
   - `clientTypes`: Discount applies only if client type matches
   - `excludeClientTypes`: Discount does NOT apply if client type is excluded

3. **Application:**
   - **Percent**: `discountedTotal = total * (1 - amount/100)`
   - **Fixed**: `discountedTotal = total - amount`

### Discount Usage Tracking

When a discount is used:

- `used_count` is incremented
- Per-user limits are enforced (if `per_user_limit > 1`)

---

## Tax System

The tax system (`lib/pricing/TaxManager.ts`) handles multi-tax calculations with support for:

- **VAT** (מע"מ): Standard value-added tax
- **Surcharge** (תוספת): Additional tax on top of base amount
- **Withholding** (ניכוי במקור): Negative tax (reduces total)

### Tax Profiles

Tax profiles are stored in `pricing_meta` with key `tax_profiles`. Each profile contains:

```typescript
type TaxProfile = {
  key: string; // e.g., "israel-vat"
  label: string; // e.g., "Israel VAT (17%)"
  lines: TaxLine[]; // Array of tax calculations
};

type TaxLine = {
  kind: "vat" | "surcharge" | "withholding";
  type: "percent" | "fixed";
  value: number; // Percent (0-100) or fixed amount in minor units
  orderIndex: number; // Order of calculation (0 = first)
  label: string; // Display label
};
```

### Tax Calculation

Taxes are calculated in order (`orderIndex`):

1. **Tax-Exclusive Pricing** (default):

   - Start with base amount
   - Apply each tax in order
   - Final total = base + all taxes

2. **Tax-Inclusive Pricing**:
   - Total already includes tax
   - Extract base amount: `base = total / (1 + tax_rate)`
   - Tax amount = total - base

### Tax Exemption

Line items can have `taxClass = "exempt"` to skip tax calculation for that item.

---

## Proposal Integration

### Proposal Structure

Proposals use the pricing system but store prices as **line items** that can be manually edited:

1. **Proposal Table** (`proposals`):

   - `currency`: Currency code (default: "ILS")
   - `tax_profile_key`: Which tax profile to use
   - `price_display`: "taxExclusive" or "taxInclusive"
   - `pricing_snapshot`: JSON snapshot of pricing model at creation time

2. **Proposal Sections** (`proposal_sections`):

   - Organize line items into sections (e.g., "Project Base", "Features")

3. **Proposal Line Items** (`proposal_line_items`):

   - `feature_key`: References `pricing_features.key` (if from pricing table)
   - `quantity`: Number of units
   - `unit_price_minor`: Price per unit (in minor units, e.g., 4000 = ₪40.00)
   - `is_optional`: Whether item can be toggled on/off
   - `is_selected`: Whether item is currently selected
   - `tax_class`: Tax exemption status ("exempt" or NULL)

4. **Proposal Discounts** (`proposal_discounts`):

   - `scope`: "overall", "section", or "line"
   - `type`: "percent" or "fixed"
   - `source_discount_id`: References `pricing_discounts.id` (if from discount code)

5. **Proposal Taxes** (`proposal_taxes`):
   - Can override tax profile with custom taxes
   - `scope`: "overall", "section", or "line"

### Auto-Generation from Intake

When creating a proposal from an intake (`lib/proposals/generateFromIntake.ts`):

1. Fetch intake data (project type, features, requirements)
2. Fetch current pricing model
3. Map intake data to pricing keys:
   - Project type → `pricing_project_types`
   - Requirements → `pricing_features`
4. Create sections: "Project Base", "Features", "Additional Services"
5. Create line items with calculated prices:
   - Base project cost
   - Feature costs
   - Prices are editable after creation

### Proposal Totals Calculation

The `calcProposalTotals()` function in `lib/pricing/calcProposalTotals.ts`:

1. **Line Item Totals**: `quantity * unit_price_minor`
2. **Line-Level Discounts**: Apply discounts scoped to specific line items
3. **Section Totals**: Sum line items in each section
4. **Section-Level Discounts**: Apply discounts scoped to sections
5. **Overall Subtotal**: Sum all line items (before discounts)
6. **Overall Discounts**: Apply discounts scoped to entire proposal
7. **Pre-Tax Total**: After all discounts
8. **Tax Calculation**: Apply tax profile or custom taxes
9. **Grand Total**: Final amount including taxes

**Output:**

```typescript
type ProposalTotalsOutput = {
  subtotalMinor: number; // Before discounts
  discountsBreakdown: DiscountBreakdown[];
  preTaxTotalMinor: number; // After discounts
  taxBreakdown: TaxBreakdown[];
  taxTotalMinor: number;
  grandTotalMinor: number; // Final total
  currency: string;
  computedAt: string; // ISO timestamp
};
```

---

## Database Architecture Recommendation

### Question: Should both websites use the same database?

**Answer: It depends on your use case, but here are the considerations:**

### ✅ **Use Same Database If:**

1. **Shared Business Logic**: Both sites serve the same business (your portfolio + ChatGPT business)
2. **Shared Pricing**: You want consistent pricing across both sites
3. **Unified Client Management**: Clients from both sites should be in one system
4. **Simplified Maintenance**: One database to backup, migrate, and monitor
5. **Cross-Site Features**: You want features like "client from portfolio site can see proposals from ChatGPT site"

### ❌ **Use Separate Databases If:**

1. **Different Business Entities**: Portfolio and ChatGPT business are separate legal entities
2. **Different Pricing Models**: Pricing logic differs significantly between sites
3. **Data Isolation Requirements**: Legal/compliance requires data separation
4. **Independent Scaling**: One site needs to scale independently
5. **Different Tech Stacks**: Different database requirements (e.g., one uses PostgreSQL, other uses MongoDB)

### 🎯 **Recommended Approach: Same Database with Namespacing**

If you choose the same database, use **schema-based or table-prefix namespacing**:

#### Option 1: Schema-Based (PostgreSQL)

```sql
-- Portfolio site tables
portfolio.users
portfolio.proposals
portfolio.pricing_project_types

-- ChatGPT business site tables
chatgpt.users
chatgpt.proposals
chatgpt.pricing_project_types
```

**Pros:**

- Clean separation
- Easy to query: `SELECT * FROM portfolio.proposals`
- Can share some tables: `shared.pricing_project_types`

#### Option 2: Table Prefixes

```sql
-- Portfolio site
portfolio_users
portfolio_proposals
portfolio_pricing_project_types

-- ChatGPT business site
chatgpt_users
chatgpt_proposals
chatgpt_pricing_project_types

-- Shared tables
shared_pricing_project_types
```

**Pros:**

- Works with any database
- Simple to implement
- Can share pricing tables

#### Option 3: Multi-Tenant with `site_id`

Add a `site_id` column to all tables:

```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY,
  site_id TEXT NOT NULL,  -- 'portfolio' or 'chatgpt'
  client_name TEXT NOT NULL,
  ...
);

CREATE INDEX idx_proposals_site_id ON proposals(site_id);
```

**Pros:**

- Single codebase
- Easy cross-site queries
- Can share data when needed

**Cons:**

- Must filter by `site_id` in every query
- Risk of data leakage if filtering is missed

### 💡 **My Recommendation**

**Use the same database with schema-based separation** (Option 1) if:

- Both sites are part of the same business
- You want to share pricing configuration
- You want unified client management

**Use separate databases** if:

- They are legally separate entities
- You need strict data isolation
- Pricing models are fundamentally different

### Implementation Example

If using the same database with schemas:

```typescript
// lib/db/client.ts
export async function getDB(site: "portfolio" | "chatgpt" = "portfolio") {
  const schema = site === "portfolio" ? "portfolio" : "chatgpt";
  // Use schema in queries
  return drizzle(pool, { schema: { ...portfolioSchema, ...sharedSchema } });
}

// Shared pricing tables
export const sharedPricingProjectTypes = pgTable(
  "shared.pricing_project_types",
  {
    // ... same structure
  }
);

// Site-specific tables
export const portfolioProposals = pgTable("portfolio.proposals", {
  // ... same structure
});

export const chatgptProposals = pgTable("chatgpt.proposals", {
  // ... same structure
});
```

---

## Summary

The pricing system is a comprehensive, database-driven solution that:

1. **Stores all pricing data** in database tables (no hardcoded values)
2. **Calculates estimates** using base rates, features, multipliers, and discounts
3. **Handles taxes** with multi-tax support and tax profiles
4. **Integrates with proposals** for automatic price generation from intakes
5. **Supports discounts** with usage limits and scope-based rules

All pricing logic is centralized in `lib/pricing/`, making it easy to maintain and extend.
