import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/context";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  try {
    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: async (opts) => {
        try {
          return await createContext(opts);
        } catch (error) {
          // During build time, if database connection fails, return a minimal context
          if (
            process.env.NODE_ENV === "production" &&
            !process.env.VERCEL &&
            error instanceof Error &&
            error.message.includes("Database not available during build")
          ) {
            console.warn("Using minimal context during build time");
            return {
              db: null,
              user: null,
              resHeaders: new Headers(),
              origin:
                typeof opts.req.headers.get === "function"
                  ? opts.req.headers.get("origin") ?? ""
                  : "",
            };
          }
          throw error;
        }
      },
      onError: ({ error, path }) => {
        console.error(`tRPC error on '${path ?? "<no-path>"}':`, error);
      },
    });
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
