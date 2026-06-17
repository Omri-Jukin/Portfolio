import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";
import {
  employmentTypeSchema,
  workExperienceCreateSchema,
  workExperienceUpdateSchema,
  bulkUpdateOrderSchema,
} from "#/lib/schemas";

const publicProcedure = procedure;
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";

// Additional schemas specific to this router
const WorkExperienceFiltersSchema = z.object({
  employmentType: z.string().optional(),
  industry: z.string().optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isCurrent: z.boolean().optional(),
});

function hasTranslationEntries(value?: Record<string, string>) {
  return !!value && Object.keys(value).length > 0;
}

function cleanWorkExperienceInput<
  T extends z.infer<typeof workExperienceUpdateSchema>
>(
  input: T
) {
  const cleanInput = {
    ...input,
    companyUrl: input.companyUrl === "" ? undefined : input.companyUrl,
  };

  if (!hasTranslationEntries(cleanInput.roleTranslations)) {
    delete cleanInput.roleTranslations;
  }

  if (!hasTranslationEntries(cleanInput.companyTranslations)) {
    delete cleanInput.companyTranslations;
  }

  if (!hasTranslationEntries(cleanInput.descriptionTranslations)) {
    delete cleanInput.descriptionTranslations;
  }

  return cleanInput;
}

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
    .query(async ({ input, ctx }) => {
      const workExperience = await WorkExperienceManager.getById(input.id);

      // Public users can only see visible work experiences
      // Admin/editor users can see all work experiences
      if (!workExperience) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !workExperience.isVisible) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return workExperience;
    }),

  getByEmploymentType: publicProcedure
    .input(
      z.object({
        employmentType: employmentTypeSchema,
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
  getAllAdmin: editorProcedure.query(async () => {
    return await WorkExperienceManager.getAll(false);
  }),

  create: editorProcedure
    .input(workExperienceCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const cleanInput = {
        ...cleanWorkExperienceInput(input),
        createdBy: ctx.user.id,
      };

      return await WorkExperienceManager.create(cleanInput);
    }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string(),
        data: workExperienceUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await WorkExperienceManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work experience not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update work experiences you created",
        });
      }

      const cleanData = cleanWorkExperienceInput(input.data);

      return await WorkExperienceManager.update(input.id, cleanData);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await WorkExperienceManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work experience not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete work experiences you created",
        });
      }

      const success = await WorkExperienceManager.delete(input.id);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete work experience",
        });
      }
      return { success: true };
    }),

  reorder: editorProcedure
    .input(bulkUpdateOrderSchema)
    .mutation(async ({ input }) => {
      await WorkExperienceManager.updateDisplayOrder(input.items);
      return { success: true };
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await WorkExperienceManager.toggleVisibility(input.id);
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work experience not found",
        });
      }
      return updated;
    }),

  toggleFeatured: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await WorkExperienceManager.toggleFeatured(input.id);
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work experience not found",
        });
      }
      return updated;
    }),

  toggleResumeFeatured: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await WorkExperienceManager.toggleResumeFeatured(input.id);
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work experience not found",
        });
      }
      return updated;
    }),

  // Bulk operations
  bulkUpdate: editorProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: workExperienceUpdateSchema,
      })
    )
    .mutation(async ({ input }) => {
      const results = await WorkExperienceManager.bulkUpdate(
        input.ids,
        cleanWorkExperienceInput(input.updates)
      );
      return results;
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const result = await WorkExperienceManager.bulkDelete(input.ids);
      return result;
    }),
});
