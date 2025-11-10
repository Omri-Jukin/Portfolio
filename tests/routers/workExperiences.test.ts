import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { workExperiences } from "$/db/schema/schema.tables";

describe("Work Experiences Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping work experiences router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(workExperiences);

      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(workExperiences);
    }
  });

  describe("getAll (public)", () => {
    it("should return visible work experiences by default", async () => {
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
      await db.insert(workExperiences).values([
        {
          id: "we-1",
          company: "Test Company",
          role: "Developer",
          location: "Remote",
          startDate: new Date("2020-01-01"),
          description: "Test description",
          achievements: ["Achievement 1"],
          technologies: ["React"],
          responsibilities: ["Responsibility 1"],
          employmentType: "full-time",
          industry: "Technology",
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "we-2",
          company: "Hidden Company",
          role: "Manager",
          location: "Remote",
          startDate: new Date("2022-01-01"),
          description: "Test description",
          achievements: ["Achievement 1"],
          technologies: ["React"],
          responsibilities: ["Responsibility 1"],
          employmentType: "full-time",
          industry: "Technology",
          isVisible: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.workExperiences.getAll({ visibleOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((w) => w.isVisible)).toBe(true);
    });
  });

  describe("create (editor)", () => {
    it("should create a new work experience", async () => {
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

      const result = await caller.workExperiences.create({
        company: "New Company",
        role: "Senior Developer",
        location: "Remote",
        startDate: new Date("2020-01-01"),
        description: "Worked on various projects",
        achievements: ["Achievement 1"],
        technologies: ["React", "TypeScript"],
        responsibilities: ["Responsibility 1"],
        employmentType: "full-time",
        industry: "Technology",
        companyUrl: "",
      });

      expect(result).toBeDefined();
      expect(result.company).toBe("New Company");
    });
  });
});
