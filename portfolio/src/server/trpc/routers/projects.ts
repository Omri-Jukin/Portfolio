import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";

const projects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Built a scalable e-commerce solution with React and Node.js",
    slug: "ecommerce-platform",
    image: "/api/placeholder/400/300",
    category: "Web Application",
    skills: ["React", "Node.js", "MongoDB"],
    impact: "Increased conversion by 35%",
    problem: "Legacy system causing 40% cart abandonment",
    approach: "Implemented modern React frontend with Node.js microservices",
    architecture: "Microservices with Redis caching and CDN optimization",
    stack: ["React", "Node.js", "MongoDB", "Redis", "AWS"],
    metrics: {
      before: { conversion: "2.1%", loadTime: "4.2s", errors: "15%" },
      after: { conversion: "2.8%", loadTime: "1.8s", errors: "2%" },
    },
    nextSteps: "Implement AI-powered product recommendations",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-20"),
  },
  {
    id: "2",
    title: "Real-time Dashboard",
    description: "Created a real-time analytics dashboard for business metrics",
    slug: "realtime-dashboard",
    image: "/api/placeholder/400/300",
    category: "Dashboard",
    skills: ["Vue.js", "WebSocket", "Redis"],
    impact: "Reduced load time by 60%",
    problem: "Static reports causing 8-hour delays in decision making",
    approach: "Built real-time streaming dashboard with WebSocket connections",
    architecture: "Event-driven architecture with Redis pub/sub",
    stack: ["Vue.js", "WebSocket", "Redis", "Node.js", "PostgreSQL"],
    metrics: {
      before: {
        loadTime: "5.0s",
        updateDelay: "8h",
        userEngagement: "12%",
      },
      after: {
        loadTime: "2.0s",
        updateDelay: "0s",
        userEngagement: "67%",
      },
    },
    nextSteps: "Add machine learning anomaly detection",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-07-15"),
  },
  {
    id: "3",
    title: "Mobile App",
    description: "Developed a cross-platform mobile application",
    slug: "mobile-app",
    image: "/api/placeholder/400/300",
    category: "Mobile",
    skills: ["React Native", "Firebase", "TypeScript"],
    impact: "100K+ downloads",
    problem: "Native development requiring separate iOS/Android teams",
    approach: "Cross-platform React Native with shared business logic",
    architecture: "Monorepo with shared components and business logic",
    stack: ["React Native", "Firebase", "TypeScript", "Jest", "Fastlane"],
    metrics: {
      before: {
        devTime: "12 months",
        codeReuse: "0%",
        maintenance: "High",
      },
      after: {
        devTime: "8 months",
        codeReuse: "85%",
        maintenance: "Low",
      },
    },
    nextSteps: "Implement offline-first capabilities",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-08-01"),
  },
];

export const projectsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        category: z.string().optional(),
        skill: z.string().optional(),
        impact: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement actual database query
      // For now, return placeholder data

      // Apply filters
      let filteredProjects = projects;

      if (input.category) {
        filteredProjects = filteredProjects.filter(
          (p) => p.category === input.category
        );
      }

      if (input.skill) {
        filteredProjects = filteredProjects.filter((p) =>
          p.skills.includes(input.skill!)
        );
      }

      if (input.impact) {
        filteredProjects = filteredProjects.filter((p) =>
          p.impact.includes(input.impact!)
        );
      }

      return {
        items: filteredProjects.slice(0, input.limit),
        nextCursor: filteredProjects.length > input.limit ? "2" : null,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      // TODO: Implement actual database query
      const projects = [
        {
          id: "1",
          title: "E-commerce Platform",
          description:
            "Built a scalable e-commerce solution with React and Node.js",
          slug: "ecommerce-platform",
          image: "/api/placeholder/400/300",
          category: "Web Application",
          skills: ["React", "Node.js", "MongoDB"],
          impact: "Increased conversion by 35%",
          problem: "Legacy system causing 40% cart abandonment",
          approach:
            "Implemented modern React frontend with Node.js microservices",
          architecture: "Microservices with Redis caching and CDN optimization",
          stack: ["React", "Node.js", "MongoDB", "Redis", "AWS"],
          metrics: {
            before: { conversion: "2.1%", loadTime: "4.2s", errors: "15%" },
            after: { conversion: "2.8%", loadTime: "1.8s", errors: "2%" },
          },
          nextSteps: "Implement AI-powered product recommendations",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-06-20"),
        },
      ];

      const project = projects.find((p) => p.slug === input.slug);

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        slug: z.string().min(1),
        image: z.string().url(),
        category: z.string().min(1),
        skills: z.array(z.string()),
        impact: z.string().min(1),
        problem: z.string().min(1),
        approach: z.string().min(1),
        architecture: z.string().min(1),
        stack: z.array(z.string()),
        metrics: z.object({
          before: z.record(z.string()),
          after: z.record(z.string()),
        }),
        nextSteps: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement actual database creation
      console.log("Creating project:", input);

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
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        image: z.string().url().optional(),
        category: z.string().min(1).optional(),
        skills: z.array(z.string()).optional(),
        impact: z.string().min(1).optional(),
        problem: z.string().min(1).optional(),
        approach: z.string().min(1).optional(),
        architecture: z.string().min(1).optional(),
        stack: z.array(z.string()).optional(),
        metrics: z
          .object({
            before: z.record(z.string()),
            after: z.record(z.string()),
          })
          .optional(),
        nextSteps: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement actual database update
      console.log("Updating project:", input);

      return {
        ...input,
        updatedAt: new Date(),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // TODO: Implement actual database deletion
      console.log("Deleting project:", input.id);

      return { success: true };
    }),
});
