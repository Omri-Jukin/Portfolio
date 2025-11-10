import {
  proposals,
  proposalSections,
  proposalLineItems,
  proposalDiscounts,
  proposalTaxes,
  proposalEvents,
} from "../schema/schema.tables";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { getDB } from "../client";
import type { UpdateProposal, ProposalStatus } from "../schema/schema.types";
import { logEvent } from "./events";
import {
  validateProposalUpdate,
  validateDiscountCompatibility,
} from "./validation";

export type CreateProposalInput = {
  clientUserId?: string | null;
  intakeId?: string | null;
  templateId?: string | null;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  status?: string;
  currency?: string;
  taxProfileKey?: string | null;
  priceDisplay?: "taxExclusive" | "taxInclusive";
  validUntil?: Date | null;
  notesInternal?: string | null;
  notesClient?: string | null;
  createdBy: string;
};

export interface ProposalFilters {
  status?: ProposalStatus[];
  clientEmail?: string;
  clientName?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

export const createProposal = async (input: CreateProposalInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Default validUntil to 3 months from now if not provided
  const defaultValidUntil =
    input.validUntil ||
    (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date;
    })();

  const newProposal = await dbClient
    .insert(proposals)
    .values({
      clientUserId: input.clientUserId || null,
      intakeId: input.intakeId || null,
      templateId: input.templateId || null,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientCompany: input.clientCompany || null,
      status: input.status || "draft",
      currency: input.currency || "ILS",
      taxProfileKey: input.taxProfileKey || null,
      priceDisplay: input.priceDisplay || "taxExclusive",
      validUntil: defaultValidUntil,
      notesInternal: input.notesInternal || null,
      notesClient: input.notesClient || null,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newProposal.length) {
    throw new Error("Failed to create proposal.");
  }

  // Log creation event
  await dbClient.insert(proposalEvents).values({
    proposalId: newProposal[0].id,
    actorId: input.createdBy,
    event: "created",
    payload: {},
    occurredAt: new Date(),
  });

  return newProposal[0];
};

export const getProposals = async (filters?: ProposalFilters) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const conditions: ReturnType<
    typeof eq | typeof or | typeof like | typeof sql
  >[] = [];

  if (filters?.status && filters.status.length > 0) {
    conditions.push(or(...filters.status.map((s) => eq(proposals.status, s))));
  }

  if (filters?.clientEmail) {
    conditions.push(like(proposals.clientEmail, `%${filters.clientEmail}%`));
  }

  if (filters?.clientName) {
    conditions.push(like(proposals.clientName, `%${filters.clientName}%`));
  }

  if (filters?.startDate) {
    conditions.push(sql`${proposals.createdAt} >= ${filters.startDate}`);
  }

  if (filters?.endDate) {
    conditions.push(sql`${proposals.createdAt} <= ${filters.endDate}`);
  }

  if (filters?.searchTerm) {
    const searchPattern = `%${filters.searchTerm}%`;
    conditions.push(
      or(
        like(proposals.clientName, searchPattern),
        like(proposals.clientEmail, searchPattern),
        like(proposals.clientCompany, searchPattern),
        sql`${proposals.meta}::text ILIKE ${searchPattern}`
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const proposalList = await dbClient
    .select()
    .from(proposals)
    .where(whereClause)
    .orderBy(desc(proposals.createdAt));

  return proposalList;
};

export const getProposalById = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await dbClient
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1);

  if (!proposal.length) {
    throw new Error("Proposal not found.");
  }

  return proposal[0];
};

export const getProposalWithRelations = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await getProposalById(id);

  // Get all related data - batch queries to reduce connection pool pressure
  // Fetch sections and lineItems first (most critical data)
  const [sections, lineItems] = await Promise.all([
    dbClient
      .select()
      .from(proposalSections)
      .where(eq(proposalSections.proposalId, id))
      .orderBy(proposalSections.sortOrder),
    dbClient
      .select()
      .from(proposalLineItems)
      .where(eq(proposalLineItems.proposalId, id)),
  ]);

  // Then fetch discounts, taxes, and events in parallel
  const [discounts, taxes, events] = await Promise.all([
    dbClient
      .select()
      .from(proposalDiscounts)
      .where(eq(proposalDiscounts.proposalId, id)),
    dbClient
      .select()
      .from(proposalTaxes)
      .where(eq(proposalTaxes.proposalId, id))
      .orderBy(proposalTaxes.orderIndex),
    dbClient
      .select()
      .from(proposalEvents)
      .where(eq(proposalEvents.proposalId, id))
      .orderBy(desc(proposalEvents.occurredAt)),
  ]);

  return {
    proposal,
    sections,
    lineItems,
    discounts,
    taxes,
    events,
  };
};

export const updateProposal = async (
  id: string,
  input: UpdateProposal,
  updatedBy?: string
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Validate update before proceeding
  const validation = await validateProposalUpdate(id, input);
  if (!validation.valid) {
    const errorMessages = validation.errors
      .map((e) => `${e.field}: ${e.message}`)
      .join("; ");
    throw new Error(`Validation failed: ${errorMessages}`);
  }

  // Validate discount compatibility
  const discountValidation = await validateDiscountCompatibility(id);
  if (!discountValidation.valid) {
    const errorMessages = discountValidation.errors
      .map((e) => `${e.field}: ${e.message}`)
      .join("; ");
    throw new Error(`Discount compatibility check failed: ${errorMessages}`);
  }

  // Get original proposal to compare changes
  const original = await getProposalById(id);

  // Determine which fields changed
  const changedFields: string[] = [];
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  if (
    input.clientName !== undefined &&
    input.clientName !== original.clientName
  ) {
    changedFields.push("clientName");
    changes.clientName = { from: original.clientName, to: input.clientName };
  }
  if (
    input.clientEmail !== undefined &&
    input.clientEmail !== original.clientEmail
  ) {
    changedFields.push("clientEmail");
    changes.clientEmail = { from: original.clientEmail, to: input.clientEmail };
  }
  if (
    input.clientCompany !== undefined &&
    input.clientCompany !== original.clientCompany
  ) {
    changedFields.push("clientCompany");
    changes.clientCompany = {
      from: original.clientCompany,
      to: input.clientCompany,
    };
  }
  if (input.status !== undefined && input.status !== original.status) {
    changedFields.push("status");
    changes.status = { from: original.status, to: input.status };
  }
  if (input.currency !== undefined && input.currency !== original.currency) {
    changedFields.push("currency");
    changes.currency = { from: original.currency, to: input.currency };
  }
  if (
    input.taxProfileKey !== undefined &&
    input.taxProfileKey !== original.taxProfileKey
  ) {
    changedFields.push("taxProfileKey");
    changes.taxProfileKey = {
      from: original.taxProfileKey,
      to: input.taxProfileKey,
    };
  }
  if (
    input.priceDisplay !== undefined &&
    input.priceDisplay !== original.priceDisplay
  ) {
    changedFields.push("priceDisplay");
    changes.priceDisplay = {
      from: original.priceDisplay,
      to: input.priceDisplay,
    };
  }
  if (input.validUntil !== undefined) {
    const originalDate =
      original.validUntil?.toISOString().split("T")[0] || null;
    const newDate = input.validUntil?.toISOString().split("T")[0] || null;
    if (originalDate !== newDate) {
      changedFields.push("validUntil");
      changes.validUntil = { from: originalDate, to: newDate };
    }
  }
  if (
    input.notesInternal !== undefined &&
    input.notesInternal !== original.notesInternal
  ) {
    changedFields.push("notesInternal");
    changes.notesInternal = {
      from: original.notesInternal,
      to: input.notesInternal,
    };
  }
  if (
    input.notesClient !== undefined &&
    input.notesClient !== original.notesClient
  ) {
    changedFields.push("notesClient");
    changes.notesClient = { from: original.notesClient, to: input.notesClient };
  }

  const updated = await dbClient
    .update(proposals)
    .set({
      ...input,
      updatedBy: updatedBy || input.updatedBy || null,
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update proposal.");
  }

  // Log update event with summary of changed fields
  if (changedFields.length > 0) {
    try {
      await logEvent({
        proposalId: id,
        event: "updated",
        payload: {
          changedFields,
          changes,
          summary: `Updated ${
            changedFields.length
          } field(s): ${changedFields.join(", ")}`,
        },
        actorId: updatedBy || null,
      });
    } catch (error) {
      // Don't fail the update if logging fails
      console.error("Failed to log proposal update event:", error);
    }
  }

  return updated[0];
};

export const deleteProposal = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Get proposal before deletion for logging
  const proposalToDelete = await dbClient
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1);

  if (!proposalToDelete.length) {
    throw new Error("Proposal not found.");
  }

  // Delete proposal (cascade will handle related records)
  const deleted = await dbClient
    .delete(proposals)
    .where(eq(proposals.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Failed to delete proposal.");
  }

  return deleted[0];
};

export const generateShareToken = async (id: string): Promise<string> => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const token = crypto.randomUUID();

  await dbClient
    .update(proposals)
    .set({
      shareToken: token,
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, id));

  return token;
};

export const getProposalByShareToken = async (token: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await dbClient
    .select()
    .from(proposals)
    .where(eq(proposals.shareToken, token))
    .limit(1);

  if (!proposal.length) {
    throw new Error("Proposal not found.");
  }

  return proposal[0];
};
