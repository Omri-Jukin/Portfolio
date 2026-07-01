"use client";

import * as React from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui";
import type { ResumeData, ResumePdfEngine, ResumePdfLayoutType } from "$/types";
import {
  DEFAULT_RESUME_PDF_ENGINE,
  DEFAULT_RESUME_PDF_LAYOUT,
  getPdfReadyResumeData,
  getResumePdfFileName,
  parseResumePdfEngine,
} from "$/utils/resumePdfData";

interface ResumePdfDownloadButtonProps {
  resume: ResumeData;
  engine?: ResumePdfEngine;
  allowClientFallback?: boolean;
}

type DownloadOption = {
  layout: ResumePdfLayoutType;
  label: string;
};

const downloadOptions: DownloadOption[] = [
  {
    layout: "visual",
    label: "Download Design Version (Two-Column)",
  },
  {
    layout: "ats",
    label: "Download ATS Version (Single-Column)",
  },
];

const DEFAULT_PUBLIC_DOWNLOAD_LAYOUT = DEFAULT_RESUME_PDF_LAYOUT;
const SERVER_PDF_TIMEOUT_MS = 15000;
const CLIENT_PDF_TIMEOUT_MS = 12000;
const PDF_PHOTO_MAX_WIDTH = 192;
const PDF_PHOTO_MAX_HEIGHT = 256;
const PDF_PHOTO_MATTE_COLOR = "#f8fafc";

function getConfiguredEngine(engine: ResumePdfEngine | undefined) {
  const envEngine = parseResumePdfEngine(process.env.NEXT_PUBLIC_RESUME_PDF_ENGINE);

  return (
    engine ??
    envEngine ??
    (process.env.NODE_ENV === "development" ? "react-pdf" : null) ??
    DEFAULT_RESUME_PDF_ENGINE
  );
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadServerPdf(layout: ResumePdfLayoutType) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SERVER_PDF_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(`/api/pdf?layout=${layout}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error ?? "Server PDF generation failed.");
  }

  saveBlob(await response.blob(), getResumePdfFileName(layout));
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
) {
  let timeoutId: number | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
}

function loadImageElement(blob: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();

    image.addEventListener("load", () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    });
    image.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to decode profile photo."));
    });
    image.src = objectUrl;
  });
}

async function decodeImage(blob: Blob) {
  if ("createImageBitmap" in window) {
    return createImageBitmap(blob);
  }

  return loadImageElement(blob);
}

function drawOptimizedPhotoDataUrl(image: ImageBitmap | HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = image.width;
  const height = image.height;

  if (!context || width === 0 || height === 0) {
    throw new Error("Unable to optimize profile photo.");
  }

  const scale = Math.min(
    PDF_PHOTO_MAX_WIDTH / width,
    PDF_PHOTO_MAX_HEIGHT / height,
    1
  );
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.fillStyle = PDF_PHOTO_MATTE_COLOR;
  context.fillRect(0, 0, targetWidth, targetHeight);
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  if ("close" in image) {
    image.close();
  }

  return canvas.toDataURL("image/jpeg", 0.9);
}

async function getPdfImageDataUrl(photoUrl: string | undefined) {
  if (typeof window === "undefined" || !photoUrl) {
    return photoUrl;
  }

  const url = photoUrl.startsWith("/")
    ? new URL(photoUrl, window.location.origin).href
    : photoUrl;

  try {
    const response = await withTimeout(
      fetch(url, { cache: "no-store" }),
      8000,
      "Profile photo request timed out."
    );
    if (!response.ok) {
      throw new Error(`Image request failed with ${response.status}.`);
    }

    const image = await withTimeout(
      decodeImage(await response.blob()),
      8000,
      "Profile photo decoding timed out."
    );

    return drawOptimizedPhotoDataUrl(image);
  } catch (error) {
    console.warn("Unable to embed resume profile photo:", error);
    return undefined;
  }
}

function withPhotoUrl(resume: ResumeData, photoUrl: string | undefined): ResumeData {
  return {
    ...resume,
    person: {
      ...resume.person,
      photoUrl,
    },
  };
}

async function downloadReactPdf(resume: ResumeData, layout: ResumePdfLayoutType) {
  const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./ResumePdfDocument"),
  ]);
  const readyResume = getPdfReadyResumeData(resume);
  const photoUrl =
    layout === "visual"
      ? await getPdfImageDataUrl(readyResume.person.photoUrl)
      : readyResume.person.photoUrl;
  const browserReadyResume = withPhotoUrl(readyResume, photoUrl);
  let blob: Blob;

  try {
    blob = await withTimeout(
      pdf(
        <ResumePdfDocument resume={browserReadyResume} layoutType={layout} />
      ).toBlob(),
      CLIENT_PDF_TIMEOUT_MS,
      "Client PDF generation timed out."
    );
  } catch (error) {
    if (!browserReadyResume.person.photoUrl) {
      throw error;
    }

    console.warn("Retrying resume PDF generation without profile photo:", error);
    blob = await withTimeout(
      pdf(
        <ResumePdfDocument
          resume={withPhotoUrl(readyResume, undefined)}
          layoutType={layout}
        />
      ).toBlob(),
      CLIENT_PDF_TIMEOUT_MS,
      "Client PDF generation timed out without profile photo."
    );
  }

  saveBlob(blob, getResumePdfFileName(layout));
}

export function ResumePdfDownloadButton({
  resume,
  engine,
  allowClientFallback = true,
}: ResumePdfDownloadButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeLayout, setActiveLayout] =
    React.useState<ResumePdfLayoutType | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const menuId = React.useId();
  const configuredEngine = getConfiguredEngine(engine);
  const isGenerating = activeLayout !== null;

  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleDownload = async (layout: ResumePdfLayoutType) => {
    setIsOpen(false);
    setActiveLayout(layout);
    setStatus(null);

    try {
      if (configuredEngine === "react-pdf") {
        await downloadReactPdf(resume, layout);
      } else {
        try {
          await downloadServerPdf(layout);
        } catch (serverError) {
          if (!allowClientFallback) {
            throw serverError;
          }

          setStatus("Server renderer unavailable; using browser renderer.");
          await downloadReactPdf(resume, layout);
        }
      }

      setStatus(
        layout === "ats"
          ? "ATS resume PDF downloaded."
          : "Design resume PDF downloaded."
      );
    } catch (error) {
      console.error("Error generating resume PDF:", error);
      setStatus("PDF generation failed. Please try again.");
    } finally {
      setActiveLayout(null);
    }
  };

  return (
    <div ref={rootRef} className="flex flex-col items-start gap-2">
      <DropdownMenu className="inline-flex w-max flex-col items-stretch">
        <div className="flex w-full rounded-md shadow-[var(--shadow-subtle)]">
          <Button
            size="lg"
            className="flex-1 rounded-r-none"
            onClick={() => handleDownload(DEFAULT_PUBLIC_DOWNLOAD_LAYOUT)}
            disabled={isGenerating}
          >
            {isGenerating && activeLayout === DEFAULT_PUBLIC_DOWNLOAD_LAYOUT
              ? "Generating..."
              : "Download Resume"}
          </Button>
          <Button
            size="lg"
            className="rounded-l-none border-l border-accent-foreground/25 px-3"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label="Choose resume PDF layout"
            onClick={() => setIsOpen((value) => !value)}
            disabled={isGenerating}
          >
            <span aria-hidden="true">V</span>
          </Button>
        </div>

        {isOpen ? (
          <DropdownMenuContent
            id={menuId}
            role="menu"
            className="w-full min-w-0"
            aria-label="Resume PDF layout"
          >
            {downloadOptions.map((option) => (
              <DropdownMenuItem
                key={option.layout}
                role="menuitem"
                onClick={() => handleDownload(option.layout)}
                disabled={isGenerating}
                className="whitespace-normal leading-snug"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        ) : null}
      </DropdownMenu>

      {status ? (
        <p className="font-mono text-xs text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
