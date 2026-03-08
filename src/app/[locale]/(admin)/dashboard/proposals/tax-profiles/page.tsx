"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import { api } from "$/trpc/client";
import { useRouter, usePathname } from "next/navigation";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { ClientOnly } from "~/ClientOnly";
import { useSnackbar } from "~/SnackbarProvider/SnackbarProvider";
import { TaxProfile } from "#/lib/db";

const TaxProfilesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";
  const { showSnackbar } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    taxLines: [] as unknown[],
    isDefault: false,
  });

  const {
    data: profiles,
    isLoading,
    error,
    refetch,
  } = api.proposals.taxProfiles.list.useQuery();

  const normalizedProfiles: TaxProfile[] = (profiles ?? []).map(
    (profile: TaxProfile) => ({
      ...profile,
      createdAt: new Date(profile.createdAt as unknown as string),
      updatedAt: new Date(profile.updatedAt as unknown as string),
      taxLines: profile.taxLines ?? [],
    })
  ) as unknown as TaxProfile[];

  const createMutation = api.proposals.taxProfiles.create.useMutation({
    onSuccess: () => {
      showSnackbar("Tax profile created successfully", "success");
      setDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        taxLines: [],
        isDefault: false,
      });
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to create tax profile", "error");
    },
  });

  const updateMutation = api.proposals.taxProfiles.update.useMutation({
    onSuccess: () => {
      showSnackbar("Tax profile updated successfully", "success");
      setDialogOpen(false);
      setSelectedProfile(null);
      setFormData({
        name: "",
        description: "",
        taxLines: [],
        isDefault: false,
      });
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to update tax profile", "error");
    },
  });

  const deleteMutation = api.proposals.taxProfiles.delete.useMutation({
    onSuccess: () => {
      showSnackbar("Tax profile deleted successfully", "success");
      setDeleteDialogOpen(false);
      setSelectedProfile(null);
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to delete tax profile", "error");
    },
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedProfile) {
      updateMutation.mutate({
        id: selectedProfile,
        ...formData,
      });
    }
  };

  const handleDelete = () => {
    if (selectedProfile) {
      deleteMutation.mutate({ id: selectedProfile });
    }
  };

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
            {error.message || "Failed to load tax profiles"}
          </Alert>
        </Box>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/${locale}/dashboard/proposals`)}
          >
            Back to Proposals
          </Button>
          <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
            Tax Profiles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProfile(null);
              setFormData({
                name: "",
                description: "",
                taxLines: [],
                isDefault: false,
              });
              setDialogOpen(true);
            }}
          >
            Create Tax Profile
          </Button>
        </Stack>

        {normalizedProfiles.length === 0 ? (
          <Alert severity="info">
            No tax profiles found. Create your first tax profile.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {normalizedProfiles.map((profile: TaxProfile) => (
              <Card key={profile.id}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6">{profile.name}</Typography>
                      {profile.description && (
                        <Typography variant="body2" color="text.secondary">
                          {profile.description}
                        </Typography>
                      )}
                      {profile.isDefault && (
                        <Typography variant="caption" color="primary">
                          Default Profile
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setSelectedProfile(profile.id);
                          setFormData({
                            name: profile.name,
                            description: profile.description || "",
                            taxLines: profile.taxLines as unknown[],
                            isDefault: profile.isDefault,
                          });
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setSelectedProfile(profile.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedProfile ? "Edit Tax Profile" : "Create Tax Profile"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Typography variant="body2" color="text.secondary">
                Tax lines configuration coming soon. This will allow you to
                define tax rates and calculations for this profile.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={selectedProfile ? handleUpdate : handleCreate}
              variant="contained"
              disabled={
                !formData.name ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {selectedProfile ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Tax Profile</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this tax profile? This action
              cannot be undone.
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
      </Box>
    </ClientOnly>
  );
};

export default TaxProfilesPage;
