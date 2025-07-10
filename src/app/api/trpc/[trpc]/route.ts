import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/context";

const handler = (req: Request) => {
  console.log(`incoming request ${req.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createContext,
  });
};

export { handler as GET, handler as POST }; 