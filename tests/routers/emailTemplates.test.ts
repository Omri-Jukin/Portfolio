import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { emailTemplates } from "$/db/schema/schema.tables";

describe("Email Templates Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping email templates router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(emailTemplates);

      adminUser = createMockAdminUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(emailTemplates);
    }
  });

  describe("getAll (admin)", () => {
    it("should return all email templates", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.emailTemplates.getAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create (admin)", () => {
    it("should create a new email template", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Ensure admin user exists in database
      const actualAdminUser = await createTestUserInDb(db, adminUser);
      const ctx = await createTestContext(
        { ...adminUser, id: actualAdminUser },
        db
      );
      const caller = appRouter.createCaller(ctx);

      const result = await caller.emailTemplates.create({
        name: "Test Template",
        subject: "Test Subject",
        htmlContent: "<p>Test content</p>",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Test Template");
    });
  });
});
