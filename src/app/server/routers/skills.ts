import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";

const publicProcedure = procedure;
import { SkillManager } from "$/db/skills/SkillManager";

// Validation schemas
const SkillCategorySchema = z.enum([
  "technical",
  "soft",
  "language",
  "tool",
  "framework",
  "database",
  "cloud",
]);

const ProficiencyLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

const CreateSkillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  category: SkillCategorySchema,
  subCategory: z.string().max(100, "Sub-category too long").optional(),
  proficiencyLevel: z
    .number()
    .int()
    .min(1, "Proficiency level must be at least 1")
    .max(100, "Proficiency level cannot exceed 100"),
  proficiencyLabel: ProficiencyLevelSchema,
  yearsOfExperience: z
    .number()
    .int()
    .min(0, "Years of experience cannot be negative")
    .max(50, "Years of experience seems too high"),
  description: z.string().max(1000, "Description too long").optional(),
  icon: z.string().max(10, "Icon too long").optional(),
  color: z.string().max(20, "Color too long").optional(),
  relatedSkills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  lastUsed: z.coerce.date(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
  nameTranslations: z.record(z.string(), z.string()).optional(),
  descriptionTranslations: z.record(z.string(), z.string()).optional(),
});

const UpdateSkillSchema = CreateSkillSchema.partial();

const ReorderSkillsSchema = z.array(
  z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0),
  })
);

const SkillFiltersSchema = z.object({
  category: z.string().optional(),
  subCategory: z.string().optional(),
  proficiencyLabel: z.string().optional(),
  minProficiency: z.number().int().min(1).max(100).optional(),
  maxProficiency: z.number().int().min(1).max(100).optional(),
  minExperience: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
  usedRecently: z.boolean().optional(),
});

export const skillsRouter = router({
  // Public routes (for displaying skills)
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
        category: z.string().optional(),
        proficiencyLabel: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.category) {
        return await SkillManager.getByCategory(
          input.category,
          input.visibleOnly
        );
      }
      if (input.proficiencyLabel) {
        return await SkillManager.getByProficiencyLevel(
          input.proficiencyLabel,
          input.visibleOnly
        );
      }
      return await SkillManager.getAll(input.visibleOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const skill = await SkillManager.getById(input.id);

      // Public users can only see visible skills
      // Admin/editor users can see all skills
      if (!skill) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !skill.isVisible) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return skill;
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        category: SkillCategorySchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await SkillManager.getByCategory(
        input.category,
        input.visibleOnly
      );
    }),

  getByProficiencyLevel: publicProcedure
    .input(
      z.object({
        proficiencyLabel: ProficiencyLevelSchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await SkillManager.getByProficiencyLevel(
        input.proficiencyLabel,
        input.visibleOnly
      );
    }),

  getTopSkills: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await SkillManager.getTopSkills(input.limit, input.visibleOnly);
    }),

  getRecentlyUsed: publicProcedure
    .input(
      z.object({
        monthsBack: z.number().int().min(1).max(60).default(12),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await SkillManager.getRecentlyUsed(
        input.monthsBack,
        input.visibleOnly
      );
    }),

  getStatistics: publicProcedure.query(async () => {
    return await SkillManager.getStatistics();
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        filters: SkillFiltersSchema.optional(),
      })
    )
    .query(async ({ input }) => {
      return await SkillManager.search(input.query, input.filters);
    }),

  // Protected routes (admin only)
  getAllAdmin: editorProcedure.query(async () => {
    return await SkillManager.getAll(false);
  }),

  create: editorProcedure
    .input(CreateSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const cleanInput = {
        ...input,
        createdBy: ctx.user.id,
      };

      return await SkillManager.create(cleanInput);
    }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string(),
        data: UpdateSkillSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await SkillManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Skill not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update skills you created",
        });
      }

      return await SkillManager.update(input.id, input.data);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await SkillManager.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Skill not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete skills you created",
        });
      }

      const success = await SkillManager.delete(input.id);
      if (!success) {
        throw new Error("Failed to delete skill");
      }
      return { success: true };
    }),

  reorder: editorProcedure
    .input(ReorderSkillsSchema)
    .mutation(async ({ input }) => {
      await SkillManager.updateDisplayOrder(input);
      return { success: true };
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await SkillManager.toggleVisibility(input.id);
      if (!updated) {
        throw new Error("Skill not found");
      }
      return updated;
    }),

  updateLastUsed: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await SkillManager.updateLastUsed(input.id);
      if (!updated) {
        throw new Error("Skill not found");
      }
      return updated;
    }),

  // Bulk operations
  bulkUpdate: editorProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: UpdateSkillSchema,
      })
    )
    .mutation(async ({ input }) => {
      const results = await SkillManager.bulkUpdate(input.ids, input.updates);
      return results;
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const result = await SkillManager.bulkDelete(input.ids);
      return result;
    }),

  bulkUpdateLastUsed: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const results = await Promise.all(
        input.ids.map((id) => SkillManager.updateLastUsed(id))
      );
      return results.filter(Boolean);
    }),
});
