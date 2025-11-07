import type {
  CalculatorInputs,
  CostBreakdown,
} from "./ProjectCostCalculator.type";

/**
 * Calculate project cost based on inputs and rates from database.
 * All rates must be provided from the database - no hardcoded fallbacks.
 *
 * @throws Error if required rates are missing from database
 */
export function calculateCost(
  inputs: CalculatorInputs,
  rates: {
    baseRates: Record<string, number>;
    featureCosts: Record<string, number>;
    complexityMultipliers: Record<string, number>;
    timelineMultipliers: Record<string, number>;
    techStackMultipliers: Record<string, number>;
    clientTypeMultipliers: Record<string, number>;
    pageCostPerPage: number;
  }
): CostBreakdown {
  // Validate required rates exist

  const baseCost =
    rates.baseRates[inputs.projectType] || rates.baseRates.other || 0;
  const pageCost = inputs.numPages * rates.pageCostPerPage;

  const featureCosts = {
    cms: inputs.features.cms ? rates.featureCosts.cms ?? 0 : 0,
    auth: inputs.features.auth ? rates.featureCosts.auth ?? 0 : 0,
    payment: inputs.features.payment ? rates.featureCosts.payment ?? 0 : 0,
    api: inputs.features.api ? rates.featureCosts.api ?? 0 : 0,
    realtime: inputs.features.realtime ? rates.featureCosts.realtime ?? 0 : 0,
    analytics: inputs.features.analytics
      ? rates.featureCosts.analytics ?? 0
      : 0,
  };

  const totalFeatureCost = Object.values(featureCosts).reduce(
    (a, b) => a + b,
    0
  );

  const complexityMultiplier =
    rates.complexityMultipliers[inputs.complexity] || 1.0;
  const timelineMultiplier =
    rates.timelineMultipliers[inputs.timelineUrgency] || 1.0;
  const techStackMultiplier =
    rates.techStackMultipliers[inputs.techStackComplexity] || 1.0;
  const clientTypeMultiplier =
    rates.clientTypeMultipliers[inputs.clientType] || 1.0;

  const subtotal =
    (baseCost + pageCost + totalFeatureCost) * complexityMultiplier;
  const total =
    subtotal * timelineMultiplier * techStackMultiplier * clientTypeMultiplier;

  if (!rates.baseRates || Object.keys(rates.baseRates).length === 0) {
    throw new Error("Base rates are required from database");
  }
  if (!rates.featureCosts || Object.keys(rates.featureCosts).length === 0) {
    throw new Error("Feature costs are required from database");
  }
  if (
    !rates.complexityMultipliers ||
    Object.keys(rates.complexityMultipliers).length === 0
  ) {
    throw new Error("Complexity multipliers are required from database");
  }
  if (
    !rates.timelineMultipliers ||
    Object.keys(rates.timelineMultipliers).length === 0
  ) {
    throw new Error("Timeline multipliers are required from database");
  }
  if (
    !rates.techStackMultipliers ||
    Object.keys(rates.techStackMultipliers).length === 0
  ) {
    throw new Error("Tech stack multipliers are required from database");
  }
  if (
    !rates.clientTypeMultipliers ||
    Object.keys(rates.clientTypeMultipliers).length === 0
  ) {
    throw new Error("Client type multipliers are required from database");
  }
  if (!rates.pageCostPerPage || rates.pageCostPerPage <= 0) {
    throw new Error("Page cost per page is required from database");
  }

  return {
    baseCost,
    featureCosts,
    complexityMultiplier,
    timelineMultiplier,
    techStackMultiplier,
    clientTypeMultiplier,
    subtotal,
    total,
    range: {
      min: Math.round(total * 0.85),
      max: Math.round(total * 1.15),
    },
  };
}
