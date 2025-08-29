import { z } from "zod";
import { router, publicProcedure } from "../init";

export const projectsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().min(1).max(50).default(12),
        })
        .optional()
    )
    .query(async ({ input }) => {
      // For now, return mock data
      // Later this will integrate with Payload CMS
      const mockProjects = [
        {
          id: "1",
          title: "Portfolio Website",
          summary:
            "A modern portfolio built with Next.js 15, React 19, and Payload CMS.",
          slug: "portfolio-website",
          category: "Web Development",
        },
        {
          id: "2",
          title: "E-commerce Platform",
          summary:
            "A full-featured online store with payment integration and admin dashboard.",
          slug: "ecommerce-platform",
          category: "Web Development",
        },
      ];

      const projects = input?.category
        ? mockProjects.filter((p) => p.category === input.category)
        : mockProjects;

      return projects.slice(0, input?.limit ?? 12);
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      // Mock data for now
      const mockProjects = [
        {
          id: "1",
          title: "Portfolio Website",
          summary:
            "A modern portfolio built with Next.js 15, React 19, and Payload CMS.",
          slug: "portfolio-website",
          category: "Web Development",
          content: "Detailed project description...",
        },
      ];

      return mockProjects.find((p) => p.slug === input.slug) ?? null;
    }),
});
