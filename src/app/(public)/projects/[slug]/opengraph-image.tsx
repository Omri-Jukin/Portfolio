import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type OpenGraphImageParams = {
  params: Promise<{ slug: string }>;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ProjectOpenGraphImage({
  params,
}: OpenGraphImageParams) {
  const { slug } = await params;
  const title = titleFromSlug(slug) || "Project Case Study";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0f14",
          color: "#f8fafc",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#60a5fa",
            fontSize: "24px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>Omri Jukin</span>
          <span style={{ color: "#64748b" }}>Case Study</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1
            style={{
              maxWidth: "920px",
              margin: 0,
              fontSize: "78px",
              lineHeight: 1.05,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              maxWidth: "840px",
              margin: 0,
              color: "#cbd5e1",
              fontSize: "32px",
              lineHeight: 1.3,
            }}
          >
            Full-stack TypeScript engineering proof: product flow, architecture,
            data boundaries, and shipped implementation.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#94a3b8",
            fontSize: "24px",
          }}
        >
          <span>Next.js · tRPC · Drizzle · Postgres</span>
          <span>omrijukin.com</span>
        </div>
      </div>
    ),
    size
  );
}
