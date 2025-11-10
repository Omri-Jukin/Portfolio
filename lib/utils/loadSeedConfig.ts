/**
 * Utility to load and parse seed data from YAML config file
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import type {
  SeedRole,
  SeedDashboardSection,
  SeedProjectType,
  SeedFeature,
  SeedMultiplierGroup,
  SeedProposalStatus,
  SeedProposalTemplate,
} from "../seed-constants";

export interface SeedConfig {
  roles: SeedRole[];
  dashboardSections: SeedDashboardSection[];
  pricing: {
    projectTypes: SeedProjectType[];
    features: SeedFeature[];
    multipliers: Record<string, Omit<SeedMultiplierGroup, "key">>;
    meta: Record<string, { value: unknown; order: number }>;
  };
  calculatorSettings: {
    baseRates: Array<{
      settingKey: string;
      settingValue: number;
      displayName: string;
      description?: string;
    }>;
    pageCost: {
      settingKey: string;
      settingValue: { value: number };
      displayName: string;
      description?: string;
      displayOrder: number;
    };
    featureCosts: Array<{
      settingKey: string;
      settingValue: number;
      displayName: string;
      description?: string;
    }>;
    multipliers: Record<
      string,
      {
        settingKey: string;
        settingValue: Record<string, number>;
        displayName: string;
        description?: string;
        displayOrder: number;
      }
    >;
    meta: Record<
      string,
      {
        settingKey: string;
        settingValue: { value: unknown } | Record<string, unknown>;
        displayName: string;
        description?: string;
        displayOrder: number;
      }
    >;
  };
  discounts: Array<{
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
    startsAt: null;
    endsAt: null;
    maxUses: number | null;
    perUserLimit: number;
    isActive: boolean;
  }>;
  proposals: {
    statuses: SeedProposalStatus[];
    templates: SeedProposalTemplate[];
  };
}

/**
 * Load seed data from YAML config file
 */
export function loadSeedConfig(): SeedConfig {
  const configPath = path.join(process.cwd(), "config", "seed-data.yml");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Seed config file not found at: ${configPath}`);
  }

  const fileContents = fs.readFileSync(configPath, "utf8");
  const config = yaml.load(fileContents) as SeedConfig;

  if (!config) {
    throw new Error("Failed to parse seed config file");
  }

  return config;
}
