import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/trpc/routers";

export const trpc = createTRPCReact<AppRouter>();

// Export the type for use in components
export type { AppRouter } from "@/server/trpc/routers";
