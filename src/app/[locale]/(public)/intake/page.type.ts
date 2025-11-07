import type { IntakeFormData } from "#/lib/schemas";

export interface IntakeFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export type { IntakeFormData };
export { intakeFormSchema } from "#/lib/schemas";
