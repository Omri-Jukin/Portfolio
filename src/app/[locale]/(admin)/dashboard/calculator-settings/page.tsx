"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { api } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import DataGrid from "~/DataGrid/DataGrid";

const SETTING_TYPES = ["base_rate", "feature_cost", "multiplier"] as const;
type SettingType = (typeof SETTING_TYPES)[number];

interface SettingFormData {
  settingType: SettingType;
  settingKey: string;
  settingValue: number | Record<string, number>;
  displayName: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
}

const defaultFormData: SettingFormData = {
  settingType: "base_rate",
  settingKey: "",
  settingValue: 0,
  displayName: "",
  description: "",
  isActive: true,
  displayOrder: 0,
};

export default function CalculatorSettingsAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [formData, setFormData] = useState<SettingFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [valueInput, setValueInput] = useState<string>("");

  const {
    data: settingsData,
    isLoading,
    refetch,
  } = api.intakes.calculatorSettings.getAll.useQuery({ includeInactive: true });

  interface CalculatorSetting {
    id: string;
    settingType: SettingType;
    settingKey: string;
    settingValue: number | Record<string, number>;
    displayName: string;
    description?: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  const settings = useMemo(
    (): CalculatorSetting[] => (settingsData as CalculatorSetting[]) ?? [],
    [settingsData]
  );

  const createMutation = api.intakes.calculatorSettings.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
    },
  });

  const updateMutation = api.intakes.calculatorSettings.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
    },
  });

  const deleteMutation = api.intakes.calculatorSettings.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmOpen(null);
    },
  });

  const groupedSettings = useMemo(() => {
    const groups: Record<string, CalculatorSetting[]> = {
      base_rate: [],
      feature_cost: [],
      multiplier: [],
    };
    settings.forEach((setting: CalculatorSetting) => {
      if (setting && groups[setting.settingType]) {
        groups[setting.settingType].push(setting);
      }
    });
    return groups;
  }, [settings]);

  const createColumns = (): GridColDef[] => [
    {
      field: "settingKey",
      headerName: "Key",
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontFamily="monospace">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "displayName",
      headerName: "Display Name",
      width: 200,
      flex: 1,
    },
    {
      field: "settingValue",
      headerName: "Value",
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">{formatValue(params.value)}</Typography>
      ),
    },
    {
      field: "displayOrder",
      headerName: "Order",
      width: 100,
      type: "number",
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 120,
      type: "boolean",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          size="small"
          color={params.value ? "success" : "default"}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpenDialog(params.row.id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setDeleteConfirmOpen(params.row.id)}
          showInMenu
        />,
      ],
    },
  ];

  const handleOpenDialog = (settingId?: string) => {
    if (settingId) {
      const setting = settings.find((s: { id: string }) => s.id === settingId);
      if (setting) {
        setEditingSetting(settingId);
        const value = setting.settingValue as number | Record<string, number>;
        setFormData({
          settingType: setting.settingType as SettingType,
          settingKey: setting.settingKey,
          settingValue: value,
          displayName: setting.displayName,
          description: setting.description || "",
          isActive: setting.isActive,
          displayOrder: setting.displayOrder,
        });
        setValueInput(
          typeof value === "number"
            ? value.toString()
            : JSON.stringify(value, null, 2)
        );
      }
    } else {
      setEditingSetting(null);
      setFormData(defaultFormData);
      setValueInput("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSetting(null);
    setFormData(defaultFormData);
    setValueInput("");
  };

  const handleSubmit = () => {
    let parsedValue: number | Record<string, number>;
    try {
      if (formData.settingType === "multiplier") {
        // Multipliers can be objects (e.g., { simple: 1.0, moderate: 1.5 })
        parsedValue =
          valueInput.trim().startsWith("{") || valueInput.trim().startsWith("[")
            ? JSON.parse(valueInput)
            : parseFloat(valueInput) || 0;
      } else {
        // Base rates and feature costs are usually numbers
        parsedValue =
          valueInput.trim().startsWith("{") || valueInput.trim().startsWith("[")
            ? JSON.parse(valueInput)
            : parseFloat(valueInput) || 0;
      }
    } catch {
      parsedValue = parseFloat(valueInput) || 0;
    }

    const submitData = {
      ...formData,
      settingValue: parsedValue,
    };

    if (editingSetting) {
      updateMutation.mutate({
        id: editingSetting,
        ...submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4">Calculator Settings</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Setting
          </Button>
        </Stack>

        {settings.length === 0 ? (
          <Alert severity="info">
            No calculator settings found. Create settings to configure the cost
            calculator.
          </Alert>
        ) : (
          <Stack spacing={3}>
            {SETTING_TYPES.map((type) => {
              const typeSettings = groupedSettings[type];
              if (typeSettings.length === 0) return null;

              const columns = createColumns();
              const rows = typeSettings.map((setting) => ({
                id: setting.id,
                settingKey: setting.settingKey,
                displayName: setting.displayName,
                settingValue: setting.settingValue,
                displayOrder: setting.displayOrder,
                isActive: setting.isActive,
              }));

              return (
                <Card key={type}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {type === "base_rate"
                        ? "Base Rates"
                        : type === "feature_cost"
                        ? "Feature Costs"
                        : "Multipliers"}
                    </Typography>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      loading={isLoading}
                      autoHeight
                      showToolbar
                      showQuickFilter
                      defaultPageSize={10}
                    />
                  </CardContent>
                </Card>
              );
            })}
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
            {editingSetting ? "Edit Setting" : "Create Setting"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Setting Type</InputLabel>
                <Select
                  value={formData.settingType}
                  label="Setting Type"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settingType: e.target.value as SettingType,
                    })
                  }
                >
                  <MenuItem value="base_rate">Base Rate</MenuItem>
                  <MenuItem value="feature_cost">Feature Cost</MenuItem>
                  <MenuItem value="multiplier">Multiplier</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Setting Key"
                fullWidth
                required
                value={formData.settingKey}
                onChange={(e) =>
                  setFormData({ ...formData, settingKey: e.target.value })
                }
                helperText="Unique identifier (e.g., 'website', 'cms', 'simple')"
              />
              <TextField
                label="Display Name"
                fullWidth
                required
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />
              <TextField
                label="Value"
                fullWidth
                required
                multiline
                rows={formData.settingType === "multiplier" ? 4 : 1}
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                helperText={
                  formData.settingType === "multiplier"
                    ? 'Enter a number or JSON object (e.g., {"simple": 1.0, "moderate": 1.5})'
                    : "Enter a number"
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                !formData.settingKey ||
                !formData.displayName ||
                !valueInput ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {editingSetting ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={deleteConfirmOpen !== null}
          onClose={() => setDeleteConfirmOpen(null)}
        >
          <DialogTitle>Delete Setting</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this calculator setting? This
              action cannot be undone.
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
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
}
