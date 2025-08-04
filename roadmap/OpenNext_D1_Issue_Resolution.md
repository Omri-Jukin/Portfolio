# Resolving D1 Database Binding Issue in OpenNext Production Deployment

## 🔍 Issue Summary

**Problem:**  
In production (Cloudflare Workers using OpenNext), your Next.js app fails to connect to the D1 database. Development works fine using SQLite, but in production, calls to the D1 database return:

```
Database client not available in production. Please check your D1 binding configuration.
```

---

## 🔧 Root Cause

OpenNext does **not expose** D1 bindings (`env.DB`) automatically to your API routes or tRPC context. Unlike traditional Cloudflare Workers, bindings aren’t globally accessible or passed as `env` unless retrieved properly.

Attempts to get `env.DB` using:
```ts
globalThis.DB
globalThis.__env
(globalThis as any).__D1_BETA__DB
```
all fail because **OpenNext isolates bindings**, and the global scope is empty in route handlers.

---

## ✅ Solution

### Use `getCloudflareContext` from `@opennextjs/cloudflare`

In `lib/db/client.ts`:

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDB() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}
```

This ensures that each request uses the correct Worker environment and has access to the D1 binding.

---

## 🧠 Why This Works

OpenNext wraps your app in a Cloudflare Worker. The bindings (`env.DB`) **do exist**, but only within the Worker context.  
Using `getCloudflareContext()` ensures your API routes and context-aware code correctly pulls in the bound environment.

---

## 🧱 Update Your tRPC Context

In `src/app/server/context.ts`:

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "$/db/schema";

export function createContext() {
  const { env } = getCloudflareContext();
  return {
    db: drizzle(env.DB, { schema }),
    // add auth/session info if needed
  };
}
```

---

## ⚙️ Configuration Validation

### ✅ `wrangler.jsonc`
Ensure this block exists and matches your usage:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "your-db-name",
      "database_id": "your-d1-id"
    }
  ]
}
```

### ✅ `open-next.config.ts`
Even if empty, this file should exist:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig({});
```

---

## 🧪 Local Testing

Use:
```bash
npm run preview
# or
npx opennextjs-cloudflare preview
```
You can add logging inside `getDB()` to confirm `env.DB` is accessible.

---

## 🚫 Avoid

- Using `globalThis` to access env
- Expecting `process.env.DB` to exist (D1 is not a string var!)
- Relying on the old tRPC route hack for injection (it won't work in OpenNext)

---

## 🧭 Long-Term Options

### Stick With OpenNext
If the fix works — stay. It supports ISR, D1, KV, etc., and integrates tightly with Next.js and Workers.

### Or Switch To Cloudflare Pages
Pros:
- Uses `process.env.DB`
- Fully supported by Cloudflare
- Free execution within limits

Cons:
- Some SSR quirks
- Less mature than OpenNext for edge features

---

## 📌 Action Steps

1. ✅ Replace DB access with `getCloudflareContext()`
2. ✅ Update `createContext()` to inject D1 properly
3. ✅ Confirm `wrangler.jsonc` includes the correct binding
4. ✅ Test with `opennextjs-cloudflare preview`
5. ✅ Deploy using `opennextjs-cloudflare deploy`
6. 🔍 If issues persist — explore Pages or native Worker fallback

---

## 📚 References

- OpenNext Docs: [https://open-next.pages.dev](https://open-next.pages.dev)  
- Drizzle ORM: [https://orm.drizzle.team](https://orm.drizzle.team)  
- Cloudflare D1: [https://developers.cloudflare.com/d1](https://developers.cloudflare.com/d1)  
