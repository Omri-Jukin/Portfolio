"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import type { ResumeData } from "$/types";

interface ResumePdfDownloadButtonProps {
  resume: ResumeData;
}

export function ResumePdfDownloadButton({ resume }: ResumePdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setStatus(null);
      const { renderResumePDF } = await import("$/utils/pdfGenerator");
      const pdf = await renderResumePDF(resume, {
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
