/**
 * TaxManager - Centralized tax calculation system
 * Handles all tax-related calculations for proposals
 */

import type { PricingMeta } from "../db/schema/schema.tables";
import type { ProposalTax, TaxLine, TaxProfile } from "./calcProposalTotals";

export interface TaxCalculationResult {
  taxedMinor: number;
  breakdown: TaxBreakdown[];
}

export interface TaxExtractionResult {
  baseAmount: number;
  taxAmount: number;
  breakdown: TaxBreakdown[];
}

export interface TaxBreakdown {
  label: string;
  amountMinor: number;
  kind: "vat" | "surcharge" | "withholding";
}

/**
 * Round using ROUND_HALF_UP strategy
 */
function roundHalfUp(value: number): number {
  return Math.round(value);
}

/**
 * Centralized tax calculation manager
 */
export class TaxManager {
  /**
   * Calculate taxes on a base amount
   * Returns the taxed amount and breakdown
   * Supports multi-tax stacks with orderIndex
   */
  static calculateTaxes(
    baseMinor: number,
    taxes: ProposalTax[],
    taxClass?: string | null
  ): TaxCalculationResult {
    // Skip taxes if taxClass is exempt
    if (taxClass === "exempt") {
      return { taxedMinor: baseMinor, breakdown: [] };
    }

    // Sort taxes by orderIndex
    const sortedTaxes = [...taxes].sort((a, b) => a.orderIndex - b.orderIndex);

    let currentAmount = baseMinor;
    const breakdown: TaxBreakdown[] = [];

    for (const tax of sortedTaxes) {
      let taxAmount = 0;

      if (tax.type === "percent") {
        taxAmount = roundHalfUp((currentAmount * tax.rateOrAmount) / 100);
      } else {
        // Fixed amount
        taxAmount = roundHalfUp(tax.rateOrAmount);
      }

      // Withholding is negative, others are positive
      if (tax.kind === "withholding") {
        taxAmount = -taxAmount;
      }

      currentAmount += taxAmount;
      breakdown.push({
        label: tax.label,
        amountMinor: taxAmount,
        kind: tax.kind,
      });
    }

    return { taxedMinor: currentAmount, breakdown };
  }

  /**
   * Apply tax profile to a base amount
   */
  static applyTaxProfile(
    baseAmount: number,
    taxProfileKey: string,
    pricingMeta: PricingMeta[]
  ): TaxCalculationResult {
    const taxLines = TaxManager.resolveTaxProfile(taxProfileKey, pricingMeta);
    const taxes: ProposalTax[] = taxLines.map((tl, idx) => ({
      id: `profile-${idx}`,
      scope: "overall" as const,
      sectionId: null,
      lineItemId: null,
      kind: tl.kind,
      type: tl.type,
      rateOrAmount: tl.value,
      orderIndex: tl.orderIndex,
      label: tl.label,
    }));

    return TaxManager.calculateTaxes(baseAmount, taxes);
  }

  /**
   * Resolve tax profile from pricing meta
   */
  static resolveTaxProfile(key: string, meta: PricingMeta[]): TaxLine[] {
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
   * Extract tax from tax-inclusive total
   * Used when priceDisplay is "taxInclusive"
   */
  static extractTaxFromInclusive(
    total: number,
    taxes: ProposalTax[]
  ): TaxExtractionResult {
    const sortedTaxes = [...taxes].sort((a, b) => a.orderIndex - b.orderIndex);

    if (sortedTaxes.length === 1 && sortedTaxes[0]!.type === "percent") {
      // Simple case: single percentage tax
      const tax = sortedTaxes[0]!;
      const rate =
        tax.kind === "withholding" ? -tax.rateOrAmount : tax.rateOrAmount;
      const baseAmount = roundHalfUp(total / (1 + rate / 100));
      const taxAmount = total - baseAmount;

      return {
        baseAmount,
        taxAmount: tax.kind === "withholding" ? -taxAmount : taxAmount,
        breakdown: [
          {
            label: tax.label,
            amountMinor: tax.kind === "withholding" ? -taxAmount : taxAmount,
            kind: tax.kind,
          },
        ],
      };
    } else {
      // Complex case: multiple taxes or fixed taxes
      // Rough approximation: try to extract base by working backwards
      let baseAmount = total;

      for (let i = sortedTaxes.length - 1; i >= 0; i--) {
        const tax = sortedTaxes[i]!;
        if (tax.type === "percent") {
          const rate =
            tax.kind === "withholding" ? -tax.rateOrAmount : tax.rateOrAmount;
          baseAmount = roundHalfUp(baseAmount / (1 + rate / 100));
        } else if (tax.type === "fixed") {
          const taxAmount =
            tax.kind === "withholding" ? -tax.rateOrAmount : tax.rateOrAmount;
          baseAmount -= taxAmount;
        }
      }

      // Now calculate taxes forward from the base to get breakdown
      const { breakdown } = TaxManager.calculateTaxes(baseAmount, taxes);
      const taxTotal = breakdown.reduce((sum, t) => sum + t.amountMinor, 0);

      return {
        baseAmount,
        taxAmount: taxTotal,
        breakdown,
      };
    }
  }

  /**
   * Get Hebrew explanation for a tax kind
   */
  static getTaxExplanation(
    taxKind: "vat" | "surcharge" | "withholding"
  ): string {
    switch (taxKind) {
      case "vat":
        return `מע"מ (מס ערך מוסף) הוא מס המוטל על רוב העסקאות והמוצרים בישראל. השיעור הסטנדרטי הוא 18% (נכון לנובמבר 2025), אך קיימים שיעורים מופחתים (0%, 8.5%) למוצרים ושירותים מסוימים. המערכת מאפשרת להגדיר שיעור מע"מ מותאם אישית.`;
      case "surcharge":
        return `תוספת היא מס נוסף המוטל על הסכום. התוספת יכולה להיות מוטלת לפני או אחרי מע"מ, תלוי ב-orderIndex שלה. זה מאפשר יצירת מסים מורכבים כמו מס קנייה או מסים מיוחדים אחרים.`;
      case "withholding":
        return `ניכוי במקור הוא ניכוי מס מהתשלום, כלומר סכום שלילי המפחית מהסכום הכולל. זה משמש למקרים בהם יש ניכוי מס במקור (כמו ניכוי מס הכנסה במקור) או החזרים מסוימים.`;
      default:
        return "";
    }
  }
}
