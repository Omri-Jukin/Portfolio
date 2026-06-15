"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";
import { api } from "$/trpc/client";
import { INTAKE_FORM_CURRENCY_MAPPING, COMMON_TIMEZONES } from "$/constants";
import { INTAKE_FORM_DEFAULTS } from "$/intake/formDefaults";
import { intakeFormSchema, type IntakeFormData } from "#/lib/schemas";

type CustomLink = {
  id: string;
  slug: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  organizationName: string | null;
  organizationWebsite: string | null;
  hiddenSections: string[];
  expiresAt: Date;
  token: string;
  maxAge: number;
};

type CustomLinkIntakeFormProps = {
  customLink: CustomLink;
};

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

function listToLines(value: string[] | undefined) {
  return (value ?? []).join("\n");
}

function linesToList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isHidden(hiddenSections: string[], key: string) {
  return hiddenSections.includes(key);
}

function cleanUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export default function CustomLinkIntakeForm({
  customLink,
}: CustomLinkIntakeFormProps) {
  const hiddenSections = customLink.hiddenSections ?? [];
  const clientName =
    [customLink.firstName, customLink.lastName].filter(Boolean).join(" ") ||
    customLink.email;
  const [notice, setNotice] = useState<Notice>(null);
  const [formData, setFormData] = useState<IntakeFormData>(() => ({
    ...INTAKE_FORM_DEFAULTS,
    contact: {
      ...INTAKE_FORM_DEFAULTS.contact,
      firstName: customLink.firstName ?? "",
      lastName: customLink.lastName ?? "",
      email: customLink.email,
      fullName: clientName,
    },
    org: customLink.organizationName
      ? {
          ...INTAKE_FORM_DEFAULTS.org,
          name: customLink.organizationName,
          website: customLink.organizationWebsite ?? "",
        }
      : INTAKE_FORM_DEFAULTS.org,
  }));

  const currencyOptions = useMemo(
    () => Object.keys(INTAKE_FORM_CURRENCY_MAPPING),
    []
  );

  useEffect(() => {
    const setCookie = async () => {
      try {
        await fetch("/api/intake/set-cookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: customLink.token,
            maxAge: customLink.maxAge,
          }),
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to set intake session cookie:", error);
        }
      }
    };

    void setCookie();
  }, [customLink.maxAge, customLink.token]);

  const submitMutation = api.intakes.submit.useMutation({
    onSuccess: () => {
      setNotice({
        tone: "success",
        message: "Intake submitted. I will review it and follow up directly.",
      });
    },
    onError: (error) =>
      setNotice({
        tone: "destructive",
        message: error.message || "Could not submit the intake.",
      }),
  });

  const updateContact = (
    key: keyof IntakeFormData["contact"],
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [key]: value,
      },
    }));
  };

  const updateOrg = (key: keyof NonNullable<IntakeFormData["org"]>, value: string) => {
    setFormData((current) => ({
      ...current,
      org: {
        ...INTAKE_FORM_DEFAULTS.org,
        ...current.org,
        [key]: value,
      },
    }));
  };

  const updateProject = (
    key: keyof IntakeFormData["project"],
    value: IntakeFormData["project"][keyof IntakeFormData["project"]]
  ) => {
    setFormData((current) => ({
      ...current,
      project: {
        ...current.project,
        [key]: value,
      },
    }));
  };

  const updateAdditional = (
    key: keyof NonNullable<IntakeFormData["additional"]>,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      additional: {
        ...current.additional,
        [key]: value,
      },
    }));
  };

  const buildPayload = () => {
    const payload: IntakeFormData = {
      ...formData,
      contact: {
        ...formData.contact,
        firstName: formData.contact.firstName.trim(),
        lastName: formData.contact.lastName.trim(),
        email: formData.contact.email.trim(),
        phone: formData.contact.phone?.trim() || undefined,
        fullName:
          formData.contact.fullName?.trim() ||
          `${formData.contact.firstName} ${formData.contact.lastName}`.trim(),
      },
      org: isHidden(hiddenSections, "org")
        ? undefined
        : {
            name: formData.org?.name?.trim() ?? "",
            website: cleanUrl(formData.org?.website),
            industry: formData.org?.industry?.trim() || undefined,
            size: formData.org?.size?.trim() || undefined,
          },
      project: {
        ...formData.project,
        title: formData.project.title.trim(),
        description: formData.project.description.trim(),
        requirements: formData.project.requirements ?? [],
        technologies: formData.project.technologies ?? [],
        goals: formData.project.goals ?? [],
        timeline: formData.project.timeline?.trim() || undefined,
        startDate: formData.project.startDate?.trim() || undefined,
        budget: formData.project.budget,
        resourceLinks: formData.project.resourceLinks ?? [],
      },
      additional: isHidden(hiddenSections, "additional")
        ? undefined
        : {
            preferredContactMethod:
              formData.additional?.preferredContactMethod?.trim() || undefined,
            timezone: formData.additional?.timezone?.trim() || undefined,
            urgency: formData.additional?.urgency?.trim() || undefined,
            notes: formData.additional?.notes?.trim() || undefined,
          },
    };

    return payload;
  };

  const submit = () => {
    setNotice(null);

    const payload = buildPayload();
    const parsed = intakeFormSchema.safeParse(payload);

    if (!parsed.success) {
      setNotice({
        tone: "destructive",
        message: parsed.error.issues[0]?.message ?? "Please check the form.",
      });
      return;
    }

    submitMutation.mutate({
      ...parsed.data,
      customLinkId: customLink.id,
    });
  };

  if (submitMutation.isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Intake submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-7 text-muted-foreground">
            Thanks, {clientName}. Your intake is saved and I will follow up by
            email.
          </p>
          <Button onClick={() => setNotice(null)} variant="outline">
            Submitted
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase text-muted-foreground">
          Private intake
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
          Project context for {clientName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Share the details that will help scope the work clearly. This page is
          private and excluded from public search.
        </p>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField>
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              value={formData.contact.firstName}
              onChange={(event) => updateContact("firstName", event.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              value={formData.contact.lastName}
              onChange={(event) => updateContact("lastName", event.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contact.email}
              onChange={(event) => updateContact("email", event.target.value)}
            />
          </FormField>
          {!isHidden(hiddenSections, "contact.phone") ? (
            <FormField>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.contact.phone ?? ""}
                onChange={(event) => updateContact("phone", event.target.value)}
              />
            </FormField>
          ) : null}
        </CardContent>
      </Card>

      {!isHidden(hiddenSections, "org") ? (
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="org-name">Organization name</Label>
              <Input
                id="org-name"
                value={formData.org?.name ?? ""}
                onChange={(event) => updateOrg("name", event.target.value)}
              />
            </FormField>
            <FormField>
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                value={formData.org?.website ?? ""}
                onChange={(event) => updateOrg("website", event.target.value)}
              />
            </FormField>
            <FormField>
              <Label htmlFor="org-industry">Industry</Label>
              <Input
                id="org-industry"
                value={formData.org?.industry ?? ""}
                onChange={(event) => updateOrg("industry", event.target.value)}
              />
            </FormField>
            <FormField>
              <Label htmlFor="org-size">Team size</Label>
              <Input
                id="org-size"
                value={formData.org?.size ?? ""}
                onChange={(event) => updateOrg("size", event.target.value)}
              />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Project</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormField>
            <Label htmlFor="project-title">Project title</Label>
            <Input
              id="project-title"
              value={formData.project.title}
              onChange={(event) => updateProject("title", event.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              className="min-h-32"
              value={formData.project.description}
              onChange={(event) =>
                updateProject("description", event.target.value)
              }
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={formData.project.timeline ?? ""}
                onChange={(event) => updateProject("timeline", event.target.value)}
              />
            </FormField>
            <FormField>
              <Label htmlFor="start-date">Target start date</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.project.startDate ?? ""}
                onChange={(event) =>
                  updateProject("startDate", event.target.value)
                }
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField>
              <Label htmlFor="budget-currency">Currency</Label>
              <Select
                id="budget-currency"
                value={formData.project.budget?.currency ?? "USD"}
                onChange={(event) =>
                  updateProject("budget", {
                    ...formData.project.budget,
                    currency: event.target.value as keyof typeof INTAKE_FORM_CURRENCY_MAPPING,
                  })
                }
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="budget-min">Budget min</Label>
              <Input
                id="budget-min"
                value={formData.project.budget?.min ?? ""}
                onChange={(event) =>
                  updateProject("budget", {
                    ...formData.project.budget,
                    min: event.target.value,
                  })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="budget-max">Budget max</Label>
              <Input
                id="budget-max"
                value={formData.project.budget?.max ?? ""}
                onChange={(event) =>
                  updateProject("budget", {
                    ...formData.project.budget,
                    max: event.target.value,
                  })
                }
              />
            </FormField>
          </div>
          <FormField hint="One item per line.">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={listToLines(formData.project.requirements)}
              onChange={(event) =>
                updateProject("requirements", linesToList(event.target.value))
              }
            />
          </FormField>
          <FormField hint="One item per line.">
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              id="goals"
              value={listToLines(formData.project.goals)}
              onChange={(event) =>
                updateProject("goals", linesToList(event.target.value))
              }
            />
          </FormField>
          <FormField hint="One item per line.">
            <Label htmlFor="technologies">Technologies</Label>
            <Textarea
              id="technologies"
              value={listToLines(formData.project.technologies)}
              onChange={(event) =>
                updateProject("technologies", linesToList(event.target.value))
              }
            />
          </FormField>
        </CardContent>
      </Card>

      {!isHidden(hiddenSections, "additional") ? (
        <Card>
          <CardHeader>
            <CardTitle>Additional Context</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField>
                <Label htmlFor="preferred-contact">Preferred contact</Label>
                <Input
                  id="preferred-contact"
                  value={formData.additional?.preferredContactMethod ?? ""}
                  onChange={(event) =>
                    updateAdditional(
                      "preferredContactMethod",
                      event.target.value
                    )
                  }
                />
              </FormField>
              <FormField>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  id="timezone"
                  value={formData.additional?.timezone ?? ""}
                  onChange={(event) =>
                    updateAdditional("timezone", event.target.value)
                  }
                >
                  <option value="">Select timezone</option>
                  {COMMON_TIMEZONES.map((timezone) => (
                    <option key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField>
                <Label htmlFor="urgency">Urgency</Label>
                <Select
                  id="urgency"
                  value={formData.additional?.urgency ?? ""}
                  onChange={(event) =>
                    updateAdditional("urgency", event.target.value)
                  }
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormField>
            </div>
            <FormField>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                className="min-h-28"
                value={formData.additional?.notes ?? ""}
                onChange={(event) => updateAdditional("notes", event.target.value)}
              />
            </FormField>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={submit} disabled={submitMutation.isPending}>
          {submitMutation.isPending ? "Submitting..." : "Submit Intake"}
        </Button>
      </div>
    </div>
  );
}
