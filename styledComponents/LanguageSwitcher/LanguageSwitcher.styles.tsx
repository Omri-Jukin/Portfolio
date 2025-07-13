import { styled } from "@mui/material/styles";
import Button, { buttonClasses } from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

export const StyledLanguageBox = styled(Box)(({ theme }) => ({
  display: "inline-block",
  ...(theme.direction === "rtl" ? { marginRight: 8 } : { marginLeft: 8 }),
  verticalAlign: "top",
}));

export const StyledLanguageButton = styled(Button)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  textTransform: "uppercase",
  fontWeight: 600,
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
  [`& .${buttonClasses.startIcon}`]: {
    marginRight: theme.direction === "rtl" ? 0 : theme.spacing(1.5),
    marginLeft: theme.direction === "rtl" ? theme.spacing(1.5) : 0,
  },
}));

export const StyledLanguageMenuItem = styled(MenuItem)(({ theme }) => ({
  minWidth: 120,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));
