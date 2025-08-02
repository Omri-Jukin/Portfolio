"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Language as LanguageIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { ResumeLanguageSelectorProps } from "./ResumeLanguageSelector.type";
import { ResumeLanguageSelectorStyle } from "./ResumeLanguageSelector.style";
import "flag-icons/css/flag-icons.min.css";

const languages = [
  {
    code: "en",
    name: "English",
    flag: "us",
    nativeName: "English",
    available: true,
  },
  {
    code: "es",
    name: "Spanish",
    flag: "es",
    nativeName: "Español",
    available: true,
  },
  {
    code: "fr",
    name: "French",
    flag: "fr",
    nativeName: "Français",
    available: false,
  },
  {
    code: "he",
    name: "Hebrew",
    flag: "il",
    nativeName: "עברית",
    available: false,
  },
];

const ResumeLanguageSelector: React.FC<ResumeLanguageSelectorProps> = ({
  onLanguageSelect,
  onDownload,
  isLoading = false,
  selectedLanguage = "en",
}) => {
  const t = useTranslations("resume");
  const [localSelectedLanguage, setLocalSelectedLanguage] =
    useState(selectedLanguage);

  const handleLanguageClick = (languageCode: string) => {
    const language = languages.find((lang) => lang.code === languageCode);
    if (language?.available) {
      setLocalSelectedLanguage(languageCode);
      onLanguageSelect?.(languageCode);
    }
  };

  const handleDownload = () => {
    onDownload?.(localSelectedLanguage);
  };

  const getSelectedLanguage = () => {
    return (
      languages.find((lang) => lang.code === localSelectedLanguage) ||
      languages[0]
    );
  };

  return (
    <MotionWrapper variant="fadeIn" duration={0.8} delay={0.4}>
      <ResumeLanguageSelectorStyle>
        <Card sx={{ backgroundColor: "background.paper", mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <LanguageIcon
                sx={{ color: "primary.main", mr: 2, fontSize: "2rem" }}
              />
              <Typography
                variant="h5"
                component="h2"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                {t("languageSelector.title")}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
              {t("languageSelector.description")}
            </Typography>

            {/* Language Options */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mb: 4, flexWrap: "wrap", gap: 2 }}
            >
              {languages.map((language) => (
                <Chip
                  key={language.code}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span
                        className={`fi fi-${language.flag}`}
                        style={{ fontSize: "1.2rem" }}
                      ></span>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {language.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                          }}
                        >
                          {language.nativeName}
                        </Typography>
                        {!language.available && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "warning.main",
                              fontWeight: "bold",
                              fontSize: "0.7rem",
                            }}
                          >
                            Coming Soon
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                  onClick={() => handleLanguageClick(language.code)}
                  variant={
                    localSelectedLanguage === language.code
                      ? "filled"
                      : "outlined"
                  }
                  color={
                    localSelectedLanguage === language.code
                      ? "primary"
                      : "default"
                  }
                  disabled={!language.available}
                  sx={{
                    minHeight: 60,
                    px: 2,
                    py: 1,
                    cursor: language.available ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                    opacity: language.available ? 1 : 0.6,
                    "&:hover": {
                      transform: language.available
                        ? "translateY(-2px)"
                        : "none",
                      boxShadow: language.available ? 2 : 0,
                    },
                    "&.MuiChip-filled": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.6,
                    },
                  }}
                />
              ))}
            </Stack>

            {/* Selected Language Display */}
            <Alert
              severity="info"
              sx={{
                mb: 3,
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                "& .MuiAlert-icon": {
                  color: "primary.contrastText",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon />
                <Typography variant="body2">
                  {t("languageSelector.selectedLanguage")}{" "}
                  <strong>{getSelectedLanguage().name}</strong> (
                  <span
                    className={`fi fi-${getSelectedLanguage().flag}`}
                    style={{ fontSize: "1rem" }}
                  ></span>
                  )
                </Typography>
              </Box>
            </Alert>

            <Divider sx={{ my: 3 }} />

            {/* Download Button */}
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={handleDownload}
                disabled={isLoading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  minWidth: 200,
                }}
              >
                {isLoading
                  ? "Generating PDF..."
                  : `${t("languageSelector.download")} ${
                      getSelectedLanguage().name
                    }`}
              </Button>

              <Typography
                variant="caption"
                sx={{ display: "block", mt: 2, color: "text.secondary" }}
              >
                {t("languageSelector.downloadDescription")}{" "}
                {getSelectedLanguage().name}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </ResumeLanguageSelectorStyle>
    </MotionWrapper>
  );
};

export default ResumeLanguageSelector;
