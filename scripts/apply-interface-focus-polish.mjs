import fs from "node:fs";
import path from "node:path";

const release = "v2.8.8";
const badge = `${release} focus polish`;

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

function ensureFocusLink(content, href) {
  if (content.includes(href)) return content;
  const link = `      <link rel="stylesheet" href="${href}">`;
  const polishHref = href.startsWith("../")
    ? "../assets/vedapath-polish.css"
    : "assets/vedapath-polish.css";
  const polishLine = `<link rel="stylesheet" href="${polishHref}">`;

  if (content.includes(polishLine)) {
    return content.replace(polishLine, `${polishLine}\n${link.trimStart()}`);
  }
  return content.replace(/<\/head>/, `${link}\n  </head>`);
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function updateHtmlFile(file, prefix = "") {
  let content = read(file);
  content = ensureFocusLink(content, `${prefix}assets/vedapath-focus.css`);
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
    .replace("One calm question. One trusted source. One small step.", "Ask clearly. Read the source. Carry one step.")
    .replace(
      "Ask without noise, read the source clearly, then carry one grounded action into the day.",
      "VedaPath keeps the first moment small: a question, a source, a boundary, and one steady action."
    )
    .replace("Ask with Source", "Begin with Ask")
    .replace("See What Helped", "Open Daily Loop")
    .replace("patterncompanionlab.html\">Open Daily Loop", "daily.html\">Open Daily Loop")
    .replace("The path stays small", "One guided path")
    .replace("Ask one honest question.", "Name the question.")
    .replace("See citation, category, and caution.", "Read the source.")
    .replace("Carry one grounded action.", "Choose one action.")
    .replace("Keep helpful patterns local.", "Remember gently.")
    .replace("Choose one lane", "Continue with one path")
    .replace("Choose one next lane only. Source, boundary, and practice stay connected.", "Pick the next useful surface. The product should never ask the user to navigate the whole system at once.")
    .replace("Explore by purpose", "Choose by need")
    .replace("Move by purpose: study, calm, practice, or build. The user should never feel the release history first.", "The product map stays below the main answer. It is a quiet directory, not the first job.");
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");

  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Focus Polish: removes extra visual weight, sharpens the first screen, and makes long build and room pages easier to scan.</p>`)
    .replace(/<span>MVP progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>MVP progress</span>
          <strong>100%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:100%"></div></div>
          <p>The clickable MVP now has a cleaner product shell for Ask, Source, Practice, Pattern, and Build.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>66%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:66%"></div></div>
          <p>The interface is now calmer and more founder-ready. Real retrieval, reviewed data, accounts, and launch operations remain ahead.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Functional build</strong>
          <p>After this focus pass, the next build can safely move into real source data or retrieval.</p>`)
    .replace(/<strong>Phase 252: Production Implementation and Licensed Audio<\/strong>/, "<strong>Phase 253: Production Implementation and Licensed Audio</strong>")
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Focus Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.8.7 Visual Rhythm Polish</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Make the product feel focused enough for deeper function.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for next functional build</strong></div>`);

  const phase252 = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 252: Interface Focus Polish</strong>
                <p>Reduces card weight, tightens the app bar, improves home hierarchy, and makes long rooms easier to scan before functional work resumes.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;

  if (!content.includes("Phase 252: Interface Focus Polish")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 253: Production Implementation and Licensed Audio<\/strong>/,
      `${phase252}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 253: Production Implementation and Licensed Audio</strong>`
    );
  }

  content = content.replace(/<ul class="checklist">[\s\S]*?<\/ul>/, `<ul class="checklist">
              <li><span class="dot"></span><span>Review whether the first screen now feels like one calm doorway.</span></li>
              <li><span class="dot"></span><span>Keep future navigation limited to primary user paths.</span></li>
              <li><span class="dot"></span><span>Begin functional work with real source data or retrieval, not more rooms.</span></li>
              <li><span class="dot"></span><span>Preserve the quiet shell as new capabilities arrive.</span></li>
            </ul>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH FOCUS POLISH START -->", "<!-- VEDAPATH FOCUS POLISH END -->", `## ${release} Interface Focus Polish

This design-only release gives VedaPath one more calm UI pass before functional work resumes.

- removes extra card weight from the first screen
- makes the top app bar tighter and easier to scan
- keeps the central answer/work surface visually dominant
- softens room sidebars and build-roadmap density
- prepares the shell for the next real retrieval or source-data build`, "<!-- VEDAPATH VISUAL RHYTHM START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH FOCUS POLISH NOTES START -->", "<!-- VEDAPATH FOCUS POLISH NOTES END -->", `## ${release} Interface Focus Polish

Founder feedback: the UI improved, but one more effort was needed before adding the next functional build.

Action taken:

- Added \`assets/vedapath-focus.css\` as a focused app-shell layer.
- Reduced heavy card feeling on Home, Build, and room pages.
- Tightened the top app bar, version badge, and button rhythm.
- Made long build-roadmap content easier to scan.
- Kept behavior unchanged so future functional work starts from a stable shell.`, "<!-- VEDAPATH VISUAL RHYTHM NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH FOCUS POLISH BLUEPRINT START -->", "<!-- VEDAPATH FOCUS POLISH BLUEPRINT END -->", `### 271. Interface Focus Polish

The product should feel quieter than the amount of work behind it.

Design rules:

- The first viewport is a doorway, not a dashboard.
- The central answer/work surface is the primary object.
- Sidebars and rails support action but do not compete with it.
- Build status can contain history, but it must scan like a progress surface.
- New functional builds inherit the quiet shell instead of adding visual weight.`, "<!-- VEDAPATH VISUAL RHYTHM BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/INTERFACE_FOCUS_POLISH.md", `# VedaPath AI Interface Focus Polish

This is the ${release} design-only polish release.

## Intent

VedaPath should feel calm before it becomes more powerful. This release removes extra visual weight and makes the existing prototype easier to enter, scan, and trust.

## Changes

- Added \`assets/vedapath-focus.css\` as a focused UI layer.
- Made the app bar tighter and less visually loud.
- Turned the home hero into a lighter doorway.
- Made the answer/work surface more visually dominant than sidebars.
- Reduced room-page and build-page density without removing navigation or content.

## Boundary

This release does not change source claims, retrieval behavior, Sanskrit handling, local memory, or safety boundaries. It is a visual readiness pass before the next functional build.
`);
}

function writeFocusCss() {
  write("assets/vedapath-focus.css", `:root {
  --vp-focus-shadow: 0 12px 34px rgba(87, 53, 25, 0.035);
  --vp-focus-line: rgba(91, 70, 56, 0.12);
  --vp-focus-panel: rgba(255, 253, 248, 0.74);
  --vp-focus-panel-strong: rgba(255, 253, 248, 0.95);
}

body {
  background:
    linear-gradient(180deg, rgba(255, 247, 234, 0.98) 0%, rgba(255, 249, 239, 1) 42%, rgba(255, 247, 234, 1) 100%);
}

body .topbar,
body header.topbar {
  min-height: 70px;
  padding: 12px 0 11px;
  background: rgba(255, 248, 237, 0.96);
  border-bottom-color: var(--vp-focus-line);
}

body .brand {
  min-width: 214px;
  gap: 10px;
}

body .brand img {
  width: 44px;
  height: 44px;
  border-radius: 9px;
  box-shadow: 0 8px 18px rgba(168, 62, 18, 0.075);
}

body .brand strong {
  font-size: 18px;
}

body .brand span {
  margin-top: 1px;
  font-size: 12px;
}

body .nav {
  gap: 4px;
}

body .nav a,
body .nav .version {
  min-height: 34px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 13px;
}

body .nav .version {
  margin-left: 6px;
  background: rgba(255, 251, 244, 0.9);
}

body .home-intent {
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  gap: clamp(20px, 3vw, 32px);
  padding: clamp(26px, 5vw, 46px) 0 30px;
}

body .home-intent .intent-copy {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  padding: clamp(8px, 2vw, 18px) 0;
}

body .home-intent h1 {
  max-width: 650px;
  font-size: clamp(40px, 4.2vw, 54px);
  line-height: 1.02;
}

body .home-intent .intent-copy .muted {
  max-width: 610px;
  font-size: 18px;
}

body .home-intent .flow-card {
  align-self: center;
  min-height: 0;
  border-color: rgba(214, 90, 31, 0.13);
  background: rgba(255, 253, 248, 0.62);
  box-shadow: none;
}

body .flow-steps {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

body .flow-step {
  min-height: 92px;
  border-color: rgba(91, 70, 56, 0.11);
  background: rgba(255, 253, 248, 0.68);
}

body .workspace {
  grid-template-columns: minmax(248px, 0.72fr) minmax(0, 1.48fr) minmax(238px, 0.68fr);
  gap: 16px;
  padding-top: 22px;
  border-top: 1px solid var(--vp-focus-line);
}

body .ask-panel,
body .answer-shell,
body .rail-panel,
body .map-card,
body .tile,
body .phase,
body .panel {
  box-shadow: var(--vp-focus-shadow);
}

body .ask-panel,
body .rail-panel {
  background: var(--vp-focus-panel);
}

body .answer-shell {
  border-color: rgba(20, 92, 74, 0.18);
  background: var(--vp-focus-panel-strong);
}

body .ask-panel h2,
body .answer-title,
body .rail-panel h2 {
  letter-spacing: 0;
}

body .source-block {
  border-left-width: 4px;
  background: rgba(255, 253, 248, 0.86);
  box-shadow: none;
}

body .meter-step,
body .path-step,
body .footer-item,
body .claim,
body .map-list a,
body .room-card,
body .sprint-step,
body .metric {
  border-color: rgba(91, 70, 56, 0.12);
  box-shadow: none;
}

body .button,
body .chip,
body .tab {
  border-radius: 9px;
}

body .button.primary,
body .chip.active,
body .tab.active {
  box-shadow: 0 8px 22px rgba(214, 90, 31, 0.16);
}

body .experience-map {
  margin-top: 34px;
  padding-top: 26px;
}

body .map-card {
  background: rgba(255, 253, 248, 0.62);
}

body main.workspace {
  grid-template-columns: 204px minmax(0, 1fr) 238px;
  gap: 18px;
}

body main.workspace > section.panel {
  background: var(--vp-focus-panel-strong);
}

body main.workspace > aside.panel:first-child,
body main.workspace > aside.panel.tight {
  background: rgba(255, 250, 243, 0.66);
}

body main.workspace h1 {
  max-width: 590px;
  font-size: clamp(34px, 3.25vw, 48px);
}

body main.workspace .hero-grid {
  grid-template-columns: minmax(0, 1fr) 92px;
}

body main.workspace .mark-stage {
  width: 92px;
  padding: 7px;
}

body .room-list {
  max-height: 270px;
}

body .room-card {
  min-height: 52px;
}

body .summary {
  margin: 24px 0;
}

body .tile {
  min-height: 124px;
  background: rgba(255, 253, 248, 0.72);
}

body .roadmap {
  max-height: 680px;
  overflow: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

body .phase {
  grid-template-columns: 92px minmax(0, 1fr) 58px;
  gap: 12px;
  padding: 12px;
}

body .phase p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

body .version-row strong {
  max-width: 360px;
}

@media (max-width: 1120px) {
  body .home-intent,
  body .workspace,
  body main.workspace {
    grid-template-columns: 1fr;
  }

  body .home-intent .intent-copy {
    padding-bottom: 4px;
  }

  body main.workspace .hero-grid {
    grid-template-columns: 1fr;
  }

  body .roadmap {
    max-height: none;
  }
}

@media (max-width: 760px) {
  body .topbar,
  body header.topbar {
    padding-top: 14px;
  }

  body .brand {
    min-width: 0;
  }

  body .home-intent {
    padding-top: 22px;
    gap: 16px;
  }

  body .home-intent h1 {
    font-size: clamp(34px, 10vw, 42px);
  }

  body .home-intent .intent-copy .muted {
    font-size: 16px;
  }

  body .flow-steps {
    grid-template-columns: 1fr;
  }

  body .workspace {
    padding-top: 18px;
  }

  body .phase {
    grid-template-columns: 1fr;
  }

  body .phase p {
    -webkit-line-clamp: unset;
  }
}
`);
}

writeFocusCss();
updateAllHtml();
updateHome();
updateBuildStatus();
updateDocs();

console.log(`Applied ${release} Interface Focus Polish.`);
