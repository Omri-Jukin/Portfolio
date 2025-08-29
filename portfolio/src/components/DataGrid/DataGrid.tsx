"use client";

import { GridToolbar } from "@mui/x-data-grid";
import { Box, Alert, CircularProgress } from "@mui/material";
import * as Styled from "./DataGrid.style";
import * as Types from "./DataGrid.type";
import * as Constants from "./DataGrid.const";

const DataGrid: React.FC<Types.DataGridProps> = ({
  rows,
  columns,
  loading = false,
  height = Constants.DATA_GRID_CONSTANTS.GRID_HEIGHT,
  showToolbar = true,
  showQuickFilter = true,
  pageSizeOptions = Constants.DATA_GRID_CONSTANTS.PAGE_SIZE_OPTIONS,
  defaultPageSize = Constants.DATA_GRID_CONSTANTS.DEFAULT_PAGE_SIZE,
  autoHeight = false,
  disableRowSelectionOnClick = true,
  onRowClick,
  getRowClassName,
  sx,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No data available.
      </Alert>
    );
  }

  return (
    <Box sx={{ height: autoHeight ? "auto" : height, width: "100%" }}>
      <Styled.StyledDataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={pageSizeOptions}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: defaultPageSize,
            },
          },
        }}
        slots={showToolbar ? { toolbar: GridToolbar } : undefined}
        slotProps={
          showToolbar
            ? {
                toolbar: {
                  showQuickFilter,
                  quickFilterProps: {
                    debounceMs:
                      Constants.DATA_GRID_CONSTANTS.QUICK_FILTER_DEBOUNCE_MS,
                  },
                },
              }
            : undefined
        }
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        autoHeight={autoHeight}
        onRowClick={onRowClick}
        getRowClassName={getRowClassName}
        sx={{
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: "background.default",
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default DataGrid;
