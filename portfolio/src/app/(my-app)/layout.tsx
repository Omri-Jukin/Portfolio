import type { Metadata } from "next";
import ThemeRegistry from "../ThemeRegistry";
import { TRPCProvider } from "@/components/Providers";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "My professional portfolio showcasing projects, skills, and experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <TRPCProvider>
            <Header />
            <main style={{ paddingTop: "72px" }}>
              {children}
            </main>
          </TRPCProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
