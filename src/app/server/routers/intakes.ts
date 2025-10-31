import { z } from "zod";
import { router, procedure, protectedProcedure } from "../trpc";
import {
  createIntake,
  getIntakes,
  getIntakeById,
} from "../../../../lib/db/intakes/intakes";
import { intakeFormSchema } from "#/lib/schemas";
import { renderProposal } from "#/lib/proposal/renderProposal";
import { sendIntakeEmails } from "#/lib/email/sendEmail";
import { generateCustomIntakeLinkToken } from "#/lib/utils/sessionToken";

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

      return {
        id: intake.id,
        email: intake.email,
        name,
        createdAt: intake.createdAt,
      };
    });
  }),

  // Get intake by ID (admin protected)
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
      return {
        id: intake.id,
        email: intake.email,
        data: intake.data,
        proposalMd: intake.proposalMd,
        createdAt: intake.createdAt,
        updatedAt: intake.updatedAt,
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
      const { user } = opts.ctx;
      const { input } = opts;
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const token = await generateCustomIntakeLinkToken(input.email, {
        firstName: input.firstName,
        lastName: input.lastName,
        organizationName: input.organizationName,
        organizationWebsite: input.organizationWebsite || undefined,
        expiresInHours: input.expiresInDays * 24,
      });

      // Build the full URL - prefer env var, fallback to request origin
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (opts.ctx.origin as string | undefined) ||
        (process.env.NODE_ENV === "production"
          ? "https://omrijukin.com"
          : "http://localhost:3000");
      const link = `${baseUrl}/${
        input.locale
      }/intake?token=${encodeURIComponent(token)}`;

      return {
        link,
        token,
        expiresInDays: input.expiresInDays,
      };
    }),
});
