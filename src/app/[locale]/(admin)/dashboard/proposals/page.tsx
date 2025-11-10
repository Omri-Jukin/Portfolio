"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tooltip,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  FileCopy as FileCopyIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import DataGrid from "~/DataGrid/DataGrid";
import { ClientOnly } from "~/ClientOnly";
import { formatMoney } from "$/pricing/calcProposalTotals";
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import type { Proposal } from "$/db/schema/schema.tables";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { ProposalStatus } from "#/lib/db/schema/schema.types";
import type { RouterOutputs } from "$/trpc/client";

const statusColors: Record<
  string,
  "default" | "primary" | "success" | "error" | "warning"
> = {
  draft: "default",
  sent: "primary",
  accepted: "success",
  declined: "error",
  expired: "warning",
  revised: "default",
};

type IntakeListItem = RouterOutputs["intakes"]["getAll"][0];

function CreateFromIntakeDialogContent({
  onSelectIntake,
}: {
  onSelectIntake: (intakeId: string) => void;
}) {
  const { data: intakes, isLoading } = api.intakes.getAll.useQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!intakes || intakes.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No intakes available. Create an intake first.
      </Alert>
    );
  }

  const typedIntakes: IntakeListItem[] = intakes;

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {typedIntakes.map((intake) => (
            <TableRow key={intake.id} hover>
              <TableCell>{intake.email}</TableCell>
              <TableCell>{intake.name || "Unknown"}</TableCell>
              <TableCell>
                {intake.createdAt
                  ? format(new Date(intake.createdAt), "MMM d, yyyy")
                  : "—"}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onSelectIntake(intake.id)}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ProposalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";

  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data: proposals,
    isLoading,
    error,
    refetch,
  } = api.proposals.getAll.useQuery();

  const deleteMutation = api.proposals.delete.useMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Proposal deleted successfully",
        severity: "success",
      });
      void refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete proposal",
        severity: "error",
      });
    },
  });

  const duplicateMutation = api.proposals.duplicate.useMutation({
    onSuccess: (proposal) => {
      setSnackbar({
        open: true,
        message: "Proposal duplicated successfully",
        severity: "success",
      });
      router.push(`/${locale}/dashboard/proposals/${proposal.id}`);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to duplicate proposal",
        severity: "error",
      });
    },
  });

  const generateTokenMutation = api.proposals.generateShareToken.useMutation({
    onSuccess: (result) => {
      navigator.clipboard.writeText(
        `${window.location.origin}/${locale}/p/${result.token}`
      );
      setSnackbar({
        open: true,
        message: "Share link copied to clipboard",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to generate share token",
        severity: "error",
      });
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<string | null>(null);
  const [createFromIntakeDialogOpen, setCreateFromIntakeDialogOpen] =
    useState(false);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const handleDelete = (id: string) => {
    setProposalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (proposalToDelete) {
      deleteMutation.mutate({ id: proposalToDelete });
      setDeleteDialogOpen(false);
      setProposalToDelete(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  const handleGenerateShareToken = (id: string) => {
    generateTokenMutation.mutate({ id });
  };

  const handleRowClick = (params: GridRowParams<Proposal>) => {
    router.push(`/${locale}/dashboard/proposals/${params.row.id}`);
  };

  // Calculate totals for display (simplified - would need full calculation)
  const getTotalDisplay = (proposal: {
    currency: string;
    pricingSnapshot?: unknown;
  }) => {
    if (
      proposal.pricingSnapshot &&
      typeof proposal.pricingSnapshot === "object"
    ) {
      const snapshot = proposal.pricingSnapshot as { grandTotalMinor?: number };
      if (snapshot.grandTotalMinor) {
        return formatMoney(snapshot.grandTotalMinor, proposal.currency);
      }
    }
    return "—";
  };

  const handleSelectProposal = (id: string) => {
    if (selectedProposals.includes(id)) {
      setSelectedProposals((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedProposals((prev) => [...prev, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedProposals.length === 0) return;
    for (const proposalId of selectedProposals) {
      deleteMutation.mutate({ id: proposalId });
    }
    setSelectedProposals([]);
  };

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "Select",
      width: 50,
      renderCell: (params: GridRenderCellParams<Proposal, "select">) => (
        <Checkbox
          size="small"
          checked={selectedProposals.includes(params.row.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectProposal(params.row.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      field: "clientName",
      headerName: "Client",
      width: 200,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams<Proposal, "status">) => (
        <Chip
          label={params.value}
          color={statusColors[params.value as ProposalStatus] || "default"}
          size="small"
        />
      ),
    },
    {
      field: "total",
      headerName: "Total (incl. tax)",
      width: 150,
      renderCell: (params: { row: Proposal }) => {
        const total = getTotalDisplay(params.row);
        return (
          <Tooltip title="Tax breakdown available in proposal details">
            <Typography variant="body2">{total}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      renderCell: (params: GridRenderCellParams<Proposal, "createdAt">) =>
        params.value
          ? format(new Date(params.value as string), "MMM d, yyyy")
          : "—",
    },
    {
      field: "validUntil",
      headerName: "Valid Until",
      width: 150,
      renderCell: (params: GridRenderCellParams<Proposal, "validUntil">) =>
        params.value
          ? format(new Date(params.value as string), "MMM d, yyyy")
          : "—",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Proposal, "id">) => (
        <Box
          sx={{ display: "flex", gap: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${locale}/dashboard/proposals/${params.row.id}`);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${locale}/dashboard/proposals/${params.row.id}`);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(params.row.id);
              }}
            >
              <FileCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Generate Share Link">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerateShareToken(params.row.id);
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row.id);
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  type ProposalListItem = RouterOutputs["proposals"]["getAll"][0];

  const rows =
    proposals?.map((p: ProposalListItem) => ({
      id: p.id,
      clientName: p.clientName,
      status: p.status,
      total: getTotalDisplay(p),
      createdAt: new Date(p.createdAt),
      validUntil: p.validUntil ? new Date(p.validUntil) : null,
      currency: p.currency,
      pricingSnapshot: p.pricingSnapshot,
    })) || [];

  if (isLoading) {
    return (
      <ClientOnly>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  if (error) {
    return (
      <ClientOnly>
        <Alert severity="error" sx={{ m: 2 }}>
          {error.message || "Failed to load proposals"}
        </Alert>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" color="text.primary">
            Proposals
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {selectedProposals.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteSelected()}
              >
                Delete {selectedProposals.length}{" "}
                {selectedProposals.length === 1 ? "Proposal" : "Proposals"}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setCreateFromIntakeDialogOpen(true)}
            >
              Create from Intake
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push(`/${locale}/dashboard/proposals/new`)}
            >
              Create Proposal
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          autoHeight
          showToolbar
          showQuickFilter
          onRowClick={handleRowClick}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Proposal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this proposal? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create from Intake Dialog */}
        <Dialog
          open={createFromIntakeDialogOpen}
          onClose={() => setCreateFromIntakeDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create Proposal from Intake</DialogTitle>
          <DialogContent>
            <CreateFromIntakeDialogContent
              onSelectIntake={(intakeId) => {
                setCreateFromIntakeDialogOpen(false);
                router.push(
                  `/${locale}/dashboard/proposals/new?intakeId=${intakeId}`
                );
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateFromIntakeDialogOpen(false)}>
              Cancel
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
