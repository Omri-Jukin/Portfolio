import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, procedure, editorProcedure } from "../trpc";

const publicProcedure = procedure;
import { CertificationsService } from "$/db/certifications/certifications";
import { Certification } from "$/db/schema/schema.types";

export const certifications: Certification[] = [
  {
    id: "cert-impact-cyber-diploma",
    name: "Cyber Security Diploma – Offensive & Defensive",
    issuer: "Impact College",
    description:
      "Comprehensive diploma program in cyber security covering both offensive (red team, penetration testing, ethical hacking) and defensive (blue team, network protection, system hardening, incident response) disciplines.",
    category: "cybersecurity",
    status: "in-progress",
    skills: [
      "Cybersecurity",
      "Offensive Security",
      "Defensive Security",
      "Penetration Testing",
      "Incident Response",
      "Network Security",
      "System Hardening",
      "Ethical Hacking",
    ],
    issueDate: "2025-09-01T00:00:00.000Z",
    expiryDate: null,
    credentialId: null,
    verificationUrl:
      "https://campus.impact-college.co.il/courses/network-and-computer-fundamentals-1-4/learn/about",
    icon: "🛡️",
    color: "#003366",
    displayOrder: 1,
    isVisible: true,
    createdAt: "2025-09-01T12:00:00.000Z",
    updatedAt: null,
    createdBy: "user-admin-id",
    nameTranslations: {
      he: "דיפלומה בסייבר – הגנה והתקפה",
      es: "Diploma en Ciberseguridad – Ofensiva y Defensiva",
    },
    descriptionTranslations: {
      he: "תוכנית דיפלומה מקיפה בסייבר הכוללת תחומי התקפה (Red Team, בדיקות חדירה, האקינג אתי) והגנה (Blue Team, הגנת רשת, הקשחת מערכות, ניהול אירועים).",
      es: "Programa de diploma integral en ciberseguridad que cubre disciplinas ofensivas (Red Team, pruebas de penetración, hacking ético) y defensivas (Blue Team, protección de redes, endurecimiento de sistemas, respuesta a incidentes).",
    },
    issuerTranslations: {
      he: "Impact College",
      es: "Impact College",
    },
  },
];

// Validation schemas
const CertificationCategorySchema = z.enum([
  "technical",
  "cloud",
  "security",
  "project-management",
  "design",
  "other",
]);

const CertificationStatusSchema = z.enum(["active", "expired", "revoked"]);

const CreateCertificationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  issuer: z.string().min(1, "Issuer is required").max(100, "Issuer too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  category: CertificationCategorySchema,
  status: CertificationStatusSchema.default("active"),
  skills: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one skill is required"),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  credentialId: z.string().max(100).optional(),
  verificationUrl: z.string().url().optional().or(z.literal("")),
  icon: z.string().max(10).optional(),
  color: z.string().max(20).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  nameTranslations: z.record(z.string(), z.string()).optional(),
  descriptionTranslations: z.record(z.string(), z.string()).optional(),
  issuerTranslations: z.record(z.string(), z.string()).optional(),
});

const UpdateCertificationSchema = CreateCertificationSchema.partial();

const ReorderCertificationsSchema = z.array(
  z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0),
  })
);

export const certificationsRouter = router({
  // Public routes (for displaying certifications)
  getAll: publicProcedure
    .input(
      z.object({
        visibleOnly: z.boolean().default(true),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.category) {
        return await CertificationsService.getByCategory(
          input.category,
          input.visibleOnly
        );
      }
      return await CertificationsService.getAll(input.visibleOnly);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const certification = await CertificationsService.getById(input.id);

      // Public users can only see visible certifications
      // Admin/editor users can see all certifications
      if (!certification) {
        return null;
      }

      const userRole = ctx.user?.role || "visitor";
      const canSeeAll = userRole === "admin" || userRole === "editor";

      if (!canSeeAll && !certification.isVisible) {
        return null; // Return null instead of throwing to prevent information leakage
      }

      return certification;
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        category: CertificationCategorySchema,
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return await CertificationsService.getByCategory(
        input.category,
        input.visibleOnly
      );
    }),

  getStatistics: publicProcedure.query(async () => {
    return await CertificationsService.getStatistics();
  }),

  // Protected routes (admin only)
  getAllAdmin: editorProcedure.query(async () => {
    return await CertificationsService.getAll(false);
  }),

  create: editorProcedure
    .input(CreateCertificationSchema)
    .mutation(async ({ input, ctx }) => {
      // Convert empty string URLs to undefined
      const cleanInput = {
        ...input,
        verificationUrl:
          input.verificationUrl === "" ? undefined : input.verificationUrl,
        createdBy: ctx.user.id,
      };

      return await CertificationsService.create(cleanInput);
    }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string(),
        data: UpdateCertificationSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await CertificationsService.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Certification not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to update a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update certifications you created",
        });
      }

      // Convert empty string URLs to undefined
      const cleanData = {
        ...input.data,
        verificationUrl:
          input.data.verificationUrl === ""
            ? undefined
            : input.data.verificationUrl,
      };

      return await CertificationsService.update(input.id, cleanData);
    }),

  delete: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify createdBy matches session user (unless admin)
      const existing = await CertificationsService.getById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Certification not found",
        });
      }

      const userRole = ctx.user.role || "visitor";
      const isAdmin = userRole === "admin";

      // Check if user is trying to delete a record they didn't create
      if (!isAdmin && existing.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete certifications you created",
        });
      }

      const success = await CertificationsService.delete(input.id);
      if (!success) {
        throw new Error("Failed to delete certification");
      }
      return { success: true };
    }),

  reorder: editorProcedure
    .input(ReorderCertificationsSchema)
    .mutation(async ({ input }) => {
      await CertificationsService.updateDisplayOrder(input);
      return { success: true };
    }),

  toggleVisibility: editorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const updated = await CertificationsService.toggleVisibility(input.id);
      if (!updated) {
        throw new Error("Certification not found");
      }
      return updated;
    }),

  markAsExpired: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      await CertificationsService.markAsExpired(input.ids);
      return { success: true };
    }),

  getExpired: editorProcedure.query(async () => {
    return await CertificationsService.getExpiredCertifications();
  }),

  // Bulk operations
  bulkUpdate: editorProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        updates: UpdateCertificationSchema,
      })
    )
    .mutation(async ({ input }) => {
      const results = await Promise.all(
        input.ids.map((id) => CertificationsService.update(id, input.updates))
      );
      return results.filter(Boolean);
    }),

  bulkDelete: editorProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const results = await Promise.all(
        input.ids.map((id) => CertificationsService.delete(id))
      );
      return {
        success: true,
        deletedCount: results.filter(Boolean).length,
      };
    }),
});
