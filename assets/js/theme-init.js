const storedTheme = (() => {
  try {
    const theme = window.localStorage.getItem("preferred-theme");
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    return null;
  }
})();

const initialTheme = storedTheme
  || (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");

document.documentElement.dataset.theme = initialTheme;
