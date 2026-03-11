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
import { ProposalTemplate } from "#/lib/db";

const ProposalTemplatesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";
  const { showSnackbar } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: {},
    isDefault: false,
  });

  const {
    data: templates,
    isLoading,
    error,
    refetch,
  } = api.proposals.templates.list.useQuery();

  const normalizedTemplates: ProposalTemplate[] = (templates ?? []).map(
    (template) => ({
      ...template,
      createdAt: new Date(template.createdAt as string),
      updatedAt: new Date(template.updatedAt as string),
      content: template.content ?? {},
    })
  );

  const createMutation = api.proposals.templates.create.useMutation({
    onSuccess: () => {
      showSnackbar("Template created successfully", "success");
      setDialogOpen(false);
      setFormData({ name: "", description: "", content: {}, isDefault: false });
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to create template", "error");
    },
  });

  const updateMutation = api.proposals.templates.update.useMutation({
    onSuccess: () => {
      showSnackbar("Template updated successfully", "success");
      setDialogOpen(false);
      setSelectedTemplate(null);
      setFormData({ name: "", description: "", content: {}, isDefault: false });
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to update template", "error");
    },
  });

  const deleteMutation = api.proposals.templates.delete.useMutation({
    onSuccess: () => {
      showSnackbar("Template deleted successfully", "success");
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to delete template", "error");
    },
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedTemplate) {
      updateMutation.mutate({
        id: selectedTemplate,
        ...formData,
      });
    }
  };

  const handleDelete = () => {
    if (selectedTemplate) {
      deleteMutation.mutate({ id: selectedTemplate });
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
            {error.message || "Failed to load templates"}
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
            Proposal Templates
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedTemplate(null);
              setFormData({
                name: "",
                description: "",
                content: {},
                isDefault: false,
              });
              setDialogOpen(true);
            }}
          >
            Create Template
          </Button>
        </Stack>

        {normalizedTemplates.length === 0 ? (
          <Alert severity="info">
            No templates found. Create your first template.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {normalizedTemplates.map((template: ProposalTemplate) => (
              <Card key={template.id}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6">{template.name}</Typography>
                      {template.description && (
                        <Typography variant="body2" color="text.secondary">
                          {template.description}
                        </Typography>
                      )}
                      {template.isDefault && (
                        <Typography variant="caption" color="primary">
                          Default Template
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setFormData({
                            name: template.name,
                            description: template.description || "",
                            content: template.content as Record<
                              string,
                              unknown
                            >,
                            isDefault: template.isDefault,
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
                          setSelectedTemplate(template.id);
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
            {selectedTemplate ? "Edit Template" : "Create Template"}
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
                Template content configuration coming soon. This will allow you
                to define the structure and default content for proposals
                created from this template.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={selectedTemplate ? handleUpdate : handleCreate}
              variant="contained"
              disabled={
                !formData.name ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {selectedTemplate ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Template</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this template? This action cannot
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
      </Box>
    </ClientOnly>
  );
};

export default ProposalTemplatesPage;
