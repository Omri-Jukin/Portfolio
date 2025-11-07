/**
 * Role-Based Access Control (RBAC) utilities
 *
 * Provides functions to check user permissions based on their role.
 * Roles are fetched dynamically from the database roles table.
 */

import { getDB } from "$/db/client";
import { roles } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

/**
 * TypeScript type for roles (compile-time safety)
 * This is a fallback type - actual roles come from the database
 */
export type Role = string;

/**
 * Authenticated user interface for type safety
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

/**
 * Role permissions interface
 */
export interface RolePermissions {
  canAccessAdmin?: boolean;
  canEditContent?: boolean;
  canEditTables?: string[];
}

/**
 * Cached roles data
 */
interface CachedRoles {
  roles: Map<string, RolePermissions>;
  timestamp: number;
}

let rolesCache: CachedRoles | null = null;
const ROLES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Admin-only tables that require admin role to edit
 * These are hardcoded as they represent system-level tables
 */
const ADMIN_ONLY_TABLES = [
  "intakes",
  "emailTemplates",
  "calculatorSettings",
  "adminDashboardSections",
  "pricing",
] as const;

/**
 * Fetches all active roles from the database
 * Results are cached for 5 minutes to reduce database queries
 * @returns Map of role names to their permissions
 */
export async function getRolesFromDB(): Promise<Map<string, RolePermissions>> {
  // Return cached roles if still valid
  const now = Date.now();
  if (rolesCache && now - rolesCache.timestamp < ROLES_CACHE_TTL) {
    return rolesCache.roles;
  }

  try {
    const db = await getDB();
    if (!db) {
      // Database unavailable, return empty map (will fall back to default behavior)
      return new Map();
    }

    // Fetch all active roles from database
    const dbRoles = await db
      .select()
      .from(roles)
      .where(eq(roles.isActive, true));

    // Build map of role names to permissions
    const rolesMap = new Map<string, RolePermissions>();
    for (const role of dbRoles) {
      rolesMap.set(role.name.toLowerCase(), {
        canAccessAdmin: role.permissions?.canAccessAdmin ?? false,
        canEditContent: role.permissions?.canEditContent ?? false,
        canEditTables: role.permissions?.canEditTables ?? [],
      });
    }

    // Update cache
    rolesCache = {
      roles: rolesMap,
      timestamp: now,
    };

    return rolesMap;
  } catch (error) {
    console.error("Failed to fetch roles from database:", error);
    // Return empty map on error (will fall back to default behavior)
    return new Map();
  }
}

/**
 * Clears the roles cache (useful for testing or when roles are updated)
 */
export function clearRolesCache(): void {
  rolesCache = null;
}

/**
 * Gets permissions for a specific role from the database
 * @param roleName - Role name to get permissions for
 * @returns Role permissions or null if role doesn't exist
 */
export async function getRolePermissions(
  roleName: string
): Promise<RolePermissions | null> {
  const rolesMap = await getRolesFromDB();
  return rolesMap.get(roleName.toLowerCase()) || null;
}

/**
 * Check if a user role can access admin features
 * Checks permissions from the database roles table
 * @param role - User role name
 * @returns true if role has canAccessAdmin permission, false otherwise
 */
export async function canAccessAdmin(role: string): Promise<boolean> {
  const permissions = await getRolePermissions(role);
  return permissions?.canAccessAdmin ?? false;
}

/**
 * Synchronous version of canAccessAdmin that uses cached roles
 * Falls back to checking if role is "admin" if cache is unavailable
 * @param role - User role name
 * @returns true if role can access admin, false otherwise
 */
export function canAccessAdminSync(role: string): boolean {
  if (rolesCache) {
    const permissions = rolesCache.roles.get(role.toLowerCase());
    return permissions?.canAccessAdmin ?? false;
  }
  // Fallback to default behavior if cache is not available
  if (!role || typeof role !== "string") {
    return false;
  }
  return role.toLowerCase() === "admin";
}

/**
 * Check if a user role can edit content
 * Checks permissions from the database roles table
 * @param role - User role name
 * @returns true if role has canEditContent permission, false otherwise
 */
export async function canEditContent(role: string): Promise<boolean> {
  const permissions = await getRolePermissions(role);
  return permissions?.canEditContent ?? false;
}

/**
 * Synchronous version of canEditContent that uses cached roles
 * Falls back to checking if role is "admin" or "editor" if cache is unavailable
 * @param role - User role name
 * @returns true if role can edit content, false otherwise
 */
export function canEditContentSync(role: string): boolean {
  if (!role || typeof role !== "string") {
    return false;
  }

  if (rolesCache) {
    const permissions = rolesCache.roles.get(role.toLowerCase());
    return permissions?.canEditContent ?? false;
  }
  // Fallback to default behavior if cache is not available
  const roleLower = role.toLowerCase();
  return roleLower === "admin" || roleLower === "editor";
}

/**
 * Check if a user role can edit a specific table
 * Checks permissions from the database roles table
 * Admin-only tables require canAccessAdmin permission
 * @param table - Table name to check permissions for
 * @param role - User role name
 * @returns true if user has permission to edit the table, false otherwise
 */
export async function canEditTable(
  table: string,
  role: string
): Promise<boolean> {
  const permissions = await getRolePermissions(role);
  if (!permissions) {
    return false;
  }

  // Admin-only tables require canAccessAdmin permission
  if (ADMIN_ONLY_TABLES.includes(table as (typeof ADMIN_ONLY_TABLES)[number])) {
    return permissions.canAccessAdmin ?? false;
  }

  // Check if role has permission to edit this specific table
  if (permissions.canEditTables?.includes(table)) {
    return true;
  }

  // Fallback: if canEditContent is true, allow editing content tables
  return permissions.canEditContent ?? false;
}

/**
 * Synchronous version of canEditTable that uses cached roles
 * @param table - Table name to check permissions for
 * @param role - User role name
 * @returns true if user has permission to edit the table, false otherwise
 */
export function canEditTableSync(table: string, role: string): boolean {
  if (!role || typeof role !== "string") {
    return false;
  }

  if (!rolesCache) {
    // Fallback to default behavior if cache is not available
    const roleLower = role.toLowerCase();
    if (
      ADMIN_ONLY_TABLES.includes(table as (typeof ADMIN_ONLY_TABLES)[number])
    ) {
      return roleLower === "admin";
    }
    return roleLower === "admin" || roleLower === "editor";
  }

  const permissions = rolesCache.roles.get(role.toLowerCase());
  if (!permissions) {
    return false;
  }

  // Admin-only tables require canAccessAdmin permission
  if (ADMIN_ONLY_TABLES.includes(table as (typeof ADMIN_ONLY_TABLES)[number])) {
    return permissions.canAccessAdmin ?? false;
  }

  // Check if role has permission to edit this specific table
  if (permissions.canEditTables?.includes(table)) {
    return true;
  }

  // Fallback: if canEditContent is true, allow editing content tables
  return permissions.canEditContent ?? false;
}

/**
 * Safely extract user role from AuthenticatedUser object
 * Validates role against database and falls back to "visitor" if invalid or null
 * @param user - AuthenticatedUser object or null
 * @returns Valid role name, defaults to "visitor" if user is null or role is invalid
 */
export async function getUserRole(
  user: AuthenticatedUser | null
): Promise<string> {
  if (!user || !user.role) {
    return "visitor";
  }

  const roleName = user.role.toLowerCase();
  const rolesMap = await getRolesFromDB();

  // Check if role exists in database
  if (rolesMap.has(roleName)) {
    return roleName;
  }

  // Invalid role, default to visitor
  return "visitor";
}

/**
 * Synchronous version of getUserRole that uses cached roles
 * @param user - AuthenticatedUser object or null
 * @returns Valid role name, defaults to "visitor" if user is null or role is invalid
 */
export function getUserRoleSync(user: AuthenticatedUser | null): string {
  if (!user || !user.role) {
    return "visitor";
  }

  const roleName = user.role.toLowerCase();

  if (rolesCache) {
    // Check if role exists in cached roles
    if (rolesCache.roles.has(roleName)) {
      return roleName;
    }
  }

  // Fallback: check against default roles if cache is not available
  const defaultRoles = ["admin", "editor", "user", "visitor"];
  if (defaultRoles.includes(roleName)) {
    return roleName;
  }

  // Invalid role, default to visitor
  return "visitor";
}
