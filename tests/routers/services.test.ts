import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { services } from "$/db/schema/schema.tables";

describe("Services Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping services router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(services);

      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(services);
    }
  });

  describe("getAll (public)", () => {
    it("should return active services by default", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(null, db);
      const caller = appRouter.createCaller(ctx);

      const testUser = createMockAdminUser();
      const testUserId = await createTestUserInDb(db, testUser);
      await db.insert(services).values([
        {
          id: "svc-1",
          name: "Active Service",
          category: "development",
          serviceType: "project",
          description: "Description",
          pricingType: "fixed",
          isActive: true,
          createdBy: testUserId,
        },
        {
          id: "svc-2",
          name: "Inactive Service",
          category: "development",
          serviceType: "project",
          description: "Description",
          pricingType: "fixed",
          isActive: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.services.getAll({ activeOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((s) => s.isActive)).toBe(true);
    });
  });

  describe("create (editor)", () => {
    it("should create a new service", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.services.create({
        name: "New Service",
        category: "development",
        serviceType: "project",
        description: "Service description",
        pricingType: "fixed",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("New Service");
    });
  });
});
