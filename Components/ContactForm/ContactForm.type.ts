export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface ContactFormState {
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
  errorMessage: string;
}
