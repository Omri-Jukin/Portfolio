import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { education } from "$/db/schema/schema.tables";

describe("Education Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping education router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(education);

      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(education);
    }
  });

  describe("getAll (public)", () => {
    it("should return visible education records by default", async () => {
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
      await db.insert(education).values([
        {
          id: "edu-1",
          institution: "Test University",
          degree: "Bachelor",
          degreeType: "bachelor",
          fieldOfStudy: "Computer Science",
          location: "Remote",
          startDate: new Date("2020-01-01"),
          endDate: new Date("2024-01-01"),
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "edu-2",
          institution: "Hidden University",
          degree: "Master",
          degreeType: "master",
          fieldOfStudy: "Engineering",
          location: "Remote",
          startDate: new Date("2024-01-01"),
          isVisible: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.education.getAll({ visibleOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((e) => e.isVisible)).toBe(true);
    });
  });

  describe("create (editor)", () => {
    it("should create a new education record", async () => {
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

      const result = await caller.education.create({
        institution: "New University",
        degree: "Bachelor",
        field: "Computer Science",
        location: "Remote",
        startDate: new Date("2020-01-01"),
        endDate: new Date("2024-01-01"),
      });

      expect(result).toBeDefined();
      expect(result.institution).toBe("New University");
    });
  });

  describe("update (editor)", () => {
    it("should update an existing education record", async () => {
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

      const created = await db
        .insert(education)
        .values({
          id: "edu-1",
          institution: "Original University",
          degree: "Bachelor",
          degreeType: "bachelor",
          fieldOfStudy: "CS",
          location: "Remote",
          startDate: new Date("2020-01-01"),
          createdBy: editorUserId,
        })
        .returning();

      const result = await caller.education.update({
        id: created[0]!.id,
        data: { institution: "Updated University" },
      });

      expect(result.institution).toBe("Updated University");
    });
  });
});
