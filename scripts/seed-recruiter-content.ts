/**
 * Seed recruiter-facing portfolio content into the database-backed content tables.
 *
 * This is intentionally limited to tables that already model public content:
 * users, public_content_blocks, work_experiences, projects, skills, education,
 * and services.
 *
 * Run:
 *   npm run seed:recruiter-content
 */

import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });
config({ path: ".env" });

import { closeDB, getDB } from "../lib/db/client";
import {
  education,
  projects,
  publicContentBlocks,
  services,
  skills,
  users,
  workExperiences,
} from "../lib/db/schema/schema.tables";
import type {
  NewEducation,
  NewProject,
  NewPublicContentBlock,
  NewService,
  NewSkill,
  NewWorkExperience,
} from "../lib/db/schema/schema.types";

const seedAdminEmail = process.env.SEED_ADMIN_EMAIL ?? "omrijukin@gmail.com";
const now = new Date();

async function getOrCreateSeedUser(db: NonNullable<Awaited<ReturnType<typeof getDB>>>) {
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, seedAdminEmail))
    .limit(1);

  if (existingUser) {
    return existingUser.id;
  }

  await db
    .insert(users)
    .values({
      email: seedAdminEmail,
      firstName: "Omri",
      lastName: "Jukin",
      role: "admin",
      status: "approved",
      provider: "seed",
      website: "https://omrijukin.com",
      linkedin: "https://www.linkedin.com/in/omri-jukin/",
      github: "https://github.com/Omri-Jukin",
      updatedAt: now,
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

async function seedWorkExperiences(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>,
  createdBy: string
) {
  const rows: NewWorkExperience[] = [
    {
      id: "the-atheist-line-technical-lead",
      role: "Technical Lead",
      company: "The Atheist Line",
      location: "Remote / Israel",
      startDate: new Date("2025-01-01"),
      endDate: null,
      description:
        "Volunteer technical leadership role for a 17-person organization. Serves as the primary technical owner for technical decisions, implementation planning, and digital operations.",
      achievements: [
        "Defined the technical direction for public-facing and internal systems.",
        "Established zero-to-one architecture for website, content, tooling, analytics, CI/CD, and production readiness.",
        "Translated organizational needs across design, publishing, community, and operations roles into maintainable technical workflows.",
      ],
      technologies: [
        "Technical leadership",
        "Software architecture",
        "Full-stack TypeScript",
        "Next.js",
        "React",
        "Node.js",
        "CMS workflows",
        "Internal tooling",
        "Workflow automation",
        "CI/CD",
      ],
      responsibilities: [
        "Technical direction",
        "Architecture",
        "Hands-on implementation",
        "Integrations",
        "Operational workflows",
        "Production readiness",
      ],
      employmentType: "part-time",
      industry: "Nonprofit / Community",
      displayOrder: 1,
      isVisible: true,
      isFeatured: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "abra-full-stack-engineer",
      role: "Full Stack Engineer",
      company: "Abra Technologies",
      location: "Israel",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-01-01"),
      description:
        "Worked on the early development of an internal government data platform supporting data aggregation, insights, and analytical workflows.",
      achievements: [
        "Built reusable UI components and internal component-library foundations.",
        "Used Storybook for component documentation and validation.",
        "Wrote component-level tests to improve maintainability and development confidence.",
        "Contributed to frontend architecture and early technical decisions.",
      ],
      technologies: ["React", "TypeScript", "Storybook", "Component testing"],
      responsibilities: [
        "Frontend implementation",
        "Reusable UI systems",
        "Component documentation",
        "Testing",
      ],
      employmentType: "full-time",
      industry: "Technology",
      displayOrder: 2,
      isVisible: true,
      isFeatured: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "menora-business-rules",
      role: "Business Rules Configuration Specialist",
      company: "Menora Mivtachim Insurance Company",
      location: "Israel",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2024-01-01"),
      description:
        "Configured and maintained internal business rules used to manage insurance product logic.",
      achievements: [
        "Defined rule behavior for different insurance products based on operational requirements.",
        "Supported policy-related configuration with a focus on correctness and consistency.",
      ],
      technologies: ["Business rules", "Configuration", "Operational systems"],
      responsibilities: ["Rule configuration", "Product logic", "Operational correctness"],
      employmentType: "full-time",
      industry: "Insurance",
      displayOrder: 3,
      isVisible: true,
      isFeatured: false,
      createdBy,
      updatedAt: now,
    },
  ];

  for (const row of rows) {
    await db
      .insert(workExperiences)
      .values(row)
      .onConflictDoUpdate({
        target: workExperiences.id,
        set: { ...row, updatedAt: now },
      });
  }

  console.log(`Work experiences: upserted ${rows.length}`);
}

async function seedPublicContentBlocks(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>,
  createdBy: string
) {
  const rows: NewPublicContentBlock[] = [
    {
      id: "home-hero-main",
      page: "home",
      locale: "en",
      sectionKey: "hero",
      blockKey: "main",
      blockType: "hero",
      title:
        "I build production-ready TypeScript systems for teams that need one engineer who can own the full stack.",
      subtitle:
        "Frontend, backend, database, auth, integrations, internal tools, and deployment - built with clean architecture, strong ownership, and enough pragmatism to actually ship.",
      ctaLabel: "Review selected work",
      href: "#selected-work",
      items: ["Download resume", "Contact", "GitHub", "LinkedIn"],
      metadata: {
        eyebrow: "Full-stack TypeScript Engineer | Product-minded systems builder",
        secondaryHref: "/resume",
        tertiaryHref: "#contact-section",
      },
      displayOrder: 1,
      isVisible: true,
      isFeatured: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-section-what-i-can-own",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "section",
      blockType: "section",
      title: "What I Can Own",
      subtitle:
        "The roles that fit me best need a hands-on engineer who can move across product, frontend, backend, data, integrations, and release work without losing the system view.",
      displayOrder: 10,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-what-i-can-own-platform-work",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "platform-work",
      blockType: "card",
      title: "Full-stack product and platform work",
      body:
        "I am strongest where a team needs someone who can understand the product flow, design the data and API boundaries, build the UI, integrate services, and keep the delivery path practical.",
      ctaLabel: "Review selected work",
      href: "#selected-work",
      displayOrder: 11,
      isVisible: true,
      isFeatured: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-what-i-can-own-best-fit",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "best-fit-card",
      blockType: "card",
      title: "Best fit",
      body:
        "TypeScript-heavy products, dashboards, internal tools, integrations, CMS/backoffice workflows, and product-platform systems.",
      ctaLabel: "Start a conversation",
      href: "/contact",
      displayOrder: 12,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-metric-years",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "metric-years",
      blockType: "metric",
      title: "3+ years professional engineering",
      body:
        "Full-stack engineering experience at Abra Technologies, plus technical leadership and zero-to-one platform ownership at The Atheist Line.",
      displayOrder: 13,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-metric-ownership",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "metric-ownership",
      blockType: "metric",
      title: "Full-stack ownership",
      body:
        "Next.js, React, Node.js, PostgreSQL, tRPC, Drizzle, Supabase, Cloudflare, auth, integrations, internal tooling, and deployment workflows.",
      displayOrder: 14,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-metric-systems",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "metric-systems",
      blockType: "metric",
      title: "Shipped systems, not toy demos",
      body:
        "CRM workflows, CMS/backoffice tooling, creator operations, microservices automation, portfolio infrastructure, and reusable UI/component systems.",
      displayOrder: 15,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-metric-fit",
      page: "home",
      locale: "en",
      sectionKey: "what-i-can-own",
      blockKey: "metric-fit",
      blockType: "metric",
      title: "Best fit",
      body:
        "Teams that need a hands-on engineer who can move across product, frontend, backend, data, and operational workflows without creating architecture debt.",
      displayOrder: 16,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-section-selected-work",
      page: "home",
      locale: "en",
      sectionKey: "selected-work",
      blockKey: "section",
      blockType: "section",
      title: "Selected Work",
      subtitle:
        "A focused set of systems that show how I think about product flow, architecture, implementation, and production readiness.",
      displayOrder: 20,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-section-experience",
      page: "home",
      locale: "en",
      sectionKey: "experience",
      blockKey: "section",
      blockType: "section",
      title: "Experience",
      subtitle:
        "Professional work and technical leadership context, written plainly so the role shape is easy to evaluate.",
      displayOrder: 30,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-experience-abra",
      page: "home",
      locale: "en",
      sectionKey: "experience",
      blockKey: "abra",
      blockType: "card",
      title: "Abra Technologies",
      subtitle: "Full Stack Engineer, 2024-2025",
      body:
        "Worked on the early development of an internal government data platform, reusable UI systems, Storybook-backed component workflows, component testing, and frontend architecture foundations.",
      displayOrder: 31,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-experience-atheist-line",
      page: "home",
      locale: "en",
      sectionKey: "experience",
      blockKey: "atheist-line",
      blockType: "card",
      title: "The Atheist Line",
      subtitle: "Technical Lead, 2025-Present",
      body:
        "Volunteer technical leadership role for a 17-person organization. I serve as the primary technical owner for public-facing and internal systems, content workflows, tooling, integrations, CI/CD, analytics foundations, and production readiness.",
      displayOrder: 32,
      isVisible: true,
      isFeatured: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-experience-menora",
      page: "home",
      locale: "en",
      sectionKey: "experience",
      blockKey: "menora",
      blockType: "card",
      title: "Menora Mivtachim",
      subtitle: "Business Rules Configuration Specialist, 2023-2024",
      body:
        "Configured insurance product logic and internal business rules with a focus on correctness, consistency, and operational reliability.",
      displayOrder: 33,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-section-technical-strengths",
      page: "home",
      locale: "en",
      sectionKey: "technical-strengths",
      blockKey: "section",
      blockType: "section",
      title: "Technical Strengths",
      subtitle: "The strengths I want hiring teams to evaluate first.",
      displayOrder: 40,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-strength-full-stack-typescript",
      page: "home",
      locale: "en",
      sectionKey: "technical-strengths",
      blockKey: "full-stack-typescript",
      blockType: "card",
      title: "Full-stack TypeScript delivery",
      body:
        "Next.js, React, Node.js, tRPC/REST APIs, PostgreSQL, Drizzle, Supabase, auth, and deployment workflows.",
      ctaLabel: "Review full-stack proof",
      href: "/resume#portfolio-platform",
      displayOrder: 41,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-strength-frontend",
      page: "home",
      locale: "en",
      sectionKey: "technical-strengths",
      blockKey: "frontend",
      blockType: "card",
      title: "Frontend systems that stay maintainable",
      body:
        "Reusable UI components, responsive product screens, Storybook-backed workflows, component testing, and clean feature composition.",
      ctaLabel: "Review frontend proof",
      href: "/resume#portfolio-platform",
      displayOrder: 42,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-strength-backend",
      page: "home",
      locale: "en",
      sectionKey: "technical-strengths",
      blockKey: "backend",
      blockType: "card",
      title: "Backend, data, and integrations",
      body:
        "API boundaries, relational data modeling, permissions, queue-driven workflows, media processing, and service ownership.",
      ctaLabel: "Review backend proof",
      href: "/resume#clipwhisperer",
      displayOrder: 43,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-strength-internal-tools",
      page: "home",
      locale: "en",
      sectionKey: "technical-strengths",
      blockKey: "internal-tools",
      blockType: "card",
      title: "Internal tools and operational workflows",
      body:
        "CMS/backoffice systems, dashboards, admin panels, automation opportunities, and tools that reduce fragmented manual work.",
      ctaLabel: "Review systems proof",
      href: "/resume#snow-hq",
      displayOrder: 44,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-section-proof-links",
      page: "home",
      locale: "en",
      sectionKey: "proof-links",
      blockKey: "section",
      blockType: "section",
      title: "Resume, GitHub, and Case Studies",
      subtitle:
        "The fastest links for reviewing my work, background, and implementation history.",
      displayOrder: 50,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-proof-links",
      page: "home",
      locale: "en",
      sectionKey: "proof-links",
      blockKey: "links",
      blockType: "list",
      items: [
        {
          title: "Resume",
          body: "Full experience, skills, education, and project history in one place.",
          href: "/resume",
          cta: "Open resume",
        },
        {
          title: "Snow HQ case study",
          body: "Multi-tenant CRM with tRPC, PostgreSQL, Drizzle, RBAC-aware modeling, and dashboard flows.",
          href: "/resume#snow-hq",
          cta: "View case study",
        },
        {
          title: "ClipWhisperer architecture",
          body: "Queue-driven video automation platform with service boundaries and cloud processing.",
          href: "/resume#clipwhisperer",
          cta: "View architecture notes",
        },
        {
          title: "Portfolio platform",
          body: "Public i18n site plus authenticated CMS/backoffice, content APIs, and modular homepage composition.",
          href: "/resume#portfolio-platform",
          cta: "View system notes",
        },
        {
          title: "GitHub",
          body: "Code, experiments, project repositories, and implementation history.",
          href: "https://github.com/Omri-Jukin",
          cta: "Open GitHub",
        },
        {
          title: "LinkedIn",
          body: "Professional profile and fastest recruiter-friendly contact path.",
          href: "https://www.linkedin.com/in/omri-jukin/",
          cta: "Open LinkedIn",
        },
      ],
      displayOrder: 51,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    {
      id: "home-section-common-questions",
      page: "home",
      locale: "en",
      sectionKey: "common-questions",
      blockKey: "section",
      blockType: "section",
      title: "Common Questions",
      displayOrder: 60,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
    ...[
      [
        "own-work-end-to-end",
        "Can you own work end to end?",
        "Yes. My strongest lane is full-stack ownership across frontend, backend, data modeling, integrations, deployment, and operational workflows.",
      ],
      [
        "are-you-senior",
        "Are you senior?",
        "Not by title. I have 3+ years of hands-on professional engineering experience across 2024-2026 and counting, and I back that with strong ownership, modern stack fluency, clear communication, and production-minded delivery.",
      ],
      [
        "best-fit",
        "Where do you fit best?",
        "Teams building TypeScript-heavy products, dashboards, internal tools, integrations, CMS/backoffice workflows, or product-platform systems that need someone comfortable across the stack.",
      ],
      [
        "review-first",
        "What should I review first?",
        "Start with Snow HQ for full-stack product execution, ClipWhisperer for backend/platform architecture, the Portfolio Platform for CMS/backoffice ownership, and the resume for work history.",
      ],
      [
        "difference",
        "What makes you different from another TypeScript developer?",
        "I am not only focused on screens or isolated tickets. I care about the system: product flow, data model, API boundaries, operational workflow, maintainability, and how the thing gets shipped.",
      ],
      [
        "contact",
        "How should a recruiter contact you?",
        "LinkedIn or email are best. Send the role, stack, team context, and what kind of ownership the position requires.",
      ],
    ].map(([blockKey, title, body], index) => ({
      id: `home-question-${blockKey}`,
      page: "home",
      locale: "en",
      sectionKey: "common-questions",
      blockKey,
      blockType: "question" as const,
      title,
      body,
      displayOrder: 61 + index,
      isVisible: true,
      createdBy,
      updatedAt: now,
    })),
    {
      id: "home-section-contact",
      page: "home",
      locale: "en",
      sectionKey: "contact",
      blockKey: "section",
      blockType: "section",
      title: "Contact",
      subtitle:
        "I am best suited for teams building product-facing systems, internal tools, dashboards, integrations, CMS/backoffice workflows, and TypeScript-heavy web platforms.",
      body:
        "For selected technical/project conversations, send a short brief with scope, timeline, and current technical constraints.",
      items: ["Email Omri", "Message on LinkedIn", "Download resume"],
      displayOrder: 70,
      isVisible: true,
      createdBy,
      updatedAt: now,
    },
  ];

  for (const row of rows) {
    await db
      .insert(publicContentBlocks)
      .values(row)
      .onConflictDoUpdate({
        target: publicContentBlocks.id,
        set: { ...row, updatedAt: now },
      });
  }

  console.log(`Public content blocks: upserted ${rows.length}`);
}

async function seedProjects(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>,
  createdBy: string
) {
  const rows: NewProject[] = [
    {
      id: "portfolio-platform",
      title: "Portfolio Platform",
      subtitle: "Public portfolio plus authenticated CMS/backoffice",
      description:
        "Production portfolio platform with clean URLs, i18n, authenticated admin tooling, content APIs, and recruiter-facing proof surfaces.",
      longDescription:
        "A public i18n portfolio site backed by private content and career-data workflows, built to make resume, project, and implementation proof easier to maintain.",
      technologies: ["Next.js", "TypeScript", "tRPC", "Drizzle", "Supabase", "NextAuth"],
      categories: ["Full-stack", "CMS", "Portfolio"],
      status: "in-progress",
      projectType: "personal",
      startDate: new Date("2024-01-01"),
      endDate: null,
      liveUrl: "https://omrijukin.com",
      keyFeatures: [
        "Clean locale-free public URLs",
        "Authenticated CMS/backoffice",
        "Recruiter-facing resume and proof flows",
        "Contact flow with project-context prefill",
      ],
      teamSize: 1,
      myRole: "Sole builder: architecture, implementation, content workflows, and deployment.",
      displayOrder: 1,
      isVisible: true,
      isFeatured: true,
      isOpenSource: false,
      problem:
        "A portfolio needs a public proof surface plus private tools for content, career data, and technical case studies.",
      solution:
        "A production Next.js system with public pages, admin tooling, content APIs, and structured recruiter-facing proof.",
      architecture:
        "Public i18n site plus RBAC-protected admin CMS, Postgres-backed content APIs, and modular homepage composition.",
      createdBy,
      updatedAt: now,
    },
    {
      id: "socially",
      title: "Socially",
      subtitle: "Creator operations platform",
      description:
        "Creator operations platform direction focused on publishing workflows, analytics, creator-facing operations, and release readiness.",
      longDescription:
        "Private build and release-readiness case study for a creator operations platform with mobile frontend, backend boundaries, auth, and integration-ready data models.",
      technologies: ["React Native", "TypeScript", "Supabase", "Cloudflare"],
      categories: ["Mobile", "Creator tooling", "Platform"],
      status: "in-progress",
      projectType: "personal",
      startDate: new Date("2025-01-01"),
      endDate: null,
      keyFeatures: [
        "Creator workflow planning",
        "Supabase-backed data modeling",
        "Cloudflare deployment boundaries",
        "Release-readiness planning",
      ],
      teamSize: 1,
      myRole: "End-to-end technical direction across product architecture, implementation, and release readiness.",
      displayOrder: 2,
      isVisible: true,
      isFeatured: true,
      isOpenSource: false,
      problem:
        "Creator operations need publishing, analytics, and workflow coordination without fragmented tooling.",
      solution:
        "A creator operations platform architecture with mobile frontend, backend boundaries, auth, and integration-ready data models.",
      architecture:
        "Product architecture and release-readiness plan; public demo is not available yet.",
      createdBy,
      updatedAt: now,
    },
    {
      id: "clipwhisperer",
      title: "ClipWhisperer",
      subtitle: "Queue-driven video automation platform",
      description:
        "Service-oriented platform for automating short-form video generation workflows across orchestration, storage, processing, and delivery.",
      longDescription:
        "Private architecture walkthrough covering queue-driven orchestration, media-processing boundaries, service separation, and cloud-integrated processing.",
      technologies: ["Node.js", "TypeScript", "Supabase", "AWS", "FFmpeg"],
      categories: ["Backend", "Automation", "Media"],
      status: "completed",
      projectType: "personal",
      startDate: new Date("2024-01-01"),
      endDate: null,
      keyFeatures: [
        "Hub-based orchestration",
        "Queue-driven jobs",
        "FFmpeg media processing",
        "Cloud-integrated service communication",
      ],
      teamSize: 1,
      myRole: "Platform design and hands-on implementation across orchestration, media processing, and service boundaries.",
      displayOrder: 3,
      isVisible: true,
      isFeatured: true,
      isOpenSource: false,
      problem:
        "Manual video generation pipelines are slow, fragile, and hard to scale across processing, storage, and delivery.",
      solution:
        "A production-oriented video automation platform with queue-driven orchestration and media-processing boundaries.",
      architecture:
        "Hub-based orchestration with queue-driven jobs, service separation, and cloud-integrated processing steps.",
      createdBy,
      updatedAt: now,
    },
    {
      id: "snow-hq",
      title: "Snow HQ",
      subtitle: "Multi-tenant CRM system",
      description:
        "Private multi-tenant CRM build with authentication, role-based access, dashboards, reporting, and invoicing-oriented workflows.",
      longDescription:
        "Full-stack private build with tenant-aware data modeling, type-safe APIs, RBAC, dashboard-oriented workflows, and implementation notes.",
      technologies: ["Next.js", "tRPC", "PostgreSQL", "Drizzle ORM"],
      categories: ["CRM", "Full-stack", "Dashboard"],
      status: "completed",
      projectType: "personal",
      startDate: new Date("2024-01-01"),
      endDate: null,
      keyFeatures: [
        "Tenant-aware CRM workflows",
        "RBAC-aware data modeling",
        "Type-safe APIs",
        "Dashboard UI",
      ],
      teamSize: 1,
      myRole: "Full-stack implementation across frontend, backend, and database layers.",
      displayOrder: 4,
      isVisible: true,
      isFeatured: true,
      isOpenSource: false,
      problem:
        "CRM workflows need tenant separation, permissions, dashboards, and maintainable full-stack delivery.",
      solution:
        "A multi-tenant CRM with RBAC-aware data modeling, typed APIs, and dashboard flows.",
      architecture:
        "Type-safe APIs, tenant-aware data modeling, RBAC, and dashboard-oriented workflows.",
      createdBy,
      updatedAt: now,
    },
  ];

  for (const row of rows) {
    await db
      .insert(projects)
      .values(row)
      .onConflictDoUpdate({
        target: projects.id,
        set: { ...row, updatedAt: now },
      });
  }

  console.log(`Projects: upserted ${rows.length}`);
}

async function seedSkills(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>,
  createdBy: string
) {
  const rows: NewSkill[] = [
    {
      id: "technical-leadership",
      name: "Technical leadership",
      category: "soft",
      subCategory: "Ownership",
      proficiencyLevel: 4,
      proficiencyLabel: "advanced",
      yearsOfExperience: 3,
      description:
        "Technical direction, implementation planning, stakeholder communication, and production-readiness ownership.",
      relatedSkills: ["Software architecture", "Stakeholder communication", "CI/CD"],
      projects: ["the-atheist-line-technical-lead", "portfolio-platform"],
      lastUsed: now,
      isVisible: true,
      displayOrder: 1,
      createdBy,
      updatedAt: now,
    },
    {
      id: "full-stack-typescript",
      name: "Full-stack TypeScript",
      category: "technical",
      subCategory: "Application engineering",
      proficiencyLevel: 4,
      proficiencyLabel: "advanced",
      yearsOfExperience: 3,
      description:
        "End-to-end TypeScript systems across frontend, backend, data, auth, integrations, and deployment.",
      relatedSkills: ["Next.js", "React", "Node.js", "tRPC", "PostgreSQL"],
      projects: ["portfolio-platform", "snow-hq", "socially"],
      lastUsed: now,
      isVisible: true,
      displayOrder: 2,
      createdBy,
      updatedAt: now,
    },
    {
      id: "nextjs-react",
      name: "Next.js and React",
      category: "framework",
      subCategory: "Frontend",
      proficiencyLevel: 4,
      proficiencyLabel: "advanced",
      yearsOfExperience: 3,
      description:
        "Product UI, public pages, admin dashboards, reusable components, and responsive frontend systems.",
      relatedSkills: ["Storybook", "Material UI", "Tailwind CSS", "Component testing"],
      projects: ["portfolio-platform", "snow-hq"],
      lastUsed: now,
      isVisible: true,
      displayOrder: 3,
      createdBy,
      updatedAt: now,
    },
    {
      id: "backend-data-modeling",
      name: "Backend and data modeling",
      category: "technical",
      subCategory: "Backend",
      proficiencyLevel: 4,
      proficiencyLabel: "advanced",
      yearsOfExperience: 3,
      description:
        "Node.js services, tRPC/REST APIs, PostgreSQL schemas, Drizzle models, permissions, and integration-ready data boundaries.",
      relatedSkills: ["Node.js", "PostgreSQL", "Drizzle ORM", "Supabase", "Auth.js"],
      projects: ["portfolio-platform", "snow-hq", "clipwhisperer"],
      lastUsed: now,
      isVisible: true,
      displayOrder: 4,
      createdBy,
      updatedAt: now,
    },
    {
      id: "internal-tooling",
      name: "Internal tooling and workflow automation",
      category: "tool",
      subCategory: "Operations",
      proficiencyLevel: 4,
      proficiencyLabel: "advanced",
      yearsOfExperience: 3,
      description:
        "CMS/backoffice systems, dashboards, admin panels, automation opportunities, and operational workflows.",
      relatedSkills: ["CMS workflows", "Admin dashboards", "Workflow automation"],
      projects: ["the-atheist-line-technical-lead", "portfolio-platform", "snow-hq"],
      lastUsed: now,
      isVisible: true,
      displayOrder: 5,
      createdBy,
      updatedAt: now,
    },
  ];

  for (const row of rows) {
    await db
      .insert(skills)
      .values(row)
      .onConflictDoUpdate({
        target: skills.id,
        set: { ...row, updatedAt: now },
      });
  }

  console.log(`Skills: upserted ${rows.length}`);
}

async function seedEducation(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>,
  createdBy: string
) {
  const rows: Array<NewEducation & { id: string }> = [
    {
      id: "air-force-technological-college-electrical-engineering",
      institution: "Air Force Technological College",
      degree: "Practical Electrical Engineering Diploma",
      degreeType: "diploma",
      fieldOfStudy: "Electrical Engineering",
      startDate: new Date("2015-01-01"),
      endDate: new Date("2017-01-01"),
      status: "completed",
      achievements: [],
      coursework: [],
      projects: [],
      extracurriculars: [],
      location: "Israel",
      isVisible: true,
      displayOrder: 1,
      createdBy,
      updatedAt: now,
    },
    {
      id: "codecademy-full-stack-engineering",
      institution: "Codecademy",
      degree: "Full Stack Engineering Course",
      degreeType: "certificate",
      fieldOfStudy: "Full Stack Engineering",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2021-01-01"),
      status: "completed",
      achievements: [],
      coursework: ["Full-stack web development", "JavaScript", "Backend APIs"],
      projects: [],
      extracurriculars: [],
      location: "Remote",
      isVisible: true,
      displayOrder: 2,
      createdBy,
      updatedAt: now,
    },
  ];

  for (const row of rows) {
    await db
      .insert(education)
      .values(row)
      .onConflictDoUpdate({
        target: education.id,
        set: { ...row, updatedAt: now },
      });
  }

  console.log(`Education: upserted ${rows.length}`);
}

async function seedServices(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>,
  createdBy: string
) {
  const rows: NewService[] = [
    {
      id: "full-stack-product-systems",
      name: "Full-stack product systems",
      category: "development",
      serviceType: "project",
      description:
        "Design and build TypeScript-heavy web systems across frontend, backend, data, auth, integrations, and deployment.",
      longDescription:
        "Useful for selected technical/project conversations where the scope needs product thinking, architecture, implementation, and production readiness.",
      features: [
        "Next.js and React applications",
        "Node.js/tRPC/REST APIs",
        "PostgreSQL and Drizzle data modeling",
        "Auth, integrations, and deployment workflows",
      ],
      technologies: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL"],
      pricingType: "range",
      deliverables: [
        "Architecture plan",
        "Production-ready implementation",
        "Deployment path",
        "Technical documentation where useful",
      ],
      requirements: ["Clear scope", "Timeline", "Technical constraints"],
      portfolioExamples: ["portfolio-platform", "snow-hq", "clipwhisperer"],
      isActive: true,
      isPopular: true,
      displayOrder: 1,
      createdBy,
      updatedAt: now,
    },
  ];

  for (const row of rows) {
    await db
      .insert(services)
      .values(row)
      .onConflictDoUpdate({
        target: services.id,
        set: { ...row, updatedAt: now },
      });
  }

  console.log(`Services: upserted ${rows.length}`);
}

async function seed() {
  console.log("Seeding recruiter-facing content...\n");

  const db = await getDB();
  if (!db) {
    console.error(
      "Database connection failed. Set DATABASE_URL or DIRECT_DATABASE_URL in .env.local or .env."
    );
    process.exit(1);
  }

  try {
    const createdBy = await getOrCreateSeedUser(db);

    await seedPublicContentBlocks(db, createdBy);
    await seedWorkExperiences(db, createdBy);
    await seedProjects(db, createdBy);
    await seedSkills(db, createdBy);
    await seedEducation(db, createdBy);
    await seedServices(db, createdBy);

    console.log("Seed completed.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

seed();
