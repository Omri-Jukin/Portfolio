import { z } from "zod";
import { router, procedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createIntake,
  getIntakes,
  getIntakeById,
  updateIntakeStatus,
  toggleIntakeFlag,
  addIntakeNote,
  deleteIntakeNote,
  getIntakeNotes,
  setIntakeReminder,
  updateIntakeEstimatedValue,
  getIntakeStatusHistory,
  searchIntakes,
  checkReturningClient,
  getIntakeStatistics,
} from "../../../../lib/db/intakes/intakes";
import type {
  IntakeStatus,
  IntakeRiskLevel,
  IntakeNoteCategory,
} from "$/db/schema/schema.types";
import { intakeFormSchema } from "#/lib/schemas";
import { renderProposal } from "#/lib/proposal/renderProposal";
import { sendIntakeEmails, sendCustomLinkEmail } from "#/lib/email/sendEmail";
import { generateCustomIntakeLinkToken } from "#/lib/utils/sessionToken";
import {
  createCustomLink,
  generateSlugFromName,
  getAllCustomLinks,
  deleteCustomLink,
  deleteCustomLinks,
} from "$/db/intakes/customLinks";
import { getCustomLinkBySlug } from "$/db/intakes/customLinks";
import { getIntakesWithReminders } from "$/db/intakes/reminders";

export const intakesRouter = router({
  // Submit intake form (public)
  submit: procedure.input(intakeFormSchema).mutation(async (opts) => {
    const { db } = opts.ctx;
    const { input } = opts;
    if (!db) throw new Error("Database not available");

    try {
      // Generate proposal markdown
      const proposalMd = renderProposal(input);

      // Save to database
      const intake = await createIntake({
        email: input.contact.email,
        data: input as unknown as Record<string, unknown>,
        proposalMd,
      });

      // Send emails (client + admin)
      const emailResult = await sendIntakeEmails(input, proposalMd);
      if (!emailResult.success) {
        console.error("Failed to send intake emails:", emailResult.error);
        // Don't fail the request if email fails, but log it
      }

      return {
        id: intake.id,
        proposalMarkdown: proposalMd,
        status: "ok",
      };
    } catch (error) {
      console.error("Error creating intake:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create intake"
      );
    }
  }),

  // Get all intakes (admin protected)
  getAll: procedure.query(async (opts) => {
    const { db, user } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const intakes = await getIntakes();
    return intakes.map((intake) => {
      const data = intake.data as Record<string, unknown>;
      const orgName =
        data.org && typeof data.org === "object" && "name" in data.org
          ? String(data.org.name)
          : undefined;
      const contact =
        data.contact && typeof data.contact === "object"
          ? (data.contact as Record<string, unknown>)
          : undefined;
      const fullName =
        contact && "fullName" in contact ? String(contact.fullName) : undefined;
      const firstName =
        contact && "firstName" in contact ? String(contact.firstName) : "";
      const lastName =
        contact && "lastName" in contact ? String(contact.lastName) : "";
      const name =
        orgName ?? fullName ?? (`${firstName} ${lastName}`.trim() || "Unknown");

      const additional = data.additional as Record<string, unknown> | undefined;
      const urgency =
        additional && "urgency" in additional
          ? String(additional.urgency)
          : undefined;

      return {
        id: intake.id,
        email: intake.email,
        name,
        status: intake.status,
        flagged: intake.flagged,
        urgency,
        reminderDate: intake.reminderDate,
        estimatedValue: intake.estimatedValue,
        riskLevel: intake.riskLevel,
        lastReviewedAt: intake.lastReviewedAt,
        createdAt: intake.createdAt,
      };
    });
  }),

  // Get intake by ID (admin protected) - Enhanced with notes and history
  getById: procedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const intake = await getIntakeById(input.id);
      const notes = await getIntakeNotes(input.id);
      const statusHistory = await getIntakeStatusHistory(input.id);

      return {
        id: intake.id,
        email: intake.email,
        data: intake.data,
        proposalMd: intake.proposalMd,
        status: intake.status,
        flagged: intake.flagged,
        lastReviewedAt: intake.lastReviewedAt,
        reminderDate: intake.reminderDate,
        estimatedValue: intake.estimatedValue,
        riskLevel: intake.riskLevel,
        createdAt: intake.createdAt,
        updatedAt: intake.updatedAt,
        notes,
        statusHistory,
      };
    }),

  // Generate custom intake link (admin protected)
  generateCustomLink: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        organizationName: z.string().optional(),
        organizationWebsite: z.string().url().optional().or(z.literal("")),
        expiresInDays: z.number().min(1).max(90).default(30),
        locale: z.enum(["en", "es", "fr", "he"]).default("en"),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      if (!db) {
        throw new Error("Database not available");
      }

      // Generate token
      const expiresInHours = input.expiresInDays * 24;
      const token = await generateCustomIntakeLinkToken(input.email, {
        firstName: input.firstName,
        lastName: input.lastName,
        organizationName: input.organizationName,
        organizationWebsite: input.organizationWebsite || undefined,
        expiresInHours,
      });

      // Generate slug from name
      const baseSlug = generateSlugFromName(input.firstName, input.lastName);
      let slug = baseSlug;
      let slugSuffix = 1;

      // Ensure unique slug by checking database
      while (await getCustomLinkBySlug(slug)) {
        slug = `${baseSlug}-${slugSuffix}`;
        slugSuffix++;
      }

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      // Save to database
      const createdLink = await createCustomLink({
        slug,
        email: input.email,
        token,
        firstName: input.firstName,
        lastName: input.lastName,
        organizationName: input.organizationName,
        organizationWebsite: input.organizationWebsite || undefined,
        expiresAt,
      });

      // Verify the link was created by querying it back
      const verificationLink = await getCustomLinkBySlug(createdLink.slug);
      if (!verificationLink) {
        throw new Error(
          `Failed to verify custom link creation - link not found after creation`
        );
      }

      // Build the full URL with slug-based path
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (opts.ctx.origin as string | undefined) ||
        (process.env.NODE_ENV === "production"
          ? "https://omrijukin.com"
          : "http://localhost:3000");
      const link = `${baseUrl}/${input.locale}/intake/${slug}`;

      // Send email to client with the custom link
      const emailResult = await sendCustomLinkEmail(
        input.email,
        link,
        input.expiresInDays,
        input.firstName,
        input.lastName,
        input.organizationName
      );

      if (!emailResult.success) {
        console.error("Failed to send custom link email:", emailResult.error);
        // Don't fail the mutation if email fails, but log it
        // The link is still generated and saved to database
      }

      return {
        link,
        token,
        slug,
        expiresInDays: input.expiresInDays,
        emailSent: emailResult.success,
        emailError: emailResult.error || undefined, // Include error message for UI
      };
    }),

  // Get all custom links (admin protected)
  getAllCustomLinks: protectedProcedure.query(async (opts) => {
    const { user, db } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const links = await getAllCustomLinks();
    return links.map((link) => ({
      id: link.id,
      slug: link.slug,
      email: link.email,
      firstName: link.firstName,
      lastName: link.lastName,
      organizationName: link.organizationName,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
      isExpired: link.expiresAt < new Date(),
    }));
  }),

  // Delete a single custom link (admin protected)
  deleteCustomLink: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection unavailable. Please try again later.",
        });
      }

      if (!user || user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized. Admin access required.",
        });
      }

      try {
        const deleted = await deleteCustomLink(input.id);
        if (!deleted) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Custom link not found",
          });
        }

        return { success: true };
      } catch (error) {
        // Re-throw TRPCError as-is
        if (error instanceof TRPCError) {
          throw error;
        }
        // Wrap other errors in TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete custom link",
        });
      }
    }),

  // Delete multiple custom links (admin protected)
  deleteCustomLinks: protectedProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection unavailable. Please try again later.",
        });
      }

      if (!user || user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized. Admin access required.",
        });
      }

      if (input.ids.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No IDs provided",
        });
      }

      try {
        const deletedCount = await deleteCustomLinks(input.ids);
        return { success: true, deletedCount };
      } catch (error) {
        // Re-throw TRPCError as-is
        if (error instanceof TRPCError) {
          throw error;
        }
        // Wrap other errors in TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete custom links",
        });
      }
    }),

  // Update intake status (admin protected)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum([
          "new",
          "reviewing",
          "contacted",
          "proposal_sent",
          "accepted",
          "declined",
        ]),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const updated = await updateIntakeStatus(
          input.id,
          input.status as IntakeStatus,
          user.id
        );
        return { success: true, intake: updated };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to update status",
        });
      }
    }),

  // Toggle flagged status (admin protected)
  toggleFlag: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const updated = await toggleIntakeFlag(input.id);
        return { success: true, flagged: updated.flagged };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to toggle flag",
        });
      }
    }),

  // Add internal note (admin protected)
  addNote: protectedProcedure
    .input(
      z.object({
        intakeId: z.string().uuid(),
        note: z.string().min(1),
        category: z.enum([
          "follow-up",
          "waiting-on-client",
          "budget-concerns",
          "technical-notes",
          "general",
        ]),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const note = await addIntakeNote(
          input.intakeId,
          input.note,
          input.category as IntakeNoteCategory,
          user.id
        );
        return { success: true, note };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to add note",
        });
      }
    }),

  // Delete internal note (admin protected)
  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.string().uuid() }))
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const deleted = await deleteIntakeNote(input.noteId);
        if (!deleted) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
        }
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to delete note",
        });
      }
    }),

  // Set reminder (admin protected)
  setReminder: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reminderDate: z
          .union([z.string(), z.date(), z.null()])
          .transform((val) => {
            if (val === null || val === undefined) return null;
            if (val instanceof Date) return val;
            if (typeof val === "string") {
              const date = new Date(val);
              if (isNaN(date.getTime())) {
                throw new Error("Invalid date string");
              }
              return date;
            }
            return null;
          })
          .nullable(),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const updated = await setIntakeReminder(input.id, input.reminderDate);
        return { success: true, reminderDate: updated.reminderDate };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to set reminder",
        });
      }
    }),

  // Update estimated value (admin protected)
  updateEstimatedValue: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        estimatedValue: z.number().nullable(),
        riskLevel: z.enum(["low", "medium", "high"]).nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const updated = await updateIntakeEstimatedValue(
          input.id,
          input.estimatedValue,
          input.riskLevel as IntakeRiskLevel | undefined
        );
        return {
          success: true,
          estimatedValue: updated.estimatedValue,
          riskLevel: updated.riskLevel,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update estimated value",
        });
      }
    }),

  // Search intakes (admin protected)
  search: protectedProcedure
    .input(
      z.object({
        searchTerm: z.string().optional(),
        status: z
          .array(
            z.enum([
              "new",
              "reviewing",
              "contacted",
              "proposal_sent",
              "accepted",
              "declined",
            ])
          )
          .optional(),
        flagged: z.boolean().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const results = await searchIntakes({
          searchTerm: input.searchTerm,
          status: input.status as IntakeStatus[] | undefined,
          flagged: input.flagged,
          startDate: input.startDate,
          endDate: input.endDate,
        });

        return results.map((intake) => {
          const data = intake.data as Record<string, unknown>;
          const orgName =
            data.org && typeof data.org === "object" && "name" in data.org
              ? String(data.org.name)
              : undefined;
          const contact =
            data.contact && typeof data.contact === "object"
              ? (data.contact as Record<string, unknown>)
              : undefined;
          const fullName =
            contact && "fullName" in contact
              ? String(contact.fullName)
              : undefined;
          const firstName =
            contact && "firstName" in contact ? String(contact.firstName) : "";
          const lastName =
            contact && "lastName" in contact ? String(contact.lastName) : "";
          const name =
            orgName ??
            fullName ??
            (`${firstName} ${lastName}`.trim() || "Unknown");

          const additional = data.additional as
            | Record<string, unknown>
            | undefined;
          const urgency =
            additional && "urgency" in additional
              ? String(additional.urgency)
              : undefined;

          return {
            id: intake.id,
            email: intake.email,
            name,
            status: intake.status,
            flagged: intake.flagged,
            urgency,
            reminderDate: intake.reminderDate,
            estimatedValue: intake.estimatedValue,
            riskLevel: intake.riskLevel,
            lastReviewedAt: intake.lastReviewedAt,
            createdAt: intake.createdAt,
          };
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to search intakes",
        });
      }
    }),

  // Check returning client (admin protected)
  checkReturningClient: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const result = await checkReturningClient(input.email);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to check returning client",
        });
      }
    }),

  // Get intake statistics (admin protected)
  getStatistics: protectedProcedure.query(async (opts) => {
    const { user, db } = opts.ctx;

    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    if (!user || user.role !== "admin")
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

    try {
      const stats = await getIntakeStatistics();
      return stats;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to get statistics",
      });
    }
  }),

  // Get intakes with reminders (admin protected)
  getReminders: protectedProcedure
    .input(
      z
        .object({
          filter: z.enum(["upcoming", "due", "past", "all"]).optional(),
        })
        .optional()
    )
    .query(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const reminders = await getIntakesWithReminders(input?.filter);
        return reminders.map((r) => ({
          ...r,
          reminderDate: r.reminderDate.toISOString(),
          data: r.data,
        }));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to get reminders",
        });
      }
    }),

  // Bulk set reminders (admin protected)
  bulkSetReminders: protectedProcedure
    .input(
      z.object({
        intakeIds: z.array(z.string().uuid()),
        reminderDate: z.union([z.string(), z.date()]).transform((val) => {
          if (val instanceof Date) return val;
          if (typeof val === "string") {
            const date = new Date(val);
            if (isNaN(date.getTime())) {
              throw new Error("Invalid date string");
            }
            return date;
          }
          throw new Error("Invalid date");
        }),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const results = await Promise.allSettled(
          input.intakeIds.map((id) => setIntakeReminder(id, input.reminderDate))
        );

        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;

        return {
          success: true,
          successful,
          failed,
          total: input.intakeIds.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to set bulk reminders",
        });
      }
    }),

  // Bulk clear reminders (admin protected)
  bulkClearReminders: protectedProcedure
    .input(
      z.object({
        intakeIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;

      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      if (!user || user.role !== "admin")
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      try {
        const results = await Promise.allSettled(
          input.intakeIds.map((id) => setIntakeReminder(id, null))
        );

        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;

        return {
          success: true,
          successful,
          failed,
          total: input.intakeIds.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to clear bulk reminders",
        });
      }
    }),
});
