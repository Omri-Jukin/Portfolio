"use client";

import Link from "next/link";
import * as React from "react";
import { format } from "date-fns";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  EmptyState,
  LoadingState,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type ResumePdfOverview = RouterOutputs["resumePdf"]["getOverview"];
type ResumePdfItemType =
  | "profileBlock"
  | "workExperience"
  | "project"
  | "skill"
  | "education"
  | "certification";

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

function formatMonth(value: Date | string) {
  return format(new Date(value), "MMM yyyy");
}

function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice) return null;

  return (
    <div
      role="status"
      className={
        notice.tone === "success"
          ? "mb-5 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
          : "mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      }
    >
      {notice.message}
    </div>
  );
}

function SectionCard({
  title,
  description,
  editHref,
  children,
}: {
  title: string;
  description: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-border p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <Link
          href={editHref}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium shadow-[var(--shadow-subtle)] transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          Edit source
        </Link>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function InclusionFooter({
  included,
  onToggle,
  disabled,
}: {
  included: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <CardFooter className="justify-between">
      {included ? (
        <Badge tone="success">Included in PDF</Badge>
      ) : (
        <Badge tone="warning">Excluded from PDF</Badge>
      )}
      <Button variant="outline" onClick={onToggle} disabled={disabled}>
        {included ? "Remove from PDF" : "Add to PDF"}
      </Button>
    </CardFooter>
  );
}

function ProfileBlocks({
  blocks,
  toggle,
  disabled,
}: {
  blocks: ResumePdfOverview["profileBlocks"];
  toggle: (type: ResumePdfItemType, id: string) => void;
  disabled: boolean;
}) {
  if (blocks.length === 0) {
    return <EmptyState>No resume profile blocks found.</EmptyState>;
  }

  return (
    <>
      {blocks.map((block) => (
        <Card key={block.id} className={block.isVisible ? "" : "opacity-70"}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{block.blockKey}</Badge>
              {!block.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
            </div>
            <CardTitle className="pt-2">{block.title || block.blockKey}</CardTitle>
          </CardHeader>
          <CardContent>
            {block.subtitle ? (
              <p className="text-sm font-medium text-accent">{block.subtitle}</p>
            ) : null}
            {block.body ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {block.body}
              </p>
            ) : null}
          </CardContent>
          <InclusionFooter
            included={block.isFeatured}
            disabled={disabled}
            onToggle={() => toggle("profileBlock", block.id)}
          />
        </Card>
      ))}
    </>
  );
}

function ExperienceCards({
  items,
  toggle,
  disabled,
}: {
  items: ResumePdfOverview["workExperiences"];
  toggle: (type: ResumePdfItemType, id: string) => void;
  disabled: boolean;
}) {
  if (items.length === 0) {
    return <EmptyState>No work experience records found.</EmptyState>;
  }

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className={item.isVisible ? "" : "opacity-70"}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.employmentType}</Badge>
              {!item.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
            </div>
            <CardTitle className="pt-2">{item.role}</CardTitle>
            <p className="text-sm font-medium text-accent">{item.company}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatMonth(item.startDate)} -{" "}
              {item.endDate ? formatMonth(item.endDate) : "Present"}
            </p>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
          <InclusionFooter
            included={item.isResumeFeatured}
            disabled={disabled}
            onToggle={() => toggle("workExperience", item.id)}
          />
        </Card>
      ))}
    </>
  );
}

function ProjectCards({
  items,
  toggle,
  disabled,
}: {
  items: ResumePdfOverview["projects"];
  toggle: (type: ResumePdfItemType, id: string) => void;
  disabled: boolean;
}) {
  if (items.length === 0) {
    return <EmptyState>No project records found.</EmptyState>;
  }

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className={item.isVisible ? "" : "opacity-70"}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.status}</Badge>
              <Badge>{item.projectType}</Badge>
              {!item.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
            </div>
            <CardTitle className="pt-2">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {item.hiringSignal || item.subtitle || item.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.technologies.slice(0, 6).map((technology) => (
                <Chip key={technology}>{technology}</Chip>
              ))}
            </div>
          </CardContent>
          <InclusionFooter
            included={item.isResumeFeatured}
            disabled={disabled}
            onToggle={() => toggle("project", item.id)}
          />
        </Card>
      ))}
    </>
  );
}

function SkillCards({
  items,
  toggle,
  disabled,
}: {
  items: ResumePdfOverview["skills"];
  toggle: (type: ResumePdfItemType, id: string) => void;
  disabled: boolean;
}) {
  if (items.length === 0) {
    return <EmptyState>No skill records found.</EmptyState>;
  }

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className={item.isVisible ? "" : "opacity-70"}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.category}</Badge>
              <Badge>{item.proficiencyLabel}</Badge>
              {!item.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
            </div>
            <CardTitle className="pt-2">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {item.description ? (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </CardContent>
          <InclusionFooter
            included={item.isResumeFeatured}
            disabled={disabled}
            onToggle={() => toggle("skill", item.id)}
          />
        </Card>
      ))}
    </>
  );
}

function EducationCards({
  items,
  toggle,
  disabled,
}: {
  items: ResumePdfOverview["education"];
  toggle: (type: ResumePdfItemType, id: string) => void;
  disabled: boolean;
}) {
  if (items.length === 0) {
    return <EmptyState>No education records found.</EmptyState>;
  }

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className={item.isVisible ? "" : "opacity-70"}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.degreeType}</Badge>
              <Badge tone={item.status === "completed" ? "success" : "accent"}>
                {item.status}
              </Badge>
              {!item.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
            </div>
            <CardTitle className="pt-2">{item.degree}</CardTitle>
            <p className="text-sm font-medium text-accent">
              {item.institution}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatMonth(item.startDate)} -{" "}
              {item.endDate ? formatMonth(item.endDate) : "Present"}
            </p>
          </CardContent>
          <InclusionFooter
            included={item.isResumeFeatured}
            disabled={disabled}
            onToggle={() => toggle("education", item.id)}
          />
        </Card>
      ))}
    </>
  );
}

function CertificationCards({
  items,
  toggle,
  disabled,
}: {
  items: ResumePdfOverview["certifications"];
  toggle: (type: ResumePdfItemType, id: string) => void;
  disabled: boolean;
}) {
  if (items.length === 0) {
    return <EmptyState>No certification records found.</EmptyState>;
  }

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className={item.isVisible ? "" : "opacity-70"}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.category}</Badge>
              <Badge>{item.status}</Badge>
              {!item.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
            </div>
            <CardTitle className="pt-2">{item.name}</CardTitle>
            <p className="text-sm font-medium text-accent">{item.issuer}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatMonth(item.issueDate)}
            </p>
          </CardContent>
          <InclusionFooter
            included={item.isResumeFeatured}
            disabled={disabled}
            onToggle={() => toggle("certification", item.id)}
          />
        </Card>
      ))}
    </>
  );
}

function getPdfDateFormat(
  blocks: ResumePdfOverview["profileBlocks"]
): "month-year" | "year" {
  const profile = blocks.find((block) => block.blockKey === "profile");
  const metadata = profile?.metadata;

  return metadata &&
    typeof metadata === "object" &&
    (metadata as { pdfDateFormat?: unknown }).pdfDateFormat === "year"
    ? "year"
    : "month-year";
}

export default function ResumePdfDashboardPage() {
  const [notice, setNotice] = React.useState<Notice>(null);
  const {
    data,
    isLoading,
    error,
    refetch,
  } = api.resumePdf.getOverview.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const toggleMutation = api.resumePdf.toggleInclusion.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "PDF inclusion updated." });
    },
    onError: (mutationError) => {
      setNotice({
        tone: "error",
        message: `Failed to update PDF inclusion: ${mutationError.message}`,
      });
    },
  });
  const dateFormatMutation = api.resumePdf.toggleDateFormat.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "PDF date format updated." });
    },
    onError: (mutationError) => {
      setNotice({
        tone: "error",
        message: `Failed to update PDF date format: ${mutationError.message}`,
      });
    },
  });

  const toggle = (type: ResumePdfItemType, id: string) => {
    setNotice(null);
    toggleMutation.mutate({ type, id });
  };

  const includedCount = data
    ? [
        ...data.profileBlocks.filter((item) => item.isFeatured),
        ...data.workExperiences.filter((item) => item.isResumeFeatured),
        ...data.projects.filter((item) => item.isResumeFeatured),
        ...data.skills.filter((item) => item.isResumeFeatured),
        ...data.education.filter((item) => item.isResumeFeatured),
        ...data.certifications.filter((item) => item.isResumeFeatured),
      ].length
    : 0;
  const pdfDateFormat = data ? getPdfDateFormat(data.profileBlocks) : "month-year";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-accent">
            CMS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Resume PDF
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Choose which CMS records are included when the public resume page
            generates the downloadable PDF.
          </p>
        </div>
        <Link
          href="/resume"
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium shadow-[var(--shadow-subtle)] transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          Preview resume
        </Link>
      </div>

      <NoticeBanner notice={notice} />

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Resume PDF data could not load: {error.message}
        </div>
      ) : isLoading || !data ? (
        <LoadingState>Loading resume PDF sections</LoadingState>
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Included records
              </p>
              <p className="mt-2 font-display text-3xl font-semibold">
                {includedCount}
              </p>
            </Card>
            <Card className="p-4">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Source tables
              </p>
              <p className="mt-2 font-display text-3xl font-semibold">6</p>
            </Card>
            <Card className="p-4">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                PDF dates
              </p>
              <p className="mt-2 font-display text-3xl font-semibold">
                {pdfDateFormat === "year" ? "Years" : "Months"}
              </p>
              <Button
                className="mt-3"
                variant="outline"
                onClick={() => {
                  setNotice(null);
                  dateFormatMutation.mutate();
                }}
                disabled={dateFormatMutation.isPending}
              >
                {pdfDateFormat === "year"
                  ? "Show months in PDF"
                  : "Use years only"}
              </Button>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <SectionCard
                title="Profile and Summary"
                description="Controls the resume header, headline, contacts, and summary copy."
                editHref="/dashboard/public-content"
              >
                <ProfileBlocks
                  blocks={data.profileBlocks}
                  toggle={toggle}
                  disabled={toggleMutation.isPending}
                />
              </SectionCard>

              <SectionCard
                title="Experience"
                description="Roles shown in the professional experience section."
                editHref="/dashboard/work-experiences"
              >
                <ExperienceCards
                  items={data.workExperiences}
                  toggle={toggle}
                  disabled={toggleMutation.isPending}
                />
              </SectionCard>

              <SectionCard
                title="Selected Work"
                description="Projects shown in the selected work section of the PDF."
                editHref="/dashboard/projects"
              >
                <ProjectCards
                  items={data.projects}
                  toggle={toggle}
                  disabled={toggleMutation.isPending}
                />
              </SectionCard>
            </div>

            <aside className="space-y-6">
              <SectionCard
                title="Skills"
                description="Skill chips grouped into the PDF skills sidebar."
                editHref="/dashboard/skills"
              >
                <SkillCards
                  items={data.skills}
                  toggle={toggle}
                  disabled={toggleMutation.isPending}
                />
              </SectionCard>

              <SectionCard
                title="Education"
                description="Education records shown in the PDF background section."
                editHref="/dashboard/education"
              >
                <EducationCards
                  items={data.education}
                  toggle={toggle}
                  disabled={toggleMutation.isPending}
                />
              </SectionCard>

              <SectionCard
                title="Certifications"
                description="Credentials shown in the PDF background section."
                editHref="/dashboard/certifications"
              >
                <CertificationCards
                  items={data.certifications}
                  toggle={toggle}
                  disabled={toggleMutation.isPending}
                />
              </SectionCard>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
