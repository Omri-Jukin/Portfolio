import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottom: `2px solid ${theme.palette.primary.dark}`,
  },
  "& .MuiDataGrid-columnHeader": {
    borderRight: `1px solid ${theme.palette.primary.dark}`,
  },
  "& .MuiDataGrid-columnHeader:last-child": {
    borderRight: "none",
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  "& .MuiDataGrid-toolbarContainer": {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: theme.palette.background.paper,
  },
}));
