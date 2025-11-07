import { z } from "zod";
import { router, procedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createPricingDiscount,
  getPricingDiscounts,
  getActivePricingDiscountByCode,
  updatePricingDiscount,
  deletePricingDiscount,
} from "$/db/intakes/pricingDiscounts";
import { createDiscountSchema, updateDiscountSchema } from "#/lib/schemas";

export const discountsRouter = router({
  // ============================================
  // Get All Discounts (Admin)
  // ============================================
  getAll: adminProcedure
    .input(
      z
        .object({
          includeInactive: z.boolean().optional().default(false),
        })
        .optional()
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const includeInactive = opts.input?.includeInactive ?? false;
      const discounts = await getPricingDiscounts(includeInactive);

      return discounts.map((d) => ({
        ...d,
        amount: Number(d.amount),
        appliesTo: d.appliesTo as {
          projectTypes?: string[];
          features?: string[];
          clientTypes?: string[];
          excludeClientTypes?: string[];
        },
        startsAt: d.startsAt?.toISOString() ?? null,
        endsAt: d.endsAt?.toISOString() ?? null,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      }));
    }),

  // ============================================
  // Get Discount by ID (Admin)
  // ============================================
  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const discounts = await getPricingDiscounts(true);
      const discount = discounts.find((d) => d.id === opts.input.id);

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      return {
        ...discount,
        amount: Number(discount.amount),
        appliesTo: discount.appliesTo as {
          projectTypes?: string[];
          features?: string[];
          clientTypes?: string[];
          excludeClientTypes?: string[];
        },
        startsAt: discount.startsAt?.toISOString() ?? null,
        endsAt: discount.endsAt?.toISOString() ?? null,
        createdAt: discount.createdAt.toISOString(),
        updatedAt: discount.updatedAt.toISOString(),
      };
    }),

  // ============================================
  // Create Discount (Admin)
  // ============================================
  create: adminProcedure.input(createDiscountSchema).mutation(async (opts) => {
    const { db } = opts.ctx;
    if (!db) throw new Error("Database not available");

    try {
      // Check if code already exists
      const existing = await getPricingDiscounts(true);
      if (
        existing.some(
          (d) => d.code.toLowerCase() === opts.input.code.toLowerCase()
        )
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Discount code already exists",
        });
      }

      const discount = await createPricingDiscount({
        code: opts.input.code,
        description: opts.input.description,
        discountType: opts.input.discountType,
        amount: opts.input.amount.toString(),
        currency: opts.input.currency,
        appliesTo: opts.input.appliesTo,
        startsAt: opts.input.startsAt,
        endsAt: opts.input.endsAt,
        maxUses: opts.input.maxUses,
        perUserLimit: opts.input.perUserLimit,
        isActive: opts.input.isActive,
      });

      return {
        ...discount,
        amount: Number(discount.amount),
        appliesTo: discount.appliesTo as {
          projectTypes?: string[];
          features?: string[];
          clientTypes?: string[];
          excludeClientTypes?: string[];
        },
        startsAt: discount.startsAt?.toISOString() ?? null,
        endsAt: discount.endsAt?.toISOString() ?? null,
        createdAt: discount.createdAt.toISOString(),
        updatedAt: discount.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to create discount",
      });
    }
  }),

  // ============================================
  // Update Discount (Admin)
  // ============================================
  update: adminProcedure
    .input(
      z
        .object({
          id: z.string().uuid(),
        })
        .and(updateDiscountSchema)
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = opts.input;

      try {
        // If code is being updated, check uniqueness
        if (updateData.code) {
          const existing = await getPricingDiscounts(true);
          if (
            existing.some(
              (d) =>
                d.id !== id &&
                d.code.toLowerCase() === updateData.code!.toLowerCase()
            )
          ) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Discount code already exists",
            });
          }
        }

        const discount = await updatePricingDiscount(id, {
          code: updateData.code,
          description: updateData.description,
          discountType: updateData.discountType,
          amount: updateData.amount?.toString(),
          currency: updateData.currency,
          appliesTo: updateData.appliesTo,
          startsAt: updateData.startsAt,
          endsAt: updateData.endsAt,
          maxUses: updateData.maxUses,
          perUserLimit: updateData.perUserLimit,
          isActive: updateData.isActive,
        });

        return {
          ...discount,
          amount: Number(discount.amount),
          appliesTo: discount.appliesTo as {
            projectTypes?: string[];
            features?: string[];
            clientTypes?: string[];
            excludeClientTypes?: string[];
          },
          startsAt: discount.startsAt?.toISOString() ?? null,
          endsAt: discount.endsAt?.toISOString() ?? null,
          createdAt: discount.createdAt.toISOString(),
          updatedAt: discount.updatedAt.toISOString(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update discount",
        });
      }
    }),

  // ============================================
  // Toggle Active Status (Admin)
  // ============================================
  toggleActive: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const discounts = await getPricingDiscounts(true);
        const discount = discounts.find((d) => d.id === opts.input.id);

        if (!discount) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discount not found",
          });
        }

        const updated = await updatePricingDiscount(opts.input.id, {
          isActive: !discount.isActive,
        });

        return {
          ...updated,
          amount: Number(updated.amount),
          appliesTo: updated.appliesTo as {
            projectTypes?: string[];
            features?: string[];
            clientTypes?: string[];
            excludeClientTypes?: string[];
          },
          startsAt: updated.startsAt?.toISOString() ?? null,
          endsAt: updated.endsAt?.toISOString() ?? null,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to toggle discount status",
        });
      }
    }),

  // ============================================
  // Delete Discount (Admin)
  // ============================================
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        await deletePricingDiscount(opts.input.id);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete discount",
        });
      }
    }),

  // ============================================
  // Lookup Discount by Code (Public - for calculator)
  // ============================================
  lookupDiscount: procedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async (opts) => {
      try {
        const discount = await getActivePricingDiscountByCode(
          opts.input.code.toUpperCase()
        );

        // Check usage limits
        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
          return null; // Discount exhausted
        }

        return {
          id: discount.id,
          code: discount.code,
          discountType: discount.discountType,
          amount: Number(discount.amount),
          currency: discount.currency,
          appliesTo: discount.appliesTo as {
            projectTypes?: string[];
            features?: string[];
            clientTypes?: string[];
            excludeClientTypes?: string[];
          },
          perUserLimit: discount.perUserLimit,
        };
      } catch {
        // Discount not found or not active
        return null;
      }
    }),

  // ============================================
  // Check Code Uniqueness (Admin)
  // ============================================
  checkCodeUnique: adminProcedure
    .input(
      z.object({
        code: z.string().min(1),
        excludeId: z.string().uuid().optional(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const discounts = await getPricingDiscounts(true);
      const exists = discounts.some(
        (d) =>
          d.code.toLowerCase() === opts.input.code.toLowerCase() &&
          d.id !== opts.input.excludeId
      );

      return { isUnique: !exists };
    }),
});
