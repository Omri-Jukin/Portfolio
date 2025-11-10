import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { projects } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

describe("Projects Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping projects router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      await db.delete(projects);

      adminUser = createMockAdminUser();
      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(projects);
    }
  });

  describe("getAll (public)", () => {
    it("should return visible projects by default", async () => {
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
      await db.insert(projects).values([
        {
          id: "proj-1",
          title: "Visible Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "proj-2",
          title: "Hidden Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: false,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.projects.getAll({ visibleOnly: true });
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((p) => p.isVisible)).toBe(true);
    });
  });

  describe("getById (public)", () => {
    it("should return visible project for public user", async () => {
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
      const created = await db
        .insert(projects)
        .values({
          id: "proj-1",
          title: "Test Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: true,
          createdBy: testUserId,
        })
        .returning();

      const result = await caller.projects.getById({ id: created[0]!.id });
      expect(result).toBeDefined();
      expect(result?.isVisible).toBe(true);
    });

    it("should not return hidden project for public user", async () => {
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
      const created = await db
        .insert(projects)
        .values({
          id: "proj-1",
          title: "Hidden Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: false,
          createdBy: testUserId,
        })
        .returning();

      const result = await caller.projects.getById({ id: created[0]!.id });
      expect(result).toBeNull();
    });

    it("should return hidden project for editor", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const testUser = createMockAdminUser();
      const testUserId = await createTestUserInDb(db, testUser);
      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      const created = await db
        .insert(projects)
        .values({
          id: "proj-1",
          title: "Hidden Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: false,
          createdBy: testUserId,
        })
        .returning();

      const result = await caller.projects.getById({ id: created[0]!.id });
      expect(result).toBeDefined();
    });
  });

  describe("create (editor)", () => {
    it("should create a new project", async () => {
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

      const result = await caller.projects.create({
        title: "New Project",
        subtitle: "Subtitle",
        description: "Description",
        technologies: ["React", "TypeScript"],
        categories: ["Web"],
        status: "completed",
        projectType: "professional",
        startDate: new Date(),
        keyFeatures: ["Feature 1", "Feature 2"],
      });

      expect(result).toBeDefined();
      expect(result.title).toBe("New Project");

      // Verify in database
      const projs = await db
        .select()
        .from(projects)
        .where(eq(projects.id, result.id));
      expect(projs).toHaveLength(1);
    });

    it("should validate required fields", async () => {
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
        caller.projects.create({
          title: "",
          subtitle: "Subtitle",
          description: "Description",
          technologies: [],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
        })
      ).rejects.toThrow();
    });
  });

  describe("update (editor)", () => {
    it("should update an existing project", async () => {
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
        .insert(projects)
        .values({
          id: "proj-1",
          title: "Original Title",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          createdBy: editorUserId,
        })
        .returning();

      const result = await caller.projects.update({
        id: created[0]!.id,
        data: { title: "Updated Title" },
      });

      expect(result?.title).toBe("Updated Title");
    });

    it("should prevent editor from updating project created by another user", async () => {
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

      const otherUser = createMockAdminUser({ email: "other@test.com" });
      const otherUserId = await createTestUserInDb(db, otherUser);
      const created = await db
        .insert(projects)
        .values({
          id: "proj-1",
          title: "Other User's Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          createdBy: otherUserId,
        })
        .returning();

      await expect(
        caller.projects.update({
          id: created[0]!.id,
          data: { title: "Hacked Title" },
        })
      ).rejects.toThrow("You can only update projects you created");
    });

    it("should allow admin to update any project", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create admin user in database first
      const adminUserId = await createTestUserInDb(db, adminUser);
      const ctx = await createTestContext(
        { ...adminUser, id: adminUserId },
        db
      );
      const caller = appRouter.createCaller(ctx);

      const otherUser = createMockAdminUser({ email: "other2@test.com" });
      const otherUserId = await createTestUserInDb(db, otherUser);
      const created = await db
        .insert(projects)
        .values({
          id: "proj-1",
          title: "Other User's Project",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          createdBy: otherUserId,
        })
        .returning();

      const result = await caller.projects.update({
        id: created[0]!.id,
        data: { title: "Admin Updated Title" },
      });

      expect(result?.title).toBe("Admin Updated Title");
    });
  });

  describe("delete (editor)", () => {
    it("should delete an existing project", async () => {
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
        .insert(projects)
        .values({
          id: "proj-1",
          title: "To Delete",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          createdBy: editorUserId,
        })
        .returning();

      await caller.projects.delete({ id: created[0]!.id });

      // Verify deleted
      const projs = await db
        .select()
        .from(projects)
        .where(eq(projects.id, created[0]!.id));
      expect(projs).toHaveLength(0);
    });
  });

  describe("getByStatus", () => {
    it("should filter projects by status", async () => {
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
      await db.insert(projects).values([
        {
          id: "proj-1",
          title: "Completed",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "completed",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: true,
          createdBy: testUserId,
        },
        {
          id: "proj-2",
          title: "In Progress",
          subtitle: "Subtitle",
          description: "Description",
          technologies: ["React"],
          categories: ["Web"],
          status: "in-progress",
          projectType: "professional",
          startDate: new Date(),
          keyFeatures: ["Feature 1"],
          isVisible: true,
          createdBy: testUserId,
        },
      ]);

      const result = await caller.projects.getByStatus({
        status: "completed",
        visibleOnly: true,
      });

      expect(result.every((p) => p.status === "completed")).toBe(true);
    });
  });
});
