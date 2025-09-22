import { NextResponse } from "next/server";
import { getDB } from "$/db/client";

export async function GET() {
  try {
    // Check database connection
    const db = await getDB();

    // Simple database query to verify connection
    await db.execute("SELECT 1");

    // Check environment variables
    const requiredEnvVars = [
      "DATABASE_URL",
      "JWT_SECRET",
      "NEXT_PUBLIC_APP_URL",
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required environment variables",
          missing: missingEnvVars,
        },
        { status: 500 }
      );
    }

    // Return health status
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      database: "connected",
      services: {
        database: "healthy",
        api: "healthy",
        build: "healthy",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: "unhealthy",
          api: "healthy",
          build: "healthy",
        },
      },
      { status: 503 }
    );
  }
}
