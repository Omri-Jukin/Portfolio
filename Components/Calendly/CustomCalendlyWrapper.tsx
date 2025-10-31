"use client";

import React, { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Paper, Stack, Chip } from "@mui/material";
import {
  AccessTime as TimeIcon,
  Language as LanguageIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

interface CustomCalendlyWrapperProps {
  url?: string;
  className?: string;
  eventTitle?: string;
  eventDescription?: string;
  duration?: string;
  timezone?: string;
  companyName?: string;
}

const CustomCalendlyWrapper = ({
  url = "https://calendly.com/omrijukin/30min",
  className = "custom-calendly-wrapper",
  eventTitle = "Introductory call - 30 min",
  eventDescription = "Let's discuss your project requirements and how I can help bring your vision to life.",
  duration = "30 min",
  timezone = "Israel Time (GMT+2)",
  companyName = "Omri Jukin",
}: CustomCalendlyWrapperProps) => {
  const theme = useTheme();
  const t = useTranslations("calendly");
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for Calendly events
  useEffect(() => {
    if (!isClient) return;

    const handleEventScheduled = (e: MessageEvent) => {
      // Check if this is a Calendly event
      if (e.data.event && e.data.event.indexOf("calendly") === 0) {
        const eventName = e.data.event;

        if (eventName === "calendly.event_scheduled") {
          const payload = e.data.payload;

          // Extract booking details
          const inviteeEmail = payload?.invitee?.email;
          const inviteeFirstName = payload?.invitee?.first_name;
          const inviteeLastName = payload?.invitee?.last_name;
          const eventUri = payload?.event?.uri;
          const inviteeUri = payload?.invitee?.uri;

          if (inviteeEmail && eventUri) {
            // Get locale from pathname
            const locale = pathname.split("/")[1] || "en";

            // Build intake URL with parameters
            const intakeUrl = new URL(
              `/${locale}/intake`,
              window.location.origin
            );
            intakeUrl.searchParams.set("inviteeEmail", inviteeEmail);
            intakeUrl.searchParams.set("eventUri", eventUri);
            if (inviteeFirstName) {
              intakeUrl.searchParams.set("inviteeFirstName", inviteeFirstName);
            }
            if (inviteeLastName) {
              intakeUrl.searchParams.set("inviteeLastName", inviteeLastName);
            }
            if (inviteeUri) {
              intakeUrl.searchParams.set("inviteeUri", inviteeUri);
            }

            // Redirect to intake form
            router.push(intakeUrl.pathname + intakeUrl.search);
          }
        }
      }
    };

    window.addEventListener("message", handleEventScheduled);

    return () => {
      window.removeEventListener("message", handleEventScheduled);
    };
  }, [isClient, router, pathname]);

  // Don't render until we're on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Paper
      className={className}
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        borderRadius: "20px",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow:
          "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        minHeight: { xs: "600px", md: "700px" },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
        },
      }}
    >
      {/* Left Section - Event Details */}
      <Box
        sx={{
          flex: { xs: "1", lg: "0 0 40%" },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          padding: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "300px", lg: "auto" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            filter: "blur(20px)",
          },
        }}
      >
        {/* Logo and Company */}
        <Box sx={{ mb: 4, position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={45}
              height={45}
              style={{
                borderRadius: "12px",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              opacity: 0.95,
              fontSize: "1.2rem",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {companyName}
          </Typography>
        </Box>

        {/* Event Details */}
        <Box sx={{ flex: 1, position: "relative", zIndex: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              lineHeight: 1.2,
              fontSize: { xs: "2rem", md: "2.4rem" },
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {eventTitle}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <TimeIcon sx={{ fontSize: "1.4rem", opacity: 0.9 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ opacity: 0.95, fontWeight: 600, fontSize: "1.1rem" }}
            >
              {duration}
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              lineHeight: 1.7,
              mb: 4,
              fontSize: "1.1rem",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            {eventDescription}
          </Typography>

          {/* Features */}
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <GroupIcon sx={{ fontSize: "1.2rem", opacity: 0.9 }} />
              </Box>
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, fontSize: "1rem", fontWeight: 500 }}
              >
                {t("booking.details.audienceDesc")}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <LanguageIcon sx={{ fontSize: "1.2rem", opacity: 0.9 }} />
              </Box>
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, fontSize: "1rem", fontWeight: 500 }}
              >
                {t("booking.details.languageDesc")}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Cookie Settings Link */}
        <Typography
          variant="caption"
          sx={{
            opacity: 0.7,
            fontSize: "0.8rem",
            textDecoration: "underline",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
            "&:hover": { opacity: 1 },
            transition: "opacity 0.2s ease",
          }}
        >
          Cookie settings
        </Typography>
      </Box>

      {/* Right Section - Calendly Widget */}
      <Box
        sx={{
          flex: { xs: "1", lg: "0 0 60%" },
          padding: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          minHeight: { xs: "400px", lg: "auto" },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("widget.title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.1rem", fontWeight: 400 }}
          >
            {t("widget.description")}
          </Typography>
        </Box>

        {/* Timezone Display */}
        <Box sx={{ mb: 3 }}>
          <Chip
            icon={<LanguageIcon sx={{ fontSize: "1.1rem" }} />}
            label={timezone}
            variant="outlined"
            size="medium"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              fontWeight: 500,
              fontSize: "0.9rem",
              height: 36,
              "& .MuiChip-icon": {
                color: theme.palette.primary.main,
              },
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          />
        </Box>

        {/* Calendly Widget */}
        <Box
          sx={{
            flex: 1,
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            minHeight: { xs: "450px", sm: "500px", md: "550px" },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
            },
          }}
        >
          <InlineWidget
            url={url}
            pageSettings={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              hideEventTypeDetails: true,
              hideLandingPageDetails: true,
              primaryColor: theme.palette.primary.main.replace("#", ""),
              textColor: theme.palette.text.primary.replace("#", ""),
              hideGdprBanner: true,
            }}
            styles={{
              width: "100%",
              height: "100%",
              minHeight: "600px",
              border: "none",
            }}
            prefill={{
              name: "",
              email: "",
              firstName: "",
              lastName: "",
            }}
          />
        </Box>

        {/* Powered by Calendly */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "6px 16px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            transform: "rotate(-2deg)",
            zIndex: 10,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          POWERED BY Calendly
        </Box>
      </Box>

      {/* Keyframes for animation */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
        }
      `}</style>
    </Paper>
  );
};

export default CustomCalendlyWrapper;
