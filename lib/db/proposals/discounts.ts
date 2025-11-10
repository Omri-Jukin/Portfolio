import { proposalDiscounts } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { getDB } from "../client";
import type { UpdateProposalDiscount } from "../schema/schema.types";

export type CreateDiscountInput = {
  proposalId: string;
  scope: "overall" | "section" | "line";
  sectionId?: string | null;
  lineItemId?: string | null;
  sourceDiscountId?: string | null;
  label: string;
  type: "percent" | "fixed";
  amountMinor?: number | null;
  percent?: number | null;
  appliesMeta?: Record<string, unknown>;
};

export const addDiscount = async (input: CreateDiscountInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newDiscount = await dbClient
    .insert(proposalDiscounts)
    .values({
      proposalId: input.proposalId,
      scope: input.scope,
      sectionId: input.sectionId || null,
      lineItemId: input.lineItemId || null,
      sourceDiscountId: input.sourceDiscountId || null,
      label: input.label,
      type: input.type,
      amountMinor: input.amountMinor || null,
      percent: input.percent ? input.percent.toString() : null,
      appliesMeta: input.appliesMeta || {},
    })
    .returning();

  if (!newDiscount.length) {
    throw new Error("Failed to add discount.");
  }

  return newDiscount[0];
};

export const updateDiscount = async (
  id: string,
  input: UpdateProposalDiscount
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updated = await dbClient
    .update(proposalDiscounts)
    .set(input)
    .where(eq(proposalDiscounts.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update discount.");
  }

  return updated[0];
};

export const deleteDiscount = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(proposalDiscounts)
    .where(eq(proposalDiscounts.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Discount not found.");
  }

  return deleted[0];
};

export const getDiscountsByProposalId = async (proposalId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const discounts = await dbClient
    .select()
    .from(proposalDiscounts)
    .where(eq(proposalDiscounts.proposalId, proposalId));

  return discounts;
};
