import { getDB } from "../client";
import { emailTemplates, emailSends } from "../schema/schema.tables";
import { eq } from "drizzle-orm";

export interface CreateEmailTemplateInput {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  cssStyles?: string;
  variables?: Record<string, string>;
  createdBy: string;
}

export interface UpdateEmailTemplateInput {
  name?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  cssStyles?: string;
  variables?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string | null;
  cssStyles: string | null;
  variables: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export async function createEmailTemplate(
  input: CreateEmailTemplateInput
): Promise<EmailTemplate> {
  const db = await getDB();

  const [template] = await db
    .insert(emailTemplates)
    .values({
      name: input.name,
      subject: input.subject,
      htmlContent: input.htmlContent,
      textContent: input.textContent || null,
      cssStyles: input.cssStyles || null,
      variables: input.variables || null,
      createdBy: input.createdBy,
    })
    .returning();

  return {
    id: template.id,
    name: template.name,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    cssStyles: template.cssStyles,
    variables: (template.variables as Record<string, string>) || null,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    createdBy: template.createdBy,
  };
}

export async function getEmailTemplateById(
  id: string
): Promise<EmailTemplate | null> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db || !("query" in db)) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
  const template = await ((db as any).query as any).emailTemplates.findFirst({
    where: eq(emailTemplates.id, id),
  });

  if (!template) return null;

  return {
    id: template.id,
    name: template.name,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    cssStyles: template.cssStyles,
    variables: (template.variables as Record<string, string>) || null,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    createdBy: template.createdBy,
  };
}

export async function getAllEmailTemplates(): Promise<EmailTemplate[]> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db || !("query" in db)) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
  const templates = await ((db as any).query as any).emailTemplates.findMany({
    orderBy: (
      templates: typeof emailTemplates,
      { desc }: { desc: (column: typeof emailTemplates.updatedAt) => unknown }
    ) => [desc(templates.updatedAt)],
  });

  return templates.map((template: typeof emailTemplates.$inferSelect) => ({
    id: template.id,
    name: template.name,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    cssStyles: template.cssStyles,
    variables: (template.variables as Record<string, string>) || null,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    createdBy: template.createdBy,
  }));
}

export async function updateEmailTemplate(
  id: string,
  input: UpdateEmailTemplateInput
): Promise<EmailTemplate> {
  const db = await getDB();

  const [template] = await db
    .update(emailTemplates)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(emailTemplates.id, id))
    .returning();

  return {
    id: template.id,
    name: template.name,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    cssStyles: template.cssStyles,
    variables: (template.variables as Record<string, string>) || null,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    createdBy: template.createdBy,
  };
}

export async function deleteEmailTemplate(id: string): Promise<boolean> {
  const db = await getDB();

  try {
    const result = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, id))
      .returning();
    return result.length > 0;
  } catch (error) {
    console.error("Failed to delete email template:", error);
    return false;
  }
}

/**
 * Record email send for analytics
 */
export async function recordEmailSend(
  templateId: string,
  recipientEmail: string,
  recipientName: string | null,
  subject: string,
  status: "sent" | "failed" | "pending",
  sentBy: string,
  error?: string
): Promise<void> {
  const db = await getDB();

  await db.insert(emailSends).values({
    templateId,
    recipientEmail,
    recipientName: recipientName || null,
    subject,
    status,
    sentAt: status === "sent" ? new Date() : null,
    error: error || null,
    sentBy,
  });
}
