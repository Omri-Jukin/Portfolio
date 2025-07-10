import { router } from "./trpc";
import { blogRouter } from "./routers/blog";
import { contactRouter } from "./routers/contact";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  blog: blogRouter,
  contact: contactRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter; 