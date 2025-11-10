import { proposalTemplates } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { getDB } from "../client";
import type { UpdateProposalTemplate } from "../schema/schema.types";
import { incrementOrdersForConflict } from "../utils/orderUtils";

export type CreateTemplateInput = {
  name: string;
  description?: string | null;
  defaultCurrency?: string;
  defaultTaxProfileKey?: string | null;
  defaultPriceDisplay?: "taxExclusive" | "taxInclusive";
  templateData?: Record<string, unknown>;
  isActive?: boolean;
  displayOrder?: number;
};

export const createTemplate = async (input: CreateTemplateInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newOrder = input.displayOrder ?? 0;

  // Increment orders for conflicts
  await incrementOrdersForConflict(
    dbClient,
    proposalTemplates,
    proposalTemplates.displayOrder,
    newOrder
  );

  const newTemplate = await dbClient
    .insert(proposalTemplates)
    .values({
      name: input.name,
      description: input.description || null,
      defaultCurrency: input.defaultCurrency || "ILS",
      defaultTaxProfileKey: input.defaultTaxProfileKey || null,
      defaultPriceDisplay: input.defaultPriceDisplay || "taxExclusive",
      templateData: input.templateData || {},
      isActive: input.isActive ?? true,
      displayOrder: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newTemplate.length) {
    throw new Error("Failed to create template.");
  }

  return newTemplate[0];
};

export const getTemplates = async () => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const templates = await dbClient
    .select()
    .from(proposalTemplates)
    .orderBy(proposalTemplates.displayOrder);

  return templates;
};

export const getTemplateById = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const template = await dbClient
    .select()
    .from(proposalTemplates)
    .where(eq(proposalTemplates.id, id))
    .limit(1);

  if (!template.length) {
    throw new Error("Template not found.");
  }

  return template[0];
};

export const updateTemplate = async (
  id: string,
  input: UpdateProposalTemplate
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updated = await dbClient
    .update(proposalTemplates)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(proposalTemplates.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update template.");
  }

  return updated[0];
};

export const deleteTemplate = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(proposalTemplates)
    .where(eq(proposalTemplates.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Template not found.");
  }

  return deleted[0];
};
