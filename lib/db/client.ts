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
  const { env } = await getCloudflareContext({ async: true });
  return drizzle((env as CloudflareEnv).DB, { schema });
}

// For backward compatibility - export the type for use in other files
export type DbClient = Awaited<ReturnType<typeof getDB>>;

// Development fallback - use remote D1 when local is not available
export const getDbClient = async () => {
  try {
    return await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
    return null;
  }
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

// Debug function to log all available global properties
export async function debugGlobalScope() {
  console.log("=== GLOBAL SCOPE DEBUG ===");
  try {
    const { env } = await getCloudflareContext({ async: true });
    console.log("Cloudflare context env keys:", Object.keys(env));
    console.log("DB available:", !!(env as CloudflareEnv).DB);
  } catch (error) {
    console.log("Failed to get Cloudflare context:", error);
  }
  console.log("=== END GLOBAL SCOPE DEBUG ===");
}
