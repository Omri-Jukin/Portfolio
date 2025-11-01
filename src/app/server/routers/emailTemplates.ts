import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  createEmailTemplate,
  getEmailTemplateById,
  getAllEmailTemplates,
  updateEmailTemplate,
  deleteEmailTemplate,
  recordEmailSend,
} from "$/db/emailTemplates/emailTemplates";
import { getIntakes } from "$/db/intakes/intakes";
import { getAllCustomLinks } from "$/db/intakes/customLinks";
import { EmailManager } from "#/backend/email/EmailManager";
import { users } from "$/db/schema/schema.tables";

const emailManager = new EmailManager();
const EMAIL_FROM = process.env.EMAIL_FROM || "intake@omrijukin.com";

export const emailTemplatesRouter = router({
  // Get all email templates (admin protected)
  getAll: protectedProcedure.query(async (opts) => {
    const { user, db } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await getAllEmailTemplates();
  }),

  // Get email template by ID (admin protected)
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const template = await getEmailTemplateById(input.id);
      if (!template) {
        throw new Error("Email template not found");
      }

      return template;
    }),

  // Create email template (admin protected)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Template name is required"),
        subject: z.string().min(1, "Subject is required"),
        htmlContent: z.string().min(1, "HTML content is required"),
        textContent: z.string().optional(),
        cssStyles: z.string().optional(),
        variables: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await createEmailTemplate({
        ...input,
        createdBy: user.id,
      });
    }),

  // Update email template (admin protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        subject: z.string().min(1).optional(),
        htmlContent: z.string().min(1).optional(),
        textContent: z.string().optional(),
        cssStyles: z.string().optional(),
        variables: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const { id, ...updateData } = input;
      return await updateEmailTemplate(id, updateData);
    }),

  // Delete email template (admin protected)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const success = await deleteEmailTemplate(input.id);
      if (!success) {
        throw new Error("Failed to delete email template");
      }

      return { success: true };
    }),

  // Get recipients for email sending (admin protected)
  getRecipients: protectedProcedure.query(async (opts) => {
    const { user, db } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const recipients: Array<{
      email: string;
      name: string;
      source: "intake" | "customLink" | "user";
    }> = [];

    try {
      // Get recipients from intakes
      const intakes = await getIntakes();
      intakes.forEach((intake) => {
        const data = intake.data as Record<string, unknown>;
        const contact =
          data.contact && typeof data.contact === "object"
            ? (data.contact as Record<string, unknown>)
            : undefined;
        const fullName =
          contact && "fullName" in contact
            ? String(contact.fullName)
            : contact && "firstName" in contact && "lastName" in contact
            ? `${contact.firstName} ${contact.lastName}`.trim()
            : undefined;

        recipients.push({
          email: intake.email,
          name: fullName || intake.email.split("@")[0],
          source: "intake",
        });
      });

      // Get recipients from custom links
      const customLinks = await getAllCustomLinks();
      customLinks.forEach((link) => {
        const name =
          link.firstName && link.lastName
            ? `${link.firstName} ${link.lastName}`
            : link.email.split("@")[0];

        // Avoid duplicates
        if (!recipients.find((r) => r.email === link.email)) {
          recipients.push({
            email: link.email,
            name,
            source: "customLink",
          });
        }
      });

      // Get users (excluding current admin)
      const allUsers =
        (await // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
        ((db as any).query as any).users.findMany()) as Array<
          typeof users.$inferSelect
        >;
      allUsers.forEach((userRecord) => {
        const name = `${userRecord.firstName} ${userRecord.lastName}`;
        // Avoid duplicates
        if (!recipients.find((r) => r.email === userRecord.email)) {
          recipients.push({
            email: userRecord.email,
            name,
            source: "user",
          });
        }
      });
    } catch (error) {
      console.error("Error fetching recipients:", error);
    }

    // Sort by name, then by email
    return recipients.sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      return a.email.localeCompare(b.email);
    });
  }),

  // Send emails using template (admin protected)
  sendEmails: protectedProcedure
    .input(
      z.object({
        templateId: z.string().uuid(),
        recipientEmails: z.array(z.string().email()),
        variables: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      // Get template
      const template = await getEmailTemplateById(input.templateId);
      if (!template) {
        throw new Error("Email template not found");
      }

      // Variables replacement helper

      // Replace variables in HTML and subject
      const replaceVariables = (text: string, vars: Record<string, string>) => {
        let result = text;
        Object.entries(vars).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
        });
        return result;
      };

      const variables = {
        ...(template.variables || {}),
        ...(input.variables || {}),
      };
      let htmlContent = replaceVariables(template.htmlContent, variables);
      const subject = replaceVariables(template.subject, variables);
      const textContent = template.textContent
        ? replaceVariables(template.textContent, variables)
        : undefined;

      // Inject CSS styles if provided
      if (template.cssStyles) {
        // Try to inject into <head> or wrap with <style> tag
        if (htmlContent.includes("</head>")) {
          htmlContent = htmlContent.replace(
            "</head>",
            `<style>${template.cssStyles}</style></head>`
          );
        } else if (htmlContent.includes("<body")) {
          htmlContent = htmlContent.replace(
            "<body",
            `<head><style>${template.cssStyles}</style></head><body`
          );
        } else {
          // Prepend style tag at the beginning
          htmlContent = `<style>${template.cssStyles}</style>${htmlContent}`;
        }
      }

      // Get recipients data for name resolution
      const intakesData = await getIntakes();
      const customLinksData = await getAllCustomLinks();
      const allUsersData =
        (await // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
        ((db as any).query as any).users.findMany()) as Array<
          typeof users.$inferSelect
        >;

      const results = await Promise.allSettled(
        input.recipientEmails.map(async (email) => {
          try {
            // Get recipient name from various sources
            let recipientName: string | null = null;

            // Check intakes
            const intakeRecipient = intakesData.find((i) => i.email === email);
            if (intakeRecipient) {
              const data = intakeRecipient.data as Record<string, unknown>;
              const contact =
                data.contact && typeof data.contact === "object"
                  ? (data.contact as Record<string, unknown>)
                  : undefined;
              recipientName =
                (contact && "fullName" in contact
                  ? String(contact.fullName)
                  : contact && "firstName" in contact && "lastName" in contact
                  ? `${contact.firstName} ${contact.lastName}`.trim()
                  : null) || null;
            }

            // Check custom links if not found
            if (!recipientName) {
              const customLink = customLinksData.find((l) => l.email === email);
              if (customLink && customLink.firstName && customLink.lastName) {
                recipientName = `${customLink.firstName} ${customLink.lastName}`;
              }
            }

            // Check users if still not found
            if (!recipientName) {
              const userRecord = allUsersData.find((u) => u.email === email);
              if (userRecord) {
                recipientName = `${userRecord.firstName} ${userRecord.lastName}`;
              }
            }

            const result = await emailManager.sendEmail({
              to: email,
              from: EMAIL_FROM,
              subject,
              htmlBody: htmlContent,
              textBody: textContent,
            });

            // Record email send
            await recordEmailSend(
              input.templateId,
              email,
              recipientName,
              subject,
              result.success ? "sent" : "failed",
              user.id,
              result.error
            );

            return {
              email,
              success: result.success,
              error: result.error,
            };
          } catch (error) {
            await recordEmailSend(
              input.templateId,
              email,
              null,
              subject,
              "failed",
              user.id,
              error instanceof Error ? error.message : "Unknown error"
            );

            return {
              email,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        })
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failureCount = results.length - successCount;

      return {
        total: results.length,
        successCount,
        failureCount,
        results: results.map((r) =>
          r.status === "fulfilled"
            ? r.value
            : { email: "", success: false, error: "Unknown error" }
        ),
      };
    }),
});
