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

export const CTA1Button = styled(StyledButton)(() => ({
  width: "220px",
  height: "50px",
  border: "none",
  outline: "none",
  color: "#fff",
  background: "#111",
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
    color: "#000",
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
    background: "#111",
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

// export const CTA2Button = styled(StyledButton)(({ theme }) => ({
//   position: "relative",
//   padding: "1.4rem 4.2rem",
//   paddingRight: "3.1rem",
//   fontSize: "1.4rem",
//   color: theme.palette.text.primary,
//   letterSpacing: "1.1rem",
//   textTransform: "uppercase",
//   transition: "all 500ms cubic-bezier(0.77, 0, 0.175, 1)",
//   cursor: "pointer",
//   userSelect: "none",
//   "&:before, &:after": {
//     content: '""',
//     position: "absolute",
//     transition: "inherit",
//     zIndex: -1,
//   },
//   "&:hover": {
//     color: theme.palette.text.primary,
//     transitionDelay: ".5s",
//   },
//   "&:before": {
//     top: 0,
//     left: "50%",
//     height: "100%",
//     width: 0,
//     border: `1px solid ${theme.palette.text.primary}`,
//     borderLeft: "0",
//     borderRight: "0",
//   },
//   "&:after": {
//     bottom: 0,
//     left: 0,
//     height: 0,
//     width: "100%",
//     background: theme.palette.text.primary,
//   },
//   "&:hover:before": {
//     left: 0,
//     width: "100%",
//   },
//   "&:hover:after": {
//     top: 0,
//     height: "100%",
//   },
// }));
