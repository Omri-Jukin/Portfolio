import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/context";

const handler = (req: Request) => {
  return fetchRequestHandler({
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
          };
        }
        throw error;
      }
    },
  });
};

export { handler as GET, handler as POST };
