"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
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
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import DataGrid from "~/DataGrid/DataGrid";
import type { GridColDef } from "@mui/x-data-grid";

interface TemplateFormData {
  name: string;
  description: string | null;
  defaultCurrency: string;
  defaultTaxProfileKey: string | null;
  defaultPriceDisplay: "taxExclusive" | "taxInclusive";
  isActive: boolean;
  displayOrder: number;
}

const defaultFormData: TemplateFormData = {
  name: "",
  description: "",
  defaultCurrency: "ILS",
  defaultTaxProfileKey: null,
  defaultPriceDisplay: "taxExclusive",
  isActive: true,
  displayOrder: 0,
};

export default function ProposalTemplatesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: templates = [],
    isLoading,
    refetch,
  } = api.proposals.templates.getAll.useQuery();

  const { data: pricingMeta } = api.pricing.meta.getAll.useQuery();
  const taxProfiles =
    (pricingMeta?.find(
      (m: { key: string; value?: unknown }) => m.key === "tax_profiles"
    )?.value as Array<{ key: string; label: string }> | undefined) || [];

  const createMutation = api.proposals.templates.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Template created successfully",
        severity: "success",
      });
    },
    onError: (error: { message?: string }) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create template",
        severity: "error",
      });
    },
  });

  const updateMutation = api.proposals.templates.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Template updated successfully",
        severity: "success",
      });
    },
    onError: (error: { message?: string }) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update template",
        severity: "error",
      });
    },
  });

  const deleteMutation = api.proposals.templates.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmOpen(null);
      setSnackbar({
        open: true,
        message: "Template deleted successfully",
        severity: "success",
      });
    },
    onError: (error: { message?: string }) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete template",
        severity: "error",
      });
    },
  });

  const handleOpenDialog = (templateId?: string) => {
    if (templateId) {
      const template = templates.find(
        (t: { id: string; name: string }) => t.id === templateId
      );
      if (template) {
        setEditingTemplate(templateId);
        setFormData({
          name: template.name,
          description: template.description || "",
          defaultCurrency: template.defaultCurrency,
          defaultTaxProfileKey: template.defaultTaxProfileKey || null,
          defaultPriceDisplay: template.defaultPriceDisplay,
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
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Template name is required",
        severity: "error",
      });
      return;
    }

    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate,
        data: {
          ...formData,
          description: formData.description || null,
          defaultTaxProfileKey: formData.defaultTaxProfileKey || null,
        },
      });
    } else {
      createMutation.mutate({
        ...formData,
        description: formData.description || null,
        defaultTaxProfileKey: formData.defaultTaxProfileKey || null,
        templateData: {},
      });
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      valueGetter: (params: { value: string | null | undefined }) =>
        params.value || "—",
    },
    {
      field: "defaultCurrency",
      headerName: "Currency",
      width: 100,
    },
    {
      field: "defaultPriceDisplay",
      headerName: "Price Display",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={
            params.value === "taxExclusive" ? "Tax Exclusive" : "Tax Inclusive"
          }
          size="small"
          color={params.value === "taxExclusive" ? "default" : "primary"}
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Yes" : "No"}
          size="small"
          color={params.value ? "success" : "default"}
        />
      ),
    },
    {
      field: "displayOrder",
      headerName: "Order",
      width: 100,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <Tooltip key="edit" title="Edit template">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.id as string)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>,
        <Tooltip key="delete" title="Delete template">
          <IconButton
            size="small"
            onClick={() => setDeleteConfirmOpen(params.id as string)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>,
      ],
    },
  ];

  if (isLoading) {
    return (
      <ClientOnly>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={3}
        >
          <Box>
            <Typography variant="h4">Proposal Templates</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Create reusable templates for proposals with default settings
            </Typography>
          </Box>
          <Tooltip title="Create a new proposal template">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create Template
            </Button>
          </Tooltip>
        </Stack>

        {templates.length === 0 && !isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No templates found. Create your first template to get started with
            reusable proposal structures.
          </Alert>
        )}

        <DataGrid
          rows={templates}
          columns={columns}
          loading={isLoading}
          autoHeight
          showToolbar
          showQuickFilter
          defaultPageSize={10}
        />

        {/* Create/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingTemplate ? "Edit Template" : "Create Template"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Template Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                helperText="A descriptive name for this template (e.g., 'Standard Web Development')"
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={formData.defaultCurrency}
                  label="Default Currency"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultCurrency: e.target.value,
                    })
                  }
                >
                  <MenuItem value="ILS">ILS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Default Tax Profile</InputLabel>
                <Select
                  value={formData.defaultTaxProfileKey || ""}
                  label="Default Tax Profile"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultTaxProfileKey: e.target.value || null,
                    })
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {Array.isArray(taxProfiles) &&
                    taxProfiles.length > 0 &&
                    taxProfiles.map(
                      (profile: { key: string; label: string }) => (
                        <MenuItem key={profile.key} value={profile.key}>
                          {profile.label}
                        </MenuItem>
                      )
                    )}
                </Select>
                {Array.isArray(taxProfiles) && taxProfiles.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    No tax profiles available. Create tax profiles in the Tax
                    Profiles section first.
                  </Alert>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Default Price Display</InputLabel>
                <Select
                  value={formData.defaultPriceDisplay}
                  label="Default Price Display"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultPriceDisplay: e.target.value as
                        | "taxExclusive"
                        | "taxInclusive",
                    })
                  }
                >
                  <MenuItem value="taxExclusive">Tax Exclusive</MenuItem>
                  <MenuItem value="taxInclusive">Tax Inclusive</MenuItem>
                </Select>
              </FormControl>

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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingTemplate ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen !== null}
          onClose={() => setDeleteConfirmOpen(null)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
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
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </ClientOnly>
  );
}
