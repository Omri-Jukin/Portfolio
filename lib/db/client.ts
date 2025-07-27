import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema/schema.tables";
import { D1Database } from "@cloudflare/workers-types";

// For Cloudflare D1, the database will be accessed through environment bindings
// The actual DB instance will be passed from the worker environment
export function createDbClient(db: D1Database) {
  return drizzle(db, { schema });
}

// For development or when D1 is available globally
// In development, we'll use a mock or connect to the remote D1
export const dbClient =
  typeof globalThis !== "undefined" &&
  (globalThis as Record<string, unknown>).DB
    ? drizzle((globalThis as Record<string, unknown>).DB as D1Database, {
        schema,
      })
    : process.env.NODE_ENV === "development"
    ? null // We'll handle this in the user functions
    : null;

// Export the type for use in other files
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
  if (dbClient) {
    return dbClient;
  }
  return null;
};
