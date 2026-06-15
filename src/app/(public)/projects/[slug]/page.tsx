import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Badge,
  Card,
  Chip,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui";
import { ProjectManager } from "$/db/projects/ProjectManager";

export const dynamic = "force-dynamic";

type ProjectCaseStudyParams = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectCaseStudyParams): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await ProjectManager.getBySlug(slug);

    if (!project) {
      return {
        title: "Case study not found - Omri Jukin",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const canonicalSlug = project.caseStudySlug ?? project.id;
    const description =
      project.hiringSignal || project.subtitle || project.description;
    const ogImage = `/projects/${canonicalSlug}/opengraph-image`;

    return {
      title: `${project.title} - Case Study - Omri Jukin`,
      description,
      alternates: {
        canonical: `/projects/${canonicalSlug}`,
      },
      openGraph: {
        title: `${project.title} - Case Study - Omri Jukin`,
        description,
        type: "article",
        url: `/projects/${canonicalSlug}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${project.title} case study`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title} - Case Study - Omri Jukin`,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Project case study - Omri Jukin",
      description:
        "Project case study from Omri Jukin's full-stack TypeScript engineering portfolio.",
    };
  }
}

export default async function ProjectCaseStudyPage({
  params,
}: ProjectCaseStudyParams) {
  const { slug } = await params;

  let project = null;
  try {
    project = await ProjectManager.getBySlug(slug);
  } catch {
    project = null;
  }

  if (!project) {
    notFound();
  }

  const canonicalSlug = project.caseStudySlug ?? project.id;
  const contactParams = new URLSearchParams({
    project: canonicalSlug,
    projectTitle: project.title,
    context: project.hiringSignal || project.subtitle || project.description,
  });
  const sections = [
    { id: "problem", label: "Problem" },
    ...(project.constraints.length > 0
      ? [{ id: "constraints", label: "Constraints" }]
      : []),
    { id: "built", label: "What I built" },
    { id: "architecture", label: "Architecture" },
    { id: "decisions", label: "Decisions" },
    ...(project.outcome ? [{ id: "outcome", label: "Outcome" }] : []),
    ...(project.privateRepoNote
      ? [{ id: "repository", label: "Repository" }]
      : []),
  ];

  return (
    <>
      <Section className="pt-14 sm:pt-20">
        <Container>
          <SectionHeader
            eyebrow="Case study"
            title={project.title}
            subtitle={project.hiringSignal || project.subtitle || project.description}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="accent">{project.status}</Badge>
            {project.caseStudyRole || project.myRole ? (
              <Badge>{project.caseStudyRole || project.myRole}</Badge>
            ) : null}
            {project.outcome ? <Badge tone="success">Outcome</Badge> : null}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4">
              <Card id="problem" className="scroll-mt-24 p-5">
                <h2 className="font-display text-2xl font-semibold">
                  Problem
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {project.problem?.description ||
                    project.longDescription ||
                    project.description}
                </p>
              </Card>
              {project.constraints.length > 0 ? (
                <Card id="constraints" className="scroll-mt-24 p-5">
                  <h2 className="font-display text-2xl font-semibold">
                    Constraints
                  </h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                    {project.constraints.map((constraint) => (
                      <li key={constraint}>{constraint}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              <Card id="built" className="scroll-mt-24 p-5">
                <h2 className="font-display text-2xl font-semibold">
                  What I built
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {project.solution?.approach ||
                    project.architecture?.overview ||
                    project.description}
                </p>
              </Card>
              <Card id="architecture" className="scroll-mt-24 p-5">
                <h2 className="font-display text-2xl font-semibold">
                  Architecture
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {project.architecture?.overview ||
                    "A focused full-stack system with explicit boundaries between public UI, data access, server-side orchestration, and operational workflows."}
                </p>
                <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  {[
                    "Public UI",
                    "Typed API boundary",
                    "Database-backed content",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="relative rounded-md border border-border bg-muted/40 p-3"
                    >
                      <span className="font-mono text-xs text-accent">
                        0{index + 1}
                      </span>
                      <p className="mt-2 font-medium text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card id="decisions" className="scroll-mt-24 p-5">
                <h2 className="font-display text-2xl font-semibold">
                  Decisions and trade-offs
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                  {(project.decisions.length > 0
                    ? project.decisions
                    : project.solution?.keyDecisions ?? project.keyFeatures)
                    .slice(0, 6)
                    .map((item) => (
                      <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
              {project.outcome ? (
                <Card id="outcome" className="scroll-mt-24 p-5">
                  <h2 className="font-display text-2xl font-semibold">
                    Outcome
                  </h2>
                  <p className="mt-3 rounded-md border border-success/30 bg-success/10 p-3 text-sm font-medium text-foreground">
                    {project.outcome}
                  </p>
                </Card>
              ) : null}
              {project.privateRepoNote ? (
                <Card id="repository" className="scroll-mt-24 p-5">
                  <h2 className="font-display text-2xl font-semibold">
                    Repository context
                  </h2>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {project.privateRepoNote}
                  </p>
                </Card>
              ) : null}
            </div>

            <aside className="space-y-4">
              <Card className="sticky top-24 p-5">
                <h2 className="font-display text-xl font-semibold">
                  Contents
                </h2>
                <nav className="mt-4 grid gap-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </Card>
              <Card className="p-5">
                <h2 className="font-display text-xl font-semibold">Stack</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <Chip key={technology}>{technology}</Chip>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h2 className="font-display text-xl font-semibold">Links</h2>
                <div className="mt-4 grid gap-3">
                  {project.proofLinks.map((link) => (
                    <a
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      target={link.href.startsWith("/") ? undefined : "_blank"}
                      rel={
                        link.href.startsWith("/") ? undefined : "noreferrer"
                      }
                      className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Live site
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      GitHub
                    </a>
                  ) : null}
                  <Link
                    href={`/contact?${contactParams.toString()}`}
                    className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    Discuss this work
                  </Link>
                </div>
              </Card>
            </aside>
          </article>
        </Container>
      </Section>
    </>
  );
}
