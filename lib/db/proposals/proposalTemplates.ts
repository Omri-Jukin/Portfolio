import { proposalTemplates } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { getDB } from "../client";

export type CreateProposalTemplateInput = {
  name: string;
  description?: string | null;
  content: unknown;
  isDefault?: boolean;
};

export type UpdateProposalTemplateInput = Partial<
  Omit<CreateProposalTemplateInput, "name">
> & {
  id: string;
};

export const createProposalTemplate = async (
  input: CreateProposalTemplateInput
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // If setting as default, unset other defaults
  if (input.isDefault) {
    await dbClient
      .update(proposalTemplates)
      .set({ isDefault: false })
      .where(eq(proposalTemplates.isDefault, true));
  }

  const newTemplate = await dbClient
    .insert(proposalTemplates)
    .values({
      name: input.name,
      description: input.description || null,
      content: input.content as never,
      isDefault: input.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newTemplate.length) {
    throw new Error("Failed to create proposal template.");
  }

  return newTemplate[0];
};

export const getProposalTemplates = async () => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const templates = await dbClient
    .select()
    .from(proposalTemplates)
    .orderBy(desc(proposalTemplates.createdAt));

  return templates;
};

export const getProposalTemplateById = async (id: string) => {
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
    throw new Error("Proposal template not found.");
  }

  return template[0];
};

export const updateProposalTemplate = async (
  input: UpdateProposalTemplateInput
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const { id, isDefault, ...updateData } = input;

  // If setting as default, unset other defaults
  if (isDefault) {
    await dbClient
      .update(proposalTemplates)
      .set({ isDefault: false })
      .where(eq(proposalTemplates.isDefault, true));
  }

  const updatedTemplate = await dbClient
    .update(proposalTemplates)
    .set({
      ...updateData,
      isDefault: isDefault ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(proposalTemplates.id, id))
    .returning();

  if (!updatedTemplate.length) {
    throw new Error("Proposal template not found.");
  }

  return updatedTemplate[0];
};

export const deleteProposalTemplate = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  await dbClient.delete(proposalTemplates).where(eq(proposalTemplates.id, id));
};
