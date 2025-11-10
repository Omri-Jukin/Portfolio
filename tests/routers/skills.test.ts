import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { skills } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

describe("Skills Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping skills router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(skills);

      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(skills);
    }
  });

  describe("getAll (public)", () => {
    it("should return visible skills by default", async () => {
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
      await db.insert(skills).values([
        {
          id: "skill-1",
          name: "React",
          category: "technical",
          proficiencyLevel: 80,
          proficiencyLabel: "advanced",
          yearsOfExperience: 3,
          lastUsed: new Date(),
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "skill-2",
          name: "Hidden Skill",
          category: "technical",
          proficiencyLevel: 50,
          proficiencyLabel: "intermediate",
          yearsOfExperience: 1,
          lastUsed: new Date(),
          isVisible: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.skills.getAll({ visibleOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((s) => s.isVisible)).toBe(true);
    });
  });

  describe("create (editor)", () => {
    it("should create a new skill", async () => {
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

      const result = await caller.skills.create({
        name: "TypeScript",
        category: "technical",
        proficiencyLevel: 85,
        proficiencyLabel: "advanced",
        yearsOfExperience: 4,
        lastUsed: new Date(),
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("TypeScript");

      // Verify in database
      const skillRecords = await db
        .select()
        .from(skills)
        .where(eq(skills.id, result.id));
      expect(skillRecords).toHaveLength(1);
    });

    it("should validate proficiency level range", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.skills.create({
          name: "Test",
          category: "technical",
          proficiencyLevel: 150, // Invalid: exceeds max
          proficiencyLabel: "expert",
          yearsOfExperience: 1,
          lastUsed: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe("update (editor)", () => {
    it("should update an existing skill", async () => {
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
        .insert(skills)
        .values({
          id: "skill-1",
          name: "Original Name",
          category: "technical",
          proficiencyLevel: 50,
          proficiencyLabel: "intermediate",
          yearsOfExperience: 2,
          lastUsed: new Date(),
          createdBy: editorUserId,
        })
        .returning();

      const result = await caller.skills.update({
        id: created[0]!.id,
        data: { name: "Updated Name" },
      });

      expect(result?.name).toBe("Updated Name");
    });
  });

  describe("getByCategory", () => {
    it("should filter skills by category", async () => {
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
      await db.insert(skills).values([
        {
          id: "skill-1",
          name: "React",
          category: "technical",
          proficiencyLevel: 80,
          proficiencyLabel: "advanced",
          yearsOfExperience: 3,
          lastUsed: new Date(),
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "skill-2",
          name: "Communication",
          category: "soft",
          proficiencyLevel: 90,
          proficiencyLabel: "expert",
          yearsOfExperience: 5,
          lastUsed: new Date(),
          isVisible: true,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.skills.getByCategory({
        category: "technical",
        visibleOnly: true,
      });

      expect(result.every((s) => s.category === "technical")).toBe(true);
    });
  });
});
