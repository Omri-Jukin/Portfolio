import { styled } from "@mui/material/styles";

export const StyledButton = styled("button")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
}));

export const StyledButtonIcon = styled("span")(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export const StyledButtonText = styled("span")(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export const CTA1Button = styled(StyledButton)(({ theme }) => ({
  width: "220px",
  height: "50px",
  border: "none",
  outline: "none",
  color: theme.palette.text.primary,
  background:
    theme.palette.mode === "dark"
      ? theme.palette.background.paper
      : theme.palette.background.default,
  cursor: "pointer",
  position: "relative",
  zIndex: 0,
  borderRadius: "10px",
  "&:before": {
    content: '""',
    background:
      "linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
    position: "absolute",
    top: "-2px",
    left: "-2px",
    backgroundSize: "400%",
    zIndex: -1,
    filter: "blur(5px)",
    width: "calc(100% + 4px)",
    height: "calc(100% + 4px)",
    animation: "glowing 20s linear infinite",
    opacity: 0,
    transition: "opacity .3s ease-in-out",
    borderRadius: "10px",
  },
  "&:active": {
    color: theme.palette.text.primary,
    "&:after": {
      background: "transparent",
    },
  },
  "&:hover:before": {
    opacity: 1,
    "&:after": {
      background: "transparent",
    },
  },
  "&:after": {
    zIndex: -1,
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    background: theme.palette.background.paper,
    left: "0",
    top: "0",
    borderRadius: "10px",
  },
  "@keyframes glowing": {
    "0%": { backgroundPosition: "0 0" },
    "50%": { backgroundPosition: "400% 0" },
    "100%": { backgroundPosition: "0 0" },
  },
}));
