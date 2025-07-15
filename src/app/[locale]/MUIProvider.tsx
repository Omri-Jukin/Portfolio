"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import createEmotionCache from "../mui-emotion-cache";

const clientSideEmotionCache = createEmotionCache();
const theme = createTheme(); // Replace with your custom theme if needed

export default function MUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
