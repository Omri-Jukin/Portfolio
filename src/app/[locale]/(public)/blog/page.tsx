import Link from "next/link";

export default async function BlogPage() {
  return (
    <main
      style={{
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
        padding: "72px 20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 2.75rem)", lineHeight: 1.1, margin: "0 0 16px" }}>
        Engineering notes
      </h1>
      <p style={{ color: "#52616b", fontSize: "1.1rem", lineHeight: 1.7, margin: "0 auto", maxWidth: 680 }}>
        Engineering notes are not published yet. For now, review selected case studies and project architecture.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          marginTop: 28,
        }}
      >
        <Link href="/resume#snow-hq" style={linkButtonStyle}>
          Review case studies
        </Link>
        <Link href="/#proof-locker-section" style={secondaryLinkButtonStyle}>
          Open Proof Locker
        </Link>
      </div>
    </main>
  );
}

const linkButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "0 18px",
  borderRadius: 8,
  background: "#4ECDC4",
  color: "#0a0a0a",
  fontWeight: 700,
  textDecoration: "none",
} as const;

const secondaryLinkButtonStyle = {
  ...linkButtonStyle,
  background: "transparent",
  color: "inherit",
  border: "1px solid rgba(127, 127, 127, 0.35)",
} as const;
