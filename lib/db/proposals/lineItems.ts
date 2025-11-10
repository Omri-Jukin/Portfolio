import { proposalLineItems } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { getDB } from "../client";
import type { UpdateProposalLineItem } from "../schema/schema.types";

export type CreateLineItemInput = {
  proposalId: string;
  sectionId?: string | null;
  featureKey?: string | null;
  label: string;
  description?: string | null;
  quantity: number;
  unitPriceMinor: number;
  isOptional?: boolean;
  isSelected?: boolean;
  taxClass?: string | null;
  meta?: Record<string, unknown>;
};

export const createLineItem = async (input: CreateLineItemInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newLineItem = await dbClient
    .insert(proposalLineItems)
    .values({
      proposalId: input.proposalId,
      sectionId: input.sectionId || null,
      featureKey: input.featureKey || null,
      label: input.label,
      description: input.description || null,
      quantity: input.quantity.toString(),
      unitPriceMinor: input.unitPriceMinor,
      isOptional: input.isOptional ?? false,
      isSelected: input.isSelected ?? true,
      taxClass: input.taxClass || null,
      meta: input.meta || {},
    })
    .returning();

  if (!newLineItem.length) {
    throw new Error("Failed to create line item.");
  }

  return newLineItem[0];
};

export const updateLineItem = async (
  id: string,
  input: UpdateProposalLineItem
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updated = await dbClient
    .update(proposalLineItems)
    .set(input)
    .where(eq(proposalLineItems.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update line item.");
  }

  return updated[0];
};

export const toggleLineItemSelection = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const current = await dbClient
    .select()
    .from(proposalLineItems)
    .where(eq(proposalLineItems.id, id))
    .limit(1);

  if (!current.length) {
    throw new Error("Line item not found.");
  }

  const updated = await dbClient
    .update(proposalLineItems)
    .set({
      isSelected: !current[0].isSelected,
    })
    .where(eq(proposalLineItems.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to toggle line item selection.");
  }

  return updated[0];
};

export const deleteLineItem = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(proposalLineItems)
    .where(eq(proposalLineItems.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Line item not found.");
  }

  return deleted[0];
};

export const getLineItemsByProposalId = async (proposalId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const lineItems = await dbClient
    .select()
    .from(proposalLineItems)
    .where(eq(proposalLineItems.proposalId, proposalId));

  return lineItems;
};

export const getLineItemsBySectionId = async (sectionId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const lineItems = await dbClient
    .select()
    .from(proposalLineItems)
    .where(eq(proposalLineItems.sectionId, sectionId));

  return lineItems;
};
