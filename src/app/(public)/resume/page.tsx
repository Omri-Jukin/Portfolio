import type { Metadata } from "next";
import {
  Badge,
  Card,
  Chip,
  Container,
  CursorPressLink,
  Section,
  SectionHeader,
} from "@/components/ui";
import { PROFILE_LINKS } from "$/constants";
import { getResumeDataFromCms } from "$/data/resumeCmsData";
import { ResumePdfDownloadButton } from "./ResumePdfDownloadButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume - Omri Jukin",
  description:
    "Resume for Omri Jukin, full-stack TypeScript engineer with React, Next.js, Node.js, PostgreSQL, Supabase, tRPC, Drizzle, and production systems experience.",
  alternates: {
    canonical: "/resume",
  },
};

export default async function ResumePage() {
  const resume = await getResumeDataFromCms();

  return (
    <>
      <Section className="pt-14 sm:pt-20">
        <Container>
          <SectionHeader
            eyebrow="Resume"
            title={resume.person.name}
            subtitle={resume.headline ?? resume.person.title}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <CursorPressLink
              href={`mailto:${PROFILE_LINKS.EMAIL}`}
              variant="outline"
              size="sm"
            >
              {PROFILE_LINKS.EMAIL}
            </CursorPressLink>
            <CursorPressLink
              href={PROFILE_LINKS.GITHUB}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              size="sm"
            >
              GitHub
            </CursorPressLink>
            <CursorPressLink
              href={PROFILE_LINKS.LINKEDIN}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              size="sm"
            >
              LinkedIn
            </CursorPressLink>
          </div>
          <div className="mt-8">
            <ResumePdfDownloadButton resume={resume} />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <Card className="p-5">
                <h2 className="font-display text-2xl font-semibold">
                  Summary
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {resume.summary}
                </p>
              </Card>

              <Card className="p-5">
                <h2 className="font-display text-2xl font-semibold">
                  Experience
                </h2>
                <div className="mt-5 space-y-6">
                  {resume.experience.map((item) => (
                    <article key={`${item.company}-${item.role}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl font-semibold">
                          {item.role}
                        </h3>
                        <Badge>{item.period}</Badge>
                      </div>
                      <p className="mt-1 font-medium text-accent">
                        {item.company}
                        {item.location ? ` / ${item.location}` : ""}
                      </p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                        {item.bullets.slice(0, 4).map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </Card>

              {resume.projects && resume.projects.length > 0 ? (
                <Card className="p-5">
                  <h2 className="font-display text-2xl font-semibold">
                    Selected Projects
                  </h2>
                  <div className="mt-5 space-y-5">
                    {resume.projects.slice(0, 4).map((project) => (
                      <article
                        key={project.name}
                        id={project.id}
                        className="scroll-mt-24"
                      >
                        <h3 className="font-display text-xl font-semibold">
                          {project.name}
                        </h3>
                        <p className="mt-2 leading-7 text-muted-foreground">
                          {project.line}
                        </p>
                        {project.bullets && project.bullets.length > 0 ? (
                          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                            {project.bullets.slice(0, 3).map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        ) : null}
                        {project.url ? (
                          <CursorPressLink
                            href={project.url}
                            target={project.url.startsWith("/") ? undefined : "_blank"}
                            rel={project.url.startsWith("/") ? undefined : "noreferrer"}
                            variant="outline"
                            size="sm"
                            className="mt-3"
                          >
                            {project.url.startsWith("/") ? "Case study" : "Project link"}
                          </CursorPressLink>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>

            <aside className="space-y-4">
              <Card className="p-5">
                <h2 className="font-display text-xl font-semibold">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(resume.coreSkills ?? []).flatMap((group) =>
                    group.items.slice(0, 8).map((skill) => (
                      <Chip key={`${group.category}-${skill}`}>{skill}</Chip>
                    ))
                  )}
                </div>
              </Card>
              {resume.certifications && resume.certifications.length > 0 ? (
                <Card className="p-5">
                  <h2 className="font-display text-xl font-semibold">
                    Certifications
                  </h2>
                  <div className="mt-4 space-y-4">
                    {resume.certifications.slice(0, 5).map((certification) => (
                      <div key={`${certification.name}-${certification.issuer}`}>
                        <p className="font-medium">{certification.name}</p>
                        <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
                          {certification.issuer}
                          {certification.period
                            ? ` / ${certification.period}`
                            : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}
              <Card className="p-5">
                <h2 className="font-display text-xl font-semibold">Proof</h2>
                <div className="mt-4 grid gap-3">
                  <CursorPressLink
                    href="/#work"
                    variant="outline"
                    size="sm"
                  >
                    Selected work
                  </CursorPressLink>
                  <CursorPressLink
                    href="/contact"
                    variant="outline"
                    size="sm"
                  >
                    Contact
                  </CursorPressLink>
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
