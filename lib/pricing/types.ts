/**
 * Dynamic pricing types - replaces hardcoded unions
 * All pricing data is now database-driven and iterable
 */

export type DynProjectType = {
  key: string;
  baseRateIls: number;
  displayName: string;
  order: number;
  isActive: boolean;
};

export type DynFeature = {
  key: string;
  costIls: number;
  displayName: string;
  group: string | null;
  order: number;
  isActive: boolean;
};

export type DynMultiplierOption = {
  optionKey: string;
  value: number;
  isFixed: boolean;
  displayName: string;
  order: number;
  isActive: boolean;
};

export type DynMultiplierGroup = {
  key: string;
  displayName: string;
  order: number;
  isActive: boolean;
  options: DynMultiplierOption[];
};

export type PricingMetaValues = {
  pageCostPerPage: number;
  rangePercent: number;
  defaultCurrency: string;
  projectMinimums: Record<string, number>;
};

export type DynBaseRate = {
  projectTypeKey: string;
  clientTypeKey: string | null; // null = default rate, otherwise client-type-specific
  baseRateIls: number;
  order: number;
  isActive: boolean;
};

export type PricingModel = {
  projectTypes: DynProjectType[];
  baseRates: DynBaseRate[]; // Client-type-specific base rates
  features: DynFeature[];
  multiplierGroups: DynMultiplierGroup[];
  meta: PricingMetaValues;
};

export type CalculatorInputs = {
  projectTypeKey: string;
  numPages: number;
  selectedFeatureKeys: string[];
  complexityKey: string;
  timelineKey: string;
  techKey: string;
  clientTypeKey: string;
  currency?: string;
};

export interface CostBreakdown {
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
  range: {
    min: number;
    max: number;
  };
  discountApplied?: {
    type: "percent" | "fixed";
    amount: number;
    discountedTotal: number;
  };
}

