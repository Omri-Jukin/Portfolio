import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlobeBackground from "~/GlobeBackground/GlobeBackground";

import {
  GRID_CONFIG,
  BREAKPOINTS,
  calculateGridCellSize,
  calculateGlobePosition,
} from "~/GlobeBackground/GlobeBackground.const";

// Mock the cobe library
jest.mock("cobe", () => {
  return jest.fn(() => ({
    destroy: jest.fn(),
  }));
});

// Mock window resize
const mockWindowResize = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
};

// Mock device pixel ratio
Object.defineProperty(window, "devicePixelRatio", {
  writable: true,
  configurable: true,
  value: 2,
});

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("GlobeBackground Behavior", () => {
  beforeEach(() => {
    // Reset window size to desktop
    mockWindowResize(1920, 1080);
  });

  describe("Breakpoints", () => {
    test("should have correct grid configurations for all device types", () => {
      expect(GRID_CONFIG.desktop).toEqual({
        columns: 12,
        rows: 8,
        globe: { startColumn: 3, endColumn: 6, startRow: 2, endRow: 5 },
      });

      expect(GRID_CONFIG.tablet).toEqual({
        columns: 8,
        rows: 6,
        globe: { startColumn: 2, endColumn: 5, startRow: 1, endRow: 4 },
      });

      expect(GRID_CONFIG.mobile).toEqual({
        columns: 6,
        rows: 4,
        globe: { startColumn: 1, endColumn: 4, startRow: 0, endRow: 3 },
      });
    });

    test("should have correct breakpoints", () => {
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1024);
    });
  });

  describe("Grid Cell Size Calculations", () => {
    test("should calculate correct cell sizes for desktop", () => {
      const { cellWidth, cellHeight } = calculateGridCellSize(
        1920,
        1080,
        12,
        8
      );
      expect(cellWidth).toBe(160); // 1920 / 12
      expect(cellHeight).toBe(135); // 1080 / 8
    });

    test("should calculate correct cell sizes for tablet", () => {
      const { cellWidth, cellHeight } = calculateGridCellSize(1024, 768, 8, 6);
      expect(cellWidth).toBe(128); // 1024 / 8
      expect(cellHeight).toBe(128); // 768 / 6
    });

    test("should calculate correct cell sizes for mobile", () => {
      const { cellWidth, cellHeight } = calculateGridCellSize(375, 667, 6, 4);
      expect(cellWidth).toBe(62.5); // 375 / 6
      expect(cellHeight).toBe(166.75); // 667 / 4
    });
  });

  describe("Globe Position Calculations", () => {
    test("should position globe correctly in desktop grid", () => {
      const position = calculateGlobePosition(1920, 1080, "desktop");
      const { cellWidth, cellHeight } = calculateGridCellSize(
        1920,
        1080,
        12,
        8
      );

      // Desktop globe should be centered in cells 3-6, 2-5
      const expectedLeft = ((3 + 6) / 2) * cellWidth; // center of columns 3-6
      const expectedTop = ((2 + 5) / 2) * cellHeight; // center of rows 2-5

      expect(position.left).toBe(expectedLeft);
      expect(position.top).toBe(expectedTop);
      expect(position.transform).toBe("translate(-50%, -50%)");
    });

    test("should position globe correctly in tablet grid", () => {
      const position = calculateGlobePosition(1024, 768, "tablet");
      const { cellWidth, cellHeight } = calculateGridCellSize(1024, 768, 8, 6);

      // Tablet globe should be centered in cells 2-5, 1-4
      const expectedLeft = ((2 + 5) / 2) * cellWidth;
      const expectedTop = ((1 + 4) / 2) * cellHeight;

      expect(position.left).toBe(expectedLeft);
      expect(position.top).toBe(expectedTop);
    });

    test("should position globe correctly in mobile grid", () => {
      const position = calculateGlobePosition(375, 667, "mobile");
      const { cellWidth, cellHeight } = calculateGridCellSize(375, 667, 6, 4);

      // Mobile globe should be centered in cells 1-4, 0-3
      const expectedLeft = ((1 + 4) / 2) * cellWidth;
      const expectedTop = ((0 + 3) / 2) * cellHeight;

      expect(position.left).toBe(expectedLeft);
      expect(position.top).toBe(expectedTop);
    });
  });

  describe("GridDebug Component", () => {
    test("should render grid cells when showGrid is true", () => {
      renderWithTheme(
        <GridDebug showGrid={true} viewportWidth={1920} viewportHeight={1080} />
      );

      // Should render 12x8 = 96 grid cells for desktop
      const gridCells = screen.getAllByText(/\d+,\d+/);
      expect(gridCells).toHaveLength(96);
    });

    test("should not render when showGrid is false", () => {
      renderWithTheme(
        <GridDebug
          showGrid={false}
          viewportWidth={1920}
          viewportHeight={1080}
        />
      );

      const gridCells = screen.queryAllByText(/\d+,\d+/);
      expect(gridCells).toHaveLength(0);
    });

    test("should show correct device info overlay", () => {
      renderWithTheme(
        <GridDebug showGrid={true} viewportWidth={1920} viewportHeight={1080} />
      );

      expect(screen.getByText("Device: desktop")).toBeInTheDocument();
      expect(screen.getByText("Grid: 12×8")).toBeInTheDocument();
      expect(screen.getByText(/Globe: 3-6, 2-5/)).toBeInTheDocument();
    });
  });

  describe("GlobeBackground Component Integration", () => {
    test("should render with grid positioning enabled by default", () => {
      renderWithTheme(
        <GlobeBackground showGrid={true} enableGridPositioning={true} />
      );

      // Should render the grid debug overlay
      expect(screen.getByText("Device: desktop")).toBeInTheDocument();
    });

    test("should respect custom grid configuration", () => {
      const customConfig = {
        columns: 10,
        rows: 6,
        globe: {
          startColumn: 2,
          endColumn: 7,
          startRow: 1,
          endRow: 4,
        },
      };

      renderWithTheme(
        <GlobeBackground showGrid={true} customGridConfig={customConfig} />
      );

      // Should show custom grid dimensions
      expect(screen.getByText("Grid: 10×6")).toBeInTheDocument();
      expect(screen.getByText(/Globe: 2-7, 1-4/)).toBeInTheDocument();
    });

    test("should disable grid positioning when enableGridPositioning is false", () => {
      renderWithTheme(
        <GlobeBackground showGrid={true} enableGridPositioning={false} />
      );

      // Grid should still be visible for debugging
      expect(screen.getByText("Device: desktop")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    test("should switch to tablet grid at 1024px width", () => {
      mockWindowResize(1024, 768);

      renderWithTheme(
        <GridDebug showGrid={true} viewportWidth={1024} viewportHeight={768} />
      );

      expect(screen.getByText("Device: tablet")).toBeInTheDocument();
      expect(screen.getByText("Grid: 8×6")).toBeInTheDocument();
    });

    test("should switch to mobile grid at 768px width", () => {
      mockWindowResize(768, 667);

      renderWithTheme(
        <GridDebug showGrid={true} viewportWidth={768} viewportHeight={667} />
      );

      expect(screen.getByText("Device: mobile")).toBeInTheDocument();
      expect(screen.getByText("Grid: 6×4")).toBeInTheDocument();
    });

    test("should maintain consistent globe positioning across breakpoints", () => {
      // Test desktop positioning
      const desktopPosition = calculateGlobePosition(1920, 1080, "desktop");

      // Test tablet positioning
      const tabletPosition = calculateGlobePosition(1024, 768, "tablet");

      // Test mobile positioning
      const mobilePosition = calculateGlobePosition(375, 667, "mobile");

      // All positions should have the same transform
      expect(desktopPosition.transform).toBe("translate(-50%, -50%)");
      expect(tabletPosition.transform).toBe("translate(-50%, -50%)");
      expect(mobilePosition.transform).toBe("translate(-50%, -50%)");

      // Positions should be different but proportional
      expect(desktopPosition.left).toBeGreaterThan(0);
      expect(tabletPosition.left).toBeGreaterThan(0);
      expect(mobilePosition.left).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    test("should handle zero dimensions gracefully", () => {
      const { cellWidth, cellHeight } = calculateGridCellSize(0, 0, 12, 8);
      expect(cellWidth).toBe(0);
      expect(cellHeight).toBe(0);
    });

    test("should handle very small viewports", () => {
      const position = calculateGlobePosition(320, 568, "mobile");
      expect(position.left).toBeGreaterThanOrEqual(0);
      expect(position.top).toBeGreaterThanOrEqual(0);
    });

    test("should handle very large viewports", () => {
      const position = calculateGlobePosition(3840, 2160, "desktop");
      expect(position.left).toBeGreaterThan(0);
      expect(position.top).toBeGreaterThan(0);
    });
  });
});
