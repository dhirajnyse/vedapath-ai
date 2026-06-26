import fs from "node:fs";
import path from "node:path";

const release = "v2.8.7";
const badge = `${release} visual polish`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, block, before) {
  const wrapped = `${start}\n${block.trimEnd()}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), wrapped);
  }
  const index = content.indexOf(before);
  if (index === -1) return `${content.trimEnd()}\n\n${wrapped}\n`;
  return `${content.slice(0, index)}${wrapped}\n\n${content.slice(index)}`;
}

function ensurePolishLink(content, href) {
  if (content.includes(href)) return content;
  const link = `      <link rel="stylesheet" href="${href}">`;
  const cohesiveHref = href.startsWith("../")
    ? "../assets/vedapath-cohesive.css"
    : "assets/vedapath-cohesive.css";
  const cohesiveLine = `<link rel="stylesheet" href="${cohesiveHref}">`;

  if (content.includes(cohesiveLine)) {
    return content.replace(cohesiveLine, `${cohesiveLine}\n${link.trimStart()}`);
  }
  return content.replace(/<\/head>/, `${link}\n  </head>`);
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function updateHtmlFile(file, prefix = "") {
  let content = read(file);
  content = ensurePolishLink(content, `${prefix}assets/vedapath-polish.css`);
  content = updateVersionBadge(content);
  write(file, content);
}

function updateAllHtml() {
  for (const file of fs.readdirSync(".")) {
    if (file.endsWith(".html")) updateHtmlFile(file);
  }
  updateHtmlFile(path.join("brand", "brand-board.html"), "../");
}

function updateHome() {
  let content = read("index.html");
  content = content
    .replace("Start here", "Begin simply")
    .replace("One question. One source. One next step.", "One calm question. One trusted source. One small step.")
    .replace(
      "Begin with one honest question, see where the answer stands, then choose a grounded path forward.",
      "Ask without noise, read the source clearly, then carry one grounded action into the day."
    )
    .replace("Start with Ask", "Ask with Source")
    .replace("Open Pattern Companion", "See What Helped")
    .replace("Simple Learning Flow", "The path stays small")
    .replace("Begin with a real question or claim.", "Ask one honest question.")
    .replace("Show citation, category, and caution.", "See citation, category, and caution.")
    .replace("Turn insight into one calm action.", "Carry one grounded action.")
    .replace("Keep helpful patterns local and visible.", "Keep helpful patterns local.")
    .replace(
      "Choose the path that matches the moment. Each lane keeps source, boundary, and practice connected.",
      "Choose one next lane only. Source, boundary, and practice stay connected."
    )
    .replace(
      "The prototype now has answer, practice, calm, conversation, and pattern layers. The next work is polish, data quality, and real retrieval.",
      "The product surface now feels calm enough for the next functional build: real retrieval, reviewed sources, and production memory."
    )
    .replace("Move by intention instead of release history: study, calm, practice, or build.", "Move by purpose: study, calm, practice, or build. The user should never feel the release history first.");
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");

  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Visual Rhythm Polish: softer first screen, quieter room rails, sticky navigation, and clearer hierarchy before the next functional build.</p>`)
    .replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>The clickable product surface is ready for deeper function: Ask, Source, Practice, Pattern, and Build now read as one route.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>64%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:64%"></div></div>
          <p>The interface foundation is calmer. Real retrieval, reviewed data, accounts, and launch operations remain ahead.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Functional build</strong>
          <p>Move into real retrieval or source data only after this visual rhythm is founder-approved.</p>`)
    .replace(/<strong>Phase 251: Production Implementation and Licensed Audio<\/strong>/, "<strong>Phase 252: Production Implementation and Licensed Audio</strong>")
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Visual Rhythm Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.8.6 Cohesive UI System</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make the product feel calm, guided, and ready for real function.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for functional build planning</strong></div>`);

  const phase251 = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 251: Visual Rhythm Polish</strong>
                <p>Softens the first screen, stabilizes sticky navigation, reduces room-page competition, and clarifies the next-step flow.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;

  if (!content.includes("Phase 251: Visual Rhythm Polish")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 252: Production Implementation and Licensed Audio<\/strong>/,
      `${phase251}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 252: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>Founder reviews the visual rhythm across Home, Build, Brand, Answers, Mantra, Life, Talk, Pattern, and Daily.</span></li>
              <li><span class="dot"></span><span>Keep the first screen centered on one question, one source, and one next step.</span></li>
              <li><span class="dot"></span><span>Move to real retrieval only when the calm UI system feels stable.</span></li>
              <li><span class="dot"></span><span>Do not add new rooms to the top navigation unless they become primary user paths.</span></li>
            </ul>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH VISUAL RHYTHM START -->", "<!-- VEDAPATH VISUAL RHYTHM END -->", `## ${release} Visual Rhythm Polish

This design-only release gives the product one more UI/UX pass before the next functional build.

- first screen now feels more guided and less like a release-room index
- top navigation stays visible during scroll
- room pages use quieter rails, calmer title scale, and softer panel weight
- build status now reflects design readiness separately from full product completion
- no source logic, safety boundary, or local-memory behavior changed`, "<!-- VEDAPATH COHESIVE UI START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH VISUAL RHYTHM NOTES START -->", "<!-- VEDAPATH VISUAL RHYTHM NOTES END -->", `## ${release} Visual Rhythm Polish

Founder feedback: the interface improved, but more polish was needed before the next functional build.

Action taken:

- Added \`assets/vedapath-polish.css\` as a focused rhythm layer over the cohesive UI system.
- Kept navigation visible while scrolling.
- Reduced first-screen visual competition.
- Softened room sidebars and right rails.
- Updated Build Status so prototype completion and full product progress are not confused.`, "<!-- VEDAPATH COHESIVE UI NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH VISUAL RHYTHM BLUEPRINT START -->", "<!-- VEDAPATH VISUAL RHYTHM BLUEPRINT END -->", `### 270. Visual Rhythm Polish

Before the next functional build, the product should feel calmer than the complexity behind it.

Design rules:

- The first screen explains one path, not every room.
- Top navigation remains stable and visible while scrolling.
- Room sidebars are secondary controls, not competing hero areas.
- Hero titles stay powerful but do not crowd the working surface.
- Build status separates clickable prototype completion from full product readiness.`, "<!-- VEDAPATH COHESIVE UI BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/VISUAL_RHYTHM_POLISH.md", `# VedaPath AI Visual Rhythm Polish

This is the ${release} design-only polish release.

## Intent

The previous release made the product consistent. This pass makes it feel more guided, less scattered, and more ready for the next functional build.

## Changes

- Added \`assets/vedapath-polish.css\` as a shared visual rhythm layer.
- Made the top navigation sticky so users do not lose the main routes on long pages.
- Softened the home entry and made the first path read as one calm journey.
- Reduced room-page visual competition by quieting sidebars and tightening hero scale.
- Updated Build Status to show honest full-product progress while keeping the clickable MVP complete.

## Boundary

This release does not add retrieval, change source claims, alter Sanskrit handling, or change local storage behavior. It is a UX polish step before the next functional build.
`);
}

function writePolishCss() {
  write("assets/vedapath-polish.css", `:root {
  --vp-shadow-soft: 0 18px 50px rgba(87, 53, 25, 0.055);
  --vp-shadow-line: 0 1px 0 rgba(91, 70, 56, 0.08);
  --vp-focus: rgba(214, 90, 31, 0.16);
}

body {
  text-rendering: optimizeLegibility;
}

body .topbar,
body header.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 247, 234, 0.94);
  backdrop-filter: blur(16px);
  box-shadow: var(--vp-shadow-line);
}

body .nav {
  gap: 6px;
}

body .nav a,
body .nav .version,
body .button,
body .chip,
body .tab,
body .room-card,
body .path-step,
body .map-list a {
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}

body .nav a:hover,
body .button:hover,
body .chip:hover,
body .tab:hover,
body .room-card:hover,
body .path-step:hover,
body .map-list a:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(87, 53, 25, 0.06);
}

body .nav a:focus-visible,
body .button:focus-visible,
body .chip:focus-visible,
body .tab:focus-visible,
body textarea:focus-visible,
body select:focus-visible {
  outline: 3px solid var(--vp-focus);
  outline-offset: 2px;
}

body h1,
body main.workspace h1 {
  font-weight: 860;
  text-wrap: balance;
}

body h2,
body h3,
body p,
body .lead,
body .muted {
  text-wrap: pretty;
}

body .panel,
body .tile,
body .phase,
body .intent-copy,
body .flow-card,
body .map-card,
body .rail-panel,
body .answer-shell,
body .ask-panel,
body .metric,
body .source-block {
  box-shadow: var(--vp-shadow-soft);
}

body .home-intent {
  gap: 22px;
  padding: 34px 0 26px;
  align-items: start;
}

body .home-intent .intent-copy {
  border-color: rgba(214, 90, 31, 0.14);
  background: linear-gradient(135deg, rgba(255, 253, 248, 0.96) 0%, rgba(255, 245, 234, 0.72) 100%);
  padding: clamp(20px, 3vw, 30px);
}

body .home-intent .flow-card {
  border-color: rgba(91, 70, 56, 0.12);
  background: rgba(255, 253, 248, 0.72);
  padding: clamp(18px, 2.5vw, 24px);
}

body .home-intent h1 {
  max-width: 720px;
  font-size: clamp(38px, 4.7vw, 58px);
  margin-bottom: 14px;
}

body .intent-actions {
  margin-top: 12px;
}

body .flow-steps {
  gap: 10px;
}

body .flow-step {
  position: relative;
  min-height: 124px;
  overflow: hidden;
  background: rgba(255, 253, 248, 0.9);
}

body .flow-step::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, var(--vp-bhagwa), var(--vp-gold));
  opacity: 0.62;
}

body .workspace {
  gap: 16px;
}

body .ask-panel {
  border-color: rgba(214, 90, 31, 0.2);
  background: rgba(255, 253, 248, 0.94);
}

body .answer-shell {
  border-color: rgba(20, 92, 74, 0.14);
}

body .rail-panel {
  background: rgba(255, 253, 248, 0.8);
}

body .experience-map {
  margin-top: 28px;
}

body main.workspace {
  grid-template-columns: 220px minmax(0, 1fr) 260px;
  gap: 18px;
}

body main.workspace > section.panel {
  padding: clamp(18px, 2.4vw, 26px);
}

body main.workspace > aside.panel:first-child,
body main.workspace > aside.panel.tight {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow: auto;
}

body main.workspace > aside.panel:first-child {
  border-color: rgba(91, 70, 56, 0.11);
  background: rgba(255, 248, 239, 0.7);
}

body main.workspace > aside.panel:first-child h2,
body main.workspace > aside.panel.tight h2 {
  font-size: 22px;
}

body main.workspace > aside.panel:first-child p,
body main.workspace > aside.panel.tight p {
  font-size: 14px;
}

body main.workspace h1 {
  max-width: 620px;
  font-size: clamp(34px, 3.6vw, 52px);
  line-height: 1.02;
}

body main.workspace .hero-grid {
  grid-template-columns: minmax(0, 1fr) 104px;
  gap: 18px;
}

body main.workspace .mark-stage {
  width: 104px;
  border-color: rgba(214, 90, 31, 0.16);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.54);
}

body .room-list {
  max-height: 315px;
  scrollbar-width: thin;
}

body .room-card,
body .sprint-step,
body .path-step {
  background: rgba(255, 253, 248, 0.82);
}

body .source-block {
  border-left-width: 5px;
}

body .summary {
  gap: 16px;
}

body .layout {
  gap: 18px;
}

body .phase {
  background: rgba(255, 253, 248, 0.78);
}

body .version-row {
  align-items: baseline;
}

@media (max-width: 1120px) {
  body .topbar,
  body header.topbar {
    position: static;
  }

  body main.workspace > aside.panel:first-child,
  body main.workspace > aside.panel.tight {
    position: static;
    max-height: none;
  }

  body main.workspace {
    grid-template-columns: 1fr;
  }

  body main.workspace .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  body .home-intent {
    padding-top: 22px;
  }

  body .home-intent .intent-copy,
  body .home-intent .flow-card,
  body main.workspace > section.panel {
    padding: 16px;
  }

  body .nav a,
  body .nav .version {
    min-height: 34px;
    padding: 6px 10px;
  }

  body .flow-step {
    min-height: 96px;
  }
}
`);
}

writePolishCss();
updateAllHtml();
updateHome();
updateBuildStatus();
updateDocs();

console.log(`Applied ${release} Visual Rhythm Polish.`);
