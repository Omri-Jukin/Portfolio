import { proposalEvents } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { getDB } from "../client";

export type LogEventInput = {
  proposalId: string;
  event: string;
  payload?: Record<string, unknown>;
  actorId?: string | null;
};

export const logEvent = async (input: LogEventInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newEvent = await dbClient
    .insert(proposalEvents)
    .values({
      proposalId: input.proposalId,
      actorId: input.actorId || null,
      event: input.event,
      payload: input.payload || {},
      occurredAt: new Date(),
    })
    .returning();

  if (!newEvent.length) {
    throw new Error("Failed to log event.");
  }

  return newEvent[0];
};

export const getEventsByProposalId = async (proposalId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const events = await dbClient
    .select()
    .from(proposalEvents)
    .where(eq(proposalEvents.proposalId, proposalId))
    .orderBy(desc(proposalEvents.occurredAt));

  return events;
};
