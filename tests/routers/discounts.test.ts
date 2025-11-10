import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import { createTestContext, createMockAdminUser } from "../helpers/testContext";
import { getDB } from "$/db/client";
import { pricingDiscounts } from "$/db/schema/schema.tables";

describe("Discounts Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping discounts router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(pricingDiscounts);

      adminUser = createMockAdminUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(pricingDiscounts);
    }
  });

  describe("getAll (admin)", () => {
    it("should return all discounts", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.discounts.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create (admin)", () => {
    it("should create a new discount", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.discounts.create({
        code: "TEST10",
        discountType: "percent",
        amount: 10,
        isActive: true,
        appliesTo: {},
      });

      expect(result).toBeDefined();
      expect(result.code).toBe("TEST10");
    });

    it("should reject duplicate discount codes", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      // Create first discount
      await caller.discounts.create({
        code: "DUPLICATE",
        discountType: "percent",
        amount: 10,
        isActive: true,
        appliesTo: {},
      });

      // Try to create duplicate
      await expect(
        caller.discounts.create({
          code: "DUPLICATE",
          discountType: "percent",
          amount: 20,
          isActive: true,
          appliesTo: {},
        })
      ).rejects.toThrow("already exists");
    });
  });
});
