"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { api } from "$/trpc/client";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const defaultFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function subjectFromProject(projectTitle: string | null) {
  if (!projectTitle) return "";

  return `Role conversation - ${projectTitle}`;
}

function messageFromProject(projectTitle: string | null, projectContext: string | null) {
  if (!projectTitle) return "";

  return [
    "Hi Omri,",
    "",
    `I am reaching out after reviewing ${projectTitle}.`,
    projectContext ? `The part I would like to discuss is: ${projectContext}` : null,
    "",
    "Role/team context:",
    "",
    "What we need:",
    "",
    "Timeline:",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const project = searchParams.get("projectTitle") ?? searchParams.get("project");
  const projectContext = searchParams.get("context");
  const initialData = useMemo(
    () => ({
      ...defaultFormData,
      subject: subjectFromProject(project),
      message: messageFromProject(project, projectContext),
    }),
    [project, projectContext]
  );

  const [formData, setFormData] = useState<ContactFormData>(initialData);
  const [status, setStatus] = useState<{
    tone: "success" | "destructive";
    message: string;
  } | null>(null);

  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      setFormData(defaultFormData);
      setStatus({
        tone: "success",
        message: "Message sent. I will reply by email.",
      });
    },
    onError: (error) => {
      setStatus({
        tone: "destructive",
        message: error.message || "Message could not be sent.",
      });
    },
  });

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      subject: current.subject || initialData.subject,
      message: current.message || initialData.message,
    }));
  }, [initialData]);

  const updateField = <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    submitMutation.mutate(formData);
  };

  const canSubmit =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.subject.trim().length > 0 &&
    formData.message.trim().length > 0 &&
    !submitMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
      </CardHeader>
      <CardContent>
        {status ? (
          <Alert tone={status.tone} className="mb-4">
            {status.message}
          </Alert>
        ) : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Name</span>
            <Input
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="name"
              required
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Email</span>
            <Input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Subject</span>
            <Input
              value={formData.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              required
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Message</span>
            <Textarea
              value={formData.message}
              onChange={(event) => updateField("message", event.target.value)}
              className="min-h-36"
              required
            />
          </label>

          <Button type="submit" disabled={!canSubmit}>
            {submitMutation.isPending ? "Sending" : "Send message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
