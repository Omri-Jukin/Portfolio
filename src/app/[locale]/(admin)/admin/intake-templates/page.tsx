"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import type { IntakeFormData } from "#/lib/schemas";
import { INTAKE_FORM_DEFAULTS } from "@/app/[locale]/(public)/intake/page.const";

const TEMPLATE_CATEGORIES = [
  "ecommerce",
  "portfolio",
  "corporate",
  "blog",
  "landing",
  "webapp",
] as const;

type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

interface TemplateFormData {
  name: string;
  description: string | null;
  category: TemplateCategory;
  templateData: IntakeFormData;
  isActive: boolean;
  displayOrder: number;
}

// Type for template from API (includes id and timestamps)
type TemplateFromAPI = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  templateData?: unknown;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

const defaultFormData: TemplateFormData = {
  name: "",
  description: "",
  category: "portfolio",
  templateData: INTAKE_FORM_DEFAULTS,
  isActive: true,
  displayOrder: 0,
};

export default function IntakeTemplatesAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );

  const {
    data: templates = [],
    isLoading,
    refetch,
  } = api.intakes.templates.getAll.useQuery({ includeInactive: true });

  const createMutation = api.intakes.templates.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
    },
  });

  const updateMutation = api.intakes.templates.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
    },
  });

  const deleteMutation = api.intakes.templates.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmOpen(null);
    },
  });

  const handleOpenDialog = (templateId?: string) => {
    if (templateId) {
      const template = templates.find(
        (t: TemplateFromAPI) => t.id === templateId
      ) as TemplateFromAPI | undefined;
      if (template) {
        setEditingTemplate(templateId);
        setFormData({
          name: template.name,
          description: template.description ?? "",
          category: (template.category as TemplateCategory) || "portfolio",
          templateData: template.templateData as unknown as IntakeFormData,
          isActive: template.isActive,
          displayOrder: template.displayOrder,
        });
      }
    } else {
      setEditingTemplate(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTemplate(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = () => {
    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate,
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        isActive: formData.isActive,
        displayOrder: formData.displayOrder,
        // Note: templateData editing is not supported in UI yet
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        templateData: formData.templateData,
        isActive: formData.isActive,
        displayOrder: formData.displayOrder,
      });
    }
  };

  if (isLoading) {
    return (
      <ClientOnly skeleton>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4">Intake Templates</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Template
          </Button>
        </Stack>

        {templates.length === 0 ? (
          <Alert severity="info">
            No templates found. Create your first template to get started.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {templates.map((template: TemplateFromAPI) => (
              <Card key={template.id}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6">{template.name}</Typography>
                        <Chip
                          label={template.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {!template.isActive && (
                          <Chip label="Inactive" size="small" color="default" />
                        )}
                      </Stack>
                      {template.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {template.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Display Order: {template.displayOrder}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(template.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirmOpen(template.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Create/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingTemplate ? "Edit Template" : "Create Template"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Template Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as TemplateCategory,
                    })
                  }
                >
                  {TEMPLATE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Display Order"
                type="number"
                fullWidth
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
              <Alert severity="info">
                Template data editing will be available in a future update. For
                now, templates must be created programmatically or via the seed
                script.
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                !formData.name ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {editingTemplate ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={deleteConfirmOpen !== null}
          onClose={() => setDeleteConfirmOpen(null)}
        >
          <DialogTitle>Delete Template</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (deleteConfirmOpen) {
                  deleteMutation.mutate({ id: deleteConfirmOpen });
                }
              }}
              variant="contained"
              color="error"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
}
