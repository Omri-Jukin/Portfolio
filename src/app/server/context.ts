// Do not load dotenv in the Worker. Environment comes from Cloudflare.

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDB, getMockDB } from "$/db/client";
import { auth } from "../../../auth";

// User type for authentication
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

const DB_CONTEXT_TIMEOUT_MS = 6000;

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  // Create database client (with timeout so dashboard never hangs indefinitely)
  let db: Awaited<ReturnType<typeof getDB>> | null;

  try {
    const dbPromise = getDB();
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error("Database connection timeout")),
        DB_CONTEXT_TIMEOUT_MS,
      ),
    );
    db = await Promise.race([dbPromise, timeoutPromise]);
  } catch (error) {
    console.error("Failed to create database client:", error);

    const isTimeout =
      error instanceof Error &&
      error.message === "Database connection timeout";

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
      // Skipping database connection during build time
      db = getMockDB();
    } else if (isTimeout) {
      // Timeout: continue without DB so auth/session still work; dashboard can show default sections
      console.error("Database connection timed out - continuing without DB");
      db = null;
    } else {
      console.error(
        "CRITICAL: Database connection failed - this is required for the app to function",
      );

      if (process.env.NODE_ENV === "production") {
        db = null;
      } else {
        throw new Error(
          `Database connection failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }
  }

  // Get user from Auth.js session
  let user: AuthenticatedUser | null = null;

  try {
    const session = await auth();

    if (session?.user) {
      // Transform Auth.js session user to our AuthenticatedUser type
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
    req, // Include request for audit logging
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
