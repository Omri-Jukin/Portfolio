import { NextResponse } from "next/server";
import { intakeFormSchema } from "#/lib/schemas";
import { renderProposal } from "#/lib/proposal/renderProposal";
import { sendIntakeEmails } from "#/lib/email/sendEmail";
import { createIntake } from "#/lib/db/intakes/intakes";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = intakeFormSchema.parse(payload);

    const proposalMd = renderProposal(data);

    const intake = await createIntake({
      email: data.contact.email,
      data: data as unknown as Record<string, unknown>,
      proposalMd,
    });

    // Send emails (don't fail request if email fails)
    const emailResult = await sendIntakeEmails(data, proposalMd);
    if (!emailResult.success) {
      console.error("Failed to send intake emails:", emailResult.error);
      // Continue even if email fails
    }

    return NextResponse.json({
      id: intake.id,
      proposalMarkdown: proposalMd,
      status: "ok",
    });
  } catch (error: unknown) {
    console.error("Intake API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { status: "error", error: errorMessage },
      { status: 400 }
    );
  }
}

// Return 405 for unsupported methods
export async function GET() {
  return NextResponse.json(
    { status: "error", error: "Method not allowed" },
    { status: 405 }
  );
}
