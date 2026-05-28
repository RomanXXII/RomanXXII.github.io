const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleText = document.querySelector(".theme-toggle-text");

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    return;
  }
}

function setTheme(theme) {
  const isLight = theme === "light";

  root.dataset.theme = isLight ? "light" : "dark";
  storeTheme(root.dataset.theme);

  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");

  if (themeToggleText) {
    themeToggleText.textContent = isLight ? "Dark" : "Light";
  }
}

if (themeToggle) {
  setTheme(getStoredTheme() === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
}
