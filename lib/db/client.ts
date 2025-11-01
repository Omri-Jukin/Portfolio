import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/schema.tables";

// Global connection instance
let globalConnection: ReturnType<typeof postgres> | null = null;

export async function getDB() {
  // Check if we're in a build-time context (Next.js static analysis)
  const isBuildTime =
    typeof process !== "undefined" &&
    (process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NEXT_PHASE === "phase-development-build");

  try {
    // Get database URL from environment (Cloudflare-compatible)
    // Check multiple sources: process.env (populated by OpenNext), globalThis.__env, or direct process access
    const databaseUrl =
      process.env.DATABASE_URL ||
      (typeof globalThis !== "undefined" &&
        (globalThis as { __env?: { DATABASE_URL?: string } }).__env
          ?.DATABASE_URL) ||
      (typeof process !== "undefined" &&
        (process as { env?: { DATABASE_URL?: string } }).env?.DATABASE_URL);

    if (!databaseUrl) {
      // During build time, gracefully return null instead of throwing
      if (
        isBuildTime ||
        (process.env.NODE_ENV === "production" && !process.env.VERCEL)
      ) {
        console.warn(
          "DATABASE_URL not available during build, skipping database connection"
        );
        // Return a mock/null instead of throwing during build
        return null as unknown as ReturnType<typeof drizzle>;
      }
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Check if this is a dummy URL during build time
    if (
      databaseUrl.includes("dummy") ||
      databaseUrl.includes("localhost:5432")
    ) {
      if (isBuildTime) {
        console.warn(
          "Dummy database URL detected during build, skipping connection"
        );
        return null as unknown as ReturnType<typeof drizzle>;
      }
      throw new Error("Database not available during build");
    }

    // Create or reuse connection
    if (!globalConnection) {
      globalConnection = postgres(databaseUrl, {
        prepare: false,
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
    }

    return drizzle(globalConnection, { schema });
  } catch (error) {
    // During build time, return null instead of throwing
    if (isBuildTime) {
      console.warn(
        "Build-time database connection error (expected), returning null:",
        error instanceof Error ? error.message : String(error)
      );
      return null as unknown as ReturnType<typeof drizzle>;
    }

    console.error(
      "❌ Failed to connect to Supabase PostgreSQL database:",
      error
    );
    throw new Error(
      `Database connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }. This application requires Supabase PostgreSQL database to function.`
    );
  }
}

// For backward compatibility - export the type for use in other files
export type DbClient = Awaited<ReturnType<typeof getDB>>;

// Mock database client for build time
export function getMockDB(): Awaited<ReturnType<typeof getDB>> | null {
  console.warn("Using mock database client during build time");
  return null;
}

// Legacy function for backward compatibility (now async)
export const getDbClient = async () => {
  return await getDB();
};

// Get the underlying postgres client for raw queries (useful in middleware)
export function getPostgresClient() {
  if (!globalConnection) {
    throw new Error("Database connection not initialized");
  }
  return globalConnection;
}

// Cleanup function for graceful shutdown
export async function closeDB() {
  if (globalConnection) {
    await globalConnection.end();
    globalConnection = null;
    console.log("🔌 PostgreSQL connection closed");
  }
}
