import { NextResponse } from "next/server";
import { requireAdminAccess } from "$/api/auth";

/**
 * Debug endpoint to check production environment configuration
 * Accessible at /api/debug (admin only)
 * This helps diagnose production issues without exposing sensitive data
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
    const env = {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret:
        !!process.env.JWT_SECRET && process.env.JWT_SECRET !== "JWT_SECRET_KEY",
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix:
        process.env.DATABASE_URL?.substring(0, 20) || "not-set",
      hasEmailProvider: !!process.env.EMAIL_PROVIDER,
      emailProvider: process.env.EMAIL_PROVIDER || "not-set",
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailAppPassword: !!process.env.GMAIL_APP_PASSWORD,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "not-set",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        status: "ok",
        environment: env,
        message: "Debug endpoint active - environment variables checked",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
