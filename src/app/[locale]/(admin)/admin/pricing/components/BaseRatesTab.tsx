"use client";

import React, { useState, useMemo } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { api } from "$/trpc/client";
import DataGrid from "~/DataGrid/DataGrid";
import Snackbar, { type SnackbarProps } from "~/Snackbar";

interface BaseRate {
  id: string;
  projectTypeKey: string;
  clientTypeKey: string | null;
  baseRateIls: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BaseRatesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    projectTypeKey: "",
    clientTypeKey: null as string | null,
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

  const { data: pricingModel } = api.pricing.getModel.useQuery();
  const {
    data: baseRates = [],
    isLoading,
    refetch,
  } = api.pricing.baseRates.getAll.useQuery({ includeInactive: true });

  const createMutation = api.pricing.baseRates.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Base rate created successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create base rate",
        severity: "error",
      });
    },
  });

  const updateMutation = api.pricing.baseRates.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Base rate updated successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update base rate",
        severity: "error",
      });
    },
  });

  const deleteMutation = api.pricing.baseRates.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmId(null);
      setSnackbar({
        open: true,
        message: "Base rate deleted successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete base rate",
        severity: "error",
      });
    },
  });

  const toggleActiveMutation = api.pricing.baseRates.toggleActive.useMutation({
    onSuccess: () => {
      void refetch();
      setSnackbar({
        open: true,
        message: "Base rate status updated",
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

  // Get client type options from multiplier groups
  const clientTypeOptions = useMemo(() => {
    if (!pricingModel) return [];
    const clientTypeGroup = pricingModel.multiplierGroups.find(
      (g) => g.key === "clientType"
    );
    return clientTypeGroup?.options.map((o) => o.optionKey) || [];
  }, [pricingModel]);

  const projectTypeOptions = useMemo(() => {
    return pricingModel?.projectTypes.map((pt) => pt.key) || [];
  }, [pricingModel]);

  const handleOpenDialog = (baseRate?: BaseRate) => {
    if (baseRate) {
      setEditingId(baseRate.id);
      setFormData({
        projectTypeKey: baseRate.projectTypeKey,
        clientTypeKey: baseRate.clientTypeKey,
        baseRateIls: baseRate.baseRateIls,
        order: baseRate.order,
        isActive: baseRate.isActive,
      });
      setSliderValue(baseRate.baseRateIls);
    } else {
      setEditingId(null);
      setFormData({
        projectTypeKey: "",
        clientTypeKey: null,
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
      projectTypeKey: "",
      clientTypeKey: null,
      baseRateIls: 9000,
      order: 0,
      isActive: true,
    });
    setSliderValue(9000);
  };

  const handleSubmit = () => {
    if (!formData.projectTypeKey) {
      setSnackbar({
        open: true,
        message: "Project type is required",
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

  const columns: GridColDef<BaseRate>[] = [
    {
      field: "projectTypeKey",
      headerName: "Project Type",
      width: 150,
      flex: 0.5,
    },
    {
      field: "clientTypeKey",
      headerName: "Client Type",
      width: 150,
      flex: 0.5,
      renderCell: (params) => params.value || "(Default)",
    },
    {
      field: "baseRateIls",
      headerName: "Base Rate (ILS)",
      width: 150,
      flex: 0.5,
      renderCell: (params) => params.value.toLocaleString(),
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
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setDeleteConfirmId(params.row.id)}
        />,
      ],
    },
  ];

  const rows = baseRates.map((br) => ({
    id: br.id,
    projectTypeKey: br.projectTypeKey,
    clientTypeKey: br.clientTypeKey,
    baseRateIls: br.baseRateIls,
    order: br.order,
    isActive: br.isActive,
    createdAt: br.createdAt,
    updatedAt: br.updatedAt,
  }));

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6">Base Rates by Client Type</Typography>
          <Typography variant="body2" color="text.secondary">
            Override default project type rates for specific client types. Leave
            client type empty for default rates.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Base Rate
        </Button>
      </Stack>

      {!pricingModel && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Loading pricing model...
        </Alert>
      )}

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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Edit Base Rate" : "Create Base Rate"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Project Type</InputLabel>
              <Select
                value={formData.projectTypeKey}
                onChange={(e) =>
                  setFormData({ ...formData, projectTypeKey: e.target.value })
                }
                label="Project Type"
                disabled={!!editingId}
              >
                {projectTypeOptions.map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Client Type (Optional)</InputLabel>
              <Select
                value={formData.clientTypeKey || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clientTypeKey: e.target.value || null,
                  })
                }
                label="Client Type (Optional)"
              >
                <MenuItem value="">(Default - No override)</MenuItem>
                {clientTypeOptions.map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this base rate? This action cannot
            be undone.
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

