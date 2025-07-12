import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

export const StyledLanguageBox = styled(Box)(() => ({
  display: "inline-block",
  marginLeft: 8,
  verticalAlign: "top",
}));

export const StyledLanguageButton = styled(Button)(() => ({
  minWidth: 60,
  textTransform: "uppercase",
  fontWeight: 600,
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
