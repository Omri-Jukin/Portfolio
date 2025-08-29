import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/app/server/router";

export const api = createTRPCReact<AppRouter>();
