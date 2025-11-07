import { TRPCError, initTRPC } from "@trpc/server";
import { createContext } from "./context";
import {
  canAccessAdminSync,
  canEditContentSync,
  canEditTableSync,
} from "#/lib/auth/rbac";
import {
  AuditAction,
  AuditResource,
  emitAudit,
  getIpAddress,
  getUserAgent,
} from "$/logging/audit";

const t = initTRPC.context<typeof createContext>().create();

// Base router and procedure helpers

/**
 * Audit logging middleware for mutations
 * Automatically logs all mutations for security and compliance
 */
const auditLoggingMiddleware = t.middleware(async function auditLog(opts) {
  const { ctx, path, type, input } = opts;

  // Only log mutations (not queries)
  if (type === "mutation") {
    // Determine resource type from path
    const resourceMap: Record<string, AuditResource> = {
      projects: "project",
      skills: "skill",
      certifications: "certification",
      education: "education",
      workExperiences: "work_experience",
      blog: "blog",
      emailTemplates: "email_template",
      intakes: "intake",
      contact: "contact",
      users: "user",
      pricing: "pricing",
      discounts: "discount",
      adminDashboard: "admin_dashboard",
    };

    const pathParts = path.split(".");
    const resource = resourceMap[pathParts[0] || ""] || "system";
    const action = pathParts[pathParts.length - 1] || "update";

    // Map action names to audit actions
    const actionMap: Record<string, AuditAction> = {
      create: "create",
      update: "update",
      delete: "delete",
      submit: "create",
      toggleVisibility: "update",
      toggleFeatured: "update",
      reorder: "update",
      bulkUpdate: "update",
      bulkDelete: "delete",
    };

    const auditAction = actionMap[action] || "update";

    // Extract resource ID from input if available
    const resourceId =
      (input && typeof input === "object" && "id" in input
        ? (input as { id?: string }).id
        : null) || null;

    // Log the mutation
    await emitAudit({
      userId: ctx.user?.id || null,
      userEmail: ctx.user?.email || null,
      userRole: ctx.user?.role || null,
      action: auditAction,
      resource,
      resourceId: resourceId || null,
      details:
        input && typeof input === "object"
          ? (input as Record<string, unknown>)
          : null,
      ipAddress: getIpAddress(ctx.req),
      userAgent: getUserAgent(ctx.req),
      success: true,
    });
  }

  return opts.next();
});

export const router = t.router;
export const procedure = t.procedure.use(auditLoggingMiddleware);
export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;
  // `ctx.user` is nullable
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      // ✅ user value is known to be non-null now
      user: ctx.user,
      db: ctx.db,
      resHeaders: ctx.resHeaders,
      req: ctx.req, // Pass request for audit logging
    },
  });
});

/**
 * Admin procedure - requires admin role
 * Only users with admin role can access these endpoints
 */
export const adminProcedure = protectedProcedure.use(
  async function requireAdmin(opts) {
    const { ctx } = opts;
    const role = ctx.user.role || "visitor";

    if (!canAccessAdminSync(role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    return opts.next();
  }
);

/**
 * Editor procedure - requires admin or editor role
 * Users with admin or editor role can access these endpoints
 */
export const editorProcedure = protectedProcedure.use(
  async function requireEditor(opts) {
    const { ctx } = opts;
    const role = ctx.user.role || "visitor";

    if (!canEditContentSync(role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Editor or admin access required",
      });
    }

    return opts.next();
  }
);

/**
 * Admin-only table procedure - checks table-specific permissions
 * @param table - Table name to check permissions for
 * @returns Procedure that checks if user can edit the specified table
 */
export function adminOnlyTableProcedure(table: string) {
  return protectedProcedure.use(async function requireTableAccess(opts) {
    const { ctx } = opts;
    const role = ctx.user.role || "visitor";

    if (!canEditTableSync(table, role)) {
      // Audit log unauthorized access attempt
      await emitAudit({
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        userRole: ctx.user.role,
        action: "unauthorized_access",
        resource: table as AuditResource,
        ipAddress: getIpAddress(ctx.req),
        userAgent: getUserAgent(ctx.req),
        success: false,
        errorMessage: `Insufficient permissions for ${table}`,
      });

      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Access denied: insufficient permissions for ${table}`,
      });
    }

    return opts.next();
  });
}
