"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import type { ResumeData } from "$/types";

interface ResumePdfDownloadButtonProps {
  resume: ResumeData;
}

const monthPattern =
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/g;

function withoutMonths(value: string) {
  return value.replace(monthPattern, "$1");
}

function getPdfResumeData(resume: ResumeData): ResumeData {
  if (resume.meta?.pdfDateFormat !== "year") {
    return resume;
  }

  return {
    ...resume,
    experience: resume.experience.map((item) => ({
      ...item,
      period: withoutMonths(item.period),
    })),
    education: resume.education.map((item) => ({
      ...item,
      period: withoutMonths(item.period),
    })),
    certifications: resume.certifications?.map((item) => ({
      ...item,
      period: item.period ? withoutMonths(item.period) : item.period,
    })),
    additionalExperience: resume.additionalExperience?.map((item) => ({
      ...item,
      period: withoutMonths(item.period),
    })),
  };
}

export function ResumePdfDownloadButton({ resume }: ResumePdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setStatus(null);
      const { renderResumePDF } = await import("$/utils/pdfGenerator");
      const pdf = await renderResumePDF(getPdfResumeData(resume), {
        theme: "indigo",
        maxBulletsPerRole: 5,
        maxProjects: 4,
        excludeSections: ["Professional Summary"],
      });

      pdf.save("Omri Jukin - Resume.pdf");
      setStatus("Resume PDF generated.");
    } catch (error) {
      console.error("Error generating resume PDF:", error);
      setStatus("PDF generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button size="lg" onClick={handleDownload} disabled={isGenerating}>
        {isGenerating ? "Generating PDF..." : "Download Resume (PDF)"}
      </Button>
      {status ? (
        <p className="font-mono text-xs text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
