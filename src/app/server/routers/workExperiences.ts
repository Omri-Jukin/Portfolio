import { z } from "zod";
import { router, procedure, protectedProcedure } from "../trpc";

const publicProcedure = procedure;
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";

// Validation schemas
const EmploymentTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
]);

const CreateWorkExperienceSchema = z.object({
  role: z.string().min(1, "Role is required").max(200, "Role too long"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(200, "Company too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location too long"),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  achievements: z
    .array(z.string().min(1).max(500))
    .min(1, "At least one achievement is required"),
  technologies: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one technology is required"),
  responsibilities: z
    .array(z.string().min(1).max(500))
    .min(1, "At least one responsibility is required"),
  employmentType: EmploymentTypeSchema,
  industry: z
    .string()
    .min(1, "Industry is required")
    .max(100, "Industry too long"),
  companyUrl: z.string().url().optional().or(z.literal("")),
  logo: z.string().max(500).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  roleTranslations: z.record(z.string(), z.string()).optional(),
  companyTranslations: z.record(z.string(), z.string()).optional(),
  descriptionTranslations: z.record(z.string(), z.string()).optional(),
});

const UpdateWorkExperienceSchema = CreateWorkExperienceSchema.partial();

const ReorderWorkExperiencesSchema = z.array(
  z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0),
  })
);

const WorkExperienceFiltersSchema = z.object({
  employmentType: z.string().optional(),
  industry: z.string().optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isCurrent: z.boolean().optional(),
});

export const workExperiencesRouter = router({
  // Public routes (for displaying work experiences)
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
        employmentType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.employmentType) {
        return await WorkExperienceManager.getByEmploymentType(
          input.employmentType,
          input.visibleOnly
        );
      }
      return await WorkExperienceManager.getAll(input.visibleOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await WorkExperienceManager.getById(input.id);
    }),

  getByEmploymentType: publicProcedure
    .input(
      z.object({
        employmentType: EmploymentTypeSchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await WorkExperienceManager.getByEmploymentType(
        input.employmentType,
        input.visibleOnly
      );
    }),

  getCurrentPosition: publicProcedure.query(async () => {
    return await WorkExperienceManager.getCurrentPosition();
  }),

  getFeatured: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await WorkExperienceManager.getFeatured(input.visibleOnly);
    }),

  getStatistics: publicProcedure.query(async () => {
    return await WorkExperienceManager.getStatistics();
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        filters: WorkExperienceFiltersSchema.optional(),
      })
    )
    .query(async ({ input }) => {
      return await WorkExperienceManager.search(input.query, input.filters);
    }),

  // Protected routes (admin only)
  getAllAdmin: protectedProcedure.query(async () => {
    return await WorkExperienceManager.getAll(false);
  }),

  create: protectedProcedure
    .input(CreateWorkExperienceSchema)
    .mutation(async ({ input, ctx }) => {
      // Convert empty string URLs to undefined
      const cleanInput = {
        ...input,
        companyUrl: input.companyUrl === "" ? undefined : input.companyUrl,
        createdBy: ctx.user.id,
      };

      return await WorkExperienceManager.create(cleanInput);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: UpdateWorkExperienceSchema,
      })
    )
    .mutation(async ({ input }) => {
      // Convert empty string URLs to undefined
      const cleanData = {
        ...input.data,
        companyUrl:
          input.data.companyUrl === "" ? undefined : input.data.companyUrl,
      };

      return await WorkExperienceManager.update(input.id, cleanData);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const success = await WorkExperienceManager.delete(input.id);
      if (!success) {
        throw new Error("Failed to delete work experience");
      }
      return { success: true };
    }),

  reorder: protectedProcedure
    .input(ReorderWorkExperiencesSchema)
    .mutation(async ({ input }) => {
      await WorkExperienceManager.updateDisplayOrder(input);
      return { success: true };
    }),

  toggleVisibility: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await WorkExperienceManager.toggleVisibility(input.id);
      if (!updated) {
        throw new Error("Work experience not found");
      }
      return updated;
    }),

  toggleFeatured: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await WorkExperienceManager.toggleFeatured(input.id);
      if (!updated) {
        throw new Error("Work experience not found");
      }
      return updated;
    }),

  // Bulk operations
  bulkUpdate: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: UpdateWorkExperienceSchema,
      })
    )
    .mutation(async ({ input }) => {
      const results = await WorkExperienceManager.bulkUpdate(
        input.ids,
        input.updates
      );
      return results;
    }),

  bulkDelete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const result = await WorkExperienceManager.bulkDelete(input.ids);
      return result;
    }),
});
