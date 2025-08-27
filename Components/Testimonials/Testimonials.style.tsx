import { Typography } from "@mui/material";
import { Box, styled } from "@mui/material";

export const TestimonialsWrapper = styled(Box)({
  width: "100%",
  padding: "4rem 0",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  overflow: "hidden",
});

export const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontSize: "2.5rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: "3rem",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "4px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px",
  },
}));

export const TestimonialsContainer = styled(Box)({
  width: "100%",
  maxWidth: "100vw",
  margin: "0 auto",
  padding: "0 1rem",
  overflow: "hidden",
});

export const RollingContainer = styled(Box)({
  display: "flex",
  gap: "2rem",
  padding: "1rem 0",
  willChange: "transform",
});

export const TestimonialItem = styled(Box)({
  flexShrink: 0,
  width: "400px",
});

export const TestimonialCard = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  width: "100%",
  padding: "2.5rem 1.5rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(20px)",
  transition: "all 0.3s ease-in-out",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
});

export const TestimonialsQuote = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.25rem",
  fontWeight: 400,
  lineHeight: "1.8rem",
  marginBottom: "1.5rem",
  fontStyle: "italic",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-0.75rem",
    left: "50%",
    transform: "translateX(-50%)",
    width: "50px",
    height: "3px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px",
  },
}));

export const TestimonialsAuthor = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "1.1rem",
  fontWeight: 600,
  lineHeight: "1.4rem",
  marginBottom: "0.5rem",
}));

export const TestimonialsRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  fontWeight: 400,
  lineHeight: "1.3rem",
  marginBottom: "0.25rem",
}));

export const TestimonialsCompany = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.8rem",
  fontWeight: 500,
  lineHeight: "1.2rem",
  opacity: 0.8,
}));

export const ProgressContainer = styled(Box)({
  width: "200px",
  height: "4px",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  borderRadius: "2px",
  overflow: "hidden",
  position: "relative",
});

export const ProgressBar = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "2px",
  transition: "width 0.5s ease-in-out",
}));

export const NavigationDots = styled(Box)({
  display: "flex",
  gap: "0.75rem",
  justifyContent: "center",
  alignItems: "center",
});

export const Dot = styled(Box)<{ active: boolean }>(({ theme, active }) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: active
    ? theme.palette.primary.main
    : "rgba(255, 255, 255, 0.3)",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : "rgba(255, 255, 255, 0.5)",
    transform: "scale(1.2)",
  },
}));
