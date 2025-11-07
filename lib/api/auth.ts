/**
 * API route authentication utilities
 * Provides helpers for protecting Next.js API routes
 */

import { auth } from "../../auth";
import { canAccessAdminSync } from "$/auth/rbac";

/**
 * Check if the request is from an authenticated admin user
 * @param request - The incoming request
 * @returns Object with isAdmin flag and user info, or null if not authenticated
 */
export async function checkAdminAccess(): Promise<{
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
} | null> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return null;
    }

    const role = (session.user.role as string) || "visitor";
    const isAdmin = canAccessAdminSync(role);

    return {
      isAdmin,
      user: {
        id: session.user.id || "",
        email: session.user.email || "",
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
 */
export async function requireAdminAccess(): Promise<{
  user: {
    id: string;
    email: string;
    role: string;
  };
}> {
  const access = await checkAdminAccess();

  if (!access || !access.isAdmin) {
    throw new Error("Admin access required");
  }

  return {
    user: access.user!,
  };
}
