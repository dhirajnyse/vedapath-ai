import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const release = "v2.8.6";
const badge = `${release} UI system`;
const today = "June 26, 2026";

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function write(rel, value) {
  writeFileSync(join(root, rel), value);
}

function upsertBlock(content, start, end, block, beforeText = null) {
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  const wrapped = `${start}\n${block}\n${end}`;
  if (pattern.test(content)) return content.replace(pattern, wrapped);
  if (beforeText && content.includes(beforeText)) return content.replace(beforeText, `${wrapped}\n\n${beforeText}`);
  return `${content.trimEnd()}\n\n${wrapped}\n`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const cohesiveCss = `:root {
  --vp-bg: #fff7ea;
  --vp-surface: rgba(255, 253, 248, 0.92);
  --vp-surface-solid: #fffdf8;
  --vp-ink: #1f1a17;
  --vp-muted: #604638;
  --vp-line: rgba(91, 70, 56, 0.16);
  --vp-bhagwa: #d65a1f;
  --vp-ochre: #a83e12;
  --vp-gold: #e0a83b;
  --vp-green: #145c4a;
  --vp-soft-red: #fde8dd;
  --vp-soft-green: #e8f0ea;
}

html { scroll-behavior: smooth; }

body {
  background: var(--vp-bg);
  color: var(--vp-ink);
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
  line-height: 1.52;
}

body .page,
body .shell,
body > main {
  width: min(1180px, calc(100% - 40px));
  margin-left: auto;
  margin-right: auto;
}

body .topbar,
body header.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 82px;
  padding: 18px 0 16px;
  border-bottom: 1px solid var(--vp-line);
}

body .brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 230px;
  color: inherit;
  text-decoration: none;
}

body .brand img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(168, 62, 18, 0.08);
}

body .brand strong {
  display: block;
  font-size: 20px;
  line-height: 1.1;
  white-space: nowrap;
}

body .brand span {
  display: block;
  margin-top: 3px;
  color: var(--vp-muted);
  font-size: 13px;
}

body .nav {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: nowrap;
  max-width: none;
  min-width: 0;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

body .nav::-webkit-scrollbar { display: none; }

body .link,
body .nav a,
body .nav .version,
body .pill,
body .button,
body .tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 850;
  text-decoration: none;
  white-space: nowrap;
}

body .link,
body .nav a {
  flex: 0 0 auto;
  border: 1px solid transparent;
  color: #432414;
  padding: 7px 10px;
}

body .link:hover,
body .link:focus-visible,
body .nav a:hover,
body .nav a:focus-visible {
  border-color: #efb899;
  color: var(--vp-ochre);
  outline: none;
}

body .link.active,
body .nav a.active,
body .nav .version,
body .pill {
  flex: 0 0 auto;
  border: 1px solid #efb899;
  color: var(--vp-ochre);
  background: rgba(255, 253, 248, 0.88);
  padding: 7px 13px;
}

body h1 {
  margin-top: 0;
  font-size: clamp(40px, 5.2vw, 64px);
  line-height: 0.98;
  letter-spacing: 0;
}

body h2 { line-height: 1.15; }

body .lead,
body .muted {
  color: var(--vp-muted);
}

body .panel,
body .tile,
body .phase,
body .principle,
body .answer,
body .source,
body .swatch,
body .flow-card,
body .intent-copy,
body .map-card,
body .rail-panel,
body .metric,
body .mini-card,
body .room-card,
body .item-card,
body .sprint-step {
  border-color: var(--vp-line);
  border-radius: 10px;
  background: var(--vp-surface);
}

body .eyebrow,
body .badge,
body .label {
  border-radius: 999px;
  background: var(--vp-soft-red);
  color: var(--vp-ochre);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
}

body .badge.green,
body .source-pill,
body .flow-index,
body .index-pill,
body .step-index {
  background: var(--vp-soft-green);
  color: var(--vp-green);
}

body .home-intent {
  grid-template-columns: minmax(0, 0.95fr) minmax(420px, 1.05fr);
  gap: 18px;
}

body .home-intent .intent-copy,
body .home-intent .flow-card {
  min-height: 0;
}

body .flow-steps {
  align-items: stretch;
}

body .flow-step {
  border-radius: 10px;
}

body .workspace:not(main.workspace) {
  gap: 14px;
}

body .workspace:not(main.workspace) > .panel h1 {
  font-size: clamp(36px, 4.2vw, 54px);
  overflow-wrap: break-word;
}

body main.workspace {
  width: 100%;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 280px;
  gap: 16px;
  align-items: start;
  padding: 18px 0 42px;
}

body main.workspace > .panel {
  padding: 18px;
}

body main.workspace > aside.panel:first-child {
  padding: 14px;
}

body main.workspace > aside.panel:first-child h2 {
  margin-bottom: 8px;
  font-size: 21px;
}

body .room-list {
  max-height: 350px;
  overflow: auto;
  padding-right: 3px;
}

body .room-card {
  min-height: 58px;
  padding: 10px;
}

body main.workspace h1 {
  max-width: 650px;
  font-size: clamp(38px, 4.2vw, 56px);
}

body .hero,
body .hero-grid {
  align-items: center;
}

body .hero {
  gap: clamp(22px, 4vw, 44px);
}

body .hero-grid {
  grid-template-columns: minmax(0, 1fr) 116px;
  gap: 18px;
}

body .mark-stage {
  display: grid;
  place-items: center;
  width: min(100%, 420px);
  min-height: 0;
  aspect-ratio: 1 / 0.9;
  margin-left: auto;
  border: 1px solid #f1d0bd;
  border-radius: 10px;
  background: linear-gradient(180deg, #fff9ef 0%, #f7e7cf 100%);
  overflow: hidden;
  padding: 14px;
}

body .mark-stage img {
  display: block;
  width: min(88%, 340px);
  height: auto;
  object-fit: contain;
  border-radius: 6px;
}

body main.workspace .mark-stage {
  width: 116px;
  aspect-ratio: 1;
  padding: 8px;
}

body main.workspace .mark-stage img {
  width: 100%;
}

body .source-block {
  border-left-color: var(--vp-bhagwa);
  border-radius: 10px;
}

body .summary,
body .layout,
body .grid,
body .palette,
body .preview,
body .metric-grid {
  gap: 16px;
}

body .summary {
  margin-top: 26px;
}

body .version-row strong {
  text-align: right;
}

@media (max-width: 1120px) {
  body .topbar,
  body header.topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  body .brand {
    min-width: 0;
  }

  body .nav {
    justify-content: flex-start;
    width: 100%;
  }

  body main.workspace,
  body .home-intent,
  body .workspace:not(main.workspace),
  body .hero,
  body .hero-grid,
  body .layout {
    grid-template-columns: 1fr;
  }

  body .mark-stage,
  body main.workspace .mark-stage {
    width: min(100%, 280px);
    margin-left: 0;
  }
}

@media (max-width: 760px) {
  body .page,
  body .shell,
  body > main {
    width: min(100% - 24px, 1180px);
  }

  body h1,
  body main.workspace h1 {
    font-size: clamp(34px, 10vw, 44px);
  }

  body .summary,
  body .grid,
  body .palette,
  body .preview,
  body .metric-grid,
  body .flow-steps,
  body .source-block {
    grid-template-columns: 1fr;
  }

  body .mark-stage,
  body main.workspace .mark-stage {
    width: min(100%, 220px);
  }
}
`;

function navHtml(active, prefix = "") {
  const links = [
    ["Home", "index.html"],
    ["Build", "build-status.html"],
    ["Brand", "brand/brand-board.html"],
    ["Blueprint", "blueprint.html"],
    ["Answers", "citedanswerlab.html"],
    ["Mantra", "mantralenslab.html"],
    ["Life", "lifecompanionlab.html"],
    ["Talk", "conversationcompanionlab.html"],
    ["Pattern", "patterncompanionlab.html"],
    ["Daily", "daily.html"],
  ];

  return `        <nav class="nav" aria-label="Project links">
${links.map(([label, href]) => `          <a class="link${label === active ? " active" : ""}" href="${prefix}${href}">${label}</a>`).join("\n")}
          <span class="version">${badge}</span>
        </nav>`;
}

function ensureCohesiveLink(content, href) {
  if (content.includes("vedapath-cohesive.css")) return content;
  return content.replace("</head>", `    <link rel="stylesheet" href="${href}">\n  </head>`);
}

function updateAllHtml() {
  for (const rel of readdirSync(root).filter((name) => name.endsWith(".html"))) {
    let content = read(rel);
    content = ensureCohesiveLink(content, "assets/vedapath-cohesive.css");
    content = content
      .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${badge}</span>`)
      .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${badge}</span>`);
    write(rel, content);
  }

  const brandRel = "brand/brand-board.html";
  if (existsSync(join(root, brandRel))) {
    let content = read(brandRel);
    content = ensureCohesiveLink(content, "../assets/vedapath-cohesive.css");
    content = content
      .replace(/<span class="version">v[^<]+<\/span>/g, `<span class="version">${badge}</span>`)
      .replace(/<span class="pill">v[^<]+<\/span>/g, `<span class="pill">${badge}</span>`);
    write(brandRel, content);
  }
}

function updateBuildStatus() {
  let content = read("build-status.html");
  const header = `      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Build tracker</span>
          </div>
        </a>
${navHtml("Build")}
      </header>`;

  content = content.replace(/      <header(?: class="topbar")?>[\s\S]*?      <\/header>/, header);
  content = content
    .replace(/Updated June 26, 2026 \| Branch main \| <strong>v[^<]+<\/strong>[\s\S]*?<\/div>/, `${today} | Branch main | <strong>${badge}</strong></div>`)
    .replace(/<strong>v2\.8\.5<\/strong>\s*<p>UX Flow Reset: the home page now has one guided path, a calmer Ask surface, grouped room lanes, and less scattered navigation\.<\/p>/, `<strong>${release}</strong>\n          <p>UI Cohesion System: one shared header, calmer typography, consistent logo treatment, and unified room-page rhythm.</p>`)
    .replace(/Product surface is now organized around Ask, Source, Practice, and Pattern instead of a long room list\./, "Product surface now uses one visual system across Home, Build, Brand, Blueprint, and the main rooms.")
    .replace(/Flow path: primary ask surface, source card, next-lane rail, grouped room map, and calmer shared release-room layout\./, "Flow path: same navigation, title scale, panel rhythm, logo stage, and mobile behavior across the product.")
    .replace(/Review the new flow, then choose whether to polish mobile, simplify room pages further, or build real retrieval\./, "Review the unified interface, then choose whether to build real retrieval, source data, or account-backed memory.")
    .replace(/<div class="version-row"><span>Release<\/span><strong>v2\.8\.5 UX Flow Reset<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Cohesive UI System</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>v2\.8\.4 Pattern Companion Control Room<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.8.5 UX Flow Reset</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>Make the product feel organized, calm, and easy to enter\.<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make every page feel like the same calm product.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>Ready for founder UX review<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for cohesive UI review</strong></div>`);

  const phaseBlock = `              <article class="phase">
                <span class="badge done">Done</span>
                <div>
                  <strong>Phase 250: Cohesive UI System</strong>
                  <p>Unifies top navigation, typography, logo sizing, panel rhythm, and room-page layout across the product.</p>
                </div>
                <span class="percent">100%</span>
              </article>`;
  if (!content.includes("Phase 250: Cohesive UI System")) {
    content = content.replace(/(\s+<article class="phase">\s+<span class="badge done">Done<\/span>\s+<div>\s+<strong>Phase 249: UX Flow Reset<\/strong>[\s\S]*?\s+<\/article>)/, `$1\n${phaseBlock}`);
  }
  content = content.replace(/Phase 250: Production Implementation and Licensed Audio/g, "Phase 251: Production Implementation and Licensed Audio");
  write("build-status.html", content);
}

function updateHomeCopy() {
  let content = read("index.html");
  content = content
    .replace(/<span class="eyebrow">UX flow reset<\/span>\s*<h1>One question\. One source\. One next step\.<\/h1>\s*<p class="muted">VedaPath now opens with a simple route: ask clearly, see the source, choose a practice path, and let local patterns remember what helped\.<\/p>/, `<span class="eyebrow">Start here</span>\n          <h1>One question. One source. One next step.</h1>\n          <p class="muted">Begin with one honest question, see where the answer stands, then choose a grounded path forward.</p>`)
    .replace(/<h2>Guided Product Flow<\/h2>/, `<h2>Simple Learning Flow</h2>`)
    .replace(/<p class="muted">The old home showed every room at once\. This version keeps the next decision small\.<\/p>/, `<p class="muted">Choose the path that matches the moment. Each lane keeps source, boundary, and practice connected.</p>`)
    .replace(/<span class="eyebrow">Organized rooms<\/span>\s*<h2>Explore by purpose<\/h2>\s*<p class="muted">The deep rooms are still here, but now they are grouped by what the user is trying to do\.<\/p>/, `<span class="eyebrow">Product map</span>\n            <h2>Explore by purpose</h2>\n            <p class="muted">Move by intention instead of release history: study, calm, practice, or build.</p>`);
  write("index.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = readme.replace(/v2\.8\.5 UX Flow Reset/g, `${release} Cohesive UI System`);
  readme = upsertBlock(readme, "<!-- VEDAPATH COHESIVE UI START -->", "<!-- VEDAPATH COHESIVE UI END -->", `## ${release} Cohesive UI System\n\nThis release responds to founder UX feedback that the product still felt visually scattered. It adds a shared cohesion layer across Home, Build, Brand, Blueprint, Daily, and the main control rooms.\n\n- one full top navigation pattern on every core page\n- one calmer title scale and font rhythm\n- one logo/image treatment for hero and room pages\n- clearer home language without internal build labels\n- build-status restored to the same menu system as the rest of the product`, "## Current Build");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH COHESIVE UI NOTES START -->", "<!-- VEDAPATH COHESIVE UI NOTES END -->", `## ${release} Cohesive UI System\n\nFounder feedback: the interface still looked scattered, with page-specific fonts, image sizes, and a build page header that did not match the rest of the app.\n\nAction taken:\n\n- Added \`assets/vedapath-cohesive.css\` as the shared visual cohesion layer.\n- Restored full top navigation on \`build-status.html\`.\n- Normalized header, title scale, panel radius, logo treatment, room sidebars, and mobile navigation.\n- Reworded home page labels so the product does not expose internal release language.`, "<!-- VEDAPATH UX FLOW RESET NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH COHESIVE UI BLUEPRINT START -->", "<!-- VEDAPATH COHESIVE UI BLUEPRINT END -->", `### 269. Cohesive UI System\n\nThe product should feel like one calm companion across every route.\n\nDesign rules:\n\n- Every core page uses the same header, brand mark, navigation, and version badge.\n- Page titles use one restrained scale instead of release-by-release typography.\n- Logo imagery keeps a consistent stage and crop treatment.\n- Build and roadmap pages are product pages, not separate admin documents.\n- Room pages keep power features but reduce sidebar dominance and visual noise.`, "<!-- VEDAPATH UX FLOW RESET BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/UI_COHESION_SYSTEM.md", `# VedaPath AI Cohesive UI System\n\nThis is the ${release} UI cohesion pass.\n\n## Problem\n\nThe product had strong individual rooms, but the experience still felt scattered because different page families used different header structures, title scales, logo sizes, and navigation treatments.\n\n## Changes\n\n- Added a shared visual cohesion layer at \`assets/vedapath-cohesive.css\`.\n- Restored the full top navigation on the Build Status page.\n- Normalized page width, header spacing, nav behavior, active states, version badge, title scale, panel radius, and logo/image treatment.\n- Tightened sprint-room sidebars and hero areas so the rooms feel like siblings.\n- Replaced internal home-page release language with product-facing copy.\n\n## Boundary\n\nThis is a UI/UX cohesion release. It does not change source claims, retrieval data, Sanskrit handling, or safety boundaries.\n`);
}

write("assets/vedapath-cohesive.css", cohesiveCss);
updateAllHtml();
updateBuildStatus();
updateHomeCopy();
updateDocs();

console.log(`Applied ${release} Cohesive UI System.`);
