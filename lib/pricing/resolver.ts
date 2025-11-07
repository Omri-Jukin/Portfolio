/**
 * Pricing resolver - fetches and normalizes all pricing data from database
 * Returns a complete PricingModel structure for use in calculations and UI
 */

import { getDB } from "../db/client";
import {
  pricingProjectTypes,
  pricingBaseRates,
  pricingFeatures,
  pricingMultiplierGroups,
  pricingMultiplierValues,
  pricingMeta,
} from "../db/schema/schema.tables";
import { eq, asc } from "drizzle-orm";
import type { PricingModel } from "./types";

export async function getPricingModel(): Promise<PricingModel> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database client not available.");
  }

  // Fetch all active items, sorted by order
  const [projectTypes, baseRates, features, groups, values, meta] =
    await Promise.all([
      db
        .select()
        .from(pricingProjectTypes)
        .where(eq(pricingProjectTypes.isActive, true))
        .orderBy(asc(pricingProjectTypes.order)),
      db
        .select()
        .from(pricingBaseRates)
        .where(eq(pricingBaseRates.isActive, true))
        .orderBy(asc(pricingBaseRates.order)),
      db
        .select()
        .from(pricingFeatures)
        .where(eq(pricingFeatures.isActive, true))
        .orderBy(asc(pricingFeatures.order)),
      db
        .select()
        .from(pricingMultiplierGroups)
        .where(eq(pricingMultiplierGroups.isActive, true))
        .orderBy(asc(pricingMultiplierGroups.order)),
      db
        .select()
        .from(pricingMultiplierValues)
        .where(eq(pricingMultiplierValues.isActive, true))
        .orderBy(asc(pricingMultiplierValues.order)),
      db
        .select()
        .from(pricingMeta)
        .where(eq(pricingMeta.isActive, true))
        .orderBy(asc(pricingMeta.order)),
    ]);

  // Group multiplier values by groupKey
  const valuesByGroup = new Map<string, typeof values>();
  for (const value of values) {
    if (!valuesByGroup.has(value.groupKey)) {
      valuesByGroup.set(value.groupKey, []);
    }
    valuesByGroup.get(value.groupKey)!.push(value);
  }

  // Build multiplier groups with their options
  const multiplierGroups = groups.map((group) => ({
    key: group.key,
    displayName: group.displayName,
    order: group.order,
    isActive: group.isActive,
    options: (valuesByGroup.get(group.key) || []).map((v) => ({
      optionKey: v.optionKey,
      value: Number(v.value),
      isFixed: v.isFixed,
      displayName: v.displayName,
      order: v.order,
      isActive: v.isActive,
    })),
  }));

  // Parse meta settings
  const metaMap = new Map<string, unknown>();
  for (const m of meta) {
    metaMap.set(m.key, m.value);
  }

  const pageCostPerPage =
    (metaMap.get("pageCostPerPage") as { value?: number })?.value ?? 750;
  const rangePercent =
    (metaMap.get("rangePercent") as { value?: number })?.value ?? 0.18;
  const defaultCurrency =
    (metaMap.get("defaultCurrency") as { value?: string })?.value ?? "ILS";
  const projectMinimums =
    (metaMap.get("projectMinimums") as Record<string, number>) ?? {};

  return {
    projectTypes: projectTypes.map((pt) => ({
      key: pt.key,
      baseRateIls: pt.baseRateIls, // Default base rate
      displayName: pt.displayName,
      order: pt.order,
      isActive: pt.isActive,
    })),
    baseRates: baseRates.map((br) => ({
      projectTypeKey: br.projectTypeKey,
      clientTypeKey: br.clientTypeKey,
      baseRateIls: br.baseRateIls,
      order: br.order,
      isActive: br.isActive,
    })),
    features: features.map((f) => ({
      key: f.key,
      costIls: f.defaultCostIls,
      displayName: f.displayName,
      group: f.group,
      order: f.order,
      isActive: f.isActive,
    })),
    multiplierGroups,
    meta: {
      pageCostPerPage,
      rangePercent,
      defaultCurrency,
      projectMinimums,
    },
  };
}

