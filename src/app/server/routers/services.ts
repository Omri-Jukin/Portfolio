import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";
import { ServiceManager } from "$/db/services/ServiceManager";

const publicProcedure = procedure;

// Validation schemas
const ServiceCategorySchema = z.enum([
  "development",
  "consulting",
  "design",
  "training",
  "maintenance",
  "deleted",
  "cancelled",
]);

const ServiceTypeSchema = z.enum([
  "hourly",
  "project",
  "retainer",
  "subscription",
  "deleted",
  "cancelled",
]);

const PricingTypeSchema = z.enum([
  "fixed",
  "hourly",
  "range",
  "monthly",
  "deleted",
]);

const CreateServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  category: ServiceCategorySchema,
  serviceType: ServiceTypeSchema,
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  longDescription: z.string().max(5000).optional(),
  features: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  duration: z.string().max(100).optional(),
  complexity: z.string().max(100).optional(),
  pricingType: PricingTypeSchema,
  basePrice: z.string().max(50).optional(),
  priceRange: z.string().max(100).optional(),
  deliverables: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  portfolioExamples: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  nameTranslations: z.record(z.string(), z.string()).optional(),
  descriptionTranslations: z.record(z.string(), z.string()).optional(),
});

const UpdateServiceSchema = CreateServiceSchema.partial();

const ReorderServicesSchema = z.array(
  z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0),
  })
);

export const servicesRouter = router({
  // Public routes
  getAll: publicProcedure
    .input(
      z.object({
        activeOnly: z.boolean().default(true),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.category) {
        return await ServiceManager.getByCategory(
          input.category,
          input.activeOnly
        );
      }
      return await ServiceManager.getAll(input.activeOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const service = await ServiceManager.getById(input.id);

      // Public users can only see active services
      // Admin/editor users can see all services
      if (!service) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !service.isActive) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return service;
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        activeOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ServiceManager.getByCategory(
        input.category,
        input.activeOnly
      );
    }),

  getPopular: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        activeOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await ServiceManager.getPopular(input.limit, input.activeOnly);
    }),

  getStatistics: publicProcedure.query(async () => {
    return await ServiceManager.getStatistics();
  }),

  // Protected routes (editor or admin)
  getAllAdmin: editorProcedure.query(async () => {
    return await ServiceManager.getAll(false);
  }),

  create: editorProcedure
    .input(CreateServiceSchema)
    .mutation(async ({ input, ctx }) => {
      const cleanInput = {
        ...input,
        createdBy: ctx.user.id,
      };
      return await ServiceManager.create(cleanInput);
    }),

  update: editorProcedure
    .input(UpdateServiceSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await ServiceManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update services you created",
        });
      }

      const { id, ...updateData } = input;
      return await ServiceManager.update(id, updateData);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await ServiceManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete services you created",
        });
      }

      const success = await ServiceManager.delete(input.id);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete service",
        });
      }
      return { success: true };
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await ServiceManager.toggleVisibility(input.id);
    }),

  togglePopular: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await ServiceManager.togglePopular(input.id);
    }),

  reorder: editorProcedure
    .input(ReorderServicesSchema)
    .mutation(async ({ input }) => {
      await ServiceManager.updateDisplayOrder(input);
      return { success: true };
    }),

  bulkUpdate: editorProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: UpdateServiceSchema,
      })
    )
    .mutation(async ({ input }) => {
      return await ServiceManager.bulkUpdate(input.ids, input.updates);
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await ServiceManager.bulkDelete(input.ids);
    }),
});
