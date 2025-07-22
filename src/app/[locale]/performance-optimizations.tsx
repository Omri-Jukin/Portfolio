import { useEffect } from "react";

export default function PerformanceOptimizations() {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      {
        rel: "preload",
        href: "/profile-photo.jpg",
        as: "image",
        type: "image/jpeg",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/profile-photo.jpg",
        as: "image",
        type: "image/jpeg",
        crossOrigin: "anonymous",
      },
    ];

    preloadLinks.forEach(({ rel, href, as, type, crossOrigin }) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      if (type) link.type = type;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false;

      const updateScroll = () => {
        // Add scroll optimizations here if needed
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll);
          ticking = true;
        }
      };

      window.addEventListener("scroll", requestTick, { passive: true });

      return () => {
        window.removeEventListener("scroll", requestTick);
      };
    };

    const cleanup = optimizeScroll();
    return cleanup;
  }, []);

  return null;
}
