import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE_LINKS } from "$/constants";

export const metadata: Metadata = {
  title: "Contact Omri Jukin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function IntakeFormPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "min(760px, 100%)",
          border: "1px solid rgba(15, 23, 42, 0.14)",
          borderRadius: 8,
          padding: "2rem",
          background: "#fff",
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 0.75rem",
            textTransform: "uppercase",
            letterSpacing: 0,
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#2563eb",
          }}
        >
          Direct contact
        </p>
        <h1 style={{ margin: "0 0 1rem", fontSize: "2rem", lineHeight: 1.15 }}>
          Send role context by email.
        </h1>
        <p style={{ margin: "0 0 1.5rem", color: "#475569", lineHeight: 1.7 }}>
          The public intake form is not part of the recruiter review flow. For
          hiring conversations, send the role, stack, team context, ownership
          expectations, and interview process.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href={`mailto:${PROFILE_LINKS.EMAIL}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 1rem",
              borderRadius: 6,
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Email Omri
          </a>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 1rem",
              borderRadius: 6,
              border: "1px solid rgba(15, 23, 42, 0.18)",
              color: "#111827",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Open contact page
          </Link>
        </div>
      </section>
    </main>
  );
}
