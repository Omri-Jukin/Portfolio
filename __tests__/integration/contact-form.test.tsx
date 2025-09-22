import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { createPortfolioTheme } from "#/theme";
import Contact from "~/Contact";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: "Let's Connect",
      subtitle: "Ready to bring a new idea to life?",
      description:
        "I'm always excited to discuss new opportunities, collaborations, or just chat about technology.\nDrop me a message and let's create something amazing together...",
      button: "Start a conversation",
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
const mockMutateAsync = jest.fn();
jest.mock("$/trpc/client", () => ({
  api: {
    contact: {
      submit: {
        useMutation: () => ({
          mutateAsync: mockMutateAsync,
          isPending: false,
          error: null,
        }),
      },
    },
  },
}));

const theme = createPortfolioTheme("dark", "ltr");

const defaultProps = {
  locale: "en",
  onContactClick: jest.fn(),
};

const renderWithTheme = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <Contact {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe("Contact Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders contact section with form", () => {
    renderWithTheme();

    expect(screen.getByText("Let's Connect")).toBeInTheDocument();
    expect(
      screen.getByText("Ready to bring a new idea to life?")
    ).toBeInTheDocument();
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
  });

  it("allows user to fill out and submit contact form", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({ success: true });

    renderWithTheme();

    // Fill out the form
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "john@example.com");
    await user.type(screen.getByLabelText("My Phone"), "+1234567890");
    await user.type(screen.getByLabelText("Subject"), "Test Subject");
    await user.type(
      screen.getByLabelText("My Message"),
      "This is a test message"
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    // Verify the form was submitted
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        subject: "Test Subject",
        message: "This is a test message",
      });
    });
  });

  it("handles form submission errors gracefully", async () => {
    const user = userEvent.setup();
    const error = new Error("Submission failed");
    mockMutateAsync.mockRejectedValue(error);

    renderWithTheme();

    // Fill out the form
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "john@example.com");
    await user.type(screen.getByLabelText("My Message"), "Test message");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Try to submit empty form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    // Check that validation prevents submission
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Fill out form with invalid email
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "invalid-email");
    await user.type(screen.getByLabelText("My Message"), "Test message");

    // Try to submit
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    // Check that validation prevents submission
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({ success: true });

    renderWithTheme();

    // Fill out the form
    await user.type(screen.getByLabelText("My Name"), "John Doe");
    await user.type(screen.getByLabelText("My Email"), "john@example.com");
    await user.type(screen.getByLabelText("My Message"), "Test message");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Send Message" });
    await user.click(submitButton);

    // Wait for form to be cleared
    await waitFor(() => {
      expect(screen.getByLabelText("My Name")).toHaveValue("");
      expect(screen.getByLabelText("My Email")).toHaveValue("");
      expect(screen.getByLabelText("My Message")).toHaveValue("");
    });
  });

  it("shows loading state during submission", async () => {
    // Mock pending state
    jest.doMock("$/trpc/client", () => ({
      api: {
        contact: {
          submit: {
            useMutation: () => ({
              mutateAsync: mockMutateAsync,
              isPending: true,
              error: null,
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

    // Check form accessibility
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();

    // Check field accessibility
    const nameInput = screen.getByLabelText("My Name");
    expect(nameInput).toHaveAttribute("required");

    const emailInput = screen.getByLabelText("My Email");
    expect(emailInput).toHaveAttribute("type", "email");

    const messageInput = screen.getByLabelText("My Message");
    expect(messageInput).toHaveAttribute("required");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Tab through form fields
    await user.tab();
    expect(screen.getByLabelText("My Name")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("My Email")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("My Phone")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Subject")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("My Message")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Send Message" })).toHaveFocus();
  });
});

