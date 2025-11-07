import { NextResponse } from "next/server";
import { getDB } from "$/db/client";
import { sql } from "drizzle-orm";
import { UserStatus, UserRole } from "#/lib";
import { requireAdminAccess } from "$/api/auth";

/**
 * Test database connectivity in production
 * Accessible at /api/test-db (admin only)
 */
export async function GET() {
  // Require admin access
  try {
    await requireAdminAccess();
  } catch (error: unknown) {
    console.error("Admin access required:", error);
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }
  try {
    console.log("[TEST-DB] Starting database test");

    const db = await getDB();

    if (!db) {
      console.error("[TEST-DB] Database client is null");
      return NextResponse.json(
        {
          status: "error",
          message: "Database client is null",
          hasDatabaseUrl: !!process.env.DATABASE_URL,
        },
        { status: 500 }
      );
    }

    console.log("[TEST-DB] Database client created successfully");

    // Test 1: Simple query
    const testResult = await db.execute(sql`SELECT 1 as test`);
    console.log("[TEST-DB] Simple query result:", testResult);

    // Test 2: Check users table
    const usersResult = await db.execute(
      sql`SELECT id, email, role, status FROM users LIMIT 5`
    );
    console.log("[TEST-DB] Users query result:", usersResult);

    // Convert results to arrays for both driver types
    const testRows = Array.isArray(testResult)
      ? testResult
      : (testResult as { rows?: Record<string, unknown>[] }).rows || [];
    const usersRows = Array.isArray(usersResult)
      ? usersResult
      : (usersResult as { rows?: Record<string, unknown>[] }).rows || [];

    return NextResponse.json(
      {
        status: "ok",
        message: "Database connection successful",
        tests: {
          simpleQuery: testRows.length > 0,
          usersFound: usersRows.length,
          userEmails: usersRows.map((u: Record<string, unknown>) => ({
            email: u.email as string,
            role: u.role as UserRole,
            status: u.status as UserStatus,
          })),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TEST-DB] Error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        error: {
          name: error instanceof Error ? error.constructor.name : typeof error,
          message: error instanceof Error ? error.message : String(error),
        },
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
      { status: 500 }
    );
  }
}
