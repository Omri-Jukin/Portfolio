/**
 * Tests for Next.js middleware role-based protection
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { NextRequest } from "next/server";
import middleware from "../src/middleware";
import { canAccessAdminSync } from "$/auth/rbac";

// Mock next-auth/jwt
jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

// Mock next-intl/middleware
jest.mock("next-intl/middleware", () => {
  return jest.fn(() => {
    return async () => {
      return new Response("OK", { status: 200 });
    };
  });
});

// Mock RBAC
jest.mock("$/auth/rbac", () => ({
  canAccessAdminSync: jest.fn(),
}));

// Mock session token utilities
jest.mock("#/lib/utils/sessionToken", () => ({
  verifyIntakeSessionToken: jest.fn(),
  generateIntakeSessionToken: jest.fn(),
}));

describe("Middleware Role-Based Protection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment
    process.env.AUTH_SECRET = "test-secret";
    process.env.NEXTAUTH_SECRET = "test-secret";
  });

  describe("Admin Route Protection", () => {
    it("should allow access for admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        role: "admin",
        id: "user-id",
        email: "user@example.com",
      });
      (canAccessAdminSync as jest.Mock).mockReturnValue(true);

      const request = new NextRequest(
        new URL("https://example.com/en/admin/dashboard")
      );

      const response = await middleware(request);

      expect(getToken).toHaveBeenCalled();
      expect(canAccessAdminSync).toHaveBeenCalledWith("admin");
      // Should not redirect (allow access)
      expect(response.status).not.toBe(307); // 307 is redirect
    });

    it("should redirect to login for unauthenticated users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue(null);

      const request = new NextRequest(
        new URL("https://example.com/en/admin/dashboard")
      );

      const response = await middleware(request);

      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get("location")).toContain("/en/login");
      expect(response.headers.get("location")).toContain("redirectTo");
    });

    it("should redirect to 403 for non-admin users", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        role: "user",
        sub: "user-id",
      });
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const request = new NextRequest(
        new URL("https://example.com/en/admin/dashboard")
      );

      const response = await middleware(request);

      expect(getToken).toHaveBeenCalled();
      expect(canAccessAdminSync).toHaveBeenCalledWith("user");
      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get("location")).toContain("/en/403");
    });

    it("should redirect to 403 for editor users (no admin access)", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue({
        role: "editor",
        sub: "user-id",
      });
      (canAccessAdminSync as jest.Mock).mockReturnValue(false);

      const request = new NextRequest(
        new URL("https://example.com/en/admin/dashboard")
      );

      const response = await middleware(request);

      expect(canAccessAdminSync).toHaveBeenCalledWith("editor");
      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get("location")).toContain("/en/403");
    });

    it("should handle errors gracefully and redirect to login", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockRejectedValue(new Error("Token error"));

      const request = new NextRequest(
        new URL("https://example.com/en/admin/dashboard")
      );

      const response = await middleware(request);

      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get("location")).toContain("/en/login");
    });

    it("should protect all admin routes regardless of sub-path", async () => {
      const { getToken } = await import("next-auth/jwt");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getToken as jest.Mock<any>).mockResolvedValue(null);

      const adminRoutes = [
        "/en/admin",
        "/en/admin/",
        "/en/admin/dashboard",
        "/en/admin/projects",
        "/en/admin/settings",
        "/he/admin",
        "/es/admin/users",
        "/fr/admin/analytics",
      ];

      for (const route of adminRoutes) {
        const request = new NextRequest(new URL(`https://example.com${route}`));
        const response = await middleware(request);
        expect(response.status).toBe(307); // All should redirect
        expect(response.headers.get("location")).toContain("/login");
      }
    });
  });

  describe("Intake Route Protection", () => {
    it("should allow access to intake routes with valid session token", async () => {
      const { verifyIntakeSessionToken } = await import(
        "#/lib/utils/sessionToken"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (verifyIntakeSessionToken as jest.Mock<any>).mockResolvedValue({
        isValid: true,
      });

      const request = new NextRequest(new URL("https://example.com/en/intake"));
      request.headers.set("cookie", "intake-session-token=valid-token-here");

      const response = await middleware(request);

      // Should allow access (not redirect)
      expect(response.status).not.toBe(307);
    });

    it("should allow slug-based intake routes", async () => {
      const request = new NextRequest(
        new URL("https://example.com/en/intake/custom-slug")
      );

      const response = await middleware(request);

      // Slug-based routes are allowed to proceed (validation happens in page)
      expect(response.status).not.toBe(307);
    });
  });

  describe("Public Route Access", () => {
    it("should allow access to public routes", async () => {
      const publicRoutes = [
        "/en",
        "/en/about",
        "/en/projects",
        "/en/contact",
        "/he",
        "/es/blog",
      ];

      for (const route of publicRoutes) {
        const request = new NextRequest(new URL(`https://example.com${route}`));
        const response = await middleware(request);
        // Public routes should not redirect
        expect(response.status).not.toBe(307);
      }
    });
  });
});
