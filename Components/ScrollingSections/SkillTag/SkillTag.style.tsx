import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const StyledSkillTag = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[100]
      : theme.palette.grey[800],
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  margin: theme.spacing(0.5),
  textTransform: "uppercase",
  fontWeight: 700,
  fontSize: "0.9rem",
  letterSpacing: "0.5px",
  minHeight: "32px",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: "relative",
  overflow: "hidden",

  // Hover effects
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: `0 8px 25px ${theme.palette.primary.main}40, 0 4px 10px rgba(0,0,0,0.2)`,
    borderColor: theme.palette.primary.dark,
  },

  // Active/Click effects
  "&:active": {
    transform: "translateY(-1px) scale(1.02)",
    transition: "all 0.1s ease",
  },

  // Focus for accessibility
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
    transform: "translateY(-2px)",
  },

  // Glow effect on hover
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, ${theme.palette.primary.main}20 0%, transparent 70%)`,
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  },

  "&:hover::before": {
    opacity: 1,
  },

  // Ripple effect
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    borderRadius: "50%",
    background: `${theme.palette.primary.main}30`,
    transform: "translate(-50%, -50%)",
    transition: "width 0.6s, height 0.6s",
    pointerEvents: "none",
  },

  "&:active::after": {
    width: "300px",
    height: "300px",
    transition: "width 0.3s, height 0.3s",
  },
}));
