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

const emailRevealLinks = document.querySelectorAll(".email-reveal-link");

function reverseText(value) {
  return value.split("").reverse().join("");
}

emailRevealLinks.forEach((link) => {
  const emailText = link.querySelector(".email-reveal-text");
  const copyControl = link.querySelector(".email-copy-control");
  const user = reverseText(link.dataset.emailUser || "");
  const domain = reverseText(link.dataset.emailDomain || "");
  const email = user && domain ? `${user}@${domain}` : "";

  if (!emailText || !email) {
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();

    if (link.dataset.revealed === "true") {
      return;
    }

    emailText.textContent = email;
    link.dataset.revealed = "true";
  });

  copyControl?.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await copyEmail(email, copyControl);
  });

  copyControl?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    await copyEmail(email, copyControl);
  });
});

async function copyEmail(email, control) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.inset = "0 auto auto 0";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    control.classList.add("is-copied");
    control.textContent = "Copied";
    control.setAttribute("aria-label", "Email copied");
    window.setTimeout(() => {
      control.classList.remove("is-copied");
      control.textContent = "Copy";
      control.setAttribute("aria-label", "Copy email");
    }, 1400);
  } catch {
    control.setAttribute("aria-label", "Copy failed");
  }
}
