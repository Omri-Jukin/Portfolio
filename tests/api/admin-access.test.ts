/**
 * Integration tests for admin endpoint protection
 * Tests that API routes correctly enforce role-based access control
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock next/server before any imports
jest.mock("next/server", () => {
  // Create minimal mocks that don't require Request
  return {
    NextRequest: class NextRequest {
      headers = new Map();
      constructor(public url: string) {}
    },
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status || 200,
        body,
      }),
    },
  };
});

import { NextRequest } from "next/server";

// Mock getToken from next-auth/jwt
jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

// Mock RBAC
jest.mock("$/auth/rbac", () => ({
  canAccessAdminSync: jest.fn(),
}));

// Mock env
jest.mock("$/env", () => ({
  env: {
    AUTH_SECRET: "test-secret",
    NEXTAUTH_SECRET: "test-secret",
  },
}));

describe("API Route Admin Access Protection", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = new NextRequest("http://localhost:3000/api/debug");
  });

  describe("/api/debug", () => {
    it("should allow access for admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "admin-id",
        email: "admin@example.com",
        role: "admin",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { requireAdminAccess } = await import("$/api/auth");

      const result = await requireAdminAccess(mockRequest);

      expect(result.user.role).toBe("admin");
      expect(result.user.email).toBe("admin@example.com");
    });

    it("should deny access for non-admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "user-id",
        email: "user@example.com",
        role: "user",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess(mockRequest)).rejects.toThrow(
        "Admin access required"
      );
    });

    it("should deny access for unauthenticated users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue(null);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess(mockRequest)).rejects.toThrow(
        "Admin access required"
      );
    });

    it("should deny access for editor users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "editor-id",
        email: "editor@example.com",
        role: "editor",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess(mockRequest)).rejects.toThrow(
        "Admin access required"
      );
    });
  });

  describe("/api/test-db", () => {
    it("should allow access for admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "admin-id",
        email: "admin@example.com",
        role: "admin",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { requireAdminAccess } = await import("$/api/auth");

      const result = await requireAdminAccess(mockRequest);

      expect(result.user.role).toBe("admin");
    });

    it("should deny access for non-admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "user-id",
        email: "user@example.com",
        role: "user",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess(mockRequest)).rejects.toThrow();
    });
  });

  describe("/api/upload", () => {
    it("should allow access for admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "admin-id",
        email: "admin@example.com",
        role: "admin",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { requireAdminAccess } = await import("$/api/auth");

      const result = await requireAdminAccess(mockRequest);

      expect(result.user.role).toBe("admin");
    });

    it("should deny access for non-admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "user-id",
        email: "user@example.com",
        role: "user",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const { requireAdminAccess } = await import("$/api/auth");

      await expect(requireAdminAccess(mockRequest)).rejects.toThrow();
    });
  });

  describe("Role-based access control", () => {
    it("should correctly identify admin role", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        sub: "admin-id",
        email: "admin@example.com",
        role: "admin",
      });

      const { canAccessAdminSync } = await import("$/auth/rbac");
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const { checkAdminAccess } = await import("$/api/auth");

      const result = await checkAdminAccess(mockRequest);

      expect(result).not.toBeNull();
      expect(result?.isAdmin).toBe(true);
      expect(result?.user?.role).toBe("admin");
    });

    it("should correctly identify non-admin roles", async () => {
      const nonAdminRoles = ["user", "editor", "visitor"];

      for (const role of nonAdminRoles) {
        const { getToken } = await import("next-auth/jwt");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (getToken as jest.Mock<any>).mockResolvedValue(
          role === "visitor"
            ? null
            : {
                sub: `${role}-id`,
                email: `${role}@example.com`,
                role,
              }
        );

        const { canAccessAdminSync } = await import("$/auth/rbac");
        (canAccessAdminSync as jest.Mock).mockReturnValue(false);

        const { checkAdminAccess } = await import("$/api/auth");

        const result = await checkAdminAccess(mockRequest);

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
