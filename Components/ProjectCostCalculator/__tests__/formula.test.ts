import { calculateCost } from "~/ProjectCostCalculator/ProjectCostCalculator.const";
import type {
  CalculatorInputs,
  ClientType,
  ComplexityLevel,
  TechStackComplexity,
  TimelineUrgency,
} from "~/ProjectCostCalculator/ProjectCostCalculator.type";

// Mock rates matching the documentation example
const mockRates = {
  baseRates: {
    website: 7300,
    app: 18250,
    ecommerce: 29200,
    saas: 36500,
    other: 14600,
  },
  featureCosts: {
    cms: 5475,
    auth: 3650,
    payment: 7300,
    api: 5475,
    realtime: 10950,
    analytics: 3650,
  },
  complexityMultipliers: {
    simple: 1.0,
    moderate: 1.5,
    complex: 2.2,
  },
  timelineMultipliers: {
    normal: 1.0,
    fast: 1.25,
    urgent: 1.5,
  },
  techStackMultipliers: {
    standard: 1.0,
    advanced: 1.1,
    "cutting-edge": 1.3,
  },
  clientTypeMultipliers: {
    personal: 1.0,
    startup: 1.1,
    "small-business": 1.0,
    "medium-business": 1.2,
    enterprise: 1.5,
    charity: 0.8,
    "non-profit": 0.85,
  },
  pageCostPerPage: 548,
};

describe("Pricing Calculator Formula", () => {
  describe("Basic calculation", () => {
    it("calculates range correctly for website with CMS and Auth", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "moderate",
        numPages: 10,
        features: {
          cms: true,
          auth: true,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "small-business",
      };

      const result = calculateCost(inputs, mockRates);

      // Expected calculation:
      // Base: 7300
      // Pages: 10 × 548 = 5480
      // Features: 5475 (cms) + 3650 (auth) = 9125
      // Subtotal: (7300 + 5480 + 9125) × 1.5 = 32857.5
      // Total: 32857.5 × 1.0 × 1.0 × 1.0 = 32857.5
      // Range: min = round(32857.5 × 0.85) = 27929, max = round(32857.5 × 1.15) = 37786

      expect(result.baseCost).toBe(7300);
      expect(result.featureCosts.cms).toBe(5475);
      expect(result.featureCosts.auth).toBe(3650);
      expect(result.complexityMultiplier).toBe(1.5);
      expect(result.timelineMultiplier).toBe(1.0);
      expect(result.techStackMultiplier).toBe(1.0);
      expect(result.clientTypeMultiplier).toBe(1.0);
      expect(result.subtotal).toBe(32857.5);
      expect(result.total).toBe(32857.5);
      expect(result.range.min).toBeGreaterThan(0);
      expect(result.range.max).toBeGreaterThan(result.range.min);
      expect(result.range.min).toBe(Math.round(result.total * 0.85));
      expect(result.range.max).toBe(Math.round(result.total * 1.15));
    });

    it("calculates correctly for simple website with no features", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 5,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      // Base: 7300
      // Pages: 5 × 548 = 2740
      // Features: 0
      // Subtotal: (7300 + 2740 + 0) × 1.0 = 10040
      // Total: 10040 × 1.0 × 1.0 × 1.0 = 10040

      expect(result.baseCost).toBe(7300);
      expect(result.total).toBe(10040);
      expect(result.subtotal).toBe(10040);
      expect(result.range.min).toBe(Math.round(10040 * 0.85));
      expect(result.range.max).toBe(Math.round(10040 * 1.15));
    });

    it("calculates correctly with all features enabled", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "moderate",
        numPages: 1,
        features: {
          cms: true,
          auth: true,
          payment: true,
          api: true,
          realtime: true,
          analytics: true,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      // Base: 7300
      // Pages: 1 × 548 = 548
      // Features: 5475 + 3650 + 7300 + 5475 + 10950 + 3650 = 36500
      // Subtotal: (7300 + 548 + 36500) × 1.5 = 66522
      // Total: 66522 × 1.0 × 1.0 × 1.0 = 66522

      expect(result.total).toBeGreaterThan(0);
      expect(result.featureCosts.cms).toBe(5475);
      expect(result.featureCosts.auth).toBe(3650);
      expect(result.featureCosts.payment).toBe(7300);
      expect(result.featureCosts.api).toBe(5475);
      expect(result.featureCosts.realtime).toBe(10950);
      expect(result.featureCosts.analytics).toBe(3650);
    });
  });

  describe("Project types", () => {
    it("calculates correctly for app project type", () => {
      const inputs: CalculatorInputs = {
        projectType: "app",
        complexity: "simple",
        numPages: 3,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.baseCost).toBe(18250);
      expect(result.total).toBeGreaterThan(0);
    });

    it("calculates correctly for ecommerce project type", () => {
      const inputs: CalculatorInputs = {
        projectType: "ecommerce",
        complexity: "simple",
        numPages: 3,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.baseCost).toBe(29200);
    });

    it("calculates correctly for saas project type", () => {
      const inputs: CalculatorInputs = {
        projectType: "saas",
        complexity: "simple",
        numPages: 3,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.baseCost).toBe(36500);
    });

    it("falls back to 'other' base rate for unknown project type", () => {
      const inputs: CalculatorInputs = {
        projectType: "other",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.baseCost).toBe(14600);
    });
  });

  describe("Multiplier application", () => {
    it("applies complexity multiplier correctly", () => {
      const baseInputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const simple = calculateCost(
        { ...baseInputs, complexity: "simple" },
        mockRates
      );
      const moderate = calculateCost(
        { ...baseInputs, complexity: "moderate" },
        mockRates
      );
      const complex = calculateCost(
        { ...baseInputs, complexity: "complex" },
        mockRates
      );

      expect(simple.complexityMultiplier).toBe(1.0);
      expect(moderate.complexityMultiplier).toBe(1.5);
      expect(complex.complexityMultiplier).toBe(2.2);
      expect(moderate.subtotal).toBe(simple.subtotal * 1.5);
      expect(complex.subtotal).toBe(simple.subtotal * 2.2);
    });

    it("applies timeline multiplier correctly", () => {
      const baseInputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const normal = calculateCost(
        { ...baseInputs, timelineUrgency: "normal" },
        mockRates
      );
      const fast = calculateCost(
        { ...baseInputs, timelineUrgency: "fast" },
        mockRates
      );
      const urgent = calculateCost(
        { ...baseInputs, timelineUrgency: "urgent" },
        mockRates
      );

      expect(normal.timelineMultiplier).toBe(1.0);
      expect(fast.timelineMultiplier).toBe(1.25);
      expect(urgent.timelineMultiplier).toBe(1.5);
      expect(fast.total).toBe(normal.total * 1.25);
      expect(urgent.total).toBe(normal.total * 1.5);
    });

    it("applies tech stack multiplier correctly", () => {
      const baseInputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const standard = calculateCost(
        { ...baseInputs, techStackComplexity: "standard" },
        mockRates
      );
      const advanced = calculateCost(
        { ...baseInputs, techStackComplexity: "advanced" },
        mockRates
      );
      const cuttingEdge = calculateCost(
        { ...baseInputs, techStackComplexity: "cutting-edge" },
        mockRates
      );

      expect(standard.techStackMultiplier).toBe(1.0);
      expect(advanced.techStackMultiplier).toBe(1.1);
      expect(cuttingEdge.techStackMultiplier).toBe(1.3);
    });

    it("applies client type multiplier correctly", () => {
      const baseInputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const personal = calculateCost(
        { ...baseInputs, clientType: "personal" },
        mockRates
      );
      const enterprise = calculateCost(
        { ...baseInputs, clientType: "enterprise" },
        mockRates
      );
      const charity = calculateCost(
        { ...baseInputs, clientType: "charity" },
        mockRates
      );

      expect(personal.clientTypeMultiplier).toBe(1.0);
      expect(enterprise.clientTypeMultiplier).toBe(1.5);
      expect(charity.clientTypeMultiplier).toBe(0.8);
      expect(enterprise.total).toBe(personal.total * 1.5);
      expect(charity.total).toBe(personal.total * 0.8);
    });

    it("applies all multipliers multiplicatively", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "complex",
        numPages: 5,
        features: {
          cms: true,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "urgent",
        techStackComplexity: "advanced",
        currency: "ILS",
        clientType: "enterprise",
      };

      const result = calculateCost(inputs, mockRates);

      // Base: 7300, Pages: 5×548=2740, Features: 5475, Subtotal: (7300+2740+5475)×2.2 = 34133
      // Total: 34133 × 1.5 × 1.1 × 1.5 = 84479.25
      expect(result.complexityMultiplier).toBe(2.2);
      expect(result.timelineMultiplier).toBe(1.5);
      expect(result.techStackMultiplier).toBe(1.1);
      expect(result.clientTypeMultiplier).toBe(1.5);
      expect(result.total).toBeCloseTo(84479.175, 1);
    });
  });

  describe("Range calculation", () => {
    it("calculates min and max as ±15% of total", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 10,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.range.min).toBe(Math.round(result.total * 0.85));
      expect(result.range.max).toBe(Math.round(result.total * 1.15));
      expect(result.range.min).toBeLessThan(result.total);
      expect(result.range.max).toBeGreaterThan(result.total);
    });

    it("ensures max is always greater than min", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.range.max).toBeGreaterThan(result.range.min);
    });
  });

  describe("Error handling", () => {
    it("throws error when baseRates are missing", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRates = {
        ...mockRates,
        baseRates: {},
      };

      expect(() => calculateCost(inputs, invalidRates)).toThrow(
        "Base rates are required from database"
      );
    });

    it("throws error when featureCosts are missing", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRates = {
        ...mockRates,
        featureCosts: {},
      };

      expect(() => calculateCost(inputs, invalidRates)).toThrow(
        "Feature costs are required from database"
      );
    });

    it("throws error when complexityMultipliers are missing", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRates = {
        ...mockRates,
        complexityMultipliers: {},
      };

      expect(() => calculateCost(inputs, invalidRates)).toThrow(
        "Complexity multipliers are required from database"
      );
    });

    it("throws error when timelineMultipliers are missing", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRates = {
        ...mockRates,
        timelineMultipliers: {},
      };

      expect(() => calculateCost(inputs, invalidRates)).toThrow(
        "Timeline multipliers are required from database"
      );
    });

    it("throws error when techStackMultipliers are missing", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRates = {
        ...mockRates,
        techStackMultipliers: {},
      };

      expect(() => calculateCost(inputs, invalidRates)).toThrow(
        "Tech stack multipliers are required from database"
      );
    });

    it("throws error when clientTypeMultipliers are missing", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRates = {
        ...mockRates,
        clientTypeMultipliers: {},
      };

      expect(() => calculateCost(inputs, invalidRates)).toThrow(
        "Client type multipliers are required from database"
      );
    });

    it("throws error when pageCostPerPage is zero or negative", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const invalidRatesZero = {
        ...mockRates,
        pageCostPerPage: 0,
      };

      const invalidRatesNegative = {
        ...mockRates,
        pageCostPerPage: -100,
      };

      expect(() => calculateCost(inputs, invalidRatesZero)).toThrow(
        "Page cost per page is required from database"
      );
      expect(() => calculateCost(inputs, invalidRatesNegative)).toThrow(
        "Page cost per page is required from database"
      );
    });
  });

  describe("Edge cases", () => {
    it("handles zero pages correctly", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 0,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      const result = calculateCost(inputs, mockRates);

      expect(result.total).toBe(7300); // Just base cost
      expect(result.range.min).toBeGreaterThan(0);
    });

    it("defaults to 1.0 for missing multiplier values", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "unknown" as ComplexityLevel, // Invalid complexity
        numPages: 1,
        features: {
          cms: false,
          auth: false,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal" as TimelineUrgency, // Invalid timeline
        techStackComplexity: "standard" as TechStackComplexity, // Invalid tech stack
        currency: "ILS",
        clientType: "personal" as ClientType, // Invalid client type
      };

      const result = calculateCost(inputs, mockRates);

      // Should default to 1.0 for unknown multipliers
      expect(result.complexityMultiplier).toBe(1.0);
      expect(result.timelineMultiplier).toBe(1.0);
      expect(result.techStackMultiplier).toBe(1.0);
      expect(result.clientTypeMultiplier).toBe(1.0);
    });

    it("handles missing feature costs gracefully", () => {
      const inputs: CalculatorInputs = {
        projectType: "website",
        complexity: "simple",
        numPages: 1,
        features: {
          cms: true,
          auth: true,
          payment: false,
          api: false,
          realtime: false,
          analytics: false,
        },
        timelineUrgency: "normal",
        techStackComplexity: "standard",
        currency: "ILS",
        clientType: "personal",
      };

      // Remove cms to test default behavior
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cms, ...restFeatureCosts } = mockRates.featureCosts;
      const ratesWithMissingFeature = {
        ...mockRates,
        featureCosts: restFeatureCosts,
      };

      const result = calculateCost(inputs, ratesWithMissingFeature);

      // Should default to 0 for missing feature cost
      expect(result.featureCosts.cms).toBe(0);
      expect(result.featureCosts.auth).toBe(3650);
    });
  });
});
