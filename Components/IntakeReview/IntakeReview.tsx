"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  IconButton,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Note as NoteIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Alarm as AlarmIcon,
  AttachMoney as AttachMoneyIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { api } from "$/trpc/client";
import { ResponsiveBackground } from "~/ScrollingSections";
import type {
  IntakeData,
  IntakeListItem,
  ContactInfo,
  OrganizationInfo,
  ProjectInfo,
  AdditionalInfo,
} from "./IntakeReview.type";
import type { IntakeStatus, IntakeRiskLevel } from "$/db/schema/schema.types";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  URGENCY_COLORS,
  RISK_LEVEL_COLORS,
} from "./IntakeReview.const";
import { formatDateTimeDDMMYYYY } from "./dateUtils";

interface IntakeReviewProps {
  intakeId?: string;
  intakes: IntakeListItem[];
  selectedIntake?: IntakeData;
  loadingIntake: boolean;
  intakeError: Error | null;
  onIntakeSelect: (id: string) => void;
  onBackToCards?: () => void;
}

export default function IntakeReview({
  intakeId,
  intakes,
  selectedIntake,
  loadingIntake,
  intakeError,
  onIntakeSelect,
  onBackToCards,
}: IntakeReviewProps) {
  const router = useRouter();

  // Notes form state
  const [noteText, setNoteText] = useState("");
  const [noteCategory, setNoteCategory] = useState<string>("general");
  const [addingNote, setAddingNote] = useState(false);

  // Advanced features state
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [reminderDate, setReminderDate] = useState<string>("");
  const [estimatedValue, setEstimatedValue] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");

  // Mutations
  const updateStatusMutation = api.intakes.updateStatus.useMutation();
  const toggleFlagMutation = api.intakes.toggleFlag.useMutation();
  const addNoteMutation = api.intakes.addNote.useMutation();
  const deleteNoteMutation = api.intakes.deleteNote.useMutation();
  const setReminderMutation = api.intakes.setReminder.useMutation();
  const updateEstimatedValueMutation =
    api.intakes.updateEstimatedValue.useMutation();

  const utils = api.useUtils();

  // Find current index
  const currentIndex = intakes.findIndex((i) => i.id === intakeId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < intakes.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onIntakeSelect(intakes[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onIntakeSelect(intakes[currentIndex + 1].id);
    }
  };

  const handleToggleFlag = async () => {
    if (!intakeId) return;
    try {
      await toggleFlagMutation.mutateAsync({ id: intakeId });
      await utils.intakes.getAll.invalidate();
      await utils.intakes.getById.invalidate({ id: intakeId });
    } catch (error) {
      console.error("Failed to toggle flag:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!intakeId) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: intakeId,
        status: newStatus as IntakeStatus,
      });
      await utils.intakes.getAll.invalidate();
      await utils.intakes.getById.invalidate({ id: intakeId });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleAddNote = async () => {
    if (!intakeId || !noteText.trim()) return;

    setAddingNote(true);
    try {
      await addNoteMutation.mutateAsync({
        intakeId,
        note: noteText.trim(),
        category: noteCategory as
          | "general"
          | "follow-up"
          | "waiting-on-client"
          | "budget-concerns"
          | "technical-notes",
      });

      // Clear form
      setNoteText("");
      setNoteCategory("general");

      // Refresh data
      await utils.intakes.getById.invalidate({ id: intakeId });
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!intakeId) return;

    try {
      await deleteNoteMutation.mutateAsync({ noteId });
      await utils.intakes.getById.invalidate({ id: intakeId });
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleSetReminder = async () => {
    if (!intakeId || !reminderDate) return;

    try {
      await setReminderMutation.mutateAsync({
        id: intakeId,
        reminderDate: new Date(reminderDate),
      });
      await utils.intakes.getAll.invalidate();
      await utils.intakes.getById.invalidate({ id: intakeId });
      setReminderDate("");
    } catch (error) {
      console.error("Failed to set reminder:", error);
    }
  };

  const handleClearReminder = async () => {
    if (!intakeId) return;

    try {
      await setReminderMutation.mutateAsync({
        id: intakeId,
        reminderDate: null,
      });
      await utils.intakes.getAll.invalidate();
      await utils.intakes.getById.invalidate({ id: intakeId });
    } catch (error) {
      console.error("Failed to clear reminder:", error);
    }
  };

  const handleUpdateValue = async () => {
    if (!intakeId) return;

    try {
      await updateEstimatedValueMutation.mutateAsync({
        id: intakeId,
        estimatedValue: estimatedValue ? parseInt(estimatedValue) : null,
        riskLevel: (riskLevel as IntakeRiskLevel) || null,
      });
      await utils.intakes.getAll.invalidate();
      await utils.intakes.getById.invalidate({ id: intakeId });
      setEstimatedValue("");
      setRiskLevel("");
    } catch (error) {
      console.error("Failed to update value:", error);
    }
  };

  if (loadingIntake) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (intakeError || !selectedIntake) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {intakeError?.message || "Failed to load intake details"}
        </Alert>
      </Container>
    );
  }

  // Parse intake data
  const data = selectedIntake.data;
  const contact = data.contact as ContactInfo;
  const org = data.org as OrganizationInfo | undefined;
  const project = data.project as ProjectInfo;
  const additional = data.additional as AdditionalInfo | undefined;

  const urgencyColor = additional?.urgency
    ? URGENCY_COLORS[additional.urgency.toLowerCase()] || URGENCY_COLORS.medium
    : URGENCY_COLORS.medium;

  // Get client/customer name for breadcrumbs
  const clientName =
    contact?.fullName ||
    (contact?.firstName && contact?.lastName
      ? `${contact.firstName} ${contact.lastName}`
      : contact?.firstName || contact?.lastName || contact?.email || "Review");

  // Glassmorphism card style
  const cardStyle = {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  };

  function renderContent() {
    // Type guard - selectedIntake is guaranteed to be defined here
    if (!selectedIntake) return null;

    return (
      <Box>
        {/* Header with Breadcrumbs */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Breadcrumbs>
            <MuiLink
              href="/admin"
              sx={{ color: "text.primary", cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                router.push("/admin");
              }}
            >
              Admin
            </MuiLink>
            {onBackToCards ? (
              <MuiLink
                href="/admin/review"
                sx={{ color: "text.primary", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  onBackToCards();
                }}
              >
                Review
              </MuiLink>
            ) : (
              <MuiLink
                href="/admin/review"
                sx={{ color: "text.primary", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/admin/review");
                }}
              >
                Review
              </MuiLink>
            )}
            <Typography color="text.primary">{clientName}</Typography>
          </Breadcrumbs>
        </Box>

        {/* Navigation and Status Bar */}
        <Card sx={{ ...cardStyle, mb: 3, p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            {/* Navigation Buttons */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Previous Intake">
                <span>
                  <IconButton
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    size="small"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Next Intake">
                <span>
                  <IconButton
                    onClick={handleNext}
                    disabled={!hasNext}
                    size="small"
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {/* Intake Selector */}
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <Select
                value={intakeId || ""}
                onChange={(e) => onIntakeSelect(e.target.value)}
                displayEmpty
              >
                {intakes.map((intake) => (
                  <MenuItem key={intake.id} value={intake.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {intake.flagged && (
                        <StarIcon fontSize="small" color="warning" />
                      )}
                      <Typography variant="body2">{intake.name}</Typography>
                      <Chip
                        label={STATUS_LABELS[intake.status]}
                        size="small"
                        sx={{
                          bgcolor: STATUS_COLORS[intake.status],
                          color: "white",
                          fontSize: "0.7rem",
                        }}
                      />
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flex: 1 }} />

            {/* Flag Button */}
            <Tooltip title={selectedIntake.flagged ? "Unflag" : "Flag"}>
              <IconButton
                onClick={handleToggleFlag}
                color={selectedIntake.flagged ? "warning" : "default"}
              >
                {selectedIntake.flagged ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>

            {/* Status Selector */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedIntake.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                label="Status"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    <Chip
                      label={label}
                      size="small"
                      sx={{
                        bgcolor:
                          STATUS_COLORS[value as keyof typeof STATUS_COLORS],
                        color: "white",
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ ...cardStyle, mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(
                project.title
              )}`}
              onClick={() => handleStatusChange("contacted")}
            >
              Reply to Client
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              href={`mailto:${contact.email}?subject=Let's Schedule a Call&body=Hi ${contact.firstName},`}
            >
              Schedule Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<AssignmentIcon />}
              onClick={() => router.push(`/admin/intakes`)}
            >
              View in Old Admin
            </Button>
          </Stack>
        </Card>

        {/* Advanced Tools */}
        <Card sx={{ ...cardStyle, mb: 3, p: 2 }}>
          <Button
            fullWidth
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: showAdvancedTools ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.3s",
                }}
              />
            }
          >
            Advanced Tools
          </Button>

          {showAdvancedTools && (
            <Box sx={{ mt: 3 }}>
              <Stack spacing={3}>
                {/* Reminder Section */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AlarmIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2">Set Reminder</Typography>
                  </Stack>

                  {selectedIntake.reminderDate ? (
                    <Stack spacing={1}>
                      <Alert severity="info" sx={{ alignItems: "center" }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography variant="body2">
                            Reminder set for:{" "}
                            {formatDateTimeDDMMYYYY(
                              selectedIntake.reminderDate
                            )}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleClearReminder}
                            disabled={setReminderMutation.isPending}
                          >
                            Clear
                          </Button>
                        </Stack>
                      </Alert>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        type="datetime-local"
                        size="small"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        sx={{ flex: 1 }}
                        disabled={setReminderMutation.isPending}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleSetReminder}
                        disabled={
                          !reminderDate || setReminderMutation.isPending
                        }
                      >
                        Set Reminder
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Divider />

                {/* Value Estimation Section */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AttachMoneyIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2">
                      Project Value Estimation
                    </Typography>
                  </Stack>

                  {selectedIntake.estimatedValue || selectedIntake.riskLevel ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Box>
                          {selectedIntake.estimatedValue && (
                            <Typography variant="body2">
                              <strong>Estimated Value:</strong> $
                              {selectedIntake.estimatedValue.toLocaleString()}
                            </Typography>
                          )}
                          {selectedIntake.riskLevel && (
                            <Typography variant="body2">
                              <strong>Risk Level:</strong>{" "}
                              {selectedIntake.riskLevel}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setEstimatedValue(
                              selectedIntake.estimatedValue?.toString() || ""
                            );
                            setRiskLevel(selectedIntake.riskLevel || "");
                          }}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </Alert>
                  ) : null}

                  <Stack spacing={2}>
                    <TextField
                      label="Estimated Value ($)"
                      type="number"
                      size="small"
                      value={estimatedValue}
                      onChange={(e) => setEstimatedValue(e.target.value)}
                      placeholder={
                        selectedIntake.estimatedValue?.toString() ||
                        "e.g., 5000"
                      }
                      fullWidth
                      disabled={updateEstimatedValueMutation.isPending}
                    />
                    <FormControl size="small" fullWidth>
                      <InputLabel>Risk Level</InputLabel>
                      <Select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value)}
                        label="Risk Level"
                        disabled={updateEstimatedValueMutation.isPending}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="low">Low Risk</MenuItem>
                        <MenuItem value="medium">Medium Risk</MenuItem>
                        <MenuItem value="high">High Risk</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={handleUpdateValue}
                      disabled={
                        (!estimatedValue && !riskLevel) ||
                        updateEstimatedValueMutation.isPending
                      }
                    >
                      {updateEstimatedValueMutation.isPending
                        ? "Updating..."
                        : "Update Value"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        </Card>

        {/* Summary Card */}
        <Card
          sx={{
            ...cardStyle,
            mb: 3,
            p: 3,
            borderLeft: `4px solid ${urgencyColor}`,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {org?.name || `${contact.firstName} ${contact.lastName}`}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {additional?.urgency && (
                <Chip
                  label={`${additional.urgency} Priority`}
                  sx={{
                    bgcolor: urgencyColor,
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                />
              )}
              {selectedIntake.riskLevel && (
                <Chip
                  label={`${selectedIntake.riskLevel} Risk`}
                  sx={{
                    bgcolor: RISK_LEVEL_COLORS[selectedIntake.riskLevel],
                    color: "white",
                  }}
                />
              )}
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Key Metrics */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="h6">
                {typeof project.budget === "string"
                  ? project.budget
                  : selectedIntake.estimatedValue
                  ? `$${selectedIntake.estimatedValue}`
                  : "TBD"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Timeline
              </Typography>
              <Typography variant="h6">{project.timeline || "TBD"}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Preferred Contact
              </Typography>
              <Typography variant="h6">
                {additional?.preferredContactMethod || "Email"}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Contact Information */}
        <Card sx={{ ...cardStyle, mb: 3, p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Contact Information</Typography>
          </Stack>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography>{`${contact.firstName} ${contact.lastName}`}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography>
                <MuiLink href={`mailto:${contact.email}`}>
                  {contact.email}
                </MuiLink>
              </Typography>
            </Box>
            {contact.phone && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography>
                  <MuiLink href={`tel:${contact.phone}`}>
                    {contact.phone}
                  </MuiLink>
                </Typography>
              </Box>
            )}
          </Stack>
        </Card>

        {/* Organization (if present) */}
        {org && (
          <Card sx={{ ...cardStyle, mb: 3, p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <BusinessIcon color="primary" />
              <Typography variant="h6">Organization</Typography>
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography>{org.name}</Typography>
              </Box>
              {org.website && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Website
                  </Typography>
                  <Typography>
                    <MuiLink href={org.website} target="_blank">
                      {org.website}
                    </MuiLink>
                  </Typography>
                </Box>
              )}
              {org.industry && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Industry
                  </Typography>
                  <Typography>{org.industry}</Typography>
                </Box>
              )}
              {org.size && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Size
                  </Typography>
                  <Typography>{org.size}</Typography>
                </Box>
              )}
            </Stack>
          </Card>
        )}

        {/* Project Details */}
        <Card sx={{ ...cardStyle, mb: 3, p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6">Project Details</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Description
          </Typography>
          <Paper sx={{ p: 2, mb: 2, bgcolor: "action.hover" }}>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {project.description}
            </Typography>
          </Paper>

          {project.technologies && project.technologies.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Technologies
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {project.technologies.map((tech, idx) => (
                  <Chip
                    key={idx}
                    label={tech}
                    sx={{
                      bgcolor: "#667eea",
                      color: "white",
                      mb: 1,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {project.requirements && project.requirements.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Requirements
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {project.requirements.map((req, idx) => (
                  <Box component="li" key={idx} sx={{ mb: 0.5 }}>
                    <Typography variant="body2">{req}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {project.goals && project.goals.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Goals
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {project.goals.map((goal, idx) => (
                  <Box component="li" key={idx} sx={{ mb: 0.5 }}>
                    <Typography variant="body2">{goal}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Card>

        {/* Proposal */}
        <Card sx={{ ...cardStyle, mb: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Proposal
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: "action.hover",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              overflowX: "auto",
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {selectedIntake.proposalMd}
          </Paper>
        </Card>

        {/* Notes Section */}
        <Card sx={{ ...cardStyle, p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <NoteIcon color="primary" />
            <Typography variant="h6">Internal Notes</Typography>
          </Stack>

          {selectedIntake.notes && selectedIntake.notes.length > 0 ? (
            <Stack spacing={2} mb={2}>
              {selectedIntake.notes.map((note) => (
                <Paper key={note.id} sx={{ p: 2, bgcolor: "action.hover" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={note.category} size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTimeDDMMYYYY(note.createdAt)}
                      </Typography>
                    </Stack>
                    <Tooltip title="Delete note">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={deleteNoteMutation.isPending}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography>{note.note}</Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              No notes yet. Add your first note below.
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Add a note
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add internal note..."
            variant="outlined"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            disabled={addingNote}
          />
          <Stack direction="row" spacing={2} mt={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                label="Category"
                disabled={addingNote}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="waiting-on-client">Waiting on Client</MenuItem>
                <MenuItem value="budget-concerns">Budget Concerns</MenuItem>
                <MenuItem value="technical-notes">Technical Notes</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleAddNote}
              disabled={!noteText.trim() || addingNote}
            >
              {addingNote ? "Adding..." : "Add Note"}
            </Button>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <ResponsiveBackground>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
        {renderContent()}
      </Box>
    </ResponsiveBackground>
  );
}
