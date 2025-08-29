import { router } from "../init";
import { projectsRouter } from "./projects";
import { skillsRouter } from "./skills";
import { postsRouter } from "./posts";

export const appRouter = router({
  projects: projectsRouter,
  skills: skillsRouter,
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
