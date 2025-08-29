import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";

const posts = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt:
      "Learn the best practices for building large-scale React applications that maintain performance and developer experience.",
    content: "Full blog post content here...",
    author: "Omri Jukin",
    publishedAt: new Date("2024-06-15"),
    readingTime: "8 min read",
    category: "Development",
    tags: ["React", "Performance", "Architecture"],
    featured: true,
    published: true,
  },
  {
    id: "2",
    title: "The Future of Full-Stack Development",
    slug: "future-of-fullstack-development",
    excerpt:
      "Exploring emerging trends and technologies that will shape the future of full-stack development.",
    content: "Full blog post content here...",
    author: "Omri Jukin",
    publishedAt: new Date("2024-05-20"),
    readingTime: "12 min read",
    category: "Technology",
    tags: ["Full-Stack", "Trends", "Innovation"],
    featured: false,
    published: true,
  },
  {
    id: "3",
    title: "Optimizing Database Performance",
    slug: "optimizing-database-performance",
    excerpt:
      "Practical strategies for improving database performance in production environments.",
    content: "Full blog post content here...",
    author: "Omri Jukin",
    publishedAt: new Date("2024-04-10"),
    readingTime: "10 min read",
    category: "Database",
    tags: ["Database", "Performance", "Optimization"],
    featured: false,
    published: true,
  },
];

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        category: z.string().optional(),
        published: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement actual database query

      let filteredPosts = posts;

      if (input.published) {
        filteredPosts = filteredPosts.filter((post) => post.published);
      }

      if (input.category) {
        filteredPosts = filteredPosts.filter(
          (post) => post.category === input.category
        );
      }

      return {
        items: filteredPosts.slice(0, input.limit),
        nextCursor: filteredPosts.length > input.limit ? "2" : null,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      // TODO: Implement actual database query
      const posts = [
        {
          id: "1",
          title: "Building Scalable React Applications",
          slug: "building-scalable-react-applications",
          excerpt:
            "Learn the best practices for building large-scale React applications that maintain performance and developer experience.",
          content: "Full blog post content here...",
          author: "Omri Jukin",
          publishedAt: new Date("2024-06-15"),
          readingTime: "8 min read",
          category: "Development",
          tags: ["React", "Performance", "Architecture"],
          featured: true,
          published: true,
        },
      ];

      const post = posts.find((p) => p.slug === input.slug);

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        author: z.string().min(1),
        category: z.string().min(1),
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement actual database creation
      console.log("Creating post:", input);

      return {
        id: Date.now().toString(),
        ...input,
        publishedAt: input.published ? new Date() : null,
        readingTime: "5 min read", // TODO: Calculate actual reading time
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        author: z.string().min(1).optional(),
        category: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement actual database update
      console.log("Updating post:", input);

      return {
        ...input,
        updatedAt: new Date(),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // TODO: Implement actual database deletion
      console.log("Deleting post:", input.id);

      return { success: true };
    }),
});
