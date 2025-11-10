/**
 * Unit tests for proposal totals calculation engine
 */

import { describe, it, expect } from "@jest/globals";
import {
  calcProposalTotals,
  formatMoney,
  resolveTaxProfile,
} from "../calcProposalTotals";
import type { ProposalTotalsInput, TaxProfile } from "../calcProposalTotals";
import type { PricingMeta } from "../../db/schema/schema.tables";

describe("calcProposalTotals", () => {
  const mockPricingMeta: PricingMeta[] = [
    {
      id: "1",
      key: "tax_profiles",
      value: [
        {
          key: "IL_VAT_17",
          label: "Israel VAT 17%",
          lines: [
            {
              kind: "vat" as const,
              type: "percent" as const,
              value: 17,
              orderIndex: 0,
              label: "VAT",
            },
          ],
        },
        {
          key: "Zero",
          label: "Zero Tax",
          lines: [],
        },
      ] as TaxProfile[],
      order: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe("Basic calculation", () => {
    it("should calculate subtotal correctly", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 2,
            unitPriceMinor: 10000, // 100.00 ILS
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(20000); // 2 * 100.00 = 200.00
      expect(result.preTaxTotalMinor).toBe(20000);
      expect(result.taxTotalMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(20000);
    });

    it("should apply percent discount correctly", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [
          {
            id: "d1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            type: "percent",
            amountMinor: null,
            percent: 10,
            label: "10% Discount",
          },
        ],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.discountsBreakdown.length).toBe(1);
      expect(result.discountsBreakdown[0].amountMinor).toBe(1000); // 10% of 10000
      expect(result.preTaxTotalMinor).toBe(9000);
      expect(result.grandTotalMinor).toBe(9000);
    });

    it("should apply fixed discount correctly", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [
          {
            id: "d1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            type: "fixed",
            amountMinor: 2000,
            percent: null,
            label: "200 ILS Discount",
          },
        ],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.discountsBreakdown[0].amountMinor).toBe(2000);
      expect(result.preTaxTotalMinor).toBe(8000);
      expect(result.grandTotalMinor).toBe(8000);
    });

    it("should apply VAT tax correctly", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.preTaxTotalMinor).toBe(10000);
      expect(result.taxBreakdown.length).toBe(1);
      expect(result.taxBreakdown[0].amountMinor).toBe(1700); // 17% of 10000
      expect(result.taxTotalMinor).toBe(1700);
      expect(result.grandTotalMinor).toBe(11700);
    });

    it("should skip optional unselected items", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: true,
            isSelected: false,
            taxClass: null,
          },
          {
            id: "l2",
            sectionId: "s1",
            label: "Item 2",
            quantity: 1,
            unitPriceMinor: 5000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      // Only l2 should be included (l1 is optional and not selected)
      expect(result.subtotalMinor).toBe(5000);
      expect(result.grandTotalMinor).toBe(5000);
    });
  });

  describe("formatMoney", () => {
    it("should format money correctly", () => {
      expect(formatMoney(10000, "ILS")).toContain("100");
      expect(formatMoney(12345, "USD")).toContain("123.45");
    });
  });

  describe("resolveTaxProfile", () => {
    it("should resolve tax profile from meta", () => {
      const lines = resolveTaxProfile("IL_VAT_17", mockPricingMeta);
      expect(lines.length).toBe(1);
      expect(lines[0].kind).toBe("vat");
      expect(lines[0].value).toBe(17);
    });

    it("should return empty array for non-existent profile", () => {
      const lines = resolveTaxProfile("NON_EXISTENT", mockPricingMeta);
      expect(lines.length).toBe(0);
    });
  });

  describe("Multi-tax stacking", () => {
    it("should stack VAT + Surcharge correctly", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000, // 100.00 ILS
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
          {
            id: "t2",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "surcharge",
            type: "percent",
            rateOrAmount: 2,
            orderIndex: 1,
            label: "Surcharge 2%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.preTaxTotalMinor).toBe(10000);
      expect(result.taxBreakdown.length).toBe(2);

      // VAT: 17% of 10000 = 1700
      expect(result.taxBreakdown[0].amountMinor).toBe(1700);
      expect(result.taxBreakdown[0].kind).toBe("vat");

      // Surcharge: 2% of (10000 + 1700) = 234
      expect(result.taxBreakdown[1].amountMinor).toBe(234);
      expect(result.taxBreakdown[1].kind).toBe("surcharge");

      expect(result.taxTotalMinor).toBe(1934);
      expect(result.grandTotalMinor).toBe(11934);
    });

    it("should handle withholding correctly (negative tax)", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
          {
            id: "t2",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "withholding",
            type: "percent",
            rateOrAmount: 5,
            orderIndex: 1,
            label: "Withholding 5%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);

      // VAT: 17% of 10000 = 1700
      expect(result.taxBreakdown[0].amountMinor).toBe(1700);

      // Withholding: -5% of (10000 + 1700) = -585 (negative)
      expect(result.taxBreakdown[1].amountMinor).toBe(-585);
      expect(result.taxBreakdown[1].kind).toBe("withholding");

      // Total tax: 1700 - 585 = 1115
      expect(result.taxTotalMinor).toBe(1115);
      expect(result.grandTotalMinor).toBe(11115);
    });

    it("should respect tax orderIndex for stacking", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t2",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "surcharge",
            type: "percent",
            rateOrAmount: 2,
            orderIndex: 1, // Applied second
            label: "Surcharge 2%",
          },
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0, // Applied first
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      // Should apply VAT first (orderIndex 0), then surcharge (orderIndex 1)
      expect(result.taxBreakdown[0].kind).toBe("vat");
      expect(result.taxBreakdown[0].amountMinor).toBe(1700);
      expect(result.taxBreakdown[1].kind).toBe("surcharge");
      expect(result.taxBreakdown[1].amountMinor).toBe(234);
    });
  });

  describe("Tax classes", () => {
    it("should skip taxes for exempt items", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Exempt Item",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: "exempt",
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.taxBreakdown.length).toBe(0);
      expect(result.taxTotalMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(10000);
    });

    it("should apply taxes for zero-rated items", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Zero-rated Item",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: "zero",
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 0,
            orderIndex: 0,
            label: "VAT 0%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.taxBreakdown.length).toBe(1);
      expect(result.taxBreakdown[0].amountMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(10000);
    });
  });

  describe("Discount stacking", () => {
    it("should stack multiple discounts correctly", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [
          {
            id: "d1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            type: "percent",
            amountMinor: null,
            percent: 10,
            label: "10% Discount",
          },
          {
            id: "d2",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            type: "percent",
            amountMinor: null,
            percent: 5,
            label: "5% Additional Discount",
          },
        ],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(10000);
      expect(result.discountsBreakdown.length).toBe(2);

      // First discount: 10% of 10000 = 1000
      expect(result.discountsBreakdown[0].amountMinor).toBe(1000);

      // Second discount: 5% of (10000 - 1000) = 450
      expect(result.discountsBreakdown[1].amountMinor).toBe(450);

      expect(result.preTaxTotalMinor).toBe(8550);
      expect(result.grandTotalMinor).toBe(8550);
    });

    it("should handle section-level discounts", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [
          { id: "s1", sortOrder: 0 },
          { id: "s2", sortOrder: 1 },
        ],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
          {
            id: "l2",
            sectionId: "s2",
            label: "Item 2",
            quantity: 1,
            unitPriceMinor: 5000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [
          {
            id: "d1",
            scope: "section",
            sectionId: "s1",
            lineItemId: null,
            type: "percent",
            amountMinor: null,
            percent: 20,
            label: "Section 1 Discount 20%",
          },
        ],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(15000);
      expect(result.discountsBreakdown.length).toBe(1);
      // Discount applies only to section s1: 20% of 10000 = 2000
      expect(result.discountsBreakdown[0].amountMinor).toBe(2000);
      expect(result.preTaxTotalMinor).toBe(13000);
    });

    it("should handle line-level discounts", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
          {
            id: "l2",
            sectionId: "s1",
            label: "Item 2",
            quantity: 1,
            unitPriceMinor: 5000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [
          {
            id: "d1",
            scope: "line",
            sectionId: null,
            lineItemId: "l1",
            type: "fixed",
            amountMinor: 2000,
            percent: null,
            label: "Item 1 Discount 20 ILS",
          },
        ],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(15000);
      expect(result.discountsBreakdown.length).toBe(1);
      expect(result.discountsBreakdown[0].amountMinor).toBe(2000);
      expect(result.preTaxTotalMinor).toBe(13000);
    });
  });

  describe("Rounding edge cases", () => {
    it("should round correctly with ROUND_HALF_UP strategy", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 100, // 1.00 ILS
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      // 17% of 100 = 17 (exact, no rounding needed)
      expect(result.taxBreakdown[0].amountMinor).toBe(17);
      expect(result.grandTotalMinor).toBe(117);
    });

    it("should handle rounding with fractional percentages", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 333, // 3.33 ILS
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      // 17% of 333 = 56.61, should round to 57 (ROUND_HALF_UP)
      expect(result.taxBreakdown[0].amountMinor).toBe(57);
      expect(result.grandTotalMinor).toBe(390);
    });
  });

  describe("Tax inclusive pricing", () => {
    it("should calculate correctly for tax inclusive display", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxInclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 11700, // 117.00 ILS (includes 17% VAT)
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      // For tax inclusive, the calculation is simplified
      // The subtotal is the price including tax
      expect(result.subtotalMinor).toBe(11700);
      // Tax breakdown should still show the tax amount
      expect(result.taxBreakdown.length).toBe(1);
      expect(result.grandTotalMinor).toBe(11700);
    });
  });

  describe("Edge cases", () => {
    it("should handle zero subtotal", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Free Item",
            quantity: 1,
            unitPriceMinor: 0,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [
          {
            id: "t1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            kind: "vat",
            type: "percent",
            rateOrAmount: 17,
            orderIndex: 0,
            label: "VAT 17%",
          },
        ],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(0);
      expect(result.taxBreakdown[0].amountMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(0);
    });

    it("should handle discount larger than subtotal", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Item 1",
            quantity: 1,
            unitPriceMinor: 1000,
            isOptional: false,
            isSelected: true,
            taxClass: null,
          },
        ],
        discounts: [
          {
            id: "d1",
            scope: "overall",
            sectionId: null,
            lineItemId: null,
            type: "fixed",
            amountMinor: 2000, // Larger than subtotal
            percent: null,
            label: "Large Discount",
          },
        ],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(1000);
      expect(result.discountsBreakdown[0].amountMinor).toBe(2000);
      // Should not go negative
      expect(result.preTaxTotalMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(0);
    });

    it("should handle empty line items", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [],
        lineItems: [],
        discounts: [],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(0);
      expect(result.preTaxTotalMinor).toBe(0);
      expect(result.taxTotalMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(0);
    });

    it("should handle all optional items unselected", () => {
      const input: ProposalTotalsInput = {
        currency: "ILS",
        priceDisplay: "taxExclusive",
        sections: [{ id: "s1", sortOrder: 0 }],
        lineItems: [
          {
            id: "l1",
            sectionId: "s1",
            label: "Optional Item 1",
            quantity: 1,
            unitPriceMinor: 10000,
            isOptional: true,
            isSelected: false,
            taxClass: null,
          },
          {
            id: "l2",
            sectionId: "s1",
            label: "Optional Item 2",
            quantity: 1,
            unitPriceMinor: 5000,
            isOptional: true,
            isSelected: false,
            taxClass: null,
          },
        ],
        discounts: [],
        taxes: [],
        pricingMeta: mockPricingMeta,
      };

      const result = calcProposalTotals(input);
      expect(result.subtotalMinor).toBe(0);
      expect(result.grandTotalMinor).toBe(0);
    });
  });
});
