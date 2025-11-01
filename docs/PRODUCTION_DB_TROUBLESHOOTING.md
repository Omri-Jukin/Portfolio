# Production Database Connection Troubleshooting

## Problem

Database connection works locally but fails in production (Cloudflare Workers/Pages).

## Root Causes Identified

### 1. **Missing DATABASE_URL Environment Variable** ⚠️ MOST LIKELY

- `wrangler.jsonc` only has `NODE_ENV` and `NEXT_PUBLIC_BASE_URL`
- `DATABASE_URL` is **NOT configured** in Cloudflare environment
- The database client tries to read from `process.env.DATABASE_URL` but it's undefined

### 2. **Cloudflare TCP Connection Restrictions**

- Cloudflare Workers have limited TCP support
- Direct PostgreSQL connections via `postgres-js` might be restricted
- However, with `nodejs_compat` flag, this should work

### 3. **Environment Variable Access Pattern**

- JWT_SECRET uses `globalThis.__env` fallback pattern
- DATABASE_URL only checks `process.env`
- According to OpenNext, env vars are populated into `process.env`, but must be configured first

## Solutions

### Solution 1: Add DATABASE_URL to Cloudflare (REQUIRED)

#### Option A: Via Cloudflare Dashboard (Recommended for Secrets)

1. Go to Cloudflare Dashboard → Workers & Pages → Your Project
2. Settings → Variables and Secrets
3. Add a new **Secret** named `DATABASE_URL`
4. Paste your Supabase connection string
5. Save and redeploy

#### Option B: Via Wrangler CLI

```bash
# Set as secret (encrypted)
npx wrangler secret put DATABASE_URL

# Or add to wrangler.jsonc (NOT recommended for secrets - they're visible)
# Add to "vars" section (only for non-sensitive values)
```

#### Option C: For Cloudflare Pages

1. Cloudflare Dashboard → Pages → Your Project
2. Settings → Environment Variables
3. Add `DATABASE_URL` (mark as "Encrypted" for production)

### Solution 2: Update Code to Handle Cloudflare Environment

Update `lib/db/client.ts` to check multiple environment variable sources:

```typescript
// Get database URL from multiple sources (Cloudflare-compatible)
const databaseUrl =
  process.env.DATABASE_URL ||
  (globalThis as { __env?: { DATABASE_URL?: string } }).__env?.DATABASE_URL ||
  (typeof process !== "undefined" && (process as any).env?.DATABASE_URL);
```

### Solution 3: Verify Connection String Format

Ensure your Supabase connection string uses the **connection pooler** format:

```
postgresql://postgres:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

NOT the direct connection:

```
postgresql://postgres:[PASSWORD]@aws-0-eu-north-1.supabase.co:5432/postgres
```

The pooler is required for serverless environments.

### Solution 4: Test Environment Variables in Production

Use the existing debug endpoint:

```bash
# Visit: https://omrijukin.com/api/debug
# Check if hasDatabaseUrl is true
```

## Diagnostic Checklist

- [ ] DATABASE_URL is set in Cloudflare Dashboard (Variables/Secrets)
- [ ] Using connection pooler URL (not direct connection)
- [ ] Environment variable is marked as "Encrypted" if it's a secret
- [ ] Project has been redeployed after adding the variable
- [ ] `/api/debug` endpoint shows `hasDatabaseUrl: true`
- [ ] Connection string doesn't contain `localhost:5432` or `dummy`

## Quick Test Commands

### Check Production Environment

```bash
# Via debug endpoint (in browser)
curl https://omrijukin.com/api/debug

# Should show:
# "hasDatabaseUrl": true
# "databaseUrlPrefix": "postgresql://***"
```

### Test Local Connection

```bash
npm run test:db
```

## Common Issues

### Issue: "DATABASE_URL environment variable is not set"

**Cause**: Variable not configured in Cloudflare
**Fix**: Add DATABASE_URL as secret/environment variable in Cloudflare Dashboard

### Issue: "Connection timeout"

**Cause**: Using direct connection instead of pooler
**Fix**: Use pooler URL format (see Solution 3)

### Issue: "Connection refused"

**Cause**: Cloudflare Workers TCP restrictions
**Fix**: Ensure `nodejs_compat` flag is set in wrangler.jsonc (already set)

### Issue: "Authentication failed"

**Cause**: Invalid credentials or connection string
**Fix**: Verify connection string format and credentials in Supabase dashboard

## Next Steps

1. **IMMEDIATE**: Add `DATABASE_URL` to Cloudflare environment
2. **VERIFY**: Check `/api/debug` endpoint shows `hasDatabaseUrl: true`
3. **DEPLOY**: Redeploy the application
4. **TEST**: Try accessing a database endpoint in production
