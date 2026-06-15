"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  Label,
  LoadingState,
  Select,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";
import type { IntakeFormData } from "#/lib/schemas";
import { INTAKE_FORM_DEFAULTS } from "$/intake/formDefaults";

const TEMPLATE_CATEGORIES = [
  "ecommerce",
  "portfolio",
  "corporate",
  "blog",
  "landing",
  "webapp",
] as const;

type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];
type IntakeTemplate = RouterOutputs["intakes"]["templates"]["getAll"][number];

type TemplateFormData = {
  name: string;
  description: string;
  category: TemplateCategory;
  templateData: IntakeFormData;
  isActive: boolean;
  displayOrder: number;
};

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

const defaultFormData: TemplateFormData = {
  name: "",
  description: "",
  category: "portfolio",
  templateData: INTAKE_FORM_DEFAULTS,
  isActive: true,
  displayOrder: 0,
};

function categoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function IntakeTemplatesAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );
  const [templateToDelete, setTemplateToDelete] =
    useState<IntakeTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>(defaultFormData);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: templates = [],
    isLoading,
    error,
    refetch,
  } = api.intakes.templates.getAll.useQuery({ includeInactive: true });

  const createMutation = api.intakes.templates.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Intake template created." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const updateMutation = api.intakes.templates.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Intake template updated." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const deleteMutation = api.intakes.templates.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setTemplateToDelete(null);
      setNotice({ tone: "success", message: "Intake template deleted." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openDialog = (template?: IntakeTemplate) => {
    setNotice(null);

    if (template) {
      setEditingTemplateId(template.id);
      setFormData({
        name: template.name,
        description: template.description ?? "",
        category: (template.category as TemplateCategory) || "portfolio",
        templateData: template.templateData as IntakeFormData,
        isActive: template.isActive,
        displayOrder: template.displayOrder,
      });
    } else {
      setEditingTemplateId(null);
      setFormData(defaultFormData);
    }

    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTemplateId(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      isActive: formData.isActive,
      displayOrder: formData.displayOrder,
    };

    if (!payload.name) {
      setNotice({ tone: "destructive", message: "Template name is required." });
      return;
    }

    if (editingTemplateId) {
      updateMutation.mutate({ id: editingTemplateId, ...payload });
    } else {
      createMutation.mutate({
        ...payload,
        templateData: formData.templateData,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Freelance tooling
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Intake Templates
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage reusable defaults for private client intake links.
          </p>
        </div>
        <Button onClick={() => openDialog()}>Create Template</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      {isLoading ? <LoadingState>Loading intake templates</LoadingState> : null}

      {!isLoading && templates.length === 0 ? (
        <EmptyState>
          No templates found. Create your first template to get started.
        </EmptyState>
      ) : null}

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone="accent">{categoryLabel(template.category)}</Badge>
                    <Badge tone={template.isActive ? "success" : "default"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge>Order {template.displayOrder}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => setTemplateToDelete(template)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            {template.description ? (
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {template.description}
                </p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editingTemplateId ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FormField>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </FormField>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    category: event.target.value as TemplateCategory,
                  })
                }
              >
                {TEMPLATE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
            <Checkbox
              checked={formData.isActive}
              onChange={(event) =>
                setFormData({ ...formData, isActive: event.target.checked })
              }
            />
            Active
          </label>

          <Alert>
            Template data editing is still not wired in this admin view. New
            templates use the existing default intake shape; existing templates
            keep their stored template data.
          </Alert>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="quiet" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || isSaving}
            >
              {isSaving
                ? "Saving..."
                : editingTemplateId
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={templateToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setTemplateToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Template</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete{" "}
          <span className="font-medium text-foreground">
            {templateToDelete?.name}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setTemplateToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (templateToDelete) {
                deleteMutation.mutate({ id: templateToDelete.id });
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
