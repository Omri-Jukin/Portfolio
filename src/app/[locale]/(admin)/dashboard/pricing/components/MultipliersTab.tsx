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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { api } from "$/trpc/client";
import DataGrid from "~/DataGrid/DataGrid";
import Snackbar, { type SnackbarProps } from "~/Snackbar";

interface MultiplierGroup {
  id: string;
  key: string;
  displayName: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MultiplierValue {
  id: string;
  groupKey: string;
  optionKey: string;
  displayName: string;
  value: number;
  order: number;
  isFixed: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MultipliersTab() {
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [valueDialogOpen, setValueDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [deleteConfirmGroupId, setDeleteConfirmGroupId] = useState<
    string | null
  >(null);
  const [deleteConfirmValueId, setDeleteConfirmValueId] = useState<
    string | null
  >(null);
  const [groupFormData, setGroupFormData] = useState({
    key: "",
    displayName: "",
    order: 30,
    isActive: true,
  });
  const [valueFormData, setValueFormData] = useState({
    optionKey: "",
    displayName: "",
    value: 1.0,
    order: 0,
    isFixed: false,
    isActive: true,
  });
  const [sliderValue, setSliderValue] = useState(1.0);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: groups = [],
    isLoading: groupsLoading,
    refetch: refetchGroups,
  } = api.pricing.multipliers.groups.getAll.useQuery({ includeInactive: true });

  const {
    data: values = [],
    isLoading: valuesLoading,
    refetch: refetchValues,
  } = api.pricing.multipliers.values.getByGroup.useQuery(
    { groupKey: selectedGroupKey || "" },
    { enabled: !!selectedGroupKey }
  );

  const createGroupMutation = api.pricing.multipliers.groups.create.useMutation(
    {
      onSuccess: () => {
        void refetchGroups();
        handleCloseGroupDialog();
        setSnackbar({
          open: true,
          message: "Multiplier group created successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to create multiplier group",
          severity: "error",
        });
      },
    }
  );

  const updateGroupMutation = api.pricing.multipliers.groups.update.useMutation(
    {
      onSuccess: () => {
        void refetchGroups();
        handleCloseGroupDialog();
        setSnackbar({
          open: true,
          message: "Multiplier group updated successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to update multiplier group",
          severity: "error",
        });
      },
    }
  );

  const deleteGroupMutation = api.pricing.multipliers.groups.delete.useMutation(
    {
      onSuccess: () => {
        void refetchGroups();
        setDeleteConfirmGroupId(null);
        setSelectedGroupKey(null);
        setSnackbar({
          open: true,
          message: "Multiplier group deleted successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to delete multiplier group",
          severity: "error",
        });
      },
    }
  );

  const createValueMutation = api.pricing.multipliers.values.create.useMutation(
    {
      onSuccess: () => {
        void refetchValues();
        handleCloseValueDialog();
        setSnackbar({
          open: true,
          message: "Multiplier value created successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to create multiplier value",
          severity: "error",
        });
      },
    }
  );

  const updateValueMutation = api.pricing.multipliers.values.update.useMutation(
    {
      onSuccess: () => {
        void refetchValues();
        handleCloseValueDialog();
        setSnackbar({
          open: true,
          message: "Multiplier value updated successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to update multiplier value",
          severity: "error",
        });
      },
    }
  );

  const deleteValueMutation = api.pricing.multipliers.values.delete.useMutation(
    {
      onSuccess: () => {
        void refetchValues();
        setDeleteConfirmValueId(null);
        setSnackbar({
          open: true,
          message: "Multiplier value deleted successfully",
          severity: "success",
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to delete multiplier value",
          severity: "error",
        });
      },
    }
  );

  const handleOpenGroupDialog = (group?: MultiplierGroup) => {
    if (group) {
      setEditingGroupId(group.id);
      setGroupFormData({
        key: group.key,
        displayName: group.displayName,
        order: group.order,
        isActive: group.isActive,
      });
    } else {
      setEditingGroupId(null);
      setGroupFormData({
        key: "",
        displayName: "",
        order: 30,
        isActive: true,
      });
    }
    setGroupDialogOpen(true);
  };

  const handleCloseGroupDialog = () => {
    setGroupDialogOpen(false);
    setEditingGroupId(null);
    setGroupFormData({
      key: "",
      displayName: "",
      order: 30,
      isActive: true,
    });
  };

  const handleOpenValueDialog = (value?: MultiplierValue) => {
    if (!selectedGroupKey) {
      setSnackbar({
        open: true,
        message: "Please select a multiplier group first",
        severity: "warning",
      });
      return;
    }

    if (value) {
      setEditingValueId(value.id);
      setValueFormData({
        optionKey: value.optionKey,
        displayName: value.displayName,
        value: value.value,
        order: value.order,
        isFixed: value.isFixed,
        isActive: value.isActive,
      });
      setSliderValue(value.value);
    } else {
      setEditingValueId(null);
      setValueFormData({
        optionKey: "",
        displayName: "",
        value: 1.0,
        order: 0,
        isFixed: false,
        isActive: true,
      });
      setSliderValue(1.0);
    }
    setValueDialogOpen(true);
  };

  const handleCloseValueDialog = () => {
    setValueDialogOpen(false);
    setEditingValueId(null);
    setValueFormData({
      optionKey: "",
      displayName: "",
      value: 1.0,
      order: 0,
      isFixed: false,
      isActive: true,
    });
    setSliderValue(1.0);
  };

  const handleGroupSubmit = () => {
    if (!groupFormData.key || !groupFormData.displayName) {
      setSnackbar({
        open: true,
        message: "Key and display name are required",
        severity: "error",
      });
      return;
    }

    if (editingGroupId) {
      updateGroupMutation.mutate({
        id: editingGroupId,
        ...groupFormData,
      });
    } else {
      createGroupMutation.mutate(groupFormData);
    }
  };

  const handleValueSubmit = () => {
    if (
      !valueFormData.optionKey ||
      !valueFormData.displayName ||
      !selectedGroupKey
    ) {
      setSnackbar({
        open: true,
        message: "Option key, display name, and group are required",
        severity: "error",
      });
      return;
    }

    if (editingValueId) {
      updateValueMutation.mutate({
        id: editingValueId,
        ...valueFormData,
        value: sliderValue,
      });
    } else {
      createValueMutation.mutate({
        groupKey: selectedGroupKey,
        ...valueFormData,
        value: sliderValue,
      });
    }
  };

  const groupColumns: GridColDef<MultiplierGroup>[] = [
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
        <Switch checked={params.value} size="small" disabled />
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
          onClick={() => handleOpenGroupDialog(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setDeleteConfirmGroupId(params.row.id)}
        />,
      ],
    },
  ];

  const valueColumns: GridColDef<MultiplierValue>[] = [
    {
      field: "optionKey",
      headerName: "Option Key",
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
      field: "value",
      headerName: "Value",
      width: 120,
      flex: 0.4,
      renderCell: (params) => params.value.toFixed(3),
    },
    {
      field: "isFixed",
      headerName: "Fixed",
      width: 100,
      flex: 0.3,
      renderCell: (params) =>
        params.value ? <Chip label="Fixed" size="small" /> : "-",
    },
    {
      field: "order",
      headerName: "Order",
      width: 100,
      flex: 0.3,
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
          onClick={() => handleOpenValueDialog(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setDeleteConfirmValueId(params.row.id)}
        />,
      ],
    },
  ];

  const groupRows = groups.map((g) => ({
    id: g.id,
    key: g.key,
    displayName: g.displayName,
    order: g.order,
    isActive: g.isActive,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  }));

  const valueRows = values.map((v) => ({
    id: v.id,
    groupKey: v.groupKey,
    optionKey: v.optionKey,
    displayName: v.displayName,
    value: v.value,
    order: v.order,
    isFixed: v.isFixed,
    isActive: v.isActive,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));

  const selectedGroup = groups.find((g) => g.key === selectedGroupKey);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" color="text.primary">
          Multipliers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenGroupDialog()}
        >
          New Multiplier Group
        </Button>
      </Stack>

      {/* Groups Table */}
      <Box sx={{ mb: 3 }}>
        <DataGrid
          rows={groupRows}
          columns={groupColumns}
          loading={groupsLoading}
          autoHeight
          showToolbar
          showQuickFilter
          defaultPageSize={10}
          onRowClick={(params) => {
            setSelectedGroupKey(
              selectedGroupKey === params.row.key ? null : params.row.key
            );
          }}
          getRowClassName={(params) =>
            selectedGroupKey === params.row.key ? "selected-row" : ""
          }
        />
      </Box>

      {/* Values for Selected Group */}
      {selectedGroupKey && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%", pr: 2 }}
            >
              <Typography variant="h6" color="text.primary">
                Options for: {selectedGroup?.displayName}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenValueDialog();
                }}
                size="small"
                color="primary"
              >
                <AddCircleIcon />
              </IconButton>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <DataGrid
              rows={valueRows}
              columns={valueColumns}
              loading={valuesLoading}
              autoHeight
              showToolbar
              showQuickFilter
              defaultPageSize={10}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* Group Create/Edit Dialog */}
      <Dialog
        open={groupDialogOpen}
        onClose={handleCloseGroupDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingGroupId ? "Edit Multiplier Group" : "Create Multiplier Group"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Key"
              value={groupFormData.key}
              onChange={(e) =>
                setGroupFormData({
                  ...groupFormData,
                  key: e.target.value.toLowerCase(),
                })
              }
              fullWidth
              required
              helperText="Unique identifier (e.g., complexity, timeline, region)"
              disabled={!!editingGroupId}
            />
            <TextField
              label="Display Name"
              value={groupFormData.displayName}
              onChange={(e) =>
                setGroupFormData({
                  ...groupFormData,
                  displayName: e.target.value,
                })
              }
              fullWidth
              required
            />
            <TextField
              label="Order"
              type="number"
              value={groupFormData.order}
              onChange={(e) =>
                setGroupFormData({
                  ...groupFormData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={groupFormData.isActive}
                  onChange={(e) =>
                    setGroupFormData({
                      ...groupFormData,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGroupDialog}>Cancel</Button>
          <Button
            onClick={handleGroupSubmit}
            variant="contained"
            disabled={
              createGroupMutation.isPending || updateGroupMutation.isPending
            }
          >
            {editingGroupId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Value Create/Edit Dialog */}
      <Dialog
        open={valueDialogOpen}
        onClose={handleCloseValueDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingValueId ? "Edit Multiplier Value" : "Create Multiplier Value"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              Group: {selectedGroup?.displayName || selectedGroupKey}
            </Alert>
            <TextField
              label="Option Key"
              value={valueFormData.optionKey}
              onChange={(e) =>
                setValueFormData({
                  ...valueFormData,
                  optionKey: e.target.value.toLowerCase(),
                })
              }
              fullWidth
              required
              helperText="Unique identifier within group (e.g., simple, moderate, complex)"
              disabled={!!editingValueId}
            />
            <TextField
              label="Display Name"
              value={valueFormData.displayName}
              onChange={(e) =>
                setValueFormData({
                  ...valueFormData,
                  displayName: e.target.value,
                })
              }
              fullWidth
              required
            />
            <Box>
              <Typography gutterBottom>Multiplier Value</Typography>
              <Slider
                value={sliderValue}
                onChange={(_, value) => {
                  const numValue = Array.isArray(value) ? value[0] : value;
                  setSliderValue(numValue);
                  setValueFormData({ ...valueFormData, value: numValue });
                }}
                min={0.1}
                max={5.0}
                step={0.1}
                marks={[
                  { value: 0.1, label: "0.1" },
                  { value: 1.0, label: "1.0" },
                  { value: 2.5, label: "2.5" },
                  { value: 5.0, label: "5.0" },
                ]}
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                value={sliderValue}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 1.0;
                  setSliderValue(value);
                  setValueFormData({ ...valueFormData, value });
                }}
                fullWidth
                inputProps={{ min: 0.1, max: 5.0, step: 0.1 }}
              />
            </Box>
            <TextField
              label="Order"
              type="number"
              value={valueFormData.order}
              onChange={(e) =>
                setValueFormData({
                  ...valueFormData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={valueFormData.isFixed}
                  onChange={(e) =>
                    setValueFormData({
                      ...valueFormData,
                      isFixed: e.target.checked,
                    })
                  }
                />
              }
              label="Fixed (cannot be changed in UI)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={valueFormData.isActive}
                  onChange={(e) =>
                    setValueFormData({
                      ...valueFormData,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseValueDialog}>Cancel</Button>
          <Button
            onClick={handleValueSubmit}
            variant="contained"
            disabled={
              createValueMutation.isPending || updateValueMutation.isPending
            }
          >
            {editingValueId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmations */}
      <Dialog
        open={!!deleteConfirmGroupId}
        onClose={() => setDeleteConfirmGroupId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this multiplier group? This will
            also delete all its values. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmGroupId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirmGroupId) {
                deleteGroupMutation.mutate({ id: deleteConfirmGroupId });
              }
            }}
            variant="contained"
            color="error"
            disabled={deleteGroupMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteConfirmValueId}
        onClose={() => setDeleteConfirmValueId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this multiplier value? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmValueId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirmValueId) {
                deleteValueMutation.mutate({ id: deleteConfirmValueId });
              }
            }}
            variant="contained"
            color="error"
            disabled={deleteValueMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar {...snackbar} />
    </>
  );
}
