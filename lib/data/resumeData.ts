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
      location: "Israel",
    },
  },
  headline:
    "Full Stack Engineer | TypeScript, React/Next.js, Node.js, PostgreSQL",
  summary:
    "Full Stack Engineer building TypeScript-based product systems end to end, from frontend architecture and reusable UI components to backend flows, APIs, and database-driven features. Strongest in React/Next.js, Node.js, PostgreSQL, and product-focused engineering with an emphasis on maintainability, clarity, and technical ownership.",
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
        "Angular",
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
      items: ["Docker", "Vercel", "Cloud Infrastructure", "Git"],
    },
    {
      category: "Testing / Tooling",
      items: ["Jest", "Vitest", "Storybook"],
    },
  ],
  experience: [
    {
      role: "Technical Lead (Volunteer CTO)",
      company: "The Atheist Line, Israel",
      period: "2025–Present",
      bullets: [
        "Lead the organization’s technical direction, infrastructure, and digital operations as the primary hands-on builder.",
        "Plan and build internal and public-facing systems to improve operational structure, documentation, and team workflows.",
        "Own technical decision-making across the website, project and task tracking, platform integrations, and evaluation of a new telephony system.",
        "Establish the technical foundations for future tooling, including content management, internal workflows, automation, analytics, and team-facing operational systems.",
      ],
    },
    {
      role: "Full Stack Engineer",
      company: "Abra Technologies, Israel",
      period: "2024–2025",
      bullets: [
        "Contributed to the early-stage development of an internal government data platform for aggregating data, generating insights, and supporting analytical workflows.",
        "Worked across early frontend implementation and broader technical planning, including active participation in architecture and technology discussions.",
        "Built an internal component library to support reusable UI development and frontend consistency.",
        "Used Storybook for component documentation and validation, and wrote dedicated tests for individual components.",
        "Supported the project foundation with a focus on maintainable frontend architecture and scalable implementation patterns.",
      ],
    },
    {
      role: "Business Rules Configuration Specialist",
      company: "Menora Mivtachim Insurance Company, Israel",
      period: "2023–2024",
      bullets: [
        "Worked on business-rule configuration within an internal system used to manage insurance product logic.",
        "Defined and maintained rule behavior for different insurance products based on business and operational requirements.",
        "Supported policy-related configuration and rule management across product workflows.",
      ],
    },
  ],
  projects: [
    {
      name: "Snow HQ",
      line: "Multi-tenant CRM system built with Next.js, tRPC, and PostgreSQL.",
      url: "https://github.com/Omri-Jukin/Snow",
      bullets: [
        "Built a multi-tenant CRM system with authentication, role-based access, live metrics, reporting, and invoicing-oriented capabilities.",
        "Implemented the application across frontend, backend, and database layers using Next.js, tRPC, and PostgreSQL.",
        "Designed the system to support account separation, permissions, and real-time data experiences.",
        "Completed as a fully built product project, though not deployed publicly.",
      ],
    },
    {
      name: "ClipWhisperer",
      line: "Microservices-based video automation platform built with Node.js, Supabase, AWS, and cloud infrastructure.",
      url: "https://github.com/ClipWhisperer",
      bullets: [
        "Built a microservices-based platform for automating short-form video generation workflows, including orchestration, storage, processing, and delivery flow management.",
        "Designed a hub-driven orchestration model to coordinate multiple services through a finite-state-machine-like workflow.",
        "Implemented queue-based processing, storage handling, FFmpeg-based media processing, and cloud-integrated service communication.",
        "Completed as a fully built internal product project, though not deployed publicly.",
      ],
    },
    {
      name: "Microservices Manager",
      line: "CLI tool for managing and orchestrating multi-service projects.",
      url: "https://github.com/ClipWhisperer/Utils",
      bullets: [
        "Built a reusable CLI tool for managing multi-microservice development workflows, including test execution, build processes, and deployment-related terminal operations.",
        "Originally developed to support ClipWhisperer, then structured to be adaptable across other microservices-based projects.",
        "Designed the tool to adjust itself to the target project structure and automate repetitive operational workflows.",
        "Maintained as a practical developer tooling project and working package.",
      ],
    },
  ],
  education: [
    {
      degree: "Practical Electrical Engineering Diploma",
      institution: "Air Force Technological College, Be'er Sheva",
      location: "Be'er Sheva",
      period: "2015–2017",
    },
    {
      degree: "Full Stack Engineering Course",
      institution: "Codecademy",
      location: "Online",
      period: "2020–2021",
    },
  ],
  additionalExperience: [
    {
      role: "Senior Customer Service Representative",
      company: "Menora Mivtachim Insurance Company, Israel",
      period: "2021–2023",
      bullets: [
        "Managed a team of 17 service representatives.",
        "Oversaw 5 collections representatives as part of day-to-day team operations.",
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
