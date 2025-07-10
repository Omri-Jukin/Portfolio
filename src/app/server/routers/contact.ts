import { z } from "zod";
import { router, procedure } from "../trpc";
import {
  createContactInquiry,
  getContactInquiries,
  getContactInquiryById,
  updateContactInquiry,
  deleteContactInquiry,
} from "../../../../lib/db/contact/contact";

export const contactRouter = router({
  // Submit contact form (public)
  submit: procedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      subject: z.string().min(1),
      message: z.string().min(1),
    }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      
      return await createContactInquiry(input);
    }),

  // Admin routes (require authentication)
  getAll: procedure
    .input(z.object({
      status: z.enum(["open", "closed"]).optional(),
    }).optional())
    .query(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      return await getContactInquiries(input?.status);
    }),

  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      return await getContactInquiryById(input.id);
    }),

  updateStatus: procedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["open", "closed"]),
    }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      return await updateContactInquiry(input);
    }),

  delete: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      return await deleteContactInquiry(input.id);
    }),
});
