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
  Checkbox,
  Chip,
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  LoadingState,
  Select,
  Textarea,
} from "@/components/ui";
import { api } from "$/trpc/client";
import type { Certification } from "$/db/schema/schema.types";

type CertificationCategory =
  | "technical"
  | "cloud"
  | "security"
  | "project-management"
  | "design"
  | "other";

type CertificationStatus = "active" | "expired" | "revoked";

type CertificationFormData = {
  name: string;
  issuer: string;
  description: string;
  category: CertificationCategory;
  status: CertificationStatus;
  skills: string[];
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verificationUrl: string;
  icon: string;
  isVisible: boolean;
  displayOrder: number;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

const defaultFormData: CertificationFormData = {
  name: "",
  issuer: "",
  description: "",
  category: "technical",
  status: "active",
  skills: [],
  issueDate: new Date().toISOString().split("T")[0] ?? "",
  expiryDate: "",
  credentialId: "",
  verificationUrl: "",
  icon: "",
  isVisible: true,
  displayOrder: 0,
};

const categoryOptions: Array<{
  value: CertificationCategory;
  label: string;
}> = [
  { value: "technical", label: "Technical" },
  { value: "cloud", label: "Cloud" },
  { value: "security", label: "Security" },
  { value: "project-management", label: "Project Management" },
  { value: "design", label: "Design" },
  { value: "other", label: "Other" },
];

const statusOptions: Array<{
  value: CertificationStatus;
  label: string;
}> = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "revoked", label: "Revoked" },
];

function toDateInput(value: Date | string | null) {
  if (!value) return "";
  return format(new Date(value), "yyyy-MM-dd");
}

function formatMonth(value: Date | string) {
  return format(new Date(value), "MMM yyyy");
}

function getCategoryLabel(value: string) {
  return categoryOptions.find((option) => option.value === value)?.label ?? value;
}

function getStatusTone(status: string): "success" | "warning" | "destructive" {
  if (status === "active") return "success";
  if (status === "expired") return "warning";
  return "destructive";
}

function certificationToFormData(
  certification: Certification
): CertificationFormData {
  return {
    name: certification.name,
    issuer: certification.issuer,
    description: certification.description,
    category: certification.category as CertificationCategory,
    status: certification.status as CertificationStatus,
    skills: certification.skills ?? [],
    issueDate: toDateInput(certification.issueDate),
    expiryDate: toDateInput(certification.expiryDate),
    credentialId: certification.credentialId ?? "",
    verificationUrl: certification.verificationUrl ?? "",
    icon: certification.icon ?? "",
    isVisible: certification.isVisible,
    displayOrder: certification.displayOrder,
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
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

export default function CertificationsAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [formData, setFormData] =
    useState<CertificationFormData>(defaultFormData);
  const [skillInput, setSkillInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: certifications = [],
    isLoading,
    refetch,
  } = api.certifications.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.certifications.getStatistics.useQuery();

  const createMutation = api.certifications.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Certification created." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to create certification: ${error.message}`,
      });
    },
  });

  const updateMutation = api.certifications.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Certification updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update certification: ${error.message}`,
      });
    },
  });

  const deleteMutation = api.certifications.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
      setNotice({ tone: "success", message: "Certification deleted." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to delete certification: ${error.message}`,
      });
    },
  });

  const toggleVisibilityMutation =
    api.certifications.toggleVisibility.useMutation({
      onSuccess: () => {
        refetch();
        setNotice({ tone: "success", message: "Visibility updated." });
      },
      onError: (error) => {
        setNotice({
          tone: "error",
          message: `Failed to update visibility: ${error.message}`,
        });
      },
    });

  const handleOpenDialog = (certification?: Certification) => {
    setNotice(null);
    if (certification) {
      setEditingCertification(certification);
      setFormData(certificationToFormData(certification));
    } else {
      setEditingCertification(null);
      setFormData(defaultFormData);
    }
    setSkillInput("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCertification(null);
    setFormData(defaultFormData);
    setSkillInput("");
  };

  const updateField = <K extends keyof CertificationFormData>(
    key: K,
    value: CertificationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill || formData.skills.includes(skill)) return;

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      name: formData.name,
      issuer: formData.issuer,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      skills: formData.skills,
      issueDate: new Date(formData.issueDate),
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate)
        : undefined,
      verificationUrl: formData.verificationUrl || undefined,
      credentialId: formData.credentialId || undefined,
      icon: formData.icon || undefined,
      isVisible: formData.isVisible,
      displayOrder: formData.displayOrder,
    };

    if (editingCertification) {
      updateMutation.mutate({
        id: editingCertification.id,
        data: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSubmit =
    !!formData.name &&
    !!formData.issuer &&
    !!formData.description &&
    !!formData.issueDate &&
    formData.skills.length > 0 &&
    !isSaving;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-accent">
            CMS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Certifications
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage visible certifications, issuing organizations, verification
            links, related skills, and ordering.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>Add Certification</Button>
      </div>

      <NoticeBanner notice={notice} />

      {!statsLoading && statistics ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Active", statistics.totalActive],
            ["Total Expired", statistics.totalExpired],
            ["Total", statistics.total],
            ["Categories", statistics.byCategory.length],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  {label}
                </p>
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState>Loading certifications</LoadingState>
      ) : certifications.length === 0 ? (
        <EmptyState>No certifications found.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((certification) => (
            <Card
              key={certification.id}
              className={
                certification.isVisible
                  ? "flex flex-col"
                  : "flex flex-col border-dashed opacity-70"
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {certification.icon ? (
                      <span className="text-xl" aria-hidden="true">
                        {certification.icon}
                      </span>
                    ) : null}
                    <Badge>{getCategoryLabel(certification.category)}</Badge>
                    <Badge tone={getStatusTone(certification.status)}>
                      {certification.status}
                    </Badge>
                    {!certification.isVisible ? (
                      <Badge tone="warning">Hidden</Badge>
                    ) : null}
                  </div>
                </div>
                <CardTitle className="pt-3">{certification.name}</CardTitle>
                <p className="text-sm font-medium text-accent">
                  {certification.issuer}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {certification.description}
                </p>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p>
                    Issued {formatMonth(certification.issueDate)}
                    {certification.expiryDate
                      ? ` - expires ${formatMonth(certification.expiryDate)}`
                      : ""}
                  </p>
                  {certification.credentialId ? (
                    <p>Credential: {certification.credentialId}</p>
                  ) : null}
                  {certification.verificationUrl ? (
                    <a
                      href={certification.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Verification URL
                    </a>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(certification.skills ?? []).slice(0, 5).map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                  {(certification.skills ?? []).length > 5 ? (
                    <Chip>+{(certification.skills ?? []).length - 5} more</Chip>
                  ) : null}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button
                  variant="quiet"
                  onClick={() =>
                    toggleVisibilityMutation.mutate({ id: certification.id })
                  }
                  disabled={toggleVisibilityMutation.isPending}
                >
                  {certification.isVisible ? "Hide" : "Show"}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenDialog(certification)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(certification.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
        className="max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editingCertification ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </Field>
            <Field label="Issuer">
              <Input
                value={formData.issuer}
                onChange={(event) => updateField("issuer", event.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={formData.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              required
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <Select
                value={formData.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value as CertificationCategory
                  )
                }
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(event) =>
                  updateField("status", event.target.value as CertificationStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Issue date">
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(event) =>
                  updateField("issueDate", event.target.value)
                }
                required
              />
            </Field>
            <Field label="Expiry date">
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(event) =>
                  updateField("expiryDate", event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Credential ID">
              <Input
                value={formData.credentialId}
                onChange={(event) =>
                  updateField("credentialId", event.target.value)
                }
              />
            </Field>
            <Field label="Icon">
              <Input
                value={formData.icon}
                onChange={(event) => updateField("icon", event.target.value)}
                maxLength={10}
              />
            </Field>
          </div>

          <Field label="Verification URL">
            <Input
              type="url"
              value={formData.verificationUrl}
              onChange={(event) =>
                updateField("verificationUrl", event.target.value)
              }
            />
          </Field>

          <div>
            <span className="text-sm font-medium text-foreground">Skills</span>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill"
              />
              <Button
                variant="outline"
                onClick={handleAddSkill}
                disabled={!skillInput.trim()}
              >
                Add
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill} x
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_180px] md:items-end">
            <label className="inline-flex items-center gap-2 text-sm">
              <Checkbox
                checked={formData.isVisible}
                onChange={(event) =>
                  updateField("isVisible", event.target.checked)
                }
              />
              Visible
            </label>
            <Field label="Display order">
              <Input
                type="number"
                value={formData.displayOrder}
                onChange={(event) =>
                  updateField("displayOrder", Number(event.target.value))
                }
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="quiet" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving
                ? "Saving"
                : editingCertification
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmOpen(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Certification</DialogTitle>
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
