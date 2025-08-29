import { z } from "zod";
import { router, publicProcedure } from "../init";

export const skillsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ input }) => {
      // For now, return mock data
      // Later this will integrate with Payload CMS
      const mockSkills = [
        {
          id: "1",
          name: "React",
          category: "Frontend",
          level: "expert",
          description: "Modern React with hooks and context",
          icon: "⚛️",
          yearsOfExperience: 5,
        },
        {
          id: "2",
          name: "TypeScript",
          category: "Programming",
          level: "advanced",
          description: "Type-safe JavaScript development",
          icon: "🔷",
          yearsOfExperience: 4,
        },
        {
          id: "3",
          name: "Node.js",
          category: "Backend",
          level: "advanced",
          description: "Server-side JavaScript runtime",
          icon: "🟢",
          yearsOfExperience: 4,
        },
        {
          id: "4",
          name: "Next.js",
          category: "Frontend",
          level: "expert",
          description: "React framework for production",
          icon: "⚡",
          yearsOfExperience: 3,
        },
        {
          id: "5",
          name: "PostgreSQL",
          category: "Database",
          level: "intermediate",
          description: "Relational database management",
          icon: "🐘",
          yearsOfExperience: 2,
        },
      ];

      let filteredSkills = mockSkills;

      if (input?.category) {
        filteredSkills = filteredSkills.filter((s) => s.category === input.category);
      }

      if (input?.level) {
        filteredSkills = filteredSkills.filter((s) => s.level === input.level);
      }

      return filteredSkills.slice(0, input?.limit ?? 50);
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Mock data for now
      const mockSkills = [
        {
          id: "1",
          name: "React",
          category: "Frontend",
          level: "expert",
          description: "Modern React with hooks and context",
          icon: "⚛️",
          yearsOfExperience: 5,
          projects: ["Portfolio Website", "E-commerce Platform"],
          certifications: ["React Advanced Patterns"],
        },
      ];

      return mockSkills.find((s) => s.id === input.id) ?? null;
    }),

  categories: publicProcedure.query(async () => {
    // Return unique skill categories
    return ["Frontend", "Backend", "Programming", "Database", "DevOps", "Design"];
  }),

  levels: publicProcedure.query(async () => {
    // Return skill levels
    return ["beginner", "intermediate", "advanced", "expert"];
  }),
});
