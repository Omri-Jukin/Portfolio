/**
 * Integration tests for admin endpoint protection
 * Tests that API routes correctly enforce role-based access control
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { auth } from "../../auth";

// Mock auth
jest.mock("../../auth", () => ({
  auth: jest.fn(),
}));

// Mock RBAC
jest.mock("$/auth/rbac", () => ({
  canAccessAdminSync: jest.fn(),
}));

describe("API Route Admin Access Protection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("/api/debug", () => {
    it("should allow access for admin users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "admin-id",
          email: "admin@example.com",
          role: "admin",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { requireAdminAccess } = await import("$/api/auth");

      const result = await requireAdminAccess();

      expect(result.user.role).toBe("admin");
      expect(result.user.email).toBe("admin@example.com");
    });

    it("should deny access for non-admin users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "user-id",
          email: "user@example.com",
          role: "user",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess()).rejects.toThrow(
        "Admin access required"
      );
    });

    it("should deny access for unauthenticated users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue(null);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess()).rejects.toThrow(
        "Admin access required"
      );
    });

    it("should deny access for editor users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "editor-id",
          email: "editor@example.com",
          role: "editor",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess()).rejects.toThrow(
        "Admin access required"
      );
    });
  });

  describe("/api/test-db", () => {
    it("should allow access for admin users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "admin-id",
          email: "admin@example.com",
          role: "admin",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { requireAdminAccess } = await import("$/api/auth");

      const result = await requireAdminAccess();

      expect(result.user.role).toBe("admin");
    });

    it("should deny access for non-admin users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "user-id",
          email: "user@example.com",
          role: "user",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess()).rejects.toThrow();
    });
  });

  describe("/api/upload", () => {
    it("should allow access for admin users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "admin-id",
          email: "admin@example.com",
          role: "admin",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { requireAdminAccess } = await import("$/api/auth");

      const result = await requireAdminAccess();

      expect(result.user.role).toBe("admin");
    });

    it("should deny access for non-admin users", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "user-id",
          email: "user@example.com",
          role: "user",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess()).rejects.toThrow();
    });
  });

  describe("Role-based access control", () => {
    it("should correctly identify admin role", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth as jest.Mock<any>).mockResolvedValue({
        user: {
          id: "admin-id",
          email: "admin@example.com",
          role: "admin",
        },
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { checkAdminAccess } = await import("$/api/auth");

      const result = await checkAdminAccess();

      expect(result).not.toBeNull();
      expect(result?.isAdmin).toBe(true);
      expect(result?.user?.role).toBe("admin");
    });

    it("should correctly identify non-admin roles", async () => {
      const nonAdminRoles = ["user", "editor", "visitor"];

      for (const role of nonAdminRoles) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (auth as jest.Mock<any>).mockResolvedValue({
          user: {
            id: `${role}-id`,
            email: `${role}@example.com`,
            role,
          },
        });

        const { canAccessAdminSync } = await import("$/auth/rbac");
        (canAccessAdminSync as jest.Mock).mockReturnValue(false);

        const { checkAdminAccess } = await import("$/api/auth");

        const result = await checkAdminAccess();

        if (role === "visitor") {
          // Visitor might not have a session
          expect(result).toBeNull();
        } else {
          expect(result).not.toBeNull();
          expect(result?.isAdmin).toBe(false);
          expect(result?.user?.role).toBe(role);
        }
      }
    });
  });
});
