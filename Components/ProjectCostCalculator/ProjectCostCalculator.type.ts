export type ProjectType = "website" | "app" | "ecommerce" | "saas" | "other";

export type ComplexityLevel = "simple" | "moderate" | "complex";

export type TimelineUrgency = "normal" | "fast" | "urgent";
export type TechStackComplexity = "standard" | "advanced" | "cutting-edge";

export type ClientType =
  | "personal"
  | "startup"
  | "small-business"
  | "medium-business"
  | "enterprise"
  | "charity"
  | "non-profit";

export interface CalculatorInputs {
  projectType: ProjectType;
  complexity: ComplexityLevel;
  numPages: number;
  features: {
    cms: boolean;
    auth: boolean;
    payment: boolean;
    api: boolean;
    realtime: boolean;
    analytics: boolean;
  };
  timelineUrgency: TimelineUrgency;
  techStackComplexity: TechStackComplexity;
  currency: string;
  clientType: ClientType;
}

export interface CostBreakdown {
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

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

/**
 * Type guard to check if a value is a record of numbers
 */
export function isNumberRecord(
  value: unknown
): value is Record<string, number> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((v) => typeof v === "number")
  );
}

/**
 * Type guard to check if a value is a valid setting value
 * Also handles JSONB deserialization where numbers might be strings
 */
export function isValidSettingValue(
  value: unknown
): value is number | Record<string, number> {
  // Direct number check
  if (isNumber(value)) {
    return true;
  }

  // String that can be parsed as number (JSONB edge case)
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return true; // Treat as valid, caller will need to parse
    }
  }

  // Record check
  return isNumberRecord(value);
}

export interface CalculatorSettings {
  settingType: string;
  settingKey: string;
  settingValue: number | Record<string, number>;
  displayName: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type for calculator settings from the API (with unknown settingValue)
 */
export interface CalculatorSettingsFromAPI {
  id: string;
  settingType: string;
  settingKey: string;
  settingValue?: unknown;
  displayName: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
