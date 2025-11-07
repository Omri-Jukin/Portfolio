import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";
import { TestimonialManager } from "$/db/testimonials/TestimonialManager";

const publicProcedure = procedure;

// Validation schemas
const CreateTestimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required").max(2000, "Quote too long"),
  author: z.string().min(1, "Author is required").max(200, "Author too long"),
  role: z.string().min(1, "Role is required").max(200, "Role too long"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(200, "Company too long"),
  authorImage: z.string().url().optional().or(z.literal("")),
  authorLinkedIn: z.string().url().optional().or(z.literal("")),
  companyUrl: z.string().url().optional().or(z.literal("")),
  companyLogo: z.string().url().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).optional(),
  isVerified: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  quoteTranslations: z.record(z.string(), z.string()).optional(),
  authorTranslations: z.record(z.string(), z.string()).optional(),
  roleTranslations: z.record(z.string(), z.string()).optional(),
  companyTranslations: z.record(z.string(), z.string()).optional(),
});

const UpdateTestimonialSchema = CreateTestimonialSchema.partial();

const ReorderTestimonialsSchema = z.array(
  z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0),
  })
);

export const testimonialsRouter = router({
  // Public routes
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await TestimonialManager.getAll(input.visibleOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const testimonial = await TestimonialManager.getById(input.id);

      // Public users can only see visible testimonials
      // Admin/editor users can see all testimonials
      if (!testimonial) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !testimonial.isVisible) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return testimonial;
    }),

  getFeatured: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await TestimonialManager.getFeatured(
        input.limit,
        input.visibleOnly
      );
    }),

  getVerified: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await TestimonialManager.getVerified(input.visibleOnly);
    }),

  getStatistics: publicProcedure.query(async () => {
    return await TestimonialManager.getStatistics();
  }),

  // Protected routes (editor or admin)
  getAllAdmin: editorProcedure.query(async () => {
    return await TestimonialManager.getAll(false);
  }),

  create: editorProcedure
    .input(CreateTestimonialSchema)
    .mutation(async ({ input, ctx }) => {
      const cleanInput = {
        ...input,
        createdBy: ctx.user.id,
      };
      return await TestimonialManager.create(cleanInput);
    }),

  update: editorProcedure
    .input(UpdateTestimonialSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await TestimonialManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimonial not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update testimonials you created",
        });
      }

      const { id, ...updateData } = input;
      return await TestimonialManager.update(id, updateData);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await TestimonialManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimonial not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete testimonials you created",
        });
      }

      const success = await TestimonialManager.delete(input.id);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete testimonial",
        });
      }
      return { success: true };
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await TestimonialManager.toggleVisibility(input.id);
    }),

  toggleFeatured: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await TestimonialManager.toggleFeatured(input.id);
    }),

  verify: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await TestimonialManager.verify(input.id);
    }),

  reorder: editorProcedure
    .input(ReorderTestimonialsSchema)
    .mutation(async ({ input }) => {
      await TestimonialManager.updateDisplayOrder(input);
      return { success: true };
    }),

  bulkUpdate: editorProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: UpdateTestimonialSchema,
      })
    )
    .mutation(async ({ input }) => {
      return await TestimonialManager.bulkUpdate(input.ids, input.updates);
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await TestimonialManager.bulkDelete(input.ids);
    }),
});
