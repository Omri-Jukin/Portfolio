import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema/schema.tables.postgres.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
