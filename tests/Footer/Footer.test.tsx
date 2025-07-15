import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Footer as FooterComponent } from "~/Footer/Footer";
import { render, screen } from "@testing-library/react";

describe("Footer", () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

  it("renders About section", () => {
    renderWithTheme(<FooterComponent />);
    expect(screen.getByText(/about/i)).toBeDefined();
    expect(screen.getByText(/passionate developer/i)).toBeDefined();
  });

  it("renders Quick Links section", () => {
    renderWithTheme(<FooterComponent />);
    expect(screen.getByText(/quick links/i)).toBeDefined();
    expect(screen.getByText(/home/i)).toBeDefined();
    expect(screen.getByText(/blog/i)).toBeDefined();
    expect(screen.getByText(/contact/i)).toBeDefined();
    expect(screen.getByText(/resume/i)).toBeDefined();
  });

  it("renders Social section with icons", () => {
    renderWithTheme(<FooterComponent />);
    expect(screen.getByLabelText(/github/i)).toBeDefined();
    expect(screen.getByLabelText(/linkedin/i)).toBeDefined();
  });

  it("renders Contact section with email", () => {
    renderWithTheme(<FooterComponent />);
    expect(screen.getByText(/contact/i)).toBeDefined();
    expect(screen.getByText(/your@email.com/i)).toBeDefined();
  });

  it("renders copyright", () => {
    renderWithTheme(<FooterComponent />);
    expect(screen.getByText(/all rights reserved/i)).toBeDefined();
  });
});
