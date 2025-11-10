# Database Connection Troubleshooting Guide

## Current Issue: CONNECT_TIMEOUT

If you're seeing `CONNECT_TIMEOUT` errors, this means the connection is timing out at the network level before it can even establish a connection to Supabase.

## Quick Checks

### 1. Verify Your Connection String

Check your `.env.local` or `.env` file:

```bash
# Should look like this for direct connection:
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Or for transaction pooler:
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

### 2. Test Connection Directly

Try connecting with `psql` or a database client:

```bash
# For direct connection (port 5432)
psql "postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# For transaction pooler (port 6543)
psql "postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

If this also times out, it's a network/firewall issue, not a code issue.

### 3. Check Network/Firewall

- **Windows Firewall**: May be blocking outbound connections
- **Corporate Firewall**: May block database connections
- **VPN**: If you're on a VPN, try disconnecting
- **Antivirus**: May be blocking the connection

### 4. Check Supabase Status

Visit https://status.supabase.com to see if there are any service issues.

### 5. Try Different Connection Methods

#### Option A: Direct Connection (Port 5432)

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

#### Option B: Transaction Pooler (Port 6543)

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

#### Option C: Session Pooler (Port 5432 with pgbouncer)

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true
```

### 6. Increase Connection Timeout

The code now uses a 60-second timeout. If you need longer, you can modify `lib/db/client.ts`:

```typescript
connect_timeout: 120, // 2 minutes
```

### 7. Check for IP Restrictions

In Supabase Dashboard:

- Go to **Settings** → **Database**
- Check **Connection Pooling** settings
- Verify there are no IP restrictions blocking your connection

### 8. Try from Different Network

If possible, try connecting from:

- A different network (mobile hotspot)
- A different location
- This will help determine if it's network-specific

## Common Solutions

### Solution 1: Use Transaction Pooler

Transaction pooler (port 6543) is often more reliable for Next.js:

1. Go to Supabase Dashboard → Settings → Database
2. Select **Transaction pooler** connection string
3. Update your `DATABASE_URL`
4. Restart your dev server

### Solution 2: Disable Windows Firewall Temporarily

To test if firewall is the issue:

1. Open Windows Defender Firewall
2. Temporarily disable it
3. Try connecting
4. Re-enable if it works (then add exception)

### Solution 3: Check Antivirus

Some antivirus software blocks database connections:

1. Temporarily disable antivirus
2. Try connecting
3. If it works, add exception for Node.js/Next.js

### Solution 4: Use Supabase Connection Pooler

Instead of direct connection, use the pooler:

- More reliable
- Better for serverless
- Handles connection management

## Debug Information

After restarting your dev server, check the console for:

```
[DB] Connection details: {
  host: 'aws-0-eu-north-1.pooler.supabase.com',
  port: '5432' or '6543',
  database: 'postgres',
  hasSSL: true/false,
  isPooler: true/false
}
```

This will help identify what connection string is being used.

## Still Not Working?

If none of the above works:

1. **Check Supabase Dashboard**: Verify your project is active and not paused
2. **Reset Database Password**: In Supabase Dashboard → Settings → Database → Reset password
3. **Create New Connection String**: Generate a fresh connection string from Supabase
4. **Contact Supabase Support**: If the issue persists, it might be a Supabase-side issue

## Emergency Workaround

If you absolutely need to work and can't connect:

1. Use Supabase's web SQL editor for database operations
2. Use a local PostgreSQL database for development
3. Use Supabase's REST API instead of direct database connection
