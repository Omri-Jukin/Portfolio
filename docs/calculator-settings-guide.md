# Project Cost Calculator Settings Guide

## Overview

The Project Cost Calculator is a dynamic pricing tool that estimates project costs based on various factors. All pricing is calculated in **ILS (Israeli Shekel)** as the base currency, with automatic conversion to other currencies using live exchange rates.

The calculator uses a flexible, database-driven settings system that allows you to customize:

- Base rates for different project types
- Feature costs
- Multipliers for complexity, timeline, and tech stack

## Calculation Formula

The total project cost is calculated using the following formula:

```
Base Cost = Project Type Base Rate (in ILS) [from database]
Page Cost = Number of Pages × Page Cost Per Page [from database]
Feature Cost = Sum of all selected features [from database]

Subtotal = (Base Cost + Page Cost + Feature Cost) × Complexity Multiplier [from database]
Total = Subtotal × Timeline Multiplier × Tech Stack Multiplier × Client Type Multiplier [all from database]

Range = Total × 0.85 (min) to Total × 1.15 (max)
```

### Example Calculation

For a **website** project with:

- 10 pages
- CMS and Auth features
- Moderate complexity
- Normal timeline
- Standard tech stack

```
Base Cost: 7,300 ILS (website base rate from database)
Page Cost: 10 × 548 = 5,480 ILS (page cost per page from database)
Feature Cost: 5,475 (CMS) + 3,650 (Auth) = 9,125 ILS (from database)
Subtotal: (7,300 + 5,480 + 9,125) × 1.5 = 32,853 ILS (complexity multiplier from database)
Total: 32,853 × 1.0 × 1.0 × 1.0 = 32,853 ILS (timeline, tech stack, client type multipliers from database)
Range: 27,925 - 37,781 ILS
```

## Initial Setup

Before using the calculator, you must seed the database with initial settings:

```bash
npm run seed:calculator-settings
```

This will create all required settings with default values. The script will skip if settings already exist.

## Setting Types

### 1. Base Rates (`base_rate`)

Base rates define the starting cost for different project types. These are flat fees in ILS.

**Default Values:**

- `website`: 7,300 ILS (~$2,000 USD)
- `app`: 18,250 ILS (~$5,000 USD)
- `ecommerce`: 29,200 ILS (~$8,000 USD)
- `saas`: 36,500 ILS (~$10,000 USD)
- `other`: 14,600 ILS (~$4,000 USD)

**How to Create:**

1. **Setting Type**: Select `base_rate`
2. **Setting Key**: Use the project type key (e.g., `website`, `app`, `ecommerce`, `saas`, `other`)
3. **Setting Value**: Enter a number (e.g., `7300` for 7,300 ILS)
4. **Display Name**: Human-readable name (e.g., "Website Base Rate")
5. **Description**: Optional explanation

**Example:**

```json
{
  "settingType": "base_rate",
  "settingKey": "website",
  "settingValue": 7300,
  "displayName": "Website Base Rate",
  "description": "Base cost for a standard website project"
}
```

### 2. Feature Costs (`feature_cost`)

Feature costs are additional charges for specific features that can be added to a project.

**Default Values:**

- `cms`: 5,475 ILS (~$1,500 USD)
- `auth`: 3,650 ILS (~$1,000 USD)
- `payment`: 7,300 ILS (~$2,000 USD)
- `api`: 9,125 ILS (~$2,500 USD)
- `realtime`: 10,950 ILS (~$3,000 USD)
- `analytics`: 1,825 ILS (~$500 USD)

**How to Create:**

1. **Setting Type**: Select `feature_cost`
2. **Setting Key**: Use the feature key (e.g., `cms`, `auth`, `payment`, `api`, `realtime`, `analytics`)
3. **Setting Value**: Enter a number (e.g., `5475` for 5,475 ILS)
4. **Display Name**: Human-readable name (e.g., "CMS Integration")
5. **Description**: Optional explanation

**Example:**

```json
{
  "settingType": "feature_cost",
  "settingKey": "cms",
  "settingValue": 5475,
  "displayName": "CMS Integration",
  "description": "Content Management System integration cost"
}
```

### 3. Page Cost Per Page (`multiplier` with key `page_cost_per_page`)

A special multiplier setting that defines the cost per page/screen.

**Setting Key**: `page_cost_per_page`
**Setting Type**: `multiplier`
**Setting Value**: A number (e.g., `548` for 548 ILS per page)

**How to Create:**

1. **Setting Type**: Select `multiplier`
2. **Setting Key**: Enter `page_cost_per_page`
3. **Setting Value**: Enter the cost per page in ILS (e.g., `548`)
4. **Display Name**: "Page Cost Per Page"
5. **Description**: "Cost per page/screen in ILS"

**Example:**

```json
{
  "settingType": "multiplier",
  "settingKey": "page_cost_per_page",
  "settingValue": 548,
  "displayName": "Page Cost Per Page",
  "description": "Cost per page/screen in ILS"
}
```

### 4. Multipliers (`multiplier`)

Multipliers adjust the final cost based on project complexity, timeline urgency, or tech stack complexity. They can be:

- **Single number**: Applied directly (e.g., `1.5` = 50% increase)
- **Object**: Different values for different options (e.g., `{ "simple": 1.0, "moderate": 1.5, "complex": 2.5 }`)

#### Complexity Multipliers

Applied to the subtotal (base + pages + features).

**Default Values:**

- `simple`: 1.0 (no change)
- `moderate`: 1.5 (50% increase)
- `complex`: 2.5 (150% increase)

**How to Create - Single Value:**

1. **Setting Type**: Select `multiplier`
2. **Setting Key**: Use format `complexity_<level>` (e.g., `complexity_simple`, `complexity_moderate`, `complexity_complex`)
3. **Setting Value**: Enter a number (e.g., `1.5`)
4. **Display Name**: Human-readable name (e.g., "Moderate Complexity Multiplier")

**How to Create - Object Value:**

1. **Setting Type**: Select `multiplier`
2. **Setting Key**: Use any key (e.g., `complexity_all`)
3. **Setting Value**: Enter JSON object (e.g., `{ "simple": 1.0, "moderate": 1.5, "complex": 2.5 }`)
4. **Display Name**: Human-readable name (e.g., "All Complexity Multipliers")

**Example - Single Value:**

```json
{
  "settingType": "multiplier",
  "settingKey": "complexity_moderate",
  "settingValue": 1.5,
  "displayName": "Moderate Complexity Multiplier"
}
```

**Example - Object Value:**

```json
{
  "settingType": "multiplier",
  "settingKey": "complexity_all",
  "settingValue": {
    "simple": 1.0,
    "moderate": 1.5,
    "complex": 2.5
  },
  "displayName": "All Complexity Multipliers"
}
```

#### Timeline Multipliers

Applied to the subtotal after complexity multiplier.

**Default Values:**

- `normal`: 1.0 (no change)
- `fast`: 1.3 (30% increase)
- `urgent`: 1.8 (80% increase)

**Setting Key Format**: `timeline_<level>` (e.g., `timeline_normal`, `timeline_fast`, `timeline_urgent`)

#### Tech Stack Multipliers

Applied to the subtotal after complexity and timeline multipliers.

**Default Values:**

- `standard`: 1.0 (no change)
- `advanced`: 1.4 (40% increase)
- `cutting-edge`: 1.8 (80% increase)

**Setting Key Format**: `tech_<level>` (e.g., `tech_standard`, `tech_advanced`, `tech_cutting-edge`)

**Note**: The key for "cutting-edge" should be `tech_cutting-edge` (with hyphen).

## Setting Management

### Creating a New Setting

1. Navigate to **Admin → Calculator Settings**
2. Click **"Create Setting"**
3. Fill in the form:
   - **Setting Type**: Choose `base_rate`, `feature_cost`, or `multiplier`
   - **Setting Key**: Unique identifier (see examples above)
   - **Setting Value**:
     - For numbers: Enter directly (e.g., `7300`)
     - For objects: Enter JSON (e.g., `{ "simple": 1.0, "moderate": 1.5 }`)
   - **Display Name**: Human-readable name for the admin UI
   - **Description**: Optional explanation
   - **Display Order**: Number for sorting (lower = appears first)
   - **Active**: Toggle to enable/disable
4. Click **"Create"**

### Editing a Setting

1. Find the setting in the grouped list
2. Click the **Edit** icon (pencil)
3. Modify any fields
4. Click **"Save"**

### Deleting a Setting

1. Find the setting in the grouped list
2. Click the **Delete** icon (trash)
3. Confirm deletion

### Deactivating a Setting

1. Edit the setting
2. Toggle **"Active"** to false
3. Save

Deactivated settings won't be used in calculations but remain in the database for reference.

## How Settings Are Used

### Database-Only System

**All calculator variables are fetched from the database. There are no hardcoded fallbacks.**

1. **Database Settings**: All settings must exist in the database
2. **Required Settings**: If any required setting is missing, the calculator will show an error
3. **No Defaults**: The calculator will not work without database settings
4. **Partial Updates**: You can update individual settings without affecting others

### Required Settings

The calculator requires the following settings to function:

- **Base Rates**: At least one project type (website, app, ecommerce, saas, other)
- **Feature Costs**: All features (cms, auth, payment, api, realtime, analytics)
- **Page Cost**: `page_cost_per_page` setting
- **Complexity Multipliers**: simple, moderate, complex
- **Timeline Multipliers**: normal, fast, urgent
- **Tech Stack Multipliers**: standard, advanced, cutting-edge
- **Client Type Multipliers**: personal, startup, small-business, medium-business, enterprise, charity, non-profit

### Settings Processing

The calculator processes settings in this order:

1. **Base Rates**: Looked up by project type key
2. **Feature Costs**: Looked up by feature key
3. **Page Cost**: Looked up by key `page_cost_per_page`
4. **Multipliers**:
   - Individual keys (e.g., `complexity_simple`, `timeline_normal`, `tech_standard`, `client_personal`)
   - Or object values that match the input (for grouped multipliers)
   - **No fallbacks** - values must exist in database

### Currency Conversion

All calculations are done in ILS first, then converted to the selected currency using live exchange rates from `exchangerate-api.com`. The conversion happens after the final total is calculated.

## Best Practices

### 1. Setting Keys

Use consistent, descriptive keys:

- Base rates: `website`, `app`, `ecommerce`, `saas`, `other`
- Features: `cms`, `auth`, `payment`, `api`, `realtime`, `analytics`
- Multipliers: `complexity_<level>`, `timeline_<level>`, `tech_<level>`

### 2. Values

- Always enter values in **ILS** (Israeli Shekel)
- Use whole numbers for costs (no decimals)
- Use decimals for multipliers (e.g., `1.5`, `2.0`)

### 3. Display Names

Use clear, descriptive display names that explain what the setting does:

- ✅ Good: "Website Base Rate", "CMS Integration Cost", "Moderate Complexity Multiplier"
- ❌ Bad: "Setting 1", "Rate", "Multiplier"

### 4. Descriptions

Add descriptions to explain:

- Why the cost is what it is
- What the multiplier affects
- When to use this setting

### 5. Display Order

Use display order to group related settings:

- Base rates: 0-9
- Feature costs: 10-19
- Complexity multipliers: 20-29
- Timeline multipliers: 30-39
- Tech stack multipliers: 40-49

### 6. Testing

After creating or updating settings:

1. Open the calculator
2. Test different combinations
3. Verify calculations match expectations
4. Check currency conversions

## Common Scenarios

### Scenario 1: Increase All Base Rates by 20%

1. Edit each base rate setting
2. Multiply current value by 1.2
3. Update and save

### Scenario 2: Add a New Feature

1. Create a new `feature_cost` setting
2. Use a new key (e.g., `seo` for SEO optimization)
3. Set the cost in ILS
4. The calculator will automatically include it when the feature is added to the UI

### Scenario 3: Adjust Complexity Pricing

1. Edit complexity multiplier settings
2. Adjust values based on your pricing strategy
3. Example: Make complex projects 3x instead of 2.5x

### Scenario 4: Seasonal Pricing

1. Create duplicate settings with different values
2. Activate/deactivate based on season
3. Or update values directly

## Troubleshooting

### Calculator Shows Zeros or Errors

**Problem**: Calculator shows zeros or error messages

**Solution**:

- **Run the seeding script**: `npm run seed:calculator-settings`
- Check that settings are marked as `isActive: true`
- Verify setting keys match exactly (case-sensitive)
- Check browser console for specific error messages
- Ensure all required settings exist (see "Required Settings" above)

### Multipliers Not Working

**Problem**: Multipliers don't seem to affect the calculation

**Solution**:

- Verify setting keys follow the format: `complexity_<level>`, `timeline_<level>`, `tech_<level>`
- Check that the setting value is a number (not a string)
- Ensure the setting is active

### Currency Conversion Issues

**Problem**: Currency conversion shows wrong values

**Solution**:

- Check that exchange rates are loading (look for "Loading exchange rates..." message)
- Verify the base currency is ILS
- Check network requests for exchange rate API errors

### Settings Not Saving

**Problem**: Changes don't persist

**Solution**:

- Check that you're logged in as admin
- Verify database connection
- Check browser console for errors
- Ensure all required fields are filled

## Technical Details

### Database Schema

Settings are stored in the `calculator_settings` table with the following structure:

```sql
CREATE TABLE calculator_settings (
  id UUID PRIMARY KEY,
  setting_type TEXT NOT NULL,  -- 'base_rate', 'feature_cost', 'multiplier'
  setting_key TEXT NOT NULL,   -- e.g., 'website', 'cms', 'complexity_simple'
  setting_value JSONB NOT NULL, -- Number or object
  display_name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### API Endpoints

- `GET /api/trpc/intakes.calculatorSettings.getAll` - Get all settings
- `GET /api/trpc/intakes.calculatorSettings.getById` - Get single setting
- `POST /api/trpc/intakes.calculatorSettings.create` - Create setting (admin only)
- `PUT /api/trpc/intakes.calculatorSettings.update` - Update setting (admin only)
- `DELETE /api/trpc/intakes.calculatorSettings.delete` - Delete setting (admin only)

### Code Location

- Database functions: `lib/db/intakes/calculatorSettings.ts`
- Calculation logic: `Components/ProjectCostCalculator/ProjectCostCalculator.const.tsx`
- UI Component: `Components/ProjectCostCalculator/ProjectCostCalculator.tsx`
- Admin Page: `src/app/[locale]/admin/calculator-settings/page.tsx`

## Summary

The calculator settings system provides flexibility to adjust pricing without code changes. Key points:

1. **All values are database-driven** - No hardcoded fallbacks exist
2. **Base rates** define starting costs for project types (from database)
3. **Feature costs** add charges for specific features (from database)
4. **Page cost** is configurable per page (from database)
5. **Multipliers** adjust costs based on complexity, timeline, tech stack, and client type (from database)
6. All calculations are in ILS, then converted to selected currency
7. **Seeding required** - Run `npm run seed:calculator-settings` before first use
8. Settings can be activated/deactivated without deletion

For questions or issues, refer to the troubleshooting section or check the code in the locations listed above.
