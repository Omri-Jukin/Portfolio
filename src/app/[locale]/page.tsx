import Link from "next/link";
import { PROFILE_LINKS } from "$/constants";
import {
  PublicContentBlockManager,
  type PublicContentBlock,
} from "$/db/publicContent/PublicContentBlockManager";

type Props = {
  params: Promise<{ locale: string }>;
};

type ProjectProof = {
  id: string;
  title: string;
  status: string;
  hiringSignal: string;
  problem: string;
  built: string;
  stack: string[];
  architecture: string;
  role: string;
  proof: string;
  privateRepoNote?: string;
  liveUrl?: string;
  caseStudyUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

type HomePageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  sectionCopy: Record<
    string,
    { title: string; subtitle?: string; body?: string }
  >;
  metrics: Array<[string, string]>;
  experienceItems: Array<[string, string, string]>;
  technicalStrengths: Array<[string, string, string, string]>;
  proofItems: Array<[string, string, string, string]>;
  qaItems: Array<[string, string]>;
};

const projects: ProjectProof[] = [
  {
    id: "portfolio-platform",
    title: "Portfolio Platform",
    status: "Live system",
    hiringSignal:
      "Shows ability to build and operate a production portfolio platform: public i18n site, authenticated CMS/backoffice, content workflows, and deployment.",
    problem:
      "A portfolio needs a public proof surface plus private tools for content, career data, and technical case studies.",
    built:
      "This public i18n site with authenticated CMS/backoffice, content APIs, and deployment path.",
    stack: ["Next.js", "TypeScript", "tRPC", "Drizzle", "Supabase", "NextAuth"],
    architecture:
      "Public i18n site plus RBAC-protected admin CMS, Postgres-backed content APIs, and modular homepage composition.",
    role: "Sole builder: architecture, implementation, content workflows, and deployment.",
    proof: "This website and its supporting private CMS/backoffice.",
    privateRepoNote:
      "Private repository - system architecture and implementation decisions are documented.",
    liveUrl: "https://omrijukin.com",
    caseStudyUrl: "/resume#portfolio-platform",
    primaryCtaLabel: "View system notes",
    primaryCtaHref: "/resume#portfolio-platform",
    secondaryCtaLabel: "Open site",
    secondaryCtaHref: "https://omrijukin.com",
  },
  {
    id: "socially",
    title: "Socially",
    status: "Private build / release-readiness case study",
    hiringSignal:
      "Shows product/platform planning for creator operations: cross-platform workflows, Supabase-backed data models, Cloudflare deployment boundaries, and release readiness.",
    problem:
      "Creator operations need publishing, analytics, and workflow coordination without fragmented tooling.",
    built:
      "A creator operations platform direction with mobile frontend, backend boundaries, auth, and integration-ready data models.",
    stack: ["React Native", "TypeScript", "Supabase", "Cloudflare"],
    architecture:
      "Product architecture and release-readiness plan for a creator operations platform; public demo is not available yet.",
    role: "End-to-end technical direction across product architecture, implementation, and release readiness.",
    proof:
      "Architecture and release-readiness case study. Public demo is not available yet.",
    privateRepoNote:
      "Private repository - release-readiness case study available.",
    caseStudyUrl: "/resume#socially",
    primaryCtaLabel: "View case study",
    primaryCtaHref: "/resume#socially",
    secondaryCtaLabel: "Discuss implementation",
    secondaryCtaHref: "/contact?project=socially",
  },
  {
    id: "clipwhisperer",
    title: "ClipWhisperer",
    status: "Architecture walkthrough available",
    hiringSignal:
      "Shows backend/platform thinking: queue-driven orchestration, media-processing boundaries, service separation, and cloud-integrated processing.",
    problem:
      "Manual video generation pipelines are slow, fragile, and hard to scale across processing, storage, and delivery.",
    built:
      "A production-oriented video automation platform with queue-driven orchestration and media-processing boundaries.",
    stack: ["Node.js", "TypeScript", "Supabase", "AWS", "FFmpeg"],
    architecture:
      "Hub-based orchestration with queue-driven jobs, service separation, and cloud-integrated processing steps.",
    role: "Platform design and hands-on implementation across orchestration, media processing, and service boundaries.",
    proof:
      "Production-oriented microservices structure with clear ownership boundaries. Public demo is not available.",
    privateRepoNote: "Private repository - architecture walkthrough available.",
    caseStudyUrl: "/resume#clipwhisperer",
    primaryCtaLabel: "View architecture notes",
    primaryCtaHref: "/resume#clipwhisperer",
    secondaryCtaLabel: "Discuss implementation",
    secondaryCtaHref: "/contact?project=clipwhisperer",
  },
  {
    id: "snow-hq",
    title: "Snow HQ",
    status: "Private build / architecture walkthrough",
    hiringSignal:
      "Shows full-stack product execution: tenant-aware CRM workflows, RBAC-aware data modeling, type-safe APIs, and dashboard UI.",
    problem:
      "CRM workflows need tenant separation, permissions, dashboards, and maintainable full-stack delivery.",
    built:
      "A multi-tenant CRM with RBAC-aware data modeling, typed APIs, and dashboard flows.",
    stack: ["Next.js", "tRPC", "PostgreSQL", "Drizzle ORM"],
    architecture:
      "Type-safe APIs, tenant-aware data modeling, RBAC, and dashboard-oriented workflows.",
    role: "Full-stack implementation across frontend, backend, and database layers.",
    proof:
      "Private build with architecture and implementation notes available. Public demo is not available.",
    privateRepoNote: "Private repository - architecture walkthrough available.",
    caseStudyUrl: "/resume#snow-hq",
    primaryCtaLabel: "View case study",
    primaryCtaHref: "/resume#snow-hq",
    secondaryCtaLabel: "Discuss implementation",
    secondaryCtaHref: "/contact?project=snow-hq",
  },
];

const proofItems = [
  [
    "Resume",
    "Full experience, skills, education, and project history in one place.",
    "/resume",
    "Open resume",
  ],
  [
    "Snow HQ case study",
    "Multi-tenant CRM with tRPC, PostgreSQL, Drizzle, RBAC-aware modeling, and dashboard flows.",
    "/resume#snow-hq",
    "View case study",
  ],
  [
    "ClipWhisperer architecture",
    "Queue-driven video automation platform with service boundaries and cloud processing.",
    "/resume#clipwhisperer",
    "View architecture notes",
  ],
  [
    "Portfolio platform",
    "Public i18n site plus authenticated CMS/backoffice, content APIs, and modular homepage composition.",
    "/resume#portfolio-platform",
    "View system notes",
  ],
  [
    "GitHub",
    "Code, experiments, project repositories, and implementation history.",
    PROFILE_LINKS.GITHUB,
    "Open GitHub",
  ],
  [
    "LinkedIn",
    "Professional profile and fastest recruiter-friendly contact path.",
    PROFILE_LINKS.LINKEDIN,
    "Open LinkedIn",
  ],
] as const;

const experienceItems = [
  [
    "Abra Technologies",
    "Full Stack Engineer, 2024-2025",
    "Worked on the early development of an internal government data platform, reusable UI systems, Storybook-backed component workflows, component testing, and frontend architecture foundations.",
  ],
  [
    "The Atheist Line",
    "Technical Lead, 2025-Present",
    "Volunteer technical leadership role for a 17-person organization. I serve as the primary technical owner for public-facing and internal systems, content workflows, tooling, integrations, CI/CD, analytics foundations, and production readiness.",
  ],
  [
    "Menora Mivtachim",
    "Business Rules Configuration Specialist, 2023-2024",
    "Configured insurance product logic and internal business rules with a focus on correctness, consistency, and operational reliability.",
  ],
] as const;

const technicalStrengths = [
  [
    "Full-stack TypeScript delivery",
    "Next.js, React, Node.js, tRPC/REST APIs, PostgreSQL, Drizzle, Supabase, auth, and deployment workflows.",
    "/resume#portfolio-platform",
    "Review full-stack proof",
  ],
  [
    "Frontend systems that stay maintainable",
    "Reusable UI components, responsive product screens, Storybook-backed workflows, component testing, and clean feature composition.",
    "/resume#portfolio-platform",
    "Review frontend proof",
  ],
  [
    "Backend, data, and integrations",
    "API boundaries, relational data modeling, permissions, queue-driven workflows, media processing, and service ownership.",
    "/resume#clipwhisperer",
    "Review backend proof",
  ],
  [
    "Internal tools and operational workflows",
    "CMS/backoffice systems, dashboards, admin panels, automation opportunities, and tools that reduce fragmented manual work.",
    "/resume#snow-hq",
    "Review systems proof",
  ],
] as const;

const qaItems = [
  [
    "Can you own work end to end?",
    "Yes. My strongest lane is full-stack ownership across frontend, backend, data modeling, integrations, deployment, and operational workflows.",
  ],
  [
    "Are you senior?",
    "Not by title. I have 3+ years of hands-on professional engineering experience across 2024-2026 and counting, and I back that with strong ownership, modern stack fluency, clear communication, and production-minded delivery.",
  ],
  [
    "Where do you fit best?",
    "Teams building TypeScript-heavy products, dashboards, internal tools, integrations, CMS/backoffice workflows, or product-platform systems that need someone comfortable across the stack.",
  ],
  [
    "What should I review first?",
    "Start with Snow HQ for full-stack product execution, ClipWhisperer for backend/platform architecture, the Portfolio Platform for CMS/backoffice ownership, and the resume for work history.",
  ],
  [
    "What makes you different from another TypeScript developer?",
    "I am not only focused on screens or isolated tickets. I care about the system: product flow, data model, API boundaries, operational workflow, maintainability, and how the thing gets shipped.",
  ],
  [
    "How should a recruiter contact you?",
    "LinkedIn or email are best. Send the role, stack, team context, and what kind of ownership the position requires.",
  ],
] as const;

const fallbackHomeContent: HomePageContent = {
  hero: {
    eyebrow: "Full-stack TypeScript Engineer | Product-minded systems builder",
    title:
      "I build production-ready TypeScript systems for teams that need one engineer who can own the full stack.",
    subtitle:
      "Frontend, backend, database, auth, integrations, internal tools, and deployment - built with clean architecture, strong ownership, and enough pragmatism to actually ship.",
  },
  sectionCopy: {
    "what-i-can-own": {
      title: "What I Can Own",
      subtitle:
        "The roles that fit me best need a hands-on engineer who can move across product, frontend, backend, data, integrations, and release work without losing the system view.",
    },
    "what-i-can-own-card": {
      title: "Full-stack product and platform work",
      body: "I am strongest where a team needs someone who can understand the product flow, design the data and API boundaries, build the UI, integrate services, and keep the delivery path practical.",
    },
    "best-fit-card": {
      title: "Best fit",
      body: "TypeScript-heavy products, dashboards, internal tools, integrations, CMS/backoffice workflows, and product-platform systems.",
    },
    "selected-work": {
      title: "Selected Work",
      subtitle:
        "A focused set of systems that show how I think about product flow, architecture, implementation, and production readiness.",
    },
    experience: {
      title: "Experience",
      subtitle:
        "Professional work and technical leadership context, written plainly so the role shape is easy to evaluate.",
    },
    "technical-strengths": {
      title: "Technical Strengths",
      subtitle: "The strengths I want hiring teams to evaluate first.",
    },
    "proof-links": {
      title: "Resume, GitHub, and Case Studies",
      subtitle:
        "The fastest links for reviewing my work, background, and implementation history.",
    },
    "common-questions": {
      title: "Common Questions",
    },
    contact: {
      title: "Contact",
      subtitle:
        "I am best suited for teams building product-facing systems, internal tools, dashboards, integrations, CMS/backoffice workflows, and TypeScript-heavy web platforms.",
      body: "For selected technical/project conversations, send a short brief with scope, timeline, and current technical constraints.",
    },
  },
  metrics: [
    [
      "3+ years professional engineering",
      "Full-stack engineering experience at Abra Technologies, plus technical leadership and zero-to-one platform ownership at The Atheist Line.",
    ],
    [
      "Full-stack ownership",
      "Next.js, React, Node.js, PostgreSQL, tRPC, Drizzle, Supabase, Cloudflare, auth, integrations, internal tooling, and deployment workflows.",
    ],
    [
      "Shipped systems, not toy demos",
      "CRM workflows, CMS/backoffice tooling, creator operations, microservices automation, portfolio infrastructure, and reusable UI/component systems.",
    ],
    [
      "Best fit",
      "Teams that need a hands-on engineer who can move across product, frontend, backend, data, and operational workflows without creating architecture debt.",
    ],
  ],
  experienceItems: experienceItems.map(
    ([company, role, body]) =>
      [company, role, body] as [string, string, string],
  ),
  technicalStrengths: technicalStrengths.map(
    ([title, body, href, cta]) =>
      [title, body, href, cta] as [string, string, string, string],
  ),
  proofItems: proofItems.map(
    ([title, body, href, cta]) =>
      [title, body, href, cta] as [string, string, string, string],
  ),
  qaItems: qaItems.map(
    ([question, answer]) => [question, answer] as [string, string],
  ),
};

function textOrFallback(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

function getSectionBlock(
  blocks: PublicContentBlock[],
  sectionKey: string,
  blockKey = "section",
) {
  return blocks.find(
    (block) => block.sectionKey === sectionKey && block.blockKey === blockKey,
  );
}

function readListItems(
  items: unknown[],
): Array<[string, string, string, string]> {
  return items
    .filter((item): item is Record<string, unknown> => {
      return !!item && typeof item === "object";
    })
    .map(
      (item) =>
        [
          String(item.title ?? ""),
          String(item.body ?? ""),
          String(item.href ?? ""),
          String(item.cta ?? item.ctaLabel ?? ""),
        ] as [string, string, string, string],
    )
    .filter(([title, body, href, cta]) => title && body && href && cta);
}

async function getHomePageContent(locale: string): Promise<HomePageContent> {
  try {
    const blocks = await PublicContentBlockManager.getByPage({
      page: "home",
      locale,
      visibleOnly: true,
    });

    if (blocks.length === 0 && locale !== "en") {
      return getHomePageContent("en");
    }

    if (blocks.length === 0) {
      return fallbackHomeContent;
    }

    const heroBlock = getSectionBlock(blocks, "hero", "main");
    const heroMetadata =
      heroBlock?.metadata && typeof heroBlock.metadata === "object"
        ? heroBlock.metadata
        : {};

    const sectionCopy = { ...fallbackHomeContent.sectionCopy };
    for (const sectionKey of Object.keys(sectionCopy)) {
      const block = getSectionBlock(blocks, sectionKey);
      if (!block) continue;

      sectionCopy[sectionKey] = {
        title: textOrFallback(block.title, sectionCopy[sectionKey].title),
        subtitle: textOrFallback(
          block.subtitle,
          sectionCopy[sectionKey].subtitle ?? "",
        ),
        body: textOrFallback(block.body, sectionCopy[sectionKey].body ?? ""),
      };
    }

    const platformWorkBlock = getSectionBlock(
      blocks,
      "what-i-can-own",
      "platform-work",
    );
    if (platformWorkBlock) {
      sectionCopy["what-i-can-own-card"] = {
        title: textOrFallback(
          platformWorkBlock.title,
          sectionCopy["what-i-can-own-card"].title,
        ),
        body: textOrFallback(
          platformWorkBlock.body,
          sectionCopy["what-i-can-own-card"].body ?? "",
        ),
      };
    }

    const bestFitBlock = getSectionBlock(
      blocks,
      "what-i-can-own",
      "best-fit-card",
    );
    if (bestFitBlock) {
      sectionCopy["best-fit-card"] = {
        title: textOrFallback(
          bestFitBlock.title,
          sectionCopy["best-fit-card"].title,
        ),
        body: textOrFallback(
          bestFitBlock.body,
          sectionCopy["best-fit-card"].body ?? "",
        ),
      };
    }

    const metrics = blocks
      .filter(
        (block) =>
          block.sectionKey === "what-i-can-own" && block.blockType === "metric",
      )
      .map(
        (block) =>
          [textOrFallback(block.title, ""), textOrFallback(block.body, "")] as [
            string,
            string,
          ],
      )
      .filter(([title, body]) => title && body);

    const dbExperienceItems = blocks
      .filter(
        (block) =>
          block.sectionKey === "experience" && block.blockType === "card",
      )
      .map(
        (block) =>
          [
            textOrFallback(block.title, ""),
            textOrFallback(block.subtitle, ""),
            textOrFallback(block.body, ""),
          ] as [string, string, string],
      )
      .filter(([title, subtitle, body]) => title && subtitle && body);

    const dbTechnicalStrengths = blocks
      .filter(
        (block) =>
          block.sectionKey === "technical-strengths" &&
          block.blockType === "card",
      )
      .map(
        (block) =>
          [
            textOrFallback(block.title, ""),
            textOrFallback(block.body, ""),
            textOrFallback(block.href, ""),
            textOrFallback(block.ctaLabel, ""),
          ] as [string, string, string, string],
      )
      .filter(([title, body, href, cta]) => title && body && href && cta);

    const proofList = getSectionBlock(blocks, "proof-links", "links");
    const dbProofItems = proofList ? readListItems(proofList.items) : [];

    const dbQaItems = blocks
      .filter(
        (block) =>
          block.sectionKey === "common-questions" &&
          block.blockType === "question",
      )
      .map(
        (block) =>
          [textOrFallback(block.title, ""), textOrFallback(block.body, "")] as [
            string,
            string,
          ],
      )
      .filter(([title, body]) => title && body);

    return {
      hero: {
        eyebrow: textOrFallback(
          typeof heroMetadata.eyebrow === "string"
            ? heroMetadata.eyebrow
            : undefined,
          fallbackHomeContent.hero.eyebrow,
        ),
        title: textOrFallback(heroBlock?.title, fallbackHomeContent.hero.title),
        subtitle: textOrFallback(
          heroBlock?.subtitle,
          fallbackHomeContent.hero.subtitle,
        ),
      },
      sectionCopy,
      metrics: metrics.length > 0 ? metrics : fallbackHomeContent.metrics,
      experienceItems:
        dbExperienceItems.length > 0
          ? dbExperienceItems
          : fallbackHomeContent.experienceItems,
      technicalStrengths:
        dbTechnicalStrengths.length > 0
          ? dbTechnicalStrengths
          : fallbackHomeContent.technicalStrengths,
      proofItems:
        dbProofItems.length > 0 ? dbProofItems : fallbackHomeContent.proofItems,
      qaItems: dbQaItems.length > 0 ? dbQaItems : fallbackHomeContent.qaItems,
    };
  } catch (error) {
    console.warn(
      "[home] Falling back to static homepage content:",
      error instanceof Error ? error.message : String(error),
    );
    return fallbackHomeContent;
  }
}

function cleanHref(href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return href;
  }

  return href;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const content = await getHomePageContent(locale);
  const sectionCopy = content.sectionCopy;

  return (
    <main style={pageStyle}>
      <section id="hero-section" aria-labelledby="hero-title" style={heroStyle}>
        <p style={eyebrowStyle}>{content.hero.eyebrow}</p>
        <h1 id="hero-title" style={heroTitleStyle}>
          {content.hero.title}
        </h1>
        <p style={heroSubtitleStyle}>{content.hero.subtitle}</p>
        <div style={buttonRowStyle}>
          <a href="#selected-work" style={primaryButtonStyle}>
            Review selected work
          </a>
          <Link href={cleanHref("/resume")} style={secondaryButtonStyle}>
            Download resume
          </Link>
          <a href="#contact-section" style={textButtonStyle}>
            Contact
          </a>
        </div>
        <div style={buttonRowStyle}>
          <a
            href={PROFILE_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Omri Jukin on GitHub"
            style={textButtonStyle}
          >
            GitHub
          </a>
          <a
            href={PROFILE_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Omri Jukin on LinkedIn"
            style={textButtonStyle}
          >
            LinkedIn
          </a>
        </div>
      </section>

      <Section
        id="what-i-can-own"
        title={sectionCopy["what-i-can-own"].title}
        subtitle={sectionCopy["what-i-can-own"].subtitle}
      >
        <div style={recruiterSplitStyle}>
          <article style={featuredCardStyle}>
            <h3 style={{ ...cardTitleStyle, fontSize: "1.45rem" }}>
              {sectionCopy["what-i-can-own-card"].title}
            </h3>
            <p style={mutedTextStyle}>
              {sectionCopy["what-i-can-own-card"].body}
            </p>
            <div style={{ ...buttonRowStyle, marginTop: 18 }}>
              <a href="#selected-work" style={primaryButtonStyle}>
                Review selected work
              </a>
              <Link href={cleanHref("/resume")} style={secondaryButtonStyle}>
                Download resume
              </Link>
            </div>
          </article>
          <ProofCard
            title={sectionCopy["best-fit-card"].title}
            body={sectionCopy["best-fit-card"].body ?? ""}
            href={cleanHref("/contact")}
            cta="Start a conversation"
          />
        </div>
        <div style={fourColumnStyle}>
          {content.metrics.map(([title, body]) => (
            <Metric key={title} title={title} body={body} />
          ))}
        </div>
        <div style={trustRowStyle} aria-label="Hiring trust signals">
          <span>
            Abra Technologies: reusable UI, Storybook, component testing.
          </span>
          <span>
            The Atheist Line: technical direction, tooling, production
            readiness.
          </span>
          <span>Snow HQ: RBAC-aware CRM and type-safe APIs.</span>
          <span>
            ClipWhisperer: queue-driven media automation architecture.
          </span>
        </div>
      </Section>

      <Section
        id="selected-work"
        title={sectionCopy["selected-work"].title}
        subtitle={sectionCopy["selected-work"].subtitle}
      >
        <div style={fourColumnStyle}>
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Section>

      <Section
        id="experience-section"
        title={sectionCopy.experience.title}
        subtitle={sectionCopy.experience.subtitle}
      >
        <div style={threeColumnStyle}>
          {content.experienceItems.map(([company, role, body]) => (
            <article key={company} style={cardStyle}>
              <h3 style={cardTitleStyle}>{company}</h3>
              <p style={fieldLabelStyle}>{role}</p>
              <p style={mutedTextStyle}>{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="technical-strengths"
        title={sectionCopy["technical-strengths"].title}
        subtitle={sectionCopy["technical-strengths"].subtitle}
      >
        <div style={threeColumnStyle}>
          {content.technicalStrengths.map(([title, body, href, cta]) => (
            <ProofCard
              key={title}
              title={title}
              body={body}
              href={cleanHref(href)}
              cta={cta}
            />
          ))}
        </div>
      </Section>

      <Section
        id="proof-locker"
        title={sectionCopy["proof-links"].title}
        subtitle={sectionCopy["proof-links"].subtitle}
      >
        <div style={stackStyle}>
          {content.proofItems.map(([title, body, href, cta]) => (
            <ProofCard
              key={title}
              title={title}
              body={body}
              href={cleanHref(href)}
              cta={cta}
            />
          ))}
        </div>
      </Section>

      <Section id="qa-section" title={sectionCopy["common-questions"].title}>
        <div style={stackStyle}>
          {content.qaItems.map(([question, answer]) => (
            <article key={question} style={cardStyle}>
              <h3 style={cardTitleStyle}>{question}</h3>
              <p style={mutedTextStyle}>{answer}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="contact-section" title={sectionCopy.contact.title}>
        <p style={sectionSubtitleStyle}>{sectionCopy.contact.subtitle}</p>
        <div style={{ ...buttonRowStyle, marginTop: 20 }}>
          <a href={`mailto:${PROFILE_LINKS.EMAIL}`} style={primaryButtonStyle}>
            Email Omri
          </a>
          <a
            href={PROFILE_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            style={secondaryButtonStyle}
          >
            Message on LinkedIn
          </a>
          <Link href={cleanHref("/resume")} style={secondaryButtonStyle}>
            Download resume
          </Link>
        </div>
        <p style={{ ...mutedTextStyle, maxWidth: 780 }}>
          {sectionCopy.contact.body}
        </p>
      </Section>
    </main>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={sectionTitleStyle}>{title}</h2>
        {subtitle ? <p style={sectionSubtitleStyle}>{subtitle}</p> : null}
        {children}
      </div>
    </section>
  );
}

function Metric({ title, body }: { title: string; body: string }) {
  return (
    <article style={cardStyle}>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={mutedTextStyle}>{body}</p>
    </article>
  );
}

function ProofCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  const external = href.startsWith("http");

  return (
    <article style={cardStyle}>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={mutedTextStyle}>{body}</p>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={inlineLinkStyle}
        >
          {cta}
        </a>
      ) : (
        <Link href={href} style={inlineLinkStyle}>
          {cta}
        </Link>
      )}
    </article>
  );
}

function ProjectCard({ project }: { project: ProjectProof }) {
  return (
    <article style={projectCardStyle}>
      <div style={projectHeaderStyle}>
        <h3 style={{ ...cardTitleStyle, fontSize: "1.35rem" }}>
          {project.title}
        </h3>
        <span style={badgeStyle}>{project.status}</span>
      </div>
      <ProjectField label="Problem" value={project.problem} />
      <ProjectField
        label="What it proves to a hiring team"
        value={project.hiringSignal}
      />
      <ProjectField label="What I built" value={project.built} />
      <ProjectField label="Architecture" value={project.architecture} />
      <ProjectField label="My role" value={project.role} />
      <ProjectField label="Proof" value={project.proof} />
      {project.privateRepoNote ? (
        <p style={trustNoteStyle}>{project.privateRepoNote}</p>
      ) : null}
      <div>
        <p style={fieldLabelStyle}>Stack</p>
        <div style={chipRowStyle}>
          {project.stack.map((item) => (
            <span key={item} style={chipStyle}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div style={buttonRowStyle}>
        <SmartLink
          href={cleanHref(project.primaryCtaHref)}
          style={textButtonStyle}
        >
          {project.primaryCtaLabel}
        </SmartLink>
        {project.secondaryCtaHref && project.secondaryCtaLabel ? (
          <SmartLink
            href={cleanHref(getProjectHref(project, project.secondaryCtaHref))}
            style={textButtonStyle}
          >
            {project.secondaryCtaLabel}
          </SmartLink>
        ) : null}
      </div>
    </article>
  );
}

function getProjectHref(project: ProjectProof, href: string) {
  if (!href.startsWith("/contact")) {
    return href;
  }

  const subject = `Project discussion: ${project.title}`;
  const message = [
    `Hi Omri,`,
    ``,
    `I'd like to discuss ${project.title}.`,
    ``,
    `Relevant proof: ${project.hiringSignal}`,
    ``,
    `What I'd like to understand:`,
    `- Architecture and implementation decisions`,
    `- Scope, constraints, and trade-offs`,
    `- How this maps to a relevant role or technical conversation`,
  ].join("\n");

  const params = new URLSearchParams({
    project: project.id,
    subject,
    message,
  });

  return `/contact?${params.toString()}`;
}

function SmartLink({
  href,
  style,
  children,
}: {
  href: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  ) : (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}

function ProjectField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={fieldLabelStyle}>{label}</p>
      <p style={mutedTextStyle}>{value}</p>
    </div>
  );
}

const pageStyle = { width: "100%" } as const;
const containerStyle = {
  width: "min(1100px, calc(100% - 32px))",
  margin: "0 auto",
} as const;
const heroStyle = {
  ...containerStyle,
  padding: "72px 0 56px",
  display: "grid",
  gap: 22,
} as const;
const sectionStyle = {
  padding: "52px 0",
  borderTop: "1px solid rgba(127, 127, 127, 0.24)",
} as const;
const eyebrowStyle = { margin: 0, color: "#0a7f79", fontWeight: 800 } as const;
const heroTitleStyle = {
  margin: 0,
  maxWidth: 980,
  fontSize: "clamp(2.25rem, 6vw, 4rem)",
  lineHeight: 1.05,
  fontWeight: 850,
} as const;
const heroSubtitleStyle = {
  margin: 0,
  maxWidth: 820,
  color: "#52616b",
  fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
  lineHeight: 1.6,
} as const;
const sectionTitleStyle = {
  margin: "0 0 10px",
  fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
  lineHeight: 1.15,
  fontWeight: 850,
} as const;
const sectionSubtitleStyle = {
  margin: "0 0 28px",
  maxWidth: 820,
  color: "#52616b",
  lineHeight: 1.7,
} as const;
// const twoColumnStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
//   gap: 18,
// } as const;
const threeColumnStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 18,
} as const;
const fourColumnStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 18,
} as const;
const recruiterSplitStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) minmax(min(100%, 260px), 0.85fr)",
  columnGap: "18px",
  rowGap: "28px",
} as const;
const stackStyle = { display: "grid", gap: 14 } as const;
const cardStyle = {
  padding: 24,
  border: "1px solid rgba(127, 127, 127, 0.26)",
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.72)",
} as const;
const featuredCardStyle = {
  ...cardStyle,
  borderColor: "rgba(10, 127, 121, 0.45)",
  background: "rgba(231, 251, 248, 0.82)",
} as const;
const projectCardStyle = { ...cardStyle, display: "grid", gap: 14 } as const;
const cardTitleStyle = {
  margin: 0,
  fontSize: "1.15rem",
  lineHeight: 1.3,
  fontWeight: 800,
} as const;
const mutedTextStyle = {
  margin: "8px 0 0",
  color: "#52616b",
  lineHeight: 1.65,
} as const;
const fieldLabelStyle = {
  margin: "0 0 4px",
  color: "#52616b",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  fontWeight: 850,
} as const;
const projectHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-start",
} as const;
const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 28,
  padding: "0 10px",
  borderRadius: 999,
  background: "#e7fbf8",
  color: "#075c57",
  fontSize: "0.78rem",
  fontWeight: 800,
} as const;
const chipRowStyle = { display: "flex", flexWrap: "wrap", gap: 8 } as const;
const chipStyle = {
  border: "1px solid rgba(127, 127, 127, 0.35)",
  borderRadius: 999,
  padding: "5px 10px",
  fontSize: "0.82rem",
} as const;
const buttonRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
} as const;
const buttonBaseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 8,
  fontWeight: 800,
  textDecoration: "none",
} as const;
const primaryButtonStyle = {
  ...buttonBaseStyle,
  background: "#4ECDC4",
  color: "#0a0a0a",
} as const;
const secondaryButtonStyle = {
  ...buttonBaseStyle,
  border: "1px solid rgba(127, 127, 127, 0.35)",
  color: "inherit",
} as const;
const textButtonStyle = {
  ...buttonBaseStyle,
  color: "#096c67",
  padding: "0 8px",
} as const;
const inlineLinkStyle = {
  display: "inline-flex",
  marginTop: 16,
  color: "#096c67",
  fontWeight: 800,
  textDecoration: "none",
} as const;
const trustNoteStyle = {
  margin: 0,
  color: "#075c57",
  fontWeight: 750,
  fontSize: "0.92rem",
} as const;
const trustRowStyle = {
  display: "grid",
  gap: 10,
  marginTop: 18,
  color: "#52616b",
  fontSize: "0.95rem",
} as const;
