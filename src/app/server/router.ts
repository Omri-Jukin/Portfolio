// Load environment variables at the top
import dotenv from "dotenv";

// Load .env.local first, then .env, then .env.example
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.example" });

import { router } from "./trpc";
import { blogRouter } from "./routers/blog";
import { contactRouter } from "./routers/contact";
import { usersRouter } from "./routers/users";
import { adminBlogRouter } from "./routers/adminBlog";
import { emailsRouter } from "./routers/emails";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  blog: blogRouter,
  contact: contactRouter,
  users: usersRouter,
  adminBlog: adminBlogRouter,
  emails: emailsRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
