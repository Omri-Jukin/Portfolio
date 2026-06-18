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

type Skill = RouterOutputs["skills"]["getAllAdmin"][number];

type SkillCategory =
  | "technical"
  | "soft"
  | "language"
  | "tool"
  | "framework"
  | "database"
  | "cloud";

type ProficiencyLabel = "beginner" | "intermediate" | "advanced" | "expert";

type SkillFormData = {
  name: string;
  category: SkillCategory;
  subCategory: string;
  proficiencyLevel: number;
  proficiencyLabel: ProficiencyLabel;
  yearsOfExperience: number;
  description: string;
  icon: string;
  color: string;
  relatedSkills: string[];
  certifications: string[];
  projects: string[];
  lastUsed: string;
  isVisible: boolean;
  displayOrder: number;
};

type ArrayField = "relatedSkills" | "certifications" | "projects";

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

const defaultFormData: SkillFormData = {
  name: "",
  category: "technical",
  subCategory: "",
  proficiencyLevel: 50,
  proficiencyLabel: "intermediate",
  yearsOfExperience: 1,
  description: "",
  icon: "",
  color: "",
  relatedSkills: [],
  certifications: [],
  projects: [],
  lastUsed: new Date().toISOString().split("T")[0] ?? "",
  isVisible: true,
  displayOrder: 0,
};

const categoryOptions: Array<{ value: SkillCategory; label: string }> = [
  { value: "technical", label: "Technical" },
  { value: "soft", label: "Soft Skills" },
  { value: "language", label: "Language" },
  { value: "tool", label: "Tool" },
  { value: "framework", label: "Framework" },
  { value: "database", label: "Database" },
  { value: "cloud", label: "Cloud" },
];

const proficiencyOptions: Array<{
  value: ProficiencyLabel;
  label: string;
  range: [number, number];
}> = [
  { value: "beginner", label: "Beginner", range: [1, 24] },
  { value: "intermediate", label: "Intermediate", range: [25, 49] },
  { value: "advanced", label: "Advanced", range: [50, 74] },
  { value: "expert", label: "Expert", range: [75, 100] },
];

const arrayFieldLabels: Record<ArrayField, string> = {
  relatedSkills: "Related skills",
  certifications: "Certifications",
  projects: "Projects",
};

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

function getProficiencyLabel(value: number): ProficiencyLabel {
  return (
    proficiencyOptions.find(
      (option) => value >= option.range[0] && value <= option.range[1]
    )?.value ?? "intermediate"
  );
}

function getExperienceText(years: number) {
  if (years < 1) return "< 1 year";
  if (years === 1) return "1 year";
  return `${years} years`;
}

function skillToFormData(skill: Skill): SkillFormData {
  return {
    name: skill.name,
    category: skill.category as SkillCategory,
    subCategory: skill.subCategory ?? "",
    proficiencyLevel: skill.proficiencyLevel,
    proficiencyLabel: skill.proficiencyLabel as ProficiencyLabel,
    yearsOfExperience: skill.yearsOfExperience,
    description: skill.description ?? "",
    icon: skill.icon ?? "",
    color: skill.color ?? "",
    relatedSkills: skill.relatedSkills ?? [],
    certifications: skill.certifications ?? [],
    projects: skill.projects ?? [],
    lastUsed: toDateInput(skill.lastUsed),
    isVisible: skill.isVisible,
    displayOrder: skill.displayOrder,
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

function ProficiencyBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-accent"
        style={{ width: `${Math.max(1, Math.min(value, 100))}%` }}
      />
    </div>
  );
}

export default function SkillsAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(defaultFormData);
  const [arrayInput, setArrayInput] = useState<Record<ArrayField, string>>({
    relatedSkills: "",
    certifications: "",
    projects: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: skills = [],
    isLoading,
    refetch,
  } = api.skills.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.skills.getStatistics.useQuery();

  const createMutation = api.skills.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Skill created." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to create skill: ${error.message}`,
      });
    },
  });

  const updateMutation = api.skills.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Skill updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update skill: ${error.message}`,
      });
    },
  });

  const deleteMutation = api.skills.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
      setNotice({ tone: "success", message: "Skill deleted." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to delete skill: ${error.message}`,
      });
    },
  });

  const toggleVisibilityMutation = api.skills.toggleVisibility.useMutation({
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

  const updateLastUsedMutation = api.skills.updateLastUsed.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "Last-used date updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update last-used date: ${error.message}`,
      });
    },
  });

  const handleOpenDialog = (skill?: Skill) => {
    setNotice(null);
    if (skill) {
      setEditingSkill(skill);
      setFormData(skillToFormData(skill));
    } else {
      setEditingSkill(null);
      setFormData(defaultFormData);
    }
    setArrayInput({ relatedSkills: "", certifications: "", projects: "" });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSkill(null);
    setFormData(defaultFormData);
    setArrayInput({ relatedSkills: "", certifications: "", projects: "" });
  };

  const updateField = <K extends keyof SkillFormData>(
    key: K,
    value: SkillFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleProficiencyChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      proficiencyLevel: value,
      proficiencyLabel: getProficiencyLabel(value),
    }));
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
      name: formData.name,
      category: formData.category,
      subCategory: formData.subCategory || undefined,
      proficiencyLevel: formData.proficiencyLevel,
      proficiencyLabel: formData.proficiencyLabel,
      yearsOfExperience: formData.yearsOfExperience,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
      color: formData.color || undefined,
      relatedSkills: formData.relatedSkills,
      certifications: formData.certifications,
      projects: formData.projects,
      lastUsed: new Date(formData.lastUsed),
      isVisible: formData.isVisible,
      displayOrder: formData.displayOrder,
    };

    if (editingSkill) {
      updateMutation.mutate({
        id: editingSkill.id,
        data: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSubmit =
    !!formData.name &&
    !!formData.lastUsed &&
    formData.proficiencyLevel >= 1 &&
    formData.proficiencyLevel <= 100 &&
    !isSaving;

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-accent">
            CMS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Skills</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage skill categories, proficiency levels, related proof, and
            public visibility.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>Add Skill</Button>
      </div>

      <NoticeBanner notice={notice} />

      {!statsLoading && statistics ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Visible", statistics.totalVisible],
            ["Average Experience", `${statistics.averageExperience}y`],
            ["Categories", statistics.byCategory.length],
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
        <LoadingState>Loading skills</LoadingState>
      ) : skills.length === 0 ? (
        <EmptyState>No skills found.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className={
                skill.isVisible
                  ? "flex flex-col"
                  : "flex flex-col border-dashed opacity-70"
              }
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  {skill.icon ? (
                    <span className="text-xl" aria-hidden="true">
                      {skill.icon}
                    </span>
                  ) : null}
                  <Badge>{getCategoryLabel(skill.category)}</Badge>
                  <Badge tone="accent">{skill.proficiencyLabel}</Badge>
                  {!skill.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
                </div>
                <CardTitle className="pt-3">{skill.name}</CardTitle>
                {skill.subCategory ? (
                  <p className="text-sm font-medium text-accent">
                    {skill.subCategory}
                  </p>
                ) : null}
              </CardHeader>
              <CardContent className="flex-1">
                {skill.description ? (
                  <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                    {skill.description}
                  </p>
                ) : null}

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Proficiency</span>
                    <span className="font-medium">{skill.proficiencyLevel}%</span>
                  </div>
                  <ProficiencyBar value={skill.proficiencyLevel} />
                </div>

                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p>{getExperienceText(skill.yearsOfExperience)}</p>
                  <p>Last used: {formatMonth(skill.lastUsed)}</p>
                </div>

                {skill.relatedSkills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skill.relatedSkills.slice(0, 5).map((related) => (
                      <Chip key={related}>{related}</Chip>
                    ))}
                    {skill.relatedSkills.length > 5 ? (
                      <Chip>+{skill.relatedSkills.length - 5} more</Chip>
                    ) : null}
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="flex-wrap justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="quiet"
                    onClick={() =>
                      toggleVisibilityMutation.mutate({ id: skill.id })
                    }
                    disabled={toggleVisibilityMutation.isPending}
                  >
                    {skill.isVisible ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="quiet"
                    onClick={() => updateLastUsedMutation.mutate({ id: skill.id })}
                    disabled={updateLastUsedMutation.isPending}
                  >
                    Used now
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleOpenDialog(skill)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(skill.id)}
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
          <DialogTitle>{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
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
            <Field label="Icon">
              <Input
                value={formData.icon}
                onChange={(event) => updateField("icon", event.target.value)}
                maxLength={10}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <Select
                value={formData.category}
                onChange={(event) =>
                  updateField("category", event.target.value as SkillCategory)
                }
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Subcategory">
              <Input
                value={formData.subCategory}
                onChange={(event) =>
                  updateField("subCategory", event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <Field label={`Proficiency: ${formData.proficiencyLevel}% (${formData.proficiencyLabel})`}>
              <Input
                type="range"
                min={1}
                max={100}
                value={formData.proficiencyLevel}
                onChange={(event) =>
                  handleProficiencyChange(Number(event.target.value))
                }
                className="px-0 shadow-none"
              />
            </Field>
            <Field label="Years of experience">
              <Input
                type="number"
                min={0}
                max={50}
                value={formData.yearsOfExperience}
                onChange={(event) =>
                  updateField("yearsOfExperience", Number(event.target.value))
                }
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={formData.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-3">
            {(["relatedSkills", "certifications", "projects"] as const).map(
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

          <div className="grid gap-4 md:grid-cols-[1fr_160px_160px] md:items-end">
            <Field label="Last used">
              <Input
                type="date"
                value={formData.lastUsed}
                onChange={(event) => updateField("lastUsed", event.target.value)}
                required
              />
            </Field>
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
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="quiet" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving ? "Saving" : editingSkill ? "Update" : "Create"}
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
          <DialogTitle>Delete Skill</DialogTitle>
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
