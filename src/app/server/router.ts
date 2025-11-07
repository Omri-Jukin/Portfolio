import { router } from "./trpc";
import { blogRouter } from "./routers/blog";
import { contactRouter } from "./routers/contact";
import { usersRouter } from "./routers/users";
import { adminBlogRouter } from "./routers/adminBlog";
import { emailsRouter } from "./routers/emails";
import { intakesRouter } from "./routers/intakes";
import { emailTemplatesRouter } from "./routers/emailTemplates";
import { authRouter } from "./routers/auth";
import { uploadRouter } from "./routers/upload";
import { certificationsRouter } from "./routers/certifications";
import { workExperiencesRouter } from "./routers/workExperiences";
import { educationRouter } from "./routers/education";
import { projectsRouter } from "./routers/projects";
import { skillsRouter } from "./routers/skills";
import { adminDashboardRouter } from "./routers/adminDashboard";
import { pricingRouter } from "./routers/pricing";
import { discountsRouter } from "./routers/discounts";

export const appRouter = router({
  blog: blogRouter,
  contact: contactRouter,
  users: usersRouter,
  adminBlog: adminBlogRouter,
  emails: emailsRouter,
  intakes: intakesRouter,
  emailTemplates: emailTemplatesRouter,
  auth: authRouter,
  upload: uploadRouter,
  certifications: certificationsRouter,
  workExperiences: workExperiencesRouter,
  education: educationRouter,
  projects: projectsRouter,
  skills: skillsRouter,
  adminDashboard: adminDashboardRouter,
  pricing: pricingRouter,
  discounts: discountsRouter,
});

export type AppRouter = typeof appRouter;
