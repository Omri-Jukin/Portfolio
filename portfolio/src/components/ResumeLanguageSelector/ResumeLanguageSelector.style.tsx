import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const ResumeLanguageSelectorStyle = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",

  "& .MuiChip-root": {
    fontSize: "0.9rem",
    fontWeight: 500,
  },

  "& .MuiChip-filled": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },

  "& .MuiChip-outlined": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },

  // Flag icon styles
  "& .fi": {
    display: "inline-block",
    width: "1.2em",
    height: "1.2em",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    verticalAlign: "middle",
  },
}));
