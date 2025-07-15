import { router } from "./trpc";
import { blogRouter } from "./routers/blog";
import { contactRouter } from "./routers/contact";
import { usersRouter } from "./routers/users";
import { adminBlogRouter } from "./routers/adminBlog";

export const appRouter = router({
  blog: blogRouter,
  contact: contactRouter,
  users: usersRouter,
  adminBlog: adminBlogRouter,
});

export type AppRouter = typeof appRouter;
