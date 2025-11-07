import { z } from "zod";
import { router, procedure, adminProcedure } from "../trpc";
import {
  createPricingProjectType,
  getPricingProjectTypes,
  getPricingProjectTypeById,
  updatePricingProjectType,
  deletePricingProjectType,
  togglePricingProjectTypeActive,
} from "$/db/pricing/projectTypes";
import {
  createPricingFeature,
  getPricingFeatures,
  getPricingFeatureById,
  updatePricingFeature,
  deletePricingFeature,
  togglePricingFeatureActive,
} from "$/db/pricing/features";
import {
  createPricingMultiplierGroup,
  getPricingMultiplierGroups,
  updatePricingMultiplierGroup,
  deletePricingMultiplierGroup,
  createPricingMultiplierValue,
  getPricingMultiplierValuesByGroup,
  updatePricingMultiplierValue,
  deletePricingMultiplierValue,
} from "$/db/pricing/multipliers";
import {
  getPricingMeta,
  getPricingMetaByKey,
  updatePricingMeta,
} from "$/db/pricing/meta";
import {
  createPricingBaseRate,
  getPricingBaseRates,
  getPricingBaseRateById,
  updatePricingBaseRate,
  deletePricingBaseRate,
  togglePricingBaseRateActive,
} from "$/db/pricing/baseRates";
import { getPricingModel } from "$/pricing/resolver";

export const pricingRouter = router({
  // ============================================
  // Pricing Model (Public - for calculator)
  // ============================================
  getModel: procedure.query(async () => {
    return await getPricingModel();
  }),

  // ============================================
  // Base Rates (client-type-specific)
  // ============================================
  baseRates: {
    getAll: adminProcedure
      .input(
        z
          .object({
            includeInactive: z.boolean().optional().default(false),
            projectTypeKey: z.string().optional(),
            clientTypeKey: z.string().nullable().optional(),
          })
          .optional()
      )
      .query(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        const includeInactive = opts.input?.includeInactive ?? false;
        const projectTypeKey = opts.input?.projectTypeKey;
        const clientTypeKey = opts.input?.clientTypeKey;
        const rates = await getPricingBaseRates(
          includeInactive,
          projectTypeKey,
          clientTypeKey
        );
        return rates.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      }),

    getById: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async (opts) => {
        const rate = await getPricingBaseRateById(opts.input.id);
        return {
          ...rate,
          createdAt: rate.createdAt.toISOString(),
          updatedAt: rate.updatedAt.toISOString(),
        };
      }),

    create: adminProcedure
      .input(
        z.object({
          projectTypeKey: z.string().min(1),
          clientTypeKey: z.string().nullable().optional(),
          baseRateIls: z.number().int().positive(),
          order: z.number().int().default(0),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async (opts) => {
        const rate = await createPricingBaseRate(opts.input);
        return {
          ...rate,
          createdAt: rate.createdAt.toISOString(),
          updatedAt: rate.updatedAt.toISOString(),
        };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          projectTypeKey: z.string().min(1).optional(),
          clientTypeKey: z.string().nullable().optional(),
          baseRateIls: z.number().int().positive().optional(),
          order: z.number().int().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { id, ...data } = opts.input;
        const rate = await updatePricingBaseRate(id, data);
        return {
          ...rate,
          createdAt: rate.createdAt.toISOString(),
          updatedAt: rate.updatedAt.toISOString(),
        };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        return await deletePricingBaseRate(opts.input.id);
      }),

    toggleActive: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          isActive: z.boolean(),
        })
      )
      .mutation(async (opts) => {
        const rate = await togglePricingBaseRateActive(
          opts.input.id,
          opts.input.isActive
        );
        return {
          ...rate,
          createdAt: rate.createdAt.toISOString(),
          updatedAt: rate.updatedAt.toISOString(),
        };
      }),
  },

  // ============================================
  // Project Types
  // ============================================
  projectTypes: {
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
        const types = await getPricingProjectTypes(includeInactive);
        return types.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        }));
      }),

    getById: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async (opts) => {
        const type = await getPricingProjectTypeById(opts.input.id);
        return {
          ...type,
          createdAt: type.createdAt.toISOString(),
          updatedAt: type.updatedAt.toISOString(),
        };
      }),

    create: adminProcedure
      .input(
        z.object({
          key: z.string().min(1),
          displayName: z.string().min(1),
          baseRateIls: z.number().int().positive(),
          order: z.number().int().default(0),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async (opts) => {
        const type = await createPricingProjectType(opts.input);
        return {
          ...type,
          createdAt: type.createdAt.toISOString(),
          updatedAt: type.updatedAt.toISOString(),
        };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          key: z.string().min(1).optional(),
          displayName: z.string().min(1).optional(),
          baseRateIls: z.number().int().positive().optional(),
          order: z.number().int().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { id, ...data } = opts.input;
        const type = await updatePricingProjectType(id, data);
        return {
          ...type,
          createdAt: type.createdAt.toISOString(),
          updatedAt: type.updatedAt.toISOString(),
        };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        return await deletePricingProjectType(opts.input.id);
      }),

    toggleActive: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          isActive: z.boolean(),
        })
      )
      .mutation(async (opts) => {
        const type = await togglePricingProjectTypeActive(
          opts.input.id,
          opts.input.isActive
        );
        return {
          ...type,
          createdAt: type.createdAt.toISOString(),
          updatedAt: type.updatedAt.toISOString(),
        };
      }),
  },

  // ============================================
  // Features
  // ============================================
  features: {
    getAll: adminProcedure
      .input(
        z
          .object({
            includeInactive: z.boolean().optional().default(false),
          })
          .optional()
      )
      .query(async (opts) => {
        const includeInactive = opts.input?.includeInactive ?? false;
        const features = await getPricingFeatures(includeInactive);
        return features.map((f) => ({
          ...f,
          createdAt: f.createdAt.toISOString(),
          updatedAt: f.updatedAt.toISOString(),
        }));
      }),

    getById: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async (opts) => {
        const feature = await getPricingFeatureById(opts.input.id);
        return {
          ...feature,
          createdAt: feature.createdAt.toISOString(),
          updatedAt: feature.updatedAt.toISOString(),
        };
      }),

    create: adminProcedure
      .input(
        z.object({
          key: z.string().min(1),
          displayName: z.string().min(1),
          defaultCostIls: z.number().int().positive(),
          group: z.string().nullable().optional(),
          order: z.number().int().default(0),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async (opts) => {
        const feature = await createPricingFeature(opts.input);
        return {
          ...feature,
          createdAt: feature.createdAt.toISOString(),
          updatedAt: feature.updatedAt.toISOString(),
        };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          key: z.string().min(1).optional(),
          displayName: z.string().min(1).optional(),
          defaultCostIls: z.number().int().positive().optional(),
          group: z.string().nullable().optional(),
          order: z.number().int().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { id, ...data } = opts.input;
        const feature = await updatePricingFeature(id, data);
        return {
          ...feature,
          createdAt: feature.createdAt.toISOString(),
          updatedAt: feature.updatedAt.toISOString(),
        };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        return await deletePricingFeature(opts.input.id);
      }),

    toggleActive: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          isActive: z.boolean(),
        })
      )
      .mutation(async (opts) => {
        const feature = await togglePricingFeatureActive(
          opts.input.id,
          opts.input.isActive
        );
        return {
          ...feature,
          createdAt: feature.createdAt.toISOString(),
          updatedAt: feature.updatedAt.toISOString(),
        };
      }),
  },

  // ============================================
  // Multipliers
  // ============================================
  multipliers: {
    groups: {
      getAll: adminProcedure
        .input(
          z
            .object({
              includeInactive: z.boolean().optional().default(false),
            })
            .optional()
        )
        .query(async (opts) => {
          const includeInactive = opts.input?.includeInactive ?? false;
          const groups = await getPricingMultiplierGroups(includeInactive);
          return groups.map((g) => ({
            ...g,
            createdAt: g.createdAt.toISOString(),
            updatedAt: g.updatedAt.toISOString(),
          }));
        }),

      create: adminProcedure
        .input(
          z.object({
            key: z.string().min(1),
            displayName: z.string().min(1),
            order: z.number().int().default(0),
            isActive: z.boolean().default(true),
          })
        )
        .mutation(async (opts) => {
          const group = await createPricingMultiplierGroup(opts.input);
          return {
            ...group,
            createdAt: group.createdAt.toISOString(),
            updatedAt: group.updatedAt.toISOString(),
          };
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.string().uuid(),
            key: z.string().min(1).optional(),
            displayName: z.string().min(1).optional(),
            order: z.number().int().optional(),
            isActive: z.boolean().optional(),
          })
        )
        .mutation(async (opts) => {
          const { id, ...data } = opts.input;
          const group = await updatePricingMultiplierGroup(id, data);
          return {
            ...group,
            createdAt: group.createdAt.toISOString(),
            updatedAt: group.updatedAt.toISOString(),
          };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async (opts) => {
          return await deletePricingMultiplierGroup(opts.input.id);
        }),
    },

    values: {
      getByGroup: adminProcedure
        .input(
          z.object({
            groupKey: z.string(),
            includeInactive: z.boolean().optional().default(false),
          })
        )
        .query(async (opts) => {
          const includeInactive = opts.input.includeInactive ?? false;
          const values = await getPricingMultiplierValuesByGroup(
            opts.input.groupKey,
            includeInactive
          );
          return values.map((v) => ({
            ...v,
            value: Number(v.value),
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
          }));
        }),

      create: adminProcedure
        .input(
          z.object({
            groupKey: z.string(),
            optionKey: z.string().min(1),
            displayName: z.string().min(1),
            value: z.number().positive(),
            order: z.number().int().default(0),
            isFixed: z.boolean().default(false),
            isActive: z.boolean().default(true),
          })
        )
        .mutation(async (opts) => {
          const value = await createPricingMultiplierValue({
            ...opts.input,
            value: opts.input.value.toFixed(3),
          });
          return {
            ...value,
            value: Number(value.value),
            createdAt: value.createdAt.toISOString(),
            updatedAt: value.updatedAt.toISOString(),
          };
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.string().uuid(),
            optionKey: z.string().min(1).optional(),
            displayName: z.string().min(1).optional(),
            value: z.number().positive().optional(),
            order: z.number().int().optional(),
            isFixed: z.boolean().optional(),
            isActive: z.boolean().optional(),
          })
        )
        .mutation(async (opts) => {
          const { id, value: val, ...data } = opts.input;
          const updateData: Partial<
            import("$/db/schema/schema.tables").NewPricingMultiplierValue
          > = { ...data };
          if (val !== undefined) {
            updateData.value = Number.parseFloat(val.toFixed(3)).toString();
          }
          const value = await updatePricingMultiplierValue(id, updateData);
          return {
            ...value,
            value: Number(value.value),
            createdAt: value.createdAt.toISOString(),
            updatedAt: value.updatedAt.toISOString(),
          };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async (opts) => {
          return await deletePricingMultiplierValue(opts.input.id);
        }),
    },
  },

  // ============================================
  // Meta
  // ============================================
  meta: {
    getAll: adminProcedure
      .input(
        z
          .object({
            includeInactive: z.boolean().optional().default(false),
          })
          .optional()
      )
      .query(async (opts) => {
        const includeInactive = opts.input?.includeInactive ?? false;
        const meta = await getPricingMeta(includeInactive);
        return meta.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString(),
        }));
      }),

    getByKey: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(async (opts) => {
        const meta = await getPricingMetaByKey(opts.input.key);
        return {
          ...meta,
          createdAt: meta.createdAt.toISOString(),
          updatedAt: meta.updatedAt.toISOString(),
        };
      }),

    update: adminProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.unknown(),
        })
      )
      .mutation(async (opts) => {
        const meta = await updatePricingMeta(opts.input.key, opts.input.value);
        return {
          ...meta,
          createdAt: meta.createdAt.toISOString(),
          updatedAt: meta.updatedAt.toISOString(),
        };
      }),
  },
});
