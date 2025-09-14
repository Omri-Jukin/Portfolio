import { blogPosts } from "../schema/schema.tables";
import { getDB } from "../client";
import { v4 as uuidv4 } from "uuid";
import { PostStatus } from "../schema/schema.types";
import { eq, desc } from "drizzle-orm";

export type Post = typeof blogPosts.$inferSelect;

export type CreatePostInput = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: PostStatus;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
  author: string;
  authorId: string;
};

export type UpdatePostInput = {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: PostStatus;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export const createPost = async (input: CreatePostInput) => {
  // Skip during build time
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL &&
    !process.env.DATABASE_URL
  ) {
    throw new Error("Blog operations not available during build");
  }

  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Check if slug already exists
  const existingPost = await dbClient
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, input.slug))
    .limit(1);

  if (existingPost.length > 0) {
    throw new Error("A post with this slug already exists.");
  }

  const now = new Date();
  const newPost = await dbClient
    .insert(blogPosts)
    .values({
      id: uuidv4(),
      title: input.title,
      slug: input.slug,
      content: input.content,
      excerpt: input.excerpt,
      status: input.status || "draft",
      tags: input.tags || [],
      imageUrl: input.imageUrl,
      imageAlt: input.imageAlt,
      author: input.author,
      authorId: input.authorId,
      createdAt: now,
      publishedAt: input.status === "published" ? now : null,
    })
    .returning();

  if (!newPost.length) {
    throw new Error("Failed to create post.");
  }

  return newPost[0];
};

export const getPostBySlug = async (slug: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const post = await dbClient
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (post.length === 0) {
    throw new Error("Post not found.");
  }

  return post[0];
};

export const getPostById = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const post = await dbClient
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (post.length === 0) {
    throw new Error("Post not found.");
  }

  return post[0];
};

export const getAllPosts = async (status?: PostStatus) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const posts = await dbClient
    .select()
    .from(blogPosts)
    .where(status ? eq(blogPosts.status, status) : undefined)
    .orderBy(desc(blogPosts.createdAt));

  return posts;
};

export const getPublishedPosts = async () => {
  return getAllPosts("published");
};

export const updatePost = async (input: UpdatePostInput) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: Partial<typeof blogPosts.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.title) updateData.title = input.title;
  if (input.slug) updateData.slug = input.slug;
  if (input.content) updateData.content = input.content;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
  if (input.status) {
    updateData.status = input.status;
    if (input.status === "published") {
      updateData.publishedAt = new Date();
    }
  }
  if (input.tags) updateData.tags = input.tags;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.imageAlt !== undefined) updateData.imageAlt = input.imageAlt;

  const updatedPost = await dbClient
    .update(blogPosts)
    .set(updateData)
    .where(eq(blogPosts.id, input.id))
    .returning();

  if (!updatedPost.length) {
    throw new Error("Post not found.");
  }

  return updatedPost[0];
};

export const deletePost = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deletedPost = await dbClient
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning();

  if (!deletedPost.length) {
    throw new Error("Post not found.");
  }

  return deletedPost[0];
};
