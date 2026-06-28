import fs from "node:fs";
import path from "node:path";

const release = "v3.3.1";
const releaseName = "Command Shell Typography Coherence";
const releaseBadge = "v3.3.1 type polish";
const previousRelease = "v3.3.0 Command Center Side Rail UX";
const cssFile = "assets/vedapath-command-shell.css";
const jsFile = "assets/vedapath-command-shell.js";
const dataFile = "data/vedapath-command-shell-typography.json";
const docFile = "docs/COMMAND_SHELL_TYPOGRAPHY_COHERENCE.md";

const typeBlock = `/* VEDAPATH COMMAND SHELL TYPE COHERENCE START */
:root {
  --vp-type-page-title: 30px;
  --vp-type-hero-title: 48px;
  --vp-type-room-title: 42px;
  --vp-type-section-title: 24px;
  --vp-type-card-title: 20px;
  --vp-type-body: 16px;
  --vp-type-small: 12px;
  --vp-type-metric: 26px;
  --vp-type-tight: 1.05;
  --vp-type-normal: 1.42;
}

body.vp-command-shell-ready {
  font-size: var(--vp-type-body);
  line-height: var(--vp-type-normal);
}

body.vp-command-shell-ready .topbar,
body.vp-command-shell-ready header.topbar {
  min-height: 64px !important;
  margin-bottom: 16px !important;
  padding-top: 8px !important;
  padding-bottom: 11px !important;
}

body.vp-command-shell-ready .vp-command-top {
  gap: 16px;
}

body.vp-command-shell-ready .vp-command-title h1 {
  margin-top: 4px;
  font-size: var(--vp-type-page-title) !important;
  line-height: 1.08 !important;
}

body.vp-command-shell-ready .vp-command-meta {
  gap: 6px;
}

body.vp-command-shell-ready .vp-command-eyebrow,
body.vp-command-shell-ready .vp-command-badge,
body.vp-command-shell-ready .vp-command-memory,
body.vp-command-shell-ready .eyebrow,
body.vp-command-shell-ready .badge,
body.vp-command-shell-ready .version,
body.vp-command-shell-ready .tag,
body.vp-command-shell-ready .pill {
  font-size: var(--vp-type-small) !important;
  letter-spacing: 0 !important;
}

body.vp-command-shell-ready .vp-control {
  min-width: 108px;
  font-size: 10px;
}

body.vp-command-shell-ready .vp-control select,
body.vp-command-shell-ready .vp-control button {
  min-height: 32px;
  font-size: 12px !important;
}

body.vp-command-shell-ready main > section:first-of-type h1,
body.vp-command-shell-ready .home-intent h1,
body.vp-command-shell-ready .hero h1,
body.vp-command-shell-ready .hero-grid h1,
body.vp-command-shell-ready .brand-hero h1,
body.vp-command-shell-ready .blueprint-hero h1,
body.vp-command-shell-ready .intent-copy h1 {
  max-width: 860px;
  margin-top: 22px !important;
  font-size: var(--vp-type-hero-title) !important;
  line-height: var(--vp-type-tight) !important;
  letter-spacing: 0 !important;
}

body.vp-command-shell-ready .workspace > .panel h1,
body.vp-command-shell-ready .workspace > article h1,
body.vp-command-shell-ready .answer-shell h1,
body.vp-command-shell-ready .ask-panel h1,
body.vp-command-shell-ready .draft-gate h1,
body.vp-command-shell-ready .draft-review-gate h1,
body.vp-command-shell-ready .room-hero h1,
body.vp-command-shell-ready .lab-hero h1,
body.vp-command-shell-ready .main-panel h1 {
  max-width: 900px;
  font-size: var(--vp-type-room-title) !important;
  line-height: 1.08 !important;
  letter-spacing: 0 !important;
}

body.vp-command-shell-ready h2,
body.vp-command-shell-ready .panel > h2:first-child,
body.vp-command-shell-ready .tile > h2:first-child {
  font-size: var(--vp-type-section-title) !important;
  line-height: 1.14 !important;
  letter-spacing: 0 !important;
}

body.vp-command-shell-ready h3,
body.vp-command-shell-ready .card h3,
body.vp-command-shell-ready .tile h3,
body.vp-command-shell-ready .flow-card h3,
body.vp-command-shell-ready .answer-title,
body.vp-command-shell-ready .rail-card strong,
body.vp-command-shell-ready .step-card strong {
  font-size: var(--vp-type-card-title) !important;
  line-height: 1.18 !important;
  letter-spacing: 0 !important;
}

body.vp-command-shell-ready p,
body.vp-command-shell-ready li,
body.vp-command-shell-ready label,
body.vp-command-shell-ready textarea,
body.vp-command-shell-ready input,
body.vp-command-shell-ready select,
body.vp-command-shell-ready button {
  font-size: var(--vp-type-body);
  line-height: var(--vp-type-normal);
}

body.vp-command-shell-ready .lead,
body.vp-command-shell-ready .muted,
body.vp-command-shell-ready .hero p,
body.vp-command-shell-ready .brand-hero p,
body.vp-command-shell-ready .blueprint-hero p,
body.vp-command-shell-ready .intent-copy p,
body.vp-command-shell-ready main > section:first-of-type p {
  max-width: 760px;
  font-size: 18px !important;
  line-height: 1.42 !important;
}

body.vp-command-shell-ready .summary .tile strong,
body.vp-command-shell-ready .metric strong,
body.vp-command-shell-ready .stat strong,
body.vp-command-shell-ready .pulse strong,
body.vp-command-shell-ready .percent {
  font-size: var(--vp-type-metric) !important;
  line-height: 1.05 !important;
}

body.vp-command-shell-ready .panel,
body.vp-command-shell-ready .tile,
body.vp-command-shell-ready .answer-shell,
body.vp-command-shell-ready .flow-card,
body.vp-command-shell-ready .ask-panel,
body.vp-command-shell-ready .map-card {
  padding: 18px !important;
}

body.vp-command-shell-ready .hero,
body.vp-command-shell-ready .brand-hero,
body.vp-command-shell-ready .blueprint-hero,
body.vp-command-shell-ready .home-intent,
body.vp-command-shell-ready .room-hero,
body.vp-command-shell-ready .lab-hero {
  row-gap: 22px !important;
}

body.vp-command-shell-ready .hero img,
body.vp-command-shell-ready .brand-hero img,
body.vp-command-shell-ready .blueprint-hero img,
body.vp-command-shell-ready .mark-stage img,
body.vp-command-shell-ready .logo-card img {
  max-height: 420px;
  object-fit: contain;
}

body.vp-command-shell-ready .release-list,
body.vp-command-shell-ready .side-panel,
body.vp-command-shell-ready .pulse-panel {
  font-size: 15px;
}

@media (max-width: 1100px) {
  :root {
    --vp-type-page-title: 28px;
    --vp-type-hero-title: 42px;
    --vp-type-room-title: 38px;
    --vp-type-section-title: 22px;
    --vp-type-card-title: 19px;
  }
}

@media (max-width: 720px) {
  :root {
    --vp-type-page-title: 24px;
    --vp-type-hero-title: 34px;
    --vp-type-room-title: 32px;
    --vp-type-section-title: 21px;
    --vp-type-card-title: 18px;
    --vp-type-body: 15px;
    --vp-type-metric: 24px;
  }

  body.vp-command-shell-ready main > section:first-of-type h1,
  body.vp-command-shell-ready .home-intent h1,
  body.vp-command-shell-ready .hero h1,
  body.vp-command-shell-ready .hero-grid h1,
  body.vp-command-shell-ready .brand-hero h1,
  body.vp-command-shell-ready .blueprint-hero h1,
  body.vp-command-shell-ready .intent-copy h1 {
    margin-top: 16px !important;
  }
}
/* VEDAPATH COMMAND SHELL TYPE COHERENCE END */`;

const data = {
  schema_version: "vedapath-command-shell-typography-v1",
  release,
  title: releaseName,
  generated_at: "2026-06-28T00:00:00.000Z",
  founder_feedback: "Fonts feel too big in places and the overall command shell needs more coherence.",
  design_intent: "Keep the Hyrvia-inspired side rail while making VedaPath feel calmer, easier to scan, and less poster-like.",
  scale: {
    page_title: "30px",
    hero_title: "48px",
    room_title: "42px",
    section_title: "24px",
    card_title: "20px",
    body: "16px",
    small: "12px"
  },
  affected_surfaces: [
    "top command bar",
    "home hero",
    "build status",
    "brand board",
    "product blueprint",
    "cited answer room",
    "review queue",
    "mantra lens",
    "life companion",
    "pattern companion",
    "daily loop"
  ],
  boundaries: [
    "UI polish only; no source data, storage, account, authorization, execution, audio, or production behavior changed.",
    "The command shell remains browser-local.",
    "The source-first answer flow remains unchanged."
  ],
  next_release: "Controlled permission execution authorization review decision gate"
};

const doc = `# ${releaseName}

${releaseName} is a design-system polish pass after the Hyrvia-inspired side rail shell.

Founder feedback:

- Some fonts felt too big.
- Page-to-page hierarchy needed more coherence.
- The command shell direction was right, but the reading surfaces needed calmer rhythm.

What changed:

- Reduced hero and room heading scale across the command shell.
- Added one shared type ladder for page titles, hero titles, room titles, section titles, card titles, body text, and small labels.
- Tightened the top command bar so it feels like a product control surface instead of a second hero.
- Softened card padding and metric scale so side rails do not compete with the main content.
- Preserved the side navigation, local side preference, Bhagwa identity, and source-first tone.

Boundary:

This release changes UI rhythm only. It does not change source data, retrieval, storage, accounts, authorization, execution, audio, or production behavior.
`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
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

function insertBefore(text, marker, block) {
  if (text.includes(block.trim().split("\n")[0])) return text;
  return text.replace(marker, `${block}\n\n${marker}`);
}

function replaceTypeBlock(text) {
  const stripped = text.replace(/\/\* VEDAPATH COMMAND SHELL TYPE COHERENCE START \*\/[\s\S]*?\/\* VEDAPATH COMMAND SHELL TYPE COHERENCE END \*\//, "").trimEnd();
  return `${stripped}\n\n${typeBlock}\n`;
}

function updateHtmlBadges() {
  for (const file of walk(".")) {
    if (!file.endsWith(".html")) continue;
    update(file, (text) => text.replace(/v3\.3\.0 command shell/g, releaseBadge));
  }
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text;
    next = next.replace(
      /(<span>Current version<\/span>\s*<strong>)[^<]+(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      `$1${release}$2${releaseName}: VedaPath now keeps the command-center shell but uses a calmer, consistent type rhythm across hero, room, card, and metric surfaces.$3`
    );
    next = next.replace(
      /(<span>Full vision progress<\/span>\s*<strong>)[^<]+(<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>\s*<p>)[\s\S]*?(<\/p>)/,
      "$199%$299%$3The product shell now has side navigation, top controls, and a calmer shared type scale so rooms feel like one product instead of separate posters.$4"
    );
    next = next.replace(
      /(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      "$1Controlled permission execution authorization review decision gate$2Return to the authorization chain after the command shell type system has become easier to scan.$3"
    );
    next = next.replace(
      /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 295: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 295: ${releaseName}</strong>
                <p>Normalizes command-shell type scale, room headings, hero hierarchy, card density, and top control rhythm across VedaPath.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 296: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
    next = next.replace(
      /<div class="version-row"><span>Release<\/span><strong>v3\.3\.0 Command Center Side Rail UX<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.2\.9 Controlled Permission Execution Authorization Draft Review Gate<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Make the product feel organized, calm, and command-center clear\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready to return to founder review decision gate<\/strong><\/div>/,
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
            <div class="version-row"><span>Goal</span><strong>Make the command shell feel calmer, more coherent, and easier to scan.</strong></div>
            <div class="version-row"><span>Status</span><strong>Ready to return to founder review decision gate</strong></div>`
    );
    next = next.replace(
      /<li><span class="dot"><\/span><span>Keep the new side rail shell while adding the next trust gate\.<\/span><\/li>/,
      '<li><span class="dot"></span><span>Keep the calmer type scale while adding the next trust gate.</span></li>'
    );
    return next;
  });
}

function updateDocs() {
  const readmeBlock = `## ${release} ${releaseName}

${releaseName} keeps the Hyrvia-inspired command shell but reduces oversized typography and aligns page, hero, room, card, metric, and small-label scale across the product.

- [${releaseName} Notes](${docFile})
- [${releaseName} Config](${dataFile})`;

  const notesBlock = `## ${release} ${releaseName}

- Adds a shared typography ladder on top of the command shell.
- Reduces oversized hero and room headings while keeping VedaPath confident and warm.
- Tightens command controls, cards, metrics, and small labels into one calmer hierarchy.
- Leaves source data, retrieval, local memory, authorization, and production behavior unchanged.`;

  const blueprintBlock = `### 314. ${releaseName}

${releaseName} keeps VedaPath from becoming visually loud as the command center grows.

Design rules:

- Page titles identify the room; they should not compete with the room content.
- Hero titles stay strong, but they should not consume the whole workspace.
- Room titles, card titles, metrics, and side panels use one shared ladder.
- The top command bar is a control surface, not a second hero.
- Every future functional build should inherit this quieter scale before adding new UI.`;

  update("README.md", (text) => insertBefore(text, "## v3.3.0 Command Center Side Rail UX", readmeBlock));
  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.3.0 Command Center Side Rail UX", notesBlock));
  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 313. Command Center Side Rail UX", blueprintBlock));
}

write(dataFile, `${JSON.stringify(data, null, 2)}\n`);
write(docFile, doc);
update(cssFile, replaceTypeBlock);
update(jsFile, (text) => text.replace(/const releaseBadge = "v3\.3\.0 command shell";/, `const releaseBadge = "${releaseBadge}";`));
updateHtmlBadges();
updateBuildStatus();
updateDocs();

console.log(`${release} ${releaseName} applied.`);
