import { styled } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export const StyledDarkModeToggle = styled(IconButton)(({ theme }) => ({
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
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.warning.light,
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    },
  }),
  ...(theme.palette.mode === "light" && {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.info.light,
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    },
  }),
}));
