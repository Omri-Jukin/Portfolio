"use client";

import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  CodeBlock,
  LoadingState,
} from "@/components/ui";
import { api } from "$/trpc/client";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function formatDate(value: string | number | Date | null | undefined) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value || "N/A"}</dd>
    </div>
  );
}

export function IntakeDetailClient({ id }: { id: string }) {
  const {
    data: intake,
    isLoading,
    error,
  } = api.intakes.getById.useQuery({ id }, { enabled: Boolean(id) });

  if (isLoading) return <LoadingState>Loading intake details</LoadingState>;

  if (error || !intake) {
    return (
      <Alert tone="destructive">
        {error?.message ?? "Intake could not be loaded."}
      </Alert>
    );
  }

  const data = asRecord(intake.data) ?? {};
  const contact = asRecord(data.contact);
  const org = asRecord(data.org);
  const project = asRecord(data.project);
  const additional = asRecord(data.additional);
  const budget = asRecord(project?.budget);
  const technologies = asStringArray(project?.technologies);
  const requirements = asStringArray(project?.requirements);
  const goals = asStringArray(project?.goals);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Intake details
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            {intake.email}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{intake.status}</Badge>
            {intake.flagged ? <Badge tone="warning">Flagged</Badge> : null}
            {intake.riskLevel ? <Badge>{intake.riskLevel}</Badge> : null}
          </div>
        </div>
        <Button variant="outline">
          <Link href="/dashboard/intakes">Back to Intakes</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Created
            </p>
            <CardTitle className="text-base">
              {formatDate(intake.createdAt)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Estimated Value
            </p>
            <CardTitle className="text-base">
              {intake.estimatedValue ?? "N/A"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Last Reviewed
            </p>
            <CardTitle className="text-base">
              {formatDate(intake.lastReviewedAt)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              value={`${asString(contact?.firstName)} ${asString(
                contact?.lastName
              )}`.trim()}
            />
            <Field label="Email" value={asString(contact?.email) || intake.email} />
            <Field label="Phone" value={asString(contact?.phone)} />
            <Field label="Full Name" value={asString(contact?.fullName)} />
          </dl>
        </CardContent>
      </Card>

      {org ? (
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={asString(org.name)} />
              <Field label="Website" value={asString(org.website)} />
              <Field label="Industry" value={asString(org.industry)} />
              <Field label="Size" value={asString(org.size)} />
            </dl>
          </CardContent>
        </Card>
      ) : null}

      {project ? (
        <Card>
          <CardHeader>
            <CardTitle>Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={asString(project.title)} />
              <Field label="Timeline" value={asString(project.timeline)} />
              <Field label="Start Date" value={asString(project.startDate)} />
              <Field
                label="Budget"
                value={[asString(budget?.currency), asString(budget?.min), asString(budget?.max)]
                  .filter(Boolean)
                  .join(" ")}
              />
            </dl>

            {asString(project.description) ? (
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {asString(project.description)}
                </p>
              </div>
            ) : null}

            {technologies.length > 0 ? (
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  Technologies
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <Chip key={technology}>{technology}</Chip>
                  ))}
                </div>
              </div>
            ) : null}

            {requirements.length > 0 || goals.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {requirements.length > 0 ? (
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">
                      Requirements
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                      {requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {goals.length > 0 ? (
                  <div>
                    <p className="font-mono text-xs uppercase text-muted-foreground">
                      Goals
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                      {goals.map((goal) => (
                        <li key={goal}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {additional ? (
        <Card>
          <CardHeader>
            <CardTitle>Additional</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Preferred Contact"
                value={asString(additional.preferredContactMethod)}
              />
              <Field label="Timezone" value={asString(additional.timezone)} />
              <Field label="Urgency" value={asString(additional.urgency)} />
              <Field label="Notes" value={asString(additional.notes)} />
            </dl>
          </CardContent>
        </Card>
      ) : null}

      {intake.customLink ? (
        <Card>
          <CardHeader>
            <CardTitle>Custom Link</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" value={intake.customLink.slug} />
              <Field label="Expires" value={formatDate(intake.customLink.expiresAt)} />
              <Field label="Organization" value={intake.customLink.organizationName} />
              <Field
                label="Hidden Sections"
                value={intake.customLink.hiddenSections.join(", ")}
              />
            </dl>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Proposal Markdown</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock>{intake.proposalMd || ""}</CodeBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock>{JSON.stringify(data, null, 2)}</CodeBlock>
        </CardContent>
      </Card>
    </div>
  );
}
