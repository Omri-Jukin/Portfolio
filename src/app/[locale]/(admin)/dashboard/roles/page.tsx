"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { api } from "$/trpc/client";
import ClientOnly from "~/ClientOnly";
import DataGrid from "~/DataGrid/DataGrid";
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import type { RouterOutputs } from "$/trpc/client";

type Role = RouterOutputs["roles"]["getAll"][number];

const DEFAULT_ROLE_NAMES = ["admin", "editor", "user", "visitor"];

function isDefaultRole(name: string): boolean {
  return DEFAULT_ROLE_NAMES.includes(name.toLowerCase());
}

export default function RolesAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formName, setFormName] = useState("");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formCanAccessAdmin, setFormCanAccessAdmin] = useState(false);
  const [formCanEditContent, setFormCanEditContent] = useState(false);

  const { data: roles = [], isLoading, refetch } = api.roles.getAll.useQuery();

  const createMutation = api.roles.create.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({ open: true, message: "Role created successfully", severity: "success" });
    },
    onError: (e) => {
      setSnackbar({ open: true, message: e.message || "Failed to create role", severity: "error" });
    },
  });

  const updateMutation = api.roles.update.useMutation({
    onSuccess: () => {
      void refetch();
      handleCloseDialog();
      setSnackbar({ open: true, message: "Role updated successfully", severity: "success" });
    },
    onError: (e) => {
      setSnackbar({ open: true, message: e.message || "Failed to update role", severity: "error" });
    },
  });

  const deleteMutation = api.roles.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirmId(null);
      setSnackbar({ open: true, message: "Role deleted successfully", severity: "success" });
    },
    onError: (e) => {
      setSnackbar({ open: true, message: e.message || "Failed to delete role", severity: "error" });
    },
  });

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormName(role.name);
      setFormDisplayName(role.displayName);
      setFormDescription(role.description ?? "");
      setFormIsActive(role.isActive);
      setFormDisplayOrder(role.displayOrder);
      setFormCanAccessAdmin(role.permissions?.canAccessAdmin ?? false);
      setFormCanEditContent(role.permissions?.canEditContent ?? false);
    } else {
      setEditingRole(null);
      setFormName("");
      setFormDisplayName("");
      setFormDescription("");
      setFormIsActive(true);
      setFormDisplayOrder(roles.length);
      setFormCanAccessAdmin(false);
      setFormCanEditContent(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRole(null);
  };

  const handleSave = () => {
    const permissions = {
      canAccessAdmin: formCanAccessAdmin,
      canEditContent: formCanEditContent,
    };
    if (editingRole) {
      updateMutation.mutate({
        id: editingRole.id,
        displayName: formDisplayName,
        description: formDescription || undefined,
        permissions,
        isActive: formIsActive,
        displayOrder: formDisplayOrder,
      });
    } else {
      createMutation.mutate({
        name: formName.trim().toLowerCase().replace(/\s+/g, "-"),
        displayName: formDisplayName.trim(),
        description: formDescription.trim() || undefined,
        permissions,
        isActive: formIsActive,
        displayOrder: formDisplayOrder,
      });
    }
  };

  const columns: GridColDef<Role>[] = [
    { field: "displayName", headerName: "Display name", flex: 1, minWidth: 140 },
    { field: "name", headerName: "Name", width: 120 },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 280 }}>
          {params.value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "permissions",
      headerName: "Permissions",
      width: 180,
      renderCell: (params) => {
        const p = params.value;
        const labels: string[] = [];
        if (p?.canAccessAdmin) labels.push("Admin");
        if (p?.canEditContent) labels.push("Edit content");
        if (labels.length === 0) return "—";
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {labels.map((l) => (
              <Chip key={l} label={l} size="small" variant="outlined" />
            ))}
          </Stack>
        );
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Yes" : "No"}
          size="small"
          color={params.value ? "success" : "default"}
          variant="outlined"
        />
      ),
    },
    { field: "displayOrder", headerName: "Order", width: 80 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => {
        const canDelete = !isDefaultRole(params.row.name);
        return [
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
            disabled={!canDelete}
            onClick={() => setDeleteConfirmId(params.row.id)}
          />,
        ];
      },
    },
  ];

  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }} color="text.primary">
          Roles & Permissions
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
          Manage user roles and their permissions. Configure what each role can access and edit.
        </Typography>

        <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add role
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={roles}
              columns={columns}
              defaultPageSize={25}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          )}
        </Paper>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingRole ? "Edit role" : "Create role"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name (key)"
              fullWidth
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={!!editingRole}
              helperText={editingRole ? "Name cannot be changed" : "Lowercase, no spaces (e.g. content-editor)"}
            />
            <TextField
              margin="dense"
              label="Display name"
              fullWidth
              required
              value={formDisplayName}
              onChange={(e) => setFormDisplayName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Display order"
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              value={formDisplayOrder}
              onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                />
              }
              label="Active"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Permissions
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formCanAccessAdmin}
                    onChange={(e) => setFormCanAccessAdmin(e.target.checked)}
                  />
                }
                label="Can access admin dashboard"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formCanEditContent}
                    onChange={(e) => setFormCanEditContent(e.target.checked)}
                  />
                }
                label="Can edit content"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                !formDisplayName.trim() ||
                (!editingRole && !formName.trim()) ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {editingRole ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete role?</DialogTitle>
          <DialogContent>
            This action cannot be undone. Users with this role may lose access.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => deleteConfirmId && deleteMutation.mutate({ id: deleteConfirmId })}
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
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        />
      </Box>
    </ClientOnly>
  );
}
