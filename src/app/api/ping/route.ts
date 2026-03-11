import { NextResponse } from "next/server";

/** Minimal liveness check - no DB or other deps. Use to verify Worker responds. */
export async function GET() {
  return NextResponse.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
