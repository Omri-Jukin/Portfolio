"use client";

import React, { useState, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import type { TaxProfile, TaxLine } from "$/pricing/calcProposalTotals";

interface TaxProfileFormData {
  key: string;
  label: string;
  lines: TaxLine[];
}

const defaultFormData: TaxProfileFormData = {
  key: "",
  label: "",
  lines: [],
};

export default function TaxProfilesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaxProfileFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: pricingMeta,
    isLoading,
    refetch,
  } = api.pricing.meta.getAll.useQuery({
    includeInactive: true,
  });

  const taxProfilesMeta = pricingMeta?.find(
    (m: { key: string; value?: unknown }) => m.key === "tax_profiles"
  );
  const taxProfiles: TaxProfile[] = useMemo(() => {
    if (!taxProfilesMeta?.value) return [];
    return Array.isArray(taxProfilesMeta.value)
      ? (taxProfilesMeta.value as TaxProfile[])
      : [];
  }, [taxProfilesMeta]);

  const updateMutation = api.pricing.meta.upsert.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Tax profile saved successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to save tax profile",
        severity: "error",
      });
    },
  });

  const handleOpenDialog = (profileKey?: string) => {
    if (profileKey) {
      const profile = taxProfiles.find((p) => p.key === profileKey);
      if (profile) {
        setEditingProfile(profileKey);
        setFormData({
          key: profile.key,
          label: profile.label,
          lines: [...profile.lines],
        });
      }
    } else {
      setEditingProfile(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProfile(null);
    setFormData(defaultFormData);
  };

  const handleAddTaxLine = () => {
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        {
          label: "",
          kind: "vat",
          type: "percent",
          value: 0,
          orderIndex: formData.lines.length,
        },
      ],
    });
  };

  const handleUpdateTaxLine = (
    index: number,
    field: keyof TaxLine,
    value: unknown
  ) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setFormData({ ...formData, lines: newLines });
  };

  const handleRemoveTaxLine = (index: number) => {
    const newLines = formData.lines.filter((_, i) => i !== index);
    // Reorder indices
    newLines.forEach((line, i) => {
      line.orderIndex = i;
    });
    setFormData({ ...formData, lines: newLines });
  };

  const handleMoveTaxLine = (index: number, direction: "up" | "down") => {
    const newLines = [...formData.lines];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLines.length) return;

    [newLines[index], newLines[targetIndex]] = [
      newLines[targetIndex],
      newLines[index],
    ];
    // Update order indices
    newLines.forEach((line, i) => {
      line.orderIndex = i;
    });
    setFormData({ ...formData, lines: newLines });
  };

  const handleSubmit = () => {
    if (!formData.key.trim() || !formData.label.trim()) {
      setSnackbar({
        open: true,
        message: "Key and label are required",
        severity: "error",
      });
      return;
    }

    // Check for duplicate key (if creating new)
    if (!editingProfile && taxProfiles.some((p) => p.key === formData.key)) {
      setSnackbar({
        open: true,
        message: "A tax profile with this key already exists",
        severity: "error",
      });
      return;
    }

    // Validate tax lines
    for (const line of formData.lines) {
      if (!line.label.trim()) {
        setSnackbar({
          open: true,
          message: "All tax lines must have a label",
          severity: "error",
        });
        return;
      }
      if (line.value <= 0) {
        setSnackbar({
          open: true,
          message: "Tax rate/amount must be greater than 0",
          severity: "error",
        });
        return;
      }
    }

    const updatedProfiles = editingProfile
      ? taxProfiles.map((p) =>
          p.key === editingProfile
            ? {
                key: formData.key,
                label: formData.label,
                lines: formData.lines,
              }
            : p
        )
      : [
          ...taxProfiles,
          { key: formData.key, label: formData.label, lines: formData.lines },
        ];

    updateMutation.mutate({
      key: "tax_profiles",
      value: updatedProfiles,
      order: 0,
      isActive: true,
    });
  };

  const handleDelete = (profileKey: string) => {
    const updatedProfiles = taxProfiles.filter((p) => p.key !== profileKey);
    updateMutation.mutate({
      key: "tax_profiles",
      value: updatedProfiles,
      order: 0,
      isActive: true,
    });
    setDeleteConfirmOpen(null);
  };

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
            <Typography variant="h4">Tax Profiles</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage tax profiles used in proposals (VAT, surcharge,
              withholding)
            </Typography>
          </Box>
          <Tooltip title="Create a new tax profile">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create Tax Profile
            </Button>
          </Tooltip>
        </Stack>

        {taxProfiles.length === 0 ? (
          <Alert severity="info">
            No tax profiles found. Create your first tax profile to get started.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {taxProfiles.map((profile) => (
              <Card key={profile.key}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box>
                      <Typography variant="h6">{profile.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Key: <code>{profile.key}</code>
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit tax profile">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(profile.key)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete tax profile">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirmOpen(profile.key)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {profile.lines.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Order</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Kind</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Rate/Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profile.lines
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((line, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{line.orderIndex}</TableCell>
                                <TableCell>{line.label}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={line.kind}
                                    size="small"
                                    color={
                                      line.kind === "vat"
                                        ? "primary"
                                        : line.kind === "surcharge"
                                        ? "warning"
                                        : "error"
                                    }
                                  />
                                </TableCell>
                                <TableCell>{line.type}</TableCell>
                                <TableCell>
                                  {line.type === "percent"
                                    ? `${line.value}%`
                                    : line.value}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tax lines configured
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Create/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingProfile ? "Edit Tax Profile" : "Create Tax Profile"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Profile Key"
                fullWidth
                required
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                disabled={!!editingProfile}
                helperText="Unique identifier (e.g., IL_VAT_17)"
              />

              <TextField
                label="Profile Label"
                fullWidth
                required
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                helperText="Display name (e.g., Israel VAT 17%)"
              />

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">Tax Lines</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddTaxLine}
                    size="small"
                  >
                    Add Tax Line
                  </Button>
                </Stack>

                {formData.lines.length === 0 ? (
                  <Alert severity="info">
                    No tax lines. Add at least one tax line.
                  </Alert>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width={60}>Order</TableCell>
                          <TableCell>Label</TableCell>
                          <TableCell width={120}>Kind</TableCell>
                          <TableCell width={100}>Type</TableCell>
                          <TableCell width={120}>Rate/Amount</TableCell>
                          <TableCell width={100}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.lines.map((line, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Move up">
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleMoveTaxLine(index, "up")
                                      }
                                      disabled={index === 0}
                                    >
                                      <ArrowUpIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Move down">
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleMoveTaxLine(index, "down")
                                      }
                                      disabled={
                                        index === formData.lines.length - 1
                                      }
                                    >
                                      <ArrowDownIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={line.label}
                                onChange={(e) =>
                                  handleUpdateTaxLine(
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., VAT"
                              />
                            </TableCell>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={line.kind}
                                  onChange={(e) =>
                                    handleUpdateTaxLine(
                                      index,
                                      "kind",
                                      e.target.value
                                    )
                                  }
                                >
                                  <MenuItem value="vat">VAT</MenuItem>
                                  <MenuItem value="surcharge">
                                    Surcharge
                                  </MenuItem>
                                  <MenuItem value="withholding">
                                    Withholding
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={line.type}
                                  onChange={(e) =>
                                    handleUpdateTaxLine(
                                      index,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                >
                                  <MenuItem value="percent">Percent</MenuItem>
                                  <MenuItem value="fixed">Fixed</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                value={line.value}
                                onChange={(e) =>
                                  handleUpdateTaxLine(
                                    index,
                                    "value",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Remove tax line">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveTaxLine(index)}
                                  color="error"
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={updateMutation.isPending || formData.lines.length === 0}
            >
              {editingProfile ? "Update" : "Create"}
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
              Are you sure you want to delete this tax profile? This action
              cannot be undone. Proposals using this profile will need to be
              updated.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (deleteConfirmOpen) {
                  handleDelete(deleteConfirmOpen);
                }
              }}
              color="error"
              variant="contained"
              disabled={updateMutation.isPending}
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
