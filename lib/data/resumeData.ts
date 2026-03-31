/**
 * Typed resume data — single source of truth for English resume content.
 * Used by resume page and PDF generator.
 *
 * Wording preserved exactly from approved CV. Do not paraphrase.
 */
import type { ResumeData } from "../types";

export const RESUME_DATA_EN: ResumeData = {
  meta: {
    title: "Omri Jukin - Resume",
    author: "Omri Jukin",
  },
  person: {
    name: "Omri Jukin",
    title: "Full Stack Engineer",
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
    "Full Stack Engineer | TypeScript, React/Next.js, Node.js, PostgreSQL, CI/CD",
  summary:
    "Full Stack Engineer focused on building TypeScript-based products and systems end to end across frontend, backend, data, and integrations. Strongest in React/Next.js, Node.js, and PostgreSQL, with a systems-minded approach to architecture, maintainability, reusable UI, secure application flows, and release-safe engineering practices including CI/CD and production-readiness workflows.",
  coreSkills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "HTML5", "CSS3"],
    },
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "React Native",
        "Angular",
        "SvelteKit",
        "Material UI",
        "Tailwind CSS",
        "Framer Motion",
        "Storybook",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "tRPC",
        "Payload CMS",
        "Auth.js",
        "REST APIs",
        "API Design",
        "System Integration",
      ],
    },
    {
      category: "Databases",
      items: [
        "PostgreSQL",
        "MongoDB",
        "Drizzle ORM",
        "Data Modeling",
        "Database Design",
      ],
    },
    {
      category: "Cloud / Infrastructure / DevOps",
      items: [
        "Docker",
        "Docker Compose",
        "GitHub Actions",
        "CI/CD",
        "Supabase",
        "Cloudflare",
        "Traefik",
        "Vercel",
        "Git",
      ],
    },
    {
      category: "Testing / Tooling",
      items: ["Jest", "Vitest"],
    },
  ],
  experience: [
    {
      role: "Technical Lead (Volunteer CTO)",
      company: "The Atheist Line",
      period: "2025–Present",
      bullets: [
        "Define and lead the technical direction of the organization’s digital ecosystem as the primary hands-on engineer.",
        "Design and build public-facing and internal systems spanning website architecture, content workflows, operational tooling, and team-facing processes.",
        "Own end-to-end technical planning and implementation across architecture, integrations, automation opportunities, CI/CD, and production readiness.",
        "Establish the technical foundations for future systems including content management, internal workflows, analytics, and platform-level operations.",
      ],
    },
    {
      role: "Full Stack Engineer",
      company: "Abra Technologies",
      period: "2024–2025",
      bullets: [
        "Worked on the early development of an internal government data platform supporting data aggregation, insights, and analytical workflows.",
        "Built reusable UI components and an internal component library to support consistency and scalable frontend development.",
        "Used Storybook for component documentation and validation, and wrote component-level tests to improve confidence and maintainability.",
        "Contributed to frontend architecture and participated in architecture and technology discussions during the project’s early foundation.",
      ],
    },
    {
      role: "Business Rules Configuration Specialist",
      company: "Menora Mivtachim Insurance Company",
      period: "2023–2024",
      bullets: [
        "Configured and maintained business rules within an internal system used to manage insurance product logic.",
        "Defined rule behavior for different insurance products based on business and operational requirements.",
        "Supported policy-related configuration across product workflows with a focus on correctness and consistency.",
      ],
    },
  ],
  projects: [
    {
      name: "Socially",
      line: "Creator operations platform built with React Native, Supabase, Cloudflare, and TypeScript.",
      url: "https://github.com/Omri-Jukin",
      bullets: [
        "Building a creator operations platform focused on cross-platform content workflows, publishing flows, analytics, and creator-facing workflows.",
        "Design the system across mobile frontend, backend services, data models, authentication, and platform integration boundaries.",
        "Work across React Native, Supabase, and Cloudflare-based services to structure the product for scalable workflows and future platform integrations.",
        "Own the product’s end-to-end technical direction with a focus on maintainability, release safety, and production readiness.",
      ],
    },
    {
      name: "ClipWhisperer",
      line: "Microservices-based video automation platform built with Node.js, Supabase, AWS, and cloud infrastructure.",
      url: "https://github.com/ClipWhisperer",
      bullets: [
        "Built a microservices-based platform for automating short-form video generation workflows across orchestration, storage, processing, and delivery.",
        "Designed a hub-based orchestration flow to coordinate multiple services through state-driven processing steps.",
        "Implemented queue-based jobs, FFmpeg-based media processing, storage handling, and cloud-integrated service communication.",
        "Focused on decomposing the system into maintainable services with clear operational responsibilities.",
      ],
    },
    {
      name: "Snow HQ",
      line: "Multi-tenant CRM system built with Next.js, tRPC, and PostgreSQL.",
      url: "https://github.com/Omri-Jukin/Snow",
      bullets: [
        "Built a multi-tenant CRM system with authentication, role-based access, dashboards, reporting, and invoicing-oriented workflows.",
        "Implemented the product across frontend, backend, and database layers using Next.js, tRPC, and PostgreSQL.",
        "Designed the system around account separation, permissions, and real-time data flows.",
        "Structured the application for maintainability and future expansion across tenant-aware workflows.",
      ],
    },
  ],
  education: [
    {
      degree: "Practical Electrical Engineering Diploma",
      institution: "Air Force Technological College",
      location: "",
      period: "2015–2017",
    },
    {
      degree: "Full Stack Engineering Course",
      institution: "Codecademy",
      location: "",
      period: "2020–2021",
    },
  ],
  additionalExperience: [
    {
      role: "Senior Customer Service Representative",
      company: "Menora Mivtachim Insurance Company",
      period: "2021–2023",
      bullets: [
        "Managed day-to-day work for a 17-person service team and oversaw 5 collections representatives.",
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
