import { createTRPCRouter } from "../init";
import { projectsRouter } from "./projects";
import { postsRouter } from "./posts";
import { skillsRouter } from "./skills";
import { testimonialsRouter } from "./testimonials";
import { authRouter } from "./auth";
import { usersRouter } from "./users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  posts: postsRouter,
  projects: projectsRouter,
  skills: skillsRouter,
  testimonials: testimonialsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
