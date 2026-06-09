const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleText = document.querySelector(".theme-toggle-text");
const themePreferenceQuery = window.matchMedia
  ? window.matchMedia("(prefers-color-scheme: light)")
  : null;

function getPreferredTheme() {
  return themePreferenceQuery?.matches ? "light" : "dark";
}

function setTheme(theme) {
  const isLight = theme === "light";

  root.dataset.theme = isLight ? "light" : "dark";

  if (!themeToggle) {
    return;
  }

  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");

  if (themeToggleText) {
    themeToggleText.textContent = isLight ? "Dark" : "Light";
  }
}

if (themeToggle) {
  setTheme(getPreferredTheme());

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
}

themePreferenceQuery?.addEventListener("change", () => {
  setTheme(getPreferredTheme());
});
