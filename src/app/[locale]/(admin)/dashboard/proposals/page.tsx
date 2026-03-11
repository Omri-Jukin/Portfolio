"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { api } from "$/trpc/client";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  Send as SendIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { ClientOnly } from "~/ClientOnly";
import DataGrid from "~/DataGrid/DataGrid";
import { useSnackbar } from "~/SnackbarProvider/SnackbarProvider";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "default";
    case "sent":
      return "info";
    case "accepted":
      return "success";
    case "declined":
      return "error";
    case "expired":
      return "warning";
    default:
      return "default";
  }
};

const ProposalsListPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";
  const { showSnackbar } = useSnackbar();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const {
    data: proposals,
    isLoading,
    error,
    refetch,
  } = api.proposals.list.useQuery({
    status: statusFilter !== "all" ? (statusFilter as never) : undefined,
    search: searchQuery || undefined,
  });

  const deleteMutation = api.proposals.delete.useMutation({
    onSuccess: () => {
      showSnackbar("Proposal deleted successfully", "success");
      setDeleteDialogOpen(false);
      setSelectedProposal(null);
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to delete proposal", "error");
    },
  });

  const generateShareTokenMutation =
    api.proposals.generateShareToken.useMutation({
      onSuccess: (data) => {
        const token = data.token;
        if (token) {
          const url = `${window.location.origin}/${locale}/p/${token}`;
          setShareUrl(url);
          setShareDialogOpen(true);
        }
      },
      onError: (error) => {
        showSnackbar(error.message || "Failed to generate share link", "error");
      },
    });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    proposalId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProposal(proposalId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProposal(null);
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/proposals/${id}`);
    handleMenuClose();
  };

  const handleEdit = (id: string) => {
    router.push(`/${locale}/dashboard/proposals/${id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedProposal) {
      deleteMutation.mutate({ id: selectedProposal });
    }
    handleMenuClose();
  };

  const handleShare = () => {
    if (selectedProposal) {
      generateShareTokenMutation.mutate({ id: selectedProposal });
    }
    handleMenuClose();
  };

  const handleCopyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      showSnackbar("Share link copied to clipboard", "success");
    }
  };

  const handleSend = () => {
    // TODO: Implement send proposal
    showSnackbar("Send proposal feature coming soon", "info");
    handleMenuClose();
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    showSnackbar("PDF export feature coming soon", "info");
    handleMenuClose();
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate
    showSnackbar("Duplicate feature coming soon", "info");
    handleMenuClose();
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "clientName",
      headerName: "Client",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={
            getStatusColor(params.value as string) as
              | "default"
              | "primary"
              | "secondary"
              | "error"
              | "info"
              | "success"
              | "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.value
          ? format(new Date(params.value as string), "MMM d, yyyy")
          : "-",
    },
    {
      field: "validUntil",
      headerName: "Valid Until",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.value
          ? format(new Date(params.value as string), "MMM d, yyyy")
          : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => handleView(params.row.id)}
              aria-label="view"
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row.id)}
              aria-label="more options"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows =
    proposals?.map(
      (proposal: {
        id: string;
        title: string;
        clientName: string;
        status: string;
        currency: string;
        createdAt: string;
        validUntil: string | null;
      }) => ({
        id: proposal.id,
        title: proposal.title,
        clientName: proposal.clientName,
        status: proposal.status,
        currency: proposal.currency,
        createdAt: proposal.createdAt,
        validUntil: proposal.validUntil,
      })
    ) || [];

  if (isLoading) {
    return (
      <ClientOnly skeleton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  if (error) {
    return (
      <ClientOnly skeleton>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {error.message || "Failed to load proposals"}
          </Alert>
        </Box>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Proposals
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(`/${locale}/dashboard/proposals/new`)}
          >
            Create Proposal
          </Button>
        </Box>

        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Box
            component="label"
            htmlFor="status-filter-select"
            sx={{
              display: "flex",
              flexDirection: "column",
              minWidth: 150,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                mb: 0.5,
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              Status
            </Typography>
            <FormControl>
              <InputLabel htmlFor="status-filter-select">Status</InputLabel>
              <Select
                title="Filter by status"
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                name="status-filter"
                style={{
                  height: "40px",
                  padding: "8px 12px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                  backgroundColor: "transparent",
                  minWidth: "100%",
                  cursor: "pointer",
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <DataGrid rows={rows} columns={columns} />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => selectedProposal && handleView(selectedProposal)}
          >
            <ViewIcon sx={{ mr: 1 }} fontSize="small" />
            View
          </MenuItem>
          <MenuItem
            onClick={() => selectedProposal && handleEdit(selectedProposal)}
          >
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDuplicate}>
            <CopyIcon sx={{ mr: 1 }} fontSize="small" />
            Duplicate
          </MenuItem>
          <MenuItem onClick={handleShare}>
            <ShareIcon sx={{ mr: 1 }} fontSize="small" />
            Share
          </MenuItem>
          <MenuItem onClick={handleSend}>
            <SendIcon sx={{ mr: 1 }} fontSize="small" />
            Send
          </MenuItem>
          <MenuItem onClick={handleExportPDF}>
            <PdfIcon sx={{ mr: 1 }} fontSize="small" />
            Export PDF
          </MenuItem>
          <MenuItem
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

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
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
        >
          <DialogTitle>Share Proposal</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Share URL"
              value={shareUrl || ""}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
            <Button
              onClick={handleCopyShareUrl}
              variant="contained"
              startIcon={<CopyIcon />}
            >
              Copy Link
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
};

export default ProposalsListPage;
