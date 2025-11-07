import { Metadata } from "next";
import dynamic from "next/dynamic";

// Dynamically import Education component with no SSR
const Education = dynamic(() => import("~/Education"), {
  ssr: true,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
      }}
    >
      <div>Loading education data...</div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Education | Omri Jukin",
  description:
    "My academic background and continuous learning journey in computer science and software engineering.",
  keywords: [
    "education",
    "computer science",
    "software engineering",
    "academic background",
    "certifications",
    "learning",
    "Omri Jukin",
  ],
  openGraph: {
    title: "Education | Omri Jukin",
    description:
      "My academic background and continuous learning journey in computer science and software engineering.",
    type: "website",
  },
};

export default function EducationPage() {
  return <Education />;
}
