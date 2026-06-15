import Link from "next/link";
import type { Metadata } from "next";
import { Badge, Card, Chip, Container, Section, SectionHeader } from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { PROFILE_LINKS } from "$/constants";
import {
  PublicContentBlockManager,
  type PublicContentBlock,
} from "$/db/publicContent/PublicContentBlockManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import type { IProject } from "$/types";
import { HomeMetricValue } from "./HomeMetricValue";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Omri Jukin - Full-Stack TypeScript Engineer",
  description:
    "Recruiter-focused portfolio for Omri Jukin, a full-stack TypeScript engineer building production-ready web systems with Next.js, React, Node.js, PostgreSQL, tRPC, Drizzle, and Supabase.",
  alternates: {
    canonical: "/",
  },
};

type HomeCopy = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  metrics: Array<{ value: string; label: string }>;
};

type HomeContent = HomeCopy & {
  blocks: PublicContentBlock[];
};

type ProofLinkItem = {
  title: string;
  body?: string;
  href: string;
  cta?: string;
};

type HomeSectionKey =
  | "hero"
  | "what-i-can-own"
  | "selected-work"
  | "experience"
  | "technical-strengths"
  | "proof-links"
  | "common-questions"
  | "contact";

const fallbackSectionOrder: HomeSectionKey[] = [
  "hero",
  "what-i-can-own",
  "selected-work",
  "experience",
  "technical-strengths",
  "proof-links",
  "common-questions",
  "contact",
];

const fallbackCopy: HomeCopy = {
  hero: {
    eyebrow: "Full-stack TypeScript engineer",
    title: "I build production-ready web systems for teams that need ownership across the stack.",
    subtitle:
      "Next.js, React, Node.js, PostgreSQL, tRPC, Drizzle, Supabase, auth, internal tools, and deployment workflows. Based in Israel, working with remote teams.",
  },
  metrics: [
    { value: "3+", label: "Years professional engineering" },
    { value: "Full-stack", label: "Frontend, backend, data, and deployment" },
    { value: "CMS", label: "Authenticated backoffice and public content flows" },
    { value: "Cloudflare", label: "Deployment and production-readiness path" },
  ],
};

const fallbackStrengths = [
  {
    title: "Full-stack TypeScript delivery",
    body:
      "Next.js, React, Node.js, tRPC/REST APIs, PostgreSQL, Drizzle, Supabase, auth, and deployment workflows.",
    href: "/projects/portfolio-platform",
    ctaLabel: "Review full-stack proof",
  },
  {
    title: "Frontend systems that stay maintainable",
    body:
      "Reusable UI components, responsive product screens, Storybook-backed workflows, component testing, and clean feature composition.",
    href: "/projects/portfolio-platform",
    ctaLabel: "Review frontend proof",
  },
  {
    title: "Backend, data, and integrations",
    body:
      "API boundaries, relational data modeling, permissions, queue-driven workflows, media processing, and service ownership.",
    href: "/projects/clipwhisperer",
    ctaLabel: "Review backend proof",
  },
];

const fallbackQuestions = [
  {
    title: "Can you own work end to end?",
    body:
      "Yes. My strongest lane is full-stack ownership across frontend, backend, data modeling, integrations, deployment, and operational workflows.",
  },
  {
    title: "What roles fit best?",
    body:
      "Full-stack TypeScript, product engineering, internal tools, platform work, and teams that value practical ownership.",
  },
  {
    title: "How should a recruiter contact you?",
    body:
      "LinkedIn or email are best. Send the role, stack, team context, and what kind of ownership the position requires.",
  },
];

const fallbackExperienceCards = [
  {
    title: "Abra Technologies",
    subtitle: "Full Stack Engineer, 2024-2025",
    body:
      "Reusable UI systems, Storybook workflows, component testing, and frontend foundations.",
  },
  {
    title: "The Atheist Line",
    subtitle: "Technical Lead, 2025-Present",
    body:
      "Technical ownership for public and internal systems, content workflows, automation, and release readiness.",
  },
  {
    title: "Menora Mivtachim",
    subtitle: "Business Rules Configuration Specialist, 2023-2024",
    body:
      "Business rules configuration with a focus on correctness, consistency, and operational reliability.",
  },
];

const fallbackProjects = [
  {
    title: "Portfolio Platform",
    subtitle: "Recruiter-facing site plus authenticated CMS/backoffice.",
    description:
      "A production portfolio system with public content, private editing workflows, tRPC APIs, Drizzle models, and Cloudflare deployment.",
    technologies: ["Next.js", "TypeScript", "tRPC", "Drizzle", "Postgres"],
    liveUrl: PROFILE_LINKS.PORTFOLIO,
    githubUrl: PROFILE_LINKS.GITHUB,
    myRole: "Sole builder",
  },
  {
    title: "Snow HQ",
    subtitle: "Multi-tenant CRM architecture.",
    description:
      "CRM workflows with tenant-aware data modeling, RBAC, dashboard UX, and type-safe backend boundaries.",
    technologies: ["Next.js", "tRPC", "PostgreSQL", "Drizzle"],
    liveUrl: null,
    githubUrl: null,
    myRole: "Full-stack implementation",
  },
  {
    title: "ClipWhisperer",
    subtitle: "Queue-driven media automation platform.",
    description:
      "Backend/platform work across orchestration, media processing, service boundaries, and cloud-integrated processing.",
    technologies: ["Node.js", "TypeScript", "Supabase", "AWS", "FFmpeg"],
    liveUrl: null,
    githubUrl: null,
    myRole: "Platform design and implementation",
  },
];

function getSectionBlock(blocks: PublicContentBlock[], sectionKey: string) {
  return blocks.find(
    (block) => block.sectionKey === sectionKey && block.blockType === "section"
  );
}

function getSectionCards(blocks: PublicContentBlock[], sectionKey: string) {
  return blocks.filter(
    (block) => block.sectionKey === sectionKey && block.blockType === "card"
  );
}

function getSectionQuestions(blocks: PublicContentBlock[]) {
  return blocks.filter(
    (block) =>
      block.sectionKey === "common-questions" && block.blockType === "question"
  );
}

function getHomeSectionOrder(blocks: PublicContentBlock[]): HomeSectionKey[] {
  const knownKeys = new Set(fallbackSectionOrder);
  const orderedKeys = Array.from(
    blocks
      .filter((block) => knownKeys.has(block.sectionKey as HomeSectionKey))
      .reduce<Map<HomeSectionKey, number>>((sections, block) => {
        const sectionKey = block.sectionKey as HomeSectionKey;
        const current = sections.get(sectionKey);
        sections.set(
          sectionKey,
          current === undefined
            ? block.displayOrder
            : Math.min(current, block.displayOrder)
        );
        return sections;
      }, new Map())
      .entries()
  )
    .sort((a, b) => a[1] - b[1])
    .map(([sectionKey]) => sectionKey);

  const missingKeys = fallbackSectionOrder.filter(
    (sectionKey) => !orderedKeys.includes(sectionKey)
  );

  return [...orderedKeys, ...missingKeys];
}

function getProofLinks(blocks: PublicContentBlock[]): ProofLinkItem[] {
  const proofBlock = blocks.find(
    (block) => block.sectionKey === "proof-links" && block.blockType === "list"
  );

  if (!Array.isArray(proofBlock?.items)) {
    return [];
  }

  return proofBlock.items.filter(
    (item): item is ProofLinkItem =>
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      "href" in item &&
      typeof item.title === "string" &&
      typeof item.href === "string"
  );
}

async function getHomeContent(): Promise<HomeContent> {
  try {
    const blocks = await PublicContentBlockManager.getByPage({
      page: "home",
      locale: "en",
    });

    const hero = blocks.find(
      (block) => block.sectionKey === "hero" && block.blockKey === "main"
    );

    const metrics = blocks
      .filter(
        (block) =>
          block.sectionKey === "what-i-can-own" && block.blockType === "metric"
      )
      .slice(0, 4)
      .map((block) => ({
        value: block.title ?? "",
        label: block.body ?? block.subtitle ?? "",
      }))
      .filter((metric) => metric.value && metric.label);

    return {
      hero: {
        eyebrow:
          typeof hero?.metadata === "object" &&
          hero.metadata !== null &&
          "eyebrow" in hero.metadata &&
          typeof hero.metadata.eyebrow === "string"
            ? hero.metadata.eyebrow
            : fallbackCopy.hero.eyebrow,
        title: hero?.title || fallbackCopy.hero.title,
        subtitle: hero?.subtitle || fallbackCopy.hero.subtitle,
      },
      metrics: metrics.length > 0 ? metrics : fallbackCopy.metrics,
      blocks,
    };
  } catch {
    return { ...fallbackCopy, blocks: [] };
  }
}

async function getFeaturedProjects() {
  try {
    const projects = await ProjectManager.getFeatured(true);
    return projects.length > 0 ? projects.slice(0, 4) : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

function projectHref(project: IProject | (typeof fallbackProjects)[number]) {
  if ("caseStudySlug" in project && project.caseStudySlug) {
    return `/projects/${project.caseStudySlug}`;
  }

  if ("id" in project && project.id) {
    return `/projects/${project.id}`;
  }

  return "/resume";
}

export default async function HomePage() {
  const [content, projects] = await Promise.all([
    getHomeContent(),
    getFeaturedProjects(),
  ]);
  const strengthsSection = getSectionBlock(content.blocks, "technical-strengths");
  const strengthCards = getSectionCards(content.blocks, "technical-strengths");
  const proofSection = getSectionBlock(content.blocks, "proof-links");
  const proofLinks = getProofLinks(content.blocks);
  const questionsSection = getSectionBlock(content.blocks, "common-questions");
  const questions = getSectionQuestions(content.blocks);
  const contactSection = getSectionBlock(content.blocks, "contact");
  const experienceSection = getSectionBlock(content.blocks, "experience");
  const experienceCards = getSectionCards(content.blocks, "experience");
  const sectionOrder = getHomeSectionOrder(content.blocks);

  return (
    <>
      {sectionOrder.map((sectionKey) => {
        switch (sectionKey) {
          case "hero":
            return (
              <Section key={sectionKey} className="pt-14 sm:pt-20 lg:pt-24">
                <Container>
                  <FadeIn className="max-w-5xl">
                    <p className="mb-4 font-mono text-xs font-semibold uppercase text-accent">
                      {content.hero.eyebrow}
                    </p>
                    <h1 className="font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
                      {content.hero.title}
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                      {content.hero.subtitle}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/resume"
                        className="inline-flex h-11 items-center rounded-md bg-accent px-5 text-sm font-medium text-accent-foreground transition-[background-color,transform] hover:bg-accent/90 motion-safe:hover:-translate-y-px"
                      >
                        Download Resume (PDF)
                      </Link>
                      <Link
                        href="#work"
                        className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        View work
                      </Link>
                      <a
                        href={PROFILE_LINKS.GITHUB}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-accent hover:underline"
                      >
                        GitHub
                      </a>
                      <a
                        href={PROFILE_LINKS.LINKEDIN}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-accent hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </FadeIn>
                </Container>
              </Section>
            );
          case "what-i-can-own":
            return (
              <section key={sectionKey} className="border-y border-border bg-muted/30">
                <Container>
                  <Stagger className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                    {content.metrics.map((metric) => (
                      <StaggerItem key={metric.value} className="py-6 sm:px-6">
                        <p className="font-display text-3xl font-semibold text-foreground">
                          <HomeMetricValue value={metric.value} />
                        </p>
                        <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
                          {metric.label}
                        </p>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Container>
              </section>
            );
          case "selected-work":
            return (
              <Section key={sectionKey} id="work">
                <Container>
                  <FadeIn>
                    <SectionHeader
                      eyebrow="Selected work"
                      title="Systems that show product ownership, architecture, and delivery."
                      subtitle="A focused set of projects selected for hiring signal rather than decoration."
                    />
                  </FadeIn>
                  <Stagger className="mt-10 grid gap-4 md:grid-cols-2" delayChildren={0.08}>
                    {projects.map((project) => (
                      <StaggerItem key={project.title}>
                        <Card className="group flex min-h-80 flex-col justify-between p-5 transition-[border-color,transform] hover:border-accent/50 motion-safe:hover:-translate-y-1">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone="accent">
                                {"status" in project ? project.status : "case study"}
                              </Badge>
                              <span className="font-mono text-xs text-muted-foreground">
                                {"myRole" in project && project.myRole
                                  ? project.myRole
                                  : "Full-stack ownership"}
                              </span>
                            </div>
                            <h2 className="mt-5 font-display text-2xl font-semibold">
                              {project.title}
                            </h2>
                            <p className="mt-2 text-sm font-medium text-accent">
                              {project.subtitle}
                            </p>
                            <p className="mt-4 leading-7 text-muted-foreground">
                              {project.description}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                              {project.technologies.slice(0, 6).map((technology) => (
                                <Chip key={technology}>{technology}</Chip>
                              ))}
                            </div>
                          </div>
                          <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                              href={projectHref(project)}
                              className="text-sm font-medium text-accent underline-offset-4 group-hover:underline"
                            >
                              Case study
                            </Link>
                            {project.liveUrl ? (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                              >
                                Live link
                              </a>
                            ) : null}
                          </div>
                        </Card>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Container>
              </Section>
            );
          case "experience":
            return (
              <Section key={sectionKey}>
                <Container>
                  <FadeIn>
                    <SectionHeader
                      eyebrow="Experience"
                      title={experienceSection?.title ?? "A practical full-stack lane."}
                      subtitle={
                        experienceSection?.subtitle ??
                        "Professional engineering, technical leadership, and operational systems work across product surfaces and backoffice tools."
                      }
                    />
                  </FadeIn>
                  <Stagger className="mt-10 grid gap-4 md:grid-cols-3" delayChildren={0.08}>
                    {(experienceCards.length > 0
                      ? experienceCards
                      : fallbackExperienceCards
                    ).map((experience) => (
                      <StaggerItem key={experience.title}>
                        <Card className="p-5">
                          <h3 className="font-display text-xl font-semibold">
                            {experience.title}
                          </h3>
                          {experience.subtitle ? (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {experience.subtitle}
                            </p>
                          ) : null}
                          <p className="mt-3 leading-7 text-muted-foreground">
                            {experience.body}
                          </p>
                        </Card>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Container>
              </Section>
            );
          case "technical-strengths":
            return (
              <Section key={sectionKey}>
                <Container>
                  <FadeIn>
                    <SectionHeader
                      eyebrow="Technical strengths"
                      title={strengthsSection?.title ?? "Technical Strengths"}
                      subtitle={
                        strengthsSection?.subtitle ??
                        "The strengths I want hiring teams to evaluate first."
                      }
                    />
                  </FadeIn>
                  <Stagger
                    className="mt-10 grid gap-4 md:grid-cols-3"
                    delayChildren={0.08}
                  >
                    {(strengthCards.length > 0 ? strengthCards : fallbackStrengths).map(
                      (strength) => (
                        <StaggerItem key={strength.title}>
                          <Card className="flex h-full flex-col p-5">
                            <h3 className="font-display text-xl font-semibold">
                              {strength.title}
                            </h3>
                            <p className="mt-3 flex-1 leading-7 text-muted-foreground">
                              {strength.body}
                            </p>
                            {strength.href ? (
                              <Link
                                href={strength.href}
                                className="mt-5 text-sm font-medium text-accent underline-offset-4 hover:underline"
                              >
                                {strength.ctaLabel ?? "Review proof"}
                              </Link>
                            ) : null}
                          </Card>
                        </StaggerItem>
                      )
                    )}
                  </Stagger>
                </Container>
              </Section>
            );
          case "proof-links":
            return (
              <Section key={sectionKey} className="border-y border-border bg-muted/30">
                <Container>
                  <FadeIn>
                    <SectionHeader
                      eyebrow="Proof locker"
                      title={proofSection?.title ?? "Resume, GitHub, and Case Studies"}
                      subtitle={
                        proofSection?.subtitle ??
                        "The fastest links for reviewing my work, background, and implementation history."
                      }
                    />
                  </FadeIn>
                  {proofLinks.length > 0 ? (
                    <Stagger
                      className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                      delayChildren={0.08}
                    >
                      {proofLinks.map((item) => (
                        <StaggerItem key={`${item.title}-${item.href}`}>
                          <Card className="flex h-full flex-col p-5">
                            <h3 className="font-display text-xl font-semibold">
                              {item.title}
                            </h3>
                            {item.body ? (
                              <p className="mt-3 flex-1 leading-7 text-muted-foreground">
                                {item.body}
                              </p>
                            ) : null}
                            <Link
                              href={item.href}
                              target={item.href.startsWith("/") ? undefined : "_blank"}
                              rel={item.href.startsWith("/") ? undefined : "noreferrer"}
                              className="mt-5 text-sm font-medium text-accent underline-offset-4 hover:underline"
                            >
                              {item.cta ?? "Open"}
                            </Link>
                          </Card>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  ) : null}
                </Container>
              </Section>
            );
          case "common-questions":
            return (
              <Section key={sectionKey}>
                <Container>
                  <FadeIn>
                    <SectionHeader
                      eyebrow="Common questions"
                      title={questionsSection?.title ?? "Common Questions"}
                      subtitle={questionsSection?.subtitle ?? undefined}
                    />
                  </FadeIn>
                  <Stagger
                    className="mt-10 grid gap-4 md:grid-cols-3"
                    delayChildren={0.08}
                  >
                    {(questions.length > 0 ? questions : fallbackQuestions).map(
                      (question) => (
                        <StaggerItem key={question.title}>
                          <Card className="h-full p-5">
                            <h3 className="font-display text-lg font-semibold">
                              {question.title}
                            </h3>
                            <p className="mt-3 leading-7 text-muted-foreground">
                              {question.body}
                            </p>
                          </Card>
                        </StaggerItem>
                      )
                    )}
                  </Stagger>
                </Container>
              </Section>
            );
          case "contact":
            return (
              <Section key={sectionKey} id="contact-section" className="border-t border-border">
                <Container>
                  <Card className="p-6 sm:p-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div>
                        <p className="font-mono text-xs font-semibold uppercase text-accent">
                          Contact
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-semibold">
                          {contactSection?.title ?? "Contact"}
                        </h2>
                        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                          {contactSection?.subtitle ??
                            "Send the role, system, or technical context and I will respond directly."}
                        </p>
                        {contactSection?.body ? (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                            {contactSection.body}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/contact"
                          className="inline-flex h-11 items-center rounded-md bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                        >
                          Contact
                        </Link>
                        <Link
                          href="/resume"
                          className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          Resume
                        </Link>
                      </div>
                    </div>
                  </Card>
                </Container>
              </Section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
