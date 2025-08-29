import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, Chip } from "@mui/material";

export const ResumeContainer = styled(Box)(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const ResumePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const ResumeHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

export const ResumeTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

export const ResumeSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const ResumeDescription = styled(Typography)({
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: 1.6,
});

export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const SectionTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

export const LanguageCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

export const LanguageFlag = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontSize: "2.5rem",
}));

export const LanguageName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const SkillChip = styled(Chip)({
  marginBottom: 16,
  fontWeight: "medium",
});

export const ContactInfo = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(2),
}));

export const ContactText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
