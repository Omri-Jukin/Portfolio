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

interface ProjectType {
  id: string;
  key: string;
  displayName: string;
  baseRateIls: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectTypesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    displayName: "",
    baseRateIls: 9000,
    order: 0,
    isActive: true,
  });
  const [sliderValue, setSliderValue] = useState(9000);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: projectTypes = [],
    isLoading,
    refetch,
  } = api.pricing.projectTypes.getAll.useQuery({ includeInactive: true });

  const createMutation = api.pricing.projectTypes.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Project type created successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create project type",
        severity: "error",
      });
    },
  });

  const updateMutation = api.pricing.projectTypes.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Project type updated successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update project type",
        severity: "error",
      });
    },
  });

  const deleteMutation = api.pricing.projectTypes.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmId(null);
      setSnackbar({
        open: true,
        message: "Project type deleted successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete project type",
        severity: "error",
      });
    },
  });

  const toggleActiveMutation =
    api.pricing.projectTypes.toggleActive.useMutation({
      onSuccess: () => {
        void refetch();
        setSnackbar({
          open: true,
          message: "Project type status updated",
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

  const handleOpenDialog = (projectType?: ProjectType) => {
    if (projectType) {
      setEditingId(projectType.id);
      setFormData({
        key: projectType.key,
        displayName: projectType.displayName,
        baseRateIls: projectType.baseRateIls,
        order: projectType.order,
        isActive: projectType.isActive,
      });
      setSliderValue(projectType.baseRateIls);
    } else {
      setEditingId(null);
      setFormData({
        key: "",
        displayName: "",
        baseRateIls: 9000,
        order: 0,
        isActive: true,
      });
      setSliderValue(9000);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({
      key: "",
      displayName: "",
      baseRateIls: 9000,
      order: 0,
      isActive: true,
    });
    setSliderValue(9000);
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
        baseRateIls: sliderValue,
      });
    } else {
      createMutation.mutate({
        ...formData,
        baseRateIls: sliderValue,
      });
    }
  };

  const handleDuplicate = (projectType: ProjectType) => {
    setFormData({
      key: `${projectType.key}-COPY`,
      displayName: `${projectType.displayName} (Copy)`,
      baseRateIls: projectType.baseRateIls,
      order: projectType.order,
      isActive: projectType.isActive,
    });
    setSliderValue(projectType.baseRateIls);
    setEditingId(null);
    setDialogOpen(true);
  };

  const columns: GridColDef<ProjectType>[] = [
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
      field: "baseRateIls",
      headerName: "Base Rate (ILS)",
      width: 150,
      flex: 0.5,
      renderCell: (params) => {
        return params.value.toLocaleString();
      },
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

  const rows = projectTypes.map((pt) => ({
    id: pt.id,
    key: pt.key,
    displayName: pt.displayName,
    baseRateIls: pt.baseRateIls,
    order: pt.order,
    isActive: pt.isActive,
    createdAt: pt.createdAt,
    updatedAt: pt.updatedAt,
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
          Project Types
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Project Type
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
          {editingId ? "Edit Project Type" : "Create Project Type"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Key"
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value.toUpperCase() })
              }
              fullWidth
              required
              helperText="Unique identifier (e.g., WEBSITE, APP)"
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
              <Typography gutterBottom>Base Rate (ILS)</Typography>
              <Slider
                value={sliderValue}
                onChange={(_, value) => {
                  const numValue = Array.isArray(value) ? value[0] : value;
                  setSliderValue(numValue);
                  setFormData({ ...formData, baseRateIls: numValue });
                }}
                min={0}
                max={100000}
                step={1000}
                marks={[
                  { value: 0, label: "0" },
                  { value: 50000, label: "50K" },
                  { value: 100000, label: "100K" },
                ]}
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                value={sliderValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setSliderValue(value);
                  setFormData({ ...formData, baseRateIls: value });
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
            Are you sure you want to delete this project type? This action
            cannot be undone.
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
