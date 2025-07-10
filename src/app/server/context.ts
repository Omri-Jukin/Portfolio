import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { createDbClient } from "../../../lib/db/client";
import { D1Database } from '@cloudflare/workers-types'

// Type for Cloudflare environment
interface CloudflareEnv extends D1Database {
  DB: D1Database; // D1 Database
}

export async function createContext({
  req,
  resHeaders,
  env,
}: FetchCreateContextFnOptions & { env?: CloudflareEnv }) {
  // Create database client with D1 instance
  const db = env?.DB ? createDbClient(env.DB) : null;

  // Simple auth check for portfolio admin
  async function getUserFromToken() {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      // In a real app, verify JWT token here
      // For now, just check if token exists
      return token ? { id: "admin", role: "admin" } : null;
    }
    return null;
  }

  const user = await getUserFromToken();

  return {
    db,
    user,
    resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
