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
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type ProposalTemplate =
  RouterOutputs["proposals"]["templates"]["list"][number];

type TemplateFormData = {
  name: string;
  description: string;
  content: Record<string, unknown>;
  isDefault: boolean;
};

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

const defaultFormData: TemplateFormData = {
  name: "",
  description: "",
  content: {},
  isDefault: false,
};

export default function ProposalTemplatesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );
  const [templateToDelete, setTemplateToDelete] =
    useState<ProposalTemplate | null>(null);
  const [formData, setFormData] =
    useState<TemplateFormData>(defaultFormData);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: templates = [],
    isLoading,
    error,
    refetch,
  } = api.proposals.templates.list.useQuery();

  const createMutation = api.proposals.templates.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Proposal template created." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const updateMutation = api.proposals.templates.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Proposal template updated." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const deleteMutation = api.proposals.templates.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setTemplateToDelete(null);
      setNotice({ tone: "success", message: "Proposal template deleted." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openDialog = (template?: ProposalTemplate) => {
    setNotice(null);

    if (template) {
      setEditingTemplateId(template.id);
      setFormData({
        name: template.name,
        description: template.description ?? "",
        content:
          template.content && typeof template.content === "object"
            ? (template.content as Record<string, unknown>)
            : {},
        isDefault: template.isDefault,
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
      description: formData.description.trim() || null,
      content: formData.content,
      isDefault: formData.isDefault,
    };

    if (!payload.name) {
      setNotice({ tone: "destructive", message: "Template name is required." });
      return;
    }

    if (editingTemplateId) {
      updateMutation.mutate({ id: editingTemplateId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Proposal settings
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Proposal Templates
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage reusable proposal template metadata.
          </p>
        </div>
        <Button onClick={() => openDialog()}>Create Template</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      {isLoading ? <LoadingState>Loading proposal templates</LoadingState> : null}

      {!isLoading && templates.length === 0 ? (
        <EmptyState>No proposal templates found.</EmptyState>
      ) : null}

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.isDefault ? <Badge tone="accent">Default</Badge> : null}
                    <Badge>
                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </Badge>
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
        className="max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editingTemplateId ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FormField>
            <Label htmlFor="name">Name</Label>
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

          <label className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
            <Checkbox
              checked={formData.isDefault}
              onChange={(event) =>
                setFormData({ ...formData, isDefault: event.target.checked })
              }
            />
            Default template
          </label>

          <Alert>
            Template content editing is still not wired in this admin view. This
            page preserves the existing metadata-only behavior.
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
