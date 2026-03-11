import {
  proposals,
  proposalSnapshots,
  intakes,
  proposalTemplates,
} from "../schema/schema.tables";
import { eq, desc, and, or, like, sql, isNotNull } from "drizzle-orm";
import { getDB } from "../client";
import type { ProposalStatus, PriceDisplayMode } from "../schema/schema.types";
import { randomUUID } from "crypto";

export type CreateProposalInput = {
  title: string;
  clientName: string;
  clientEmail: string;
  status?: ProposalStatus;
  currency?: string;
  priceDisplayMode?: PriceDisplayMode;
  content?: unknown;
  charges?: unknown;
  discounts?: unknown;
  taxes?: unknown;
  metadata?: unknown;
  intakeId?: string | null;
  templateId?: string | null;
  validUntil?: Date | null;
};

export type UpdateProposalInput = Partial<
  Omit<CreateProposalInput, "intakeId" | "templateId">
> & {
  id: string;
};

export type ProposalFilters = {
  status?: ProposalStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
};

export const createProposal = async (input: CreateProposalInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newProposal = await dbClient
    .insert(proposals)
    .values({
      title: input.title,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      status: input.status || "draft",
      currency: input.currency || "USD",
      priceDisplayMode: input.priceDisplayMode || "fixed",
      content: (input.content as never) || [],
      charges: (input.charges as never) || {},
      discounts: (input.discounts as never) || [],
      taxes: (input.taxes as never) || [],
      metadata: (input.metadata as never) || {},
      intakeId: input.intakeId || null,
      templateId: input.templateId || null,
      validUntil: input.validUntil || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newProposal.length) {
    throw new Error("Failed to create proposal.");
  }

  return newProposal[0];
};

export const getProposals = async (filters?: ProposalFilters) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  try {
    let query = dbClient.select().from(proposals);

    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(proposals.status, filters.status));
    }

    if (filters?.search) {
      conditions.push(
        or(
          like(proposals.title, `%${filters.search}%`),
          like(proposals.clientName, `%${filters.search}%`),
          like(proposals.clientEmail, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.startDate) {
      conditions.push(sql`${proposals.createdAt} >= ${filters.startDate}`);
    }

    if (filters?.endDate) {
      conditions.push(sql`${proposals.createdAt} <= ${filters.endDate}`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const proposalList = await query.orderBy(desc(proposals.createdAt));

    return proposalList;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check if it's a table not found error
    if (
      errorMessage.includes("does not exist") ||
      errorMessage.includes("relation") ||
      errorMessage.includes("table") ||
      errorMessage.includes("proposals")
    ) {
      throw new Error(
        `Proposals table not found. Please run database migrations: npm run db:push or npm run db:apply-migration`
      );
    }

    // Re-throw with more context
    throw new Error(`Failed query: ${errorMessage}`);
  }
};

export const getProposalById = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await dbClient
    .select({
      proposal: proposals,
      intake: intakes,
      template: proposalTemplates,
    })
    .from(proposals)
    .leftJoin(intakes, eq(proposals.intakeId, intakes.id))
    .leftJoin(proposalTemplates, eq(proposals.templateId, proposalTemplates.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!proposal.length) {
    throw new Error("Proposal not found.");
  }

  const result = proposal[0];
  return {
    ...result.proposal,
    intake: result.intake || null,
    template: result.template || null,
  };
};

export const getProposalByShareToken = async (token: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await dbClient
    .select()
    .from(proposals)
    .where(
      and(eq(proposals.shareToken, token), isNotNull(proposals.shareToken))
    )
    .limit(1);

  if (!proposal.length) {
    throw new Error("Proposal not found.");
  }

  return proposal[0];
};

export const updateProposal = async (input: UpdateProposalInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const { id, ...updateData } = input;

  const updatedProposal = await dbClient
    .update(proposals)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, id))
    .returning();

  if (!updatedProposal.length) {
    throw new Error("Proposal not found.");
  }

  return updatedProposal[0];
};

export const deleteProposal = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  await dbClient.delete(proposals).where(eq(proposals.id, id));
};

export const duplicateProposal = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const original = await getProposalById(id);

  const newProposal = await dbClient
    .insert(proposals)
    .values({
      title: `${original.title} (Copy)`,
      clientName: original.clientName,
      clientEmail: original.clientEmail,
      status: "draft",
      currency: original.currency,
      priceDisplayMode: original.priceDisplayMode,
      content: original.content,
      charges: original.charges,
      discounts: original.discounts,
      taxes: original.taxes,
      metadata: original.metadata,
      intakeId: original.intakeId,
      templateId: original.templateId,
      validUntil: null,
      shareToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newProposal.length) {
    throw new Error("Failed to duplicate proposal.");
  }

  return newProposal[0];
};

export const generateShareToken = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const shareToken = randomUUID();

  const updatedProposal = await dbClient
    .update(proposals)
    .set({
      shareToken,
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, id))
    .returning();

  if (!updatedProposal.length) {
    throw new Error("Proposal not found.");
  }

  return updatedProposal[0].shareToken;
};

export const acceptProposal = async (token: string, acceptedBy?: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await getProposalByShareToken(token);

  if (proposal.status !== "sent") {
    throw new Error("Proposal cannot be accepted in current status.");
  }

  // Create snapshot
  await dbClient.insert(proposalSnapshots).values({
    proposalId: proposal.id,
    snapshotData: {
      title: proposal.title,
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      content: proposal.content,
      charges: proposal.charges,
      discounts: proposal.discounts,
      taxes: proposal.taxes,
      metadata: proposal.metadata,
      currency: proposal.currency,
      priceDisplayMode: proposal.priceDisplayMode,
    },
    acceptedAt: new Date(),
    acceptedBy: acceptedBy || proposal.clientEmail,
    declineReason: null,
    createdAt: new Date(),
  });

  // Update proposal status
  const updatedProposal = await dbClient
    .update(proposals)
    .set({
      status: "accepted",
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, proposal.id))
    .returning();

  return updatedProposal[0];
};

export const declineProposal = async (token: string, reason?: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const proposal = await getProposalByShareToken(token);

  if (proposal.status !== "sent") {
    throw new Error("Proposal cannot be declined in current status.");
  }

  // Create snapshot
  await dbClient.insert(proposalSnapshots).values({
    proposalId: proposal.id,
    snapshotData: {
      title: proposal.title,
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      content: proposal.content,
      charges: proposal.charges,
      discounts: proposal.discounts,
      taxes: proposal.taxes,
      metadata: proposal.metadata,
      currency: proposal.currency,
      priceDisplayMode: proposal.priceDisplayMode,
    },
    acceptedAt: null,
    acceptedBy: null,
    declineReason: reason || null,
    createdAt: new Date(),
  });

  // Update proposal status
  const updatedProposal = await dbClient
    .update(proposals)
    .set({
      status: "declined",
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, proposal.id))
    .returning();

  return updatedProposal[0];
};

export const getProposalSnapshot = async (proposalId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const snapshot = await dbClient
    .select()
    .from(proposalSnapshots)
    .where(eq(proposalSnapshots.proposalId, proposalId))
    .orderBy(desc(proposalSnapshots.createdAt))
    .limit(1);

  return snapshot[0] || null;
};
