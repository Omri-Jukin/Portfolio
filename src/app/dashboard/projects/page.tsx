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

type Project = RouterOutputs["projects"]["getAllAdmin"][number];

type ProjectStatus = "completed" | "in-progress" | "archived" | "concept";
type ProjectType = "professional" | "personal" | "open-source" | "academic";
type ArrayField =
  | "technologies"
  | "categories"
  | "keyFeatures"
  | "constraints"
  | "decisions"
  | "images";

type ProjectFormData = {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: string[];
  categories: string[];
  status: ProjectStatus;
  projectType: ProjectType;
  startDate: string;
  endDate: string;
  githubUrl: string;
  liveUrl: string;
  demoUrl: string;
  documentationUrl: string;
  images: string[];
  keyFeatures: string[];
  technicalChallengesJson: string;
  codeExamplesJson: string;
  teamSize: number;
  myRole: string;
  clientName: string;
  budget: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  isOpenSource: boolean;
  isResumeFeatured: boolean;
  caseStudySlug: string;
  hiringSignal: string;
  constraints: string[];
  decisions: string[];
  outcome: string;
  caseStudyRole: string;
  proofLinksJson: string;
  privateRepoNote: string;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

type ProofLink = {
  label: string;
  href: string;
  description?: string;
};

type TechnicalChallengeInput = {
  challenge: string;
  solution: string;
};

type CodeExampleInput = {
  title: string;
  language: string;
  code: string;
  explanation: string;
};

const today = new Date().toISOString().split("T")[0] ?? "";

const defaultFormData: ProjectFormData = {
  title: "",
  subtitle: "",
  description: "",
  longDescription: "",
  technologies: [],
  categories: [],
  status: "completed",
  projectType: "professional",
  startDate: today,
  endDate: "",
  githubUrl: "",
  liveUrl: "",
  demoUrl: "",
  documentationUrl: "",
  images: [],
  keyFeatures: [],
  technicalChallengesJson: "[]",
  codeExamplesJson: "[]",
  teamSize: 1,
  myRole: "",
  clientName: "",
  budget: "",
  displayOrder: 0,
  isVisible: true,
  isFeatured: false,
  isOpenSource: false,
  isResumeFeatured: false,
  caseStudySlug: "",
  hiringSignal: "",
  constraints: [],
  decisions: [],
  outcome: "",
  caseStudyRole: "",
  proofLinksJson: "[]",
  privateRepoNote: "",
};

const statusOptions: Array<{ value: ProjectStatus; label: string }> = [
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "archived", label: "Archived" },
  { value: "concept", label: "Concept" },
];

const projectTypeOptions: Array<{ value: ProjectType; label: string }> = [
  { value: "professional", label: "Professional" },
  { value: "personal", label: "Personal" },
  { value: "open-source", label: "Open Source" },
  { value: "academic", label: "Academic" },
];

const arrayFieldLabels: Record<ArrayField, string> = {
  technologies: "Technologies",
  categories: "Categories",
  keyFeatures: "Key features",
  constraints: "Case-study constraints",
  decisions: "Case-study decisions",
  images: "Images",
};

function toDateInput(value: string | Date | null) {
  if (!value) return "";
  return format(new Date(value), "yyyy-MM-dd");
}

function formatMonth(value: string | Date) {
  return format(new Date(value), "MMM yyyy");
}

function toJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseJsonArray<T>(value: string, label: string): T[] {
  const parsed = JSON.parse(value || "[]") as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array.`);
  }
  return parsed as T[];
}

function projectToFormData(project: Project): ProjectFormData {
  return {
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    longDescription: project.longDescription ?? "",
    technologies: project.technologies,
    categories: project.categories,
    status: project.status as ProjectStatus,
    projectType: project.projectType as ProjectType,
    startDate: toDateInput(project.startDate),
    endDate: toDateInput(project.endDate),
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    documentationUrl: project.documentationUrl ?? "",
    images: project.images,
    keyFeatures: project.keyFeatures,
    technicalChallengesJson: toJson(
      project.technicalChallenges.map((challenge) => ({
        challenge: challenge.problem || challenge.title,
        solution: challenge.solution,
      }))
    ),
    codeExamplesJson: toJson(
      project.codeExamples.map((example) => ({
        title: example.title,
        language: example.language,
        code: example.code,
        explanation: example.explanation,
      }))
    ),
    teamSize: project.teamSize ?? 1,
    myRole: project.myRole ?? "",
    clientName: project.clientName ?? "",
    budget: project.budget ?? "",
    displayOrder: project.displayOrder,
    isVisible: project.isVisible,
    isFeatured: project.isFeatured,
    isOpenSource: project.isOpenSource,
    isResumeFeatured: project.isResumeFeatured,
    caseStudySlug: project.caseStudySlug ?? "",
    hiringSignal: project.hiringSignal ?? "",
    constraints: project.constraints,
    decisions: project.decisions,
    outcome: project.outcome ?? "",
    caseStudyRole: project.caseStudyRole ?? "",
    proofLinksJson: toJson(project.proofLinks),
    privateRepoNote: project.privateRepoNote ?? "",
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
    <label className="grid min-w-0 gap-1.5">
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

export default function ProjectsAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [arrayInput, setArrayInput] = useState<Record<ArrayField, string>>({
    technologies: "",
    categories: "",
    keyFeatures: "",
    constraints: "",
    decisions: "",
    images: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: projects = [],
    isLoading,
    refetch,
  } = api.projects.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.projects.getStatistics.useQuery();

  const createMutation = api.projects.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Project created." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to create project: ${error.message}`,
      });
    },
  });

  const updateMutation = api.projects.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setNotice({ tone: "success", message: "Project updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update project: ${error.message}`,
      });
    },
  });

  const deleteMutation = api.projects.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
      setNotice({ tone: "success", message: "Project deleted." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to delete project: ${error.message}`,
      });
    },
  });

  const toggleVisibilityMutation = api.projects.toggleVisibility.useMutation({
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

  const toggleFeaturedMutation = api.projects.toggleFeatured.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "Homepage feature updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update homepage feature: ${error.message}`,
      });
    },
  });

  const toggleResumeFeaturedMutation =
    api.projects.toggleResumeFeatured.useMutation({
      onSuccess: () => {
        refetch();
        setNotice({ tone: "success", message: "PDF inclusion updated." });
      },
      onError: (error) => {
        setNotice({
          tone: "error",
          message: `Failed to update PDF inclusion: ${error.message}`,
        });
      },
    });

  const handleOpenDialog = (project?: Project) => {
    setNotice(null);
    if (project) {
      setEditingProject(project);
      setFormData(projectToFormData(project));
    } else {
      setEditingProject(null);
      setFormData(defaultFormData);
    }
    setArrayInput({
      technologies: "",
      categories: "",
      keyFeatures: "",
      constraints: "",
      decisions: "",
      images: "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    setFormData(defaultFormData);
  };

  const updateField = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K]
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
    let proofLinks: ProofLink[];
    let technicalChallenges: TechnicalChallengeInput[];
    let codeExamples: CodeExampleInput[];

    try {
      proofLinks = parseJsonArray<ProofLink>(
        formData.proofLinksJson,
        "Proof links"
      );
      technicalChallenges = parseJsonArray<TechnicalChallengeInput>(
        formData.technicalChallengesJson,
        "Technical challenges"
      );
      codeExamples = parseJsonArray<CodeExampleInput>(
        formData.codeExamplesJson,
        "Code examples"
      );
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Invalid JSON field value.",
      });
      return;
    }

    const submitData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      longDescription: formData.longDescription || undefined,
      technologies: formData.technologies,
      categories: formData.categories,
      status: formData.status,
      projectType: formData.projectType,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      demoUrl: formData.demoUrl,
      documentationUrl: formData.documentationUrl,
      images: formData.images,
      keyFeatures: formData.keyFeatures,
      technicalChallenges,
      codeExamples,
      teamSize: formData.teamSize || undefined,
      myRole: formData.myRole || undefined,
      clientName: formData.clientName || undefined,
      budget: formData.budget || undefined,
      displayOrder: formData.displayOrder,
      isVisible: formData.isVisible,
      isFeatured: formData.isFeatured,
      isOpenSource: formData.isOpenSource,
      isResumeFeatured: formData.isResumeFeatured,
      caseStudySlug: formData.caseStudySlug,
      hiringSignal: formData.hiringSignal,
      constraints: formData.constraints,
      decisions: formData.decisions,
      outcome: formData.outcome,
      caseStudyRole: formData.caseStudyRole,
      proofLinks,
      privateRepoNote: formData.privateRepoNote,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSubmit =
    !!formData.title &&
    !!formData.subtitle &&
    !!formData.description &&
    !!formData.startDate &&
    formData.technologies.length > 0 &&
    formData.categories.length > 0 &&
    formData.keyFeatures.length > 0 &&
    !isSaving;

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-accent">
            CMS
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Projects
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage portfolio projects, case-study content, public visibility,
            homepage featuring, and resume PDF inclusion.
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => handleOpenDialog()}>
          Add Project
        </Button>
      </div>

      <NoticeBanner notice={notice} />

      {!statsLoading && statistics ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Visible", statistics.totalVisible],
            ["Featured", statistics.totalFeatured],
            ["Open Source", statistics.totalOpenSource],
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
        <LoadingState>Loading projects</LoadingState>
      ) : projects.length === 0 ? (
        <EmptyState>No projects found.</EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={
                project.isVisible
                  ? "flex flex-col"
                  : "flex flex-col border-dashed opacity-70"
              }
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{project.status}</Badge>
                  <Badge>{project.projectType}</Badge>
                  {project.isFeatured ? <Badge tone="success">Home</Badge> : null}
                  {project.isResumeFeatured ? (
                    <Badge tone="success">PDF</Badge>
                  ) : null}
                  {!project.isVisible ? <Badge tone="warning">Hidden</Badge> : null}
                </div>
                <CardTitle className="pt-3">{project.title}</CardTitle>
                <p className="text-sm font-medium text-accent">
                  {project.caseStudySlug
                    ? `/projects/${project.caseStudySlug}`
                    : `/projects/${project.id}`}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {project.hiringSignal || project.subtitle || project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 8).map((technology) => (
                    <Chip key={technology}>{technology}</Chip>
                  ))}
                  {project.technologies.length > 8 ? (
                    <Chip>+{project.technologies.length - 8} more</Chip>
                  ) : null}
                </div>
                <div className="mt-4 grid gap-1 text-sm text-muted-foreground">
                  <p>
                    {formatMonth(project.startDate)}
                    {project.endDate ? ` - ${formatMonth(project.endDate)}` : ""}
                  </p>
                  {project.outcome ? <p>{project.outcome}</p> : null}
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="grid gap-2 sm:flex sm:flex-wrap">
                  <Button
                    variant="quiet"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      toggleVisibilityMutation.mutate({ id: project.id })
                    }
                    disabled={toggleVisibilityMutation.isPending}
                  >
                    {project.isVisible ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="quiet"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      toggleFeaturedMutation.mutate({ id: project.id })
                    }
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    {project.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    variant="quiet"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      toggleResumeFeaturedMutation.mutate({ id: project.id })
                    }
                    disabled={toggleResumeFeaturedMutation.isPending}
                  >
                    {project.isResumeFeatured ? "Remove PDF" : "PDF"}
                  </Button>
                </div>
                <div className="grid gap-2 sm:flex">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleOpenDialog(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => setDeleteConfirmOpen(project.id)}
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
        className="max-w-5xl p-0"
      >
        <DialogHeader className="mb-0 border-b border-border p-4 sm:p-6">
          <DialogTitle className="text-lg sm:text-xl">
            {editingProject ? "Edit Project" : "Add Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid max-h-[calc(100dvh-8rem)] min-w-0 gap-5 overflow-y-auto overflow-x-hidden px-4 py-5 sm:max-h-[75vh] sm:px-6">
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <Field label="Title">
              <Input
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </Field>
            <Field label="Subtitle">
              <Input
                value={formData.subtitle}
                onChange={(event) => updateField("subtitle", event.target.value)}
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

          <Field label="Long description">
            <Textarea
              value={formData.longDescription}
              onChange={(event) =>
                updateField("longDescription", event.target.value)
              }
            />
          </Field>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(event) =>
                  updateField("status", event.target.value as ProjectStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Project type">
              <Select
                value={formData.projectType}
                onChange={(event) =>
                  updateField("projectType", event.target.value as ProjectType)
                }
              >
                {projectTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Start date">
              <Input
                type="date"
                value={formData.startDate}
                onChange={(event) =>
                  updateField("startDate", event.target.value)
                }
                required
              />
            </Field>
            <Field label="End date">
              <Input
                type="date"
                value={formData.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
              />
            </Field>
          </div>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="GitHub URL">
              <Input
                value={formData.githubUrl}
                onChange={(event) =>
                  updateField("githubUrl", event.target.value)
                }
              />
            </Field>
            <Field label="Live URL">
              <Input
                value={formData.liveUrl}
                onChange={(event) => updateField("liveUrl", event.target.value)}
              />
            </Field>
            <Field label="Demo URL">
              <Input
                value={formData.demoUrl}
                onChange={(event) => updateField("demoUrl", event.target.value)}
              />
            </Field>
            <Field label="Docs URL">
              <Input
                value={formData.documentationUrl}
                onChange={(event) =>
                  updateField("documentationUrl", event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Team size">
              <Input
                type="number"
                min={1}
                value={formData.teamSize}
                onChange={(event) =>
                  updateField("teamSize", Number(event.target.value))
                }
              />
            </Field>
            <Field label="My role">
              <Input
                value={formData.myRole}
                onChange={(event) => updateField("myRole", event.target.value)}
              />
            </Field>
            <Field label="Client">
              <Input
                value={formData.clientName}
                onChange={(event) =>
                  updateField("clientName", event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <Field label="Budget">
              <Input
                value={formData.budget}
                onChange={(event) => updateField("budget", event.target.value)}
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
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            {(["technologies", "categories", "keyFeatures", "images"] as const).map(
              (field) => (
                <ArrayEditor
                  key={field}
                  field={field}
                  items={formData[field]}
                  inputValue={arrayInput[field]}
                  setInputValue={(value) =>
                    setArrayInput((prev) => ({ ...prev, [field]: value }))
                  }
                  addItem={() => handleAddArrayItem(field)}
                  updateItem={(currentValue, nextValue) =>
                    handleUpdateArrayItem(field, currentValue, nextValue)
                  }
                  removeItem={(item) => handleRemoveArrayItem(field, item)}
                />
              )
            )}
          </div>

          <div className="min-w-0 rounded-md border border-border p-4">
            <h2 className="font-display text-lg font-semibold">
              Case study and PDF signals
            </h2>
            <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
              <Field label="Case-study slug">
                <Input
                  value={formData.caseStudySlug}
                  onChange={(event) =>
                    updateField("caseStudySlug", event.target.value)
                  }
                  placeholder="portfolio-rewrite"
                />
              </Field>
              <Field label="Case-study role">
                <Input
                  value={formData.caseStudyRole}
                  onChange={(event) =>
                    updateField("caseStudyRole", event.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Hiring signal">
              <Textarea
                value={formData.hiringSignal}
                onChange={(event) =>
                  updateField("hiringSignal", event.target.value)
                }
              />
            </Field>
            <Field label="Outcome">
              <Textarea
                value={formData.outcome}
                onChange={(event) => updateField("outcome", event.target.value)}
              />
            </Field>
            <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
              {(["constraints", "decisions"] as const).map((field) => (
                <ArrayEditor
                  key={field}
                  field={field}
                  items={formData[field]}
                  inputValue={arrayInput[field]}
                  setInputValue={(value) =>
                    setArrayInput((prev) => ({ ...prev, [field]: value }))
                  }
                  addItem={() => handleAddArrayItem(field)}
                  updateItem={(currentValue, nextValue) =>
                    handleUpdateArrayItem(field, currentValue, nextValue)
                  }
                  removeItem={(item) => handleRemoveArrayItem(field, item)}
                />
              ))}
            </div>
            <Field label="Private repo note">
              <Textarea
                value={formData.privateRepoNote}
                onChange={(event) =>
                  updateField("privateRepoNote", event.target.value)
                }
              />
            </Field>
            <Field label="Proof links JSON">
              <Textarea
                value={formData.proofLinksJson}
                onChange={(event) =>
                  updateField("proofLinksJson", event.target.value)
                }
                className="min-h-32 font-mono text-xs"
              />
            </Field>
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <Field label="Technical challenges JSON">
              <Textarea
                value={formData.technicalChallengesJson}
                onChange={(event) =>
                  updateField("technicalChallengesJson", event.target.value)
                }
                className="min-h-36 font-mono text-xs"
              />
            </Field>
            <Field label="Code examples JSON">
              <Textarea
                value={formData.codeExamplesJson}
                onChange={(event) =>
                  updateField("codeExamplesJson", event.target.value)
                }
                className="min-h-36 font-mono text-xs"
              />
            </Field>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["isVisible", "Visible"],
              ["isFeatured", "Homepage featured"],
              ["isResumeFeatured", "Resume PDF"],
              ["isOpenSource", "Open source"],
            ].map(([field, label]) => (
              <label
                key={field}
                className="inline-flex min-w-0 items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={Boolean(formData[field as keyof ProjectFormData])}
                  onChange={(event) =>
                    updateField(
                      field as keyof ProjectFormData,
                      event.target.checked as never
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <div className="sticky bottom-0 -mx-4 -mb-5 grid gap-2 border-t border-border bg-popover p-4 sm:-mx-6 sm:-mb-5 sm:flex sm:justify-end">
            <Button className="w-full sm:w-auto" variant="quiet" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving ? "Saving" : editingProject ? "Update" : "Create"}
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
          <DialogTitle>Delete Project</DialogTitle>
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

function ArrayEditor({
  field,
  items,
  inputValue,
  setInputValue,
  addItem,
  updateItem,
  removeItem,
}: {
  field: ArrayField;
  items: string[];
  inputValue: string;
  setInputValue: (value: string) => void;
  addItem: () => void;
  updateItem: (currentValue: string, nextValue: string) => void;
  removeItem: (item: string) => void;
}) {
  return (
    <EditableChipList
      label={arrayFieldLabels[field]}
      items={items}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onAdd={addItem}
      onUpdate={updateItem}
      onRemove={removeItem}
    />
  );
}
