import { z } from "zod";
import { router, procedure, adminProcedure } from "../trpc";
import {
  createContactInquiry,
  getContactInquiries,
  getContactInquiryById,
  updateContactInquiry,
  deleteContactInquiry,
} from "$/db/contact/contact";
import {
  checkRateLimit,
  contactFormRateLimiter,
} from "#/lib/rateLimit/rateLimiter";
import { getRateLimitIdentifier } from "#/lib/rateLimit/rateLimiter";
import { TRPCError } from "@trpc/server";

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

      return await createContactInquiry(input);
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
