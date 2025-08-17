import { Inter, Source_Serif_4 } from "next/font/google";

// Primary font - Inter (modern, professional sans-serif)
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Alternative professional serif font
export const sourceSerifPro = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-pro",
  display: "swap",
  weight: ["400", "600", "700"],
});

// For backwards compatibility, alias the primary font
export const bonaNovaSC = inter;
export const bonaNovaSCMono = inter;
