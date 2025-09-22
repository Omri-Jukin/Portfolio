import { useEffect, useMemo, useState } from "react";

interface UseActiveSectionOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export const useActiveSection = (
  sectionIds: string[],
  {
    rootMargin = "-50% 0px -30% 0px",
    threshold = [0, 0.25, 0.5, 0.75],
  }: UseActiveSectionOptions = {}
): string | null => {
  const [activeSection, setActiveSection] = useState<string | null>(
    sectionIds[0] ?? null
  );

  const ids = useMemo(() => sectionIds.filter(Boolean), [sectionIds]);

  useEffect(() => {
    if (typeof window === "undefined" || ids.length === 0) {
      return undefined;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries[0];
          setActiveSection(topEntry.target.id);
          return;
        }

        const entryClosestToTop =
          entries.reduce<IntersectionObserverEntry | null>((closest, entry) => {
            if (!closest) {
              return entry;
            }

            return entry.boundingClientRect.top < closest.boundingClientRect.top
              ? entry
              : closest;
          }, null);

        if (entryClosestToTop) {
          setActiveSection(entryClosestToTop.target.id);
        }
      },
      { rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [ids, rootMargin, threshold]);

  return activeSection;
};
