/**
 * Proposal totals calculation engine
 * Handles multi-tax calculations, discount stacking, and money formatting
 * All calculations use minor units (integers) internally
 */

import type { PricingMeta } from "../db/schema/schema.tables";
import { TaxManager } from "./TaxManager";

// ============================================
// Types
// ============================================

export interface TaxLine {
  kind: "vat" | "surcharge" | "withholding";
  type: "percent" | "fixed";
  value: number; // percent (0-100) or fixed amount in minor units
  orderIndex: number;
  label: string;
}

export interface TaxProfile {
  key: string;
  label: string;
  lines: TaxLine[];
}

export interface ProposalLineItem {
  id: string;
  sectionId?: string | null;
  featureKey?: string | null;
  label: string;
  description?: string | null;
  quantity: number;
  unitPriceMinor: number;
  isOptional: boolean;
  isSelected: boolean;
  taxClass?: string | null;
}

export interface ProposalSection {
  id: string;
  sortOrder: number;
}

export interface ProposalDiscount {
  id: string;
  scope: "overall" | "section" | "line";
  sectionId?: string | null;
  lineItemId?: string | null;
  type: "percent" | "fixed";
  amountMinor?: number | null;
  percent?: number | null;
  label: string;
}

export interface ProposalTax {
  id: string;
  scope: "overall" | "section" | "line";
  sectionId?: string | null;
  lineItemId?: string | null;
  kind: "vat" | "surcharge" | "withholding";
  type: "percent" | "fixed";
  rateOrAmount: number; // percent (0-100) or fixed amount in minor units
  orderIndex: number;
  label: string;
}

export interface ProposalTotalsInput {
  currency: string;
  priceDisplay: "taxExclusive" | "taxInclusive";
  taxProfileKey?: string | null;
  taxLines?: TaxLine[];
  sections: ProposalSection[];
  lineItems: ProposalLineItem[];
  discounts: ProposalDiscount[];
  taxes: ProposalTax[];
  pricingMeta?: PricingMeta[];
}

export interface DiscountBreakdown {
  scope: "overall" | "section" | "line";
  label: string;
  amountMinor: number;
  type: "percent" | "fixed";
}

export interface TaxBreakdown {
  label: string;
  amountMinor: number;
  kind: "vat" | "surcharge" | "withholding";
}

export interface ProposalTotalsOutput {
  subtotalMinor: number;
  discountsBreakdown: DiscountBreakdown[];
  preTaxTotalMinor: number;
  taxBreakdown: TaxBreakdown[];
  taxTotalMinor: number;
  grandTotalMinor: number;
  currency: string;
  computedAt: string;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Round using ROUND_HALF_UP strategy
 * JavaScript's Math.round uses ROUND_HALF_UP for positive numbers
 */
function roundHalfUp(value: number): number {
  return Math.round(value);
}

/**
 * Format money from minor units to display string
 */
export function formatMoney(amountMinor: number, currency: string): string {
  const major = amountMinor / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}

/**
 * Resolve tax profile from pricing meta
 */
export function resolveTaxProfile(key: string, meta: PricingMeta[]): TaxLine[] {
  const taxProfilesMeta = meta.find((m) => m.key === "tax_profiles");
  if (!taxProfilesMeta) {
    return [];
  }

  const profiles = taxProfilesMeta.value as TaxProfile[];
  const profile = profiles.find((p) => p.key === key);
  if (!profile) {
    return [];
  }

  return profile.lines;
}

/**
 * Apply discounts to a base amount
 * Returns the discounted amount and breakdown
 */
function applyDiscounts(
  baseMinor: number,
  discounts: ProposalDiscount[],
  scope: "line" | "section" | "overall"
): { discountedMinor: number; breakdown: DiscountBreakdown[] } {
  const applicableDiscounts = discounts.filter((d) => d.scope === scope);
  if (applicableDiscounts.length === 0) {
    return { discountedMinor: baseMinor, breakdown: [] };
  }

  let currentAmount = baseMinor;
  const breakdown: DiscountBreakdown[] = [];

  for (const discount of applicableDiscounts) {
    let discountAmount = 0;

    if (discount.type === "percent" && discount.percent) {
      discountAmount = roundHalfUp((currentAmount * discount.percent) / 100);
    } else if (discount.type === "fixed" && discount.amountMinor) {
      discountAmount = discount.amountMinor;
    }

    if (discountAmount > 0) {
      currentAmount = Math.max(0, currentAmount - discountAmount);
      breakdown.push({
        scope: discount.scope,
        label: discount.label,
        amountMinor: discountAmount,
        type: discount.type,
      });
    }
  }

  return { discountedMinor: currentAmount, breakdown };
}

// applyTaxes function removed - now using TaxManager.calculateTaxes

// ============================================
// Main Calculation Function
// ============================================

/**
 * Calculate proposal totals with multi-tax and discount support
 */
export function calcProposalTotals(
  input: ProposalTotalsInput
): ProposalTotalsOutput {
  const {
    currency,
    priceDisplay,
    taxProfileKey,
    taxLines: explicitTaxLines,
    sections,
    lineItems,
    discounts,
    taxes: explicitTaxes,
    pricingMeta = [],
  } = input;

  // Resolve tax lines (from profile or explicit)
  let taxLines: TaxLine[] = [];
  if (explicitTaxLines && explicitTaxLines.length > 0) {
    taxLines = explicitTaxLines;
  } else if (taxProfileKey) {
    taxLines = resolveTaxProfile(taxProfileKey, pricingMeta);
  }

  // Convert tax lines to ProposalTax format for processing
  const taxes: ProposalTax[] = [
    ...explicitTaxes,
    ...taxLines.map((tl, idx) => ({
      id: `profile-${idx}`,
      scope: "overall" as const,
      sectionId: null,
      lineItemId: null,
      kind: tl.kind,
      type: tl.type,
      rateOrAmount: tl.value,
      orderIndex: tl.orderIndex,
      label: tl.label,
    })),
  ];

  // ============================================
  // Step 1: Calculate line item totals (raw and discounted)
  // ============================================
  const lineTotalsRaw = new Map<string, number>(); // Before discounts
  const lineTotals = new Map<string, number>(); // After discounts
  const lineDiscounts = new Map<string, DiscountBreakdown[]>();

  for (const item of lineItems) {
    if (item.isOptional && !item.isSelected) {
      continue; // Skip unselected optional items
    }

    const lineTotalMinor = roundHalfUp(item.quantity * item.unitPriceMinor);
    lineTotalsRaw.set(item.id, lineTotalMinor);

    // Apply line-level discounts
    const lineDiscountsList = discounts.filter(
      (d) => d.scope === "line" && d.lineItemId === item.id
    );
    const { discountedMinor, breakdown } = applyDiscounts(
      lineTotalMinor,
      lineDiscountsList,
      "line"
    );

    lineTotals.set(item.id, discountedMinor);
    if (breakdown.length > 0) {
      lineDiscounts.set(item.id, breakdown);
    }
  }

  // ============================================
  // Step 2: Calculate section totals
  // ============================================
  const sectionTotals = new Map<string, number>();
  const sectionDiscounts = new Map<string, DiscountBreakdown[]>();

  for (const section of sections.sort((a, b) => a.sortOrder - b.sortOrder)) {
    let sectionTotalMinor = 0;

    // Sum line items in this section
    for (const item of lineItems) {
      if (item.sectionId === section.id) {
        const lineTotal = lineTotals.get(item.id) || 0;
        sectionTotalMinor += lineTotal;
      }
    }

    // Apply section-level discounts
    const sectionDiscountsList = discounts.filter(
      (d) => d.scope === "section" && d.sectionId === section.id
    );
    const { discountedMinor, breakdown } = applyDiscounts(
      sectionTotalMinor,
      sectionDiscountsList,
      "section"
    );

    sectionTotals.set(section.id, discountedMinor);
    if (breakdown.length > 0) {
      sectionDiscounts.set(section.id, breakdown);
    }
  }

  // ============================================
  // Step 3: Calculate overall subtotal (BEFORE discounts)
  // ============================================
  // Subtotal should be the sum of all line items before any discounts
  let subtotalMinor = 0;

  // Sum all line items (raw, before discounts)
  for (const item of lineItems) {
    if (item.isOptional && !item.isSelected) {
      continue;
    }
    const lineTotal = lineTotalsRaw.get(item.id) || 0;
    subtotalMinor += lineTotal;
  }

  // ============================================
  // Step 4: Calculate pre-tax total (after all discounts)
  // ============================================
  // First, calculate the total after section and line discounts
  let discountedSubtotalMinor = 0;

  // Sum all section totals (which already have section discounts applied)
  for (const sectionTotal of sectionTotals.values()) {
    discountedSubtotalMinor += sectionTotal;
  }

  // Add line items not in any section (which already have line discounts applied)
  for (const item of lineItems) {
    if (!item.sectionId && (!item.isOptional || item.isSelected)) {
      const lineTotal = lineTotals.get(item.id) || 0;
      discountedSubtotalMinor += lineTotal;
    }
  }

  // Apply overall discounts to the already-discounted subtotal
  const overallDiscountsList = discounts.filter((d) => d.scope === "overall");
  const { discountedMinor: preTaxTotalMinor, breakdown: overallDiscounts } =
    applyDiscounts(discountedSubtotalMinor, overallDiscountsList, "overall");

  // Collect all discount breakdowns
  const discountsBreakdown: DiscountBreakdown[] = [
    ...overallDiscounts,
    ...Array.from(sectionDiscounts.values()).flat(),
    ...Array.from(lineDiscounts.values()).flat(),
  ];

  // ============================================
  // Step 5: Apply taxes
  // ============================================
  // Check if all line items are exempt
  const allItemsExempt = lineItems
    .filter((item) => !item.isOptional || item.isSelected)
    .every((item) => item.taxClass === "exempt");

  const overallTaxes = taxes.filter((t) => t.scope === "overall");

  // If priceDisplay is taxInclusive, we need to extract tax from the total
  // Otherwise, we add tax to the pre-tax total
  let taxBreakdown: TaxBreakdown[] = [];
  let taxTotalMinor = 0;
  let grandTotalMinor = preTaxTotalMinor;

  if (priceDisplay === "taxExclusive") {
    // Add taxes to pre-tax total (skip if all items are exempt)
    if (allItemsExempt) {
      taxBreakdown = [];
      taxTotalMinor = 0;
      grandTotalMinor = preTaxTotalMinor;
    } else {
      const { taxedMinor, breakdown } = TaxManager.calculateTaxes(
        preTaxTotalMinor,
        overallTaxes
      );
      grandTotalMinor = taxedMinor;
      taxBreakdown = breakdown;
      taxTotalMinor = breakdown.reduce((sum, t) => sum + t.amountMinor, 0);
    }
  } else {
    // taxInclusive: the preTaxTotalMinor already includes tax
    // We need to extract the tax amount from the total
    // Formula: base = total / (1 + tax_rate), tax = total - base
    if (allItemsExempt) {
      taxBreakdown = [];
      taxTotalMinor = 0;
      grandTotalMinor = preTaxTotalMinor;
    } else {
      // For tax inclusive, use TaxManager to extract tax from the total
      const extraction = TaxManager.extractTaxFromInclusive(
        preTaxTotalMinor,
        overallTaxes
      );
      taxBreakdown = extraction.breakdown;
      taxTotalMinor = extraction.taxAmount;
      grandTotalMinor = preTaxTotalMinor; // Total stays the same (already includes tax)
    }
  }

  // ============================================
  // Step 6: Return results
  // ============================================
  return {
    subtotalMinor: roundHalfUp(subtotalMinor),
    discountsBreakdown,
    preTaxTotalMinor: roundHalfUp(preTaxTotalMinor),
    taxBreakdown,
    taxTotalMinor: roundHalfUp(taxTotalMinor),
    grandTotalMinor: roundHalfUp(grandTotalMinor),
    currency,
    computedAt: new Date().toISOString(),
  };
}
