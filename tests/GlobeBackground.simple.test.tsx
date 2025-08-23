import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Test basic imports
describe("Basic Import Test", () => {
  test("should import React", () => {
    expect(React).toBeDefined();
  });

  test("should import MUI components", () => {
    expect(ThemeProvider).toBeDefined();
    expect(createTheme).toBeDefined();
  });
});

// Test component imports
describe("Component Import Test", () => {
  test("should import GridDebug component", async () => {
    try {
      const { default: GridDebug } = await import(
        "../Components/GlobeBackground/GridDebug"
      );
      expect(GridDebug).toBeDefined();
      expect(typeof GridDebug).toBe("function");
    } catch (error) {
      console.error("Import error:", error);
      throw error;
    }
  });

  test("should import GlobeBackground component", async () => {
    try {
      const { default: GlobeBackground } = await import(
        "../Components/GlobeBackground/GlobeBackground"
      );
      expect(GlobeBackground).toBeDefined();
      expect(typeof GlobeBackground).toBe("function");
    } catch (error) {
      console.error("Import error:", error);
      throw error;
    }
  });
});
