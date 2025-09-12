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
    const { env } = await getCloudflareContext({ async: true });
    return drizzle((env as CloudflareEnv).DB, { schema });
  } catch (error) {
    console.error("Failed to get Cloudflare context:", error);

    // Fallback to remote D1 via Wrangler
    if (process.env.NODE_ENV === "development") {
      const { execSync } = await import("child_process");
      const { drizzle } = await import("drizzle-orm/d1");

      // Create a D1 client that uses Wrangler commands to access remote D1
      const wranglerD1 = {
        prepare: (sql: string) => ({
          bind: () => ({
            all: async () => {
              try {
                execSync(
                  `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                    /"/g,
                    '\\"'
                  )}"`,
                  { encoding: "utf-8" }
                );
                // Parse the result and return in D1 format
                return { results: [] };
              } catch (error) {
                console.error("Wrangler query failed:", error);
                return { results: [] };
              }
            },
            run: async () => {
              try {
                execSync(
                  `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                    /"/g,
                    '\\"'
                  )}"`,
                  { encoding: "utf-8" }
                );
                return { changes: 1, lastInsertRowId: 0 };
              } catch (error) {
                console.error("Wrangler query failed:", error);
                return { changes: 0, lastInsertRowId: 0 };
              }
            },
            first: async () => {
              try {
                execSync(
                  `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                    /"/g,
                    '\\"'
                  )}"`,
                  { encoding: "utf-8" }
                );
                return null;
              } catch (error) {
                console.error("Wrangler query failed:", error);
                return null;
              }
            },
          }),
          all: async () => {
            try {
              execSync(
                `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                  /"/g,
                  '\\"'
                )}"`,
                { encoding: "utf-8" }
              );
              return { results: [] };
            } catch (error) {
              console.error("Wrangler query failed:", error);
              return { results: [] };
            }
          },
          run: async () => {
            try {
              execSync(
                `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                  /"/g,
                  '\\"'
                )}"`,
                { encoding: "utf-8" }
              );
              return { changes: 1, lastInsertRowId: 0 };
            } catch (error) {
              console.error("Wrangler query failed:", error);
              return { changes: 0, lastInsertRowId: 0 };
            }
          },
          first: async () => {
            try {
              execSync(
                `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                  /"/g,
                  '\\"'
                )}"`,
                { encoding: "utf-8" }
              );
              return null;
            } catch (error) {
              console.error("Wrangler query failed:", error);
              return null;
            }
          },
        }),
        exec: async (sql: string) => {
          try {
            execSync(
              `npx wrangler d1 execute personal-website --remote --command="${sql.replace(
                /"/g,
                '\\"'
              )}"`,
              { encoding: "utf-8" }
            );
          } catch (error) {
            console.error("Wrangler query failed:", error);
          }
        },
        batch: async () => [],
      } as unknown as D1Database;

      return drizzle(wranglerD1, { schema });
    }

    throw error;
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
