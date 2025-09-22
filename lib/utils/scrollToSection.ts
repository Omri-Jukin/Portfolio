export const scrollToSection = (
  sectionId: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" }
) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedId = sectionId.startsWith("#") ? sectionId.slice(1) : sectionId;
  const updateHash = () => {
    if (history.replaceState) {
      history.replaceState(null, "", `#${normalizedId}`);
    } else {
      window.location.hash = normalizedId;
    }
  };

  const attemptScroll = () => {
    const element = document.getElementById(normalizedId);
    if (!element) {
      return false;
    }

    element.scrollIntoView(options);
    updateHash();
    return true;
  };

  if (!attemptScroll()) {
    window.setTimeout(attemptScroll, 120);
  }
};
