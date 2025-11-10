import { describe, it, expect, beforeEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import { createTestContext, createMockAdminUser } from "../helpers/testContext";
import { getDB } from "$/db/client";

describe("Proposals Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping proposals router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      // Note: Proposals have foreign key dependencies, so we'll test carefully
      adminUser = createMockAdminUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  describe("getAll (admin)", () => {
    it("should return all proposals", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.proposals.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
