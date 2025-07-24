import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface ContactFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}
