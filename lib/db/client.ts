import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema/schema.tables";

// Global connection instances
let globalConnection: ReturnType<typeof postgres> | null = null;

// Detect if we're in Cloudflare Workers environment
function isCloudflareWorkers(): boolean {
  // Explicit flag to force Neon serverless driver (set in wrangler.jsonc)
  if (process.env.USE_NEON_DRIVER === "true") {
    return true;
  }

  // Check for Cloudflare-specific environment variables
  if (process.env.CF_PAGES === "1" || process.env.CLOUDFLARE_ENV) {
    return true;
  }

  // Check for typical Cloudflare Workers global objects
  return (
    typeof globalThis !== "undefined" &&
    "caches" in globalThis &&
    "CloudflareWorkersGlobalScope" in globalThis
  );
}

export async function getDB() {
  // Check if we're in a build-time context (Next.js static analysis)
  const isBuildTime =
    typeof process !== "undefined" &&
    (process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NEXT_PHASE === "phase-development-build");

  const isCloudflare = isCloudflareWorkers();

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

    // Enhanced logging for production debugging
    if (!databaseUrl) {
      console.error("[DB] DATABASE_URL not found in environment:", {
        hasDATABASE_URL: !!process.env.DATABASE_URL,
        hasGlobalEnv: !!(globalThis as { __env?: unknown }).__env,
        hasGlobalDatabaseUrl: !!(
          globalThis as { __env?: { DATABASE_URL?: string } }
        ).__env?.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        isBuildTime,
        isVercel: !!process.env.VERCEL,
        availableEnvKeys: Object.keys(process.env || {})
          .filter((key) => !key.includes("SECRET") && !key.includes("KEY"))
          .slice(0, 10),
      });
    }

    if (!databaseUrl) {
      // During build time ONLY, gracefully return null
      if (isBuildTime) {
        console.warn(
          "[DB] DATABASE_URL not available during build, skipping database connection"
        );
        // Return a mock/null instead of throwing during build
        return null as unknown as ReturnType<typeof drizzle>;
      }

      // In production runtime (not build time), this is a critical error
      const error = new Error(
        "DATABASE_URL environment variable is not set - database connection failed"
      );
      console.error("[DB] CRITICAL ERROR:", error.message);
      throw error;
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

    // Use Neon serverless driver for Cloudflare Workers (WebSocket support)
    if (isCloudflare) {
      // console.log("[DB] Using Neon serverless driver for Cloudflare Workers");

      // Configure Neon to use WebSockets (required for Cloudflare Workers)
      neonConfig.webSocketConstructor = WebSocket;

      // IMPORTANT: Create a NEW Pool for each request in Cloudflare Workers
      // Global pools violate Workers' request isolation model
      const pool = new Pool({ connectionString: databaseUrl });

      return drizzleNeon(pool, { schema });
    }

    // Use postgres-js for local development and traditional Node.js environments
    // console.log("[DB] Using postgres-js driver for Node.js");
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
