import { proposalSections } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { getDB } from "../client";
import type { UpdateProposalSection } from "../schema/schema.types";
import { incrementOrdersForConflict } from "../utils/orderUtils";

export type CreateSectionInput = {
  proposalId: string;
  key: string;
  label: string;
  description?: string | null;
  sortOrder?: number;
  meta?: Record<string, unknown>;
};

export const createSection = async (input: CreateSectionInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newOrder = input.sortOrder ?? 0;

  // Increment orders for conflicts (scoped to this proposal)
  await incrementOrdersForConflict(
    dbClient,
    proposalSections,
    proposalSections.sortOrder,
    newOrder,
    [eq(proposalSections.proposalId, input.proposalId)]
  );

  const newSection = await dbClient
    .insert(proposalSections)
    .values({
      proposalId: input.proposalId,
      key: input.key,
      label: input.label,
      description: input.description || null,
      sortOrder: newOrder,
      meta: input.meta || {},
    })
    .returning();

  if (!newSection.length) {
    throw new Error("Failed to create section.");
  }

  return newSection[0];
};

export const updateSection = async (
  id: string,
  input: UpdateProposalSection
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updated = await dbClient
    .update(proposalSections)
    .set(input)
    .where(eq(proposalSections.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update section.");
  }

  return updated[0];
};

export const deleteSection = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(proposalSections)
    .where(eq(proposalSections.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Section not found.");
  }

  return deleted[0];
};

export const reorderSections = async (
  proposalId: string,
  sectionOrders: Array<{ id: string; sortOrder: number }>
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Update each section's sort order
  const updates = sectionOrders.map(({ id, sortOrder }) =>
    dbClient
      .update(proposalSections)
      .set({ sortOrder })
      .where(eq(proposalSections.id, id))
  );

  await Promise.all(updates);

  // Return updated sections
  const sections = await dbClient
    .select()
    .from(proposalSections)
    .where(eq(proposalSections.proposalId, proposalId))
    .orderBy(proposalSections.sortOrder);

  return sections;
};

export const getSectionsByProposalId = async (proposalId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const sections = await dbClient
    .select()
    .from(proposalSections)
    .where(eq(proposalSections.proposalId, proposalId))
    .orderBy(proposalSections.sortOrder);

  return sections;
};
