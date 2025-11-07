"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { api } from "#/lib/trpc/client";
import { format } from "date-fns";

export default function EducationAdminPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch education data
  const {
    data: educationData = [],
    isLoading,
    error,
    refetch,
  } = api.education.getAllAdmin.useQuery();

  // Mutations
  const deleteMutation = api.education.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const toggleVisibilityMutation = api.education.toggleVisibility.useMutation({
    onSuccess: () => refetch(),
  });

  // Note: Featured functionality removed as it's not in the database schema

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this education record?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate({ id });
  };

  // Note: Featured functionality removed as it's not in the database schema

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM yyyy");
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

  if (error) {
    return (
      <Alert severity="error">
        Error loading education data: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Education Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Education
        </Button>
      </Box>

      <Grid container spacing={3}>
        {educationData.map((education) => (
          <Grid sx={{ xs: 12, md: 6, lg: 4 }} key={education.id}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2}
                >
                  <Typography variant="h6" component="h2">
                    {education.degree}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleVisibility(education.id)}
                      color={education.isVisible ? "primary" : "default"}
                    >
                      {education.isVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                    {/* Featured functionality removed as it's not in the database schema */}
                    <IconButton
                      size="small"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(education.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {education.institution}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {education.location}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDate(education.startDate)} -{" "}
                  {education.endDate
                    ? formatDate(education.endDate)
                    : "Present"}
                </Typography>

                {education.gpa && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    GPA: {education.gpa}
                  </Typography>
                )}

                <Box mt={2}>
                  <Chip
                    label={education.degreeType}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={education.status}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {education.isVisible && (
                    <Chip
                      label="Visible"
                      size="small"
                      color="success"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  {/* Featured functionality removed as it's not in the database schema */}
                </Box>

                {education.achievements.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Achievements:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {education.achievements.slice(0, 2).join(", ")}
                      {education.achievements.length > 2 && "..."}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {educationData.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No education records found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click &quot;Add Education&quot; to create your first education
            record
          </Typography>
        </Box>
      )}

      {/* Create/Edit Dialog - Simplified for now */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isCreateDialogOpen ? "Add Education" : "Edit Education"}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Education management form will be implemented in the next iteration.
            For now, you can manage education data directly through the
            database.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
