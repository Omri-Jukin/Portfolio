const themeScript = `
(() => {
  try {
    const initialPath = window.location.pathname;
    const introStorageKey = "portfolio:reload-terminal-intro:v2";
    window.__PORTFOLIO_INITIAL_PATH__ = initialPath;
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = storedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introAlreadyShown = window.sessionStorage.getItem(introStorageKey);
    if (initialPath === "/" && !reduceMotion && !introAlreadyShown) {
      document.documentElement.dataset.homeIntro = "pending";
    } else {
      document.documentElement.removeAttribute("data-home-intro");
    }
  } catch {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
    document.documentElement.removeAttribute("data-home-intro");
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
