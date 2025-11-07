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
  Stack,
  Slider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { api } from "$/trpc/client";
import Snackbar, { type SnackbarProps } from "~/Snackbar";

interface MetaSetting {
  id: string;
  key: string;
  value?: unknown;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MetaTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const { data: pricingModel } = api.pricing.getModel.useQuery();
  const {
    data: metaSettings = [],
    isLoading,
    refetch,
  } = api.pricing.meta.getAll.useQuery({ includeInactive: true });

  const updateMutation = api.pricing.meta.update.useMutation({
    onSuccess: () => {
      void refetch();
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Meta setting updated successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update meta setting",
        severity: "error",
      });
    },
  });

  const [formData, setFormData] = useState<{
    pageCostPerPage?: number;
    rangePercent?: number;
    defaultCurrency?: string;
    projectMinimums?: Record<string, number>;
  }>({});

  const handleOpenDialog = (setting: MetaSetting) => {
    setEditingKey(setting.key);
    const value = (setting.value || {}) as Record<string, unknown>;

    if (setting.key === "pageCostPerPage") {
      setFormData({
        pageCostPerPage: (value.value as number) || 750,
      });
    } else if (setting.key === "rangePercent") {
      setFormData({
        rangePercent: (value.value as number) || 0.18,
      });
    } else if (setting.key === "defaultCurrency") {
      setFormData({
        defaultCurrency: (value.value as string) || "ILS",
      });
    } else if (setting.key === "projectMinimums") {
      setFormData({
        projectMinimums: (value as Record<string, number>) || {},
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingKey(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (!editingKey) return;

    let value: unknown;

    if (editingKey === "pageCostPerPage") {
      value = { value: formData.pageCostPerPage || 750 };
    } else if (editingKey === "rangePercent") {
      value = { value: formData.rangePercent || 0.18 };
    } else if (editingKey === "defaultCurrency") {
      value = { value: formData.defaultCurrency || "ILS" };
    } else if (editingKey === "projectMinimums") {
      value = formData.projectMinimums || {};
    } else {
      return;
    }

    updateMutation.mutate({
      key: editingKey,
      value,
    });
  };

  const getDisplayValue = (setting: MetaSetting): string => {
    if (!setting.value) return "";
    const value = setting.value as Record<string, unknown>;
    if (setting.key === "pageCostPerPage" || setting.key === "rangePercent") {
      return String(value.value || "");
    } else if (setting.key === "defaultCurrency") {
      return String(value.value || "");
    } else if (setting.key === "projectMinimums") {
      return Object.entries(value as Record<string, number>)
        .map(([k, v]) => `${k}: ${v.toLocaleString()}`)
        .join(", ");
    }
    return JSON.stringify(value);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom color="text.primary">
        Meta Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure global pricing settings like page cost, range percentage, and
        default currency.
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          Loading...
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.primary" }}>Key</TableCell>
                <TableCell sx={{ color: "text.primary" }}>Value</TableCell>
                <TableCell sx={{ color: "text.primary" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metaSettings.map((setting: MetaSetting) => (
                <TableRow key={setting.id}>
                  <TableCell sx={{ color: "text.primary" }}>
                    {setting.key}
                  </TableCell>
                  <TableCell sx={{ color: "text.primary" }}>
                    {getDisplayValue(setting)}
                  </TableCell>
                  <TableCell sx={{ color: "text.primary" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(setting)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Meta Setting: {editingKey}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {editingKey === "pageCostPerPage" && (
              <>
                <Typography gutterBottom>Page Cost Per Page (ILS)</Typography>
                <Slider
                  value={formData.pageCostPerPage || 750}
                  onChange={(_, value) => {
                    const numValue = Array.isArray(value) ? value[0] : value;
                    setFormData({ ...formData, pageCostPerPage: numValue });
                  }}
                  min={0}
                  max={5000}
                  step={50}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 2500, label: "2.5K" },
                    { value: 5000, label: "5K" },
                  ]}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  label="Page Cost Per Page"
                  value={formData.pageCostPerPage || 750}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pageCostPerPage: parseInt(e.target.value) || 750,
                    })
                  }
                  fullWidth
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₪</Typography>,
                  }}
                />
              </>
            )}

            {editingKey === "rangePercent" && (
              <>
                <Typography gutterBottom>Range Percent</Typography>
                <Slider
                  value={(formData.rangePercent || 0.18) * 100}
                  onChange={(_, value) => {
                    const numValue = Array.isArray(value) ? value[0] : value;
                    setFormData({
                      ...formData,
                      rangePercent: numValue / 100,
                    });
                  }}
                  min={5}
                  max={30}
                  step={1}
                  marks={[
                    { value: 5, label: "5%" },
                    { value: 15, label: "15%" },
                    { value: 30, label: "30%" },
                  ]}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  label="Range Percent"
                  value={((formData.rangePercent || 0.18) * 100).toFixed(1)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rangePercent: parseFloat(e.target.value) / 100 || 0.18,
                    })
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                  }}
                />
              </>
            )}

            {editingKey === "defaultCurrency" && (
              <FormControl fullWidth>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={formData.defaultCurrency || "ILS"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultCurrency: e.target.value,
                    })
                  }
                  label="Default Currency"
                >
                  <MenuItem value="ILS">ILS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            )}

            {editingKey === "projectMinimums" && (
              <Box>
                <Typography gutterBottom>Project Minimums (ILS)</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Set minimum prices per project type. Leave empty to remove a
                  minimum.
                </Alert>
                {pricingModel?.projectTypes.map((pt) => (
                  <TextField
                    key={pt.key}
                    label={`${pt.displayName} Minimum`}
                    type="number"
                    value={
                      formData.projectMinimums?.[pt.key]?.toLocaleString() || ""
                    }
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        projectMinimums: {
                          ...formData.projectMinimums,
                          [pt.key]: value || 0,
                        },
                      });
                    }}
                    fullWidth
                    sx={{ mb: 2 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>₪</Typography>
                        ),
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={updateMutation.isPending}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar {...snackbar} />
    </>
  );
}
