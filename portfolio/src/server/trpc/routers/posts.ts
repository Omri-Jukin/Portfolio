import { z } from "zod";
import { router, publicProcedure } from "../init";

export const postsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          tag: z.string().optional(),
          published: z.boolean().optional(),
          limit: z.number().min(1).max(50).default(12),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      // For now, return mock data
      // Later this will integrate with Payload CMS
      const mockPosts = [
        {
          id: "1",
          title: "Building a Modern Portfolio with Next.js 15",
          slug: "building-modern-portfolio-nextjs-15",
          excerpt:
            "Learn how to create a stunning portfolio website using the latest Next.js features and modern web technologies.",
          content: "Full blog post content here...",
          publishedAt: "2024-01-15T10:00:00Z",
          author: "Omri Jukin",
          category: "Web Development",
          tags: ["Next.js", "React", "Portfolio", "Web Development"],
          readTime: "5 min read",
          featured: true,
        },
        {
          id: "2",
          title: "The Future of Full-Stack Development",
          slug: "future-full-stack-development",
          excerpt:
            "Exploring emerging trends and technologies that will shape the future of full-stack development.",
          content: "Full blog post content here...",
          publishedAt: "2024-01-10T14:30:00Z",
          author: "Omri Jukin",
          category: "Technology",
          tags: ["Full-Stack", "Technology", "Trends", "Development"],
          readTime: "8 min read",
          featured: false,
        },
        {
          id: "3",
          title: "Optimizing React Performance in 2024",
          slug: "optimizing-react-performance-2024",
          excerpt:
            "Advanced techniques and best practices for optimizing React applications in the modern web landscape.",
          content: "Full blog post content here...",
          publishedAt: "2024-01-05T09:15:00Z",
          author: "Omri Jukin",
          category: "Frontend",
          tags: ["React", "Performance", "Optimization", "Frontend"],
          readTime: "6 min read",
          featured: true,
        },
      ];

      let filteredPosts = mockPosts;

      if (input?.category) {
        filteredPosts = filteredPosts.filter(
          (p) => p.category === input.category
        );
      }

      if (input?.tag) {
        filteredPosts = filteredPosts.filter((p) =>
          p.tags.includes(input.tag!)
        );
      }

      if (input?.published !== undefined) {
        filteredPosts = filteredPosts.filter((p) => p.publishedAt !== null);
      }

      // Apply pagination
      const start = input?.offset ?? 0;
      const end = start + (input?.limit ?? 12);

      return {
        posts: filteredPosts.slice(start, end),
        total: filteredPosts.length,
        hasMore: end < filteredPosts.length,
      };
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      // Mock data for now
      const mockPosts = [
        {
          id: "1",
          title: "Building a Modern Portfolio with Next.js 15",
          slug: "building-modern-portfolio-nextjs-15",
          excerpt:
            "Learn how to create a stunning portfolio website using the latest Next.js features and modern web technologies.",
          content: "Full blog post content here...",
          publishedAt: "2024-01-15T10:00:00Z",
          author: "Omri Jukin",
          category: "Web Development",
          tags: ["Next.js", "React", "Portfolio", "Web Development"],
          readTime: "5 min read",
          featured: true,
          seo: {
            title: "Building a Modern Portfolio with Next.js 15",
            description:
              "Learn how to create a stunning portfolio website using the latest Next.js features and modern web technologies.",
          },
        },
      ];

      return mockPosts.find((p) => p.slug === input.slug) ?? null;
    }),

  categories: publicProcedure.query(async () => {
    // Return unique post categories
    return [
      "Web Development",
      "Technology",
      "Frontend",
      "Backend",
      "DevOps",
      "Design",
    ];
  }),

  tags: publicProcedure.query(async () => {
    // Return unique post tags
    return [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Portfolio",
      "Web Development",
      "Full-Stack",
      "Technology",
      "Trends",
      "Development",
      "Performance",
      "Optimization",
      "Frontend",
    ];
  }),

  featured: publicProcedure.query(async () => {
    // Return featured posts
    const mockPosts = [
      {
        id: "1",
        title: "Building a Modern Portfolio with Next.js 15",
        slug: "building-modern-portfolio-nextjs-15",
        excerpt:
          "Learn how to create a stunning portfolio website using the latest Next.js features and modern web technologies.",
        publishedAt: "2024-01-15T10:00:00Z",
        readTime: "5 min read",
      },
      {
        id: "3",
        title: "Optimizing React Performance in 2024",
        slug: "optimizing-react-performance-2024",
        excerpt:
          "Advanced techniques and best practices for optimizing React applications in the modern web landscape.",
        publishedAt: "2024-01-05T09:15:00Z",
        readTime: "6 min read",
      },
    ];

    return mockPosts;
  }),
});
