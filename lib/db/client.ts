import { drizzle } from "drizzle-orm/d1";
import { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema/schema.tables";

export function createDbClient(d1: D1Database) {
  return drizzle(d1, { schema });
}

// Function to get D1 database from global scope (for Cloudflare Workers)
export function getD1FromGlobal(): D1Database | null {
  try {
    // Try different possible ways to access D1 in Cloudflare Workers
    const globalDB = (globalThis as Record<string, unknown>).DB as D1Database;
    if (globalDB) {
      console.log("Found D1 database in global scope");
      return globalDB;
    }

    // Try other possible names
    const betaDB = (globalThis as Record<string, unknown>)
      .__D1_BETA__DB as D1Database;
    if (betaDB) {
      console.log("Found D1 database in beta scope");
      return betaDB;
    }

    // Try accessing through worker environment (for OpenNext)
    const workerEnv = (globalThis as Record<string, unknown>).__env as Record<
      string,
      unknown
    >;
    if (workerEnv?.DB) {
      console.log("Found D1 database in worker environment");
      return workerEnv.DB as D1Database;
    }

    // Try accessing through execution context (for OpenNext)
    const executionContext = (globalThis as Record<string, unknown>)
      .__executionContext as Record<string, unknown>;
    if (
      executionContext?.env &&
      typeof executionContext.env === "object" &&
      executionContext.env !== null
    ) {
      const env = executionContext.env as Record<string, unknown>;
      if (env.DB) {
        console.log("Found D1 database in execution context");
        return env.DB as D1Database;
      }
    }

    // Try accessing through process.env (for development)
    if (process.env.NODE_ENV === "development") {
      console.log("Using development database");
      return null; // Will use local client
    }

    console.log("No D1 database found in global scope");
    return null;
  } catch (error) {
    console.error("Error accessing D1 database:", error);
    return null;
  }
}

// Function to create database client with fallback
export function createDbClientWithFallback(): ReturnType<
  typeof createDbClient
> | null {
  const d1 = getD1FromGlobal();
  if (d1) {
    return createDbClient(d1);
  }
  return null;
}

// For backward compatibility - export the type for use in other files
export type DbClient = ReturnType<typeof createDbClient>;

// For development with Next.js, we can create a remote D1 client
// This requires setting up a remote D1 binding in your wrangler.toml
export function createRemoteDbClient() {
  // This would require additional setup with remote D1
  // For now, stick with Wrangler dev for local development
  return null;
}

// Development fallback - use remote D1 when local is not available
export const getDbClient = () => {
  const fallbackClient = createDbClientWithFallback();
  if (fallbackClient) {
    return fallbackClient;
  }
  return null;
};

// Export a default client for backward compatibility
export const dbClient = getDbClient();

// New function to get environment variables from global scope
export function getEnvFromGlobal(key: string): string | undefined {
  try {
    // Try accessing from global scope (Cloudflare Workers way)
    const globalValue = (globalThis as Record<string, unknown>)[key] as string;
    if (globalValue) {
      console.log(`Found ${key} in global scope`);
      return globalValue;
    }

    // Try accessing through worker environment (for OpenNext)
    const workerEnv = (globalThis as Record<string, unknown>).__env as Record<
      string,
      unknown
    >;
    if (workerEnv?.[key]) {
      console.log(`Found ${key} in worker environment`);
      return workerEnv[key] as string;
    }

    // Try accessing through execution context (for OpenNext)
    const executionContext = (globalThis as Record<string, unknown>)
      .__executionContext as Record<string, unknown>;
    if (
      executionContext?.env &&
      typeof executionContext.env === "object" &&
      executionContext.env !== null
    ) {
      const env = executionContext.env as Record<string, unknown>;
      if (env[key]) {
        console.log(`Found ${key} in execution context`);
        return env[key] as string;
      }
    }

    // Fallback to process.env (for development)
    if (process.env.NODE_ENV === "development") {
      return process.env[key];
    }

    console.log(`${key} not found in global scope`);
    return undefined;
  } catch (error) {
    console.error(`Error accessing ${key} from global scope:`, error);
    return undefined;
  }
}

// Debug function to log all available global properties
export function debugGlobalScope() {
  console.log("=== GLOBAL SCOPE DEBUG ===");
  console.log(
    "All global keys:",
    Object.keys(globalThis as Record<string, unknown>)
  );

  // Check for specific patterns
  const globalKeys = Object.keys(globalThis as Record<string, unknown>);
  const dbKeys = globalKeys.filter((key) => key.toLowerCase().includes("db"));
  const envKeys = globalKeys.filter((key) => key.toLowerCase().includes("env"));

  console.log("DB-related keys:", dbKeys);
  console.log("ENV-related keys:", envKeys);

  // Check for any object that might contain our bindings
  for (const key of globalKeys) {
    const value = (globalThis as Record<string, unknown>)[key];
    if (typeof value === "object" && value !== null) {
      console.log(
        `Key ${key} is an object:`,
        Object.keys(value as Record<string, unknown>)
      );
    }
  }

  console.log("=== END GLOBAL SCOPE DEBUG ===");
}
