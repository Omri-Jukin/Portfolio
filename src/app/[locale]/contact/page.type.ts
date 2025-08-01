import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters"), // Changed from 5 to 3
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

export type ContactCardType =
  | "email"
  | "phone"
  | "github"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "aurora"
  | "fire"
  | "spring"
  | "ocean"
  | "forest"
  | "galaxy"
  | "warm"
  | "coolWarm"
  | "cool"
  | "neutral"
  | "dark"
  | "sunset";
