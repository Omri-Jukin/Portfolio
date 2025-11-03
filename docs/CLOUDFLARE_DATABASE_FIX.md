# Cloudflare Workers Database Connection Fix

## Problem

The application was unable to connect to the Supabase PostgreSQL database in production (Cloudflare Workers) even though:

- ✅ Environment variables (`DATABASE_URL`, `JWT_SECRET`) were properly set as Cloudflare secrets
- ✅ The application built successfully
- ✅ JSON error handling was working correctly

### Root Cause

**Cloudflare Workers do not support TCP sockets** - they only support HTTP and WebSocket connections.

The original implementation used `postgres-js`, which relies on TCP sockets for database connections. This works perfectly in Node.js environments (local development, traditional servers) but **fails silently in Cloudflare Workers**.

### Symptoms

- Login failed with "Invalid email or password" even with correct credentials
- Database queries appeared to work but returned no results
- No explicit errors in console (silent failure)
- All environment variables were accessible (`/api/debug` confirmed this)

## Solution

Implemented a **dual-driver approach** that automatically detects the runtime environment:

### 1. **Cloudflare Workers** → Use `@neondatabase/serverless`

- Supports WebSocket connections
- Compatible with Cloudflare Workers runtime
- Works with Supabase's connection pooler

### 2. **Node.js (Local/Server)** → Use `postgres-js`

- Optimal performance for traditional Node.js
- Full TCP socket support
- Better for local development

## Changes Made

### 1. Dependencies Added

```bash
npm install @neondatabase/serverless ws
```

### 2. Updated `lib/db/client.ts`

**Key changes:**

- Added `@neondatabase/serverless` and Drizzle's Neon adapter
- Created `isCloudflareWorkers()` function to detect runtime environment
- Implemented dual connection approach:
  - `globalConnection` (postgres-js) for Node.js - reused across requests
  - **Per-request Neon Pool** for Cloudflare Workers - NEW pool per request (required for Workers isolation)
- Configured WebSocket constructor for Cloudflare Workers

**Environment Detection:**

```typescript
function isCloudflareWorkers(): boolean {
  return (
    typeof globalThis !== "undefined" &&
    "caches" in globalThis &&
    !("process" in globalThis && process.versions?.node)
  );
}
```

**Connection Logic:**

```typescript
// Use Neon serverless driver for Cloudflare Workers (WebSocket support)
if (isCloudflare) {
  console.log("[DB] Using Neon serverless driver for Cloudflare Workers");
  neonConfig.webSocketConstructor = WebSocket;

  // IMPORTANT: Create a NEW Pool for each request in Cloudflare Workers
  // Global pools violate Workers' request isolation model
  const pool = new Pool({ connectionString: databaseUrl });

  return drizzleNeon(pool, { schema });
}

// Use postgres-js for local development and traditional Node.js environments
console.log("[DB] Using postgres-js driver for Node.js");
if (!globalConnection) {
  globalConnection = postgres(databaseUrl, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

return drizzle(globalConnection, { schema });
```

## Testing

### Local Testing (Node.js)

```bash
npm run test:db
```

✅ Should output: `[DB] Using postgres-js driver for Node.js`

### Production Testing (Cloudflare Workers)

After deployment, test these endpoints:

1. **Database Connectivity**

   ```
   GET https://omrijukin.com/api/test-db
   ```

   Should return: users found with correct data

2. **Login Flow**

   ```
   POST https://omrijukin.com/api/trpc/auth.login
   ```

   Should successfully authenticate valid users

3. **Admin Operations**
   ```
   DELETE https://omrijukin.com/api/trpc/intakes.deleteCustomLink
   ```
   Should work without JSON parsing errors

## Benefits

1. **✅ Zero Code Changes** - Automatic detection, no manual configuration
2. **✅ Environment Agnostic** - Works in both local and production
3. **✅ Performance Optimized** - Uses best driver for each environment
4. **✅ Future-Proof** - Easy to add other runtime support (Vercel Edge, Deno, etc.)
5. **✅ Backward Compatible** - Existing queries and code unchanged

## Important Notes

### Supabase Connection String

For Cloudflare Workers, ensure you're using the **transaction pooler** URL:

```
postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

Not the direct connection URL (which uses port 5432 without pooler).

### WebSocket Support

The Neon serverless driver requires WebSocket support, which is available in:

- ✅ Cloudflare Workers
- ✅ Cloudflare Pages Functions
- ✅ Modern browsers
- ✅ Deno
- ✅ Vercel Edge Functions

### Connection Pooling

Both drivers use connection pooling:

- **postgres-js**: In-memory pool (max: 10 connections) - **global**, reused across requests
- **Neon serverless**: WebSocket-based pool - **per-request** (required for Cloudflare Workers isolation)

### Important: Cloudflare Workers Request Isolation

⚠️ **Critical**: Cloudflare Workers enforces strict request isolation. Each request MUST have its own database connection pool. Sharing pools across requests will cause:

- `Error: Cannot perform I/O on behalf of a different request`
- `Error: The Workers runtime canceled this request because it detected that your Worker's code had hung`

**Solution**: Always create a new `Pool` instance for each request when running in Cloudflare Workers.

## Verification Checklist

After deployment, verify:

- [ ] `/api/debug` shows `hasDatabaseUrl: true`
- [ ] `/api/test-db` returns user data successfully
- [ ] Login with valid credentials works
- [ ] Admin panel loads correctly
- [ ] Custom link deletion works
- [ ] Console logs show "Using Neon serverless driver for Cloudflare Workers"

## Related Files

- `lib/db/client.ts` - Database client with dual-driver support
- `package.json` - Added `@neondatabase/serverless` and `ws` dependencies
- `wrangler.jsonc` - Cloudflare configuration with environment variables
- `docs/PRODUCTION_JSON_ERROR_FIX.md` - Related JSON error handling fixes

## References

- [Cloudflare Workers Limitations](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Drizzle ORM with Neon](https://orm.drizzle.team/docs/get-started-postgresql#neon)
