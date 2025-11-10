# Database Connection Setup Guide

## Current Configuration

This application uses **Supabase PostgreSQL** with connection pooling optimized for Next.js serverless/stateless environments.

## Recommended Connection Method: Transaction Pooler

### Why Transaction Pooler?

- ✅ **Ideal for Next.js**: Perfect for serverless functions where each interaction is brief and isolated
- ✅ **Better Performance**: Faster connection establishment, no persistent connection overhead
- ✅ **Scalability**: Handles high concurrency better than direct connections
- ✅ **Cost Effective**: More efficient resource usage

### How to Switch to Transaction Pooler

1. **Get Your Transaction Pooler Connection String**:

   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **Database**
   - Under **Connection String**, select:
     - **Type**: `URI`
     - **Source**: `Primary Database`
     - **Method**: `Transaction pooler` (select this!)
   - Copy the connection string (it will use port `6543` or have `?pgbouncer=true`)

2. **Update Your Environment Variable**:

   ```bash
   # Replace your DATABASE_URL with the transaction pooler connection string
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

3. **Key Differences**:
   - **Port**: Transaction pooler uses port `6543` (not `5432`)
   - **Connection String**: May include `?pgbouncer=true` parameter
   - **Connection Pattern**: Brief, isolated connections (no persistent connections)

### Connection String Format

**Transaction Pooler** (Recommended):

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Direct Connection** (Not recommended for Next.js):

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### Current Code Configuration

The code is already optimized for transaction pooling:

- Small connection pool (5 connections)
- Short idle timeout (10 seconds)
- Brief connection lifetime (10 minutes)
- No prepared statements (transaction pooler limitation)

### Troubleshooting

**If you still experience timeouts:**

1. **Verify Connection String**: Make sure you're using the transaction pooler connection string (port 6543)
2. **Check Network**: Ensure your network allows outbound connections to Supabase
3. **Monitor Supabase Dashboard**: Check for any service issues or rate limiting
4. **Connection Pool Size**: The code uses a small pool (5) to prevent overload

### Alternative: Session Pooler

If transaction pooler doesn't work, you can try **Session pooler**:

- Use port `5432` with `?pgbouncer=true`
- Better for applications that need session-level features
- Still better than direct connection for serverless

### When to Use Direct Connection

Only use direct connection if:

- You're running a long-lived server (not serverless)
- You need features not supported by poolers (e.g., LISTEN/NOTIFY)
- You're in a controlled environment with persistent connections

## Database Hosting Service

**Current**: Supabase (PostgreSQL)

**Should you switch?** Generally **no**, unless:

- You're experiencing persistent connection issues that can't be resolved
- You need specific features Supabase doesn't provide
- Cost is a significant concern

**Supabase Advantages**:

- ✅ Managed PostgreSQL with automatic backups
- ✅ Built-in connection pooling
- ✅ Easy scaling
- ✅ Good developer experience
- ✅ Generous free tier

**If you must switch**, consider:

- **Neon**: Serverless PostgreSQL, great for Next.js
- **Railway**: Simple managed PostgreSQL
- **AWS RDS**: Enterprise-grade, more complex setup

## Next Steps

1. ✅ Update your `DATABASE_URL` to use transaction pooler connection string
2. ✅ Restart your development server
3. ✅ Test the connection - timeouts should be resolved
4. ✅ Monitor connection performance

If issues persist after switching to transaction pooler, we can investigate further.
