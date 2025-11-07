import { describe, it, expect } from "@jest/globals";
import {
  createDiscountSchema,
  updateDiscountSchema,
  discountCodeSchema,
} from "../../schemas";

describe("Discount Schema Validation", () => {
  describe("discountCodeSchema", () => {
    it("should accept valid discount codes", () => {
      expect(() => discountCodeSchema.parse("SAVE10")).not.toThrow();
      expect(() => discountCodeSchema.parse("WELCOME2024")).not.toThrow();
      expect(() => discountCodeSchema.parse("ABC123")).not.toThrow();
    });

    it("should reject codes that are too short", () => {
      expect(() => discountCodeSchema.parse("AB")).toThrow();
      expect(() => discountCodeSchema.parse("A")).toThrow();
    });

    it("should reject codes that are too long", () => {
      const longCode = "A".repeat(51);
      expect(() => discountCodeSchema.parse(longCode)).toThrow();
    });

    it("should reject codes with invalid characters", () => {
      // Note: The schema may allow hyphens, so we test spaces and special chars
      expect(() => discountCodeSchema.parse("SAVE 10")).toThrow();
      expect(() => discountCodeSchema.parse("SAVE@10")).toThrow();
      expect(() => discountCodeSchema.parse("SAVE#10")).toThrow();
    });

    it("should accept codes with numbers and letters", () => {
      expect(() => discountCodeSchema.parse("SAVE10")).not.toThrow();
      expect(() => discountCodeSchema.parse("10OFF")).not.toThrow();
      expect(() => discountCodeSchema.parse("ABC123XYZ")).not.toThrow();
    });
  });

  describe("createDiscountSchema", () => {
    const validDiscount = {
      code: "SAVE10",
      description: "10% off",
      discountType: "percent" as const,
      amount: 10,
      currency: "ILS",
      appliesTo: {},
      isActive: true,
    };

    it("should accept valid discount data", () => {
      expect(() => createDiscountSchema.parse(validDiscount)).not.toThrow();
    });

    it("should reject percent discount over 100%", () => {
      const invalid = {
        ...validDiscount,
        discountType: "percent" as const,
        amount: 150,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow(
        "Percent discount cannot exceed 100%"
      );
    });

    it("should accept 100% discount", () => {
      const valid = {
        ...validDiscount,
        discountType: "percent" as const,
        amount: 100,
      };
      expect(() => createDiscountSchema.parse(valid)).not.toThrow();
    });

    it("should reject negative amounts", () => {
      const invalid = {
        ...validDiscount,
        amount: -10,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow();
    });

    it("should reject zero amounts", () => {
      const invalid = {
        ...validDiscount,
        amount: 0,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow();
    });

    it("should reject invalid discount type", () => {
      const invalid = {
        ...validDiscount,
        discountType: "invalid" as (typeof validDiscount)["discountType"],
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow();
    });

    it("should reject end date before start date", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 1000);
      const future = new Date(now.getTime() + 1000);
      const invalid = {
        ...validDiscount,
        startsAt: future,
        endsAt: past,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow(
        "Start date must be before end date"
      );
    });

    it("should accept valid date range", () => {
      const now = new Date();
      const future1 = new Date(now.getTime() + 1000);
      const future2 = new Date(now.getTime() + 2000);
      const valid = {
        ...validDiscount,
        startsAt: future1,
        endsAt: future2,
      };
      expect(() => createDiscountSchema.parse(valid)).not.toThrow();
    });

    it("should reject end date in the past", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const invalid = {
        ...validDiscount,
        endsAt: past,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow(
        "End date must be in the future"
      );
    });

    it("should accept valid appliesTo structure", () => {
      const valid = {
        ...validDiscount,
        appliesTo: {
          projectTypes: ["website", "app"],
          features: ["cms"],
          clientTypes: ["startup"],
          excludeClientTypes: ["enterprise"],
        },
      };
      expect(() => createDiscountSchema.parse(valid)).not.toThrow();
    });

    it("should accept empty appliesTo", () => {
      const valid = {
        ...validDiscount,
        appliesTo: {},
      };
      expect(() => createDiscountSchema.parse(valid)).not.toThrow();
    });

    it("should reject negative maxUses", () => {
      const invalid = {
        ...validDiscount,
        maxUses: -1,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow();
    });

    it("should reject non-integer maxUses", () => {
      const invalid = {
        ...validDiscount,
        maxUses: 10.5,
      };
      expect(() => createDiscountSchema.parse(invalid)).toThrow();
    });

    it("should accept valid maxUses", () => {
      const valid = {
        ...validDiscount,
        maxUses: 100,
      };
      expect(() => createDiscountSchema.parse(valid)).not.toThrow();
    });

    it("should use default values", () => {
      const minimal = {
        code: "TEST",
        discountType: "percent" as const,
        amount: 10,
        appliesTo: {},
      };
      const result = createDiscountSchema.parse(minimal);
      expect(result.currency).toBe("ILS");
      expect(result.isActive).toBe(true);
      expect(result.perUserLimit).toBe(1);
    });
  });

  describe("updateDiscountSchema", () => {
    it("should accept partial updates", () => {
      const partial = {
        description: "Updated description",
      };
      expect(() => updateDiscountSchema.parse(partial)).not.toThrow();
    });

    it("should accept empty update object", () => {
      expect(() => updateDiscountSchema.parse({})).not.toThrow();
    });

    it("should reject percent discount over 100% in update", () => {
      const invalid = {
        discountType: "percent" as const,
        amount: 150,
      };
      expect(() => updateDiscountSchema.parse(invalid)).toThrow(
        "Percent discount cannot exceed 100%"
      );
    });

    it("should reject invalid date range in update", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 1000);
      const future = new Date(now.getTime() + 1000);
      const invalid = {
        startsAt: future,
        endsAt: past,
      };
      expect(() => updateDiscountSchema.parse(invalid)).toThrow(
        "Start date must be before end date"
      );
    });

    it("should allow updating only amount", () => {
      const update = {
        amount: 20,
      };
      expect(() => updateDiscountSchema.parse(update)).not.toThrow();
    });

    it("should allow updating only isActive", () => {
      const update = {
        isActive: false,
      };
      expect(() => updateDiscountSchema.parse(update)).not.toThrow();
    });

    it("should validate percent amount when discountType is provided", () => {
      const invalid = {
        discountType: "percent" as const,
        amount: 101,
      };
      expect(() => updateDiscountSchema.parse(invalid)).toThrow();
    });

    it("should not validate percent amount when discountType is not provided", () => {
      // If discountType is not in the update, we can't validate the amount
      // This is acceptable since the validation happens at the object level
      const update = {
        amount: 150, // Would be invalid for percent, but type not specified
      };
      // This should pass because we can't know if it's percent or fixed
      expect(() => updateDiscountSchema.parse(update)).not.toThrow();
    });
  });
});
