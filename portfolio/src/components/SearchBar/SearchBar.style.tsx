import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const SearchContainer = styled(Box)({
  position: "relative",
  width: "auto",
});

export const SearchSuggestions = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: theme.spacing(1),
  maxHeight: 400,
  overflow: "auto",
}));

export const PopularSearchesContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: theme.spacing(1),
}));

export const SearchTermChip = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));
