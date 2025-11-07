/**
 * Legacy adapter - reads from calculator_settings if new tables are empty
 * Provides backward compatibility during migration period
 */

import { getDB } from "../db/client";
import { calculatorSettings } from "../db/schema/schema.tables";
import { eq } from "drizzle-orm";
import type { PricingModel } from "./types";

/**
 * Load pricing model from legacy calculator_settings table
 * This is a fallback if new normalized tables are empty
 */
export async function loadLegacyPricingModel(): Promise<PricingModel | null> {
  const db = await getDB();
  if (!db) {
    return null;
  }

  try {
    const settings = await db
      .select()
      .from(calculatorSettings)
      .where(eq(calculatorSettings.isActive, true));

    if (settings.length === 0) {
      return null;
    }

    console.warn(
      "⚠️  Using legacy calculator_settings table. Please migrate to new pricing tables."
    );

    // Build pricing model from legacy structure
    const projectTypes: PricingModel["projectTypes"] = [];
    const features: PricingModel["features"] = [];
    const multiplierGroups: PricingModel["multiplierGroups"] = [];
    const meta: PricingModel["meta"] = {
      pageCostPerPage: 750,
      rangePercent: 0.18,
      defaultCurrency: "ILS",
      projectMinimums: {},
    };

    for (const setting of settings) {
      const settingValue = setting.settingValue as unknown;

      // Base rates → Project Types
      if (setting.settingType === "base_rate") {
        const value =
          typeof settingValue === "number"
            ? settingValue
            : typeof settingValue === "object" &&
              settingValue !== null &&
              "value" in settingValue
            ? (settingValue as { value: number }).value
            : Number(settingValue) || 0;

        projectTypes.push({
          key: setting.settingKey,
          displayName: setting.displayName,
          baseRateIls: Math.round(value),
          order: setting.displayOrder,
          isActive: setting.isActive,
        });
      }

      // Feature costs → Features
      else if (setting.settingType === "feature_cost") {
        const value =
          typeof settingValue === "number"
            ? settingValue
            : typeof settingValue === "object" &&
              settingValue !== null &&
              "value" in settingValue
            ? (settingValue as { value: number }).value
            : Number(settingValue) || 0;

        features.push({
          key: setting.settingKey,
          displayName: setting.displayName,
          costIls: Math.round(value),
          group: null,
          order: setting.displayOrder,
          isActive: setting.isActive,
        });
      }

      // Multipliers → Multiplier Groups + Values
      else if (setting.settingType === "multiplier") {
        const multiplierMap =
          typeof settingValue === "object" && settingValue !== null
            ? (settingValue as Record<string, number | string>)
            : {};

        const options = Object.entries(multiplierMap).map(
          ([optionKey, optionValue], index) => {
            const numValue =
              typeof optionValue === "number"
                ? optionValue
                : Number(optionValue) || 1.0;
            return {
              optionKey,
              displayName:
                optionKey.charAt(0).toUpperCase() + optionKey.slice(1),
              value: numValue,
              isFixed: numValue === 1.0,
              order: index,
              isActive: true,
            };
          }
        );

        multiplierGroups.push({
          key: setting.settingKey,
          displayName: setting.displayName,
          order: setting.displayOrder,
          isActive: setting.isActive,
          options,
        });
      }

      // Meta settings
      else if (setting.settingType === "meta") {
        if (setting.settingKey === "pageCostPerPage") {
          const value =
            typeof settingValue === "object" &&
            settingValue !== null &&
            "value" in settingValue
              ? (settingValue as { value: number }).value
              : 750;
          meta.pageCostPerPage = Math.round(value);
        } else if (setting.settingKey === "rangePercent") {
          const value =
            typeof settingValue === "object" &&
            settingValue !== null &&
            "value" in settingValue
              ? (settingValue as { value: number }).value
              : 0.18;
          meta.rangePercent = value;
        } else if (setting.settingKey === "defaultCurrency") {
          const value =
            typeof settingValue === "object" &&
            settingValue !== null &&
            "value" in settingValue
              ? (settingValue as { value: string }).value
              : "ILS";
          meta.defaultCurrency = value;
        } else if (setting.settingKey === "projectMinimums") {
          const value =
            typeof settingValue === "object" && settingValue !== null
              ? (settingValue as Record<string, number>)
              : {};
          meta.projectMinimums = value;
        }
      } else if (setting.settingType === "page_cost") {
        const value =
          typeof settingValue === "object" &&
          settingValue !== null &&
          "value" in settingValue
            ? (settingValue as { value: number }).value
            : 750;
        meta.pageCostPerPage = Math.round(value);
      }
    }

    // Sort by order
    projectTypes.sort((a, b) => a.order - b.order);
    features.sort((a, b) => a.order - b.order);
    multiplierGroups.sort((a, b) => a.order - b.order);
    for (const group of multiplierGroups) {
      group.options.sort((a, b) => a.order - b.order);
    }

    return {
      projectTypes,
      baseRates: [], // Legacy adapter doesn't support client-type-specific base rates
      features,
      multiplierGroups,
      meta,
    };
  } catch (error) {
    console.error("Error loading legacy pricing model:", error);
    return null;
  }
}
