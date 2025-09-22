/**
 * Accessibility utilities for keyboard navigation and screen reader support
 */

// Keyboard navigation utilities
export const handleKeyDown = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      onEnter?.();
      break;
    case "Escape":
      event.preventDefault();
      onEscape?.();
      break;
    case "ArrowUp":
      event.preventDefault();
      onArrowUp?.();
      break;
    case "ArrowDown":
      event.preventDefault();
      onArrowDown?.();
      break;
    case "ArrowLeft":
      event.preventDefault();
      onArrowLeft?.();
      break;
    case "ArrowRight":
      event.preventDefault();
      onArrowRight?.();
      break;
  }
};

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);
  firstElement?.focus();

  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
};

// Screen reader announcements
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Skip link functionality
export const createSkipLink = (targetId: string, label: string) => {
  const skipLink = document.createElement("a");
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 4px;
    transition: top 0.3s;
  `;

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px";
  });

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });

  return skipLink;
};

// ARIA live region for dynamic content
export const createLiveRegion = (id: string, atomic: boolean = true) => {
  const liveRegion = document.createElement("div");
  liveRegion.id = id;
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", atomic.toString());
  liveRegion.className = "sr-only";
  liveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;

  document.body.appendChild(liveRegion);
  return liveRegion;
};

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
  if (typeof window === "undefined") return false;

  const mediaQuery = window.matchMedia("(prefers-contrast: high)");
  return mediaQuery.matches;
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
};

// Color scheme detection
export const getColorScheme = (): "light" | "dark" | "no-preference" => {
  if (typeof window === "undefined") return "no-preference";

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches ? "dark" : "light";
};

// Focus visible detection
export const supportsFocusVisible = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    document.createElement("div").style.outline = "1px solid";
    return true;
  } catch {
    return false;
  }
};

// Announce page changes for single-page applications
export const announcePageChange = (pageTitle: string) => {
  announceToScreenReader(`Navigated to ${pageTitle}`);
  document.title = pageTitle;
};

// Validate ARIA attributes
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const errors: string[] = [];

  // Check for required ARIA attributes
  if (
    element.hasAttribute("aria-expanded") &&
    !element.hasAttribute("aria-controls")
  ) {
    errors.push("Elements with aria-expanded should have aria-controls");
  }

  if (
    element.hasAttribute("aria-labelledby") &&
    element.hasAttribute("aria-label")
  ) {
    errors.push("Elements should not have both aria-labelledby and aria-label");
  }

  if (
    element.hasAttribute("role") &&
    element.tagName.toLowerCase() === element.getAttribute("role")
  ) {
    errors.push("Redundant role attribute - element already has this role");
  }

  return errors;
};

// Generate accessible color combinations
export const getAccessibleColorCombination = () => {
  // This is a simplified version - in production, use a proper contrast calculation library
  const contrastRatio = 4.5; // Placeholder - would calculate actual ratio

  return {
    accessible: contrastRatio >= 4.5,
    contrastRatio,
  };
};
