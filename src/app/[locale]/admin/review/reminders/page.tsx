"use client";

import React from "react";
import { ClientOnly } from "~/ClientOnly";
import RemindersDashboard from "~/IntakeReview/RemindersDashboard";

export default function RemindersPage() {
  return (
    <ClientOnly skeleton>
      <RemindersDashboard />
    </ClientOnly>
  );
}
