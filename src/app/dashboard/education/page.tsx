"use client";

import { useState } from "react";
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
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  LoadingState,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type EducationRecord = RouterOutputs["education"]["getAllAdmin"][number];

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

export default function EducationAdminPage() {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: educationData = [],
    isLoading,
    error,
    refetch,
  } = api.education.getAllAdmin.useQuery();

  const deleteMutation = api.education.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
      setNotice({ tone: "success", message: "Education record deleted." });
    },
    onError: (mutationError) => {
      setNotice({
        tone: "error",
        message: `Failed to delete education record: ${mutationError.message}`,
      });
    },
  });

  const toggleVisibilityMutation = api.education.toggleVisibility.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "Visibility updated." });
    },
    onError: (mutationError) => {
      setNotice({
        tone: "error",
        message: `Failed to update visibility: ${mutationError.message}`,
      });
    },
  });

  const openInfoDialog = () => {
    setNotice(null);
    setInfoDialogOpen(true);
  };

  const renderEducationCard = (education: EducationRecord) => (
    <Card
      key={education.id}
      className={
        education.isVisible
          ? "flex flex-col"
          : "flex flex-col border-dashed opacity-70"
      }
    >
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{education.degreeType}</Badge>
          <Badge tone={education.status === "completed" ? "success" : "accent"}>
            {education.status}
          </Badge>
          {!education.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
        </div>
        <CardTitle className="pt-3">{education.degree}</CardTitle>
        <p className="text-sm font-medium text-accent">
          {education.institution}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
          {education.fieldOfStudy ? <p>{education.fieldOfStudy}</p> : null}
          {education.location ? <p>{education.location}</p> : null}
          <p>
            {formatMonth(education.startDate)} -{" "}
            {education.endDate ? formatMonth(education.endDate) : "Present"}
          </p>
          {education.gpa ? <p>GPA: {education.gpa}</p> : null}
        </div>

        {education.achievements.length > 0 ? (
          <div className="mt-5">
            <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
              Key achievements
            </p>
            <div className="flex flex-wrap gap-2">
              {education.achievements.slice(0, 3).map((achievement) => (
                <Chip key={achievement}>{achievement}</Chip>
              ))}
              {education.achievements.length > 3 ? (
                <Chip>+{education.achievements.length - 3} more</Chip>
              ) : null}
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="quiet"
          onClick={() =>
            toggleVisibilityMutation.mutate({ id: education.id })
          }
          disabled={toggleVisibilityMutation.isPending}
        >
          {education.isVisible ? "Hide" : "Show"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openInfoDialog}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteConfirmOpen(education.id)}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-accent">
            CMS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Education
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage education records used by public resume and profile pages.
          </p>
        </div>
        <Button onClick={openInfoDialog}>Add Education</Button>
      </div>

      <NoticeBanner notice={notice} />

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Error loading education data: {error.message}
        </div>
      ) : isLoading ? (
        <LoadingState>Loading education records</LoadingState>
      ) : educationData.length === 0 ? (
        <EmptyState>No education records found.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {educationData.map(renderEducationCard)}
        </div>
      )}

      <Dialog
        open={infoDialogOpen}
        onOpenChange={(open) => setInfoDialogOpen(open)}
      >
        <DialogHeader>
          <DialogTitle>Education Management</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          The legacy education page did not implement create/edit fields. This
          Tailwind route preserves that behavior for now: listing, visibility
          toggles, and deletion are available, while full education editing
          remains a follow-up.
        </p>
        <div className="mt-5 flex justify-end">
          <Button variant="outline" onClick={() => setInfoDialogOpen(false)}>
            Close
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmOpen(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Education Record</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setDeleteConfirmOpen(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteConfirmOpen) {
                deleteMutation.mutate({ id: deleteConfirmOpen });
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
