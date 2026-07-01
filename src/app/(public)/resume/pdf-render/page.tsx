import type { Metadata } from "next";
import { getResumeDataFromCms } from "$/data/resumeCmsData";
import {
  DEFAULT_RESUME_PDF_LAYOUT,
  getPdfReadyResumeData,
  parseResumePdfLayout,
} from "$/utils/resumePdfData";
import { ResumePrintView } from "./ResumePrintView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume PDF Render",
  robots: {
    index: false,
    follow: false,
  },
};

const printStyles = `
  @page {
    size: A4;
    margin: 0;
  }

  html,
  body {
    background: #ffffff !important;
  }

  body::before,
  header:not(.resume-header):not(.visual-header),
  footer {
    display: none !important;
  }

  main {
    background: #ffffff !important;
  }

  .resume-sheet {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    color: #111827;
    font-family: Inter, Arial, Helvetica, sans-serif;
    font-size: 10.2pt;
    line-height: 1.35;
    letter-spacing: 0;
  }

  .resume-sheet * {
    box-sizing: border-box;
    letter-spacing: 0;
  }

  .ats-layout {
    padding: 14mm 16mm;
  }

  .resume-header {
    border-bottom: 1px solid #cbd5e1;
    margin-bottom: 4.4mm;
    padding-bottom: 3.6mm;
  }

  .resume-header h1,
  .visual-header h1 {
    margin: 0;
    font-size: 22pt;
    line-height: 1.05;
    font-weight: 800;
  }

  .headline {
    margin: 2.2mm 0 1.4mm;
    color: #1f2937;
    font-size: 10.4pt;
    font-weight: 600;
  }

  .contact-line {
    margin: 0;
    color: #475569;
    font-size: 8.6pt;
  }

  .resume-section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-top: 4mm;
    orphans: 3;
    widows: 3;
  }

  .resume-section h2 {
    margin: 0 0 1.8mm;
    color: #1e3a8a;
    font-size: 10.6pt;
    font-weight: 800;
    text-transform: uppercase;
  }

  .resume-section p {
    margin: 0 0 1.3mm;
  }

  .skill-rows p {
    margin-bottom: 0.9mm;
  }

  .resume-entry {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-top: 2.2mm;
  }

  .resume-entry.compact {
    margin-top: 1.2mm;
  }

  .resume-entry h3 {
    margin: 0 0 1mm;
    color: #111827;
    font-size: 9.8pt;
    font-weight: 800;
  }

  ul {
    margin: 0;
    padding-left: 4.4mm;
  }

  li {
    margin: 0 0 0.8mm;
    padding-left: 0.5mm;
  }

  .visual-layout {
    min-height: 297mm;
  }

  .visual-header {
    min-height: 39mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8mm;
    padding: 10mm 14mm;
    background: #263244;
    color: #ffffff;
  }

  .visual-header p {
    margin: 2mm 0 0;
    color: #dbeafe;
    font-size: 10.6pt;
    font-weight: 600;
  }

  .visual-photo-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30mm;
    height: 38mm;
    border: 0.3mm solid #e2e8f0;
    border-radius: 2mm;
    background: #f8fafc;
    padding: 1.4mm;
  }

  .visual-photo-frame img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .visual-body {
    display: grid;
    grid-template-columns: 58mm minmax(0, 1fr);
    align-items: start;
    min-height: 258mm;
  }

  .visual-sidebar {
    min-height: 258mm;
    padding: 8mm 6mm 10mm;
    background: #eef2f6;
    color: #263244;
  }

  .visual-sidebar section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 5mm;
  }

  .visual-sidebar h2 {
    margin: 0 0 2mm;
    border-bottom: 1px solid #94a3b8;
    padding-bottom: 1.4mm;
    color: #263244;
    font-size: 9.6pt;
    font-weight: 800;
    text-transform: uppercase;
  }

  .visual-sidebar h3 {
    margin: 0 0 0.6mm;
    font-size: 8.5pt;
    font-weight: 800;
  }

  .visual-sidebar p {
    margin: 0 0 1.4mm;
    overflow-wrap: anywhere;
    color: #334155;
    font-size: 8.3pt;
  }

  .visual-main {
    padding: 7mm 12mm 10mm 9mm;
  }

  .visual-main .resume-section:first-child {
    margin-top: 0;
  }

  @media print {
    .resume-sheet {
      margin: 0;
      box-shadow: none;
    }
  }
`;

export default async function ResumePdfRenderPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawLayout = Array.isArray(params.layout) ? params.layout[0] : params.layout;
  const layout = parseResumePdfLayout(rawLayout) ?? DEFAULT_RESUME_PDF_LAYOUT;
  const resume = getPdfReadyResumeData(await getResumeDataFromCms());

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <ResumePrintView resume={resume} layout={layout} />
    </>
  );
}
