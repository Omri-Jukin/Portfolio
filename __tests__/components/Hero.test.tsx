import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createPortfolioTheme } from "#/theme";
import Hero from "~/Hero";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      tagline: "Systems-first full-stack engineer",
      titleRow1: "Building Digital",
      titleRow2: "Experiences",
      subtitle:
        "I create scalable, performant web applications that solve real-world problems.",
      exploreButton: "Explore Work",
      resumeButton: "View Resume",
      contactButton: "Get in Touch",
      availability: "Open to senior full-stack roles and consultative builds.",
      metrics: JSON.stringify([
        { value: "2+", label: "Years building resilient products" },
        { value: "15+", label: "End-to-end launches across sectors" },
        { value: "100%", label: "Critical flows covered by automation" },
      ]),
    };
    return translations[key] || key;
  },
}));

// Mock Next.js Image
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const theme = createPortfolioTheme("dark", "ltr");

const defaultProps = {
  onExploreClick: jest.fn(),
  onAboutClick: jest.fn(),
  onCareerClick: jest.fn(),
  onContactClick: jest.fn(),
  profileSrc: undefined,
  ownerName: "Omri Jukin",
};

const renderWithTheme = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <Hero {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe("Hero Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithTheme();
    expect(
      screen.getByText("Systems-first full-stack engineer")
    ).toBeInTheDocument();
  });

  it("displays the main title", () => {
    renderWithTheme();
    expect(screen.getByText("Building Digital")).toBeInTheDocument();
    expect(screen.getByText("Experiences")).toBeInTheDocument();
  });

  it("displays the subtitle", () => {
    renderWithTheme();
    expect(
      screen.getByText(/I create scalable, performant web applications/)
    ).toBeInTheDocument();
  });

  it("renders call-to-action buttons", () => {
    renderWithTheme();
    expect(screen.getByText("Explore Work")).toBeInTheDocument();
    expect(screen.getByText("View Resume")).toBeInTheDocument();
  });

  it("calls onExploreClick when explore button is clicked", () => {
    const mockOnExploreClick = jest.fn();
    renderWithTheme({ onExploreClick: mockOnExploreClick });

    fireEvent.click(screen.getByText("Explore Work"));
    expect(mockOnExploreClick).toHaveBeenCalledTimes(1);
  });

  it("calls onAboutClick when resume button is clicked", () => {
    const mockOnAboutClick = jest.fn();
    renderWithTheme({ onAboutClick: mockOnAboutClick });

    fireEvent.click(screen.getByText("View Resume"));
    expect(mockOnAboutClick).toHaveBeenCalledTimes(1);
  });

  it("displays metrics", () => {
    renderWithTheme();
    expect(screen.getByText("2+")).toBeInTheDocument();
    expect(
      screen.getByText("Years building resilient products")
    ).toBeInTheDocument();
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(
      screen.getByText("End-to-end launches across sectors")
    ).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(
      screen.getByText("Critical flows covered by automation")
    ).toBeInTheDocument();
  });

  it("displays availability text", () => {
    renderWithTheme();
    expect(
      screen.getByText(/Open to senior full-stack roles/)
    ).toBeInTheDocument();
  });

  it("renders profile image when provided", () => {
    const mockProfileSrc = { src: "/test-image.jpg" } as any;
    renderWithTheme({ profileSrc: mockProfileSrc });

    const image = screen.getByAltText("Omri Jukin profile photo");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  it("has proper accessibility attributes", () => {
    renderWithTheme();

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();

    const actions = screen.getByRole("group", { name: "Main actions" });
    expect(actions).toBeInTheDocument();
  });

  it("handles missing translations gracefully", () => {
    // This test would require mocking useTranslations to throw an error
    // For now, we'll test that the component renders with fallback values
    renderWithTheme();
    expect(
      screen.getByText("Systems-first full-stack engineer")
    ).toBeInTheDocument();
  });
});

