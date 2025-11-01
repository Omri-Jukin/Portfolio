// Do not load dotenv in the Worker. Environment comes from Cloudflare.

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDB, getMockDB } from "$/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "$/auth/config";

// User type for authentication
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  // Create database client
  let db: Awaited<ReturnType<typeof getDB>> | null;

  try {
    // Use Supabase PostgreSQL database (both local and production)
    db = await getDB();

    // getDB() may return null during build time
    if (!db) {
      console.warn("Database client returned null (likely during build time)");
    }
  } catch (error) {
    console.error("Failed to create database client:", error);

    // During build time, allow the app to continue without database connection
    const isBuildTime =
      typeof process !== "undefined" &&
      (process.env.NEXT_PHASE === "phase-production-build" ||
        process.env.NEXT_PHASE === "phase-development-build");

    if (
      isBuildTime ||
      (process.env.NODE_ENV === "production" &&
        !process.env.VERCEL &&
        error instanceof Error &&
        error.message.includes("Database not available during build"))
    ) {
      console.warn("Skipping database connection during build time");
      // Return a mock database client for build time
      db = getMockDB();
    } else {
      console.error(
        "CRITICAL: Database connection failed - this is required for the app to function"
      );

      // In production, don't throw - return null db and let endpoints handle it
      // This prevents HTML error pages from being returned
      if (process.env.NODE_ENV === "production") {
        console.warn(
          "Continuing without database connection - endpoints will handle errors"
        );
        db = null;
      } else {
        // Database connection is mandatory - throw error to prevent app from running
        throw new Error(
          `Database connection failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }

  // Get user from NextAuth session
  let user: AuthenticatedUser | null = null;

  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      // Transform NextAuth session user to our AuthenticatedUser type
      user = {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        role: session.user.role || "admin",
      };
    }
  } catch (error) {
    console.error("Failed to get session:", error);
    // Continue without user - endpoints will handle authentication
  }

  // Extract origin from request for URL generation
  const origin =
    req.headers.get("origin") ||
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ||
    (process.env.NODE_ENV === "production"
      ? `https://${
          process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "") ||
          "omrijukin.com"
        }`
      : "http://localhost:3000");

  return {
    db,
    user,
    resHeaders,
    origin,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
