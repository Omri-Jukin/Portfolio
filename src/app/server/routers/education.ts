import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";
import {
  educationCreateSchema,
  educationUpdateSchema,
  educationFiltersSchema,
  educationBulkUpdateOrderSchema,
} from "#/lib/schemas";
import { EducationManager } from "$/db/Education/EducationManager";
import { NewEducation, UpdateEducation } from "#/lib/db/Education";

const publicProcedure = procedure;

export const educationRouter = router({
  // Public routes (for displaying education)
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
        degreeType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.degreeType) {
        return await EducationManager.getByDegreeType(
          input.degreeType,
          input.visibleOnly
        );
      }
      return await EducationManager.getAll(input.visibleOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const education = await EducationManager.getById(input.id);

      // Public users can only see visible education records
      // Admin/editor users can see all education records
      if (!education) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !education.isVisible) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return education;
    }),

  getByDegreeType: publicProcedure
    .input(
      z.object({
        degreeType: z.string(),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await EducationManager.getByDegreeType(
        input.degreeType,
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
      return await EducationManager.getFeatured(input.visibleOnly);
    }),

  getStatistics: publicProcedure.query(async () => {
    return await EducationManager.getStatistics();
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        filters: educationFiltersSchema.optional(),
      })
    )
    .query(async ({ input }) => {
      return await EducationManager.search(input.query, input.filters);
    }),

  // Protected routes (admin only)
  getAllAdmin: editorProcedure.query(async () => {
    return await EducationManager.getAll(false);
  }),

  create: editorProcedure
    .input(educationCreateSchema)
    .mutation(async ({ input, ctx }) => {
      // Convert empty string URLs to undefined
      const cleanInput = {
        ...input,
        institution: input.institution === "" ? undefined : input.institution,
        degreeType: input.degree === "" ? undefined : input.degree,
        fieldOfStudy: input.field === "" ? undefined : input.field,
        createdBy: ctx.user.id,
      };

      const { ...createData } = cleanInput as NewEducation;
      return await EducationManager.create(createData);
    }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string(),
        data: educationUpdateSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await EducationManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Education record not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update education records you created",
        });
      }

      // Convert empty string URLs to undefined
      const cleanData = {
        ...input.data,
        institution:
          input.data.institution === "" ? undefined : input.data.institution,
        degreeType: input.data.degree === "" ? undefined : input.data.degree,
        fieldOfStudy: input.data.field === "" ? undefined : input.data.field,
      };

      return await EducationManager.update(
        input.id,
        cleanData as UpdateEducation
      );
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await EducationManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Education record not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete education records you created",
        });
      }

      const success = await EducationManager.delete(input.id);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete education record",
        });
      }
      return { success: true };
    }),

  reorder: editorProcedure
    .input(educationBulkUpdateOrderSchema)
    .mutation(async ({ input }) => {
      return await EducationManager.bulkUpdateOrder(input.updates);
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await EducationManager.bulkDelete(input.ids);
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const education = await EducationManager.getById(input.id);
      if (!education) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Education record not found",
        });
      }

      return await EducationManager.update(input.id, {
        isVisible: !education.isVisible,
      });
    }),

  // Note: isFeatured functionality removed as it's not in the database schema
});
