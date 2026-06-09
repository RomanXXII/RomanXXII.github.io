import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

const pages = [
  {
    file: "index.html",
    title: "Roman Beames",
    description:
      "Roman Beames is an AI and cybersecurity research engineer focused on AI security and autonomous systems.",
    active: "about",
    depth: 0,
  },
  {
    file: "pages/projects.html",
    title: "Projects | Roman Beames",
    description:
      "Selected AI security, cybersecurity engineering, binary analysis, annotation pipeline, and autonomous systems projects by Roman Beames.",
    active: "projects",
    depth: 1,
  },
  {
    file: "pages/beyond.html",
    title: "Beyond the Lab | Roman Beames",
    description:
      "A personal side of Roman Beames: leadership, service, music, and creative media work beyond technical research.",
    active: "beyond",
    depth: 1,
  },
  {
    file: "pages/contact.html",
    title: "Contact | Roman Beames",
    description:
      "Contact Roman Beames for research, graduate, and engineering conversations in AI security and cybersecurity engineering.",
    active: "contact",
    depth: 1,
  },
];

function prefixFor(depth) {
  return depth === 0 ? "" : "../";
}

function navHref(page, key) {
  const prefix = prefixFor(page.depth);

  const hrefs = {
    about: page.depth === 0 ? "#about" : `${prefix}index.html`,
    projects: `${prefix}pages/projects.html`,
    beyond: `${prefix}pages/beyond.html`,
    contact: `${prefix}pages/contact.html`,
  };

  if (page.depth > 0) {
    hrefs.projects = "projects.html";
    hrefs.beyond = "beyond.html";
    hrefs.contact = "contact.html";
  }

  return hrefs[key];
}

function renderHead(page) {
  const prefix = prefixFor(page.depth);

  return `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="${page.description}"
  />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; form-action 'self'; upgrade-insecure-requests"
  />
  <title>${page.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
  <script src="${prefix}assets/js/theme-init.js"></script>
  <link rel="stylesheet" href="${prefix}assets/css/style.css" />
  <script src="${prefix}assets/js/script.js" defer></script>
</head>`;
}

function renderHeader(page) {
  const prefix = prefixFor(page.depth);
  const homeHref = `${prefix}index.html`;
  const navItems = [
    ["about", "About"],
    ["projects", "Projects"],
    ["beyond", "Beyond"],
    ["contact", "Contact"],
  ];

  const navLinks = navItems
    .map(([key, label]) => {
      const current = page.active === key ? ' aria-current="page"' : "";
      return `      <a href="${navHref(page, key)}"${current}>${label}</a>`;
    })
    .join("\n");

  return `  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="${homeHref}" aria-label="Roman Beames home">RB</a>
    <nav class="site-nav" aria-label="Primary navigation">
${navLinks}
    </nav>
    <button class="theme-toggle" type="button" aria-label="Switch to light mode" aria-pressed="false">
      <span class="theme-toggle-icon" aria-hidden="true"></span>
      <span class="theme-toggle-text">Light</span>
    </button>
  </header>`;
}

function extractPageContent(html, file) {
  const match = html.match(/[ \t]*<main[\s\S]*?<\/main>(?:\s*<footer[\s\S]*?<\/footer>)?/);

  if (!match) {
    throw new Error(`Could not find main content in ${file}`);
  }

  return match[0].trimEnd();
}

function renderPage(page, content) {
  return `<!DOCTYPE html>
<html lang="en">
${renderHead(page)}
<body>
${renderHeader(page)}

${content}
</body>
</html>
`;
}

for (const page of pages) {
  const filePath = path.join(rootDir, page.file);
  const currentHtml = await readFile(filePath, "utf8");
  const content = extractPageContent(currentHtml, page.file);
  const nextHtml = renderPage(page, content);

  await writeFile(filePath, nextHtml);
  console.log(`Built ${page.file}`);
}
