import { useState, useEffect } from "react";

interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  scrollProgress: number; // 0-1 range based on document height
  direction: "up" | "down" | null;
}

export const useScrollPosition = (): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    scrollX: 0,
    scrollProgress: 0,
    direction: null,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let ticking = false;
    let lastScrollY = 0;
    let throttleTimeout: NodeJS.Timeout;

    const updateScrollPosition = () => {
      const { scrollY, scrollX } = window;
      const { scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      const direction =
        scrollY > lastScrollY ? "down" : scrollY < lastScrollY ? "up" : null;
      lastScrollY = scrollY;

      setScrollPosition({
        scrollY,
        scrollX,
        scrollProgress,
        direction,
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    const throttledRequestTick = () => {
      clearTimeout(throttleTimeout);
      throttleTimeout = setTimeout(requestTick, 16); // ~60fps
    };

    window.addEventListener("scroll", throttledRequestTick, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledRequestTick);
      clearTimeout(throttleTimeout);
    };
  }, []);

  return scrollPosition;
};
