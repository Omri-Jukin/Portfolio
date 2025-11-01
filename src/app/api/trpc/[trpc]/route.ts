import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/context";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: async (opts) => {
        try {
          return await createContext(opts);
        } catch (error) {
          // Always return a valid context, never throw
          // This ensures JSON responses instead of HTML error pages
          console.error(
            "Error creating context, using minimal context:",
            error
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
          timestamp: new Date().toISOString(),
        });
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

    // Ensure response is JSON-compatible
    if (!response.headers.get("Content-Type")?.includes("application/json")) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid response format",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    // Catch any unhandled errors and return JSON
    console.error("Unhandled error in tRPC handler:", error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        },
      },
      { status: 500 }
    );
  }
};

export { handler as GET, handler as POST };
