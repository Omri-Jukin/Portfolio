"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Link as LinkIcon,
  Event as CalendarIcon,
} from "@mui/icons-material";

import { api } from "$/trpc/client";
import { format } from "date-fns";
import type { Certification } from "$/db/schema/schema.types";
import { ClientOnly } from "~/ClientOnly";

interface CertificationFormData {
  name: string;
  issuer: string;
  description: string;
  category:
    | "technical"
    | "cloud"
    | "security"
    | "project-management"
    | "design"
    | "other";
  status: "active" | "expired" | "revoked";
  skills: string[];
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verificationUrl: string;
  icon: string;
  isVisible: boolean;
  displayOrder: number;
}

const defaultFormData: CertificationFormData = {
  name: "",
  issuer: "",
  description: "",
  category: "technical",
  status: "active",
  skills: [],
  issueDate: new Date().toISOString().split("T")[0],
  expiryDate: "",
  credentialId: "",
  verificationUrl: "",
  icon: "",
  isVisible: true,
  displayOrder: 0,
};

const categoryOptions = [
  { value: "technical", label: "Technical", color: "#2196F3" },
  { value: "cloud", label: "Cloud", color: "#FF9800" },
  { value: "security", label: "Security", color: "#F44336" },
  {
    value: "project-management",
    label: "Project Management",
    color: "#4CAF50",
  },
  { value: "design", label: "Design", color: "#9C27B0" },
  { value: "other", label: "Other", color: "#607D8B" },
];

const statusOptions = [
  { value: "active", label: "Active", color: "success" },
  { value: "expired", label: "Expired", color: "warning" },
  { value: "revoked", label: "Revoked", color: "error" },
];

export default function CertificationsAdminPage() {
  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [formData, setFormData] =
    useState<CertificationFormData>(defaultFormData);
  const [skillInput, setSkillInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );

  // tRPC queries and mutations
  const {
    data: certifications = [],
    isLoading,
    refetch,
  } = api.certifications.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.certifications.getStatistics.useQuery();

  const createMutation = api.certifications.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const updateMutation = api.certifications.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const deleteMutation = api.certifications.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
    },
  });

  const toggleVisibilityMutation =
    api.certifications.toggleVisibility.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  // Handlers
  const handleOpenDialog = (certification?: Certification) => {
    if (certification) {
      setEditingCertification(certification);
      setFormData({
        name: certification.name,
        issuer: certification.issuer,
        description: certification.description,
        category: certification.category,
        status: certification.status,
        skills: certification.skills || [],
        issueDate: format(new Date(certification.issueDate), "yyyy-MM-dd"),
        expiryDate: certification.expiryDate
          ? format(new Date(certification.expiryDate), "yyyy-MM-dd")
          : "",
        credentialId: certification.credentialId || "",
        verificationUrl: certification.verificationUrl || "",
        icon: certification.icon || "",
        isVisible: certification.isVisible,
        displayOrder: certification.displayOrder,
      });
    } else {
      setEditingCertification(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCertification(null);
    setFormData(defaultFormData);
    setSkillInput("");
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      name: formData.name,
      issuer: formData.issuer,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      skills: formData.skills,
      issueDate: new Date(formData.issueDate),
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate)
        : undefined,
      verificationUrl: formData.verificationUrl || undefined,
      credentialId: formData.credentialId || undefined,
      icon: formData.icon || undefined,
      isVisible: formData.isVisible,
      displayOrder: formData.displayOrder,
      nameTranslations: {},
      descriptionTranslations: {},
      issuerTranslations: {},
    };

    if (editingCertification) {
      const updateData = {
        name: submitData.name,
        issuer: submitData.issuer,
        description: submitData.description,
        category: submitData.category,
        status: submitData.status,
        skills: submitData.skills,
        issueDate: submitData.issueDate,
        expiryDate: submitData.expiryDate,
        verificationUrl: submitData.verificationUrl,
        credentialId: submitData.credentialId,
        icon: submitData.icon,
        isVisible: submitData.isVisible,
        displayOrder: submitData.displayOrder,
        nameTranslations: {},
        descriptionTranslations: {},
        issuerTranslations: {},
      };
      updateMutation.mutate({
        id: editingCertification.id,
        data: updateData,
      });
    } else {
      const createData = {
        name: submitData.name,
        issuer: submitData.issuer,
        description: submitData.description,
        category: submitData.category,
        status: submitData.status,
        skills: submitData.skills,
        issueDate: submitData.issueDate,
        expiryDate: submitData.expiryDate,
        verificationUrl: submitData.verificationUrl,
        credentialId: submitData.credentialId,
        icon: submitData.icon,
        isVisible: submitData.isVisible,
        displayOrder: submitData.displayOrder,
        nameTranslations: {},
        descriptionTranslations: {},
        issuerTranslations: {},
      };
      createMutation.mutate(createData);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate({ id });
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryOptions.find((opt) => opt.value === category)?.color || "#607D8B"
    );
  };

  const getStatusColor = (status: string) => {
    return (
      (statusOptions.find((opt) => opt.value === status)?.color as
        | "success"
        | "warning"
        | "error"
        | "default") || "default"
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Certifications Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Certification
          </Button>
        </Box>

        {/* Statistics */}
        {!statsLoading && statistics && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid component="div">
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Active
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalActive}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div">
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Expired
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalExpired}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div">
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total
                    </Typography>
                    <Typography variant="h4">{statistics.total}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div">
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Categories
                    </Typography>
                    <Typography variant="h4">
                      {statistics.byCategory.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Certifications Grid */}
        <Grid container spacing={3}>
          {certifications.map((certification: Certification) => (
            <Grid component="div" key={certification.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: certification.isVisible ? 1 : 0.6,
                  border: certification.isVisible ? "none" : "2px dashed #ccc",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {certification.icon && (
                        <Typography variant="h5">
                          {certification.icon}
                        </Typography>
                      )}
                      <Chip
                        label={
                          categoryOptions.find(
                            (cat) => cat.value === certification.category
                          )?.label
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            getCategoryColor(certification.category) + "20",
                          color: getCategoryColor(certification.category),
                        }}
                      />
                    </Box>
                    <Chip
                      label={
                        statusOptions.find(
                          (stat) => stat.value === certification.status
                        )?.label
                      }
                      size="small"
                      color={getStatusColor(certification.status)}
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {certification.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {certification.issuer}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {certification.description.length > 120
                      ? certification.description.substring(0, 120) + "..."
                      : certification.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(certification.issueDate), "MMM yyyy")}
                      {certification.expiryDate &&
                        ` - ${format(
                          new Date(certification.expiryDate),
                          "MMM yyyy"
                        )}`}
                    </Typography>
                  </Box>

                  {certification.verificationUrl && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <LinkIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="primary">
                        Verifiable
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {certification.skills
                      ?.slice(0, 3)
                      .map((skill: string, index: number) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    {certification.skills &&
                      certification.skills.length > 3 && (
                        <Chip
                          label={`+${certification.skills.length - 3} more`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                  </Box>
                </CardContent>

                <CardActions>
                  <Tooltip title={certification.isVisible ? "Hide" : "Show"}>
                    <IconButton
                      onClick={() => handleToggleVisibility(certification.id)}
                      color={certification.isVisible ? "primary" : "default"}
                    >
                      {certification.isVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleOpenDialog(certification)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setDeleteConfirmOpen(certification.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingCertification
              ? "Edit Certification"
              : "Add New Certification"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
              />

              <TextField
                label="Issuer"
                value={formData.issuer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, issuer: e.target.value }))
                }
                fullWidth
                required
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                fullWidth
                multiline
                rows={3}
                required
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    label="Category"
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    label="Status"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Issue Date"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />

                <TextField
                  label="Expiry Date"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Credential ID"
                  value={formData.credentialId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      credentialId: e.target.value,
                    }))
                  }
                  fullWidth
                />

                <TextField
                  label="Icon (Emoji)"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  fullWidth
                  placeholder="🎓"
                />
              </Box>

              <TextField
                label="Verification URL"
                value={formData.verificationUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    verificationUrl: e.target.value,
                  }))
                }
                fullWidth
                type="url"
              />

              {/* Skills Section */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label="Add Skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    size="small"
                    fullWidth
                  />
                  <Button
                    onClick={handleAddSkill}
                    variant="outlined"
                    disabled={!skillInput.trim()}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVisible}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isVisible: e.target.checked,
                      }))
                    }
                  />
                }
                label="Visible"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formData.name ||
                !formData.issuer ||
                !formData.description ||
                formData.skills.length === 0
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={20} />
              ) : editingCertification ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(null)}
        >
          <DialogTitle>Delete Certification</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this certification? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(null)}>Cancel</Button>
            <Button
              onClick={() =>
                deleteConfirmOpen && handleDelete(deleteConfirmOpen)
              }
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
}
