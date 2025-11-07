import { describe, it, expect } from "@jest/globals";
import { calculateEstimate } from "../calculate";
import type { PricingModel, CalculatorInputs } from "../types";

describe("calculateEstimate", () => {
  const createMockPricingModel = (): PricingModel => {
    return {
      projectTypes: [
        {
          key: "website",
          displayName: "Website",
          baseRateIls: 9000,
          order: 0,
          isActive: true,
        },
        {
          key: "app",
          displayName: "App",
          baseRateIls: 24000,
          order: 1,
          isActive: true,
        },
      ],
      baseRates: [],
      features: [
        {
          key: "cms",
          displayName: "CMS",
          costIls: 6000,
          group: null,
          order: 20,
          isActive: true,
        },
        {
          key: "auth",
          displayName: "Auth",
          costIls: 4000,
          group: null,
          order: 21,
          isActive: true,
        },
        {
          key: "payment",
          displayName: "Payments",
          costIls: 9000,
          group: null,
          order: 22,
          isActive: true,
        },
      ],
      multiplierGroups: [
        {
          key: "complexity",
          displayName: "Complexity",
          order: 30,
          isActive: true,
          options: [
            {
              optionKey: "simple",
              displayName: "Simple",
              value: 1.0,
              isFixed: true,
              order: 0,
              isActive: true,
            },
            {
              optionKey: "moderate",
              displayName: "Moderate",
              value: 1.6,
              isFixed: false,
              order: 1,
              isActive: true,
            },
            {
              optionKey: "complex",
              displayName: "Complex",
              value: 2.4,
              isFixed: false,
              order: 2,
              isActive: true,
            },
          ],
        },
        {
          key: "timeline",
          displayName: "Timeline",
          order: 31,
          isActive: true,
          options: [
            {
              optionKey: "normal",
              displayName: "Normal",
              value: 1.0,
              isFixed: true,
              order: 0,
              isActive: true,
            },
            {
              optionKey: "fast",
              displayName: "Fast",
              value: 1.3,
              isFixed: false,
              order: 1,
              isActive: true,
            },
            {
              optionKey: "urgent",
              displayName: "Urgent",
              value: 1.6,
              isFixed: false,
              order: 2,
              isActive: true,
            },
          ],
        },
        {
          key: "tech",
          displayName: "Tech Stack",
          order: 32,
          isActive: true,
          options: [
            {
              optionKey: "standard",
              displayName: "Standard",
              value: 1.0,
              isFixed: true,
              order: 0,
              isActive: true,
            },
            {
              optionKey: "advanced",
              displayName: "Advanced",
              value: 1.15,
              isFixed: false,
              order: 1,
              isActive: true,
            },
          ],
        },
        {
          key: "clientType",
          displayName: "Client Type",
          order: 33,
          isActive: true,
          options: [
            {
              optionKey: "startup",
              displayName: "Startup",
              value: 1.1,
              isFixed: false,
              order: 0,
              isActive: true,
            },
            {
              optionKey: "small-business",
              displayName: "Small Business",
              value: 1.0,
              isFixed: true,
              order: 1,
              isActive: true,
            },
            {
              optionKey: "enterprise",
              displayName: "Enterprise",
              value: 1.6,
              isFixed: false,
              order: 2,
              isActive: true,
            },
          ],
        },
      ],
      meta: {
        pageCostPerPage: 750,
        rangePercent: 0.18,
        defaultCurrency: "ILS",
        projectMinimums: {
          website: 7500,
          app: 20000,
        },
      },
    };
  };

  describe("basic calculation", () => {
    it("should calculate base cost correctly", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.baseCost).toBe(9000);
      expect(result.pageCost).toBe(0);
      expect(result.featureCosts).toEqual({});
      expect(result.totalFeatureCost).toBe(0);
    });

    it("should calculate page cost correctly", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 10,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.pageCost).toBe(7500); // 10 * 750
    });

    it("should calculate feature costs correctly", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: ["cms", "auth"],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.featureCosts).toEqual({
        cms: 6000,
        auth: 4000,
      });
      expect(result.totalFeatureCost).toBe(10000);
    });
  });

  describe("multiplier application", () => {
    it("should apply complexity multiplier to subtotal", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "moderate", // 1.6
        timelineKey: "normal", // 1.0
        techKey: "standard", // 1.0
        clientTypeKey: "small-business", // 1.0
      };

      const result = calculateEstimate(model, inputs);
      // Base: 9000, Pages: 0, Features: 0
      // Subtotal after complexity: 9000 * 1.6 = 14400
      // Total after other multipliers: 14400 * 1.0 * 1.0 * 1.0 = 14400
      expect(result.subtotal).toBe(14400);
      expect(result.total).toBe(14400);
    });

    it("should apply all multipliers correctly", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 10,
        selectedFeatureKeys: ["cms"],
        complexityKey: "moderate", // 1.6
        timelineKey: "fast", // 1.3
        techKey: "advanced", // 1.15
        clientTypeKey: "startup", // 1.1
      };

      const result = calculateEstimate(model, inputs);
      // Base: 9000, Pages: 7500, Features: 6000 = 22500
      // Subtotal after complexity: 22500 * 1.6 = 36000
      // Total after other multipliers: 36000 * 1.3 * 1.15 * 1.1 = 59202
      expect(result.subtotal).toBe(36000);
      expect(result.total).toBeCloseTo(59202, 0);
    });

    it("should handle missing multiplier options gracefully", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "nonexistent", // Should default to 1.0
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      // Should default to 1.0 for missing multiplier
      expect(result.total).toBe(9000);
    });
  });

  describe("client-type-specific base rates", () => {
    it("should use client-type-specific base rate when available", () => {
      const model = createMockPricingModel();
      model.baseRates = [
        {
          projectTypeKey: "website",
          clientTypeKey: "enterprise",
          baseRateIls: 12000,
          order: 0,
          isActive: true,
        },
      ];

      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "enterprise",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.baseCost).toBe(12000); // Uses client-specific rate
      // Total includes multipliers: 12000 * 1.0 (complexity) * 1.0 (timeline) * 1.0 (tech) * 1.6 (enterprise clientType) = 19200
      expect(result.total).toBe(19200);
    });

    it("should fall back to default project type rate when client-specific rate not found", () => {
      const model = createMockPricingModel();
      model.baseRates = [
        {
          projectTypeKey: "website",
          clientTypeKey: "enterprise",
          baseRateIls: 12000,
          order: 0,
          isActive: true,
        },
      ];

      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "startup", // No specific rate for startup
      };

      const result = calculateEstimate(model, inputs);
      expect(result.baseCost).toBe(9000); // Falls back to default
      // Total includes multipliers: 9000 * 1.0 (complexity) * 1.0 (timeline) * 1.0 (tech) * 1.1 (startup clientType) = 9900
      expect(result.total).toBe(9900);
    });
  });

  describe("range calculation", () => {
    it("should calculate range correctly with default rangePercent", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      // Total: 9000, rangePercent: 0.18
      // Range: 9000 * (1 - 0.18) to 9000 * (1 + 0.18) = 7380 to 10620
      expect(result.range.min).toBeCloseTo(7380, 0);
      expect(result.range.max).toBeCloseTo(10620, 0);
    });
  });

  describe("project minimums", () => {
    it("should return calculated total (minimums applied elsewhere)", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      // Note: calculateEstimate doesn't apply minimums - that's done elsewhere
      expect(result.total).toBe(9000);
    });
  });

  describe("discount application", () => {
    it("should apply percent discount correctly", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs, {
        type: "percent",
        amount: 10,
      });

      // Total: 9000, discount: 10% = 900
      expect(result.total).toBe(8100); // After discount
      expect(result.discountApplied?.type).toBe("percent");
      expect(result.discountApplied?.amount).toBe(10);
      expect(result.discountApplied?.discountedTotal).toBe(8100);
    });

    it("should apply fixed discount correctly", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs, {
        type: "fixed",
        amount: 1000,
      });

      // Total: 9000, discount: 1000
      expect(result.total).toBe(8000); // After discount
      expect(result.discountApplied?.type).toBe("fixed");
      expect(result.discountApplied?.amount).toBe(1000);
      expect(result.discountApplied?.discountedTotal).toBe(8000);
    });

    it("should not allow negative final total after discount", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs, {
        type: "fixed",
        amount: 10000, // Larger than total
      });

      // Total: 9000, discount: 10000, should not go negative
      expect(result.total).toBe(0); // After discount, clamped to 0
    });
  });

  describe("edge cases", () => {
    it("should handle missing project type gracefully", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "nonexistent",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.baseCost).toBe(0);
      expect(result.total).toBe(0);
    });

    it("should handle missing features gracefully", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: ["nonexistent"],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.totalFeatureCost).toBe(0);
      expect(result.featureCosts).toEqual({});
    });

    it("should handle zero pages", () => {
      const model = createMockPricingModel();
      const inputs: CalculatorInputs = {
        projectTypeKey: "website",
        numPages: 0,
        selectedFeatureKeys: [],
        complexityKey: "simple",
        timelineKey: "normal",
        techKey: "standard",
        clientTypeKey: "small-business",
      };

      const result = calculateEstimate(model, inputs);
      expect(result.pageCost).toBe(0);
    });
  });
});
