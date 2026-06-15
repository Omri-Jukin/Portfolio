"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  Label,
  LoadingState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type Role = RouterOutputs["roles"]["getAll"][number];
type RoleForm = {
  id?: string;
  name: string;
  displayName: string;
  description: string;
  canAccessAdmin: boolean;
  canEditContent: boolean;
  canEditTablesInput: string;
  isActive: boolean;
  displayOrder: number;
};
type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

const DEFAULT_ROLE_NAMES = ["admin", "editor", "user", "visitor"];

const defaultForm: RoleForm = {
  name: "",
  displayName: "",
  description: "",
  canAccessAdmin: false,
  canEditContent: false,
  canEditTablesInput: "",
  isActive: true,
  displayOrder: 0,
};

function isDefaultRole(name: string) {
  return DEFAULT_ROLE_NAMES.includes(name.toLowerCase());
}

function normalizeRoleName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function parseTableList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toTableInput(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value.map(String).join(", ");
}

export default function RolesAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [form, setForm] = useState<RoleForm>(defaultForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = api.roles.getAll.useQuery();

  const createMutation = api.roles.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Role created." });
    },
    onError: (mutationError) => setFormError(mutationError.message),
  });

  const updateMutation = api.roles.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Role updated." });
    },
    onError: (mutationError) => setFormError(mutationError.message),
  });

  const deleteMutation = api.roles.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setDeleteTarget(null);
      setNotice({ tone: "success", message: "Role deleted." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const openDialog = (role?: Role) => {
    setFormError(null);
    setNotice(null);

    if (role) {
      setForm({
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description ?? "",
        canAccessAdmin: role.permissions?.canAccessAdmin ?? false,
        canEditContent: role.permissions?.canEditContent ?? false,
        canEditTablesInput: toTableInput(role.permissions?.canEditTables),
        isActive: role.isActive,
        displayOrder: role.displayOrder,
      });
    } else {
      setForm({
        ...defaultForm,
        displayOrder: roles.length,
      });
    }

    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(defaultForm);
    setFormError(null);
  };

  const save = () => {
    if (!form.displayName.trim()) {
      setFormError("Display name is required.");
      return;
    }

    const permissions = {
      canAccessAdmin: form.canAccessAdmin,
      canEditContent: form.canEditContent,
      canEditTables: parseTableList(form.canEditTablesInput),
    };

    if (form.id) {
      updateMutation.mutate({
        id: form.id,
        displayName: form.displayName.trim(),
        description: form.description.trim() || undefined,
        permissions,
        isActive: form.isActive,
        displayOrder: form.displayOrder,
      });
      return;
    }

    const name = normalizeRoleName(form.name);
    if (!name) {
      setFormError("Role name is required.");
      return;
    }

    createMutation.mutate({
      name,
      displayName: form.displayName.trim(),
      description: form.description.trim() || undefined,
      permissions,
      isActive: form.isActive,
      displayOrder: form.displayOrder,
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Access control
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Roles & Permissions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage dashboard roles, active state, and coarse admin permissions.
          </p>
        </div>
        <Button onClick={() => openDialog()}>Create Role</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      {isLoading ? <LoadingState>Loading roles</LoadingState> : null}

      {!isLoading && roles.length === 0 ? (
        <EmptyState>No roles found.</EmptyState>
      ) : null}

      {!isLoading && roles.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Configured Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const permissions = role.permissions;
                  const labels = [
                    permissions?.canAccessAdmin ? "Admin access" : null,
                    permissions?.canEditContent ? "Edit content" : null,
                    ...(permissions?.canEditTables ?? []).map(
                      (table) => `Table: ${table}`
                    ),
                  ].filter(Boolean);

                  return (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="font-medium">{role.displayName}</div>
                        {role.description ? (
                          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {labels.length > 0 ? (
                            labels.map((label) => (
                              <Badge key={label} tone="accent">
                                {label}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              None
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{role.displayOrder}</TableCell>
                      <TableCell>
                        <Badge tone={role.isActive ? "success" : "warning"}>
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(role)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDefaultRole(role.name)}
                          onClick={() => setDeleteTarget(role)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {!form.id ? (
            <FormField hint="Stored as lowercase kebab-case.">
              <Label htmlFor="role-name">Role name</Label>
              <Input
                id="role-name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </FormField>
          ) : null}
          <FormField>
            <Label htmlFor="role-display-name">Display name</Label>
            <Input
              id="role-display-name"
              value={form.displayName}
              onChange={(event) =>
                setForm({ ...form, displayName: event.target.value })
              }
            />
          </FormField>
          <FormField>
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="role-order">Display order</Label>
              <Input
                id="role-order"
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(event) =>
                  setForm({
                    ...form,
                    displayOrder: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
            </FormField>
            <FormField hint="Comma-separated table keys, or * for all tables.">
              <Label htmlFor="role-tables">Editable tables</Label>
              <Input
                id="role-tables"
                value={form.canEditTablesInput}
                onChange={(event) =>
                  setForm({ ...form, canEditTablesInput: event.target.value })
                }
              />
            </FormField>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <CheckboxField
              label="Admin access"
              checked={form.canAccessAdmin}
              onChange={(canAccessAdmin) =>
                setForm({ ...form, canAccessAdmin })
              }
            />
            <CheckboxField
              label="Edit content"
              checked={form.canEditContent}
              onChange={(canEditContent) =>
                setForm({ ...form, canEditContent })
              }
            />
            <CheckboxField
              label="Active"
              checked={form.isActive}
              onChange={(isActive) => setForm({ ...form, isActive })}
            />
          </div>
        </div>
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Delete {deleteTarget?.displayName ?? "this role"}? Default system roles
          are protected by the API and cannot be deleted.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })
            }
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
