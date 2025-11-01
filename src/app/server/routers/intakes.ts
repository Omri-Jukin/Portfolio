import { z } from "zod";
import { router, procedure, protectedProcedure } from "../trpc";
import {
  createIntake,
  getIntakes,
  getIntakeById,
} from "../../../../lib/db/intakes/intakes";
import { intakeFormSchema } from "#/lib/schemas";
import { renderProposal } from "#/lib/proposal/renderProposal";
import { sendIntakeEmails, sendCustomLinkEmail } from "#/lib/email/sendEmail";
import { generateCustomIntakeLinkToken } from "#/lib/utils/sessionToken";
import {
  createCustomLink,
  generateSlugFromName,
  getAllCustomLinks,
} from "$/db/intakes/customLinks";

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
      const { getCustomLinkBySlug } = await import(
        "../../../../lib/db/intakes/customLinks"
      );
      while (await getCustomLinkBySlug(slug)) {
        slug = `${baseSlug}-${slugSuffix}`;
        slugSuffix++;
      }

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      // Save to database
      await createCustomLink({
        slug,
        email: input.email,
        token,
        firstName: input.firstName,
        lastName: input.lastName,
        organizationName: input.organizationName,
        organizationWebsite: input.organizationWebsite || undefined,
        expiresAt,
      });

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
});
