"use client";

import { useEffect } from "react";

const BundleAnalyzer: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only run in development or when explicitly enabled
    if (
      process.env.NODE_ENV !== "development" &&
      !process.env.NEXT_PUBLIC_ENABLE_BUNDLE_ANALYZER
    ) {
      return;
    }

    const analyzeBundle = () => {
      // Get all script tags
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      const stylesheets = Array.from(
        document.querySelectorAll("link[rel='stylesheet']")
      );

      console.group("📦 Bundle Analysis");
      console.log("Scripts loaded:", scripts.length);
      console.log("Stylesheets loaded:", stylesheets.length);

      // Analyze script sizes
      const scriptSizes = scripts.map((script) => {
        const src = script.getAttribute("src");
        return {
          src,
          size: "Unknown (requires network analysis)",
        };
      });

      console.table(scriptSizes);

      // Check for large bundles
      const largeScripts = scripts.filter((script) => {
        const src = script.getAttribute("src");
        return (
          src &&
          (src.includes("_next/static/chunks") ||
            src.includes("_next/static/css"))
        );
      });

      if (largeScripts.length > 0) {
        console.warn("Large bundles detected:", largeScripts.length);
        console.log("Consider code splitting for these bundles");
      }

      // Check for unused CSS
      const unusedStylesheets = stylesheets.filter((link) => {
        const href = link.getAttribute("href");
        return href && href.includes("_next/static/css");
      });

      if (unusedStylesheets.length > 0) {
        console.log("CSS bundles:", unusedStylesheets.length);
        console.log("Consider purging unused CSS");
      }

      console.groupEnd();
    };

    // Analyze after page load
    if (document.readyState === "complete") {
      analyzeBundle();
    } else {
      window.addEventListener("load", analyzeBundle);
    }

    return () => {
      window.removeEventListener("load", analyzeBundle);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BundleAnalyzer;
