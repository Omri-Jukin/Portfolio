import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";

const publicProcedure = procedure;
import { ProjectManager } from "$/db/projects/ProjectManager";

// Validation schemas
const ProjectStatusSchema = z.enum([
  "completed",
  "in-progress",
  "archived",
  "concept",
]);

const ProjectTypeSchema = z.enum([
  "professional",
  "personal",
  "open-source",
  "academic",
]);

const TechnicalChallengeSchema = z.object({
  challenge: z
    .string()
    .min(1, "Challenge is required")
    .max(1000, "Challenge too long"),
  solution: z
    .string()
    .min(1, "Solution is required")
    .max(1000, "Solution too long"),
});

const CodeExampleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  language: z
    .string()
    .min(1, "Language is required")
    .max(50, "Language too long"),
  code: z.string().min(1, "Code is required").max(5000, "Code too long"),
  explanation: z
    .string()
    .min(1, "Explanation is required")
    .max(1000, "Explanation too long"),
});

const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(300, "Subtitle too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  longDescription: z.string().max(5000, "Long description too long").optional(),
  technologies: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one technology is required"),
  categories: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one category is required"),
  status: ProjectStatusSchema.default("completed"),
  projectType: ProjectTypeSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  documentationUrl: z.string().url().optional().or(z.literal("")),
  images: z.array(z.string().url()).default([]),
  keyFeatures: z
    .array(z.string().min(1).max(200))
    .min(1, "At least one key feature is required"),
  technicalChallenges: z.array(TechnicalChallengeSchema).default([]),
  codeExamples: z.array(CodeExampleSchema).default([]),
  teamSize: z.number().int().min(1).optional(),
  myRole: z.string().max(200).optional(),
  clientName: z.string().max(200).optional(),
  budget: z.string().max(100).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOpenSource: z.boolean().default(false),
  titleTranslations: z.record(z.string(), z.string()).optional(),
  descriptionTranslations: z.record(z.string(), z.string()).optional(),
});

const UpdateProjectSchema = CreateProjectSchema.partial();

const ReorderProjectsSchema = z.array(
  z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0),
  })
);

const ProjectFiltersSchema = z.object({
  status: z.string().optional(),
  projectType: z.string().optional(),
  category: z.string().optional(),
  technology: z.string().optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isOpenSource: z.boolean().optional(),
});

export const projectsRouter = router({
  // Public routes (for displaying projects)
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
        status: z.string().optional(),
        projectType: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.status) {
        return await ProjectManager.getByStatus(
          input.status,
          input.visibleOnly
        );
      }
      if (input.projectType) {
        return await ProjectManager.getByType(
          input.projectType,
          input.visibleOnly
        );
      }
      if (input.category) {
        return await ProjectManager.getByCategory(
          input.category,
          input.visibleOnly
        );
      }
      return await ProjectManager.getAll(input.visibleOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ProjectManager.getById(input.id);

      // Public users can only see visible projects
      // Admin/editor users can see all projects
      if (!project) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !project.isVisible) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return project;
    }),

  getByStatus: publicProcedure
    .input(
      z.object({
        status: ProjectStatusSchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ProjectManager.getByStatus(input.status, input.visibleOnly);
    }),

  getByType: publicProcedure
    .input(
      z.object({
        projectType: ProjectTypeSchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ProjectManager.getByType(
        input.projectType,
        input.visibleOnly
      );
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ProjectManager.getByCategory(
        input.category,
        input.visibleOnly
      );
    }),

  getFeatured: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ProjectManager.getFeatured(input.visibleOnly);
    }),

  getOpenSource: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ProjectManager.getOpenSource(input.visibleOnly);
    }),

  getStatistics: publicProcedure.query(async () => {
    return await ProjectManager.getStatistics();
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        filters: ProjectFiltersSchema.optional(),
      })
    )
    .query(async ({ input }) => {
      return await ProjectManager.search(input.query, input.filters);
    }),

  // Protected routes (admin only)
  getAllAdmin: editorProcedure.query(async () => {
    return await ProjectManager.getAll(false);
  }),

  create: editorProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      // Convert empty string URLs to undefined
      const cleanInput = {
        ...input,
        githubUrl: input.githubUrl === "" ? undefined : input.githubUrl,
        liveUrl: input.liveUrl === "" ? undefined : input.liveUrl,
        demoUrl: input.demoUrl === "" ? undefined : input.demoUrl,
        documentationUrl:
          input.documentationUrl === "" ? undefined : input.documentationUrl,
        createdBy: ctx.user.id,
      };

      return await ProjectManager.create(cleanInput);
    }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string(),
        data: UpdateProjectSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await ProjectManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update projects you created",
        });
      }

      // Convert empty string URLs to undefined
      const cleanData = {
        ...input.data,
        githubUrl:
          input.data.githubUrl === "" ? undefined : input.data.githubUrl,
        liveUrl: input.data.liveUrl === "" ? undefined : input.data.liveUrl,
        demoUrl: input.data.demoUrl === "" ? undefined : input.data.demoUrl,
        documentationUrl:
          input.data.documentationUrl === ""
            ? undefined
            : input.data.documentationUrl,
      };

      return await ProjectManager.update(input.id, cleanData);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await ProjectManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete projects you created",
        });
      }

      const success = await ProjectManager.delete(input.id);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete project",
        });
      }
      return { success: true };
    }),

  reorder: editorProcedure
    .input(ReorderProjectsSchema)
    .mutation(async ({ input }) => {
      await ProjectManager.updateDisplayOrder(input);
      return { success: true };
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await ProjectManager.toggleVisibility(input.id);
      if (!updated) {
        throw new Error("Project not found");
      }
      return updated;
    }),

  toggleFeatured: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await ProjectManager.toggleFeatured(input.id);
      if (!updated) {
        throw new Error("Project not found");
      }
      return updated;
    }),

  // Bulk operations
  bulkUpdate: editorProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: UpdateProjectSchema,
      })
    )
    .mutation(async ({ input }) => {
      const results = await ProjectManager.bulkUpdate(input.ids, input.updates);
      return results;
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const result = await ProjectManager.bulkDelete(input.ids);
      return result;
    }),
});
