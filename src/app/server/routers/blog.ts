import { z } from "zod";
import { router, procedure } from "../trpc";
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
    if (!db) throw new Error("Database not available");

    return await getPublishedPosts();
  }),

  // Get post by slug (public)
  getBySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      const post = await getPostBySlug(input.slug);
      if (!post) {
        throw new Error("Post not found");
      }

      // Only return published posts for public access
      if (post.status !== "published") {
        throw new Error("Post not found");
      }

      return post;
    }),

  // Admin routes (require authentication)
  getAll: procedure.query(async (opts) => {
    const { db, user } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await getAllPosts();
  }),

  getById: procedure.input(z.object({ id: z.string() })).query(async (opts) => {
    const { db, user } = opts.ctx;
    const { input } = opts;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await getPostById(input.id);
  }),

  create: procedure
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
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const author = `${user.firstName} ${user.lastName}`;

      return await createPost({
        ...input,
        author,
        authorId: user.id,
      });
    }),

  update: procedure
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
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await updatePost(input);
    }),

  delete: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await deletePost(input.id);
    }),
});
