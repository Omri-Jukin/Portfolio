/**
 * API route authentication utilities
 * Provides helpers for protecting Next.js API routes
 */

import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAdminSync } from "$/auth/rbac";
import { env } from "$/env";

/**
 * Check if the request is from an authenticated admin user
 * @param request - The incoming request
 * @returns Object with isAdmin flag and user info, or null if not authenticated
 */
export async function checkAdminAccess(request: NextRequest): Promise<{
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
} | null> {
  try {
    const token = await getToken({
      req: request,
      secret: env.AUTH_SECRET || env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return null;
    }

    const role = (token.role as string) || "visitor";
    const isAdmin = canAccessAdminSync(role);

    return {
      isAdmin,
      user: {
        id: (token.sub || token.id || "") as string,
        email: (token.email || "") as string,
        role,
      },
    };
  } catch (error) {
    console.error("Failed to check admin access:", error);
    return null;
  }
}

/**
 * Require admin access for an API route
 * Throws an error if the user is not an admin
 * @param request - The incoming request
 */
export async function requireAdminAccess(request: NextRequest): Promise<{
  user: {
    id: string;
    email: string;
    role: string;
  };
}> {
  const access = await checkAdminAccess(request);

  if (!access || !access.isAdmin) {
    throw new Error("Admin access required");
  }

  return {
    user: access.user!,
  };
}
