import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  GRID_CONFIG,
  BREAKPOINTS,
  calculateGridCellSize,
} from "./GlobeBackground.const";
import { GridCell } from "./GlobeBackground.type";

const DebugGrid = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: "none",
  zIndex: 9999,
  opacity: 0.3,
}));

const StyledGridCell = styled(Box)<{ isGlobeCell: boolean }>(
  ({ theme, isGlobeCell }) => ({
    position: "absolute",
    border: `1px solid ${
      isGlobeCell ? theme.palette.primary.main : theme.palette.divider
    }`,
    backgroundColor: isGlobeCell
      ? `${theme.palette.primary.main}20`
      : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: theme.palette.text.secondary,
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "2px",
      height: "2px",
      backgroundColor: isGlobeCell
        ? theme.palette.primary.main
        : theme.palette.divider,
    },
  })
);

interface GridDebugProps {
  showGrid: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

const GridDebug: React.FC<GridDebugProps> = ({
  showGrid,
  viewportWidth,
  viewportHeight,
}) => {
  if (!showGrid) return null;

  const getDeviceType = (): keyof typeof GRID_CONFIG => {
    if (viewportWidth < BREAKPOINTS.mobile) return "mobile";
    if (viewportWidth < BREAKPOINTS.tablet) return "tablet";
    return "desktop";
  };

  const deviceType = getDeviceType();
  const config = GRID_CONFIG[deviceType];
  const { cellWidth, cellHeight } = calculateGridCellSize(
    viewportWidth,
    viewportHeight,
    config.columns,
    config.rows
  );

  const generateGridCells = (): GridCell[] => {
    const cells: GridCell[] = [];

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.columns; col++) {
        const isGlobeCell =
          col >= config.globe.startColumn &&
          col <= config.globe.endColumn &&
          row >= config.globe.startRow &&
          row <= config.globe.endRow;

        cells.push({
          column: col,
          row: row,
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
          isGlobeCell,
        });
      }
    }

    return cells;
  };

  const gridCells = generateGridCells();

  return (
    <DebugGrid>
      {gridCells.map((cell) => (
        <StyledGridCell
          key={`${cell.column}-${cell.row}`}
          isGlobeCell={cell.isGlobeCell}
          sx={{
            left: cell.x,
            top: cell.y,
            width: cell.width,
            height: cell.height,
          }}
        >
          {cell.column},{cell.row}
        </StyledGridCell>
      ))}

      {/* Device info overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: 1,
          borderRadius: 1,
          fontSize: "12px",
          fontFamily: "monospace",
        }}
      >
        <div>Device: {deviceType}</div>
        <div>
          Grid: {config.columns}×{config.rows}
        </div>
        <div>
          Cell: {Math.round(cellWidth)}×{Math.round(cellHeight)}
        </div>
        <div>
          Globe: {config.globe.startColumn}-{config.globe.endColumn},{" "}
          {config.globe.startRow}-{config.globe.endRow}
        </div>
      </Box>
    </DebugGrid>
  );
};

export default GridDebug;
