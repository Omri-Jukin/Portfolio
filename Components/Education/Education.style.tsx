import { styled } from "@mui/material/styles";
import { Box, Typography, Card, Chip, List, ListItem, Button } from "@mui/material";
import { HOME_SECTION_WIDTH } from "$/constants";

export const EducationContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: HOME_SECTION_WIDTH,
  margin: "0 auto",
  padding: theme.spacing(3, 2, 5),
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4, 3, 6),
  },
}));

export const EducationContent = styled(Box)(() => ({
  width: "100%",
}));

export const EducationHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

export const EducationTitle = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const EducationSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
}));

export const EducationDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1.05rem",
  color: theme.palette.text.secondary,
  maxWidth: "760px",
  margin: "0 auto",
  lineHeight: 1.65,
}));

export const EducationSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.35rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

export const DegreeCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
}));

export const DegreeHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const DegreeTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const InstitutionName = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

export const DegreeDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const DetailChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  borderColor: theme.palette.divider,
}));

export const AchievementList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: 0,
}));

export const AchievementItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  color: theme.palette.text.secondary,
  display: "list-item",
  listStyleType: "disc",
  marginLeft: theme.spacing(2.5),
}));

export const CourseworkGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const CourseChip = styled(Chip)(({ theme }) => ({
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,
}));

export const CertificationCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
}));

export const CertificationHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  flexWrap: "wrap",
}));

export const CertificationName = styled(Typography)(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const CertificationStatus = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontSize: "0.75rem",
}));

export const CertificationDetails = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.92rem",
}));

export const CTAButton = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(4),
}));

export const EducationCTAButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: theme.spacing(1),
}));
