import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/context";

const handler = (req: Request) => {
  console.log(`=== tRPC API Request ===`);
  console.log(`URL: ${req.url}`);
  console.log(`Method: ${req.method}`);
  console.log(`Headers:`, Object.fromEntries(req.headers.entries()));
  console.log(`========================`);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createContext,
  });
};

export { handler as GET, handler as POST };
