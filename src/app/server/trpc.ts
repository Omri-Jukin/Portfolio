import { TRPCError, initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC.context<typeof createContext>().create();

// Base router and procedure helpers

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;
    // `ctx.user` is nullable
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: {
        // ✅ user value is known to be non-null now
        user: ctx.user,
        db: ctx.db,
        resHeaders: ctx.resHeaders,
      },
    });
  },
);
