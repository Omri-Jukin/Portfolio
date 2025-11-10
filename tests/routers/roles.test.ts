import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import { createTestContext, createMockAdminUser } from "../helpers/testContext";
import { getDB } from "$/db/client";
import { roles } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

describe("Roles Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping roles router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      // Don't delete all roles - they might be system roles
      // Just clean up test roles
      await db.delete(roles).where(eq(roles.name, "test-role"));

      adminUser = createMockAdminUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(roles).where(eq(roles.name, "test-role"));
    }
  });

  describe("getAll (admin)", () => {
    it("should return all roles", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.roles.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create (admin)", () => {
    it("should create a new role", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.roles.create({
        name: "test-role",
        displayName: "Test Role",
        description: "Test role description",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("test-role");
    });

    it("should reject duplicate role names", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      // Create first role
      await caller.roles.create({
        name: "test-role",
        displayName: "Test Role",
      });

      // Try to create duplicate
      await expect(
        caller.roles.create({
          name: "test-role",
          displayName: "Duplicate Role",
        })
      ).rejects.toThrow("already exists");
    });
  });

  describe("delete (admin)", () => {
    it("should prevent deletion of default roles", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      // Get admin role
      const allRoles = await caller.roles.getAll();
      const adminRole = allRoles.find((r) => r.name.toLowerCase() === "admin");

      if (adminRole) {
        await expect(caller.roles.delete({ id: adminRole.id })).rejects.toThrow(
          "Cannot delete default system roles"
        );
      }
    });
  });
});
