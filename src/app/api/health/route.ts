import { NextResponse } from "next/server";
import { getDB } from "$/db/client";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
  };

  try {
    const db = await getDB();
    diagnostics.database = db ? "connected" : "not-configured";
  } catch (error) {
    console.error("[health] Database check failed:", error);
    diagnostics.database = "error";
  }

  return NextResponse.json(
    {
      status: diagnostics.database === "error" ? "degraded" : "ok",
      diagnostics,
    },
    {
      status: diagnostics.database === "error" ? 503 : 200,
    }
  );
}
