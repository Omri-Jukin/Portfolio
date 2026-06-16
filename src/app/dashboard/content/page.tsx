import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

const quickTasks = [
  {
    title: "Homepage words and section order",
    description:
      "Hero copy, metrics, technical strengths, proof locker links, common questions, contact CTA, and homepage block order.",
    href: "/dashboard/public-content",
    badge: "Homepage",
    tone: "accent" as const,
  },
  {
    title: "Selected work and case studies",
    description:
      "Project cards, hiring signals, case-study pages, proof links, private-repo notes, and resume-featured projects.",
    href: "/dashboard/projects",
    badge: "Projects",
    tone: "success" as const,
  },
  {
    title: "Resume experience wording",
    description:
      "Roles, employment type, company context, achievements, responsibilities, technologies, and role ordering.",
    href: "/dashboard/work-experiences",
    badge: "Resume",
    tone: "success" as const,
  },
  {
    title: "Resume PDF header and summary",
    description:
      "Name, title, headline, contact links, and professional summary used by the public resume page and generated PDF.",
    href: "/dashboard/public-content",
    badge: "Resume PDF",
    tone: "accent" as const,
  },
  {
    title: "Skills shown to recruiters",
    description:
      "Technical strengths, skill group ordering, related projects, proficiency labels, and visibility.",
    href: "/dashboard/skills",
    badge: "Skills",
    tone: "success" as const,
  },
  {
    title: "Education and credentials",
    description:
      "Education records, certifications, issuers, verification links, visibility, and display ordering.",
    href: "/dashboard/education",
    secondaryHref: "/dashboard/certifications",
    badge: "Background",
    tone: "success" as const,
  },
  {
    title: "Dashboard sections",
    description:
      "Reorder the dashboard cards themselves from the main dashboard by dragging the cards.",
    href: "/dashboard",
    badge: "Admin",
    tone: "warning" as const,
  },
];

const dataMap = [
  {
    label: "public_content_blocks",
    body:
      "Editable page copy and flexible public blocks. Use this for homepage text, CTAs, proof locker items, homepage order, and resume PDF profile copy.",
  },
  {
    label: "projects",
    body:
      "Structured project data. Use this when the same project appears on the homepage, case-study pages, resume, or PDF.",
  },
  {
    label: "work_experiences",
    body:
      "Structured career history. Use this for LinkedIn/resume wording, role context, achievements, and role order.",
  },
  {
    label: "skills",
    body:
      "Structured skill inventory. Use this for recruiter-facing capabilities and skill grouping.",
  },
  {
    label: "education / certifications",
    body:
      "Structured background data used by the resume page and generated PDF.",
  },
];

export default function ContentWorkspacePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase text-accent">
          CMS
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Content Workspace
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Start from the thing you want to rewrite. The content is still stored
          in focused tables, but this page routes by editing intent.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickTasks.map((task) => (
          <Card key={task.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2">
                <Badge tone={task.tone}>{task.badge}</Badge>
              </div>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex flex-wrap gap-3">
              <Link
                href={task.href}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Open
              </Link>
              {task.secondaryHref ? (
                <Link
                  href={task.secondaryHref}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Open certifications
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">
          Where each kind of content lives
        </h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {dataMap.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="font-mono text-sm uppercase">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
