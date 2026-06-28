import fs from "node:fs";
import path from "node:path";

const release = "v3.3.0";
const releaseName = "Command Center Side Rail UX";
const releaseBadge = "v3.3.0 command shell";
const previousRelease = "v3.2.9 Controlled Permission Execution Authorization Draft Review Gate";
const cssFile = "assets/vedapath-command-shell.css";
const jsFile = "assets/vedapath-command-shell.js";
const dataFile = "data/vedapath-command-shell-ux.json";
const docFile = "docs/COMMAND_CENTER_SIDE_RAIL_UX.md";
const nextRelease = "Founder permission execution authorization review decision gate";

const shellConfig = {
  schema_version: "vedapath-command-shell-ux-v1",
  release,
  title: releaseName,
  generated_at: "2026-06-28T00:00:00.000Z",
  inspiration: "Hyrvia command-center shell: persistent side rail, compact top command controls, saved left-right navigation side preference, and wide calm work surface.",
  vedapath_direction: "Keep Bhagwa warmth, source-first tone, and simple reading surfaces while making navigation feel less scattered.",
  shell_sections: [
    { section: "Start", links: ["Home", "Build", "Brand", "Blueprint"] },
    { section: "Source", links: ["Answers", "Review", "Mantra"] },
    { section: "Practice", links: ["Life", "Talk", "Pattern", "Daily"] }
  ],
  local_preferences: ["path mode", "role view", "left/right side rail"],
  boundaries: [
    "UI shell only; no new authority, execution, storage write, account, public release, or production capability.",
    "Local preference memory stays in this browser only.",
    "Primary content remains simple and source-first."
  ],
  next_release: nextRelease
};

const css = `/* VedaPath command-center side rail shell */
:root {
  --vp-command-rail: 226px;
  --vp-command-rail-compact: 204px;
  --vp-command-ink: #1f140e;
  --vp-command-muted: #6d4330;
  --vp-command-line: rgba(168, 62, 18, 0.18);
  --vp-command-panel: rgba(255, 253, 248, 0.9);
  --vp-command-side: #21140d;
  --vp-command-side-soft: #3a2012;
  --vp-command-accent: #d65a1f;
  --vp-command-gold: #e0a83b;
  --vp-command-green: #135c4a;
}

body.vp-command-shell-ready {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(255, 246, 232, 0.92), rgba(255, 250, 242, 0.96)),
    var(--bg, #fff7ec) !important;
  color: var(--ink, #201713);
}

.vp-command-rail {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 80;
  display: flex;
  flex-direction: column;
  width: var(--vp-command-rail);
  max-width: var(--vp-command-rail);
  min-height: 100vh;
  padding: 14px;
  overflow-y: auto;
  color: #fdf7ed;
  background:
    radial-gradient(circle at 18% 0%, rgba(214, 90, 31, 0.38), transparent 32%),
    linear-gradient(180deg, var(--vp-command-side), var(--vp-command-side-soft));
  box-shadow: 18px 0 40px rgba(50, 24, 10, 0.16);
}

body.vp-nav-right .vp-command-rail {
  right: 0;
  left: auto;
  box-shadow: -18px 0 40px rgba(50, 24, 10, 0.16);
}

.vp-command-brand {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 70px;
  padding: 10px;
  border: 1px solid rgba(255, 248, 235, 0.14);
  border-radius: 8px;
  color: #fffaf1;
  text-decoration: none;
  background: rgba(255, 248, 235, 0.08);
}

.vp-command-brand:hover,
.vp-command-brand:focus-visible {
  outline: 3px solid rgba(224, 168, 59, 0.28);
}

.vp-command-brand img {
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.vp-command-brand strong,
.vp-command-brand span {
  display: block;
}

.vp-command-brand strong {
  font-size: 16px;
  line-height: 1.05;
}

.vp-command-brand span {
  margin-top: 4px;
  color: #f5d8b6;
  font-size: 12px;
}

.vp-rail-section {
  margin-top: 16px;
}

.vp-rail-section-title {
  margin: 0 0 7px;
  color: #efb06d;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.vp-rail-list {
  display: grid;
  gap: 5px;
}

.vp-rail-link {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 9px;
  align-items: center;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #f3dcc7;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
}

.vp-rail-link:hover,
.vp-rail-link:focus-visible {
  color: #ffffff;
  border-color: rgba(255, 248, 235, 0.12);
  background: rgba(255, 248, 235, 0.1);
  outline: none;
}

.vp-rail-link.is-active {
  color: var(--vp-command-ink);
  background: #fff7ea;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.vp-rail-glyph {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  color: #ffead0;
  background: rgba(255, 248, 235, 0.1);
  font-size: 12px;
  font-weight: 900;
}

.vp-rail-link.is-active .vp-rail-glyph {
  color: #fff7ea;
  background: var(--vp-command-accent);
}

.vp-rail-note {
  margin-top: auto;
  padding-top: 16px;
  color: #ebc9a9;
  font-size: 12px;
}

.vp-rail-note strong {
  display: block;
  color: #fffaf1;
  font-size: 13px;
}

body.vp-command-shell-ready .page,
body.vp-command-shell-ready .shell,
body.vp-command-shell-ready > main {
  width: auto !important;
  max-width: none !important;
  margin-left: var(--vp-command-rail) !important;
  margin-right: 0 !important;
  padding: 14px 24px 44px !important;
}

body.vp-command-shell-ready.vp-nav-right .page,
body.vp-command-shell-ready.vp-nav-right .shell,
body.vp-command-shell-ready.vp-nav-right > main {
  margin-left: 0 !important;
  margin-right: var(--vp-command-rail) !important;
}

body.vp-command-shell-ready .topbar,
body.vp-command-shell-ready header.topbar {
  position: sticky;
  top: 0;
  z-index: 60;
  display: block !important;
  height: auto !important;
  min-height: 70px !important;
  margin: 0 0 18px !important;
  padding: 9px 0 13px !important;
  border-bottom: 1px solid var(--vp-command-line) !important;
  background:
    linear-gradient(180deg, rgba(255, 250, 242, 0.96), rgba(255, 250, 242, 0.9));
  backdrop-filter: blur(14px);
}

body.vp-command-shell-ready .topbar > .brand,
body.vp-command-shell-ready header.topbar > .brand,
body.vp-command-shell-ready .topbar > .nav,
body.vp-command-shell-ready header.topbar > .nav {
  display: none !important;
}

.vp-command-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  width: 100%;
}

.vp-command-title {
  min-width: 240px;
}

.vp-command-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
}

.vp-command-eyebrow,
.vp-command-badge,
.vp-command-memory {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  border-radius: 999px;
  padding: 0 9px;
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
}

.vp-command-eyebrow {
  color: var(--vp-command-green);
  background: rgba(19, 92, 74, 0.1);
}

.vp-command-badge {
  color: var(--vp-command-accent);
  border: 1px solid rgba(214, 90, 31, 0.24);
  background: rgba(255, 241, 230, 0.72);
}

.vp-command-memory {
  color: #7a4916;
  border: 1px solid rgba(224, 168, 59, 0.28);
  background: rgba(255, 246, 221, 0.85);
}

.vp-command-title h1 {
  margin: 5px 0 0;
  color: var(--vp-command-ink);
  font-size: clamp(1.35rem, 2vw, 1.9rem);
  letter-spacing: 0;
  line-height: 1.1;
}

.vp-command-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.vp-control {
  display: grid;
  gap: 3px;
  min-width: 118px;
  color: var(--vp-command-muted);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.vp-control select,
.vp-control button {
  min-height: 34px;
  border: 1px solid rgba(168, 62, 18, 0.22);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.94);
  color: var(--vp-command-ink);
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  text-transform: none;
  padding: 0 10px;
}

.vp-control button {
  cursor: pointer;
}

.vp-control select:focus-visible,
.vp-control button:focus-visible {
  outline: 3px solid rgba(214, 90, 31, 0.2);
}

body.vp-command-shell-ready main.workspace,
body.vp-command-shell-ready .workspace,
body.vp-command-shell-ready .layout,
body.vp-command-shell-ready .summary {
  max-width: none !important;
}

body.vp-command-shell-ready .panel,
body.vp-command-shell-ready .tile,
body.vp-command-shell-ready .answer-shell,
body.vp-command-shell-ready .flow-card,
body.vp-command-shell-ready .ask-panel,
body.vp-command-shell-ready .map-card {
  border-radius: 8px !important;
}

body.vp-command-shell-ready.vp-mode-calm {
  --vp-command-accent: #c64f1b;
  --vp-command-green: #145c4a;
}

body.vp-command-shell-ready.vp-mode-study {
  --vp-command-accent: #a83e12;
  --vp-command-green: #29335c;
}

@media (max-width: 1100px) {
  :root {
    --vp-command-rail: var(--vp-command-rail-compact);
  }

  .vp-command-controls {
    justify-content: flex-start;
  }
}

@media (max-width: 860px) {
  .vp-command-rail,
  body.vp-nav-right .vp-command-rail {
    position: static;
    width: auto;
    max-width: none;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .vp-command-brand {
    grid-template-columns: 42px minmax(0, 1fr);
    min-height: 58px;
  }

  .vp-command-brand img {
    width: 42px;
    height: 42px;
  }

  .vp-rail-section {
    margin-top: 12px;
  }

  .vp-rail-list {
    display: flex;
    overflow-x: auto;
    padding-bottom: 3px;
  }

  .vp-rail-link {
    min-width: 126px;
  }

  .vp-rail-note {
    display: none;
  }

  body.vp-command-shell-ready .page,
  body.vp-command-shell-ready .shell,
  body.vp-command-shell-ready > main,
  body.vp-command-shell-ready.vp-nav-right .page,
  body.vp-command-shell-ready.vp-nav-right .shell,
  body.vp-command-shell-ready.vp-nav-right > main {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 12px 16px 36px !important;
  }

  .vp-command-top {
    align-items: flex-start;
    flex-direction: column;
  }

  .vp-command-title {
    min-width: 0;
  }

  .vp-command-controls {
    width: 100%;
  }

  .vp-control {
    min-width: min(100%, 142px);
  }
}

@media (max-width: 560px) {
  .vp-command-controls {
    display: grid;
    grid-template-columns: 1fr;
  }

  .vp-control {
    min-width: 0;
  }
}
`;

const js = `(function () {
  const releaseBadge = "${releaseBadge}";
  const prefKey = "vedapathCommandShellPrefs";
  const groups = [
    { title: "Start", labels: ["Home", "Build", "Brand", "Blueprint"] },
    { title: "Source", labels: ["Answers", "Review", "Mantra"] },
    { title: "Practice", labels: ["Life", "Talk", "Pattern", "Daily"] }
  ];
  const pageTitles = {
    Home: "VedaPath command center",
    Build: "Build status",
    Brand: "Brand board",
    Blueprint: "Product blueprint",
    Answers: "Cited answer room",
    Review: "Review queue",
    Mantra: "Mantra lens",
    Life: "Life companion",
    Talk: "Conversation companion",
    Pattern: "Pattern companion",
    Daily: "Daily calm loop"
  };

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function prefs() {
    return {
      pathMode: "Source",
      roleMode: "Founder",
      navSide: "left",
      ...safeParse(localStorage.getItem(prefKey) || "{}", {})
    };
  }

  function savePrefs(next) {
    localStorage.setItem(prefKey, JSON.stringify({ ...prefs(), ...next }));
  }

  function normalizePath(href) {
    const anchor = document.createElement("a");
    anchor.href = href;
    return anchor.pathname.replace(/\\/index\\.html$/, "/");
  }

  function activeLink(links) {
    const current = normalizePath(location.href);
    return links.find((link) => link.active) ||
      links.find((link) => normalizePath(link.href) === current) ||
      links[0];
  }

  function collectLinks(nav) {
    return Array.from(nav.querySelectorAll("a")).map((link) => ({
      label: link.textContent.trim(),
      href: link.getAttribute("href") || "#",
      active: link.classList.contains("active")
    })).filter((link) => link.label);
  }

  function groupLinks(links) {
    const used = new Set();
    const sections = groups.map((group) => {
      const items = links.filter((link) => {
        const match = group.labels.includes(link.label);
        if (match) used.add(link.label);
        return match;
      });
      return { title: group.title, items };
    }).filter((section) => section.items.length);
    const other = links.filter((link) => !used.has(link.label));
    if (other.length) sections.push({ title: "More", items: other });
    return sections;
  }

  function railHtml(brand, links) {
    const brandHref = brand && brand.getAttribute("href") ? brand.getAttribute("href") : "index.html#top";
    const brandImg = brand && brand.querySelector("img") ? brand.querySelector("img").getAttribute("src") : "assets/vedapath-3d-logo-concept.png";
    const brandTitle = brand && brand.querySelector("strong") ? brand.querySelector("strong").textContent.trim() : "VedaPath AI";
    const brandSub = brand && brand.querySelector("span") ? brand.querySelector("span").textContent.trim() : "Source-first learning companion";
    const sections = groupLinks(links).map((section) => {
      const body = section.items.map((link) => {
        const glyph = link.label.slice(0, 1).toUpperCase();
        const active = link.active ? " is-active" : "";
        return '<a class="vp-rail-link' + active + '" href="' + escapeHtml(link.href) + '">' +
          '<span class="vp-rail-glyph">' + escapeHtml(glyph) + '</span>' +
          '<span>' + escapeHtml(link.label) + '</span>' +
        '</a>';
      }).join("");
      return '<section class="vp-rail-section"><h2 class="vp-rail-section-title">' + escapeHtml(section.title) + '</h2><div class="vp-rail-list">' + body + '</div></section>';
    }).join("");
    return '<a class="vp-command-brand" href="' + escapeHtml(brandHref) + '" aria-label="VedaPath AI home">' +
      '<img src="' + escapeHtml(brandImg) + '" alt="VedaPath AI logo concept">' +
      '<div><strong>' + escapeHtml(brandTitle) + '</strong><span>' + escapeHtml(brandSub) + '</span></div>' +
      '</a>' +
      sections +
      '<div class="vp-rail-note"><span>Local command shell</span><strong>Source first. Calm path.</strong></div>';
  }

  function topHtml(active, settings) {
    const title = pageTitles[active.label] || document.title.replace(/^VedaPath\\s*/i, "").trim() || "VedaPath room";
    return '<div class="vp-command-title">' +
      '<div class="vp-command-meta">' +
        '<span class="vp-command-eyebrow">Source-first companion</span>' +
        '<span class="vp-command-badge">' + releaseBadge + '</span>' +
        '<span class="vp-command-memory">Local preferences ready</span>' +
      '</div>' +
      '<h1>' + escapeHtml(title) + '</h1>' +
    '</div>' +
    '<div class="vp-command-controls" aria-label="Workspace preferences">' +
      '<label class="vp-control"><span>Path</span><select id="vpPathMode" aria-label="Path mode">' +
        '<option value="Source">Source</option><option value="Practice">Practice</option><option value="Build">Build</option>' +
      '</select></label>' +
      '<label class="vp-control"><span>View</span><select id="vpRoleMode" aria-label="Workspace view">' +
        '<option value="Founder">Founder</option><option value="Learner">Learner</option><option value="Reviewer">Reviewer</option>' +
      '</select></label>' +
      '<label class="vp-control"><span>Side</span><select id="vpNavSide" aria-label="Navigation side">' +
        '<option value="left">Left side</option><option value="right">Right side</option>' +
      '</select></label>' +
      '<label class="vp-control"><span>Action</span><button id="vpBackToTop" type="button">Top</button></label>' +
    '</div>';
  }

  function applySettings(settings) {
    document.body.classList.toggle("vp-nav-right", settings.navSide === "right");
    document.body.classList.toggle("vp-mode-study", settings.pathMode === "Source");
    document.body.classList.toggle("vp-mode-calm", settings.pathMode === "Practice");
    const path = document.getElementById("vpPathMode");
    const role = document.getElementById("vpRoleMode");
    const side = document.getElementById("vpNavSide");
    if (path) path.value = settings.pathMode;
    if (role) role.value = settings.roleMode;
    if (side) side.value = settings.navSide;
  }

  function init() {
    if (document.querySelector(".vp-command-rail")) return;
    const topbar = document.querySelector(".topbar, header.topbar");
    if (!topbar) return;
    const brand = topbar.querySelector(".brand");
    const nav = topbar.querySelector(".nav");
    if (!nav) return;
    const links = collectLinks(nav);
    if (!links.length) return;
    const active = activeLink(links);
    if (active) active.active = true;

    const rail = document.createElement("aside");
    rail.className = "vp-command-rail";
    rail.setAttribute("aria-label", "VedaPath side navigation");
    rail.innerHTML = railHtml(brand, links);
    document.body.insertBefore(rail, document.body.firstChild);

    const commandTop = document.createElement("div");
    commandTop.className = "vp-command-top";
    commandTop.innerHTML = topHtml(active, prefs());
    topbar.insertBefore(commandTop, topbar.firstChild);

    document.body.classList.add("vp-command-shell-ready");
    applySettings(prefs());

    document.getElementById("vpPathMode")?.addEventListener("change", (event) => {
      savePrefs({ pathMode: event.target.value });
      applySettings(prefs());
    });
    document.getElementById("vpRoleMode")?.addEventListener("change", (event) => {
      savePrefs({ roleMode: event.target.value });
      applySettings(prefs());
    });
    document.getElementById("vpNavSide")?.addEventListener("change", (event) => {
      savePrefs({ navSide: event.target.value });
      applySettings(prefs());
    });
    document.getElementById("vpBackToTop")?.addEventListener("click", () => {
      const target = document.getElementById("top") || document.body;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
`;

const doc = `# ${releaseName}

${releaseName} gives VedaPath a command-center shell inspired by the Hyrvia HRMS workspace.

What changed:

- Adds a persistent side navigation rail with grouped Start, Source, and Practice sections.
- Adds a top command bar with path, view, and left/right side controls.
- Saves command-shell preferences in browser-local storage only.
- Keeps the Bhagwa visual identity and source-first VedaPath tone.

Boundary:

This is a UI shell release only. It does not grant permission, approve authorization, execute, store durable records, publish public release, or launch production.
`;

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function update(file, fn) {
  const next = fn(read(file));
  fs.writeFileSync(file, next);
}

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

function relFrom(file, target) {
  const from = path.dirname(file);
  return path.relative(from, target).replace(/\\/g, "/") || path.basename(target);
}

function injectHtmlShell(file) {
  let text = read(file);
  const cssHref = relFrom(file, cssFile);
  const jsSrc = relFrom(file, jsFile);
  if (!text.includes(cssHref)) {
    text = text.replace("</head>", `    <link rel="stylesheet" href="${cssHref}">\n  </head>`);
  }
  if (!text.includes(jsSrc)) {
    text = text.replace("</body>", `    <script src="${jsSrc}" defer></script>\n  </body>`);
  }
  text = text.replace(/<span class="version">v3\.2\.9 draft review<\/span>/g, `<span class="version">${releaseBadge}</span>`);
  fs.writeFileSync(file, text);
}

function insertBefore(text, marker, block) {
  if (text.includes(block.trim().split("\n")[0])) return text;
  return text.replace(marker, `${block}\n\n${marker}`);
}

function applyUpdates() {
  for (const file of walk(".")) {
    if (file.endsWith(".html")) injectHtmlShell(file);
  }

  update("build-status.html", (text) => {
    let next = text;
    next = next.replace(
      '<strong>v3.2.9</strong>\n          <p>Controlled Permission Execution Authorization Draft Review Gate: draft packet language is reviewed for founder decision readiness while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>',
      `<strong>${release}</strong>\n          <p>${releaseName}: VedaPath now has a persistent side rail, top command controls, and a saved left/right navigation preference inspired by Hyrvia, while the source-first flow stays calm.</p>`
    );
    next = next.replace(
      '<p>The trust loop now reviews draft packet language before founder decision readiness while every real authority path remains closed.</p>',
      '<p>The product shell now feels like one command center: navigation lives in a side rail, context controls sit on top, and reading surfaces get more breathing room.</p>'
    );
    next = next.replace(
      '<strong>Founder permission execution authorization review decision gate</strong>\n          <p>Let the founder make a review decision while approval, permission, and execution remain closed.</p>',
      `<strong>${nextRelease}</strong>\n          <p>Return to the authorization chain after the UI shell has become easier to navigate.</p>`
    );
    next = next.replace(
      `<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 294: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`,
      `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 294: ${releaseName}</strong>\n                <p>Adds side navigation, top command controls, wide content flow, and browser-local left/right rail preference across VedaPath.</p>\n              </div>\n              <span class="percent">100%</span>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 295: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`
    );
    next = next.replace(
      '<div class="version-row"><span>Release</span><strong>v3.2.9 Controlled Permission Execution Authorization Draft Review Gate</strong></div>\n            <div class="version-row"><span>Previous</span><strong>v3.2.8 Controlled Permission Execution Authorization Draft Gate</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Review controlled draft language without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for founder permission execution authorization review decision gate</strong></div>',
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>\n            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Make the product feel organized, calm, and command-center clear.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready to return to founder review decision gate</strong></div>`
    );
    next = next.replace(
      '<li><span class="dot"></span><span>Build the founder permission execution authorization review decision gate.</span></li>\n              <li><span class="dot"></span><span>Let founder review posture be recorded without approval or execution.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder review decision from any runnable operation.</span></li>',
      '<li><span class="dot"></span><span>Build the founder permission execution authorization review decision gate.</span></li>\n              <li><span class="dot"></span><span>Keep the new side rail shell while adding the next trust gate.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Preserve the simple command-center flow on every page.</span></li>'
    );
    return next;
  });

  const readmeBlock = `## ${release} ${releaseName}

${releaseName} gives VedaPath a Hyrvia-inspired command-center shell with persistent side navigation, top path/view/side controls, and browser-local left/right rail preference while preserving the Bhagwa source-first identity.

- [${releaseName} Notes](${docFile})
- [${releaseName} Config](${dataFile})`;

  update("README.md", (text) => insertBefore(text, "## v3.2.9 Controlled Permission Execution Authorization Draft Review Gate", readmeBlock));

  const notesBlock = `## ${release} ${releaseName}

- Adds a global command-shell CSS and JS layer across VedaPath pages.
- Moves primary navigation into a grouped side rail inspired by the Hyrvia HRMS workspace.
- Adds top command controls for Path, View, and left/right Side with browser-local preference memory.
- Keeps VedaPath's Bhagwa identity, source-first tone, and simple reading surfaces.`;

  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.2.9 Controlled Permission Execution Authorization Draft Review Gate", notesBlock));

  const blueprintBlock = `### 313. ${releaseName}

${releaseName} makes VedaPath feel like a calmer command center.

It borrows the useful structure from Hyrvia: side navigation, top context controls, and a user-selectable left or right navigation rail. It does not copy Hyrvia's corporate tone; VedaPath keeps Bhagwa warmth, source-first reading, and quiet spiritual restraint.

The command shell should reduce scattered navigation, keep rooms easy to reach, and preserve the first job of the product: ask clearly, read the source, carry one step.`;

  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 312. Controlled Permission Execution Authorization Draft Review Gate", blueprintBlock));
}

write(cssFile, css);
write(jsFile, js);
write(dataFile, `${JSON.stringify(shellConfig, null, 2)}\n`);
write(docFile, doc);
applyUpdates();

console.log(`${release} ${releaseName.toLowerCase()} applied.`);
