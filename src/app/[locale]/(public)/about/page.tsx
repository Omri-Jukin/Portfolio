"use client";

import { About, EngineeringStrengths } from "#/Components";
import PublicPageShell from "~/PublicPageShell";

export default function AboutPage() {
  return (
    <PublicPageShell>
      <About />
      <EngineeringStrengths />
    </PublicPageShell>
  );
}
