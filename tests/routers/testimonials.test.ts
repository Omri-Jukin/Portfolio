import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { testimonials } from "$/db/schema/schema.tables";

describe("Testimonials Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping testimonials router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(testimonials);

      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(testimonials);
    }
  });

  describe("getAll (public)", () => {
    it("should return visible testimonials by default", async () => {
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
      await db.insert(testimonials).values([
        {
          id: "test-1",
          quote: "Great service",
          author: "John Doe",
          role: "CEO",
          company: "Test Corp",
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "test-2",
          quote: "Hidden testimonial",
          author: "Jane Doe",
          role: "CTO",
          company: "Test Corp",
          isVisible: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.testimonials.getAll({ visibleOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((t) => t.isVisible)).toBe(true);
    });
  });

  describe("create (editor)", () => {
    it("should create a new testimonial", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create editor user in database first
      const editorUserId = await createTestUserInDb(db, editorUser);
      const ctx = await createTestContext(
        { ...editorUser, id: editorUserId },
        db
      );
      const caller = appRouter.createCaller(ctx);

      const result = await caller.testimonials.create({
        quote: "Excellent work!",
        author: "Test Author",
        role: "Manager",
        company: "Test Company",
      });

      expect(result).toBeDefined();
      expect(result.quote).toBe("Excellent work!");
    });
  });
});
