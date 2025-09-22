"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only run in development or when explicitly enabled
    if (
      process.env.NODE_ENV !== "development" &&
      !process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITOR
    ) {
      return;
    }

    const measurePerformance = () => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Measure Core Web Vitals
      if ("PerformanceObserver" in window) {
        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(
            (entry) => entry.name === "first-contentful-paint"
          );
          if (fcpEntry) {
            metrics.fcp = fcpEntry.startTime;
            console.log("FCP:", fcpEntry.startTime.toFixed(2), "ms");
          }
        }).observe({ entryTypes: ["paint"] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime;
            console.log("LCP:", lastEntry.startTime.toFixed(2), "ms");
          }
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceEventTiming[];
          entries.forEach((entry) => {
            if (
              typeof entry.processingStart === "number" &&
              typeof entry.startTime === "number"
            ) {
              metrics.fid = entry.processingStart - entry.startTime;
              console.log("FID:", metrics.fid.toFixed(2), "ms");
            }
          });
        }).observe({ entryTypes: ["first-input"] });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (
              typeof (entry as unknown as { hadRecentInput: boolean })
                .hadRecentInput === "boolean" &&
              !(entry as unknown as { hadRecentInput: boolean }).hadRecentInput
            ) {
              clsValue += (entry as unknown as { value: number }).value;
            }
          });
          metrics.cls = clsValue;
          console.log("CLS:", clsValue.toFixed(4));
        }).observe({ entryTypes: ["layout-shift"] });
      }

      // Time to First Byte
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        console.log("TTFB:", metrics.ttfb.toFixed(2), "ms");
      }

      // Log performance summary
      setTimeout(() => {
        console.group("🚀 Performance Metrics");
        console.log(
          "First Contentful Paint:",
          metrics.fcp?.toFixed(2) || "N/A",
          "ms"
        );
        console.log(
          "Largest Contentful Paint:",
          metrics.lcp?.toFixed(2) || "N/A",
          "ms"
        );
        console.log(
          "First Input Delay:",
          metrics.fid?.toFixed(2) || "N/A",
          "ms"
        );
        console.log(
          "Cumulative Layout Shift:",
          metrics.cls?.toFixed(4) || "N/A"
        );
        console.log(
          "Time to First Byte:",
          metrics.ttfb?.toFixed(2) || "N/A",
          "ms"
        );
        console.groupEnd();
      }, 3000);
    };

    // Measure performance after page load
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance);
    }

    return () => {
      window.removeEventListener("load", measurePerformance);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
