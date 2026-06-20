/**
 * Seed individual Core Skills rows into the CMS skills table.
 *
 * Existing rows are preserved by default so CMS edits remain the source of
 * truth after the first import. Matching is done by stable seed id or skill
 * name to avoid duplicates when a skill already exists in the CMS.
 *
 * Run:
 *   npm run seed:core-skills
 *
 * To refresh existing seeded rows from this file:
 *   npm run seed:core-skills -- --force
 */

import { config } from "dotenv";
import { eq, or } from "drizzle-orm";

config({ path: ".env.local" });
config({ path: ".env" });

import { closeDB, getDB } from "../lib/db/client";
import { skills, users } from "../lib/db/schema/schema.tables";
import type { NewSkill } from "../lib/db/schema/schema.types";

const seedAdminEmail = process.env.SEED_ADMIN_EMAIL ?? "omrijukin@gmail.com";
const force = process.argv.includes("--force");

type CoreSkillSeed = Omit<
  NewSkill,
  "createdAt" | "updatedAt" | "createdBy" | "lastUsed"
>;

type SkillInput = Omit<
  CoreSkillSeed,
  | "id"
  | "certifications"
  | "isVisible"
  | "isResumeFeatured"
  | "displayOrder"
>;

function skill(id: string, displayOrder: number, input: SkillInput): CoreSkillSeed {
  return {
    id,
    displayOrder,
    certifications: [],
    isVisible: true,
    isResumeFeatured: true,
    ...input,
  };
}

const coreSkills: CoreSkillSeed[] = [
  skill("core-skill-typescript", 10, {
    name: "TypeScript",
    category: "technical",
    subCategory: "Languages",
    proficiencyLevel: 80,
    proficiencyLabel: "expert",
    yearsOfExperience: 4,
    description:
      "Primary language for typed frontend, backend, API, data-access, and product-platform work.",
    relatedSkills: ["React", "Next.js", "Node.js", "tRPC", "Drizzle ORM"],
    projects: ["portfolio-platform", "snow-hq", "socially", "clipwhisperer"],
  }),
  skill("core-skill-javascript", 11, {
    name: "JavaScript",
    category: "technical",
    subCategory: "Languages",
    proficiencyLevel: 74,
    proficiencyLabel: "advanced",
    yearsOfExperience: 4,
    description:
      "Modern JavaScript foundations behind React, Node.js, browser behavior, and frontend platform work.",
    relatedSkills: ["TypeScript", "React", "Node.js"],
    projects: ["portfolio-platform", "snow-hq", "socially"],
  }),
  skill("core-skill-python", 12, {
    name: "Python",
    category: "technical",
    subCategory: "Languages",
    proficiencyLevel: 49,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 3,
    description:
      "Practical scripting, data handling, automation support, and AI/backend experimentation where Python is the right tool.",
    relatedSkills: ["Automation", "Data processing", "AI tooling"],
    projects: ["clipwhisperer"],
  }),
  skill("core-skill-java", 13, {
    name: "Java",
    category: "technical",
    subCategory: "Languages",
    proficiencyLevel: 38,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Foundational object-oriented programming background from formal full-stack training and broader engineering study.",
    relatedSkills: ["Object-oriented programming", "Backend fundamentals"],
    projects: [],
  }),
  skill("core-skill-csharp", 14, {
    name: "C#",
    category: "technical",
    subCategory: "Languages",
    proficiencyLevel: 34,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Foundational C# experience useful for typed application design and object-oriented engineering conversations.",
    relatedSkills: ["Object-oriented programming", "Typed systems"],
    projects: [],
  }),
  skill("core-skill-react", 20, {
    name: "React",
    category: "framework",
    subCategory: "Frontend",
    proficiencyLevel: 80,
    proficiencyLabel: "expert",
    yearsOfExperience: 3,
    description:
      "Reusable product UI, component systems, admin dashboards, and responsive recruiter-facing pages.",
    relatedSkills: ["Next.js", "TypeScript", "Storybook", "Tailwind CSS"],
    projects: ["portfolio-platform", "snow-hq", "socially"],
  }),
  skill("core-skill-nextjs", 21, {
    name: "Next.js",
    category: "framework",
    subCategory: "Frontend",
    proficiencyLevel: 76,
    proficiencyLabel: "expert",
    yearsOfExperience: 3,
    description:
      "App Router public pages, server-rendered content, API routes, authenticated dashboards, and production portfolio workflows.",
    relatedSkills: ["React", "TypeScript", "Node.js", "tRPC"],
    projects: ["portfolio-platform", "snow-hq"],
  }),
  skill("core-skill-react-native", 22, {
    name: "React Native",
    category: "framework",
    subCategory: "Frontend",
    proficiencyLevel: 52,
    proficiencyLabel: "advanced",
    yearsOfExperience: 1,
    description:
      "Mobile/frontend direction for creator workflow products and cross-platform product architecture.",
    relatedSkills: ["React", "TypeScript", "Supabase"],
    projects: ["socially"],
  }),
  skill("core-skill-angular", 23, {
    name: "Angular",
    category: "framework",
    subCategory: "Frontend",
    proficiencyLevel: 36,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Frontend framework exposure from full-stack training and broader web application foundations.",
    relatedSkills: ["TypeScript", "Frontend architecture"],
    projects: [],
  }),
  skill("core-skill-tailwind-css", 24, {
    name: "Tailwind CSS",
    category: "tool",
    subCategory: "Frontend",
    proficiencyLevel: 70,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Utility-first styling for responsive interfaces, design-system implementation, and fast product UI iteration.",
    relatedSkills: ["React", "Next.js", "Responsive UI"],
    projects: ["portfolio-platform"],
  }),
  skill("core-skill-material-ui", 25, {
    name: "Material UI",
    category: "framework",
    subCategory: "Frontend",
    proficiencyLevel: 62,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Component-library work and reusable internal UI foundations in product and dashboard contexts.",
    relatedSkills: ["React", "Storybook", "Component systems"],
    projects: ["snow-hq"],
  }),
  skill("core-skill-storybook", 26, {
    name: "Storybook",
    category: "tool",
    subCategory: "Frontend",
    proficiencyLevel: 64,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Component documentation and validation for reusable UI systems and internal component libraries.",
    relatedSkills: ["React", "Component testing", "Design systems"],
    projects: ["snow-hq"],
  }),
  skill("core-skill-nodejs", 30, {
    name: "Node.js",
    category: "technical",
    subCategory: "Backend",
    proficiencyLevel: 70,
    proficiencyLabel: "advanced",
    yearsOfExperience: 4,
    description:
      "Backend services, API routes, tRPC procedures, auth flows, workers, and integration-ready server logic.",
    relatedSkills: ["TypeScript", "tRPC", "PostgreSQL", "Auth.js", "Queues"],
    projects: ["portfolio-platform", "socially", "clipwhisperer"],
  }),
  skill("core-skill-trpc", 31, {
    name: "tRPC",
    category: "technical",
    subCategory: "Backend",
    proficiencyLevel: 68,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Type-safe API boundaries between React/Next.js clients and backend business workflows.",
    relatedSkills: ["TypeScript", "Next.js", "React Query", "API design"],
    projects: ["portfolio-platform", "snow-hq"],
  }),
  skill("core-skill-rest-apis", 32, {
    name: "REST APIs",
    category: "technical",
    subCategory: "Backend",
    proficiencyLevel: 62,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "HTTP API design, request validation, response shaping, and integration-ready route boundaries.",
    relatedSkills: ["Node.js", "API Design", "Runtime validation"],
    projects: ["portfolio-platform", "socially"],
  }),
  skill("core-skill-api-design", 33, {
    name: "API Design",
    category: "technical",
    subCategory: "Backend",
    proficiencyLevel: 66,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Typed contracts, validation boundaries, error handling, and API shapes that support maintainable product workflows.",
    relatedSkills: ["TypeScript", "tRPC", "REST APIs", "Zod"],
    projects: ["portfolio-platform", "snow-hq", "socially"],
  }),
  skill("core-skill-authjs", 34, {
    name: "Auth.js / NextAuth",
    category: "technical",
    subCategory: "Backend",
    proficiencyLevel: 58,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Authentication and session-aware application flows for protected dashboards and CMS/admin areas.",
    relatedSkills: ["Next.js", "RBAC", "Session management"],
    projects: ["portfolio-platform", "snow-hq"],
  }),
  skill("core-skill-payload-cms", 35, {
    name: "Payload CMS",
    category: "tool",
    subCategory: "Backend",
    proficiencyLevel: 42,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "CMS exposure for content modeling and admin-editable publishing workflows.",
    relatedSkills: ["CMS workflows", "Content modeling", "Admin dashboards"],
    projects: [],
  }),
  skill("core-skill-expressjs", 36, {
    name: "Express.js",
    category: "framework",
    subCategory: "Backend",
    proficiencyLevel: 45,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 2,
    description:
      "Node.js web framework experience for route handlers, middleware, and REST-style server foundations.",
    relatedSkills: ["Node.js", "REST APIs", "Middleware"],
    projects: [],
  }),
  skill("core-skill-postgresql", 40, {
    name: "PostgreSQL",
    category: "database",
    subCategory: "Databases",
    proficiencyLevel: 70,
    proficiencyLabel: "advanced",
    yearsOfExperience: 4,
    description:
      "Schema design, relational modeling, query-backed CMS data, auth-adjacent data, and operational content workflows.",
    relatedSkills: ["Supabase", "Drizzle ORM", "Data modeling", "SQL"],
    projects: ["portfolio-platform", "snow-hq", "socially", "clipwhisperer"],
  }),
  skill("core-skill-supabase", 41, {
    name: "Supabase",
    category: "database",
    subCategory: "Databases",
    proficiencyLevel: 66,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Postgres-backed application data, auth-adjacent architecture, storage, and product-platform persistence.",
    relatedSkills: ["PostgreSQL", "Auth", "Storage", "Cloudflare"],
    projects: ["portfolio-platform", "socially", "clipwhisperer"],
  }),
  skill("core-skill-drizzle-orm", 42, {
    name: "Drizzle ORM",
    category: "database",
    subCategory: "Databases",
    proficiencyLevel: 66,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Typed schema definitions, migrations, relational data access, and CMS-backed content models.",
    relatedSkills: ["PostgreSQL", "TypeScript", "Data modeling"],
    projects: ["portfolio-platform", "snow-hq"],
  }),
  skill("core-skill-data-modeling", 43, {
    name: "Data Modeling",
    category: "database",
    subCategory: "Databases",
    proficiencyLevel: 68,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Structured entities, relationships, permissions, workflow state, and content models that support product behavior.",
    relatedSkills: ["PostgreSQL", "Drizzle ORM", "RBAC", "CMS workflows"],
    projects: ["portfolio-platform", "snow-hq", "socially", "clipwhisperer"],
  }),
  skill("core-skill-mongodb", 44, {
    name: "MongoDB",
    category: "database",
    subCategory: "Databases",
    proficiencyLevel: 38,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Document-database exposure from full-stack training and broader application data modeling.",
    relatedSkills: ["Data modeling", "Backend fundamentals"],
    projects: [],
  }),
  skill("core-skill-aws", 50, {
    name: "AWS",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 49,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 2,
    description:
      "Cloud-platform familiarity for deployment, operational boundaries, storage, and production-oriented engineering conversations.",
    relatedSkills: ["CI/CD", "Deployment", "Cloudflare", "Supabase"],
    projects: ["clipwhisperer", "socially"],
  }),
  skill("core-skill-cloudflare", 51, {
    name: "Cloudflare",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 58,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Deployment boundaries, Workers/Pages-oriented architecture, and production hosting workflows.",
    relatedSkills: ["Next.js", "Deployment", "CI/CD"],
    projects: ["portfolio-platform", "socially"],
  }),
  skill("core-skill-docker", 52, {
    name: "Docker",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 48,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 2,
    description:
      "Containerized development and deployment foundations for local services and production-oriented workflows.",
    relatedSkills: ["Docker Compose", "Deployment", "Infrastructure"],
    projects: [],
  }),
  skill("core-skill-docker-compose", 53, {
    name: "Docker Compose",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 46,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 2,
    description:
      "Local multi-service orchestration for databases, application services, and development environments.",
    relatedSkills: ["Docker", "PostgreSQL", "Local development"],
    projects: [],
  }),
  skill("core-skill-github-actions", 54, {
    name: "GitHub Actions",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 52,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "CI workflow setup for checks, build confidence, and release-readiness automation.",
    relatedSkills: ["CI/CD", "Git", "Deployment"],
    projects: ["portfolio-platform"],
  }),
  skill("core-skill-cicd", 55, {
    name: "CI/CD",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 58,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Release workflows, validation gates, build/deploy confidence, and production-readiness discipline.",
    relatedSkills: ["GitHub Actions", "Testing", "Deployment"],
    projects: ["portfolio-platform", "the-atheist-line-technical-lead"],
  }),
  skill("core-skill-git", 56, {
    name: "Git",
    category: "tool",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 70,
    proficiencyLabel: "advanced",
    yearsOfExperience: 4,
    description:
      "Daily version-control workflow across branches, reviews, implementation history, and release coordination.",
    relatedSkills: ["GitHub", "CI/CD", "Code review"],
    projects: ["portfolio-platform", "snow-hq", "socially", "clipwhisperer"],
  }),
  skill("core-skill-traefik", 57, {
    name: "Traefik",
    category: "cloud",
    subCategory: "Cloud & DevOps",
    proficiencyLevel: 34,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Reverse-proxy and routing exposure from infrastructure-oriented development workflows.",
    relatedSkills: ["Docker", "Deployment", "Infrastructure"],
    projects: [],
  }),
  skill("core-skill-jest", 60, {
    name: "Jest",
    category: "tool",
    subCategory: "Testing / Tooling",
    proficiencyLevel: 54,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Unit and integration test coverage for application logic, API behavior, auth, and regression safety.",
    relatedSkills: ["Component testing", "TypeScript", "Testing Library"],
    projects: ["portfolio-platform", "snow-hq"],
  }),
  skill("core-skill-vitest", 61, {
    name: "Vitest",
    category: "tool",
    subCategory: "Testing / Tooling",
    proficiencyLevel: 42,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Modern TypeScript testing exposure for fast feedback loops and logic-level verification.",
    relatedSkills: ["TypeScript", "Unit testing"],
    projects: [],
  }),
  skill("core-skill-component-testing", 62, {
    name: "Component Testing",
    category: "tool",
    subCategory: "Testing / Tooling",
    proficiencyLevel: 58,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Component-level checks for reusable UI behavior, maintainability, and development confidence.",
    relatedSkills: ["React", "Storybook", "Testing Library"],
    projects: ["snow-hq", "portfolio-platform"],
  }),
  skill("core-skill-ffmpeg", 63, {
    name: "FFmpeg",
    category: "tool",
    subCategory: "Testing / Tooling",
    proficiencyLevel: 44,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Media-processing boundary experience for automated video workflows and backend processing pipelines.",
    relatedSkills: ["Media processing", "Queues", "Node.js"],
    projects: ["clipwhisperer"],
  }),
  skill("core-skill-software-architecture", 70, {
    name: "Software Architecture",
    category: "technical",
    subCategory: "Architecture",
    proficiencyLevel: 68,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "System boundaries, data models, API contracts, operational workflows, and production-readiness tradeoffs.",
    relatedSkills: ["Data Modeling", "API Design", "Technical Leadership"],
    projects: ["portfolio-platform", "snow-hq", "socially", "clipwhisperer"],
  }),
  skill("core-skill-rbac", 71, {
    name: "RBAC",
    category: "technical",
    subCategory: "Architecture",
    proficiencyLevel: 58,
    proficiencyLabel: "advanced",
    yearsOfExperience: 2,
    description:
      "Role-aware permissions, protected CMS routes, tenant-aware access assumptions, and admin workflow boundaries.",
    relatedSkills: ["Auth.js / NextAuth", "Data Modeling", "Security"],
    projects: ["portfolio-platform", "snow-hq"],
  }),
  skill("core-skill-multi-tenant-systems", 72, {
    name: "Multi-tenant Systems",
    category: "technical",
    subCategory: "Architecture",
    proficiencyLevel: 54,
    proficiencyLabel: "advanced",
    yearsOfExperience: 1,
    description:
      "Tenant-aware data modeling, permission boundaries, and dashboard workflows for CRM-style systems.",
    relatedSkills: ["RBAC", "PostgreSQL", "Data Modeling"],
    projects: ["snow-hq"],
  }),
  skill("core-skill-queue-driven-jobs", 73, {
    name: "Queue-driven Jobs",
    category: "technical",
    subCategory: "Architecture",
    proficiencyLevel: 52,
    proficiencyLabel: "advanced",
    yearsOfExperience: 1,
    description:
      "Asynchronous job design for long-running workflows, processing boundaries, and recoverable state transitions.",
    relatedSkills: ["Workers", "Media processing", "Node.js"],
    projects: ["clipwhisperer"],
  }),
  skill("core-skill-media-processing", 74, {
    name: "Media Processing",
    category: "technical",
    subCategory: "Architecture",
    proficiencyLevel: 48,
    proficiencyLabel: "intermediate",
    yearsOfExperience: 1,
    description:
      "Backend processing boundaries for automated short-form video workflows, storage, and delivery steps.",
    relatedSkills: ["FFmpeg", "Queue-driven Jobs", "Cloud storage"],
    projects: ["clipwhisperer"],
  }),
  skill("core-skill-technical-leadership", 80, {
    name: "Technical Leadership",
    category: "soft",
    subCategory: "Product / Operations",
    proficiencyLevel: 66,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Technical direction, implementation planning, stakeholder translation, and production-readiness ownership.",
    relatedSkills: ["Software Architecture", "CI/CD", "Stakeholder communication"],
    projects: ["the-atheist-line-technical-lead", "portfolio-platform"],
  }),
  skill("core-skill-cms-workflows", 81, {
    name: "CMS Workflows",
    category: "tool",
    subCategory: "Product / Operations",
    proficiencyLevel: 68,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Admin-editable content models, public-content workflows, resume/project CMS data, and backoffice editing loops.",
    relatedSkills: ["Internal Tooling", "Data Modeling", "Admin dashboards"],
    projects: ["portfolio-platform", "the-atheist-line-technical-lead"],
  }),
  skill("core-skill-internal-tooling", 82, {
    name: "Internal Tooling",
    category: "tool",
    subCategory: "Product / Operations",
    proficiencyLevel: 68,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Backoffice screens, dashboard workflows, admin actions, and tools that reduce operational coordination.",
    relatedSkills: ["CMS Workflows", "Workflow Automation", "React"],
    projects: ["portfolio-platform", "snow-hq", "the-atheist-line-technical-lead"],
  }),
  skill("core-skill-workflow-automation", 83, {
    name: "Workflow Automation",
    category: "tool",
    subCategory: "Product / Operations",
    proficiencyLevel: 62,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Operational workflows, automation opportunities, processing steps, and repeatable systems for teams.",
    relatedSkills: ["Internal Tooling", "Queue-driven Jobs", "Business Rules"],
    projects: ["portfolio-platform", "clipwhisperer", "the-atheist-line-technical-lead"],
  }),
  skill("core-skill-business-rules", 84, {
    name: "Business Rules",
    category: "technical",
    subCategory: "Product / Operations",
    proficiencyLevel: 60,
    proficiencyLabel: "advanced",
    yearsOfExperience: 1,
    description:
      "Configuration and correctness-focused product logic from insurance operations and workflow systems.",
    relatedSkills: ["Operational Systems", "Product logic", "Data Modeling"],
    projects: ["menora-business-rules"],
  }),
  skill("core-skill-operational-systems", 85, {
    name: "Operational Systems",
    category: "technical",
    subCategory: "Product / Operations",
    proficiencyLevel: 58,
    proficiencyLabel: "advanced",
    yearsOfExperience: 3,
    description:
      "Systems shaped around real operational workflows, team handoffs, correctness, and maintainable processes.",
    relatedSkills: ["Business Rules", "Internal Tooling", "Workflow Automation"],
    projects: ["menora-business-rules", "the-atheist-line-technical-lead"],
  }),
];

async function getOrCreateSeedUser(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>
) {
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, seedAdminEmail))
    .limit(1);

  if (existingUser) {
    return existingUser.id;
  }

  await db.insert(users).values({
    email: seedAdminEmail,
    firstName: "Omri",
    lastName: "Jukin",
    role: "admin",
    status: "approved",
    provider: "seed",
    website: "https://omrijukin.com",
    linkedin: "https://www.linkedin.com/in/omri-jukin/",
    github: "https://github.com/Omri-Jukin",
    updatedAt: new Date(),
  });

  const [createdUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, seedAdminEmail))
    .limit(1);

  if (!createdUser) {
    throw new Error("Failed to create seed user");
  }

  return createdUser.id;
}

async function main() {
  const db = await getDB();
  const createdBy = await getOrCreateSeedUser(db);
  const now = new Date();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const seedSkill of coreSkills) {
    const [existing] = await db
      .select({ id: skills.id, name: skills.name })
      .from(skills)
      .where(or(eq(skills.id, seedSkill.id), eq(skills.name, seedSkill.name)))
      .limit(1);

    const row: NewSkill = {
      ...seedSkill,
      createdBy,
      createdAt: now,
      updatedAt: now,
      lastUsed: now,
    };

    if (existing && !force) {
      skipped += 1;
      continue;
    }

    if (existing) {
      const { id: _id, createdAt: _createdAt, ...updates } = row;

      await db
        .update(skills)
        .set({
          ...updates,
          updatedAt: now,
        })
        .where(eq(skills.id, existing.id));

      updated += 1;
      continue;
    }

    await db.insert(skills).values(row);
    inserted += 1;
  }

  console.log(
    `Core skills: inserted ${inserted}, updated ${updated}, skipped ${skipped}.`
  );
  console.log(
    force
      ? "Existing skill rows were refreshed from scripts/seed-core-skills.ts."
      : "Existing skill rows were preserved. Use --force to refresh them."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB();
  });
