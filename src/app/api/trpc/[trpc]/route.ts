import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/context";
import { NextResponse } from "next/server";

// Force this route to be dynamic - prevents Next.js from trying to statically analyze it during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = async (req: Request) => {
  // Wrap everything in try-catch to ensure we always return JSON
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: async (opts) => {
        try {
          const ctx = await createContext(opts);
          return ctx;
        } catch (error) {
          // Always return a valid context, never throw
          // This ensures JSON responses instead of HTML error pages
          console.error(
            "[TRPC] Error creating context, using minimal context:",
            {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              hasDatabaseUrl: !!process.env.DATABASE_URL,
              nodeEnv: process.env.NODE_ENV,
            }
          );
          return {
            db: null,
            user: null,
            resHeaders: new Headers(),
            origin:
              typeof opts.req.headers.get === "function"
                ? opts.req.headers.get("origin") ??
                  (opts.req.headers.get("host")
                    ? `https://${opts.req.headers.get("host")}`
                    : null) ??
                  (process.env.NODE_ENV === "production"
                    ? "https://omrijukin.com"
                    : "http://localhost:3000")
                : process.env.NODE_ENV === "production"
                ? "https://omrijukin.com"
                : "http://localhost:3000",
          };
        }
      },
      onError: ({ error, path, type, ctx }) => {
        console.error(`[TRPC] Error on '${path ?? "<no-path>"}':`, {
          error: error.message,
          code: error.code,
          type,
          cause: error.cause,
          stack: error.stack,
          hasDb: !!ctx?.db,
          hasUser: !!ctx?.user,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          timestamp: new Date().toISOString(),
        });

        // Ensure error responses are always JSON
        // tRPC handles this, but we log it for debugging
      },
      responseMeta: () => {
        // Ensure JSON content type is always set
        return {
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    });

    // Ensure response is JSON-compatible - check both content-type and body
    const contentType = response.headers.get("Content-Type") || "";
    const isJsonResponse = contentType.includes("application/json");

    // If response is not JSON, we need to convert it or return JSON error
    if (!isJsonResponse) {
      console.error("[TRPC] Response is not JSON:", {
        contentType,
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json(
        {
          error: {
            message:
              "Server returned invalid response format. This may indicate a server error.",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        { status: 500 }
      );
    }

    // Return the JSON response
    return response;
  } catch (error) {
    // Catch any unhandled errors and return JSON
    // This includes errors that occur outside tRPC handler
    console.error("[TRPC] Unhandled error in tRPC handler:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name || typeof error,
    });

    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        },
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export { handler as GET, handler as POST };
