/**
 * Performance optimization utilities
 */

// Image optimization utilities
export const getOptimizedImageProps = (
  src: string,
  width: number,
  height: number,
  quality: number = 75
) => ({
  src,
  width,
  height,
  quality,
  priority: false,
  loading: "lazy" as const,
  placeholder: "blur" as const,
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
});

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === "undefined") return;

  // Preload critical fonts
  const fontPreloads = [
    {
      href: "/fonts/inter-var.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
  ];

  fontPreloads.forEach(({ href, as, type, crossorigin }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    link.type = type;
    if (crossorigin) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
  });
};

// Resource hints for better performance
export const addResourceHints = () => {
  if (typeof window === "undefined") return;

  // DNS prefetch for external domains
  const domains = ["fonts.googleapis.com", "fonts.gstatic.com", "calendly.com"];

  domains.forEach((domain) => {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

// Debounce utility for performance
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window === "undefined" || !("memory" in performance)) {
    return null;
  }

  const memory = (
    performance as {
      memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    }
  ).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  };
};

// Performance observer for monitoring
export const observePerformance = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  // Observe largest contentful paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log("LCP:", lastEntry.startTime);
  });

  try {
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch {
    // LCP not supported
  }

  // Observe first input delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const eventTiming = entry as PerformanceEventTiming;
      console.log("FID:", eventTiming.processingStart - eventTiming.startTime);
    });
  });

  try {
    fidObserver.observe({ entryTypes: ["first-input"] });
  } catch {
    // FID not supported
  }

  // Observe cumulative layout shift
  const clsObserver = new PerformanceObserver((list) => {
    let clsValue = 0;
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const layoutShift = entry as unknown as {
        hadRecentInput: boolean;
        value: number;
      };
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value;
      }
    });
    console.log("CLS:", clsValue);
  });

  try {
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  } catch {
    // CLS not supported
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  if (typeof document === "undefined") return;

  const style = document.createElement("style");
  style.textContent = css;
  style.setAttribute("data-critical", "true");
  document.head.appendChild(style);
};

// Service worker registration for caching
export const registerServiceWorker = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("SW registered: ", registration);
  } catch (error) {
    console.log("SW registration failed: ", error);
  }
};
