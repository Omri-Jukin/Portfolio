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
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  FormLabel,
  Paper,
  Grid,
} from "@mui/material";
import {
  Language as LanguageIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
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
  onGenerateDocuments,
  isLoading = false,
  selectedLanguage = "en",
}) => {
  const t = useTranslations("resume");
  const [localSelectedLanguage, setLocalSelectedLanguage] =
    useState(selectedLanguage);
  const [documentTypes, setDocumentTypes] = useState({
    condensedResume: true,
    technicalPortfolio: false,
  });
  const [customization, setCustomization] = useState({
    includeCodeExamples: true,
    includeTechnicalChallenges: true,
    includeArchitectureDetails: true,
  });

  const handleLanguageClick = (languageCode: string) => {
    const language = languages.find((lang) => lang.code === languageCode);
    if (language?.available) {
      setLocalSelectedLanguage(languageCode);
      onLanguageSelect?.(languageCode);
    }
  };

  const handleDocumentTypeChange = (type: keyof typeof documentTypes) => {
    setDocumentTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleCustomizationChange = (
    field: keyof typeof customization,
    value: string | boolean
  ) => {
    setCustomization((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateDocuments = () => {
    const selectedTypes = Object.entries(documentTypes)
      .filter(([, selected]) => selected)
      .map(([type]) => type);

    if (selectedTypes.length === 0) {
      alert("Please select at least one document type");
      return;
    }

    onGenerateDocuments?.({
      language: localSelectedLanguage,
      documentTypes: selectedTypes,
      customization,
    });
  };

  const getSelectedDocumentTypes = () => {
    return Object.entries(documentTypes)
      .filter(([, selected]) => selected)
      .map(([type]) => type);
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
        <Card
          sx={{
            backgroundColor: "background.paper",
            mb: 4,
            opacity: isLoading ? 0.5 : 0.8,
          }}
        >
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

            {/* Document Type Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SettingsIcon sx={{ mr: 1 }} />
                {t("languageSelector.documentGeneration.title")}
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">
                  {t("languageSelector.documentGeneration.selectTypes")}
                </FormLabel>
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid component="div">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={documentTypes.condensedResume}
                            onChange={() =>
                              handleDocumentTypeChange("condensedResume")
                            }
                            color="primary"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <DescriptionIcon color="primary" />
                            <Typography>
                              {t(
                                "languageSelector.documentGeneration.condensedResume"
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid component="div">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={documentTypes.technicalPortfolio}
                            onChange={() =>
                              handleDocumentTypeChange("technicalPortfolio")
                            }
                            color="primary"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CodeIcon color="primary" />
                            <Typography>
                              {t(
                                "languageSelector.documentGeneration.technicalPortfolio"
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>

              {/* Customization Options */}
              {documentTypes.technicalPortfolio && (
                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: "bold" }}
                  >
                    {t(
                      "languageSelector.documentGeneration.portfolioCustomization"
                    )}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid component="div">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={customization.includeCodeExamples}
                            onChange={(e) =>
                              handleCustomizationChange(
                                "includeCodeExamples",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label={t(
                          "languageSelector.documentGeneration.includeCodeExamples"
                        )}
                      />
                    </Grid>
                    <Grid component="div">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={customization.includeTechnicalChallenges}
                            onChange={(e) =>
                              handleCustomizationChange(
                                "includeTechnicalChallenges",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label={t(
                          "languageSelector.documentGeneration.includeTechnicalChallenges"
                        )}
                      />
                    </Grid>
                    <Grid component="div">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={customization.includeArchitectureDetails}
                            onChange={(e) =>
                              handleCustomizationChange(
                                "includeArchitectureDetails",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label={t(
                          "languageSelector.documentGeneration.includeArchitectureDetails"
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Selected Options Summary */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Selected:</strong>{" "}
                  {getSelectedDocumentTypes()
                    .map((type) =>
                      type === "condensedResume"
                        ? "Condensed Resume"
                        : "Technical Portfolio"
                    )
                    .join(", ")}
                </Typography>
                <Typography variant="body2">
                  <strong>Output:</strong> Individual PDF files for each
                  selected document type
                </Typography>
                <Typography variant="body2">
                  <strong>Language:</strong> {getSelectedLanguage().name}
                </Typography>
              </Alert>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Generate Documents Button */}
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
                onClick={handleGenerateDocuments}
                disabled={isLoading || getSelectedDocumentTypes().length === 0}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  minWidth: 200,
                  backgroundColor: "success.main",
                  "&:hover": {
                    backgroundColor: "success.dark",
                  },
                }}
              >
                {isLoading
                  ? "Generating Documents..."
                  : `Generate ${
                      getSelectedDocumentTypes().length > 1
                        ? "Both Documents"
                        : "Document"
                    }`}
              </Button>

              <Typography
                variant="caption"
                sx={{ display: "block", mt: 2, color: "text.secondary" }}
              >
                Will create {getSelectedDocumentTypes().length} separate PDF
                file{getSelectedDocumentTypes().length > 1 ? "s" : ""}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </ResumeLanguageSelectorStyle>
    </MotionWrapper>
  );
};

export default ResumeLanguageSelector;
