"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Stack,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  Star as StarIcon,
  Search as SearchIcon,
  Alarm as AlarmIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ResponsiveBackground } from "~/ScrollingSections";
import type { IntakeListItem } from "./IntakeReview.type";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  URGENCY_COLORS,
  RISK_LEVEL_COLORS,
} from "./IntakeReview.const";
import { formatDateDDMMYYYY } from "./dateUtils";

interface IntakeCardsProps {
  intakes: IntakeListItem[];
  onSelectIntake: (id: string) => void;
}

export default function IntakeCards({
  intakes,
  onSelectIntake,
}: IntakeCardsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Filter intakes - show only open ones (not declined/accepted) by default
  const openStatuses = ["new", "reviewing", "contacted", "proposal_sent"];
  const filteredIntakes = intakes.filter((intake) => {
    // Text search
    const matchesSearch =
      searchTerm === "" ||
      intake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intake.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(intake.status);

    // Show only open intakes by default (not declined/accepted)
    const isOpen =
      statusFilter.length > 0 || openStatuses.includes(intake.status);

    return matchesSearch && matchesStatus && isOpen;
  });

  const handleToggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
  };

  return (
    <ResponsiveBackground>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
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
            <Typography color="text.primary">Intake Review</Typography>
          </Breadcrumbs>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Project Intakes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and manage incoming project requests
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={() => router.push("/admin/review/reminders")}
              sx={{ mt: { xs: 2, sm: 0 } }}
            >
              View Reminders
            </Button>
          </Stack>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ ...cardStyle, mb: 3, p: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Status Filter Chips */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Filter by status (showing open intakes by default)
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <Chip
                    key={value}
                    label={label}
                    onClick={() => handleToggleStatus(value)}
                    sx={{
                      bgcolor: statusFilter.includes(value)
                        ? STATUS_COLORS[value as keyof typeof STATUS_COLORS]
                        : "rgba(255, 255, 255, 0.1)",
                      color: statusFilter.includes(value)
                        ? "white"
                        : "text.secondary",
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": {
                        bgcolor:
                          STATUS_COLORS[value as keyof typeof STATUS_COLORS],
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {statusFilter.length > 0 && (
              <Button
                size="small"
                onClick={() => setStatusFilter([])}
                sx={{ alignSelf: "flex-start" }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
        </Card>

        {/* Intake Cards Grid */}
        {filteredIntakes.length === 0 ? (
          <Card sx={{ ...cardStyle, p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No intakes found matching your filters
            </Typography>
            {statusFilter.length === 0 && searchTerm === "" && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                All open intakes are displayed here. Use filters to see closed
                intakes.
              </Typography>
            )}
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {filteredIntakes.map((intake) => {
              const urgencyColor = intake.urgency
                ? URGENCY_COLORS[intake.urgency.toLowerCase()] ||
                  URGENCY_COLORS.medium
                : URGENCY_COLORS.medium;

              return (
                <Card
                  key={intake.id}
                  sx={{
                    ...cardStyle,
                    borderLeft: `4px solid ${urgencyColor}`,
                  }}
                  onClick={() => onSelectIntake(intake.id)}
                >
                  <Box sx={{ p: 2 }}>
                    {/* Header with Flag */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {intake.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {intake.email}
                          </Typography>
                        </Stack>
                      </Box>
                      {intake.flagged && (
                        <Tooltip title="Flagged">
                          <StarIcon color="warning" />
                        </Tooltip>
                      )}
                    </Stack>

                    {/* Status Badge */}
                    <Chip
                      label={STATUS_LABELS[intake.status]}
                      size="small"
                      sx={{
                        bgcolor: STATUS_COLORS[intake.status],
                        color: "white",
                        fontWeight: 600,
                        mb: 2,
                      }}
                    />

                    {/* Metadata */}
                    <Stack spacing={1}>
                      {intake.urgency && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: urgencyColor,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {intake.urgency} Priority
                          </Typography>
                        </Stack>
                      )}

                      {intake.estimatedValue && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AttachMoneyIcon
                            fontSize="small"
                            sx={{ fontSize: 16 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ${intake.estimatedValue.toLocaleString()}
                          </Typography>
                        </Stack>
                      )}

                      {intake.riskLevel && (
                        <Chip
                          label={`${intake.riskLevel} Risk`}
                          size="small"
                          sx={{
                            bgcolor: RISK_LEVEL_COLORS[intake.riskLevel],
                            color: "white",
                            height: 20,
                            fontSize: "0.7rem",
                          }}
                        />
                      )}

                      {intake.reminderDate && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AlarmIcon fontSize="small" sx={{ fontSize: 16 }} />
                          <Typography variant="caption" color="text.secondary">
                            Reminder: {formatDateDDMMYYYY(intake.reminderDate)}
                          </Typography>
                        </Stack>
                      )}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Submitted: {formatDateDDMMYYYY(intake.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Summary Stats */}
        <Card sx={{ ...cardStyle, mt: 3, p: 3 }}>
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {filteredIntakes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {statusFilter.length > 0 ? "Filtered" : "Open"} Intakes
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {intakes.filter((i) => i.flagged).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Flagged
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {
                  intakes.filter(
                    (i) => i.status === "new" || i.status === "reviewing"
                  ).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Needs Review
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>
    </ResponsiveBackground>
  );
}
