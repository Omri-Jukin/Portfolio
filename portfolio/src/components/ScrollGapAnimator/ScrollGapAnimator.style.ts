import { SxProps, Theme } from "@mui/material";

export const ScrollGapAnimatorStyle = {
  container: (height: number): SxProps<Theme> => ({
    height: `${height}px`,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    overflowX: "hidden",
    padding: "2rem 0",
    "& .gap-content": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      zIndex: 1,
    },
    "& .gap-text": {
      color: "text.secondary",
      marginBottom: 2,
      opacity: 0.7,
    },
    "& .floating-elements": {
      position: "relative",
      display: "flex",
      gap: 2,
    },
    "& .floating-dot": {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "primary.main",
      opacity: 0.6,
    },
    "& .progress-line": {
      width: "200px",
      height: "2px",
      backgroundColor: "primary.main",
      transformOrigin: "left",
    },
    "& .rotating-skill-tags": {
      position: "relative",
      width: "120px",
      height: "120px",
    },
    "& .skill-tag": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "0.75rem",
      color: "text.secondary",
      opacity: 0.8,
      whiteSpace: "nowrap",
    },
    "& .particle-system": {
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.1) 50%, transparent 70%)",
      backgroundSize: "200% 200%",
    },
    "& .pulse-circle": {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      border: "2px solid",
      borderColor: "primary.main",
      opacity: 0.5,
    },
    "& .default-animation": {
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent 30%, rgba(25, 118, 210, 0.05) 50%, transparent 70%)",
      backgroundSize: "200% 100%",
    },
  }),
};
