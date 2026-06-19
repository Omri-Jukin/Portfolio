import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080a12",
          color: "#f5f7fb",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#ff4d67",
            fontSize: "24px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>Omri Jukin</span>
          <span style={{ color: "#5b8cff" }}>Portfolio</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1
            style={{
              maxWidth: "940px",
              margin: 0,
              fontSize: "82px",
              lineHeight: 1.03,
            }}
          >
            Full-Stack TypeScript Engineer
          </h1>
          <p
            style={{
              maxWidth: "850px",
              margin: 0,
              color: "#d6dceb",
              fontSize: "32px",
              lineHeight: 1.3,
            }}
          >
            Production-minded systems across Next.js, React, Node.js, Postgres,
            tRPC, Drizzle, and Cloudflare.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#a7b0c2",
            fontSize: "24px",
          }}
        >
          <span>Case studies - Resume - CMS-backed portfolio</span>
          <span>omrijukin.com</span>
        </div>
      </div>
    ),
    size
  );
}
