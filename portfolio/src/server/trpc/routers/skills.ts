import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";

const skills = [
  {
    id: "1",
    name: "React",
    description: "Frontend development with React ecosystem",
    category: "Frontend",
    icon: "⚛️",
    yearsOfExperience: 5,
    level: "Expert",
    visible: true,
  },
  {
    id: "2",
    name: "Node.js",
    description: "Backend development with Node.js",
    category: "Backend",
    icon: "🟢",
    yearsOfExperience: 4,
    level: "Advanced",
    visible: true,
  },
  {
    id: "3",
    name: "TypeScript",
    description: "Type-safe JavaScript development",
    category: "Language",
    icon: "🔷",
    yearsOfExperience: 3,
    level: "Advanced",
    visible: true,
  },
  {
    id: "4",
    name: "Next.js",
    description: "Full-stack React framework",
    category: "Framework",
    icon: "⚡",
    yearsOfExperience: 3,
    level: "Advanced",
    visible: true,
  },
  {
    id: "5",
    name: "MongoDB",
    description: "NoSQL database management",
    category: "Database",
    icon: "🍃",
    yearsOfExperience: 3,
    level: "Intermediate",
    visible: true,
  },
  {
    id: "6",
    name: "PostgreSQL",
    description: "Relational database management",
    category: "Database",
    icon: "🐘",
    yearsOfExperience: 2,
    level: "Intermediate",
    visible: true,
  },
  {
    id: "7",
    name: "Docker",
    description: "Containerization and deployment",
    category: "DevOps",
    icon: "🐳",
    yearsOfExperience: 2,
    level: "Intermediate",
    visible: true,
  },
  {
    id: "8",
    name: "AWS",
    description: "Cloud infrastructure and services",
    category: "Cloud",
    icon: "☁️",
    yearsOfExperience: 2,
    level: "Intermediate",
    visible: true,
  },
];

export const skillsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement actual database query

      let filteredSkills = skills;

      if (input.visibleOnly) {
        filteredSkills = filteredSkills.filter((skill) => skill.visible);
      }

      if (input.category) {
        filteredSkills = filteredSkills.filter(
          (skill) => skill.category === input.category
        );
      }

      return filteredSkills;
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      // TODO: Implement actual database query
      const skills = [
        {
          id: "1",
          name: "React",
          description: "Frontend development with React ecosystem",
          category: "Frontend",
          icon: "⚛️",
          yearsOfExperience: 5,
          level: "Expert",
          visible: true,
        },
        {
          id: "4",
          name: "Next.js",
          description: "Full-stack React framework",
          category: "Framework",
          icon: "⚡",
          yearsOfExperience: 3,
          level: "Advanced",
          visible: true,
        },
      ];

      return skills.filter((skill) => skill.category === input.category);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        category: z.string().min(1),
        icon: z.string().min(1),
        yearsOfExperience: z.number().min(0),
        level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
        visible: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement actual database creation
      console.log("Creating skill:", input);

      return {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        category: z.string().min(1).optional(),
        icon: z.string().min(1).optional(),
        yearsOfExperience: z.number().min(0).optional(),
        level: z
          .enum(["Beginner", "Intermediate", "Advanced", "Expert"])
          .optional(),
        visible: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement actual database update
      console.log("Updating skill:", input);

      return {
        ...input,
        updatedAt: new Date(),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // TODO: Implement actual database deletion
      console.log("Deleting skill:", input.id);

      return { success: true };
    }),
});
