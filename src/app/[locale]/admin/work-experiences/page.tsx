"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from "@mui/material";
import Grid from "~/Common/Grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

import { api } from "$/trpc/client";
import { format } from "date-fns";
import type { WorkExperience } from "$/db/workExperiences";
import { useTranslations } from "next-intl";
import { ClientOnly } from "~/ClientOnly";
import { useSnackbar } from "~/SnackbarProvider";
import {
  WorkExperienceFormData,
  defaultFormData,
  employmentTypeOptions,
} from "./constants";

export default function WorkExperiencesAdminPage() {
  const t = useTranslations("Admin");
  const { showSnackbar } = useSnackbar();

  // State
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);
  const [formData, setFormData] =
    useState<WorkExperienceFormData>(defaultFormData);
  const [arrayInput, setArrayInput] = useState({
    achievements: "",
    technologies: "",
    responsibilities: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // tRPC queries and mutations
  const {
    data: workExperiences = [],
    isLoading,
    refetch,
  } = api.workExperiences.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.workExperiences.getStatistics.useQuery();

  const createMutation = api.workExperiences.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseForm();
      showSnackbar("Work experience created successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to create work experience:", error);
      showSnackbar(
        `Failed to create work experience: ${error.message}`,
        "error"
      );
    },
  });

  const updateMutation = api.workExperiences.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseForm();
      showSnackbar("Work experience updated successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to update work experience:", error);
      showSnackbar(
        `Failed to update work experience: ${error.message}`,
        "error"
      );
    },
  });

  const deleteMutation = api.workExperiences.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
      showSnackbar("Work experience deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete work experience:", error);
      showSnackbar(
        `Failed to delete work experience: ${error.message}`,
        "error"
      );
    },
  });

  const toggleVisibilityMutation =
    api.workExperiences.toggleVisibility.useMutation({
      onSuccess: () => {
        refetch();
        showSnackbar("Visibility updated successfully!", "success");
      },
      onError: (error) => {
        console.error("Failed to toggle visibility:", error);
        showSnackbar(`Failed to update visibility: ${error.message}`, "error");
      },
    });

  const toggleFeaturedMutation = api.workExperiences.toggleFeatured.useMutation(
    {
      onSuccess: () => {
        refetch();
        showSnackbar("Featured status updated successfully!", "success");
      },
      onError: (error) => {
        console.error("Failed to toggle featured status:", error);
        showSnackbar(
          `Failed to update featured status: ${error.message}`,
          "error"
        );
      },
    }
  );

  // Handlers
  const handleOpenForm = (experience?: WorkExperience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        role: experience.role,
        company: experience.company,
        location: experience.location,
        startDate: format(new Date(experience.startDate), "yyyy-MM-dd"),
        endDate: experience.endDate
          ? format(new Date(experience.endDate), "yyyy-MM-dd")
          : "",
        description: experience.description,
        achievements: experience.achievements || [],
        technologies: experience.technologies || [],
        responsibilities: experience.responsibilities || [],
        employmentType: experience.employmentType,
        industry: experience.industry,
        companyUrl: experience.companyUrl || "",
        logo: experience.logo || "",
        displayOrder: experience.displayOrder,
        isVisible: experience.isVisible,
        isFeatured: experience.isFeatured,
      });
    } else {
      setEditingExperience(null);
      setFormData(defaultFormData);
    }
    setArrayInput({ achievements: "", technologies: "", responsibilities: "" });
    setDialogOpen(true);
  };

  const handleCloseForm = () => {
    setDialogOpen(false);
    setEditingExperience(null);
    setFormData(defaultFormData);
    setArrayInput({ achievements: "", technologies: "", responsibilities: "" });
  };

  const handleAddArrayItem = (field: keyof typeof arrayInput) => {
    const value = arrayInput[field].trim();
    if (value && !formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      setArrayInput((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRemoveArrayItem = (
    field: keyof typeof arrayInput,
    itemToRemove: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== itemToRemove),
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      role: formData.role,
      company: formData.company,
      location: formData.location,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      description: formData.description,
      achievements: formData.achievements,
      technologies: formData.technologies,
      responsibilities: formData.responsibilities,
      employmentType: formData.employmentType,
      industry: formData.industry,
      companyUrl: formData.companyUrl || undefined,
      logo: formData.logo || undefined,
      displayOrder: formData.displayOrder,
      isVisible: formData.isVisible,
      isFeatured: formData.isFeatured,
      roleTranslations: {},
      companyTranslations: {},
      descriptionTranslations: {},
    };

    if (editingExperience) {
      updateMutation.mutate({
        id: editingExperience.id,
        data: {
          ...submitData,
          id: editingExperience.id,
        },
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate({ id });
  };

  const handleToggleFeatured = (id: string) => {
    toggleFeaturedMutation.mutate({ id });
  };

  const getEmploymentTypeColor = (type: string) => {
    return (
      employmentTypeOptions.find((opt) => opt.value === type)?.color ||
      "#607D8B"
    );
  };

  const formatDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
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
            {t("workExperienceManagement")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            {t("addExperience")}
          </Button>
        </Box>

        {/* Statistics */}
        {!statsLoading && statistics && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid component="div" xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {t("totalVisible")}
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalVisible}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div" xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {t("totalFeatured")}
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalFeatured}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div" xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {t("totalExperience")}
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalYearsExperience}y
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div" xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {t("total")}
                    </Typography>
                    <Typography variant="h4">{statistics.total}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Add/Edit Form Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseForm}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                maxHeight: "90vh",
                overflow: "auto",
              },
            },
          }}
        >
          <DialogTitle>
            {editingExperience
              ? t("editWorkExperience")
              : t("addNewWorkExperience")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label={t("role")}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  fullWidth
                  required
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label={t("company")}
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                  sx={{ minWidth: 200 }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label={t("location")}
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label={t("industry")}
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                  sx={{ minWidth: 200 }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label={t("startDate")}
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  fullWidth
                  required
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label={t("endDate")}
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  fullWidth
                  helperText={t("leaveEmptyForCurrent")}
                  sx={{ minWidth: 200 }}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>{t("employmentType")}</InputLabel>
                <Select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentType: e.target
                        .value as typeof formData.employmentType,
                    }))
                  }
                  label={t("employmentType")}
                >
                  {employmentTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label={t("description")}
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

              <TextField
                label={t("companyUrl")}
                value={formData.companyUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyUrl: e.target.value,
                  }))
                }
                fullWidth
                type="url"
              />

              {/* Array fields */}
              {(
                ["achievements", "technologies", "responsibilities"] as const
              ).map((field) => (
                <Box key={field}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ textTransform: "capitalize" }}
                  >
                    {field}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label={`Add ${field.slice(0, -1)}`}
                      value={arrayInput[field]}
                      onChange={(e) =>
                        setArrayInput((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddArrayItem(field)
                      }
                      size="small"
                      fullWidth
                    />
                    <Button
                      onClick={() => handleAddArrayItem(field)}
                      variant="outlined"
                      disabled={!arrayInput[field].trim()}
                    >
                      {t("add")}
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {formData[field].map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        onDelete={() => handleRemoveArrayItem(field, item)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              ))}

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                  label={t("visible")}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={t("featured")}
                />
              </Box>

              <Divider />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} variant="outlined">
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formData.role ||
                !formData.company ||
                !formData.location ||
                !formData.description ||
                formData.achievements.length === 0 ||
                formData.achievements.length === 0 ||
                formData.technologies.length === 0 ||
                formData.responsibilities.length === 0
              }
              startIcon={
                createMutation.isPending || updateMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              {createMutation.isPending || updateMutation.isPending
                ? t("saving")
                : editingExperience
                ? t("updateExperience")
                : t("createExperience")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Work Experiences Grid */}
        <Grid container spacing={3}>
          {workExperiences.map((experience: WorkExperience) => (
            <Grid item xs={12} sm={6} md={4} key={experience.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: experience.isVisible ? 1 : 0.6,
                  border: experience.isVisible ? "none" : "2px dashed #ccc",
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
                      <BusinessIcon color="action" />
                      <Chip
                        label={
                          employmentTypeOptions.find(
                            (type) => type.value === experience.employmentType
                          )?.label
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            getEmploymentTypeColor(experience.employmentType) +
                            "20",
                          color: getEmploymentTypeColor(
                            experience.employmentType
                          ),
                        }}
                      />
                      {experience.isFeatured && (
                        <StarIcon color="primary" fontSize="small" />
                      )}
                    </Box>
                    <Chip
                      label={experience.endDate ? "Past" : "Current"}
                      size="small"
                      color={experience.endDate ? "default" : "success"}
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {experience.role}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {experience.company} • {experience.location}
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
                      {format(new Date(experience.startDate), "MMM yyyy")} -{" "}
                      {experience.endDate
                        ? format(new Date(experience.endDate), "MMM yyyy")
                        : "Present"}{" "}
                      (
                      {formatDuration(experience.startDate, experience.endDate)}
                      )
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {experience.description.length > 150
                      ? experience.description.substring(0, 150) + "..."
                      : experience.description}
                  </Typography>

                  {experience.companyUrl && (
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
                        Company Website
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Details
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Technologies ({experience.technologies.length})
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {experience.technologies
                            .slice(0, 5)
                            .map((tech, index) => (
                              <Chip
                                key={index}
                                label={tech}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          {experience.technologies.length > 5 && (
                            <Chip
                              label={`+${
                                experience.technologies.length - 5
                              } more`}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Achievements ({experience.achievements.length})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {experience.achievements.length} achievements recorded
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Industry
                        </Typography>
                        <Chip label={experience.industry} size="small" />
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>

                <CardActions>
                  <Tooltip title={experience.isVisible ? "Hide" : "Show"}>
                    <IconButton
                      onClick={() => handleToggleVisibility(experience.id)}
                      color={experience.isVisible ? "primary" : "default"}
                    >
                      {experience.isVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={experience.isFeatured ? "Unfeature" : "Feature"}
                  >
                    <IconButton
                      onClick={() => handleToggleFeatured(experience.id)}
                      color={experience.isFeatured ? "primary" : "default"}
                    >
                      {experience.isFeatured ? (
                        <StarIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleOpenForm(experience)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setDeleteConfirmOpen(experience.id)}
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

        {/* Delete Confirmation Dialog */}
        {deleteConfirmOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setDeleteConfirmOpen(null)}
          >
            <Card
              sx={{
                maxWidth: 400,
                width: "90%",
                mx: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("deleteWorkExperience")}
                </Typography>
                <Typography>{t("deleteConfirmation")}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button onClick={() => setDeleteConfirmOpen(null)}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={() =>
                    deleteConfirmOpen && handleDelete(deleteConfirmOpen)
                  }
                  color="error"
                  variant="contained"
                  disabled={deleteMutation.isPending}
                  startIcon={
                    deleteMutation.isPending ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {deleteMutation.isPending ? t("deleting") : t("delete")}
                </Button>
              </CardActions>
            </Card>
          </Box>
        )}
      </Box>
    </ClientOnly>
  );
}
