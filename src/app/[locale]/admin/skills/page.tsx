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
  Slider,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from "@mui/icons-material";

import { api } from "$/trpc/client";
import { format } from "date-fns";
import type { Skill } from "$/db/skills";
import { ClientOnly } from "~/ClientOnly";

export interface SkillFormData {
  name: string;
  category:
    | "technical"
    | "soft"
    | "language"
    | "tool"
    | "framework"
    | "database"
    | "cloud";
  subCategory: string;
  proficiencyLevel: number;
  proficiencyLabel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
  description: string;
  icon: string;
  color: string;
  relatedSkills: string[];
  certifications: string[];
  projects: string[];
  lastUsed: string;
  isVisible: boolean;
  displayOrder: number;
}

export const defaultFormData: SkillFormData = {
  name: "",
  category: "technical",
  subCategory: "",
  proficiencyLevel: 50,
  proficiencyLabel: "intermediate",
  yearsOfExperience: 1,
  description: "",
  icon: "",
  color: "",
  relatedSkills: [],
  certifications: [],
  projects: [],
  lastUsed: new Date().toISOString().split("T")[0],
  isVisible: true,
  displayOrder: 0,
};

export const categoryOptions = [
  { value: "technical", label: "Technical", color: "#2196F3" },
  { value: "soft", label: "Soft Skills", color: "#4CAF50" },
  { value: "language", label: "Language", color: "#FF9800" },
  { value: "tool", label: "Tool", color: "#9C27B0" },
  { value: "framework", label: "Framework", color: "#F44336" },
  { value: "database", label: "Database", color: "#607D8B" },
  { value: "cloud", label: "Cloud", color: "#00BCD4" },
];

export const proficiencyOptions = [
  { value: "beginner", label: "Beginner", range: [1, 25] },
  { value: "intermediate", label: "Intermediate", range: [25, 50] },
  { value: "advanced", label: "Advanced", range: [50, 75] },
  { value: "expert", label: "Expert", range: [75, 100] },
];

export default function SkillsAdminPage() {
  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(defaultFormData);
  const [arrayInput, setArrayInput] = useState({
    relatedSkills: "",
    certifications: "",
    projects: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );

  // tRPC queries and mutations
  const {
    data: skills = [],
    isLoading,
    refetch,
  } = api.skills.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.skills.getStatistics.useQuery();

  const createMutation = api.skills.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const updateMutation = api.skills.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const deleteMutation = api.skills.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
    },
  });

  const toggleVisibilityMutation = api.skills.toggleVisibility.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const updateLastUsedMutation = api.skills.updateLastUsed.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Handlers
  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        subCategory: skill.subCategory || "",
        proficiencyLevel: skill.proficiencyLevel,
        proficiencyLabel: skill.proficiencyLabel,
        yearsOfExperience: skill.yearsOfExperience,
        description: skill.description || "",
        icon: skill.icon || "",
        color: skill.color || "",
        relatedSkills: skill.relatedSkills || [],
        certifications: skill.certifications || [],
        projects: skill.projects || [],
        lastUsed: format(new Date(skill.lastUsed), "yyyy-MM-dd"),
        isVisible: skill.isVisible,
        displayOrder: skill.displayOrder,
      });
    } else {
      setEditingSkill(null);
      setFormData(defaultFormData);
    }
    setArrayInput({
      relatedSkills: "",
      certifications: "",
      projects: "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSkill(null);
    setFormData(defaultFormData);
    setArrayInput({
      relatedSkills: "",
      certifications: "",
      projects: "",
    });
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

  const handleProficiencyChange = (value: number) => {
    setFormData((prev) => {
      const newLabel =
        proficiencyOptions.find(
          (option) => value >= option.range[0] && value <= option.range[1]
        )?.value || "intermediate";

      return {
        ...prev,
        proficiencyLevel: value,
        proficiencyLabel: newLabel as typeof prev.proficiencyLabel,
      };
    });
  };

  const handleSubmit = () => {
    const submitData = {
      name: formData.name,
      category: formData.category,
      subCategory: formData.subCategory || undefined,
      proficiencyLevel: formData.proficiencyLevel,
      proficiencyLabel: formData.proficiencyLabel,
      yearsOfExperience: formData.yearsOfExperience,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
      color: formData.color || undefined,
      relatedSkills: formData.relatedSkills,
      certifications: formData.certifications,
      projects: formData.projects,
      lastUsed: new Date(formData.lastUsed),
      isVisible: formData.isVisible,
      displayOrder: formData.displayOrder,
      nameTranslations: {},
      descriptionTranslations: {},
    };

    if (editingSkill) {
      updateMutation.mutate({
        id: editingSkill.id,
        data: submitData,
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

  const handleUpdateLastUsed = (id: string) => {
    updateLastUsedMutation.mutate({ id });
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryOptions.find((opt) => opt.value === category)?.color || "#607D8B"
    );
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 75) return "#4CAF50"; // Expert - Green
    if (level >= 50) return "#FF9800"; // Advanced - Orange
    if (level >= 25) return "#2196F3"; // Intermediate - Blue
    return "#607D8B"; // Beginner - Gray
  };

  const getExperienceText = (years: number) => {
    if (years < 1) return "< 1 year";
    if (years === 1) return "1 year";
    return `${years} years`;
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
            Skills Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Skill
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
                      Total Visible
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalVisible}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div">
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Avg Experience
                    </Typography>
                    <Typography variant="h4">
                      {statistics.averageExperience}y
                    </Typography>
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
            </Grid>
          </Box>
        )}

        {/* Skills Grid */}
        <Grid container spacing={3}>
          {skills.map((skill: Skill) => (
            <Grid component="div" key={skill.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: skill.isVisible ? 1 : 0.6,
                  border: skill.isVisible ? "none" : "2px dashed #ccc",
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
                      {skill.icon && (
                        <Typography variant="h6">{skill.icon}</Typography>
                      )}
                      <Chip
                        label={
                          categoryOptions.find(
                            (cat) => cat.value === skill.category
                          )?.label
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            getCategoryColor(skill.category) + "20",
                          color: getCategoryColor(skill.category),
                        }}
                      />
                    </Box>
                    <Chip
                      label={skill.proficiencyLabel}
                      size="small"
                      sx={{
                        backgroundColor:
                          getProficiencyColor(skill.proficiencyLevel) + "20",
                        color: getProficiencyColor(skill.proficiencyLevel),
                      }}
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {skill.name}
                  </Typography>

                  {skill.subCategory && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {skill.subCategory}
                    </Typography>
                  )}

                  {skill.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {skill.description.length > 100
                        ? skill.description.substring(0, 100) + "..."
                        : skill.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Proficiency
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {skill.proficiencyLevel}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={skill.proficiencyLevel}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getProficiencyColor(
                            skill.proficiencyLevel
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TrendingUpIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {getExperienceText(skill.yearsOfExperience)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Last used:{" "}
                        {format(new Date(skill.lastUsed), "MMM yyyy")}
                      </Typography>
                    </Box>

                    {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Related Skills ({skill.relatedSkills.length})
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {skill.relatedSkills
                            .slice(0, 3)
                            .map((related, index) => (
                              <Chip
                                key={index}
                                label={related}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          {skill.relatedSkills.length > 3 && (
                            <Chip
                              label={`+${skill.relatedSkills.length - 3} more`}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                <CardActions>
                  <Tooltip title={skill.isVisible ? "Hide" : "Show"}>
                    <IconButton
                      onClick={() => handleToggleVisibility(skill.id)}
                      color={skill.isVisible ? "primary" : "default"}
                    >
                      {skill.isVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Mark as Recently Used">
                    <IconButton
                      onClick={() => handleUpdateLastUsed(skill.id)}
                      color="secondary"
                    >
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleOpenDialog(skill)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setDeleteConfirmOpen(skill.id)}
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
            {editingSkill ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
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
                  label="Icon (Emoji)"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="⚛️"
                  inputProps={{ maxLength: 5 }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as typeof formData.category,
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

                <TextField
                  label="Sub Category"
                  value={formData.subCategory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subCategory: e.target.value,
                    }))
                  }
                  fullWidth
                  placeholder="e.g., Frontend, Backend, DevOps"
                />
              </Box>

              <Box>
                <Typography gutterBottom>
                  Proficiency Level: {formData.proficiencyLevel}% (
                  {formData.proficiencyLabel})
                </Typography>
                <Slider
                  value={formData.proficiencyLevel}
                  onChange={(_, value) =>
                    handleProficiencyChange(value as number)
                  }
                  min={1}
                  max={100}
                  marks={[
                    { value: 25, label: "Beginner" },
                    { value: 50, label: "Intermediate" },
                    { value: 75, label: "Advanced" },
                    { value: 100, label: "Expert" },
                  ]}
                  sx={{
                    "& .MuiSlider-track": {
                      backgroundColor: getProficiencyColor(
                        formData.proficiencyLevel
                      ),
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: getProficiencyColor(
                        formData.proficiencyLevel
                      ),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Years of Experience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsOfExperience: parseInt(e.target.value) || 0,
                    }))
                  }
                  fullWidth
                  inputProps={{ min: 0, max: 50 }}
                />
                <TextField
                  label="Last Used"
                  type="date"
                  value={formData.lastUsed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastUsed: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>

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
              />

              {/* Array fields */}
              {(["relatedSkills", "certifications", "projects"] as const).map(
                (field) => (
                  <Box key={field}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ textTransform: "capitalize" }}
                    >
                      {field === "relatedSkills" ? "Related Skills" : field}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        label={`Add ${
                          field === "relatedSkills"
                            ? "skill"
                            : field.slice(0, -1)
                        }`}
                        value={arrayInput[field]}
                        onChange={(e) =>
                          setArrayInput((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        onKeyPress={(e) =>
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
                        Add
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
                )
              )}

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
                !formData.name
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={20} />
              ) : editingSkill ? (
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
          <DialogTitle>Delete Skill</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this skill? This action cannot be
              undone.
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
