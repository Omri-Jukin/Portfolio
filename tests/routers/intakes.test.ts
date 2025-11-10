import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import { createTestContext, createMockAdminUser } from "../helpers/testContext";
import { getDB } from "$/db/client";
import { intakes } from "$/db/schema/schema.tables";

describe("Intakes Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping intakes router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(intakes);

      adminUser = createMockAdminUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(intakes);
    }
  });

  describe("getAll (admin)", () => {
    it("should return all intakes", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.intakes.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
