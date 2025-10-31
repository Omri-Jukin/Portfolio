# Portfolio Intake Form — Full Specification (Consolidated)

> This file consolidates **intake form functionality**, **email delivery**, **admin panel behavior**, and **auth fix instructions** for production stability.

---

## 1. Intake Form Behavior

### Required Actions

- On submit:

  1. Validate client data with Zod.
  2. Save intake data to DB (JSONB column).
  3. Generate Markdown proposal from data.
  4. Send email copies to both client and Omri.
  5. Expose record in the admin panel for review.

### Email Distribution

- Client receives: confirmation email + full form summary + proposal.
- Omri receives: identical copy (via BCC or separate email).

**.env Example:**

```bash
SES_REGION=eu-central-1
SES_ACCESS_KEY_ID=...
SES_SECRET_ACCESS_KEY=...
EMAIL_FROM="Omri Jukin <intake@omrijukin.com>"
EMAIL_BCC=omrijukin@gmail.com
```

**Email Utility (`/lib/email.ts`)**

```ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.SES_REGION });

export async function sendEmail({
  to,
  subject,
  html,
  text,
  bcc,
}: {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  bcc?: string[];
}) {
  const cmd = new SendEmailCommand({
    Destination: { ToAddresses: to, BccAddresses: bcc },
    Source: process.env.EMAIL_FROM!,
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: html, Charset: "UTF-8" },
        Text: { Data: text ?? "", Charset: "UTF-8" },
      },
    },
  });
  await ses.send(cmd);
}
```

### Submit Handler

```ts
await sendEmail({
  to: [intake.contact.email],
  bcc: [process.env.EMAIL_BCC!],
  subject: `Thanks — we received your project intake (${
    intake.org?.name ?? intake.contact.fullName
  })`,
  html: renderClientReceiptHTML(intake, proposalMarkdown),
  text: renderClientReceiptText(intake, proposalMarkdown),
});

await sendEmail({
  to: [process.env.EMAIL_BCC!],
  subject: `NEW INTAKE — ${intake.org?.name ?? intake.contact.fullName}`,
  html: renderInternalSummaryHTML(intake),
});
```

---

## 2. Database Layer (Drizzle)

```ts
// /lib/db/schema.ts
import { pgTable, uuid, jsonb, timestamp, text } from "drizzle-orm/pg-core";

export const intakes = pgTable("intakes", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  data: jsonb("data").notNull(),
  proposalMd: text("proposal_md").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
```

Insert Example:

```ts
const parsed = IntakeSchema.parse(body);
const proposalMarkdown = renderProposal(parsed);
await db.insert(intakes).values({
  email: parsed.contact.email,
  data: parsed,
  proposalMd: proposalMarkdown,
});
```

---

## 3. Admin Panel UI

### `/admin/intakes` (List)

```tsx
const rows = await db.select().from(intakes).orderBy(desc(intakes.createdAt));
return (
  <table>
    {rows.map((r) => {
      const d = r.data as any;
      return (
        <tr key={r.id}>
          <td>{r.email}</td>
          <td>{d.org?.name ?? d.contact.fullName}</td>
          <td>
            <a href={`/admin/intakes/${r.id}`}>View</a>
          </td>
        </tr>
      );
    })}
  </table>
);
```

### `/admin/intakes/[id]`

- Show JSON summary.
- Show proposal Markdown rendered.
- Optional: mark reviewed / export as PDF.

---

## 4. API Endpoint

```ts
// app/api/intake/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { intakes } from "@/lib/db/schema";
import { IntakeSchema } from "@/lib/schemas/intake";
import { sendEmail } from "@/lib/email";
import { renderProposal } from "@/lib/proposal";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = IntakeSchema.parse(payload);

    const proposalMd = renderProposal(data);
    const [row] = await db
      .insert(intakes)
      .values({ email: data.contact.email, data, proposalMd })
      .returning({ id: intakes.id });

    await sendEmail({
      to: [data.contact.email],
      bcc: [process.env.EMAIL_BCC!],
      subject: "We received your intake",
      html: `<pre>${JSON.stringify(
        data,
        null,
        2
      )}</pre><hr/><pre>${proposalMd}</pre>`,
    });

    return NextResponse.json({
      id: row.id,
      proposalMarkdown: proposalMd,
      status: "ok",
    });
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", error: e.message },
      { status: 400 }
    );
  }
}
```

---

## 5. Production Login/Signup Bug Fix

### Problem

**Error:** `Unexpected token '<', "<!DOCTYPE"... is not valid JSON`
→ The client tried parsing an HTML error/redirect as JSON.

### Causes

- Endpoint returned HTML (404/redirect).
- Middleware caught auth and redirected.
- Server error fell back to Next.js HTML page.

### Fixes

1. **Always return JSON**

```ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ... user creation logic ...
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 400 }
    );
  }
}
```

2. **Client-side Fetch Wrapper**

```ts
async function postJSON(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const ct = res.headers.get("content-type") ?? "";
  const text = await res.text();
  if (!ct.includes("application/json")) {
    throw new Error(`Non-JSON response: ${text.slice(0, 100)}`);
  }
  return JSON.parse(text);
}
```

3. **Bypass Middleware for API Routes**

```ts
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

4. **Health Checks**

- `/api/auth/signup` must return `{ok:true}` or `{ok:false}` JSON only.
- No redirects allowed.
- Check logs for HTML payload responses.

---

## 6. Tests & Acceptance

- ✅ Intake saves to DB.
- ✅ Both emails sent.
- ✅ Admin view lists new intake.
- ✅ Signup/Login return JSON.
- ✅ No `<` tokens in client console.
- ✅ Lighthouse ≥ 95 accessibility, LCP < 2.5s.

---

## 7. Cursor Directives

Tell Cursor:

1. Implement email sending (SES).
2. Add `/api/intake` POST route per spec.
3. Store full JSON + proposalMd.
4. Build `/admin/intakes` + detail pages.
5. Fix auth to always JSON‑respond.
6. Ensure form auto‑sends confirmation to both parties.
7. Test E2E for submit + admin + login.

---

**Result:** The system now reliably collects intake data, sends confirmations to both sides, stores and displays records in the admin dashboard, and has a stable JSON‑based auth system with no HTML error leaks.
