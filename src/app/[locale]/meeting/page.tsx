"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import { useRouter } from "next/navigation";
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as TimeIcon,
  Language as LanguageIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { ResponsiveBackground } from "~/ScrollingSections";
import { Typography as CustomTypography } from "~/Typography";
import { CustomCalendlyWrapper } from "~/Calendly";

export default function MeetingPage() {
  const t = useTranslations("calendly");
  const router = useRouter();

  const centered = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <ResponsiveBackground>
      <Box
        sx={{
          width: "100%",
          maxWidth: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MotionWrapper>
          <Box
            sx={{
              p: { xs: 2, md: 4 },
              maxWidth: "1400px",
              mx: "auto",
              width: "100%",
              flexDirection: "column",
              borderRadius: "12px",
              ...centered,
            }}
          >
            {/* Professional Header */}
            <Card
              sx={{
                mb: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <CustomTypography
                    variant="h1"
                    color="textPrimary"
                    sx={{
                      height: "100%",
                    }}
                  >
                    {t("title")}
                  </CustomTypography>
                  <CustomTypography
                    variant="h5"
                    color="textSecondary"
                    sx={{
                      maxWidth: "800px",
                      mx: "auto",
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {t("description")}
                  </CustomTypography>
                </Box>

                <Divider
                  sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }}
                />

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                  flexWrap="wrap"
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.back()}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "text.primary",
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.6)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Go Back
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Meeting Booking Section */}
            <Grid container spacing={4} sx={{ ...centered }}>
              {/* Booking Information */}
              <Grid columns={1} rowSpacing={2}>
                <Card
                  sx={{
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    boxShadow: "16px 16px 32px rgba(0, 0, 0, 0.1)",
                    ...centered,
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <CalendarIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "primary.main",
                            filter:
                              "drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))",
                          }}
                        />
                        <CustomTypography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("booking.title")}
                        </CustomTypography>
                      </Stack>

                      <CustomTypography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                          maxWidth: "900px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontWeight: 400,
                        }}
                      >
                        {t("booking.description")}
                      </CustomTypography>
                    </Box>

                    {/* Meeting Details Grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                        },
                        gap: 3,
                        mt: 4,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow:
                              "20px 20px 40px rgba(102, 126, 234, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <TimeIcon
                          sx={{
                            fontSize: "2rem",
                            color: "primary.main",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h5"
                          color="primary"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("booking.details.duration")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {t("booking.details.durationDesc")}
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(34, 197, 94, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "20px 20px 40px rgba(34, 197, 94, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <VideoCallIcon
                          sx={{
                            fontSize: "2rem",
                            color: "success.main",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h5"
                          color="success.main"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("booking.details.format")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {t("booking.details.formatDesc")}
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "20px 20px 40px rgba(239, 68, 68, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <LanguageIcon
                          sx={{
                            fontSize: "2rem",
                            color: "error.main",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h5"
                          color="error.main"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("booking.details.language")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {t("booking.details.languageDesc")}
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(168, 85, 247, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "20px 20px 40px rgba(168, 85, 247, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <GroupIcon
                          sx={{
                            fontSize: "2rem",
                            color: "secondary.main",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h5"
                          color="secondary.main"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("booking.details.audience")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {t("booking.details.audienceDesc")}
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Calendly Widget */}
              <Grid columns={1} rowSpacing={2}>
                <Card
                  sx={{
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    boxShadow: "16px 16px 32px rgba(0, 0, 0, 0.1)",
                    ...centered,
                  }}
                >
                  <CardContent sx={{ p: 5, width: "100%" }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <ScheduleIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "primary.main",
                            filter:
                              "drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))",
                          }}
                        />
                        <CustomTypography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("widget.title")}
                        </CustomTypography>
                      </Stack>

                      <CustomTypography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                          maxWidth: "900px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontWeight: 400,
                        }}
                      >
                        {t("widget.description")}
                      </CustomTypography>
                    </Box>

                    {/* Custom Calendly Widget */}
                    <CustomCalendlyWrapper
                      url="https://calendly.com/omrijukin/30min"
                      eventTitle={t("widget.title")}
                      eventDescription={t("widget.description")}
                      duration={t("booking.details.duration")}
                      timezone={(() => {
                        const now = new Date();
                        const israelTime = new Intl.DateTimeFormat("en-US", {
                          timeZone: "Asia/Jerusalem",
                          timeZoneName: "longOffset",
                        })
                          .formatToParts(now)
                          .find((part) => part.type === "timeZoneName")?.value;

                        return israelTime?.includes("GMT+3")
                          ? "Israel Time (GMT+3)"
                          : "Israel Time (GMT+2)";
                      })()}
                      companyName="Omri Jukin"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* What to Expect Section */}
              <Grid columns={1} rowSpacing={2}>
                <Card
                  sx={{
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent sx={{ p: 5, borderRadius: "12px" }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <CheckIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "success.main",
                            filter:
                              "drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))",
                          }}
                        />
                        <CustomTypography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(45deg, #22c55e 0%, #10b981 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("expectations.title")}
                        </CustomTypography>
                      </Stack>

                      <CustomTypography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                          maxWidth: "900px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontWeight: 400,
                        }}
                      >
                        {t("expectations.description")}
                      </CustomTypography>
                    </Box>

                    {/* Expectations List */}
                    <Box sx={{ mt: 4, borderRadius: "12px" }}>
                      {(
                        t.raw("expectations.items") as Array<{
                          title: string;
                          description: string;
                        }>
                      )?.map(
                        (
                          item: {
                            title: string;
                            description: string;
                          },
                          index: number
                        ) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 4,
                              mb: 3,
                              background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                              backdropFilter: "blur(15px)",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "12px",
                              position: "relative",
                              overflow: "hidden",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.1)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="flex-start"
                              spacing={3}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(45deg, #22c55e 0%, #10b981 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: 700,
                                  fontSize: "1.1rem",
                                  boxShadow:
                                    "4px 4px 12px rgba(34, 197, 94, 0.3)",
                                  flexShrink: 0,
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <CustomTypography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: "primary.main",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {item.title}
                                </CustomTypography>
                                <CustomTypography
                                  variant="body2"
                                  sx={{
                                    lineHeight: 1.6,
                                    fontWeight: 400,
                                    color: "text.primary",
                                  }}
                                >
                                  {item.description}
                                </CustomTypography>
                              </Box>
                            </Stack>
                          </Paper>
                        )
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </MotionWrapper>
      </Box>
    </ResponsiveBackground>
  );
}
