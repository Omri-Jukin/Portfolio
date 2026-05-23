"use client";

import React from "react";
import {
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";

const RESUME_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "he", label: "עברית" },
] as const;

export interface ResumePdfToolbarProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onDownload: () => void;
  isGenerating: boolean;
  languageLabel: string;
  downloadLabel: string;
  generatingLabel: string;
}

const ResumePdfToolbar: React.FC<ResumePdfToolbarProps> = ({
  selectedLanguage,
  onLanguageChange,
  onDownload,
  isGenerating,
  languageLabel,
  downloadLabel,
  generatingLabel,
}) => (
  <MotionWrapper variant="slideUp" duration={0.5} delay={0.3}>
    <Card
      sx={{
        mb: 5,
        backgroundColor: "background.paper",
        opacity: isGenerating ? 0.7 : 1,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <FormControl sx={{ minWidth: 180 }} size="medium">
            <InputLabel id="resume-language-label">{languageLabel}</InputLabel>
            <Select
              labelId="resume-language-label"
              value={selectedLanguage}
              label={languageLabel}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              {RESUME_LANGUAGES.map(({ code, label }) => (
                <MenuItem key={code} value={code}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="large"
            startIcon={
              isGenerating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
            onClick={onDownload}
            disabled={isGenerating}
            sx={{
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {isGenerating ? generatingLabel : downloadLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </MotionWrapper>
);

export default ResumePdfToolbar;
