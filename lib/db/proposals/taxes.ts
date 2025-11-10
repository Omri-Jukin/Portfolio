import { proposalTaxes } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { getDB } from "../client";
import type { UpdateProposalTax } from "../schema/schema.types";
import { incrementOrdersForConflict } from "../utils/orderUtils";

export type CreateTaxInput = {
  proposalId: string;
  scope: "overall" | "section" | "line";
  sectionId?: string | null;
  lineItemId?: string | null;
  label: string;
  kind: "vat" | "surcharge" | "withholding";
  type: "percent" | "fixed";
  rateOrAmount: number;
  orderIndex?: number;
  meta?: Record<string, unknown>;
};

export const addTax = async (input: CreateTaxInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newOrder = input.orderIndex ?? 0;

  // Increment orders for conflicts (scoped to this proposal)
  await incrementOrdersForConflict(
    dbClient,
    proposalTaxes,
    proposalTaxes.orderIndex,
    newOrder,
    [eq(proposalTaxes.proposalId, input.proposalId)]
  );

  const newTax = await dbClient
    .insert(proposalTaxes)
    .values({
      proposalId: input.proposalId,
      scope: input.scope,
      sectionId: input.sectionId || null,
      lineItemId: input.lineItemId || null,
      label: input.label,
      kind: input.kind,
      type: input.type,
      rateOrAmount: input.rateOrAmount.toString(),
      orderIndex: newOrder,
      meta: input.meta || {},
    })
    .returning();

  if (!newTax.length) {
    throw new Error("Failed to add tax.");
  }

  return newTax[0];
};

export const updateTax = async (id: string, input: UpdateProposalTax) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updated = await dbClient
    .update(proposalTaxes)
    .set(input)
    .where(eq(proposalTaxes.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update tax.");
  }

  return updated[0];
};

export const reorderTaxes = async (
  proposalId: string,
  taxOrders: Array<{ id: string; orderIndex: number }>
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Update each tax's order index
  const updates = taxOrders.map(({ id, orderIndex }) =>
    dbClient
      .update(proposalTaxes)
      .set({ orderIndex })
      .where(eq(proposalTaxes.id, id))
  );

  await Promise.all(updates);

  // Return updated taxes
  const taxes = await dbClient
    .select()
    .from(proposalTaxes)
    .where(eq(proposalTaxes.proposalId, proposalId))
    .orderBy(proposalTaxes.orderIndex);

  return taxes;
};

export const deleteTax = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(proposalTaxes)
    .where(eq(proposalTaxes.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Tax not found.");
  }

  return deleted[0];
};

export const getTaxesByProposalId = async (proposalId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const taxes = await dbClient
    .select()
    .from(proposalTaxes)
    .where(eq(proposalTaxes.proposalId, proposalId))
    .orderBy(proposalTaxes.orderIndex);

  return taxes;
};
