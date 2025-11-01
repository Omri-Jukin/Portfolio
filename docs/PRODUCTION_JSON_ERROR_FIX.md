# Production JSON Error Fix

## Problem

Errors like "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" occur when:

1. Server returns HTML error page instead of JSON
2. This happens in production when database connection fails or other errors occur

## Root Cause

When errors occur in production (especially database connection failures), Next.js might return its default HTML error page instead of JSON, even though the tRPC route handler has error handling.

## Solution

### 1. Enhanced Error Handling in tRPC Route

The tRPC route handler needs to catch ALL possible errors, including:

- Database connection errors
- Context creation errors
- Unhandled promise rejections
- Middleware/routing errors

### 2. Ensure Database Errors Return JSON

When database connection fails in production:

- Context should return `db: null` (already implemented)
- Endpoints should handle `db: null` gracefully
- All errors should be caught and returned as JSON

### 3. Check Cloudflare Environment Variables

Ensure these are set:

- `DATABASE_URL` - Required
- `JWT_SECRET` - Required

### 4. Verify Error Response Format

All error responses must:

- Have `Content-Type: application/json` header
- Return valid JSON structure
- Never throw unhandled errors

## Immediate Fix Steps

1. **Verify Secrets are Set:**

   ```bash
   npx wrangler secret list --name homepage
   ```

2. **Check Database Connectivity:**

   ```bash
   npm run test:db
   ```

3. **Review Production Logs:**

   - Cloudflare Dashboard → Workers → Your Project → Logs
   - Look for database connection errors
   - Check for unhandled errors

4. **Test in Production:**
   - Try login endpoint
   - Try delete custom link
   - Check browser network tab for actual response

## Code Changes Needed

1. Ensure all errors in context creation are caught
2. Add response format validation
3. Improve error logging for production debugging
4. Handle database connection failures gracefully
