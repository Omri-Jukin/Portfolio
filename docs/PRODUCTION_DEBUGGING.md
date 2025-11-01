# Production Debugging Guide

This guide helps you debug issues in your Cloudflare Workers production environment.

## 🔍 Checking Cloudflare Workers Logs

### Method 1: Cloudflare Dashboard (Recommended)

1. **Access Logs via Dashboard:**

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → Your Worker/Pages Project
   - Click on **Logs** tab (or **Analytics** → **Logs**)
   - Filter by:
     - **Status codes** (4xx, 5xx errors)
     - **Time range** (select recent time)
     - **Search terms** (e.g., "[AUTH]", "error", "login")

2. **Real-time Logs:**
   - Use the **Tail** feature for real-time log streaming
   - Useful for watching logs as you trigger the login

### Method 2: Wrangler CLI (Local)

```bash
# Install wrangler if not already installed
npm install -g wrangler

# Authenticate (if not already)
wrangler login

# Tail logs in real-time
wrangler tail

# Tail logs with filters
wrangler tail --format pretty --status error
wrangler tail --format pretty --search "[AUTH]"
```

### Method 3: Cloudflare API

```bash
# Get recent logs (requires API token)
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/tail?name={worker_name}" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## 📊 Understanding the Logs

### Auth Login Flow Logs

When a login attempt is made, you should see logs in this order:

1. **Login Attempt Started:**

   ```
   [AUTH] Login attempt started: { email, timestamp, nodeEnv, hasDb, hasUser }
   ```

2. **Environment Check:**

   ```
   [AUTH] Environment check: { hasJwtSecret, nodeEnv, jwtSecretLength }
   ```

3. **Database Lookup:**

   ```
   [AUTH] Attempting to find user in database
   [AUTH] User lookup result: { found, hasEmail }
   ```

4. **Password Verification:**

   ```
   [AUTH] Verifying password
   ```

5. **JWT Generation:**

   ```
   [AUTH] Generating JWT token
   [AUTH] JWT token generated successfully
   [AUTH] Cookie set in response headers
   ```

6. **Success:**
   ```
   [AUTH] Login successful: { email, userId, role, duration }
   ```

### Error Logs

**Database Error:**

```
[AUTH] Database error during login: { error, stack, email }
```

**Authentication Error:**

```
[AUTH] Login failed (TRPCError): { code, message, email, duration }
```

**Unexpected Error:**

```
[AUTH] Unexpected login error: { error, stack, email, duration, errorType }
```

## 🐛 Common Issues and Solutions

### Issue 1: JSON Parsing Error

**Symptom:** `Unexpected token '<', "<!DOCTYPE "..." is not valid JSON`

**Possible Causes:**

1. **Server returning HTML error page instead of JSON**

   - Check Cloudflare Workers logs for server errors
   - Verify the tRPC route handler is catching all errors

2. **Middleware intercepting request**

   - Check `src/middleware.ts` for any redirects or HTML responses
   - Verify no Next.js error pages are being served

3. **CORS or routing issue**
   - Verify the API route `/api/trpc/[trpc]/route.ts` is accessible
   - Check Cloudflare Workers routing rules

**Debug Steps:**

1. Check browser Network tab → Look at the actual response body
2. Check server logs for any unhandled exceptions
3. Use the debug endpoint: `https://omrijukin.com/api/debug`

### Issue 2: Database Connection Failed

**Log:** `[AUTH] Database connection unavailable during login`

**Solutions:**

1. Verify `DATABASE_URL` is set in Cloudflare Workers environment
2. Check Supabase connection limits
3. Verify database credentials

### Issue 3: Missing JWT Secret

**Log:** `[AUTH] JWT_SECRET is not properly configured`

**Solutions:**

1. Ensure `JWT_SECRET` is set as a Secret in Cloudflare Workers
2. Verify it's not the default value `JWT_SECRET_KEY`

### Issue 4: Missing Email Variables

**Log:** Email service errors (not directly in auth, but related)

**Solutions:**

1. Add required Gmail SMTP variables (see main issue)
2. Check email service logs separately

## 🔧 Debug Endpoints

### Environment Check Endpoint

**URL:** `/api/debug`

**Response:**

```json
{
  "status": "ok",
  "environment": {
    "nodeEnv": "production",
    "hasJwtSecret": true,
    "jwtSecretLength": 32,
    "hasDatabaseUrl": true,
    "databaseUrlPrefix": "postgresql://...",
    "hasEmailProvider": true,
    "emailProvider": "gmail",
    "hasGmailUser": true,
    "hasGmailAppPassword": true,
    "baseUrl": "https://omrijukin.com",
    "timestamp": "2025-01-27T..."
  }
}
```

## 📱 Client-Side Debugging

### Browser Console Logs

When login fails, check the browser console for:

1. **Client-side error logs:**

   ```
   [CLIENT] Login error: { message, data, shape, cause }
   ```

2. **JSON parsing error detection:**
   ```
   [CLIENT] Possible JSON parsing error detected
   [CLIENT] Raw API response: { status, statusText, headers, body, isJson }
   ```

### Network Tab Inspection

1. Open Browser DevTools → **Network** tab
2. Filter by **Fetch/XHR**
3. Look for `/api/trpc/auth.login` request
4. Check:
   - **Status Code** (200 = OK, 4xx/5xx = error)
   - **Response Headers** (Content-Type should be `application/json`)
   - **Response Body** (should be JSON, not HTML)

## ✅ Verification Checklist

After deploying changes, verify:

- [ ] Cloudflare Workers logs show login attempts
- [ ] No unexpected errors in logs
- [ ] Environment variables are correctly set
- [ ] Database connection is working
- [ ] JWT secret is configured
- [ ] API responses are JSON (not HTML)
- [ ] Browser console shows proper error messages

## 🚀 Quick Debug Commands

```bash
# Check environment variables (via debug endpoint)
curl https://omrijukin.com/api/debug

# Test login endpoint directly
curl -X POST https://omrijukin.com/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# View real-time logs
wrangler tail --format pretty
```

## 📝 Logging Best Practices

1. **Always use prefixed log messages** (e.g., `[AUTH]`, `[CLIENT]`)
2. **Include relevant context** (email, userId, duration)
3. **Don't log sensitive data** (passwords, tokens)
4. **Use structured logging** (objects instead of strings)
5. **Log at appropriate levels** (info, error, warn)

## 🔒 Security Notes

- Never log passwords, tokens, or sensitive user data
- Debug endpoints should not expose secrets
- Use environment variable checks, not actual values
- Monitor logs for suspicious activity
