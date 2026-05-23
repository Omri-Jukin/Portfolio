"use client";

import React from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import PublicPageShell from "../PublicPageShell";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { CustomCalendlyWrapper } from "~/Calendly";

const MeetingPage: React.FC = () => {
  const t = useTranslations("calendly");
  const router = useRouter();

  const bookingDetails = t.raw("booking.details") as {
    duration: string;
    format: string;
    language: string;
    audience: string;
    timezone: string;
  };

  return (
    <PublicPageShell maxWidth="960px">
      <MotionWrapper variant="fadeInUp" duration={0.6}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {t("title")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, lineHeight: 1.65 }}>
              {t("description")}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Back
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          <Chip icon={<ScheduleIcon />} label={bookingDetails.duration} variant="outlined" />
          <Chip icon={<VideoCallIcon />} label={bookingDetails.format} variant="outlined" />
          <Chip label={bookingDetails.language} variant="outlined" />
          <Chip label={bookingDetails.timezone} variant="outlined" />
        </Stack>
      </MotionWrapper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: 1,
          borderColor: "divider",
          borderRadius: 1.5,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          {t("booking.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.65 }}>
          {t("booking.description")}
        </Typography>

        <CustomCalendlyWrapper
          url="https://calendly.com/omrijukin/30min"
          eventTitle={t("widget.title")}
          eventDescription={t("widget.description")}
          duration={bookingDetails.duration}
          timezone={bookingDetails.timezone}
          companyName="Omri Jukin"
        />
      </Paper>
    </PublicPageShell>
  );
};

export default MeetingPage;
