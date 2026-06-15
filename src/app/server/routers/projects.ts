import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";
import { canEditContentSync } from "#/lib/auth/rbac";

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

const ProjectProofLinkSchema = z.object({
  label: z.string().min(1, "Label is required").max(120, "Label too long"),
  href: z.string().min(1, "URL is required").max(500, "URL too long"),
  description: z.string().max(300, "Description too long").optional(),
});

const optionalText = (max: number, message: string) =>
  z.string().max(max, message).optional().or(z.literal(""));

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
  isResumeFeatured: z.boolean().default(false),
  caseStudySlug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must use lowercase letters, numbers, and hyphens"
    )
    .max(120, "Slug too long")
    .optional()
    .or(z.literal("")),
  hiringSignal: optionalText(300, "Hiring signal too long"),
  constraints: z.array(z.string().min(1).max(300)).default([]),
  decisions: z.array(z.string().min(1).max(300)).default([]),
  outcome: optionalText(1000, "Outcome too long"),
  caseStudyRole: optionalText(300, "Case study role too long"),
  proofLinks: z.array(ProjectProofLinkSchema).default([]),
  privateRepoNote: optionalText(1000, "Private repo note too long"),
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
  isResumeFeatured: z.boolean().optional(),
  isOpenSource: z.boolean().optional(),
});

function emptyToUndefined(value: string | undefined) {
  return value === "" ? undefined : value;
}

function cleanProjectInput<T extends z.infer<typeof UpdateProjectSchema>>(
  input: T
) {
  return {
    ...input,
    githubUrl: emptyToUndefined(input.githubUrl),
    liveUrl: emptyToUndefined(input.liveUrl),
    demoUrl: emptyToUndefined(input.demoUrl),
    documentationUrl: emptyToUndefined(input.documentationUrl),
    caseStudySlug: emptyToUndefined(input.caseStudySlug),
    hiringSignal: emptyToUndefined(input.hiringSignal),
    outcome: emptyToUndefined(input.outcome),
    caseStudyRole: emptyToUndefined(input.caseStudyRole),
    privateRepoNote: emptyToUndefined(input.privateRepoNote),
  };
}

function getVisibleOnlyForPublicRead(
  requestedVisibleOnly: boolean,
  role: string | undefined
) {
  return requestedVisibleOnly || !canEditContentSync(role || "visitor");
}

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
    .query(async ({ input, ctx }) => {
      const visibleOnly = getVisibleOnlyForPublicRead(
        input.visibleOnly,
        ctx.user?.role
      );
      if (input.status) {
        return await ProjectManager.getByStatus(
          input.status,
          visibleOnly
        );
      }
      if (input.projectType) {
        return await ProjectManager.getByType(
          input.projectType,
          visibleOnly
        );
      }
      if (input.category) {
        return await ProjectManager.getByCategory(
          input.category,
          visibleOnly
        );
      }
      return await ProjectManager.getAll(visibleOnly);
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

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      return await ProjectManager.getBySlug(input.slug, !canSeeAll);
    }),

  getByStatus: publicProcedure
    .input(
      z.object({
        status: ProjectStatusSchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ProjectManager.getByStatus(
        input.status,
        getVisibleOnlyForPublicRead(input.visibleOnly, ctx.user?.role)
      );
    }),

  getByType: publicProcedure
    .input(
      z.object({
        projectType: ProjectTypeSchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ProjectManager.getByType(
        input.projectType,
        getVisibleOnlyForPublicRead(input.visibleOnly, ctx.user?.role)
      );
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ProjectManager.getByCategory(
        input.category,
        getVisibleOnlyForPublicRead(input.visibleOnly, ctx.user?.role)
      );
    }),

  getFeatured: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ProjectManager.getFeatured(
        getVisibleOnlyForPublicRead(input.visibleOnly, ctx.user?.role)
      );
    }),

  getResumeFeatured: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ProjectManager.getResumeFeatured(
        getVisibleOnlyForPublicRead(input.visibleOnly, ctx.user?.role)
      );
    }),

  getOpenSource: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ProjectManager.getOpenSource(
        getVisibleOnlyForPublicRead(input.visibleOnly, ctx.user?.role)
      );
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
      const cleanInput = {
        ...cleanProjectInput(input),
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

      const cleanData = cleanProjectInput(input.data);

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

  toggleResumeFeatured: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await ProjectManager.toggleResumeFeatured(input.id);
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
