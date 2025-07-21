"use client";

import { api } from "$/trpc/client";
import ContactForm, { type ContactFormData } from "~/ContactForm";

export default function ContactPage() {
  const submitContactForm = api.emails.submitContactForm.useMutation();

  const handleContactSubmit = async (data: ContactFormData) => {
    try {
      const result = await submitContactForm.mutateAsync(data);
      console.log("Contact form submitted successfully:", result);
      return Promise.resolve();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      return Promise.reject(error);
    }
  };

  return (
    <ContactForm
      onSubmit={handleContactSubmit}
      isLoading={submitContactForm.isPending}
    />
  );
}
