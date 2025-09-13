import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema/schema.tables.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
    databaseId: process.env.CLOUDFLARE_DB_ID || "",
    token: process.env.CLOUDFLARE_API_TOKEN || "",
  },
  verbose: true,
  strict: true,
});
