/**
 * Audit logging module
 * Tracks mutations and access attempts for security and compliance
 */

import { getDB } from "$/db/client";
import { createAuditLog } from "$/db/logging/auditLogs";
import { AuditLogResource } from "$/db/schema/schema.types";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "read"
  | "login"
  | "logout"
  | "access_denied"
  | "unauthorized_access";

export type AuditResource =
  | "project"
  | "skill"
  | "certification"
  | "education"
  | "work_experience"
  | "blog"
  | "email_template"
  | "intake"
  | "contact"
  | "user"
  | "pricing"
  | "discount"
  | "admin_dashboard"
  | "system"
  | "proposal";

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  errorMessage: string | null;
  createdAt: Date;
}

/**
 * Emit an audit log entry
 * @param entry - The audit log entry to record
 */
export async function emitAudit(entry: {
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
}): Promise<void> {
  try {
    const db = await getDB();
    if (!db) {
      // In build-time scenarios, just log to console
      console.warn(
        "[AUDIT] Database not available, logging to console:",
        entry
      );
      return;
    }

    // Write to database
    const dbLog = await createAuditLog({
      userId: entry.userId || null,
      userEmail: entry.userEmail || null,
      userRole: entry.userRole || null,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId || null,
      details: entry.details || null,
      ipAddress: entry.ipAddress || null,
      userAgent: entry.userAgent || null,
      success: entry.success ?? true,
      errorMessage: entry.errorMessage || null,
    });

    // Also log to console in development for easier debugging
    if (process.env.NODE_ENV === "development") {
      const logEntry: AuditLogEntry = {
        id: dbLog?.id || crypto.randomUUID(),
        userId: entry.userId || null,
        userEmail: entry.userEmail || null,
        userRole: entry.userRole || null,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId || null,
        details: entry.details || null,
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
        success: entry.success ?? true,
        errorMessage: entry.errorMessage || null,
        createdAt: new Date(),
      };
      console.log("[AUDIT]", JSON.stringify(logEntry, null, 2));
    }
  } catch (error) {
    // Don't throw errors from audit logging - it should never break the main flow
    console.error("[AUDIT] Failed to emit audit log:", error);
  }
}

/**
 * Helper to extract IP address from request
 */
export function getIpAddress(request: Request | null): string | null {
  if (!request) return null;

  // Try various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return null;
}

/**
 * Helper to extract user agent from request
 */
export function getUserAgent(request: Request | null): string | null {
  if (!request) return null;
  return request.headers.get("user-agent");
}
