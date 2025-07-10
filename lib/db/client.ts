import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema/schema.tables';
import { D1Database } from '@cloudflare/workers-types';

// For Cloudflare D1, the database will be accessed through environment bindings
// The actual DB instance will be passed from the worker environment
export function createDbClient(db: D1Database) {
  return drizzle(db, { schema });
}

// For development or when D1 is available globally
export const dbClient = typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>).DB 
  ? drizzle((globalThis as Record<string, unknown>).DB, { schema })
  : null;

// Export the type for use in other files
export type DbClient = ReturnType<typeof createDbClient>;
