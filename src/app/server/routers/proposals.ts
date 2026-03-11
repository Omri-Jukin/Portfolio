import { z } from "zod";
import { router, procedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createProposal,
  getProposals,
  getProposalById,
  getProposalByShareToken,
  updateProposal,
  deleteProposal,
  duplicateProposal,
  generateShareToken,
  acceptProposal,
  declineProposal,
  getProposalSnapshot,
} from "$/db/proposals/proposals";
import {
  createProposalTemplate,
  getProposalTemplates,
  getProposalTemplateById,
  updateProposalTemplate,
  deleteProposalTemplate,
} from "$/db/proposals/proposalTemplates";
import {
  createTaxProfile,
  getTaxProfiles,
  getTaxProfileById,
  updateTaxProfile,
  deleteTaxProfile,
} from "$/db/proposals/taxProfiles";

// Zod schemas for validation
const proposalStatusSchema = z.enum([
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
]);

const priceDisplayModeSchema = z.enum(["hourly", "fixed", "both"]);

const createProposalSchema = z.object({
  title: z.string().min(1),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  status: proposalStatusSchema.optional(),
  currency: z.string().optional(),
  priceDisplayMode: priceDisplayModeSchema.optional(),
  content: z.unknown().optional(),
  charges: z.unknown().optional(),
  discounts: z.unknown().optional(),
  taxes: z.unknown().optional(),
  metadata: z.unknown().optional(),
  intakeId: z.string().uuid().optional().nullable(),
  templateId: z.string().uuid().optional().nullable(),
  validUntil: z.date().optional().nullable(),
});

const updateProposalSchema = createProposalSchema.partial().extend({
  id: z.string().uuid(),
});

const proposalFiltersSchema = z.object({
  status: proposalStatusSchema.optional(),
  search: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const proposalsRouter = router({
  // Get all proposals (admin only)
  list: adminProcedure
    .input(proposalFiltersSchema.optional())
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposals = await getProposals(opts.input || undefined);
        return proposals.map((proposal) => ({
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
          updatedAt: proposal.updatedAt.toISOString(),
          validUntil: proposal.validUntil?.toISOString() || null,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch proposals";
        const errorStack = error instanceof Error ? error.stack : undefined;

        // Log full error details for debugging
        console.error("[TRPC] Error on 'proposals.list':", {
          error: errorMessage,
          stack: errorStack,
          cause: error instanceof Error ? error.cause : undefined,
        });

        // Check if it's a table not found error
        if (
          errorMessage.includes("does not exist") ||
          errorMessage.includes("relation") ||
          errorMessage.includes("table")
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Proposals table not found. Please run database migrations: npm run db:push",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch proposals: ${errorMessage}`,
        });
      }
    }),

  // Get proposal by ID (admin only)
  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposal = await getProposalById(opts.input.id);
        return {
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
          updatedAt: proposal.updatedAt.toISOString(),
          validUntil: proposal.validUntil?.toISOString() || null,
          intake: proposal.intake
            ? {
                ...proposal.intake,
                createdAt: proposal.intake.createdAt.toISOString(),
                updatedAt: proposal.intake.updatedAt.toISOString(),
              }
            : null,
          template: proposal.template
            ? {
                ...proposal.template,
                createdAt: proposal.template.createdAt.toISOString(),
                updatedAt: proposal.template.updatedAt.toISOString(),
              }
            : null,
        };
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            error instanceof Error ? error.message : "Proposal not found",
        });
      }
    }),

  // Get proposal by share token (public)
  getByShareToken: procedure
    .input(z.object({ token: z.string().uuid() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposal = await getProposalByShareToken(opts.input.token);

        // Check if proposal is expired
        if (proposal.validUntil && proposal.validUntil < new Date()) {
          // Auto-update status to expired
          await updateProposal({
            id: proposal.id,
            status: "expired",
          });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This proposal has expired",
          });
        }

        // Only allow viewing sent proposals publicly
        if (proposal.status === "draft") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This proposal is not yet available",
          });
        }

        return {
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
          updatedAt: proposal.updatedAt.toISOString(),
          validUntil: proposal.validUntil?.toISOString() || null,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found or link is invalid",
        });
      }
    }),

  // Create proposal (admin only)
  create: adminProcedure.input(createProposalSchema).mutation(async (opts) => {
    const { db } = opts.ctx;
    if (!db) throw new Error("Database not available");

    try {
      const proposal = await createProposal(opts.input);
      return {
        ...proposal,
        createdAt: proposal.createdAt.toISOString(),
        updatedAt: proposal.updatedAt.toISOString(),
        validUntil: proposal.validUntil?.toISOString() || null,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to create proposal",
      });
    }
  }),

  // Update proposal (admin only)
  update: adminProcedure.input(updateProposalSchema).mutation(async (opts) => {
    const { db } = opts.ctx;
    if (!db) throw new Error("Database not available");

    try {
      const proposal = await updateProposal(opts.input);
      return {
        ...proposal,
        createdAt: proposal.createdAt.toISOString(),
        updatedAt: proposal.updatedAt.toISOString(),
        validUntil: proposal.validUntil?.toISOString() || null,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to update proposal",
      });
    }
  }),

  // Delete proposal (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        await deleteProposal(opts.input.id);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete proposal",
        });
      }
    }),

  // Duplicate proposal (admin only)
  duplicate: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposal = await duplicateProposal(opts.input.id);
        return {
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
          updatedAt: proposal.updatedAt.toISOString(),
          validUntil: proposal.validUntil?.toISOString() || null,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to duplicate proposal",
        });
      }
    }),

  // Generate share token (admin only)
  generateShareToken: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const token = await generateShareToken(opts.input.id);
        return { token };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to generate share token",
        });
      }
    }),

  // Accept proposal (public)
  acceptProposal: procedure
    .input(
      z.object({
        token: z.string().uuid(),
        acceptedBy: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposal = await acceptProposal(
          opts.input.token,
          opts.input.acceptedBy
        );
        return {
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
          updatedAt: proposal.updatedAt.toISOString(),
          validUntil: proposal.validUntil?.toISOString() || null,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to accept proposal",
        });
      }
    }),

  // Decline proposal (public)
  declineProposal: procedure
    .input(
      z.object({
        token: z.string().uuid(),
        reason: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposal = await declineProposal(
          opts.input.token,
          opts.input.reason
        );
        return {
          ...proposal,
          createdAt: proposal.createdAt.toISOString(),
          updatedAt: proposal.updatedAt.toISOString(),
          validUntil: proposal.validUntil?.toISOString() || null,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to decline proposal",
        });
      }
    }),

  // Get proposal snapshot (admin only)
  getSnapshot: adminProcedure
    .input(z.object({ proposalId: z.string().uuid() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const snapshot = await getProposalSnapshot(opts.input.proposalId);
        if (!snapshot) {
          return null;
        }
        return {
          ...snapshot,
          createdAt: snapshot.createdAt.toISOString(),
          acceptedAt: snapshot.acceptedAt?.toISOString() || null,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to fetch snapshot",
        });
      }
    }),

  // Send proposal via email (admin only) - placeholder for now
  sendProposal: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        message: z.string().optional(),
        includePDF: z.boolean().optional().default(false),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const proposal = await getProposalById(opts.input.id);
        // TODO: Implement email sending
        // For now, just update status to "sent"
        const updated = await updateProposal({
          id: proposal.id,
          status: "sent",
        });
        return {
          ...updated,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
          validUntil: updated.validUntil?.toISOString() || null,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to send proposal",
        });
      }
    }),

  // Export PDF (admin or public via token)
  exportPDF: procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        token: z.string().uuid().optional(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        let proposal;
        if (opts.input.id) {
          proposal = await getProposalById(opts.input.id);
        } else if (opts.input.token) {
          proposal = await getProposalByShareToken(opts.input.token);
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either id or token must be provided",
          });
        }

        // TODO: Implement PDF generation
        // For now, return proposal data
        return {
          proposal: {
            ...proposal,
            createdAt: proposal.createdAt.toISOString(),
            updatedAt: proposal.updatedAt.toISOString(),
            validUntil: proposal.validUntil?.toISOString() || null,
          },
          pdfUrl: null, // Placeholder
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to export PDF",
        });
      }
    }),

  // Templates sub-router
  templates: router({
    list: adminProcedure.query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const templates = await getProposalTemplates();
        return templates.map((template) => ({
          ...template,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        }));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch templates",
        });
      }
    }),

    getById: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          const template = await getProposalTemplateById(opts.input.id);
          return {
            ...template,
            createdAt: template.createdAt.toISOString(),
            updatedAt: template.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              error instanceof Error ? error.message : "Template not found",
          });
        }
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional().nullable(),
          content: z.unknown(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          const template = await createProposalTemplate({
            ...opts.input,
            content: opts.input.content || {},
          });
          return {
            ...template,
            createdAt: template.createdAt.toISOString(),
            updatedAt: template.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to create template",
          });
        }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          name: z.string().min(1).optional(),
          description: z.string().optional().nullable(),
          content: z.unknown().optional(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          const template = await updateProposalTemplate(opts.input);
          return {
            ...template,
            createdAt: template.createdAt.toISOString(),
            updatedAt: template.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to update template",
          });
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          await deleteProposalTemplate(opts.input.id);
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to delete template",
          });
        }
      }),
  }),

  // Tax profiles sub-router
  taxProfiles: router({
    list: adminProcedure.query(async (opts) => {
      const { db } = opts.ctx;
      if (!db) throw new Error("Database not available");

      try {
        const profiles = await getTaxProfiles();
        return profiles.map((profile) => ({
          ...profile,
          createdAt: profile.createdAt.toISOString(),
          updatedAt: profile.updatedAt.toISOString(),
        }));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch tax profiles",
        });
      }
    }),

    getById: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          const profile = await getTaxProfileById(opts.input.id);
          return {
            ...profile,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              error instanceof Error ? error.message : "Tax profile not found",
          });
        }
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional().nullable(),
          taxLines: z.unknown(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          const profile = await createTaxProfile({
            ...opts.input,
            taxLines: opts.input.taxLines || [],
          });
          return {
            ...profile,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to create tax profile",
          });
        }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          name: z.string().min(1).optional(),
          description: z.string().optional().nullable(),
          taxLines: z.unknown().optional(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          const profile = await updateTaxProfile(opts.input);
          return {
            ...profile,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to update tax profile",
          });
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async (opts) => {
        const { db } = opts.ctx;
        if (!db) throw new Error("Database not available");

        try {
          await deleteTaxProfile(opts.input.id);
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to delete tax profile",
          });
        }
      }),
  }),
});
