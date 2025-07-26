import localFont from "next/font/local";

export const bonaNovaSC = localFont({
  src: [
    {
      path: "../public/Bona_Nova_SC/BonaNovaSC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Bona_Nova_SC/BonaNovaSC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/Bona_Nova_SC/BonaNovaSC-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-bona-nova-sc",
  display: "swap",
});

// Keep the mono font for code elements
export const bonaNovaSCMono = localFont({
  src: "../public/Bona_Nova_SC/BonaNovaSC-Regular.ttf",
  variable: "--font-bona-nova-sc-mono",
  display: "swap",
});
