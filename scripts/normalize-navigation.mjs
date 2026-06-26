import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const utf8 = "utf8";
const release = "v2.5.4 mantra lens";

const routes = [
  ["index.html", "Home"],
  ["build-status.html", "Build"],
  ["blueprint.html", "Blueprint"],
  ["sourcelibrary.html", "Sources"],
  ["retrievallab.html", "Retrieval"],
  ["citedanswerlab.html", "Answers"],
  ["mantralenslab.html", "Mantra"],
  ["calm.html", "Calm"],
  ["daily.html", "Daily"],
  ["practice.html", "Practice"]
];

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  return readFileSync(file(rel), utf8);
}

function write(rel, content) {
  writeFileSync(file(rel), content, utf8);
}

function navFor(rel) {
  const prefix = rel.startsWith("brand/") ? "../" : "";
  const activeName = path.basename(rel);
  const links = routes.map(([href, label]) => {
    const active = href === activeName || (rel === "brand/brand-board.html" && label === "Build" ? false : false);
    return `          <a class="link${active ? " active" : ""}" href="${prefix}${href}">${label}</a>`;
  });
  links.splice(2, 0, `          <a class="link${rel === "brand/brand-board.html" ? " active" : ""}" href="${prefix}brand/brand-board.html">Brand</a>`);
  links.push(`          <span class="version">${release}</span>`);
  return `        <nav class="nav" aria-label="Project links">\n${links.join("\n")}\n        </nav>`;
}

function addCompactCss(content) {
  if (content.includes("/* VEDAPATH COMPACT NAV */")) return content;
  const css = `\n      /* VEDAPATH COMPACT NAV */\n      .nav {\n        max-width: 840px;\n      }\n\n      .nav .link,\n      .nav .version {\n        white-space: nowrap;\n      }\n\n      @media (max-width: 780px) {\n        .nav {\n          gap: 6px;\n        }\n\n        .nav .link,\n        .nav .version {\n          min-height: 32px;\n          padding: 5px 9px;\n          font-size: 12px;\n        }\n      }\n`;
  return content.replace(/(\s*)<\/style>/, `${css}$1</style>`);
}

function normalizeNav(rel) {
  let content = read(rel);
  const before = content;
  content = content.replace(/<nav class="nav" aria-label="Project links">[\s\S]*?<\/nav>/, navFor(rel));
  content = addCompactCss(content);
  if (content !== before) write(rel, content);
}

function normalizeBuildStatus() {
  let content = read("build-status.html");
  const compact = `Updated June 26, 2026 | Branch main | <strong>${release}</strong> | <a href="index.html">Home</a> | <a href="blueprint.html">Blueprint</a> | <a href="sourcelibrary.html">Sources</a> | <a href="retrievallab.html">Retrieval</a> | <a href="citedanswerlab.html">Answers</a> | <a href="mantralenslab.html">Mantra</a>`;
  content = content.replace(/<div class="meta">[\s\S]*?<\/div>\s*<\/header>/, `<div class="meta">${compact}</div>\n      </header>`);
  if (!content.includes("/* VEDAPATH COMPACT META */")) {
    const css = `\n      /* VEDAPATH COMPACT META */\n      .meta {\n        max-width: 780px;\n        text-align: right;\n      }\n\n      .meta strong,\n      .meta a {\n        white-space: nowrap;\n      }\n`;
    content = content.replace(/(\s*)<\/style>/, `${css}$1</style>`);
  }
  write("build-status.html", content);
}

for (const name of readdirSync(root).filter((item) => item.endsWith(".html"))) {
  normalizeNav(name);
}
normalizeNav("brand/brand-board.html");
normalizeBuildStatus();
console.log("Normalized VedaPath navigation.");
