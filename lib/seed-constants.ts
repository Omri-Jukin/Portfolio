/**
 * Centralized constants, types, and enums for database seeding
 * Single source of truth for all seed-related data structures
 *
 * Import with: import { SEED_CONSTANTS, SeedRole, SeedProjectType, ... } from "$/seed-constants"
 */

// ========================
// TYPES & INTERFACES
// ========================

export interface SeedRole {
  name: string;
  displayName: string;
  description: string;
  permissions: {
    canAccessAdmin: boolean;
    canEditContent: boolean;
    canEditTables: string[] | ["*"];
  };
  isActive: boolean;
  displayOrder: number;
}

export interface SeedDashboardSection {
  sectionKey: string;
  displayOrder: number;
  enabled: boolean;
}

export interface SeedProjectType {
  key: string;
  displayName: string;
  baseRateIls: number;
  order: number;
}

export interface SeedFeature {
  key: string;
  displayName: string;
  defaultCostIls: number;
  order: number;
}

export interface SeedMultiplierValue {
  optionKey: string;
  displayName: string;
  value: number;
  isFixed: boolean;
  order: number;
}

export interface SeedMultiplierGroup {
  key: string;
  displayName: string;
  order: number;
  values: SeedMultiplierValue[];
}

export interface SeedTaxProfile {
  key: string;
  label: string;
  lines: Array<{
    kind: "vat" | "surcharge" | "withholding";
    type: "percent" | "fixed";
    value: number;
    orderIndex: number;
    label: string;
  }>;
}

export interface SeedPricingMeta {
  key: string;
  value: unknown;
  order: number;
}

export interface SeedDiscount {
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  amount: string;
  currency: string;
  appliesTo: {
    projectTypes?: string[];
    features?: string[];
    clientTypes?: string[];
    excludeClientTypes?: string[];
  };
  startsAt: Date | null;
  endsAt: Date | null;
  maxUses: number | null;
  perUserLimit: number;
  isActive: boolean;
}

export interface SeedProposalStatus {
  key: string;
  label: string;
  color: string;
}

export interface SeedProposalTemplate {
  name: string;
  description: string;
  defaultCurrency: string;
  defaultTaxProfileKey: string;
  defaultPriceDisplay: "taxExclusive" | "taxInclusive";
  templateData: {
    sections: Array<{
      key: string;
      label: string;
      description: string;
      sortOrder: number;
    }>;
  };
  isActive: boolean;
  displayOrder: number;
}

export interface SeedCalculatorSetting {
  settingType:
    | "base_rate"
    | "feature_cost"
    | "multiplier"
    | "page_cost"
    | "meta";
  settingKey: string;
  settingValue: number | { value: number } | Record<string, number>;
  displayName: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

// ========================
// ENUMS
// ========================

export enum SeedSettingType {
  BASE_RATE = "base_rate",
  FEATURE_COST = "feature_cost",
  MULTIPLIER = "multiplier",
  PAGE_COST = "page_cost",
  META = "meta",
}

export enum SeedDiscountType {
  PERCENT = "percent",
  FIXED = "fixed",
}

export enum SeedTaxKind {
  VAT = "vat",
  SURCHARGE = "surcharge",
  WITHHOLDING = "withholding",
}

export enum SeedTaxType {
  PERCENT = "percent",
  FIXED = "fixed",
}

export enum SeedPriceDisplay {
  TAX_EXCLUSIVE = "taxExclusive",
  TAX_INCLUSIVE = "taxInclusive",
}

export enum SeedProposalStatusKey {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

// ========================
// CONSTANTS
// ========================

export const DEFAULT_CURRENCY = "ILS" as const;
export const DEFAULT_TAX_PROFILE_KEY = "israel-vat" as const;
export const DEFAULT_PRICE_DISPLAY: SeedPriceDisplay =
  SeedPriceDisplay.TAX_EXCLUSIVE;

export const PAGE_COST_PER_PAGE = 600;
export const RANGE_PERCENT = 0.18;

export const PROJECT_TYPE_KEYS = {
  LANDING_PAGE: "landing-page",
  WEBSITE: "website",
  PORTFOLIO: "portfolio",
  BLOG: "blog",
  APP: "app",
  ECOMMERCE: "ecommerce",
  SAAS: "saas",
  OTHER: "other",
} as const;

export const FEATURE_KEYS = {
  CMS: "cms",
  AUTH: "auth",
  PAYMENT: "payment",
  API: "api",
  REALTIME: "realtime",
  ANALYTICS: "analytics",
} as const;

export const MULTIPLIER_GROUP_KEYS = {
  COMPLEXITY: "complexity",
  TIMELINE: "timeline",
  TECH: "tech",
  CLIENT_TYPE: "clientType",
} as const;

export const CLIENT_TYPE_KEYS = {
  PERSONAL: "personal",
  STARTUP: "startup",
  SMALL_BUSINESS: "small-business",
  MEDIUM_BUSINESS: "medium-business",
  ENTERPRISE: "enterprise",
  CHARITY: "charity",
  NON_PROFIT: "non-profit",
} as const;

export const COMPLEXITY_KEYS = {
  SIMPLE: "simple",
  MODERATE: "moderate",
  COMPLEX: "complex",
} as const;

export const TIMELINE_KEYS = {
  NORMAL: "normal",
  FAST: "fast",
  URGENT: "urgent",
} as const;

export const TECH_KEYS = {
  STANDARD: "standard",
  ADVANCED: "advanced",
  CUTTING_EDGE: "cutting-edge",
} as const;

// ========================
// TYPE EXPORTS
// ========================

export type ProjectTypeKey =
  (typeof PROJECT_TYPE_KEYS)[keyof typeof PROJECT_TYPE_KEYS];
export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];
export type MultiplierGroupKey =
  (typeof MULTIPLIER_GROUP_KEYS)[keyof typeof MULTIPLIER_GROUP_KEYS];
export type ClientTypeKey =
  (typeof CLIENT_TYPE_KEYS)[keyof typeof CLIENT_TYPE_KEYS];
export type ComplexityKey =
  (typeof COMPLEXITY_KEYS)[keyof typeof COMPLEXITY_KEYS];
export type TimelineKey = (typeof TIMELINE_KEYS)[keyof typeof TIMELINE_KEYS];
export type TechKey = (typeof TECH_KEYS)[keyof typeof TECH_KEYS];
