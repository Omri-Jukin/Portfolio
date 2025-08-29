import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { SxProps, Theme } from "@mui/material";

export interface DataGridProps {
  rows: Record<string, unknown>[];
  columns: GridColDef[];
  loading?: boolean;
  height?: number;
  showToolbar?: boolean;
  showQuickFilter?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  autoHeight?: boolean;
  disableRowSelectionOnClick?: boolean;
  onRowClick?: (params: GridRowParams) => void;
  getRowClassName?: (params: GridRowParams) => string;
  sx?: SxProps<Theme>;
}

export interface DataGridAction {
  icon: React.ReactNode;
  label: string;
  onClick: (params: GridRowParams) => void;
  disabled?: boolean;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}
