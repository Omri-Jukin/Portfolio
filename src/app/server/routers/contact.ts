import { z } from "zod";
import { router, procedure, adminProcedure } from "../trpc";
import {
  createContactInquiry,
  getContactInquiries,
  getContactInquiryById,
  updateContactInquiry,
  deleteContactInquiry,
} from "$/db/contact/contact";
import { EmailManager } from "#/backend/email/EmailManager";
import {
  checkRateLimit,
  contactFormRateLimiter,
} from "#/lib/rateLimit/rateLimiter";
import { getRateLimitIdentifier } from "#/lib/rateLimit/rateLimiter";
import { TRPCError } from "@trpc/server";

let emailManager: EmailManager | null = null;

const getEmailManager = () => {
  if (!emailManager) {
    emailManager = new EmailManager();
  }

  return emailManager;
};

export const contactRouter = router({
  // Submit contact form (public)
  submit: procedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { db, req } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      // Rate limiting: Use email as identifier (more stable than IP)
      const identifier = getRateLimitIdentifier(req, input.email);

      try {
        checkRateLimit(contactFormRateLimiter, identifier);
      } catch (error) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message:
            error instanceof Error
              ? error.message
              : "Rate limit exceeded. Please try again later.",
        });
      }

      const inquiry = await createContactInquiry(input);
      const emailData = {
        ...input,
        phone: "Not provided",
      };

      const [adminNotification, userConfirmation] = await Promise.allSettled([
        getEmailManager().sendContactFormNotification(emailData),
        getEmailManager().sendContactFormConfirmation(emailData),
      ]);
      const emailFailures: string[] = [];

      if (
        adminNotification.status === "rejected" ||
        !adminNotification.value.success
      ) {
        const error =
          adminNotification.status === "rejected"
            ? adminNotification.reason
            : adminNotification.value.error;

        emailFailures.push("admin notification");
        console.error(
          "Contact inquiry saved but admin email delivery failed:",
          error
        );
      }

      if (
        userConfirmation.status === "rejected" ||
        !userConfirmation.value.success
      ) {
        const error =
          userConfirmation.status === "rejected"
            ? userConfirmation.reason
            : userConfirmation.value.error;

        emailFailures.push("visitor confirmation");
        console.error(
          "Contact inquiry saved but confirmation email delivery failed:",
          error
        );
      }

      if (emailFailures.length > 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Your message was saved, but email delivery failed. Please try again or email me directly.",
        });
      }

      return inquiry;
    }),

  // Admin routes (require admin role)
  getAll: adminProcedure
    .input(
      z
        .object({
          status: z.enum(["open", "closed"]).optional(),
        })
        .optional()
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await getContactInquiries(input?.status);
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await getContactInquiryById(input.id);
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["open", "closed"]),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await updateContactInquiry(input);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      return await deleteContactInquiry(input.id);
    }),
});
