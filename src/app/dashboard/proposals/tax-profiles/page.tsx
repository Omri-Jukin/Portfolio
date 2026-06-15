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
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type TaxProfile = RouterOutputs["proposals"]["taxProfiles"]["list"][number];

type TaxProfileFormData = {
  name: string;
  description: string;
  taxLines: unknown[];
  isDefault: boolean;
};

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

const defaultFormData: TaxProfileFormData = {
  name: "",
  description: "",
  taxLines: [],
  isDefault: false,
};

export default function TaxProfilesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<TaxProfile | null>(
    null
  );
  const [formData, setFormData] =
    useState<TaxProfileFormData>(defaultFormData);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: profiles = [],
    isLoading,
    error,
    refetch,
  } = api.proposals.taxProfiles.list.useQuery();

  const createMutation = api.proposals.taxProfiles.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Tax profile created." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const updateMutation = api.proposals.taxProfiles.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Tax profile updated." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const deleteMutation = api.proposals.taxProfiles.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setProfileToDelete(null);
      setNotice({ tone: "success", message: "Tax profile deleted." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openDialog = (profile?: TaxProfile) => {
    setNotice(null);

    if (profile) {
      setEditingProfileId(profile.id);
      setFormData({
        name: profile.name,
        description: profile.description ?? "",
        taxLines: Array.isArray(profile.taxLines) ? profile.taxLines : [],
        isDefault: profile.isDefault,
      });
    } else {
      setEditingProfileId(null);
      setFormData(defaultFormData);
    }

    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProfileId(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      taxLines: formData.taxLines,
      isDefault: formData.isDefault,
    };

    if (!payload.name) {
      setNotice({ tone: "destructive", message: "Profile name is required." });
      return;
    }

    if (editingProfileId) {
      updateMutation.mutate({ id: editingProfileId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Proposal settings
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Tax Profiles
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage reusable tax profile metadata for proposal pricing.
          </p>
        </div>
        <Button onClick={() => openDialog()}>Create Tax Profile</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      {isLoading ? <LoadingState>Loading tax profiles</LoadingState> : null}

      {!isLoading && profiles.length === 0 ? (
        <EmptyState>No tax profiles found. Create your first profile.</EmptyState>
      ) : null}

      <div className="grid gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{profile.name}</CardTitle>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {profile.isDefault ? (
                      <Badge tone="accent">Default</Badge>
                    ) : null}
                    <Badge>
                      {Array.isArray(profile.taxLines)
                        ? profile.taxLines.length
                        : 0}{" "}
                      tax lines
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(profile)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => setProfileToDelete(profile)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            {profile.description ? (
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {profile.description}
                </p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        className="max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editingProfileId ? "Edit Tax Profile" : "Create Tax Profile"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FormField>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </FormField>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />
          </FormField>

          <label className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
            <Checkbox
              checked={formData.isDefault}
              onChange={(event) =>
                setFormData({ ...formData, isDefault: event.target.checked })
              }
            />
            Default profile
          </label>

          <Alert>
            Tax-line rule editing is still not wired in this admin view. This
            page preserves the existing metadata-only behavior.
          </Alert>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="quiet" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || isSaving}
            >
              {isSaving
                ? "Saving..."
                : editingProfileId
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={profileToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProfileToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Tax Profile</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete{" "}
          <span className="font-medium text-foreground">
            {profileToDelete?.name}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setProfileToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (profileToDelete) {
                deleteMutation.mutate({ id: profileToDelete.id });
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
