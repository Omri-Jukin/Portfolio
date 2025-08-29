import { styled } from "@mui/material/styles";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

export const CertificationsContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  padding: theme.spacing(8, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(6, 1),
    minHeight: "auto",
  },
}));

export const CertificationsTitle = styled(Typography)(({ theme }) => ({
  fontSize: "3.5rem",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  position: "relative",
  zIndex: 1,

  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

export const CertificationsSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  textAlign: "center",
  marginBottom: theme.spacing(6),
  color: theme.palette.text.secondary,
  maxWidth: "600px",
  lineHeight: 1.6,
  position: "relative",
  zIndex: 1,

  [theme.breakpoints.down("md")]: {
    fontSize: "1.1rem",
    marginBottom: theme.spacing(4),
  },
}));

export const CertificationsSwiperContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  position: "relative",
  zIndex: 1,

  "& .swiper": {
    paddingBottom: theme.spacing(4),
  },

  "& .swiper-pagination": {
    "& .swiper-pagination-bullet": {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.5,
      "&.swiper-pagination-bullet-active": {
        opacity: 1,
      },
    },
  },
}));

export const CertificationCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "visible",

  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 40px rgba(0, 0, 0, 0.3)"
        : "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${theme.palette.primary.main}40`,
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  },
}));

export const CertificationContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  height: "100%",

  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

export const CertificationHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

export const CertificationIcon = styled(Box)(({ theme }) => ({
  fontSize: "2rem",
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
}));

export const CertificationName = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}));

export const CertificationIssuer = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.primary.main,
  fontWeight: "medium",
  marginBottom: theme.spacing(1),
}));

export const CertificationDate = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const CertificationDescription = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
  flex: 1,
}));

export const CertificationSkills = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: "auto",
}));

export const SkillChip = styled(Chip)<{ category: string }>(({ category }) => ({
  fontSize: "0.75rem",
  height: "24px",
  backgroundColor: `${
    CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS[
      category as keyof typeof CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS
    ]
  }20`,
  color:
    CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS[
      category as keyof typeof CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS
    ],
  border: `1px solid ${
    CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS[
      category as keyof typeof CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS
    ]
  }40`,

  "&:hover": {
    backgroundColor: `${
      CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS[
        category as keyof typeof CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS
      ]
    }30`,
  },
}));

export const CategoryBadge = styled(Chip)<{ category: string }>(
  ({ theme, category }) => ({
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor:
      CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS[
        category as keyof typeof CERTIFICATIONS_CONSTANTS.CATEGORY_COLORS
      ],
    color: "white",
    fontSize: "0.75rem",
    height: "24px",
    fontWeight: "medium",

    "& .MuiChip-label": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  })
);

export const VerificationLink = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),

  "& a": {
    color: theme.palette.primary.main,
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: "medium",
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),

    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

// Import the constants to fix the undefined reference
import { CERTIFICATIONS_CONSTANTS } from "./Certifications.const";
