import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/app/server/router";
import type { inferRouterOutputs } from "@trpc/server";

export const api = createTRPCReact<AppRouter>();

export type RouterOutputs = inferRouterOutputs<AppRouter>;
