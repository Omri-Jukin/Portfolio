import React from "react";
import { render, screen } from "@testing-library/react";
import { Typography } from "../../Components/Typography/Typography";

describe("Typography", () => {
  it("renders children", () => {
    render(<Typography>Test Text</Typography>);
    expect(screen.getByText("Test Text")).toBeDefined();
  });

  it("applies the correct variant", () => {
    render(<Typography variant="h2">Heading</Typography>);
    const heading = screen.getByText("Heading");
    expect(heading.tagName.toLowerCase()).toBe("h2");
  });
});
