import { z } from "zod";
import { router, procedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createProposal,
  getProposals,
  getProposalWithRelations,
  updateProposal,
  deleteProposal,
  getProposalByShareToken,
} from "$/db/proposals/proposals";
import {
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "$/db/proposals/sections";
import {
  createLineItem,
  updateLineItem,
  toggleLineItemSelection,
  deleteLineItem,
} from "$/db/proposals/lineItems";
import {
  addDiscount,
  updateDiscount,
  deleteDiscount,
} from "$/db/proposals/discounts";
import {
  addTax,
  updateTax,
  reorderTaxes,
  deleteTax,
  getTaxesByProposalId,
} from "$/db/proposals/taxes";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "$/db/proposals/templates";
import { logEvent } from "$/db/proposals/events";
import {
  createProposalSchema,
  updateProposalSchema,
  createProposalSectionSchema,
  updateProposalSectionSchema,
  createProposalLineItemSchema,
  updateProposalLineItemSchema,
  createProposalDiscountSchema,
  updateProposalDiscountSchema,
  createProposalTaxSchema,
  updateProposalTaxSchema,
  createProposalTemplateSchema,
  updateProposalTemplateSchema,
  proposalFiltersSchema,
  calculateProposalTotalsSchema,
  acceptProposalSchema,
  declineProposalSchema,
} from "#/lib/schemas";
import { calcProposalTotals } from "$/pricing/calcProposalTotals";
import { getPricingMeta } from "$/db/pricing/meta";
import type { ProposalTotalsInput } from "$/pricing/calcProposalTotals";
import { generateProposalPDF } from "$/utils/proposalPdfGenerator";
import { sendProposalEmail } from "$/email/sendProposalEmail";
import { generateShareToken } from "$/db/proposals/proposals";

export const proposalsRouter = router({
  // ============================================
  // Main Proposal CRUD
  // ============================================

  getAll: adminProcedure
    .input(proposalFiltersSchema.optional())
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const filters = opts.input;
      const proposals = await getProposals(filters);

      return proposals.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        validUntil: p.validUntil?.toISOString() ?? null,
      }));
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const proposalData = await getProposalWithRelations(opts.input.id);

      return {
        proposal: {
          ...proposalData.proposal,
          createdAt: proposalData.proposal.createdAt.toISOString(),
          updatedAt: proposalData.proposal.updatedAt.toISOString(),
          validUntil: proposalData.proposal.validUntil?.toISOString() ?? null,
        },
        sections: proposalData.sections,
        lineItems: proposalData.lineItems.map((li) => ({
          ...li,
          quantity: Number(li.quantity),
        })),
        discounts: proposalData.discounts.map((d) => ({
          ...d,
          amountMinor: d.amountMinor ?? null,
          percent: d.percent ? Number(d.percent) : null,
        })),
        taxes: proposalData.taxes.map((t) => ({
          ...t,
          rateOrAmount: Number(t.rateOrAmount),
        })),
        events: proposalData.events.map((e) => ({
          ...e,
          occurredAt: e.occurredAt.toISOString(),
        })),
      };
    }),

  create: adminProcedure.input(createProposalSchema).mutation(async (opts) => {
    const { db, user } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const proposal = await createProposal({
      ...opts.input,
      createdBy: user.id,
    });

    return {
      ...proposal,
      createdAt: proposal.createdAt.toISOString(),
      updatedAt: proposal.updatedAt.toISOString(),
      validUntil: proposal.validUntil?.toISOString() ?? null,
    };
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateProposalSchema,
      })
    )
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      if (!db) throw new Error("Database not available");
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const proposal = await updateProposal(
        opts.input.id,
        opts.input.data,
        user.id
      );

      return {
        ...proposal,
        createdAt: proposal.createdAt.toISOString(),
        updatedAt: proposal.updatedAt.toISOString(),
        validUntil: proposal.validUntil?.toISOString() ?? null,
      };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      await deleteProposal(opts.input.id);
      return { success: true };
    }),

  duplicate: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      if (!db) throw new Error("Database not available");
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const original = await getProposalWithRelations(opts.input.id);

      // Create new proposal
      const newProposal = await createProposal({
        clientUserId: original.proposal.clientUserId,
        intakeId: original.proposal.intakeId,
        templateId: original.proposal.templateId,
        clientName: `${original.proposal.clientName} (Copy)`,
        clientEmail: original.proposal.clientEmail,
        clientCompany: original.proposal.clientCompany,
        status: "draft",
        currency: original.proposal.currency,
        taxProfileKey: original.proposal.taxProfileKey,
        priceDisplay: original.proposal.priceDisplay,
        validUntil: null,
        notesInternal: original.proposal.notesInternal,
        notesClient: original.proposal.notesClient,
        createdBy: user.id,
      });

      // Copy sections
      const sectionMap = new Map<string, string>();
      for (const section of original.sections) {
        const newSection = await createSection({
          proposalId: newProposal.id,
          key: section.key,
          label: section.label,
          description: section.description,
          sortOrder: section.sortOrder,
          meta: (section.meta as Record<string, unknown>) || {},
        });
        sectionMap.set(section.id, newSection.id);
      }

      // Copy line items
      for (const item of original.lineItems) {
        await createLineItem({
          proposalId: newProposal.id,
          sectionId: item.sectionId
            ? sectionMap.get(item.sectionId) || null
            : null,
          featureKey: item.featureKey,
          label: item.label,
          description: item.description,
          quantity: Number(item.quantity),
          unitPriceMinor: item.unitPriceMinor,
          isOptional: item.isOptional,
          isSelected: item.isSelected,
          taxClass: item.taxClass,
          meta: (item.meta as Record<string, unknown>) || {},
        });
      }

      // Copy discounts
      for (const discount of original.discounts) {
        await addDiscount({
          proposalId: newProposal.id,
          scope: discount.scope,
          sectionId: discount.sectionId
            ? sectionMap.get(discount.sectionId) || null
            : null,
          lineItemId: discount.lineItemId,
          sourceDiscountId: discount.sourceDiscountId,
          label: discount.label,
          type: discount.type,
          amountMinor: discount.amountMinor,
          percent: discount.percent ? Number(discount.percent) : null,
          appliesMeta: (discount.appliesMeta as Record<string, unknown>) || {},
        });
      }

      // Copy taxes
      for (const tax of original.taxes) {
        await addTax({
          proposalId: newProposal.id,
          scope: tax.scope,
          sectionId: tax.sectionId
            ? sectionMap.get(tax.sectionId) || null
            : null,
          lineItemId: tax.lineItemId,
          label: tax.label,
          kind: tax.kind,
          type: tax.type,
          rateOrAmount: Number(tax.rateOrAmount),
          orderIndex: tax.orderIndex,
          meta: (tax.meta as Record<string, unknown>) || {},
        });
      }

      return {
        ...newProposal,
        createdAt: newProposal.createdAt.toISOString(),
        updatedAt: newProposal.updatedAt.toISOString(),
        validUntil: newProposal.validUntil?.toISOString() ?? null,
      };
    }),

  setStatus: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      if (!db) throw new Error("Database not available");
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const proposal = await updateProposal(
        opts.input.id,
        { status: opts.input.status },
        user.id
      );

      await logEvent({
        proposalId: opts.input.id,
        event: "status_changed",
        payload: { status: opts.input.status },
        actorId: user.id,
      });

      return {
        ...proposal,
        createdAt: proposal.createdAt.toISOString(),
        updatedAt: proposal.updatedAt.toISOString(),
        validUntil: proposal.validUntil?.toISOString() ?? null,
      };
    }),

  generateShareToken: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const token = await generateShareToken(opts.input.id);
      return { token };
    }),

  // ============================================
  // Public Procedures (Share Token Access)
  // ============================================

  getByShareToken: procedure
    .input(z.object({ token: z.string() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const proposal = await getProposalByShareToken(opts.input.token);
      const proposalData = await getProposalWithRelations(proposal.id);

      // Log view event
      await logEvent({
        proposalId: proposal.id,
        event: "viewed",
        payload: {},
        actorId: null,
      });

      return {
        proposal: {
          ...proposalData.proposal,
          createdAt: proposalData.proposal.createdAt.toISOString(),
          updatedAt: proposalData.proposal.updatedAt.toISOString(),
          validUntil: proposalData.proposal.validUntil?.toISOString() ?? null,
        },
        sections: proposalData.sections,
        lineItems: proposalData.lineItems.map((li) => ({
          ...li,
          quantity: Number(li.quantity),
        })),
        discounts: proposalData.discounts.map((d) => ({
          ...d,
          amountMinor: d.amountMinor ?? null,
          percent: d.percent ? Number(d.percent) : null,
        })),
        taxes: proposalData.taxes.map((t) => ({
          ...t,
          rateOrAmount: Number(t.rateOrAmount),
        })),
      };
    }),

  acceptProposal: procedure
    .input(acceptProposalSchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const proposal = await getProposalByShareToken(opts.input.shareToken);
      const proposalData = await getProposalWithRelations(proposal.id);

      // Calculate totals snapshot
      const pricingMeta = await getPricingMeta();
      const totalsInput: ProposalTotalsInput = {
        currency: proposal.currency,
        priceDisplay: proposal.priceDisplay,
        taxProfileKey: proposal.taxProfileKey,
        sections: proposalData.sections.map((s) => ({
          id: s.id,
          sortOrder: s.sortOrder,
        })),
        lineItems: proposalData.lineItems.map((li) => ({
          id: li.id,
          sectionId: li.sectionId,
          label: li.label,
          quantity: Number(li.quantity),
          unitPriceMinor: li.unitPriceMinor,
          isOptional: li.isOptional,
          isSelected: li.isSelected,
          taxClass: li.taxClass,
        })),
        discounts: proposalData.discounts.map((d) => ({
          id: d.id,
          scope: d.scope,
          sectionId: d.sectionId,
          lineItemId: d.lineItemId,
          type: d.type,
          amountMinor: d.amountMinor ?? undefined,
          percent: d.percent ? Number(d.percent) : undefined,
          label: d.label,
        })),
        taxes: proposalData.taxes.map((t) => ({
          id: t.id,
          scope: t.scope,
          sectionId: t.sectionId,
          lineItemId: t.lineItemId,
          kind: t.kind,
          type: t.type,
          rateOrAmount: Number(t.rateOrAmount),
          orderIndex: t.orderIndex,
          label: t.label,
        })),
        pricingMeta,
      };

      const totals = calcProposalTotals(totalsInput);

      // Update proposal with snapshot and status
      const updated = await updateProposal(proposal.id, {
        status: "accepted",
        pricingSnapshot: totals,
      });

      // Log acceptance event
      await logEvent({
        proposalId: proposal.id,
        event: "accepted",
        payload: {
          acceptedAt:
            opts.input.acceptedAt?.toISOString() || new Date().toISOString(),
          totals,
        },
        actorId: null,
      });

      return {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        validUntil: updated.validUntil?.toISOString() ?? null,
      };
    }),

  declineProposal: procedure
    .input(declineProposalSchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const proposal = await getProposalByShareToken(opts.input.shareToken);

      const updated = await updateProposal(proposal.id, {
        status: "declined",
      });

      await logEvent({
        proposalId: proposal.id,
        event: "declined",
        payload: { reason: opts.input.reason || null },
        actorId: null,
      });

      return {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        validUntil: updated.validUntil?.toISOString() ?? null,
      };
    }),

  // ============================================
  // Tax & Price Display
  // ============================================

  applyTaxes: adminProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        taxProfileKey: z.string().optional().nullable(),
        taxes: z
          .array(
            z.object({
              scope: z.enum(["overall", "section", "line"]),
              sectionId: z.string().uuid().optional().nullable(),
              lineItemId: z.string().uuid().optional().nullable(),
              label: z.string(),
              kind: z.enum(["vat", "surcharge", "withholding"]),
              type: z.enum(["percent", "fixed"]),
              rateOrAmount: z.number(),
              orderIndex: z.number().int().min(0),
            })
          )
          .optional(),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      // Update tax profile key if provided
      if (opts.input.taxProfileKey !== undefined) {
        await updateProposal(opts.input.proposalId, {
          taxProfileKey: opts.input.taxProfileKey,
        });
      }

      // If explicit taxes provided, replace existing
      if (opts.input.taxes) {
        // Delete existing taxes
        const existing = await getTaxesByProposalId(opts.input.proposalId);
        for (const tax of existing) {
          await deleteTax(tax.id);
        }

        // Add new taxes
        for (const tax of opts.input.taxes) {
          await addTax({
            proposalId: opts.input.proposalId,
            ...tax,
          });
        }
      }

      return { success: true };
    }),

  setPriceDisplay: adminProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        priceDisplay: z.enum(["taxExclusive", "taxInclusive"]),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      await updateProposal(opts.input.proposalId, {
        priceDisplay: opts.input.priceDisplay,
      });

      return { success: true };
    }),

  calculateTotals: adminProcedure
    .input(calculateProposalTotalsSchema)
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const proposalData = await getProposalWithRelations(
        opts.input.proposalId
      );
      const pricingMeta = await getPricingMeta();

      const totalsInput: ProposalTotalsInput = {
        currency: proposalData.proposal.currency,
        priceDisplay: proposalData.proposal.priceDisplay,
        taxProfileKey: proposalData.proposal.taxProfileKey,
        sections: proposalData.sections.map((s) => ({
          id: s.id,
          sortOrder: s.sortOrder,
        })),
        lineItems: proposalData.lineItems.map((li) => ({
          id: li.id,
          sectionId: li.sectionId,
          label: li.label,
          quantity: Number(li.quantity),
          unitPriceMinor: li.unitPriceMinor,
          isOptional: li.isOptional,
          isSelected: li.isSelected,
          taxClass: li.taxClass,
        })),
        discounts: proposalData.discounts.map((d) => ({
          id: d.id,
          scope: d.scope,
          sectionId: d.sectionId,
          lineItemId: d.lineItemId,
          type: d.type,
          amountMinor: d.amountMinor ?? undefined,
          percent: d.percent ? Number(d.percent) : undefined,
          label: d.label,
        })),
        taxes: proposalData.taxes.map((t) => ({
          id: t.id,
          scope: t.scope,
          sectionId: t.sectionId,
          lineItemId: t.lineItemId,
          kind: t.kind,
          type: t.type,
          rateOrAmount: Number(t.rateOrAmount),
          orderIndex: t.orderIndex,
          label: t.label,
        })),
        pricingMeta,
      };

      return calcProposalTotals(totalsInput);
    }),

  // ============================================
  // Sections
  // ============================================

  sections: router({
    create: adminProcedure
      .input(createProposalSectionSchema)
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await createSection(opts.input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: updateProposalSectionSchema,
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await updateSection(opts.input.id, opts.input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        await deleteSection(opts.input.id);
        return { success: true };
      }),

    reorder: adminProcedure
      .input(
        z.object({
          proposalId: z.string().uuid(),
          sectionOrders: z.array(
            z.object({
              id: z.string().uuid(),
              sortOrder: z.number().int().min(0),
            })
          ),
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await reorderSections(
          opts.input.proposalId,
          opts.input.sectionOrders
        );
      }),
  }),

  // ============================================
  // Line Items
  // ============================================

  lineItems: router({
    create: adminProcedure
      .input(createProposalLineItemSchema)
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await createLineItem(opts.input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: updateProposalLineItemSchema,
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await updateLineItem(opts.input.id, {
          ...opts.input.data,
          quantity: opts.input.data.quantity?.toString() ?? undefined,
        });
      }),

    toggleSelection: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await toggleLineItemSelection(opts.input.id);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        await deleteLineItem(opts.input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // Discounts
  // ============================================

  discounts: router({
    add: adminProcedure
      .input(createProposalDiscountSchema)
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await addDiscount(opts.input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: updateProposalDiscountSchema,
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await updateDiscount(opts.input.id, {
          ...opts.input.data,
          percent: opts.input.data.percent?.toString() ?? undefined,
        });
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        await deleteDiscount(opts.input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // Taxes
  // ============================================

  taxes: router({
    add: adminProcedure
      .input(createProposalTaxSchema)
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await addTax(opts.input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: updateProposalTaxSchema,
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await updateTax(opts.input.id, {
          ...opts.input.data,
          rateOrAmount: (opts.input.data.rateOrAmount ?? 0).toString(),
        });
      }),

    reorder: adminProcedure
      .input(
        z.object({
          proposalId: z.string().uuid(),
          taxOrders: z.array(
            z.object({
              id: z.string().uuid(),
              orderIndex: z.number().int().min(0),
            })
          ),
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        return await reorderTaxes(opts.input.proposalId, opts.input.taxOrders);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        await deleteTax(opts.input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // Templates
  // ============================================

  templates: router({
    getAll: adminProcedure.query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      const templates = await getTemplates();
      return templates.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      }));
    }),

    getById: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        const template = await getTemplateById(opts.input.id);
        return {
          ...template,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        };
      }),

    create: adminProcedure
      .input(createProposalTemplateSchema)
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        const template = await createTemplate(opts.input);
        return {
          ...template,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: updateProposalTemplateSchema,
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        const template = await updateTemplate(opts.input.id, opts.input.data);
        return {
          ...template,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        await deleteTemplate(opts.input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // PDF Export
  // ============================================

  exportPDF: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        includeInternalNotes: z.boolean().optional().default(false),
        includeClientNotes: z.boolean().optional().default(true),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      // Use getById to get transformed data with correct types
      const proposalData = await getProposalWithRelations(opts.input.id);

      // Transform the data to match the PDF generator's expected format
      const pdfData: Parameters<typeof generateProposalPDF>[0] = {
        proposal: {
          ...proposalData.proposal,
          createdAt: proposalData.proposal.createdAt.toISOString(),
          updatedAt: proposalData.proposal.updatedAt.toISOString(),
          validUntil: proposalData.proposal.validUntil?.toISOString() ?? null,
        },
        sections: proposalData.sections,
        lineItems: proposalData.lineItems.map((li) => ({
          ...li,
          quantity: Number(li.quantity),
        })),
        discounts: proposalData.discounts.map((d) => ({
          ...d,
          amountMinor: d.amountMinor ?? null,
          percent: d.percent ? Number(d.percent) : null,
        })),
        taxes: proposalData.taxes.map((t) => ({
          ...t,
          rateOrAmount: Number(t.rateOrAmount),
        })),
        events: proposalData.events
          ? proposalData.events.map((e) => ({
              ...e,
              occurredAt: e.occurredAt.toISOString(),
            }))
          : [],
      };

      const pdf = generateProposalPDF(pdfData, {
        includeInternalNotes: opts.input.includeInternalNotes,
        includeClientNotes: opts.input.includeClientNotes,
      });

      const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
      const base64 = pdfBuffer.toString("base64");

      return {
        pdf: base64,
        filename: `Proposal-${proposalData.proposal.clientName}-${
          new Date().toISOString().split("T")[0]
        }.pdf`,
      };
    }),

  // ============================================
  // Send Proposal
  // ============================================

  sendProposal: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        recipientEmail: z.string().email().optional(),
        includePDF: z.boolean().optional().default(true),
        generateShareToken: z.boolean().optional().default(true),
      })
    )
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      if (!db) throw new Error("Database not available");
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const proposalData = await getProposalWithRelations(opts.input.id);

      // Generate share token if requested and not already exists
      let shareToken = proposalData.proposal.shareToken;
      if (opts.input.generateShareToken && !shareToken) {
        shareToken = await generateShareToken(opts.input.id);
        // Refetch to get updated proposal with token
        const updated = await getProposalWithRelations(opts.input.id);
        proposalData.proposal = updated.proposal;
        proposalData.proposal.shareToken = shareToken;
      }

      // Send email - ensure proposalData has events and convert dates
      const emailProposalData = {
        proposal: {
          ...proposalData.proposal,
          createdAt: proposalData.proposal.createdAt.toISOString(),
          updatedAt: proposalData.proposal.updatedAt.toISOString(),
          validUntil: proposalData.proposal.validUntil?.toISOString() ?? null,
        },
        sections: proposalData.sections,
        lineItems: proposalData.lineItems,
        discounts: proposalData.discounts,
        taxes: proposalData.taxes,
        events: proposalData.events || [],
      };
      const emailResult = await sendProposalEmail({
        proposalData: emailProposalData as unknown as Parameters<
          typeof sendProposalEmail
        >[0]["proposalData"],
        shareToken: shareToken || undefined,
        includePDF: opts.input.includePDF,
        recipientEmail: opts.input.recipientEmail,
      });

      if (!emailResult.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: emailResult.error || "Failed to send proposal email",
        });
      }

      // Update proposal status to "sent"
      await updateProposal(opts.input.id, { status: "sent" }, user.id);

      // Log event
      await logEvent({
        proposalId: opts.input.id,
        event: "sent",
        payload: {
          recipientEmail:
            opts.input.recipientEmail || proposalData.proposal.clientEmail,
          includePDF: opts.input.includePDF,
          emailId: emailResult.emailId,
        },
        actorId: user.id,
      });

      return {
        success: true,
        emailId: emailResult.emailId,
        shareToken: shareToken || null,
      };
    }),
});
