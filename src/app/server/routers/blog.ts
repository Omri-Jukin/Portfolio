import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";
import {
  createPost,
  getPostBySlug,
  getPostById,
  getAllPosts,
  getPublishedPosts,
  updatePost,
  deletePost,
} from "$/db/blog/blog";

export const blogRouter = router({
  // Get all published posts (public)
  getPublished: procedure.query(async (opts) => {
    const { db } = opts.ctx;
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    return await getPublishedPosts();
  }),

  // Get post by slug (public)
  getBySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const post = await getPostBySlug(input.slug);
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Public users can only see published posts
      // Admin/editor users can see all posts
      const userRole = user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && post.status !== "published") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  // Admin routes (require editor or admin role)
  getAll: editorProcedure.query(async (opts) => {
    const { db } = opts.ctx;
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    return await getAllPosts();
  }),

  getById: editorProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await getPostById(input.id);
    }),

  create: editorProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        status: z
          .enum(["draft", "published", "archived", "scheduled", "deleted"])
          .default("draft"),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        imageAlt: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const author = `${user.firstName} ${user.lastName}`;

      return await createPost({
        ...input,
        author,
        authorId: user.id,
      });
    }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        status: z
          .enum(["draft", "published", "archived", "scheduled", "deleted"])
          .optional(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        imageAlt: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await updatePost(input);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await deletePost(input.id);
    }),
});
