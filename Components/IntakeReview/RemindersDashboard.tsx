"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Stack,
  Button,
  Tabs,
  Tab,
  Checkbox,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Alarm as AlarmIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  SelectAll as SelectAllIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { api } from "$/trpc/client";
import { ResponsiveBackground } from "~/ScrollingSections";
import { formatDateTimeDDMMYYYY } from "./dateUtils";
import { STATUS_COLORS, STATUS_LABELS } from "./IntakeReview.const";

export default function RemindersDashboard() {
  const router = useRouter();
  const [filter, setFilter] = useState<"upcoming" | "due" | "past" | "all">(
    "all"
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDate, setBulkDate] = useState<string>("");
  const [bulkAction, setBulkAction] = useState<"set" | "clear">("set");

  const {
    data: reminders,
    isLoading,
    refetch,
  } = api.intakes.getReminders.useQuery({ filter });

  const bulkSetMutation = api.intakes.bulkSetReminders.useMutation();
  const bulkClearMutation = api.intakes.bulkClearReminders.useMutation();

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (!reminders) return;
    if (selectedIds.size === reminders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reminders.map((r: { id: string }) => r.id)));
    }
  };

  const handleBulkAction = async () => {
    if (selectedIds.size === 0) return;

    try {
      if (bulkAction === "set") {
        if (!bulkDate) {
          alert("Please select a date for bulk reminder");
          return;
        }
        await bulkSetMutation.mutateAsync({
          intakeIds: Array.from(selectedIds),
          reminderDate: new Date(bulkDate),
        });
      } else {
        await bulkClearMutation.mutateAsync({
          intakeIds: Array.from(selectedIds),
        });
      }

      setSelectedIds(new Set());
      setBulkDate("");
      await refetch();
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const getReminderStatus = (reminderDate: string) => {
    const date = new Date(reminderDate);
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (date < dayAgo) return { label: "Past Due", color: "error" };
    if (date < now) return { label: "Due", color: "warning" };
    return { label: "Upcoming", color: "success" };
  };

  if (isLoading) {
    return (
      <ResponsiveBackground>
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
          <Typography>Loading reminders...</Typography>
        </Box>
      </ResponsiveBackground>
    );
  }

  const remindersList = reminders || [];
  const upcoming = remindersList.filter(
    (r: { reminderDate: string }) => new Date(r.reminderDate) > new Date()
  );
  const due = remindersList.filter((r: { reminderDate: string }) => {
    const date = new Date(r.reminderDate);
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return date < now && date >= dayAgo;
  });
  const past = remindersList.filter((r: { reminderDate: string }) => {
    const date = new Date(r.reminderDate);
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return date < dayAgo;
  });

  return (
    <ResponsiveBackground>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
            Reminders Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage follow-up reminders for project intakes
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Card sx={{ ...cardStyle, p: 2, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ScheduleIcon color="primary" />
              <Box>
                <Typography variant="h4">{upcoming.length}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Upcoming
                </Typography>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ ...cardStyle, p: 2, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AlarmIcon color="warning" />
              <Box>
                <Typography variant="h4">{due.length}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Due Now
                </Typography>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ ...cardStyle, p: 2, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <HistoryIcon color="error" />
              <Box>
                <Typography variant="h4">{past.length}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Past Due
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <Card sx={{ ...cardStyle, p: 3, mb: 3 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Bulk Actions ({selectedIds.size} selected)
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant={bulkAction === "set" ? "contained" : "outlined"}
                  onClick={() => setBulkAction("set")}
                  size="small"
                >
                  Set Reminder
                </Button>
                <Button
                  variant={bulkAction === "clear" ? "contained" : "outlined"}
                  onClick={() => setBulkAction("clear")}
                  size="small"
                >
                  Clear Reminders
                </Button>
                {bulkAction === "set" && (
                  <TextField
                    type="datetime-local"
                    size="small"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                )}
                <Button
                  variant="contained"
                  onClick={handleBulkAction}
                  disabled={
                    (bulkAction === "set" && !bulkDate) ||
                    bulkSetMutation.isPending ||
                    bulkClearMutation.isPending
                  }
                  startIcon={<CheckCircleIcon />}
                >
                  Apply
                </Button>
                <IconButton
                  onClick={() => setSelectedIds(new Set())}
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Filter Tabs */}
        <Card sx={{ ...cardStyle, mb: 3 }}>
          <Tabs
            value={filter}
            onChange={(_, newValue) =>
              setFilter(newValue as "upcoming" | "due" | "past" | "all")
            }
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={`All (${remindersList.length})`} value="all" />
            <Tab label={`Upcoming (${upcoming.length})`} value="upcoming" />
            <Tab label={`Due (${due.length})`} value="due" />
            <Tab label={`Past Due (${past.length})`} value="past" />
          </Tabs>
        </Card>

        {/* Reminders List */}
        {remindersList.length === 0 ? (
          <Card sx={{ ...cardStyle, p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No reminders found
            </Typography>
          </Card>
        ) : (
          <Stack spacing={2}>
            {remindersList.map(
              (reminder: {
                id: string;
                email: string;
                reminderDate: string;
                status: string;
                flagged: boolean;
                data: Record<string, unknown>;
              }) => {
                const statusInfo = getReminderStatus(reminder.reminderDate);
                const contact =
                  (reminder.data.contact as {
                    firstName?: string;
                    lastName?: string;
                  }) || {};
                const org = (reminder.data.org as { name?: string }) || {};
                const name =
                  org.name ||
                  `${contact.firstName || ""} ${
                    contact.lastName || ""
                  }`.trim() ||
                  reminder.email;

                return (
                  <Card
                    key={reminder.id}
                    sx={{
                      ...cardStyle,
                      p: 2,
                      borderLeft: `4px solid ${
                        STATUS_COLORS[
                          reminder.status as keyof typeof STATUS_COLORS
                        ] || "#666"
                      }`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Checkbox
                        checked={selectedIds.has(reminder.id)}
                        onChange={() => handleToggleSelect(reminder.id)}
                        size="small"
                      />
                      <Box sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="h6">{name}</Typography>
                          {reminder.flagged && (
                            <Chip
                              label="Flagged"
                              size="small"
                              color="warning"
                            />
                          )}
                          <Chip
                            label={
                              STATUS_LABELS[
                                reminder.status as keyof typeof STATUS_LABELS
                              ] || reminder.status
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                STATUS_COLORS[
                                  reminder.status as keyof typeof STATUS_COLORS
                                ] || "#666",
                              color: "white",
                            }}
                          />
                          <Chip
                            label={statusInfo.label}
                            size="small"
                            color={
                              statusInfo.color as
                                | "error"
                                | "warning"
                                | "success"
                            }
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Email: {reminder.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reminder:{" "}
                          {formatDateTimeDDMMYYYY(reminder.reminderDate)}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          router.push(`/admin/review?id=${reminder.id}`)
                        }
                      >
                        Review
                      </Button>
                    </Stack>
                  </Card>
                );
              }
            )}
          </Stack>
        )}

        {/* Select All Button */}
        {remindersList.length > 0 && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              startIcon={<SelectAllIcon />}
              onClick={handleSelectAll}
              size="small"
            >
              {selectedIds.size === remindersList.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </Box>
        )}
      </Box>
    </ResponsiveBackground>
  );
}
