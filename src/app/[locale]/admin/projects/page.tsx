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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

import { api } from "$/trpc/client";
import { format } from "date-fns";
import type { Project, TechnicalChallenge, CodeExample } from "$/db/projects";
import { ClientOnly } from "~/ClientOnly";

interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: string[];
  categories: string[];
  status: "completed" | "in-progress" | "archived" | "concept";
  projectType: "professional" | "personal" | "open-source" | "academic";
  startDate: string;
  endDate: string;
  githubUrl: string;
  liveUrl: string;
  demoUrl: string;
  documentationUrl: string;
  images: string[];
  keyFeatures: string[];
  technicalChallenges: TechnicalChallenge[];
  codeExamples: CodeExample[];
  teamSize: number;
  myRole: string;
  clientName: string;
  budget: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  isOpenSource: boolean;
}

const defaultFormData: ProjectFormData = {
  title: "",
  subtitle: "",
  description: "",
  longDescription: "",
  technologies: [],
  categories: [],
  status: "completed",
  projectType: "personal",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  githubUrl: "",
  liveUrl: "",
  demoUrl: "",
  documentationUrl: "",
  images: [],
  keyFeatures: [],
  technicalChallenges: [],
  codeExamples: [],
  teamSize: 1,
  myRole: "",
  clientName: "",
  budget: "",
  displayOrder: 0,
  isVisible: true,
  isFeatured: false,
  isOpenSource: false,
};

export default function ProjectsAdminPage() {
  // Constants defined locally within the component
  const statusOptions = [
    { value: "completed", label: "Completed", color: "#4CAF50" },
    { value: "in-progress", label: "In Progress", color: "#FF9800" },
    { value: "archived", label: "Archived", color: "#607D8B" },
    { value: "concept", label: "Concept", color: "#9C27B0" },
  ];

  const projectTypeOptions = [
    { value: "professional", label: "Professional", color: "#2196F3" },
    { value: "personal", label: "Personal", color: "#4CAF50" },
    { value: "open-source", label: "Open Source", color: "#FF9800" },
    { value: "academic", label: "Academic", color: "#9C27B0" },
  ];

  // State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [arrayInput, setArrayInput] = useState({
    technologies: "",
    categories: "",
    keyFeatures: "",
    images: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [dialogTab, setDialogTab] = useState(0);

  // tRPC queries and mutations
  const {
    data: projects = [],
    isLoading,
    refetch,
  } = api.projects.getAllAdmin.useQuery();

  const { data: statistics, isLoading: statsLoading } =
    api.projects.getStatistics.useQuery();

  const createMutation = api.projects.create.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const updateMutation = api.projects.update.useMutation({
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const deleteMutation = api.projects.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteConfirmOpen(null);
    },
  });

  const toggleVisibilityMutation = api.projects.toggleVisibility.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const toggleFeaturedMutation = api.projects.toggleFeatured.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Handlers
  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        longDescription: project.longDescription || "",
        technologies: project.technologies || [],
        categories: project.categories || [],
        status: project.status,
        projectType: project.projectType,
        startDate: format(new Date(project.startDate), "yyyy-MM-dd"),
        endDate: project.endDate
          ? format(new Date(project.endDate), "yyyy-MM-dd")
          : "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        demoUrl: project.demoUrl || "",
        documentationUrl: project.documentationUrl || "",
        images: project.images || [],
        keyFeatures: project.keyFeatures || [],
        technicalChallenges: project.technicalChallenges || [],
        codeExamples: project.codeExamples || [],
        teamSize: project.teamSize || 1,
        myRole: project.myRole || "",
        clientName: project.clientName || "",
        budget: project.budget || "",
        displayOrder: project.displayOrder,
        isVisible: project.isVisible,
        isFeatured: project.isFeatured,
        isOpenSource: project.isOpenSource,
      });
    } else {
      setEditingProject(null);
      setFormData(defaultFormData);
    }
    setArrayInput({
      technologies: "",
      categories: "",
      keyFeatures: "",
      images: "",
    });
    setDialogTab(0);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    setFormData(defaultFormData);
    setArrayInput({
      technologies: "",
      categories: "",
      keyFeatures: "",
      images: "",
    });
    setDialogTab(0);
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

  const handleAddTechnicalChallenge = () => {
    setFormData((prev) => ({
      ...prev,
      technicalChallenges: [
        ...prev.technicalChallenges,
        { challenge: "", solution: "" },
      ],
    }));
  };

  const handleUpdateTechnicalChallenge = (
    index: number,
    field: "challenge" | "solution",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      technicalChallenges: prev.technicalChallenges.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc
      ),
    }));
  };

  const handleRemoveTechnicalChallenge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technicalChallenges: prev.technicalChallenges.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      longDescription: formData.longDescription || undefined,
      technologies: formData.technologies,
      categories: formData.categories,
      status: formData.status,
      projectType: formData.projectType,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
      demoUrl: formData.demoUrl || undefined,
      documentationUrl: formData.documentationUrl || undefined,
      images: formData.images,
      keyFeatures: formData.keyFeatures,
      technicalChallenges: formData.technicalChallenges,
      codeExamples: formData.codeExamples,
      teamSize: formData.teamSize || undefined,
      myRole: formData.myRole || undefined,
      clientName: formData.clientName || undefined,
      budget: formData.budget || undefined,
      displayOrder: formData.displayOrder,
      isVisible: formData.isVisible,
      isFeatured: formData.isFeatured,
      isOpenSource: formData.isOpenSource,
      titleTranslations: {},
      descriptionTranslations: {},
    };

    if (editingProject) {
      updateMutation.mutate({
        id: editingProject.id,
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

  const handleToggleFeatured = (id: string) => {
    toggleFeaturedMutation.mutate({ id });
  };

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((opt) => opt.value === status)?.color || "#607D8B"
    );
  };

  const getProjectTypeColor = (type: string) => {
    return (
      projectTypeOptions.find((opt) => opt.value === type)?.color || "#607D8B"
    );
  };

  const formatDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);

    if (months > 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years}y ${remainingMonths}m`;
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
            Projects Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Project
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
                      Featured
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalFeatured}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid component="div">
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Open Source
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalOpenSource}
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

        {/* Projects Grid */}
        <Grid container spacing={3}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {projects.map((project: any) => (
            <Grid component="div" key={project.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: project.isVisible ? 1 : 0.6,
                  border: project.isVisible ? "none" : "2px dashed #ccc",
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
                      <CodeIcon color="action" />
                      <Chip
                        label={
                          projectTypeOptions.find(
                            (type) => type.value === project.projectType
                          )?.label
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            getProjectTypeColor(project.projectType) + "20",
                          color: getProjectTypeColor(project.projectType),
                        }}
                      />
                      {project.isFeatured && (
                        <StarIcon color="primary" fontSize="small" />
                      )}
                      {project.isOpenSource && (
                        <GitHubIcon color="action" fontSize="small" />
                      )}
                    </Box>
                    <Chip
                      label={
                        statusOptions.find(
                          (opt) => opt.value === project.status
                        )?.label
                      }
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(project.status) + "20",
                        color: getStatusColor(project.status),
                      }}
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {project.title}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {project.subtitle}
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
                      {format(new Date(project.startDate), "MMM yyyy")} -{" "}
                      {project.endDate
                        ? format(new Date(project.endDate), "MMM yyyy")
                        : "Ongoing"}{" "}
                      ({formatDuration(project.startDate, project.endDate)})
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.description.length > 150
                      ? project.description.substring(0, 150) + "..."
                      : project.description}
                  </Typography>

                  {/* Links */}
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                  >
                    {project.githubUrl && (
                      <Chip
                        icon={<GitHubIcon />}
                        label="GitHub"
                        size="small"
                        variant="outlined"
                        clickable
                      />
                    )}
                    {project.liveUrl && (
                      <Chip
                        icon={<LaunchIcon />}
                        label="Live"
                        size="small"
                        variant="outlined"
                        color="primary"
                        clickable
                      />
                    )}
                    {project.demoUrl && (
                      <Chip
                        icon={<LinkIcon />}
                        label="Demo"
                        size="small"
                        variant="outlined"
                        clickable
                      />
                    )}
                  </Box>

                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Technologies ({project.technologies.length})
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {project.technologies
                              .slice(0, 5)
                              .map((tech: string, index: number) => (
                                <Chip
                                  key={index}
                                  label={tech}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            {project.technologies.length > 5 && (
                              <Chip
                                label={`+${
                                  project.technologies.length - 5
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
                            Key Features ({project.keyFeatures.length})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.keyFeatures.length} features documented
                          </Typography>
                        </Box>
                        {project.teamSize && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Team Size
                            </Typography>
                            <Chip
                              label={`${project.teamSize} ${
                                project.teamSize === 1 ? "person" : "people"
                              }`}
                              size="small"
                            />
                          </Box>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>

                <CardActions>
                  <Tooltip title={project.isVisible ? "Hide" : "Show"}>
                    <IconButton
                      onClick={() => handleToggleVisibility(project.id)}
                      color={project.isVisible ? "primary" : "default"}
                    >
                      {project.isVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={project.isFeatured ? "Unfeature" : "Feature"}>
                    <IconButton
                      onClick={() => handleToggleFeatured(project.id)}
                      color={project.isFeatured ? "primary" : "default"}
                    >
                      {project.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleOpenDialog(project)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setDeleteConfirmOpen(project.id)}
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
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {editingProject ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={dialogTab}
                onChange={(_, newValue) => setDialogTab(newValue)}
              >
                <Tab label="Basic Info" />
                <Tab label="Details" />
                <Tab label="Technical" />
              </Tabs>
            </Box>

            {/* Tab 0: Basic Info */}
            {dialogTab === 0 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
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

                <TextField
                  label="Long Description"
                  value={formData.longDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longDescription: e.target.value,
                    }))
                  }
                  fullWidth
                  multiline
                  rows={4}
                  helperText="Detailed project description for project pages"
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as typeof formData.status,
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

                  <FormControl fullWidth>
                    <InputLabel>Project Type</InputLabel>
                    <Select
                      value={formData.projectType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectType: e.target
                            .value as typeof formData.projectType,
                        }))
                      }
                      label="Project Type"
                    >
                      {projectTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    helperText="Leave empty for ongoing projects"
                  />
                </Box>
              </Box>
            )}

            {/* Tab 1: Details */}
            {dialogTab === 1 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="GitHub URL"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        githubUrl: e.target.value,
                      }))
                    }
                    fullWidth
                    type="url"
                  />
                  <TextField
                    label="Live URL"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        liveUrl: e.target.value,
                      }))
                    }
                    fullWidth
                    type="url"
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Demo URL"
                    value={formData.demoUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        demoUrl: e.target.value,
                      }))
                    }
                    fullWidth
                    type="url"
                  />
                  <TextField
                    label="Documentation URL"
                    value={formData.documentationUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documentationUrl: e.target.value,
                      }))
                    }
                    fullWidth
                    type="url"
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Team Size"
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        teamSize: parseInt(e.target.value) || 1,
                      }))
                    }
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    label="My Role"
                    value={formData.myRole}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        myRole: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Client Name"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Budget"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                    fullWidth
                    helperText="e.g., $10,000 or Pro Bono"
                  />
                </Box>

                {/* Array fields */}
                {(["technologies", "categories", "keyFeatures"] as const).map(
                  (field) => (
                    <Box key={field}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ textTransform: "capitalize" }}
                      >
                        {field === "keyFeatures" ? "Key Features" : field}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                          label={`Add ${
                            field === "keyFeatures"
                              ? "feature"
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
              </Box>
            )}

            {/* Tab 2: Technical */}
            {dialogTab === 2 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Technical Challenges
                  </Typography>
                  {formData.technicalChallenges.map((tc, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <TextField
                        label="Challenge"
                        value={tc.challenge}
                        onChange={(e) =>
                          handleUpdateTechnicalChallenge(
                            index,
                            "challenge",
                            e.target.value
                          )
                        }
                        fullWidth
                        sx={{ mb: 1 }}
                        multiline
                        rows={2}
                      />
                      <TextField
                        label="Solution"
                        value={tc.solution}
                        onChange={(e) =>
                          handleUpdateTechnicalChallenge(
                            index,
                            "solution",
                            e.target.value
                          )
                        }
                        fullWidth
                        multiline
                        rows={2}
                      />
                      <Button
                        onClick={() => handleRemoveTechnicalChallenge(index)}
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button
                    onClick={handleAddTechnicalChallenge}
                    variant="outlined"
                    startIcon={<AddIcon />}
                  >
                    Add Technical Challenge
                  </Button>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", gap: 2 }}>
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
                    label="Featured"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isOpenSource}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isOpenSource: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Open Source"
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formData.title ||
                !formData.subtitle ||
                !formData.description ||
                formData.technologies.length === 0 ||
                formData.categories.length === 0 ||
                formData.keyFeatures.length === 0
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={20} />
              ) : editingProject ? (
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
          <DialogTitle>Delete Project</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this project? This action cannot
              be undone.
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
