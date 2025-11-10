import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { certifications } from "$/db/schema/schema.tables";

describe("Certifications Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping certifications router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(certifications);

      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(certifications);
    }
  });

  describe("getAll (public)", () => {
    it("should return visible certifications by default", async () => {
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
      await db.insert(certifications).values([
        {
          id: "cert-1",
          name: "AWS Certified",
          issuer: "AWS",
          description: "Cloud certification",
          category: "cloud",
          status: "active",
          skills: ["AWS", "Cloud"],
          issueDate: new Date(),
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "cert-2",
          name: "Hidden Cert",
          issuer: "Test",
          description: "Hidden",
          category: "technical",
          status: "active",
          skills: ["Test"],
          issueDate: new Date(),
          isVisible: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.certifications.getAll({ visibleOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((c) => c.isVisible)).toBe(true);
    });
  });

  describe("create (editor)", () => {
    it("should create a new certification", async () => {
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

      const result = await caller.certifications.create({
        name: "New Certification",
        issuer: "Test Issuer",
        description: "Test description",
        category: "technical",
        status: "active",
        skills: ["Skill1"],
        issueDate: new Date(),
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("New Certification");
    });
  });
});
