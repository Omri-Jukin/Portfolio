import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure } from "../trpc";
import {
  getAllRoles,
  getRoleById,
  getRoleByName,
  createRole,
  updateRole,
  deleteRole,
} from "$/db/roles/roles";

// Validation schemas
const RolePermissionsSchema = z.object({
  canAccessAdmin: z.boolean().optional(),
  canEditContent: z.boolean().optional(),
  canEditTables: z.array(z.string()).optional(),
});

const CreateRoleSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name too long"),
  description: z.string().max(500).optional(),
  permissions: RolePermissionsSchema.optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

const UpdateRoleSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  permissions: RolePermissionsSchema.optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const rolesRouter = router({
  // Get all roles (admin only)
  getAll: adminProcedure.query(async () => {
    return await getAllRoles();
  }),

  // Get role by ID (admin only)
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const role = await getRoleById(input.id);
      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }
      return role;
    }),

  // Get role by name (admin only)
  getByName: adminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const role = await getRoleByName(input.name);
      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }
      return role;
    }),

  // Create role (admin only)
  create: adminProcedure.input(CreateRoleSchema).mutation(async ({ input }) => {
    // Check if role with same name already exists
    const existing = await getRoleByName(input.name);
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Role with this name already exists",
      });
    }

    return await createRole(input);
  }),

  // Update role (admin only)
  update: adminProcedure
    .input(UpdateRoleSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await getRoleById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      const { id, ...updateData } = input;
      return await updateRole(id, updateData);
    }),

  // Delete role (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await getRoleById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      // Prevent deletion of default roles
      const defaultRoleNames = ["admin", "editor", "user", "visitor"];
      if (defaultRoleNames.includes(existing.name.toLowerCase())) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete default system roles",
        });
      }

      const success = await deleteRole(input.id);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete role",
        });
      }
      return { success: true };
    }),
});
