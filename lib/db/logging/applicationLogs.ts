import { applicationLogs } from "../schema/schema.tables";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { getDB } from "../client";
import type {
  ApplicationLogLevel,
  ApplicationLogCategory,
} from "../schema/schema.types";

export interface CreateApplicationLogInput {
  level: ApplicationLogLevel;
  category: ApplicationLogCategory;
  message: string;
  metadata?: Record<string, unknown>;
  userId?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  errorCode?: string | null;
  stackTrace?: string | null;
  duration?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ApplicationLogFilters {
  level?: ApplicationLogLevel[];
  category?: ApplicationLogCategory[];
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

/**
 * Create a new application log entry
 */
export const createApplicationLog = async (
  input: CreateApplicationLogInput
) => {
  const dbClient = await getDB();
  if (!dbClient) {
    // In build-time scenarios, just log to console
    console.warn(
      "[APPLICATION_LOG] Database not available, logging to console:",
      input
    );
    return null;
  }

  try {
    // Normalize empty strings to null for UUID and text fields
    const normalizeString = (
      value: string | null | undefined
    ): string | null => {
      if (value === null || value === undefined) {
        return null;
      }
      if (typeof value === "string" && value.trim() === "") {
        return null;
      }
      return value;
    };

    const newLog = await dbClient
      .insert(applicationLogs)
      .values({
        level: input.level,
        category: input.category,
        message: input.message,
        metadata: input.metadata || {},
        userId: normalizeString(input.userId),
        resourceType: normalizeString(input.resourceType),
        resourceId: normalizeString(input.resourceId),
        errorCode: normalizeString(input.errorCode),
        stackTrace: normalizeString(input.stackTrace),
        duration: input.duration || null,
        ipAddress: normalizeString(input.ipAddress),
        userAgent: normalizeString(input.userAgent),
        createdAt: new Date(),
      })
      .returning();

    return newLog[0] || null;
  } catch (error) {
    // Don't throw errors from logging - it should never break the main flow
    console.error("[APPLICATION_LOG] Failed to create log entry:", error);
    return null;
  }
};

/**
 * Get application logs with optional filters
 */
export const getApplicationLogs = async (filters?: ApplicationLogFilters) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const conditions: ReturnType<
    typeof eq | typeof and | typeof gte | typeof lte | typeof sql
  >[] = [];

  if (filters?.level && filters.level.length > 0) {
    conditions.push(sql`${applicationLogs.level} = ANY(${filters.level})`);
  }

  if (filters?.category && filters.category.length > 0) {
    conditions.push(
      sql`${applicationLogs.category} = ANY(${filters.category})`
    );
  }

  if (filters?.userId) {
    conditions.push(eq(applicationLogs.userId, filters.userId));
  }

  if (filters?.resourceType) {
    conditions.push(eq(applicationLogs.resourceType, filters.resourceType));
  }

  if (filters?.resourceId) {
    conditions.push(eq(applicationLogs.resourceId, filters.resourceId));
  }

  if (filters?.startDate) {
    conditions.push(gte(applicationLogs.createdAt, filters.startDate));
  }

  if (filters?.endDate) {
    conditions.push(lte(applicationLogs.createdAt, filters.endDate));
  }

  if (filters?.searchTerm) {
    const searchPattern = `%${filters.searchTerm}%`;
    conditions.push(sql`${applicationLogs.message} ILIKE ${searchPattern}`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const logs = await dbClient
    .select()
    .from(applicationLogs)
    .where(whereClause)
    .orderBy(desc(applicationLogs.createdAt))
    .limit(1000); // Limit to prevent huge queries

  return logs;
};

/**
 * Get a single application log by ID
 */
export const getApplicationLogById = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const log = await dbClient
    .select()
    .from(applicationLogs)
    .where(eq(applicationLogs.id, id))
    .limit(1);

  return log[0] || null;
};
