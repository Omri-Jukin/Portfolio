import { router } from "./trpc";
import { blogRouter } from "./routers/blog";
import { contactRouter } from "./routers/contact";
import { usersRouter } from "./routers/users";
import { adminBlogRouter } from "./routers/adminBlog";
import { emailsRouter } from "./routers/emails";
import { authRouter } from "./routers/auth";
import { uploadRouter } from "./routers/upload";
import { certificationsRouter } from "./routers/certifications";
import { workExperiencesRouter } from "./routers/workExperiences";
import { projectsRouter } from "./routers/projects";
import { skillsRouter } from "./routers/skills";

export const appRouter = router({
  blog: blogRouter,
  contact: contactRouter,
  users: usersRouter,
  adminBlog: adminBlogRouter,
  emails: emailsRouter,
  auth: authRouter,
  upload: uploadRouter,
  certifications: certificationsRouter,
  workExperiences: workExperiencesRouter,
  projects: projectsRouter,
  skills: skillsRouter,
});

export type AppRouter = typeof appRouter;
