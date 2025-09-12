import { Metadata } from "next";
import Education from "~/Education";

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
