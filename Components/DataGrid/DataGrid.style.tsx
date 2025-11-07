import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottom: `2px solid ${theme.palette.primary.dark}`,
  },
  "& .MuiDataGrid-columnHeader": {
    borderRight: `1px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.contrastText,
    "& .MuiDataGrid-columnHeaderTitle": {
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
    },
  },
  "& .MuiDataGrid-columnHeader:last-child": {
    borderRight: "none",
  },
  "& .MuiDataGrid-row": {
    color: theme.palette.text.primary,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
      "& .MuiDataGrid-cell": {
        color: theme.palette.text.primary,
      },
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.action.selected,
      "&:hover": {
        backgroundColor: theme.palette.action.selected,
      },
    },
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    "& .MuiTablePagination-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiTablePagination-selectLabel": {
      color: theme.palette.text.secondary,
    },
    "& .MuiTablePagination-displayedRows": {
      color: theme.palette.text.primary,
    },
    "& .MuiIconButton-root": {
      color: theme.palette.text.primary,
    },
  },
  "& .MuiDataGrid-toolbarContainer": {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .MuiInputBase-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
    },
    "& .MuiFormLabel-root": {
      color: theme.palette.text.secondary,
    },
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: theme.palette.background.paper,
  },
}));
