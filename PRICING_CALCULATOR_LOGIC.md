# Pricing Calculator Logic Documentation

## Overview

The pricing calculator is a dynamic project cost estimation tool that calculates project costs based on multiple factors. All calculations are performed in **ILS (Israeli Shekel)** as the base currency, with automatic conversion to other currencies using live exchange rates.

## Input Types

### CalculatorInputs Interface

```typescript
interface CalculatorInputs {
  projectType: "website" | "app" | "ecommerce" | "saas" | "other";
  complexity: "simple" | "moderate" | "complex";
  numPages: number; // Number of pages/routes
  features: {
    cms: boolean;
    auth: boolean;
    payment: boolean;
    api: boolean;
    realtime: boolean;
    analytics: boolean;
  };
  timelineUrgency: "normal" | "fast" | "urgent";
  techStackComplexity: "standard" | "advanced" | "cutting-edge";
  currency: string; // Target currency code (e.g., "USD", "EUR", "ILS")
  clientType:
    | "personal"
    | "startup"
    | "small-business"
    | "medium-business"
    | "enterprise"
    | "charity"
    | "non-profit";
}
```

### Rates Structure (from Database)

```typescript
interface Rates {
  baseRates: Record<string, number>; // e.g., { "website": 7300, "app": 10000, ... }
  featureCosts: Record<string, number>; // e.g., { "cms": 5475, "auth": 3650, ... }
  complexityMultipliers: Record<string, number>; // e.g., { "simple": 1.0, "moderate": 1.5, "complex": 2.0 }
  timelineMultipliers: Record<string, number>; // e.g., { "normal": 1.0, "fast": 1.2, "urgent": 1.5 }
  techStackMultipliers: Record<string, number>; // e.g., { "standard": 1.0, "advanced": 1.1, "cutting-edge": 1.3 }
  clientTypeMultipliers: Record<string, number>; // e.g., { "personal": 1.0, "startup": 1.1, "enterprise": 1.5, ... }
  pageCostPerPage: number; // e.g., 548
}
```

## Core Calculation Logic

### Step-by-Step Formula

The calculation follows this order:

1. **Base Cost Calculation**

   ```
   baseCost = baseRates[projectType] || baseRates["other"] || 0
   ```

   - Lookup the base rate for the selected project type
   - Fallback to "other" if project type not found
   - Default to 0 if no rates exist

2. **Page Cost Calculation**

   ```
   pageCost = numPages × pageCostPerPage
   ```

   - Multiply number of pages by the per-page cost rate

3. **Feature Cost Calculation**

   ```
   featureCosts = {
     cms: features.cms ? featureCosts["cms"] ?? 0 : 0,
     auth: features.auth ? featureCosts["auth"] ?? 0 : 0,
     payment: features.payment ? featureCosts["payment"] ?? 0 : 0,
     api: features.api ? featureCosts["api"] ?? 0 : 0,
     realtime: features.realtime ? featureCosts["realtime"] ?? 0 : 0,
     analytics: features.analytics ? featureCosts["analytics"] ?? 0 : 0
   }

   totalFeatureCost = sum of all featureCosts values
   ```

   - Only include costs for features that are enabled (true)
   - Use nullish coalescing (??) to default to 0 if feature cost not found

4. **Multiplier Lookup**

   ```
   complexityMultiplier = complexityMultipliers[complexity] || 1.0
   timelineMultiplier = timelineMultipliers[timelineUrgency] || 1.0
   techStackMultiplier = techStackMultipliers[techStackComplexity] || 1.0
   clientTypeMultiplier = clientTypeMultipliers[clientType] || 1.0
   ```

   - Lookup multipliers from database, default to 1.0 if not found

5. **Subtotal Calculation**

   ```
   subtotal = (baseCost + pageCost + totalFeatureCost) × complexityMultiplier
   ```

   - Sum base, page, and feature costs
   - Apply complexity multiplier

6. **Total Calculation**

   ```
   total = subtotal × timelineMultiplier × techStackMultiplier × clientTypeMultiplier
   ```

   - Apply all remaining multipliers multiplicatively to the subtotal

7. **Price Range Calculation**
   ```
   range = {
     min: round(total × 0.85),
     max: round(total × 1.15)
   }
   ```
   - Provide ±15% variance around the total

### Return Type: CostBreakdown

```typescript
interface CostBreakdown {
  baseCost: number;
  featureCosts: {
    cms: number;
    auth: number;
    payment: number;
    api: number;
    realtime: number;
    analytics: number;
  };
  complexityMultiplier: number;
  timelineMultiplier: number;
  techStackMultiplier: number;
  clientTypeMultiplier: number;
  subtotal: number;
  total: number;
  range: {
    min: number;
    max: number;
  };
}
```

## Validation Logic

The calculator performs validation **after** calculation but **before** returning results. It checks:

1. `baseRates` must exist and have at least one entry
2. `featureCosts` must exist and have at least one entry
3. `complexityMultipliers` must exist and have at least one entry
4. `timelineMultipliers` must exist and have at least one entry
5. `techStackMultipliers` must exist and have at least one entry
6. `clientTypeMultipliers` must exist and have at least one entry
7. `pageCostPerPage` must exist and be greater than 0

**Note:** Validation happens after calculation, which means if validation fails, an error is thrown. The calling code should catch this and return a zero-cost breakdown.

## Currency Conversion Logic

### Exchange Rate Fetching

1. **API Source**: Uses `https://api.exchangerate-api.com/v4/latest/ILS`
2. **Caching**: Rates are cached for 1 hour (3,600,000 milliseconds)
3. **Fallback**: If API fails, uses hardcoded fallback rates (ILS as base = 1.0)

### Conversion Formula

```typescript
function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> // ILS-based rates
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;

  // Convert through ILS (base currency)
  // amount_in_ILS = amount / fromRate
  // result = amount_in_ILS * toRate
  const amountInILS = amount / fromRate;
  return amountInILS * toRate;
}
```

**Important**: All rates in the `rates` object are relative to ILS (where ILS = 1.0).

### Conversion Application

After calculating costs in ILS, the calculator converts all monetary values to the target currency:

- `baseCost` → converted from ILS to target currency
- Each `featureCosts` entry → converted from ILS to target currency
- `subtotal` → converted from ILS to target currency
- `total` → converted from ILS to target currency
- `range.min` and `range.max` → converted from ILS to target currency

**Note**: If exchange rates are not loaded or still loading, the values remain in ILS.

## Example Calculation

### Input:

```javascript
{
  projectType: "website",
  complexity: "moderate",
  numPages: 10,
  features: {
    cms: true,
    auth: true,
    payment: false,
    api: false,
    realtime: false,
    analytics: false
  },
  timelineUrgency: "normal",
  techStackComplexity: "standard",
  currency: "USD",
  clientType: "small-business"
}
```

### Rates (from database):

```javascript
{
  baseRates: { "website": 7300, "app": 10000, "ecommerce": 12000, "saas": 15000, "other": 5000 },
  featureCosts: { "cms": 5475, "auth": 3650, "payment": 7300, "api": 5475, "realtime": 10950, "analytics": 3650 },
  complexityMultipliers: { "simple": 1.0, "moderate": 1.5, "complex": 2.0 },
  timelineMultipliers: { "normal": 1.0, "fast": 1.2, "urgent": 1.5 },
  techStackMultipliers: { "standard": 1.0, "advanced": 1.1, "cutting-edge": 1.3 },
  clientTypeMultipliers: { "personal": 1.0, "startup": 1.1, "small-business": 1.0, "medium-business": 1.2, "enterprise": 1.5, "charity": 0.8, "non-profit": 0.85 },
  pageCostPerPage: 548
}
```

### Step-by-Step Calculation (in ILS):

1. **Base Cost**: `7300` (website base rate)
2. **Page Cost**: `10 × 548 = 5480`
3. **Feature Costs**:
   - CMS: `5475`
   - Auth: `3650`
   - Total: `9125`
4. **Multipliers**:
   - Complexity: `1.5` (moderate)
   - Timeline: `1.0` (normal)
   - Tech Stack: `1.0` (standard)
   - Client Type: `1.0` (small-business)
5. **Subtotal**: `(7300 + 5480 + 9125) × 1.5 = 32853`
6. **Total**: `32853 × 1.0 × 1.0 × 1.0 = 32853`
7. **Range**:
   - Min: `round(32853 × 0.85) = 27925`
   - Max: `round(32853 × 1.15) = 37781`

### Currency Conversion (ILS to USD):

Assuming exchange rate `ILS = 1.0`, `USD = 0.274` (1 ILS = 0.274 USD):

- **Base Cost**: `7300 × 0.274 = 2000.2 USD`
- **Total**: `32853 × 0.274 = 9001.7 USD`
- **Range**:
  - Min: `27925 × 0.274 = 7651.5 USD`
  - Max: `37781 × 0.274 = 10352.0 USD`

## Error Handling

1. **Missing Rates**: If required rates are missing from database, `calculateCost()` throws an error. The calling component catches this and returns a zero-cost breakdown.

2. **Missing Exchange Rates**: If exchange rates fail to load, costs remain in ILS (base currency).

3. **Invalid Inputs**: The calculator uses fallback values (0 for costs, 1.0 for multipliers) if specific rates are not found.

## Database Requirements

All rates must be stored in the `calculator_settings` table with the following structure:

- `settingType`: One of `"base_rate"`, `"feature_cost"`, or `"multiplier"`
- `settingKey`: The key identifier (e.g., `"website"`, `"cms"`, `"moderate"`)
- `settingValue`: Either a number (for single values) or a Record<string, number> (for grouped settings)
- `isActive`: Boolean flag to enable/disable settings

The calculator loads these settings and transforms them into the `Rates` structure before calculation.

## Key Implementation Notes

1. **No Hardcoded Values**: All rates must come from the database. The calculator throws errors if required rates are missing.

2. **ILS as Base Currency**: All internal calculations are performed in ILS, then converted to the target currency if exchange rates are available.

3. **Multiplicative Multipliers**: All multipliers after complexity are applied multiplicatively to the subtotal, not additively.

4. **Validation Timing**: Validation happens after calculation but before return, which means partial calculations may occur before errors are detected.

5. **Fallback Behavior**: If a specific rate is not found (e.g., a project type), it falls back to "other" or 0, and multipliers default to 1.0.

6. **Price Range**: The ±15% range is a fixed percentage, not configurable from the database.
