"use client";

import React, { useState } from "react";
import {
  Typography,
  Button,
  Switch,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { api } from "$/trpc/client";
import DataGrid from "~/DataGrid/DataGrid";
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import DiscountForm from "./DiscountForm";
import type { RouterOutputs } from "$/trpc/client";

type Discount = RouterOutputs["discounts"]["getAll"][0];

export default function DiscountTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: discounts = [],
    isLoading,
    refetch,
  } = api.discounts.getAll.useQuery({ includeInactive: true });

  const toggleActiveMutation = api.discounts.toggleActive.useMutation({
    onSuccess: () => {
      void refetch();
      setSnackbar({
        open: true,
        message: "Discount status updated",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update discount",
        severity: "error",
      });
    },
  });

  const deleteMutation = api.discounts.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmId(null);
      setSnackbar({
        open: true,
        message: "Discount deleted successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete discount",
        severity: "error",
      });
    },
  });

  const handleOpenDialog = (discount?: Discount) => {
    setEditingDiscount(discount || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDiscount(null);
  };

  const handleSuccess = () => {
    void refetch();
    setSnackbar({
      open: true,
      message: editingDiscount
        ? "Discount updated successfully"
        : "Discount created successfully",
      severity: "success",
    });
  };

  const formatScope = (appliesTo: Discount["appliesTo"]): string => {
    const parts: string[] = [];
    if (appliesTo.projectTypes?.length) {
      parts.push(`Projects: ${appliesTo.projectTypes.join(", ")}`);
    }
    if (appliesTo.features?.length) {
      parts.push(`Features: ${appliesTo.features.join(", ")}`);
    }
    if (appliesTo.clientTypes?.length) {
      parts.push(`Clients: ${appliesTo.clientTypes.join(", ")}`);
    }
    if (appliesTo.excludeClientTypes?.length) {
      parts.push(`Exclude: ${appliesTo.excludeClientTypes.join(", ")}`);
    }
    return parts.length > 0 ? parts.join(" | ") : "All";
  };

  const formatDateRange = (
    startsAt: string | null,
    endsAt: string | null
  ): string => {
    if (!startsAt && !endsAt) return "No limit";
    if (startsAt && endsAt) {
      return `${new Date(startsAt).toLocaleDateString()} - ${new Date(
        endsAt
      ).toLocaleDateString()}`;
    }
    if (startsAt) return `From ${new Date(startsAt).toLocaleDateString()}`;
    if (endsAt) return `Until ${new Date(endsAt).toLocaleDateString()}`;
    return "No limit";
  };

  const formatUsage = (usedCount: number, maxUses: number | null): string => {
    if (maxUses === null) return `${usedCount} uses`;
    return `${usedCount} / ${maxUses}`;
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(discounts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `discounts-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef<Discount>[] = [
    {
      field: "code",
      headerName: "Code",
      width: 150,
      flex: 0.5,
    },
    {
      field: "discountType",
      headerName: "Type",
      width: 100,
      flex: 0.3,
      renderCell: (params) => (
        <Chip
          label={params.value === "percent" ? "%" : "Fixed"}
          size="small"
          color={params.value === "percent" ? "primary" : "secondary"}
        />
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      flex: 0.4,
      renderCell: (params) => {
        const discount = params.row;
        if (discount.discountType === "percent") {
          return `${params.value}%`;
        }
        return `${params.value} ${discount.currency}`;
      },
    },
    {
      field: "appliesTo",
      headerName: "Scope",
      width: 300,
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
          {formatScope(params.value)}
        </Typography>
      ),
    },
    {
      field: "usage",
      headerName: "Usage",
      width: 120,
      flex: 0.4,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatUsage(params.row.usedCount, params.row.maxUses)}
        </Typography>
      ),
    },
    {
      field: "dateRange",
      headerName: "Valid Period",
      width: 200,
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
          {formatDateRange(params.row.startsAt, params.row.endsAt)}
        </Typography>
      ),
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

  const rows = discounts.map((d) => ({
    id: d.id,
    code: d.code,
    discountType: d.discountType,
    amount: d.amount,
    currency: d.currency,
    appliesTo: d.appliesTo,
    usedCount: d.usedCount,
    maxUses: d.maxUses,
    startsAt: d.startsAt,
    endsAt: d.endsAt,
    isActive: d.isActive,
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
          Discounts
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Discount
          </Button>
        </Stack>
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

      <DiscountForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        discount={editingDiscount}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Discount</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this discount? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirmId) {
                deleteMutation.mutate({ id: deleteConfirmId });
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
    </>
  );
}
