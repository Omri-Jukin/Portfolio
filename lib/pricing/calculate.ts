/**
 * Pure calculation function for dynamic pricing model
 * No hardcoded types - all inputs are string keys from database
 */

import type { PricingModel, CalculatorInputs, CostBreakdown } from "./types";

/**
 * Get multiplier value for a given group and option
 */
function getMultiplier(
  pricingModel: PricingModel,
  groupKey: string,
  optionKey: string
): number {
  const group = pricingModel.multiplierGroups.find((g) => g.key === groupKey);
  if (!group) {
    console.warn(`Multiplier group '${groupKey}' not found, defaulting to 1.0`);
    return 1.0;
  }

  const option = group.options.find((o) => o.optionKey === optionKey);
  if (!option) {
    console.warn(
      `Multiplier option '${optionKey}' not found in group '${groupKey}', defaulting to 1.0`
    );
    return 1.0;
  }

  return option.value;
}

/**
 * Calculate project cost estimate using dynamic pricing model
 */
export function calculateEstimate(
  pricingModel: PricingModel,
  inputs: CalculatorInputs,
  discount?: { type: "percent" | "fixed"; amount: number }
): CostBreakdown {
  // 1. Base cost - check for client-type-specific rate first, then default
  const clientSpecificRate = pricingModel.baseRates.find(
    (br) =>
      br.projectTypeKey === inputs.projectTypeKey &&
      br.clientTypeKey === inputs.clientTypeKey
  );

  let baseCost = 0;
  if (clientSpecificRate) {
    baseCost = clientSpecificRate.baseRateIls;
  } else {
    // Fallback to default project type rate
    const projectType = pricingModel.projectTypes.find(
      (pt) => pt.key === inputs.projectTypeKey
    );
    baseCost = projectType?.baseRateIls ?? 0;
  }

  // 2. Page cost
  const pageCost = inputs.numPages * pricingModel.meta.pageCostPerPage;

  // 3. Feature costs
  const featureCosts: Record<string, number> = {};
  let totalFeatureCost = 0;

  for (const featureKey of inputs.selectedFeatureKeys) {
    const feature = pricingModel.features.find((f) => f.key === featureKey);
    if (feature) {
      featureCosts[featureKey] = feature.costIls;
      totalFeatureCost += feature.costIls;
    }
  }

  // 4. Multipliers
  const complexityMultiplier = getMultiplier(
    pricingModel,
    "complexity",
    inputs.complexityKey
  );
  const timelineMultiplier = getMultiplier(
    pricingModel,
    "timeline",
    inputs.timelineKey
  );
  const techStackMultiplier = getMultiplier(
    pricingModel,
    "tech",
    inputs.techKey
  );
  const clientTypeMultiplier = getMultiplier(
    pricingModel,
    "clientType",
    inputs.clientTypeKey
  );

  // 5. Subtotal (after complexity multiplier)
  const subtotal =
    (baseCost + pageCost + totalFeatureCost) * complexityMultiplier;

  // 6. Total (after all remaining multipliers)
  const total =
    subtotal * timelineMultiplier * techStackMultiplier * clientTypeMultiplier;

  // 7. Apply discount if provided (after multipliers, before range)
  let discountedTotal = total;
  let discountApplied: CostBreakdown["discountApplied"] | undefined;

  if (discount) {
    if (discount.type === "percent") {
      discountedTotal = Math.max(0, total * (1 - discount.amount / 100));
    } else {
      discountedTotal = Math.max(0, total - discount.amount);
    }
    discountApplied = {
      type: discount.type,
      amount: discount.amount,
      discountedTotal,
    };
  }

  // 8. Range calculation (based on discounted total if discount applied)
  const finalTotal = discountApplied ? discountedTotal : total;
  const rangePercent = pricingModel.meta.rangePercent;
  const min = Math.round(finalTotal * (1 - rangePercent));
  const max = Math.round(finalTotal * (1 + rangePercent));

  return {
    baseCost,
    pageCost,
    featureCosts,
    totalFeatureCost,
    complexityMultiplier,
    timelineMultiplier,
    techStackMultiplier,
    clientTypeMultiplier,
    subtotal,
    total: finalTotal,
    range: {
      min,
      max,
    },
    discountApplied,
  };
}
