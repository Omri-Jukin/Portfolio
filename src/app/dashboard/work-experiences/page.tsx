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
  CursorPressLink,
  Dialog,
  EditableChipList,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  LoadingState,
  Select,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type WorkExperience =
  RouterOutputs["workExperiences"]["getAllAdmin"][number];

type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship"
  | "voluntary";

type ArrayField = "achievements" | "technologies" | "responsibilities";

type WorkExperienceFormData = {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  employmentType: EmploymentType;
  industry: string;
  companyUrl: string;
  logo: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

const defaultFormData: WorkExperienceFormData = {
  role: "",
  company: "",
  location: "",
  startDate: String(new Date().getFullYear()),
  endDate: "",
  description: "",
  achievements: [],
  technologies: [],
  responsibilities: [],
  employmentType: "full-time",
  industry: "",
  companyUrl: "",
  logo: "",
  displayOrder: 0,
  isVisible: true,
  isFeatured: false,
};

const employmentTypeOptions: Array<{ value: EmploymentType; label: string }> = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "voluntary", label: "Voluntary" },
];

const arrayFieldLabels: Record<ArrayField, string> = {
  achievements: "Achievements",
  technologies: "Technologies",
  responsibilities: "Responsibilities",
};

function toYearInput(value: Date | string | null) {
  if (!value) return "";
  return format(new Date(value), "yyyy");
}

function yearToDate(value: string) {
  return new Date(`${value}-01-01T00:00:00.000Z`);
}

function formatYear(value: Date | string) {
  return format(new Date(value), "yyyy");
}

function getEmploymentTypeLabel(value: string) {
  return (
    employmentTypeOptions.find((option) => option.value === value)?.label ??
    value
  );
}

function formatDuration(startDate: string, endDate: string | null) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const years = Math.max(0, end.getFullYear() - start.getFullYear());

  return years === 1 ? "1y" : `${years}y`;
}

function workExperienceToFormData(
  experience: WorkExperience
): WorkExperienceFormData {
  return {
    role: experience.role,
    company: experience.company,
    location: experience.location,
    startDate: toYearInput(experience.startDate),
    endDate: toYearInput(experience.endDate),
    description: experience.description,
    achievements: experience.achievements ?? [],
    technologies: experience.technologies ?? [],
    responsibilities: experience.responsibilities ?? [],
    employmentType: experience.employmentType as EmploymentType,
    industry: experience.industry,
    companyUrl: experience.companyUrl ?? "",
    logo: experience.logo ?? "",
    displayOrder: experience.displayOrder,
    isVisible: experience.isVisible,
    isFeatured: experience.isFeatured,
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

export default function WorkExperiencesAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);
  const [formData, setFormData] =
    useState<WorkExperienceFormData>(defaultFormData);
  const [arrayInput, setArrayInput] = useState<Record<ArrayField, string>>({
    achievements: "",
    technologies: "",
    responsibilities: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: workExperiences = [],
    isLoading,
    refetch,
  } = api.workExperiences.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.workExperiences.getStatistics.useQuery();

  const createMutation = api.workExperiences.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Work experience created." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to create work experience: ${error.message}`,
      });
    },
  });

  const updateMutation = api.workExperiences.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Work experience updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update work experience: ${error.message}`,
      });
    },
  });

  const deleteMutation = api.workExperiences.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
      setNotice({ tone: "success", message: "Work experience deleted." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to delete work experience: ${error.message}`,
      });
    },
  });

  const toggleVisibilityMutation =
    api.workExperiences.toggleVisibility.useMutation({
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

  const toggleFeaturedMutation =
    api.workExperiences.toggleFeatured.useMutation({
      onSuccess: () => {
        refetch();
        setNotice({ tone: "success", message: "Featured status updated." });
      },
      onError: (error) => {
        setNotice({
          tone: "error",
          message: `Failed to update featured status: ${error.message}`,
        });
      },
    });

  const handleOpenDialog = (experience?: WorkExperience) => {
    setNotice(null);
    if (experience) {
      setEditingExperience(experience);
      setFormData(workExperienceToFormData(experience));
    } else {
      setEditingExperience(null);
      setFormData(defaultFormData);
    }

    setArrayInput({ achievements: "", technologies: "", responsibilities: "" });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExperience(null);
    setFormData(defaultFormData);
    setArrayInput({ achievements: "", technologies: "", responsibilities: "" });
  };

  const updateField = <K extends keyof WorkExperienceFormData>(
    key: K,
    value: WorkExperienceFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddArrayItem = (field: ArrayField) => {
    const value = arrayInput[field].trim();
    if (!value || formData[field].includes(value)) return;

    setFormData((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    setArrayInput((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRemoveArrayItem = (field: ArrayField, itemToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== itemToRemove),
    }));
  };

  const handleUpdateArrayItem = (
    field: ArrayField,
    currentValue: string,
    nextValue: string
  ) => {
    const value = nextValue.trim();
    if (!value) return;

    setFormData((prev) => {
      if (prev[field].some((item) => item === value && item !== currentValue)) {
        return prev;
      }

      return {
        ...prev,
        [field]: prev[field].map((item) =>
          item === currentValue ? value : item
        ),
      };
    });
  };

  const handleSubmit = () => {
    const submitData = {
      role: formData.role,
      company: formData.company,
      location: formData.location,
      startDate: yearToDate(formData.startDate),
      endDate: formData.endDate ? yearToDate(formData.endDate) : undefined,
      description: formData.description,
      achievements: formData.achievements,
      technologies: formData.technologies,
      responsibilities: formData.responsibilities,
      employmentType: formData.employmentType,
      industry: formData.industry,
      companyUrl: formData.companyUrl || undefined,
      logo: formData.logo || undefined,
      displayOrder: formData.displayOrder,
      isVisible: formData.isVisible,
      isFeatured: formData.isFeatured,
    };

    if (editingExperience) {
      updateMutation.mutate({
        id: editingExperience.id,
        data: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSubmit =
    !!formData.role &&
    !!formData.company &&
    !!formData.location &&
    !!formData.startDate &&
    !!formData.description &&
    !!formData.industry &&
    formData.achievements.length > 0 &&
    formData.technologies.length > 0 &&
    formData.responsibilities.length > 0 &&
    !isSaving;

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-ruby">
            CMS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Work Experience
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage roles, achievements, responsibilities, technologies, resume
            visibility, and featured career entries.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>Add Experience</Button>
      </div>

      <NoticeBanner notice={notice} />

      {!statsLoading && statistics ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Visible", statistics.totalVisible],
            ["Total Featured", statistics.totalFeatured],
            ["Experience", `${statistics.totalYearsExperience}y`],
            ["Total", statistics.total],
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
        <LoadingState>Loading work experiences</LoadingState>
      ) : workExperiences.length === 0 ? (
        <EmptyState>No work experiences found.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workExperiences.map((experience) => (
            <Card
              key={experience.id}
              className={
                experience.isVisible
                  ? "flex flex-col"
                  : "flex flex-col border-dashed opacity-70"
              }
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{getEmploymentTypeLabel(experience.employmentType)}</Badge>
                  <Badge tone={experience.endDate ? "default" : "success"}>
                    {experience.endDate ? "Past" : "Current"}
                  </Badge>
                  {experience.isFeatured ? (
                    <Badge tone="accent">Featured</Badge>
                  ) : null}
                  {!experience.isVisible ? (
                    <Badge tone="warning">Hidden</Badge>
                  ) : null}
                </div>
                <CardTitle className="pt-3">{experience.role}</CardTitle>
                <p className="text-sm font-medium text-accent">
                  {experience.company} / {experience.location}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  {formatYear(experience.startDate)} -{" "}
                  {experience.endDate
                    ? formatYear(experience.endDate)
                    : "Present"}{" "}
                  ({formatDuration(experience.startDate, experience.endDate)})
                </p>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {experience.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {experience.technologies.slice(0, 6).map((technology) => (
                    <Chip key={technology}>{technology}</Chip>
                  ))}
                  {experience.technologies.length > 6 ? (
                    <Chip>+{experience.technologies.length - 6} more</Chip>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p>{experience.achievements.length} achievements recorded</p>
                  <p>
                    {experience.responsibilities.length} responsibilities
                    recorded
                  </p>
                  <p>Industry: {experience.industry}</p>
                  {experience.companyUrl ? (
                    <CursorPressLink
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      size="sm"
                      className="w-fit"
                    >
                      Company website
                    </CursorPressLink>
                  ) : null}
                </div>
              </CardContent>
              <CardFooter className="flex-wrap justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="quiet"
                    onClick={() =>
                      toggleVisibilityMutation.mutate({ id: experience.id })
                    }
                    disabled={toggleVisibilityMutation.isPending}
                  >
                    {experience.isVisible ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="quiet"
                    onClick={() =>
                      toggleFeaturedMutation.mutate({ id: experience.id })
                    }
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    {experience.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenDialog(experience)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(experience.id)}
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
            {editingExperience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Role">
              <Input
                value={formData.role}
                onChange={(event) => updateField("role", event.target.value)}
                required
              />
            </Field>
            <Field label="Company">
              <Input
                value={formData.company}
                onChange={(event) => updateField("company", event.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Location">
              <Input
                value={formData.location}
                onChange={(event) => updateField("location", event.target.value)}
                required
              />
            </Field>
            <Field label="Industry">
              <Input
                value={formData.industry}
                onChange={(event) => updateField("industry", event.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Start year">
              <Input
                type="number"
                min={1900}
                max={2100}
                inputMode="numeric"
                value={formData.startDate}
                onChange={(event) =>
                  updateField("startDate", event.target.value)
                }
                required
              />
            </Field>
            <Field label="End year">
              <Input
                type="number"
                min={1900}
                max={2100}
                inputMode="numeric"
                value={formData.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
              />
            </Field>
            <Field label="Employment type">
              <Select
                value={formData.employmentType}
                onChange={(event) =>
                  updateField(
                    "employmentType",
                    event.target.value as EmploymentType
                  )
                }
              >
                {employmentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
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
            <Field label="Company URL">
              <Input
                type="url"
                value={formData.companyUrl}
                onChange={(event) =>
                  updateField("companyUrl", event.target.value)
                }
              />
            </Field>
            <Field label="Logo URL">
              <Input
                value={formData.logo}
                onChange={(event) => updateField("logo", event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(["achievements", "technologies", "responsibilities"] as const).map(
              (field) => (
                <EditableChipList
                  key={field}
                  label={arrayFieldLabels[field]}
                  items={formData[field]}
                  inputValue={arrayInput[field]}
                  onInputChange={(value) =>
                    setArrayInput((prev) => ({ ...prev, [field]: value }))
                  }
                  onAdd={() => handleAddArrayItem(field)}
                  onUpdate={(currentValue, nextValue) =>
                    handleUpdateArrayItem(field, currentValue, nextValue)
                  }
                  onRemove={(item) => handleRemoveArrayItem(field, item)}
                />
              )
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_160px_160px_160px] md:items-end">
            <Field label="Display order">
              <Input
                type="number"
                min={0}
                value={formData.displayOrder}
                onChange={(event) =>
                  updateField("displayOrder", Number(event.target.value))
                }
              />
            </Field>
            <label className="inline-flex items-center gap-2 pb-2 text-sm">
              <Checkbox
                checked={formData.isVisible}
                onChange={(event) =>
                  updateField("isVisible", event.target.checked)
                }
              />
              Visible
            </label>
            <label className="inline-flex items-center gap-2 pb-2 text-sm">
              <Checkbox
                checked={formData.isFeatured}
                onChange={(event) =>
                  updateField("isFeatured", event.target.checked)
                }
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="quiet" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving ? "Saving" : editingExperience ? "Update" : "Create"}
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
          <DialogTitle>Delete Work Experience</DialogTitle>
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
