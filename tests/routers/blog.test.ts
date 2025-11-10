import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { appRouter } from "@/app/server/router";
import {
  createTestContext,
  createMockAdminUser,
  createMockEditorUser,
  createTestUserInDb,
} from "../helpers/testContext";
import { getDB } from "$/db/client";
import { blogPosts } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

describe("Blog Router", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let adminUser: ReturnType<typeof createMockAdminUser>;
  let editorUser: ReturnType<typeof createMockEditorUser>;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping blog router tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      // Clean up before each test
      await db.delete(blogPosts);

      adminUser = createMockAdminUser();
      editorUser = createMockEditorUser();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(blogPosts);
    }
  });

  describe("getPublished", () => {
    it("should return only published posts", async () => {
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
      // Create test posts
      await db.insert(blogPosts).values([
        {
          id: "post-1",
          title: "Published Post",
          slug: "published-post",
          content: "Content",
          status: "published",
          author: "Test Author",
          authorId: testUserId,
        },
        {
          id: "post-2",
          title: "Draft Post",
          slug: "draft-post",
          content: "Content",
          status: "draft",
          author: "Test Author",
          authorId: testUserId,
        },
      ]);

      const result = await caller.blog.getPublished();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe("published");
    });

    it("should return empty array when no published posts exist", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(null, db);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.getPublished();
      expect(result).toEqual([]);
    });
  });

  describe("getBySlug", () => {
    it("should return published post for public user", async () => {
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
      await db.insert(blogPosts).values({
        id: "post-1",
        title: "Test Post",
        slug: "test-post",
        content: "Content",
        status: "published",
        author: "Test Author",
        authorId: testUserId,
      });

      const result = await caller.blog.getBySlug({ slug: "test-post" });
      expect(result).toBeDefined();
      expect(result?.slug).toBe("test-post");
    });

    it("should not return draft post for public user", async () => {
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
      await db.insert(blogPosts).values({
        id: "post-1",
        title: "Draft Post",
        slug: "draft-post",
        content: "Content",
        status: "draft",
        author: "Test Author",
        authorId: testUserId,
      });

      await expect(
        caller.blog.getBySlug({ slug: "draft-post" })
      ).rejects.toThrow();
    });

    it("should return draft post for editor user", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      const testUser = createMockAdminUser();
      const testUserId = await createTestUserInDb(db, testUser);
      await db.insert(blogPosts).values({
        id: "post-1",
        title: "Draft Post",
        slug: "draft-post",
        content: "Content",
        status: "draft",
        author: "Test Author",
        authorId: testUserId,
      });

      const result = await caller.blog.getBySlug({ slug: "draft-post" });
      expect(result).toBeDefined();
      expect(result?.status).toBe("draft");
    });
  });

  describe("getAll (editor)", () => {
    it("should return all posts for editor", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      const testUser = createMockAdminUser();
      const testUserId = await createTestUserInDb(db, testUser);
      await db.insert(blogPosts).values([
        {
          id: "post-1",
          title: "Published",
          slug: "published",
          content: "Content",
          status: "published",
          author: "Test Author",
          authorId: testUserId,
        },
        {
          id: "post-2",
          title: "Draft",
          slug: "draft",
          content: "Content",
          status: "draft",
          author: "Test Author",
          authorId: testUserId,
        },
      ]);

      const result = await caller.blog.getAll();
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("create (editor)", () => {
    it("should create a new post", async () => {
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

      const result = await caller.blog.create({
        title: "New Post",
        slug: "new-post",
        content: "Content here",
        status: "draft",
      });

      expect(result).toBeDefined();
      expect(result.title).toBe("New Post");

      // Verify in database
      const posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, result.id));
      expect(posts).toHaveLength(1);
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
        caller.blog.create({
          title: "",
          slug: "test",
          content: "Content",
        })
      ).rejects.toThrow();
    });
  });

  describe("update (editor)", () => {
    it("should update an existing post", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      const testUser = createMockAdminUser();
      const testUserId = await createTestUserInDb(db, testUser);
      // Create post first
      const created = await db
        .insert(blogPosts)
        .values({
          id: "post-1",
          title: "Original Title",
          slug: "original-slug",
          content: "Original content",
          status: "draft",
          author: "Test Author",
          authorId: testUserId,
        })
        .returning();

      const result = await caller.blog.update({
        id: created[0]!.id,
        title: "Updated Title",
      });

      expect(result.title).toBe("Updated Title");

      // Verify in database
      const updated = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, created[0]!.id));
      expect(updated[0]?.title).toBe("Updated Title");
    });
  });

  describe("delete (editor)", () => {
    it("should delete an existing post", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      const testUser = createMockAdminUser();
      const testUserId = await createTestUserInDb(db, testUser);
      const created = await db
        .insert(blogPosts)
        .values({
          id: "post-1",
          title: "To Delete",
          slug: "to-delete",
          content: "Content",
          status: "draft",
          author: "Test Author",
          authorId: testUserId,
        })
        .returning();

      await caller.blog.delete({ id: created[0]!.id });

      // Verify deleted
      const posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, created[0]!.id));
      expect(posts).toHaveLength(0);
    });
  });

  describe("Authorization", () => {
    it("should allow editor to access getAll", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(editorUser, db);
      const caller = appRouter.createCaller(ctx);

      await expect(caller.blog.getAll()).resolves.toBeDefined();
    });

    it("should allow admin to access getAll", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(adminUser, db);
      const caller = appRouter.createCaller(ctx);

      await expect(caller.blog.getAll()).resolves.toBeDefined();
    });

    it("should reject visitor from accessing getAll", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const ctx = await createTestContext(
        { ...createMockAdminUser(), role: "visitor" },
        db
      );
      const caller = appRouter.createCaller(ctx);

      await expect(caller.blog.getAll()).rejects.toThrow();
    });
  });
});
