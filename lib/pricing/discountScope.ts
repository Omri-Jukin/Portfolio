/**
 * Discount scope matching logic
 * Determines if a discount applies to a given set of inputs
 */

export interface DiscountAppliesTo {
  projectTypes?: string[];
  features?: string[];
  clientTypes?: string[];
  excludeClientTypes?: string[];
}

export interface DiscountScopeInput {
  projectTypeKey?: string;
  selectedFeatureKeys?: string[];
  clientTypeKey?: string;
}

/**
 * Check if a discount's scope matches the given inputs
 */
export function matchesScope(
  appliesTo: DiscountAppliesTo,
  inputs: DiscountScopeInput
): boolean {
  // Check project type match
  if (appliesTo.projectTypes && appliesTo.projectTypes.length > 0) {
    if (!inputs.projectTypeKey) return false;
    if (!appliesTo.projectTypes.includes(inputs.projectTypeKey)) {
      return false;
    }
  }

  // Check feature match (if any selected features must match)
  if (appliesTo.features && appliesTo.features.length > 0) {
    if (
      !inputs.selectedFeatureKeys ||
      inputs.selectedFeatureKeys.length === 0
    ) {
      return false;
    }
    // At least one selected feature must be in the discount's feature list
    const hasMatchingFeature = inputs.selectedFeatureKeys.some((key) =>
      appliesTo.features!.includes(key)
    );
    if (!hasMatchingFeature) {
      return false;
    }
  }

  // Check client type exclusion (if client type is excluded, discount doesn't apply)
  if (appliesTo.excludeClientTypes && appliesTo.excludeClientTypes.length > 0) {
    if (inputs.clientTypeKey) {
      if (appliesTo.excludeClientTypes.includes(inputs.clientTypeKey)) {
        return false;
      }
    }
  }

  // Check client type inclusion (if specified, must match)
  if (appliesTo.clientTypes && appliesTo.clientTypes.length > 0) {
    if (!inputs.clientTypeKey) return false;
    if (!appliesTo.clientTypes.includes(inputs.clientTypeKey)) {
      return false;
    }
  }

  return true;
}
