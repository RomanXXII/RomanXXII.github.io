const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleText = document.querySelector(".theme-toggle-text");
const themePreferenceQuery = window.matchMedia
  ? window.matchMedia("(prefers-color-scheme: light)")
  : null;
const themeStorageKey = "preferred-theme";

function getStoredTheme() {
  try {
    const theme = window.localStorage.getItem(themeStorageKey);
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    /* Ignore storage failures so the toggle still works for the current page. */
  }
}

function getPreferredTheme() {
  return getStoredTheme() || (themePreferenceQuery?.matches ? "light" : "dark");
}

function setTheme(theme, { persist = false } = {}) {
  const isLight = theme === "light";

  root.dataset.theme = isLight ? "light" : "dark";

  if (persist) {
    storeTheme(root.dataset.theme);
  }

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
    setTheme(root.dataset.theme === "light" ? "dark" : "light", { persist: true });
  });
}

themePreferenceQuery?.addEventListener("change", () => {
  if (!getStoredTheme()) {
    setTheme(getPreferredTheme());
  }
});
