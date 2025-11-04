import {
  intakes,
  intakeNotes,
  intakeStatusHistory,
  customIntakeLinks,
} from "../schema/schema.tables";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { getDB } from "../client";
import type {
  IntakeStatus,
  IntakeRiskLevel,
  IntakeNoteCategory,
} from "../schema/schema.types";

export type CreateIntakeInput = {
  email: string;
  data: Record<string, unknown>;
  proposalMd: string;
  customLinkId?: string | null;
};

export const createIntake = async (input: CreateIntakeInput) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newIntake = await dbClient
    .insert(intakes)
    .values({
      email: input.email,
      data: input.data,
      proposalMd: input.proposalMd,
      customLinkId: input.customLinkId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newIntake.length) {
    throw new Error("Failed to create intake.");
  }

  return newIntake[0];
};

export const getIntakes = async () => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const intakeList = await dbClient
    .select()
    .from(intakes)
    .orderBy(desc(intakes.createdAt));

  return intakeList;
};

export const getIntakeById = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const intake = await dbClient
    .select({
      intake: intakes,
      customLink: customIntakeLinks,
    })
    .from(intakes)
    .leftJoin(customIntakeLinks, eq(intakes.customLinkId, customIntakeLinks.id))
    .where(eq(intakes.id, id))
    .limit(1);

  if (!intake.length) {
    throw new Error("Intake not found.");
  }

  const result = intake[0];
  return {
    ...result.intake,
    customLink: result.customLink || null,
  };
};

// Update intake status
export const updateIntakeStatus = async (
  id: string,
  newStatus: IntakeStatus,
  userId?: string
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Get current status
  const currentIntake = await getIntakeById(id);
  const oldStatus = currentIntake.status as IntakeStatus;

  // Update status
  const updated = await dbClient
    .update(intakes)
    .set({
      status: newStatus,
      lastReviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(intakes.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update intake status.");
  }

  // Log status change to history (gracefully handle errors if table doesn't exist)
  try {
    await dbClient.insert(intakeStatusHistory).values({
      intakeId: id,
      oldStatus,
      newStatus,
      changedBy: userId,
    });
  } catch (historyError) {
    // Log but don't fail the status update if history logging fails
    console.warn("Failed to log status history:", historyError);
  }

  return updated[0];
};

// Toggle flagged status
export const toggleIntakeFlag = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const currentIntake = await getIntakeById(id);

  const updated = await dbClient
    .update(intakes)
    .set({
      flagged: !currentIntake.flagged,
      updatedAt: new Date(),
    })
    .where(eq(intakes.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to toggle intake flag.");
  }

  return updated[0];
};

// Add internal note
export const addIntakeNote = async (
  intakeId: string,
  note: string,
  category: IntakeNoteCategory,
  userId?: string
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newNote = await dbClient
    .insert(intakeNotes)
    .values({
      intakeId,
      note,
      category,
      createdBy: userId,
    })
    .returning();

  if (!newNote.length) {
    throw new Error("Failed to add intake note.");
  }

  return newNote[0];
};

// Delete intake note
export const deleteIntakeNote = async (noteId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deleted = await dbClient
    .delete(intakeNotes)
    .where(eq(intakeNotes.id, noteId))
    .returning();

  return deleted.length > 0;
};

// Get all notes for an intake
export const getIntakeNotes = async (intakeId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const notes = await dbClient
    .select()
    .from(intakeNotes)
    .where(eq(intakeNotes.intakeId, intakeId))
    .orderBy(desc(intakeNotes.createdAt));

  return notes;
};

// Set reminder date
export const setIntakeReminder = async (
  id: string,
  reminderDate: Date | null
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updated = await dbClient
    .update(intakes)
    .set({
      reminderDate,
      updatedAt: new Date(),
    })
    .where(eq(intakes.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to set reminder.");
  }

  return updated[0];
};

// Update estimated value
export const updateIntakeEstimatedValue = async (
  id: string,
  estimatedValue: number | null,
  riskLevel?: IntakeRiskLevel
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: {
    estimatedValue: number | null;
    riskLevel?: IntakeRiskLevel | null;
    updatedAt: Date;
  } = {
    estimatedValue,
    updatedAt: new Date(),
  };

  if (riskLevel !== undefined) {
    updateData.riskLevel = riskLevel;
  }

  const updated = await dbClient
    .update(intakes)
    .set(updateData)
    .where(eq(intakes.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Failed to update estimated value.");
  }

  return updated[0];
};

// Get status history
export const getIntakeStatusHistory = async (intakeId: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const history = await dbClient
    .select()
    .from(intakeStatusHistory)
    .where(eq(intakeStatusHistory.intakeId, intakeId))
    .orderBy(desc(intakeStatusHistory.createdAt));

  return history;
};

// Search intakes with filters
export interface IntakeFilters {
  status?: IntakeStatus[];
  flagged?: boolean;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}

export const searchIntakes = async (filters: IntakeFilters) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const conditions: ReturnType<
    typeof eq | typeof or | typeof like | typeof sql
  >[] = [];

  // Status filter
  if (filters.status && filters.status.length > 0) {
    conditions.push(or(...filters.status.map((s) => eq(intakes.status, s))));
  }

  // Flagged filter
  if (filters.flagged !== undefined) {
    conditions.push(eq(intakes.flagged, filters.flagged));
  }

  // Date range filter
  if (filters.startDate) {
    conditions.push(sql`${intakes.createdAt} >= ${filters.startDate}`);
  }
  if (filters.endDate) {
    conditions.push(sql`${intakes.createdAt} <= ${filters.endDate}`);
  }

  // Text search in email and data (JSON)
  if (filters.searchTerm) {
    const searchPattern = `%${filters.searchTerm}%`;
    conditions.push(
      or(
        like(intakes.email, searchPattern),
        sql`${intakes.data}::text ILIKE ${searchPattern}`
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await dbClient
    .select()
    .from(intakes)
    .where(whereClause)
    .orderBy(desc(intakes.createdAt));

  return results;
};

// Check if email is a returning client
export const checkReturningClient = async (email: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const previousIntakes = await dbClient
    .select()
    .from(intakes)
    .where(eq(intakes.email, email))
    .orderBy(desc(intakes.createdAt));

  return {
    isReturning: previousIntakes.length > 1,
    previousCount: previousIntakes.length,
    previousIntakes: previousIntakes.slice(0, 5), // Return up to 5 most recent
  };
};

// Get intake statistics
export const getIntakeStatistics = async () => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const allIntakes = await dbClient.select().from(intakes);

  const stats = {
    total: allIntakes.length,
    new: allIntakes.filter((i) => i.status === "new").length,
    reviewing: allIntakes.filter((i) => i.status === "reviewing").length,
    contacted: allIntakes.filter((i) => i.status === "contacted").length,
    proposalSent: allIntakes.filter((i) => i.status === "proposal_sent").length,
    accepted: allIntakes.filter((i) => i.status === "accepted").length,
    declined: allIntakes.filter((i) => i.status === "declined").length,
    flagged: allIntakes.filter((i) => i.flagged).length,
    withReminders: allIntakes.filter((i) => i.reminderDate).length,
  };

  return stats;
};
