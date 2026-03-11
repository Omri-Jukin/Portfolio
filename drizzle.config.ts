import { defineConfig } from "drizzle-kit";
import { encodeDatabaseUrl } from "./lib/utils/dbConnection";

// Parse DATABASE_URL and ensure SSL is configured properly
function getDatabaseConfig() {
  // Prefer DIRECT_DATABASE_URL for migrations (direct connection is more reliable)
  // Pooler connections can hang during schema introspection
  const databaseUrl =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "";

  if (!databaseUrl) {
    throw new Error(
      "Neither DIRECT_DATABASE_URL nor DATABASE_URL environment variable is set"
    );
  }

  // First, encode the password if it contains special characters
  const processedUrl = encodeDatabaseUrl(databaseUrl);

  // If URL already has query parameters, ensure sslmode is set
  // Otherwise, add it
  try {
    const url = new URL(processedUrl);

    // For Supabase/Neon/cloud providers, typically require SSL
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }

    // Add connection timeout parameters to prevent hanging
    // These help when schema introspection takes too long
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "10");
    }
    if (!url.searchParams.has("command_timeout")) {
      url.searchParams.set("command_timeout", "30");
    }

    return {
      url: url.toString(),
    };
  } catch (error) {
    // If URL parsing fails, return as-is (might be a connection string format)
    console.warn("Could not parse DATABASE_URL, using as-is:", error);
    return {
      url: processedUrl,
    };
  }
}

export default defineConfig({
  schema: "./lib/db/schema/schema.tables.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: getDatabaseConfig(),
  verbose: true,
  strict: true,
  // Only introspect tables in the public schema to speed up operations
  schemaFilter: ["public"],
});
