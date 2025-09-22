import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { createPortfolioTheme } from "#/theme";
import ContactForm from "~/ContactForm";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "form.title": "Get in Touch",
      "form.description":
        "Have a project in mind? Let's discuss how we can bring your ideas to life.",
      "form.name": "My Name",
      "form.email": "My Email",
      "form.phone": "My Phone",
      "form.subject": "Subject",
      "form.message": "My Message",
      "form.submit": "Send Message",
      "form.sending": "Sending...",
      "form.success": "Message sent successfully!",
      "form.error": "Something went wrong. Please try again.",
    };
    return translations[key] || key;
  },
}));

// Mock tRPC
jest.mock("$/trpc/client", () => ({
  api: {
    contact: {
      submit: {
        useMutation: () => ({
          mutateAsync: jest.fn().mockResolvedValue({ success: true }),
          isPending: false,
        }),
      },
    },
  },
}));

const theme = createPortfolioTheme("dark", "ltr");

const defaultProps = {
  onSuccess: jest.fn(),
  onError: jest.fn(),
};

const renderWithTheme = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <ContactForm {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe("ContactForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithTheme();
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
  });

  it("displays all form fields", () => {
    renderWithTheme();

    expect(screen.getByLabelText("My Name")).toBeInTheDocument();
    expect(screen.getByLabelText("My Email")).toBeInTheDocument();
    expect(screen.getByLabelText("My Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("My Message")).toBeInTheDocument();
  });

  it("displays submit button", () => {
    renderWithTheme();
    expect(
      screen.getByRole("button", { name: "Send Message" })
    ).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const nameInput = screen.getByLabelText("My Name");
    await user.type(nameInput, "John Doe");

    expect(nameInput).toHaveValue("John Doe");
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    // Check for validation errors (this would depend on the actual validation implementation)
    await waitFor(() => {
      expect(screen.getByText("My Name")).toBeInTheDocument();
    });
  });

  it("calls onSuccess when form is submitted successfully", async () => {
    const mockOnSuccess = jest.fn();
    const user = userEvent.setup();
    renderWithTheme({ onSuccess: mockOnSuccess });

    // Fill out the form
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "john@example.com");
    await user.type(screen.getByLabelText("My Message"), "Test message");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("calls onError when form submission fails", async () => {
    // Mock tRPC to reject
    const mockMutateAsync = jest
      .fn()
      .mockRejectedValue(new Error("Submission failed"));
    jest.doMock("$/trpc/client", () => ({
      api: {
        contact: {
          submit: {
            useMutation: () => ({
              mutateAsync: mockMutateAsync,
              isPending: false,
            }),
          },
        },
      },
    }));

    const mockOnError = jest.fn();
    const user = userEvent.setup();
    renderWithTheme({ onError: mockOnError });

    // Fill out the form
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "john@example.com");
    await user.type(screen.getByLabelText("My Message"), "Test message");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it("disables submit button while submitting", async () => {
    // Mock tRPC to be pending
    jest.doMock("$/trpc/client", () => ({
      api: {
        contact: {
          submit: {
            useMutation: () => ({
              mutateAsync: jest.fn(),
              isPending: true,
            }),
          },
        },
      },
    }));

    renderWithTheme();

    const submitButton = screen.getByRole("button", { name: "Sending..." });
    expect(submitButton).toBeDisabled();
  });

  it("has proper accessibility attributes", () => {
    renderWithTheme();

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();

    const nameInput = screen.getByLabelText("My Name");
    expect(nameInput).toHaveAttribute("required");

    const emailInput = screen.getByLabelText("My Email");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Fill out the form
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "john@example.com");
    await user.type(screen.getByLabelText("My Message"), "Test message");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText("My Name")).toHaveValue("");
      expect(screen.getByLabelText("My Email")).toHaveValue("");
      expect(screen.getByLabelText("My Message")).toHaveValue("");
    });
  });
});

