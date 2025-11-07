"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Container, CircularProgress, Alert } from "@mui/material";
import { api } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import IntakeReview from "~/IntakeReview";
import { IntakeCards } from "~/IntakeReview";
import type { IntakeData } from "~/IntakeReview/IntakeReview.type";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const intakeId = searchParams.get("id");

  const {
    data: intakes,
    isLoading: loadingIntakes,
    error: intakesError,
  } = api.intakes.getAll.useQuery();

  const {
    data: intakeRaw,
    isLoading: loadingIntake,
    error: intakeErrorRaw,
  } = api.intakes.getById.useQuery({ id: intakeId! }, { enabled: !!intakeId });

  const intake = intakeRaw as IntakeData | undefined;
  const intakeError = intakeErrorRaw
    ? new Error(intakeErrorRaw.message || "Failed to load intake")
    : null;

  const handleIntakeSelect = (id: string) => {
    router.push(`/dashboard/review?id=${id}`);
  };

  if (loadingIntakes) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (intakesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {intakesError.message || "Failed to load intakes"}
        </Alert>
      </Container>
    );
  }

  if (!intakes || intakes.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No intakes found. Intakes will appear here once submitted.
        </Alert>
      </Container>
    );
  }

  // If no intake is selected, show the cards view
  if (!intakeId) {
    return (
      <ClientOnly skeleton>
        <IntakeCards intakes={intakes} onSelectIntake={handleIntakeSelect} />
      </ClientOnly>
    );
  }

  // If an intake is selected, show the detailed review view
  return (
    <ClientOnly skeleton>
      <IntakeReview
        intakeId={intakeId}
        intakes={intakes}
        selectedIntake={intake}
        loadingIntake={loadingIntake}
        intakeError={intakeError}
        onIntakeSelect={handleIntakeSelect}
        onBackToCards={() => router.push("/dashboard/review")}
      />
    </ClientOnly>
  );
}
