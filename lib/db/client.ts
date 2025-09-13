import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema/schema.tables";

// Type for Cloudflare environment with D1 database
interface CloudflareEnv {
  DB: D1Database;
  [key: string]: unknown;
}

export async function getDB() {
  try {
    // Get Cloudflare context (works in both production and development)
    const { env } = await getCloudflareContext({ async: true });

    if (!env || !("DB" in env)) {
      throw new Error(
        "D1 database binding not found in Cloudflare environment"
      );
    }

    // Log connection type
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔧 Development mode: Using LOCAL D1 database for better performance"
      );
    } else {
      console.log("✅ Production mode: Using Cloudflare D1 database");
    }

    console.log("✅ Connected to Cloudflare D1 database");
    return drizzle((env as CloudflareEnv).DB, { schema });
  } catch (error) {
    console.error("❌ Failed to connect to Cloudflare D1 database:", error);
    throw new Error(
      `Database connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }. This application requires Cloudflare D1 database to function.`
    );
  }
}

// For backward compatibility - export the type for use in other files
export type DbClient = Awaited<ReturnType<typeof getDB>>;

// Simplified fallback function
export const getDbClient = async () => {
  return await getDB();
};

// Export a default client for backward compatibility
export const dbClient = getDbClient();

// Legacy functions for backward compatibility (deprecated)
export function createDbClient(d1: D1Database) {
  console.warn("createDbClient is deprecated. Use getDB() instead.");
  return drizzle(d1, { schema });
}

export async function getD1FromGlobal(): Promise<ReturnType<
  typeof getDB
> | null> {
  console.warn("getD1FromGlobal is deprecated. Use getDB() instead.");
  try {
    return await getDB();
  } catch {
    return null;
  }
}

export async function createDbClientWithFallback(): Promise<ReturnType<
  typeof getDB
> | null> {
  console.warn(
    "createDbClientWithFallback is deprecated. Use getDB() instead."
  );
  return getDbClient();
}

export async function getEnvFromGlobal(
  key: string
): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv)[key] as string;
  } catch (error) {
    console.error(`Error accessing ${key} from Cloudflare context:`, error);
    return undefined;
  }
}
