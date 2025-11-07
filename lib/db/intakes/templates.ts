import { intakeTemplates } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { getDB } from "../client";
import type { IntakeFormData } from "#/lib/schemas";

export type CreateIntakeTemplateInput = {
  name: string;
  description?: string;
  category: string;
  templateData: IntakeFormData;
  isActive?: boolean;
  displayOrder?: number;
};

export type UpdateIntakeTemplateInput = Partial<
  Omit<CreateIntakeTemplateInput, "name">
> & {
  name?: string;
};

export const createIntakeTemplate = async (
  input: CreateIntakeTemplateInput
) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newTemplate = await dbClient
    .insert(intakeTemplates)
    .values({
      name: input.name,
      description: input.description || null,
      category: input.category,
      templateData: input.templateData as unknown as Record<string, unknown>,
      isActive: input.isActive ?? true,
      displayOrder: input.displayOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newTemplate.length) {
    throw new Error("Failed to create intake template.");
  }

  return newTemplate[0];
};

export const getIntakeTemplates = async (includeInactive = false) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  if (includeInactive) {
    return dbClient
      .select()
      .from(intakeTemplates)
      .orderBy(
        desc(intakeTemplates.displayOrder),
        desc(intakeTemplates.createdAt)
      );
  }

  return dbClient
    .select()
    .from(intakeTemplates)
    .where(eq(intakeTemplates.isActive, true))
    .orderBy(
      desc(intakeTemplates.displayOrder),
      desc(intakeTemplates.createdAt)
    );
};

export const getIntakeTemplateById = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const template = await dbClient
    .select()
    .from(intakeTemplates)
    .where(eq(intakeTemplates.id, id))
    .limit(1);

  if (!template.length) {
    throw new Error("Intake template not found.");
  }

  return template[0];
};

export const updateIntakeTemplate = async (
  id: string,
  input: UpdateIntakeTemplateInput
) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: {
    name?: string;
    description?: string | null;
    category?: string;
    templateData?: Record<string, unknown>;
    isActive?: boolean;
    displayOrder?: number;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined)
    updateData.description = input.description || null;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.templateData !== undefined)
    updateData.templateData = input.templateData as unknown as Record<
      string,
      unknown
    >;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;
  if (input.displayOrder !== undefined)
    updateData.displayOrder = input.displayOrder;

  const updated = await dbClient
    .update(intakeTemplates)
    .set(updateData)
    .where(eq(intakeTemplates.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Intake template not found or update failed.");
  }

  return updated[0];
};

export const deleteIntakeTemplate = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(intakeTemplates)
    .where(eq(intakeTemplates.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Intake template not found.");
  }

  return deleted[0];
};
