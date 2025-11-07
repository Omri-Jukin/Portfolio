/**
 * Roles database operations
 * Manages CRUD operations for the roles table
 */

import { getDB } from "../client";
import { roles } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import type { RolePermissions } from "$/auth/rbac";

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  permissions: RolePermissions | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleInput {
  name: string;
  displayName: string;
  description?: string;
  permissions?: RolePermissions;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateRoleInput {
  displayName?: string;
  description?: string;
  permissions?: RolePermissions;
  isActive?: boolean;
  displayOrder?: number;
}

/**
 * Get all active roles from the database
 */
export async function getAllRoles(): Promise<Role[]> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const dbRoles = await db.select().from(roles).orderBy(roles.displayOrder);

  return dbRoles.map((role) => ({
    id: role.id,
    name: role.name,
    displayName: role.displayName,
    description: role.description,
    permissions: role.permissions as RolePermissions | null,
    isActive: role.isActive,
    displayOrder: role.displayOrder,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }));
}

/**
 * Get a role by name
 */
export async function getRoleByName(name: string): Promise<Role | null> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const [role] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name.toLowerCase()))
    .limit(1);

  if (!role) {
    return null;
  }

  return {
    id: role.id,
    name: role.name,
    displayName: role.displayName,
    description: role.description,
    permissions: role.permissions as RolePermissions | null,
    isActive: role.isActive,
    displayOrder: role.displayOrder,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

/**
 * Get a role by ID
 */
export async function getRoleById(id: string): Promise<Role | null> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const [role] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);

  if (!role) {
    return null;
  }

  return {
    id: role.id,
    name: role.name,
    displayName: role.displayName,
    description: role.description,
    permissions: role.permissions as RolePermissions | null,
    isActive: role.isActive,
    displayOrder: role.displayOrder,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

/**
 * Create a new role
 */
export async function createRole(input: CreateRoleInput): Promise<Role> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const [newRole] = await db
    .insert(roles)
    .values({
      name: input.name.toLowerCase(),
      displayName: input.displayName,
      description: input.description || null,
      permissions: input.permissions || null,
      isActive: input.isActive ?? true,
      displayOrder: input.displayOrder ?? 0,
    })
    .returning();

  return {
    id: newRole.id,
    name: newRole.name,
    displayName: newRole.displayName,
    description: newRole.description,
    permissions: newRole.permissions as RolePermissions | null,
    isActive: newRole.isActive,
    displayOrder: newRole.displayOrder,
    createdAt: newRole.createdAt,
    updatedAt: newRole.updatedAt,
  };
}

/**
 * Update a role
 */
export async function updateRole(
  id: string,
  input: UpdateRoleInput
): Promise<Role> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const [updatedRole] = await db
    .update(roles)
    .set({
      displayName: input.displayName,
      description: input.description,
      permissions: input.permissions,
      isActive: input.isActive,
      displayOrder: input.displayOrder,
      updatedAt: new Date(),
    })
    .where(eq(roles.id, id))
    .returning();

  return {
    id: updatedRole.id,
    name: updatedRole.name,
    displayName: updatedRole.displayName,
    description: updatedRole.description,
    permissions: updatedRole.permissions as RolePermissions | null,
    isActive: updatedRole.isActive,
    displayOrder: updatedRole.displayOrder,
    createdAt: updatedRole.createdAt,
    updatedAt: updatedRole.updatedAt,
  };
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<boolean> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.delete(roles).where(eq(roles.id, id)).returning();

  return result.length > 0;
}

/**
 * Initialize default roles if they don't exist
 * This should be called during application startup or migration
 */
export async function initializeDefaultRoles(): Promise<void> {
  const db = await getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  const defaultRoles: CreateRoleInput[] = [
    {
      name: "admin",
      displayName: "Administrator",
      description:
        "Full system access - can access admin panel and all system configuration",
      permissions: {
        canAccessAdmin: true,
        canEditContent: true,
        canEditTables: ["*"], // All tables
      },
      isActive: true,
      displayOrder: 0,
    },
    {
      name: "editor",
      displayName: "Editor",
      description:
        "Content management access - can edit content but NOT system configuration",
      permissions: {
        canAccessAdmin: false,
        canEditContent: true,
        canEditTables: [
          "projects",
          "skills",
          "certifications",
          "education",
          "workExperiences",
          "services",
          "testimonials",
          "blog",
        ],
      },
      isActive: true,
      displayOrder: 1,
    },
    {
      name: "user",
      displayName: "User",
      description:
        "Customer/employer account - NO admin panel access, limited to profile/portfolio viewing",
      permissions: {
        canAccessAdmin: false,
        canEditContent: false,
        canEditTables: [],
      },
      isActive: true,
      displayOrder: 2,
    },
    {
      name: "visitor",
      displayName: "Visitor",
      description: "Unauthenticated user - public access only",
      permissions: {
        canAccessAdmin: false,
        canEditContent: false,
        canEditTables: [],
      },
      isActive: true,
      displayOrder: 3,
    },
  ];

  for (const roleInput of defaultRoles) {
    const existingRole = await getRoleByName(roleInput.name);
    if (!existingRole) {
      await createRole(roleInput);
    }
  }
}
