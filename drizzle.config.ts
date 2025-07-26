import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema/schema.tables.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
