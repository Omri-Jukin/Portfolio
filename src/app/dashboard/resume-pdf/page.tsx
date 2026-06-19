"use client";

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
  CursorPressLink,
  EmptyState,
  LoadingState,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";
import type { ResumePdfSectionKey } from "$/types";

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

type ManagedResumePdfSectionKey = Exclude<
  ResumePdfSectionKey,
  "additionalExperience"
>;

const MANAGED_PDF_SECTION_KEYS: ManagedResumePdfSectionKey[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
];

const PDF_SECTION_DETAILS: Record<
  ManagedResumePdfSectionKey,
  { title: string; description: string; editHref: string }
> = {
  summary: {
    title: "Profile and Summary",
    description: "Controls the resume header, headline, contacts, and summary copy.",
    editHref: "/dashboard/public-content",
  },
  skills: {
    title: "Skills",
    description: "Skill chips grouped into the PDF skills section.",
    editHref: "/dashboard/skills",
  },
  experience: {
    title: "Experience",
    description: "Roles shown in the professional experience section.",
    editHref: "/dashboard/work-experiences",
  },
  projects: {
    title: "Selected Work",
    description: "Projects shown in the selected work section of the PDF.",
    editHref: "/dashboard/projects",
  },
  education: {
    title: "Education",
    description: "Education records shown in the PDF background section.",
    editHref: "/dashboard/education",
  },
  certifications: {
    title: "Certifications",
    description: "Credentials shown in the PDF background section.",
    editHref: "/dashboard/certifications",
  },
};

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
    <section className="min-w-0 rounded-md border border-border p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words font-display text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <CursorPressLink href={editHref} className="w-full sm:w-auto">
          Edit source
        </CursorPressLink>
      </div>
      <div className="grid min-w-0 gap-3">{children}</div>
    </section>
  );
}

function getManagedSectionOrder(
  sectionOrder: ResumePdfSectionKey[]
): ManagedResumePdfSectionKey[] {
  const managed = new Set<ResumePdfSectionKey>(MANAGED_PDF_SECTION_KEYS);
  const seen = new Set<ManagedResumePdfSectionKey>();
  const ordered: ManagedResumePdfSectionKey[] = [];

  for (const section of sectionOrder) {
    if (!managed.has(section)) continue;
    const managedSection = section as ManagedResumePdfSectionKey;
    if (seen.has(managedSection)) continue;
    ordered.push(managedSection);
    seen.add(managedSection);
  }

  return [
    ...ordered,
    ...MANAGED_PDF_SECTION_KEYS.filter((section) => !seen.has(section)),
  ];
}

function SectionOrderPanel({
  sectionOrder,
  onMove,
  disabled,
}: {
  sectionOrder: ManagedResumePdfSectionKey[];
  onMove: (section: ManagedResumePdfSectionKey, direction: -1 | 1) => void;
  disabled: boolean;
}) {
  return (
    <section className="mb-6 rounded-md border border-border p-4">
      <div className="mb-4">
        <p className="font-mono text-xs font-semibold uppercase text-ruby">
          PDF layout
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold">
          Section order
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Move whole PDF sections before downloading the generated resume.
        </p>
      </div>

      <div className="grid gap-2">
        {sectionOrder.map((section, index) => {
          const details = PDF_SECTION_DETAILS[section];

          return (
            <div
              key={section}
              className="grid min-w-0 gap-3 rounded-md border border-border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Order {index + 1}</Badge>
                  <p className="font-display text-base font-semibold">
                    {details.title}
                  </p>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {details.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove(section, -1)}
                  disabled={disabled || index === 0}
                >
                  Up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMove(section, 1)}
                  disabled={disabled || index === sectionOrder.length - 1}
                >
                  Down
                </Button>
              </div>
            </div>
          );
        })}
      </div>
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
    <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      {included ? (
        <Badge tone="success">Included in PDF</Badge>
      ) : (
        <Badge tone="warning">Excluded from PDF</Badge>
      )}
      <Button
        className="w-full sm:w-auto"
        variant="outline"
        onClick={onToggle}
        disabled={disabled}
      >
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
  const sectionOrderMutation = api.resumePdf.updateSectionOrder.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "PDF section order updated." });
    },
    onError: (mutationError) => {
      setNotice({
        tone: "error",
        message: `Failed to update PDF section order: ${mutationError.message}`,
      });
    },
  });

  const toggle = (type: ResumePdfItemType, id: string) => {
    setNotice(null);
    toggleMutation.mutate({ type, id });
  };

  const moveSection = (
    section: ManagedResumePdfSectionKey,
    direction: -1 | 1
  ) => {
    if (!data) return;

    const sectionOrder = getManagedSectionOrder(data.pdfSectionOrder);
    const currentIndex = sectionOrder.indexOf(section);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= sectionOrder.length) {
      return;
    }

    const nextOrder = [...sectionOrder];
    [nextOrder[currentIndex], nextOrder[nextIndex]] = [
      nextOrder[nextIndex],
      nextOrder[currentIndex],
    ];

    setNotice(null);
    sectionOrderMutation.mutate({ sectionOrder: nextOrder });
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
  const managedSectionOrder = data
    ? getManagedSectionOrder(data.pdfSectionOrder)
    : MANAGED_PDF_SECTION_KEYS;
  const sectionCards = data
    ? {
        summary: (
          <SectionCard
            title={PDF_SECTION_DETAILS.summary.title}
            description={PDF_SECTION_DETAILS.summary.description}
            editHref={PDF_SECTION_DETAILS.summary.editHref}
          >
            <ProfileBlocks
              blocks={data.profileBlocks}
              toggle={toggle}
              disabled={toggleMutation.isPending}
            />
          </SectionCard>
        ),
        skills: (
          <SectionCard
            title={PDF_SECTION_DETAILS.skills.title}
            description={PDF_SECTION_DETAILS.skills.description}
            editHref={PDF_SECTION_DETAILS.skills.editHref}
          >
            <SkillCards
              items={data.skills}
              toggle={toggle}
              disabled={toggleMutation.isPending}
            />
          </SectionCard>
        ),
        experience: (
          <SectionCard
            title={PDF_SECTION_DETAILS.experience.title}
            description={PDF_SECTION_DETAILS.experience.description}
            editHref={PDF_SECTION_DETAILS.experience.editHref}
          >
            <ExperienceCards
              items={data.workExperiences}
              toggle={toggle}
              disabled={toggleMutation.isPending}
            />
          </SectionCard>
        ),
        projects: (
          <SectionCard
            title={PDF_SECTION_DETAILS.projects.title}
            description={PDF_SECTION_DETAILS.projects.description}
            editHref={PDF_SECTION_DETAILS.projects.editHref}
          >
            <ProjectCards
              items={data.projects}
              toggle={toggle}
              disabled={toggleMutation.isPending}
            />
          </SectionCard>
        ),
        education: (
          <SectionCard
            title={PDF_SECTION_DETAILS.education.title}
            description={PDF_SECTION_DETAILS.education.description}
            editHref={PDF_SECTION_DETAILS.education.editHref}
          >
            <EducationCards
              items={data.education}
              toggle={toggle}
              disabled={toggleMutation.isPending}
            />
          </SectionCard>
        ),
        certifications: (
          <SectionCard
            title={PDF_SECTION_DETAILS.certifications.title}
            description={PDF_SECTION_DETAILS.certifications.description}
            editHref={PDF_SECTION_DETAILS.certifications.editHref}
          >
            <CertificationCards
              items={data.certifications}
              toggle={toggle}
              disabled={toggleMutation.isPending}
            />
          </SectionCard>
        ),
      } satisfies Record<ManagedResumePdfSectionKey, React.ReactNode>
    : null;

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold uppercase text-ruby">
            CMS
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Resume PDF
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Choose which CMS records are included when the public resume page
            generates the downloadable PDF.
          </p>
        </div>
        <CursorPressLink href="/resume" className="w-full sm:w-auto">
          Preview resume
        </CursorPressLink>
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

          <SectionOrderPanel
            sectionOrder={managedSectionOrder}
            onMove={moveSection}
            disabled={sectionOrderMutation.isPending}
          />

          <div className="grid min-w-0 gap-6">
            {sectionCards
              ? managedSectionOrder.map((section) => (
                  <React.Fragment key={section}>
                    {sectionCards[section]}
                  </React.Fragment>
                ))
              : null}
          </div>
        </>
      )}
    </div>
  );
}
