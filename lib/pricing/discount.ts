/**
 * Discount application logic
 * Applies discounts to cost calculations
 */

import type { pricingDiscounts } from "../db/schema/schema.tables";

type PricingDiscount = typeof pricingDiscounts.$inferSelect;
import { matchesScope } from "./discountScope";

export interface ApplyDiscountInput {
  discount: PricingDiscount;
  total: number;
  scopeInput: {
    projectTypeKey?: string;
    selectedFeatureKeys?: string[];
    clientTypeKey?: string;
  };
}

/**
 * Apply a discount to a total amount
 * Returns the discounted total and discount details, or null if discount doesn't apply
 */
export function applyDiscount(input: ApplyDiscountInput): {
  discountedTotal: number;
  discountAmount: number;
  discountType: PricingDiscount["discountType"];
  originalTotal: number;
} | null {
  const { discount, total, scopeInput } = input;

  // Check if discount is active
  if (!discount.isActive) {
    return null;
  }

  // Check date validity
  const now = new Date();
  if (discount.startsAt && new Date(discount.startsAt) > now) {
    return null; // Discount hasn't started yet
  }
  if (discount.endsAt && new Date(discount.endsAt) < now) {
    return null; // Discount has expired
  }

  // Check usage limits
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return null; // Discount has reached max uses
  }

  // Check scope match
  const appliesTo = discount.appliesTo as {
    projectTypes?: string[];
    features?: string[];
    clientTypes?: string[];
    excludeClientTypes?: string[];
  };
  if (!matchesScope(appliesTo, scopeInput)) {
    return null; // Discount doesn't apply to this scope
  }

  // Apply discount
  const discountAmount = parseFloat(discount.amount);
  let discountedTotal = total;

  if (discount.discountType === "percent") {
    // Percent discount: reduce by percentage
    discountedTotal = Math.max(0, total * (1 - discountAmount / 100));
  } else {
    // Fixed discount: subtract fixed amount
    discountedTotal = Math.max(0, total - discountAmount);
  }

  const actualDiscountAmount = total - discountedTotal;

  return {
    discountedTotal,
    discountAmount: actualDiscountAmount,
    discountType: discount.discountType,
    originalTotal: total,
  };
}
