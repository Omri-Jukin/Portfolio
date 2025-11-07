import { describe, it, expect } from "@jest/globals";
import { applyDiscount } from "../discount";
import type { pricingDiscounts } from "../../db/schema/schema.tables";

type PricingDiscount = typeof pricingDiscounts.$inferSelect;

describe("applyDiscount", () => {
  const createMockDiscount = (
    overrides?: Partial<PricingDiscount>
  ): PricingDiscount => {
    const now = new Date();
    return {
      id: "test-id",
      code: "TEST10",
      description: "Test discount",
      discountType: "percent",
      amount: "10",
      currency: "ILS",
      appliesTo: {},
      startsAt: null,
      endsAt: null,
      maxUses: null,
      usedCount: 0,
      perUserLimit: 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    } as PricingDiscount;
  };

  describe("active discount checks", () => {
    it("should return null if discount is not active", () => {
      const discount = createMockDiscount({ isActive: false });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).toBeNull();
    });

    it("should return null if discount hasn't started yet", () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const discount = createMockDiscount({ startsAt: future });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).toBeNull();
    });

    it("should return null if discount has expired", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const discount = createMockDiscount({ endsAt: past });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).toBeNull();
    });

    it("should return null if discount has reached max uses", () => {
      const discount = createMockDiscount({ maxUses: 5, usedCount: 5 });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).toBeNull();
    });

    it("should apply discount if all checks pass", () => {
      const discount = createMockDiscount();
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).not.toBeNull();
      expect(result?.discountedTotal).toBe(900);
      expect(result?.discountAmount).toBe(100);
    });
  });

  describe("percent discounts", () => {
    it("should apply 10% discount correctly", () => {
      const discount = createMockDiscount({
        discountType: "percent",
        amount: "10",
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).not.toBeNull();
      expect(result?.discountedTotal).toBe(900);
      expect(result?.discountAmount).toBe(100);
      expect(result?.discountType).toBe("percent");
    });

    it("should apply 50% discount correctly", () => {
      const discount = createMockDiscount({
        discountType: "percent",
        amount: "50",
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result?.discountedTotal).toBe(500);
      expect(result?.discountAmount).toBe(500);
    });

    it("should not allow negative totals (100% discount)", () => {
      const discount = createMockDiscount({
        discountType: "percent",
        amount: "100",
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result?.discountedTotal).toBe(0);
      expect(result?.discountAmount).toBe(1000);
    });

    it("should handle over 100% discount gracefully", () => {
      const discount = createMockDiscount({
        discountType: "percent",
        amount: "150",
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result?.discountedTotal).toBe(0); // Should not go negative
      expect(result?.discountAmount).toBe(1000);
    });
  });

  describe("fixed discounts", () => {
    it("should apply fixed discount correctly", () => {
      const discount = createMockDiscount({
        discountType: "fixed",
        amount: "100",
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result).not.toBeNull();
      expect(result?.discountedTotal).toBe(900);
      expect(result?.discountAmount).toBe(100);
      expect(result?.discountType).toBe("fixed");
    });

    it("should not allow negative totals (discount larger than total)", () => {
      const discount = createMockDiscount({
        discountType: "fixed",
        amount: "1500",
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result?.discountedTotal).toBe(0);
      expect(result?.discountAmount).toBe(1000);
    });
  });

  describe("scope matching", () => {
    it("should return null if scope doesn't match project type", () => {
      const discount = createMockDiscount({
        appliesTo: { projectTypes: ["website"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { projectTypeKey: "app" },
      });
      expect(result).toBeNull();
    });

    it("should apply discount if project type matches", () => {
      const discount = createMockDiscount({
        appliesTo: { projectTypes: ["website"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { projectTypeKey: "website" },
      });
      expect(result).not.toBeNull();
    });

    it("should return null if no matching features", () => {
      const discount = createMockDiscount({
        appliesTo: { features: ["cms", "auth"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { selectedFeatureKeys: ["payment"] },
      });
      expect(result).toBeNull();
    });

    it("should apply discount if at least one feature matches", () => {
      const discount = createMockDiscount({
        appliesTo: { features: ["cms", "auth"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { selectedFeatureKeys: ["payment", "cms"] },
      });
      expect(result).not.toBeNull();
    });

    it("should return null if client type is excluded", () => {
      const discount = createMockDiscount({
        appliesTo: { excludeClientTypes: ["enterprise"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { clientTypeKey: "enterprise" },
      });
      expect(result).toBeNull();
    });

    it("should apply discount if client type is not excluded", () => {
      const discount = createMockDiscount({
        appliesTo: { excludeClientTypes: ["enterprise"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { clientTypeKey: "startup" },
      });
      expect(result).not.toBeNull();
    });

    it("should return null if client type doesn't match inclusion list", () => {
      const discount = createMockDiscount({
        appliesTo: { clientTypes: ["startup", "small-business"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { clientTypeKey: "enterprise" },
      });
      expect(result).toBeNull();
    });

    it("should apply discount if client type matches inclusion list", () => {
      const discount = createMockDiscount({
        appliesTo: { clientTypes: ["startup", "small-business"] },
      });
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: { clientTypeKey: "startup" },
      });
      expect(result).not.toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle zero total", () => {
      const discount = createMockDiscount();
      const result = applyDiscount({
        discount,
        total: 0,
        scopeInput: {},
      });
      expect(result?.discountedTotal).toBe(0);
      expect(result?.discountAmount).toBe(0);
    });

    it("should handle very small totals", () => {
      const discount = createMockDiscount({
        discountType: "fixed",
        amount: "10",
      });
      const result = applyDiscount({
        discount,
        total: 5,
        scopeInput: {},
      });
      expect(result?.discountedTotal).toBe(0);
      expect(result?.discountAmount).toBe(5);
    });

    it("should preserve original total in result", () => {
      const discount = createMockDiscount();
      const result = applyDiscount({
        discount,
        total: 1000,
        scopeInput: {},
      });
      expect(result?.originalTotal).toBe(1000);
    });
  });
});
