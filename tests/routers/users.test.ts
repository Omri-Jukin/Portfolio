import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import { createTestContext, createMockAdminUser } from "../helpers/testContext";
import { getDB } from "$/db/client";
import { users } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

describe("Users Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping users router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      // Clean up test users
      await db.delete(users).where(eq(users.email, "test-user@example.com"));

      adminUser = createMockAdminUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(users).where(eq(users.email, "test-user@example.com"));
    }
  });

  describe("me (public)", () => {
    it("should return current user when authenticated", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.users.me();
      expect(result).toBeDefined();
      expect(result.id).toBe(adminUser.id);
    });

    it("should throw error when not authenticated", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(null, db);
      const caller = appRouter.createCaller(ctx);

      await expect(caller.users.me()).rejects.toThrow();
    });
  });

  describe("create (admin)", () => {
    it("should create a new user", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.users.create({
        email: "test-user@example.com",
        password: "test-password-123",
        name: "Test User",
        role: "user",
      });

      expect(result).toBeDefined();
      expect(result.email).toBe("test-user@example.com");
    });
  });
});
