import { auditLogs } from "../schema/schema.tables";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { getDB } from "../client";
import type { AuditAction, AuditResource } from "$/logging/audit";
import { AuditLogResource } from "../schema/schema.types";

export interface CreateAuditLogInput {
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: AuditAction;
  resource: AuditLogResource;
  resourceId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  success?: boolean;
  errorMessage?: string | null;
}

export interface AuditLogFilters {
  userId?: string;
  action?: AuditAction[];
  resource?: AuditResource[];
  resourceId?: string;
  success?: boolean;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

/**
 * Create a new audit log entry
 */
export const createAuditLog = async (input: CreateAuditLogInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    // In build-time scenarios, just log to console
    console.warn(
      "[AUDIT_LOG] Database not available, logging to console:",
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

    const logValues = {
      userId: normalizeString(input.userId) ?? undefined,
      userEmail: normalizeString(input.userEmail) ?? undefined,
      userRole: normalizeString(input.userRole) ?? undefined,
      action: input.action,
      resource: input.resource,
      resourceId: normalizeString(input.resourceId) ?? undefined,
      details: input.details ?? {},
      ipAddress: normalizeString(input.ipAddress) ?? undefined,
      userAgent: normalizeString(input.userAgent) ?? undefined,
      success: input.success ?? true,
      errorMessage: normalizeString(input.errorMessage) ?? undefined,
      createdAt: new Date(),
    };

    const newLog = await dbClient
      .insert(auditLogs)
      .values(logValues)
      .returning();

    return newLog[0] || null;
  } catch (error) {
    // Don't throw errors from audit logging - it should never break the main flow
    console.error("[AUDIT_LOG] Failed to create audit log entry:", error);
    return null;
  }
};

/**
 * Get audit logs with optional filters
 */
export const getAuditLogs = async (filters?: AuditLogFilters) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const conditions: ReturnType<
    typeof eq | typeof and | typeof gte | typeof lte | typeof sql
  >[] = [];

  if (filters?.userId) {
    conditions.push(eq(auditLogs.userId, filters.userId));
  }

  if (filters?.action && filters.action.length > 0) {
    conditions.push(sql`${auditLogs.action} = ANY(${filters.action})`);
  }

  if (filters?.resource && filters.resource.length > 0) {
    conditions.push(sql`${auditLogs.resource} = ANY(${filters.resource})`);
  }

  if (filters?.resourceId) {
    conditions.push(eq(auditLogs.resourceId, filters.resourceId));
  }

  if (filters?.success !== undefined) {
    conditions.push(eq(auditLogs.success, filters.success));
  }

  if (filters?.startDate) {
    conditions.push(gte(auditLogs.createdAt, filters.startDate));
  }

  if (filters?.endDate) {
    conditions.push(lte(auditLogs.createdAt, filters.endDate));
  }

  if (filters?.searchTerm) {
    const searchPattern = `%${filters.searchTerm}%`;
    conditions.push(
      sql`${auditLogs.userEmail} ILIKE ${searchPattern} OR ${auditLogs.errorMessage} ILIKE ${searchPattern}`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const logs = await dbClient
    .select()
    .from(auditLogs)
    .where(whereClause)
    .orderBy(desc(auditLogs.createdAt))
    .limit(1000); // Limit to prevent huge queries

  return logs;
};

/**
 * Get a single audit log by ID
 */
export const getAuditLogById = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const log = await dbClient
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.id, id))
    .limit(1);

  return log[0] || null;
};
