"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import { ResponsiveBackground } from "~/ScrollingSections";
import {
  ErrorOutline as ErrorOutlineIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";

/**
 * Custom Not Found Page for Invalid/Expired Custom Intake Links
 */
export default function CustomLinkNotFound() {
  const t = useTranslations("intake");

  return (
    <ResponsiveBackground>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          px: 2,
        }}
      >
        <MotionWrapper>
          <Card
            sx={{
              maxWidth: 600,
              width: "100%",
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Stack spacing={3} alignItems="center">
                <ErrorOutlineIcon
                  sx={{ fontSize: 80, color: "error.main", mb: 1 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {t("customLink.notFound.title") || "Custom Link Not Found"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("customLink.notFound.description") ||
                    "The custom intake link you're trying to access is either invalid, expired, or no longer exists."}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("customLink.notFound.help") ||
                    "Please schedule a meeting to receive a new custom intake form link, or contact us directly."}
                </Typography>
                <Box sx={{ pt: 2 }}>
                  <Button
                    component={Link}
                    href="/meeting"
                    variant="contained"
                    size="large"
                    startIcon={<CalendarTodayIcon />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {t("customLink.notFound.scheduleMeeting") ||
                      "Schedule a Meeting"}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </MotionWrapper>
      </Box>
    </ResponsiveBackground>
  );
}
