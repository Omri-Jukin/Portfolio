"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Slider,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
} from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { api } from "$/trpc/client";
import DataGrid from "~/DataGrid/DataGrid";
import Snackbar, { type SnackbarProps } from "~/Snackbar";

interface Feature {
  id: string;
  key: string;
  displayName: string;
  defaultCostIls: number;
  group: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FeaturesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    displayName: "",
    defaultCostIls: 6000,
    group: "",
    order: 20,
    isActive: true,
  });
  const [sliderValue, setSliderValue] = useState(6000);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: features = [],
    isLoading,
    refetch,
  } = api.pricing.features.getAll.useQuery({ includeInactive: true });

  const createMutation = api.pricing.features.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Feature created successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create feature",
        severity: "error",
      });
    },
  });

  const updateMutation = api.pricing.features.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Feature updated successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update feature",
        severity: "error",
      });
    },
  });

  const deleteMutation = api.pricing.features.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmId(null);
      setSnackbar({
        open: true,
        message: "Feature deleted successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete feature",
        severity: "error",
      });
    },
  });

  const toggleActiveMutation = api.pricing.features.toggleActive.useMutation({
    onSuccess: () => {
      void refetch();
      setSnackbar({
        open: true,
        message: "Feature status updated",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update status",
        severity: "error",
      });
    },
  });

  const handleOpenDialog = (feature?: Feature) => {
    if (feature) {
      setEditingId(feature.id);
      setFormData({
        key: feature.key,
        displayName: feature.displayName,
        defaultCostIls: feature.defaultCostIls,
        group: feature.group || "",
        order: feature.order,
        isActive: feature.isActive,
      });
      setSliderValue(feature.defaultCostIls);
    } else {
      setEditingId(null);
      setFormData({
        key: "",
        displayName: "",
        defaultCostIls: 6000,
        group: "",
        order: 20,
        isActive: true,
      });
      setSliderValue(6000);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({
      key: "",
      displayName: "",
      defaultCostIls: 6000,
      group: "",
      order: 20,
      isActive: true,
    });
    setSliderValue(6000);
  };

  const handleSubmit = () => {
    if (!formData.key || !formData.displayName) {
      setSnackbar({
        open: true,
        message: "Key and display name are required",
        severity: "error",
      });
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
        group: formData.group || null,
        defaultCostIls: sliderValue,
      });
    } else {
      createMutation.mutate({
        ...formData,
        group: formData.group || null,
        defaultCostIls: sliderValue,
      });
    }
  };

  const handleDuplicate = (feature: Feature) => {
    setFormData({
      key: `${feature.key}-COPY`,
      displayName: `${feature.displayName} (Copy)`,
      defaultCostIls: feature.defaultCostIls,
      group: feature.group || "",
      order: feature.order,
      isActive: feature.isActive,
    });
    setSliderValue(feature.defaultCostIls);
    setEditingId(null);
    setDialogOpen(true);
  };

  const columns: GridColDef<Feature>[] = [
    {
      field: "key",
      headerName: "Key",
      width: 150,
      flex: 0.5,
    },
    {
      field: "displayName",
      headerName: "Display Name",
      width: 200,
      flex: 1,
    },
    {
      field: "defaultCostIls",
      headerName: "Cost (ILS)",
      width: 150,
      flex: 0.5,
      renderCell: (params) => params.value.toLocaleString(),
    },
    {
      field: "group",
      headerName: "Group",
      width: 150,
      flex: 0.5,
      renderCell: (params) => params.value || "-",
    },
    {
      field: "order",
      headerName: "Order",
      width: 100,
      flex: 0.3,
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      flex: 0.3,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={(e) => {
            e.stopPropagation();
            toggleActiveMutation.mutate({
              id: params.row.id,
              isActive: e.target.checked,
            });
          }}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      flex: 0.5,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpenDialog(params.row)}
        />,
        <GridActionsCellItem
          key="duplicate"
          icon={<DuplicateIcon />}
          label="Duplicate"
          onClick={() => handleDuplicate(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setDeleteConfirmId(params.row.id)}
        />,
      ],
    },
  ];

  const rows = features.map((f) => ({
    id: f.id,
    key: f.key,
    displayName: f.displayName,
    defaultCostIls: f.defaultCostIls,
    group: f.group,
    order: f.order,
    isActive: f.isActive,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  }));

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" color="text.primary">
          Features
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Feature
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edit Feature" : "Create Feature"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Key"
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value.toLowerCase() })
              }
              fullWidth
              required
              helperText="Unique identifier (e.g., cms, auth, payment)"
              disabled={!!editingId}
            />
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              fullWidth
              required
            />
            <Box>
              <Typography gutterBottom>Default Cost (ILS)</Typography>
              <Slider
                value={sliderValue}
                onChange={(_, value) => {
                  const numValue = Array.isArray(value) ? value[0] : value;
                  setSliderValue(numValue);
                  setFormData({ ...formData, defaultCostIls: numValue });
                }}
                min={0}
                max={50000}
                step={500}
                marks={[
                  { value: 0, label: "0" },
                  { value: 25000, label: "25K" },
                  { value: 50000, label: "50K" },
                ]}
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                value={sliderValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setSliderValue(value);
                  setFormData({ ...formData, defaultCostIls: value });
                }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₪</InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              label="Group (Optional)"
              value={formData.group}
              onChange={(e) =>
                setFormData({ ...formData, group: e.target.value })
              }
              fullWidth
              helperText="Optional grouping for features (e.g., 'integrations', 'security')"
            />
            <TextField
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this feature? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirmId) {
                deleteMutation.mutate({ id: deleteConfirmId });
              }
            }}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar {...snackbar} />
    </>
  );
}
