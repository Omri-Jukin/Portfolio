import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as puppeteer from "@cloudflare/puppeteer";
import type { Browser } from "@cloudflare/puppeteer";
import { NextRequest, NextResponse } from "next/server";
import {
  getResumePdfFileName,
  parseResumePdfLayout,
} from "$/utils/resumePdfData";

export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function getRenderUrl(request: NextRequest, layout: "ats" | "visual") {
  const renderUrl = new URL("/resume/pdf-render", request.url);
  renderUrl.searchParams.set("layout", layout);

  return renderUrl;
}

function isCloudflareRuntimeUnavailable(error: unknown) {
  if (!(error instanceof Error)) return false;

  return (
    error.message.includes("getCloudflareContext") ||
    error.message.includes("platform proxy") ||
    error.message.includes("Cloudflare context")
  );
}

export async function GET(request: NextRequest) {
  const layout = parseResumePdfLayout(request.nextUrl.searchParams.get("layout"));

  if (!layout) {
    return jsonError("Invalid layout. Use layout=ats or layout=visual.", 400);
  }

  let browser: Browser | null = null;

  try {
    const { env } = await getCloudflareContext({ async: true });

    if (!env.BROWSER) {
      return jsonError(
        "Server PDF rendering is not available in this runtime.",
        503
      );
    }

    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    const renderUrl = getRenderUrl(request, layout);

    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });
    await page.emulateMediaType("print");
    await page.goto(renderUrl.toString(), {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("[data-resume-pdf-ready='true']", {
      timeout: 10000,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${getResumePdfFileName(layout)}"`,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    if (!browser || isCloudflareRuntimeUnavailable(error)) {
      return jsonError(
        "Server PDF rendering requires the Cloudflare Browser binding.",
        503
      );
    }

    console.error("Resume PDF generation failed", error);

    return jsonError("Resume PDF generation failed.", 500);
  } finally {
    await browser?.close();
  }
}
