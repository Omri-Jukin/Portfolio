import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";

export const PortfolioContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const PortfolioHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(6),
}));

export const PortfolioTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

export const PortfolioSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: 1.6,
}));

export const ProjectCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const ProjectHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const ProjectTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

export const ProjectSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: "medium",
}));

export const ProjectDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  lineHeight: 1.6,
  color: theme.palette.text.primary,
}));

export const ProjectTech = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

export const ProjectActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "& > *": {
      width: "100%",
    },
  },
}));

export const AccordionRoot = styled(Accordion)(({ theme }) => ({
  "&:before": {
    display: "none",
  },
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const AccordionSummaryRoot = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    margin: theme.spacing(2, 0),
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const AccordionDetailsRoot = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const TechChip = styled(Chip)(({ theme }) => ({
  fontWeight: "medium",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

export const CodeExampleBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  fontFamily: "monospace",
  fontSize: "0.9rem",
  overflow: "auto",
  "& pre": {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
}));

export const ProblemSolution = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

export const ArchitectureSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  "& ul": {
    margin: 0,
    paddingLeft: theme.spacing(3),
  },
  "& li": {
    marginBottom: theme.spacing(0.5),
  },
}));

export const StyledList = styled("ul")(({ theme }) => ({
  margin: theme.spacing(1, 0),
  paddingLeft: theme.spacing(2.5),
}));
