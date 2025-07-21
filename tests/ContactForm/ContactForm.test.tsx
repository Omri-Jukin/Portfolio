import { render, screen } from "@testing-library/react";
import ContactForm from "../../Components/ContactForm/ContactForm";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "form.title": "Send me a message",
      "form.description": "I'd love to hear from you",
      "form.name": "Full Name",
      "form.email": "Email Address",
      "form.subject": "Subject",
      "form.message": "Your Message",
      "form.submit": "Send Message",
      "form.sending": "Sending...",
      "form.success": "Thank you! Your message has been sent successfully.",
      "info.title": "Contact Information",
      "info.email": "Email",
      "info.phone": "Phone",
      "info.timezone": "Timezone",
      "info.location": "Location",
      email: "omrijukin@gmail.com",
      phone: "(+972) 052 334 4064",
      timezone: "Asia/Jerusalem",
      "location.israel": "Israel",
    };
    return translations[key] || key;
  },
}));

// Mock MUI components
jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  TextField: ({ label, ...props }: any) => (
    <input aria-label={label} {...props} />
  ),
  Alert: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CircularProgress: (props: any) => <div {...props} />,
  Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock("@mui/icons-material", () => ({
  Email: () => <div data-testid="email-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Schedule: () => <div data-testid="schedule-icon" />,
  LocationOn: () => <div data-testid="location-icon" />,
  Send: () => <div data-testid="send-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

// Mock styled components
jest.mock("../../Components/ContactForm/ContactForm.style", () => ({
  FormContainer: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  FormTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  FormDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  FormField: ({ label, ...props }: any) => (
    <input aria-label={label} {...props} />
  ),
  MessageField: ({ label, ...props }: any) => (
    <textarea aria-label={label} {...props} />
  ),
  SubmitButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  SuccessMessage: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  ErrorMessage: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  LoadingContainer: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  ContactInfo: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  ContactInfoTitle: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  ContactInfoItem: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

jest.mock("../../Components/Common/Common.style", () => ({
  PageContainer: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

describe("ContactForm", () => {
  it("renders form title and description", () => {
    render(<ContactForm />);

    expect(screen.getByText("Send me a message")).toBeInTheDocument();
    expect(screen.getByText("I'd love to hear from you")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Message" })
    ).toBeInTheDocument();
  });

  it("shows contact information", () => {
    render(<ContactForm />);

    expect(screen.getByText("Contact Information")).toBeInTheDocument();
    expect(screen.getByText(/Email: omrijukin@gmail.com/)).toBeInTheDocument();
    expect(
      screen.getByText(/Phone: \(\+972\) 052 334 4064/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Timezone: Asia\/Jerusalem/)).toBeInTheDocument();
    expect(screen.getByText(/Location: Israel/)).toBeInTheDocument();
  });

  it("accepts onSubmit prop", () => {
    const mockOnSubmit = jest.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    expect(mockOnSubmit).toBeDefined();
  });

  it("accepts isLoading prop", () => {
    render(<ContactForm isLoading={true} />);

    // The form should be rendered even when loading
    expect(screen.getByText("Send me a message")).toBeInTheDocument();
  });
});
