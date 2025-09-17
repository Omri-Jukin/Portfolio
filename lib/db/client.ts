import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/schema.tables";

// Global connection instance
let globalConnection: ReturnType<typeof postgres> | null = null;

export async function getDB() {
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      // During build time, if DATABASE_URL is not available, skip database connection
      if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
        console.warn(
          "DATABASE_URL not available during build, skipping database connection"
        );
        throw new Error("Database not available during build");
      }
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Check if this is a dummy URL during build time
    if (
      databaseUrl.includes("dummy") ||
      databaseUrl.includes("localhost:5432")
    ) {
      console.warn(
        "Dummy database URL detected during build, skipping connection"
      );
      throw new Error("Database not available during build");
    }

    // Create or reuse connection
    if (!globalConnection) {
      console.log("🔧 Creating new PostgreSQL connection to Supabase");
      globalConnection = postgres(databaseUrl, {
        prepare: false,
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
    }

    // Log connection type
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Development mode: Using Supabase PostgreSQL database");
    } else {
      console.log("✅ Production mode: Using Supabase PostgreSQL database");
    }

    console.log("✅ Connected to Supabase PostgreSQL database");
    return drizzle(globalConnection, { schema });
  } catch (error) {
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

// Cleanup function for graceful shutdown
export async function closeDB() {
  if (globalConnection) {
    await globalConnection.end();
    globalConnection = null;
    console.log("🔌 PostgreSQL connection closed");
  }
}
