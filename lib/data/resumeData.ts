/**
 * Typed resume data - single source of truth for English resume content.
 * Used by resume page and PDF generator.
 *
 * Recruiter-facing resume wording used by the public resume page and PDF generator.
 */
import type { ResumeData } from "../types";

export const RESUME_DATA_EN: ResumeData = {
  meta: {
    title: "Omri Jukin - Resume",
    author: "Omri Jukin",
  },
  person: {
    name: "Omri Jukin",
    title: "Full-Stack TypeScript Engineer",
    photoUrl: "/profile-photo.png",
    contacts: {
      phone: "+972 52-334-4064",
      email: "omrijukin@gmail.com",
      portfolio: "https://omrijukin.com",
      github: "https://github.com/Omri-Jukin",
      linkedin: "https://www.linkedin.com/in/omri-jukin/",
      location: "",
    },
  },
  headline:
    "Full-Stack TypeScript Engineer | Next.js, React, Node.js, PostgreSQL, Supabase, CI/CD",
  summary:
    "Full-Stack TypeScript Engineer with 3+ years of professional experience across React/Next.js frontends, Node.js backends, PostgreSQL/Supabase data models, internal tooling, and production-minded delivery. I work best where product context, API/data boundaries, implementation, and maintainability all matter.",
  coreSkills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Java", "C#"],
    },
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "Material UI",
        "Storybook",
        "React Native",
        "Angular",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "tRPC",
        "REST APIs",
        "API Design",
        "Auth.js",
        "Payload CMS",
        "Express.js",
      ],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "Supabase", "Drizzle ORM", "MongoDB", "Data Modeling"],
    },
    {
      category: "Cloud / DevOps",
      items: [
        "Cloudflare",
        "Docker",
        "Docker Compose",
        "GitHub Actions",
        "CI/CD",
        "Traefik",
        "Git",
      ],
    },
    {
      category: "Testing / Tooling",
      items: ["Jest", "Vitest", "Component Testing"],
    },
  ],
  experience: [
    {
      role: "Technical Lead",
      company: "The Atheist Line",
      period: "2025-Present",
      bullets: [
        "Serve as primary hands-on engineer for technical direction, implementation planning, and digital ecosystem ownership.",
        "Own architecture and implementation across website, content workflows, internal tooling, integrations, CI/CD, analytics foundations, and production readiness.",
        "Translate needs from design, publishing, community, and operations into maintainable technical workflows.",
      ],
    },
    {
      role: "Full Stack Engineer",
      company: "Abra Technologies",
      period: "2024-2025",
      bullets: [
        "Helped build an early internal government data platform for aggregation, insights, and analytical workflows.",
        "Built reusable React/TypeScript UI components and component-library foundations for scalable frontend delivery.",
        "Used Storybook and component-level tests to document, validate, and maintain reusable UI work.",
        "Contributed to frontend architecture and early technology decisions.",
      ],
    },
    {
      role: "Business Rules Configuration Specialist",
      company: "Menora Mivtachim Insurance Company",
      period: "2023-2024",
      bullets: [
        "Configured internal business rules for insurance product logic and policy-related workflows.",
        "Defined rule behavior from business and operational requirements with focus on correctness and consistency.",
        "Supported operational configuration in systems where rule accuracy affected product workflows.",
      ],
    },
  ],
  projects: [
    {
      name: "Portfolio Platform",
      line: "Production Next.js portfolio and CMS built with TypeScript, tRPC, Drizzle, Supabase, and Auth.js.",
      bullets: [
        "Built public pages, authenticated dashboard workflows, content APIs, and structured resume/project data.",
        "Designed data and API boundaries with tRPC, Drizzle, Supabase/PostgreSQL, and CMS-backed content flows.",
        "Own recruiter-facing pages, admin tooling, contact flows, deployment wiring, and generated resume output.",
      ],
    },
    {
      name: "Snow HQ",
      line: "Multi-tenant CRM system built with Next.js, tRPC, PostgreSQL, and Drizzle ORM.",
      bullets: [
        "Built tenant-aware CRM workflows across UI, APIs, data models, dashboards, and invoicing-oriented flows.",
        "Modeled tenant ownership, permissions, and RBAC assumptions as first-class application boundaries.",
        "Structured the system for maintainable dashboard workflows and future expansion.",
      ],
    },
    {
      name: "ClipWhisperer",
      line: "Queue-driven video automation platform built with Node.js, TypeScript, Supabase, AWS, and FFmpeg.",
      bullets: [
        "Built automation architecture for short-form video generation across orchestration, processing, storage, and delivery.",
        "Used queue-driven jobs and hub-based orchestration for long-running media workflows.",
        "Separated FFmpeg processing, cloud storage, and service communication boundaries for maintainability.",
      ],
    },
  ],
  education: [
    {
      degree: "Practical Electrical Engineering Diploma",
      institution: "Air Force Technological College",
      location: "",
      period: "2015-2017",
    },
    {
      degree: "Full Stack Engineering Course",
      institution: "Codecademy",
      location: "",
      period: "2020-2021",
    },
  ],
  additionalExperience: [
    {
      role: "Senior Customer Service Representative",
      company: "Menora Mivtachim Insurance Company",
      period: "2021-2023",
      bullets: [
        "Managed day-to-day operations for a 17-person service team and oversaw 5 collections representatives.",
        "Trained team members and supported service-quality improvement through structured processes.",
      ],
    },
  ],
  links: [
    { label: "Portfolio", url: "https://omrijukin.com" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/omri-jukin/" },
    { label: "GitHub", url: "https://github.com/Omri-Jukin" },
  ],
};
