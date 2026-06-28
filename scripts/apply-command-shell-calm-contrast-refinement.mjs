import fs from "node:fs";
import path from "node:path";

const release = "v3.3.4";
const releaseName = "Command Shell Calm Contrast Refinement";
const releaseBadge = "v3.3.4 calm contrast";
const previousRelease = "v3.3.3 Command Shell Visual System Balance";
const previousBadge = "v3.3.3 visual balance";
const cssFile = "assets/vedapath-command-shell.css";
const jsFile = "assets/vedapath-command-shell.js";
const dataFile = "data/vedapath-command-shell-calm-contrast.json";
const docFile = "docs/COMMAND_SHELL_CALM_CONTRAST_REFINEMENT.md";

const cssBlock = `/* VEDAPATH COMMAND SHELL CALM CONTRAST REFINEMENT START */
:root {
  --vp-command-rail: 216px;
  --vp-command-rail-compact: 198px;
  --vp-calmcontrast-page: #fffbf5;
  --vp-calmcontrast-wash: rgba(229, 242, 237, 0.56);
  --vp-calmcontrast-surface: rgba(255, 255, 252, 0.92);
  --vp-calmcontrast-panel: rgba(255, 253, 248, 0.88);
  --vp-calmcontrast-line: rgba(19, 92, 74, 0.135);
  --vp-calmcontrast-line-warm: rgba(214, 90, 31, 0.18);
  --vp-calmcontrast-ink: #171614;
  --vp-calmcontrast-muted: #51463c;
  --vp-calmcontrast-green: #0f5b4b;
  --vp-calmcontrast-rail-a: #0e332f;
  --vp-calmcontrast-rail-b: #1f2b3f;
  --vp-calmcontrast-rail-c: #211811;
  --vp-calmcontrast-saffron: #d65a1f;
  --vp-calmcontrast-gold: #dea63a;
}

body.vp-command-shell-ready {
  --vp-command-ink: var(--vp-calmcontrast-ink);
  --vp-command-muted: var(--vp-calmcontrast-muted);
  --vp-command-green: var(--vp-calmcontrast-green);
  background:
    linear-gradient(90deg, rgba(255, 251, 245, 0.98), var(--vp-calmcontrast-wash) 42%, rgba(255, 249, 239, 0.96)),
    var(--vp-calmcontrast-page) !important;
}

body.vp-command-shell-ready .vp-command-rail {
  padding: 12px !important;
  background:
    linear-gradient(180deg, rgba(224, 166, 58, 0.11), transparent 16%),
    linear-gradient(155deg, var(--vp-calmcontrast-rail-a), var(--vp-calmcontrast-rail-b) 55%, var(--vp-calmcontrast-rail-c)) !important;
  box-shadow: 10px 0 24px rgba(18, 31, 29, 0.16) !important;
}

body.vp-command-shell-ready.vp-nav-right .vp-command-rail {
  box-shadow: -10px 0 24px rgba(18, 31, 29, 0.16) !important;
}

body.vp-command-shell-ready .vp-command-brand {
  min-height: 62px !important;
  grid-template-columns: 44px minmax(0, 1fr) !important;
  gap: 9px !important;
  padding: 8px !important;
  border-color: rgba(255, 248, 235, 0.2) !important;
  background: rgba(255, 250, 242, 0.1) !important;
}

body.vp-command-shell-ready .vp-command-brand img {
  width: 44px !important;
  height: 44px !important;
}

body.vp-command-shell-ready .vp-command-brand strong {
  font-size: 15px !important;
}

body.vp-command-shell-ready .vp-command-brand span {
  font-size: 11px !important;
  color: rgba(255, 235, 208, 0.82) !important;
}

body.vp-command-shell-ready .vp-rail-section {
  margin-top: 12px !important;
}

body.vp-command-shell-ready .vp-rail-section-title {
  margin: 0 0 6px !important;
  color: rgba(244, 200, 130, 0.9) !important;
  font-size: 10px !important;
  line-height: 1 !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0 !important;
}

body.vp-command-shell-ready .vp-rail-list {
  gap: 4px !important;
}

body.vp-command-shell-ready .vp-rail-link {
  grid-template-columns: 24px minmax(0, 1fr) !important;
  gap: 8px !important;
  min-height: 34px !important;
  padding: 7px 9px !important;
  color: rgba(255, 245, 232, 0.82) !important;
  font-size: 12.5px !important;
  border-color: rgba(255, 248, 235, 0.055) !important;
  background: rgba(255, 255, 255, 0.018) !important;
}

body.vp-command-shell-ready .vp-rail-glyph {
  width: 24px !important;
  height: 24px !important;
  border-radius: 7px !important;
  color: rgba(255, 240, 220, 0.9) !important;
  background: rgba(255, 248, 235, 0.09) !important;
}

body.vp-command-shell-ready .vp-rail-link.is-active {
  color: #1b1713 !important;
  background: linear-gradient(90deg, #fff9ee, #edf8f3) !important;
  border-color: rgba(224, 168, 59, 0.34) !important;
  box-shadow: 0 8px 18px rgba(10, 20, 18, 0.18) !important;
}

body.vp-command-shell-ready .vp-rail-link.is-active span:last-child {
  color: #1b1713 !important;
}

body.vp-command-shell-ready .vp-rail-link.is-active .vp-rail-glyph {
  color: #fffaf1 !important;
  background: var(--vp-calmcontrast-saffron) !important;
}

body.vp-command-shell-ready .vp-rail-note {
  font-size: 11px !important;
  color: rgba(255, 235, 208, 0.76) !important;
}

body.vp-command-shell-ready .vp-rail-note strong {
  font-size: 12px !important;
}

body.vp-command-shell-ready .topbar,
body.vp-command-shell-ready header.topbar {
  min-height: 58px !important;
  margin-bottom: 14px !important;
  padding-top: 7px !important;
  padding-bottom: 10px !important;
  border-bottom-color: var(--vp-calmcontrast-line) !important;
  background: linear-gradient(180deg, rgba(255, 255, 252, 0.98), rgba(247, 251, 248, 0.88)) !important;
  box-shadow: 0 8px 18px rgba(18, 31, 29, 0.035) !important;
}

body.vp-command-shell-ready .vp-command-top {
  gap: 14px !important;
}

body.vp-command-shell-ready .vp-command-title h1 {
  font-size: 26px !important;
  line-height: 1.06 !important;
}

body.vp-command-shell-ready .vp-command-eyebrow,
body.vp-command-shell-ready .vp-command-badge,
body.vp-command-shell-ready .vp-command-memory {
  min-height: 20px !important;
  padding: 0 8px !important;
  font-size: 10.5px !important;
}

body.vp-command-shell-ready .vp-command-controls {
  gap: 7px !important;
}

body.vp-command-shell-ready .vp-control {
  min-width: 104px !important;
  color: #6a4a36 !important;
}

body.vp-command-shell-ready .vp-control select,
body.vp-command-shell-ready .vp-control button {
  min-height: 30px !important;
  border-color: var(--vp-calmcontrast-line-warm) !important;
  background: rgba(255, 255, 252, 0.94) !important;
}

body.vp-command-shell-ready main > section:first-of-type h1,
body.vp-command-shell-ready .home-intent h1,
body.vp-command-shell-ready .hero h1,
body.vp-command-shell-ready .hero-grid h1,
body.vp-command-shell-ready .brand-hero h1,
body.vp-command-shell-ready .blueprint-hero h1,
body.vp-command-shell-ready .intent-copy h1 {
  font-size: 44px !important;
  line-height: 1.04 !important;
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
  font-size: 38px !important;
  line-height: 1.07 !important;
}

body.vp-command-shell-ready h2,
body.vp-command-shell-ready .panel > h2:first-child,
body.vp-command-shell-ready .tile > h2:first-child {
  font-size: 22px !important;
}

body.vp-command-shell-ready h3,
body.vp-command-shell-ready .card h3,
body.vp-command-shell-ready .tile h3,
body.vp-command-shell-ready .flow-card h3,
body.vp-command-shell-ready .answer-title,
body.vp-command-shell-ready .rail-card strong,
body.vp-command-shell-ready .step-card strong {
  font-size: 18px !important;
}

body.vp-command-shell-ready p,
body.vp-command-shell-ready li,
body.vp-command-shell-ready label,
body.vp-command-shell-ready textarea,
body.vp-command-shell-ready input,
body.vp-command-shell-ready select,
body.vp-command-shell-ready button {
  font-size: 15.5px !important;
}

body.vp-command-shell-ready .lead,
body.vp-command-shell-ready .muted,
body.vp-command-shell-ready .hero p,
body.vp-command-shell-ready .brand-hero p,
body.vp-command-shell-ready .blueprint-hero p,
body.vp-command-shell-ready .intent-copy p,
body.vp-command-shell-ready main > section:first-of-type p {
  font-size: 16.5px !important;
  line-height: 1.45 !important;
}

body.vp-command-shell-ready .panel,
body.vp-command-shell-ready .tile,
body.vp-command-shell-ready .phase,
body.vp-command-shell-ready .answer-shell,
body.vp-command-shell-ready .flow-card,
body.vp-command-shell-ready .ask-panel,
body.vp-command-shell-ready .map-card,
body.vp-command-shell-ready .source-block,
body.vp-command-shell-ready .answer-card,
body.vp-command-shell-ready .queue-detail,
body.vp-command-shell-ready .queue-list,
body.vp-command-shell-ready .metric,
body.vp-command-shell-ready .sprint-step,
body.vp-command-shell-ready .room-list > *,
body.vp-command-shell-ready .item-list > *,
body.vp-command-shell-ready .source-context,
body.vp-command-shell-ready .note,
body.vp-command-shell-ready .boundary {
  border-color: var(--vp-calmcontrast-line) !important;
  background: var(--vp-calmcontrast-panel) !important;
  box-shadow: 0 8px 20px rgba(31, 40, 35, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.76) !important;
}

body.vp-command-shell-ready .workspace > .panel,
body.vp-command-shell-ready .layout > .panel,
body.vp-command-shell-ready .summary > .tile,
body.vp-command-shell-ready main > section > .panel {
  background: var(--vp-calmcontrast-surface) !important;
}

body.vp-command-shell-ready .source-block,
body.vp-command-shell-ready .answer-card,
body.vp-command-shell-ready .note {
  border-left-color: var(--vp-calmcontrast-green) !important;
}

body.vp-command-shell-ready .button,
body.vp-command-shell-ready button,
body.vp-command-shell-ready input[type="button"],
body.vp-command-shell-ready input[type="submit"] {
  min-height: 34px !important;
  box-shadow: none !important;
}

body.vp-command-shell-ready .button:hover,
body.vp-command-shell-ready button:hover,
body.vp-command-shell-ready input[type="button"]:hover,
body.vp-command-shell-ready input[type="submit"]:hover {
  box-shadow: 0 8px 16px rgba(31, 40, 35, 0.08) !important;
}

body.vp-command-shell-ready .button.primary,
body.vp-command-shell-ready button.primary,
body.vp-command-shell-ready input.primary[type="button"],
body.vp-command-shell-ready input.primary[type="submit"] {
  background: linear-gradient(180deg, #d65a1f, #af4214) !important;
}

body.vp-command-shell-ready .button.safe,
body.vp-command-shell-ready button.safe,
body.vp-command-shell-ready input.safe[type="button"],
body.vp-command-shell-ready input.safe[type="submit"] {
  color: var(--vp-calmcontrast-green) !important;
  background: linear-gradient(180deg, #fffffc, #edf8f3) !important;
}

@media (max-width: 720px) {
  body.vp-command-shell-ready main > section:first-of-type h1,
  body.vp-command-shell-ready .home-intent h1,
  body.vp-command-shell-ready .hero h1,
  body.vp-command-shell-ready .hero-grid h1,
  body.vp-command-shell-ready .brand-hero h1,
  body.vp-command-shell-ready .blueprint-hero h1,
  body.vp-command-shell-ready .intent-copy h1,
  body.vp-command-shell-ready .workspace > .panel h1,
  body.vp-command-shell-ready .workspace > article h1,
  body.vp-command-shell-ready .answer-shell h1,
  body.vp-command-shell-ready .ask-panel h1,
  body.vp-command-shell-ready .draft-gate h1,
  body.vp-command-shell-ready .draft-review-gate h1,
  body.vp-command-shell-ready .room-hero h1,
  body.vp-command-shell-ready .lab-hero h1,
  body.vp-command-shell-ready .main-panel h1 {
    font-size: 32px !important;
  }
}
/* VEDAPATH COMMAND SHELL CALM CONTRAST REFINEMENT END */`;

const data = {
  schema_version: "vedapath-command-shell-calm-contrast-v1",
  release,
  title: releaseName,
  generated_at: "2026-06-28T00:00:00.000Z",
  founder_feedback: "Continue improving design, aesthetics, coherence, and color scheme.",
  design_intent: "Make the Hyrvia-inspired command shell calmer, less brown-heavy, more readable, and more coherent without changing product behavior.",
  palette_balance: {
    identity: "Bhagwa saffron for active intent and primary action",
    trust: "Peacock green for source, safety, and calm confidence",
    warmth: "Sacred gold for progress and gentle emphasis",
    depth: "Restrained indigo and warm ink for rail depth",
    surface: "Ivory and soft green wash for reading calm"
  },
  changes: [
    "narrower, cooler side rail",
    "smaller rail brand and structural labels",
    "clearer active navigation contrast",
    "tighter hero and room heading scale",
    "cooler card borders and quieter shadows",
    "more consistent primary and safe action treatments",
    "source-green emphasis on source and note blocks"
  ],
  boundaries: [
    "Visual-system polish only.",
    "No retrieval, account, storage, authorization, execution, source data, audio, or production behavior changed.",
    "The interface remains source-first and calm by default."
  ],
  next_release: "Controlled permission execution authorization review decision gate"
};

const doc = `# ${releaseName}

${releaseName} is a focused aesthetic refinement for the command shell.

Founder direction:

- Continue improving design, aesthetics, coherence, and color scheme.
- Keep the product simple, calm, and organized.

What changed:

- The side rail is slightly narrower and less brown-heavy.
- START, SOURCE, and PRACTICE remain quiet structural labels.
- Active navigation gets clearer contrast without becoming loud.
- Type scale is tightened so room pages feel more consistent.
- Cards and panels use cooler borders, lighter shadows, and softer surfaces.
- Bhagwa remains the identity accent while peacock green and sacred gold carry trust and progress.

Boundary:

This is a visual-system release only. It does not change source data, retrieval, accounts, storage, authorization, execution, audio, or production behavior.
`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function update(file, fn) {
  fs.writeFileSync(file, fn(read(file)));
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

function appendCssBlock(text) {
  const withoutExisting = text
    .replace(/\/\* VEDAPATH COMMAND SHELL CALM CONTRAST REFINEMENT START \*\/[\s\S]*?\/\* VEDAPATH COMMAND SHELL CALM CONTRAST REFINEMENT END \*\//, "")
    .trimEnd();
  return `${withoutExisting}\n\n${cssBlock}\n`;
}

function insertBefore(text, marker, block) {
  if (text.includes(block.split("\n")[0])) return text;
  if (!text.includes(marker)) {
    throw new Error(`Missing insertion marker: ${marker}`);
  }
  return text.replace(marker, `${block}\n\n${marker}`);
}

function replaceFirstOrThrow(text, pattern, replacement, label) {
  const next = text.replace(pattern, replacement);
  if (next === text) {
    throw new Error(`No replacement made for ${label}`);
  }
  return next;
}

function updateBadges() {
  for (const file of walk(".")) {
    if (!file.endsWith(".html")) continue;
    update(file, (text) => text.replaceAll(previousBadge, releaseBadge));
  }
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text;
    next = replaceFirstOrThrow(
      next,
      /(<span>Current version<\/span>\s*<strong>)[^<]+(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      `$1${release}$2${releaseName}: VedaPath now uses a quieter peacock-charcoal rail, tighter type rhythm, cooler borders, calmer cards, and clearer action contrast while keeping Bhagwa as the active identity accent.$3`,
      "current version tile"
    );
    next = replaceFirstOrThrow(
      next,
      /(<span>Full vision progress<\/span>\s*<strong>)[^<]+(<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>\s*<p>)[\s\S]*?(<\/p>)/,
      "$199%$299%$3The product shell now feels calmer and less cream-brown heavy: rail, top controls, type scale, source surfaces, and action colors read as one coherent system.$4",
      "full vision tile"
    );
    next = replaceFirstOrThrow(
      next,
      /(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      "$1Controlled permission execution authorization review decision gate$2Return to the authorization chain after one final calm-contrast UI polish pass.$3",
      "next release tile"
    );
    if (!next.includes(`Phase 298: ${releaseName}`)) {
      next = replaceFirstOrThrow(
        next,
        /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 298: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
        `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 298: ${releaseName}</strong>
                <p>Refines rail depth, active contrast, type scale, cooler surfaces, source-green trust cues, and Bhagwa-gold action rhythm.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 299: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
        "roadmap phase 298"
      );
    }
    next = replaceFirstOrThrow(
      next,
      /<div class="version-row"><span>Release<\/span><strong>v3\.3\.3 Command Shell Visual System Balance<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.3\.2 Command Shell Aesthetic Harmony<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Make the command shell feel calm, balanced, legible, and visually mature\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready to return to founder review decision gate<\/strong><\/div>/,
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
            <div class="version-row"><span>Goal</span><strong>Make the command shell feel calmer, more coherent, and less visually heavy.</strong></div>
            <div class="version-row"><span>Status</span><strong>Ready to return to founder review decision gate</strong></div>`,
      "version notes"
    );
    return next;
  });
}

function updateDocs() {
  const readmeBlock = `## ${release} ${releaseName}

${releaseName} gives the command shell a calmer contrast system: narrower rail, softer surfaces, tighter type rhythm, stronger active navigation, and a better-balanced Bhagwa, peacock green, sacred gold, indigo, and ivory palette.

- [${releaseName} Notes](${docFile})
- [${releaseName} Config](${dataFile})`;

  const notesBlock = `## ${release} ${releaseName}

- Narrows and cools the side rail so the shell feels more premium and less heavy.
- Tightens hero, room, card, body, and control type scale for better cross-page coherence.
- Keeps Bhagwa as the active identity accent while using peacock green for source trust and sacred gold for progress.
- Softens panels, cards, and command controls without changing product behavior.`;

  const blueprintBlock = `### 317. ${releaseName}

${releaseName} makes the command shell feel calmer and more coherent after the visual-system balance release.

Design rules:

- Bhagwa should remain the identity action color, not flood the whole screen.
- Peacock green should quietly signal source trust, safety, and calm confidence.
- Sacred gold should support progress and warmth.
- The side rail should feel grounded, premium, and readable without becoming visually heavy.
- Top controls should stay compact and predictable.
- Large headings should be powerful but not oversized across every room.`;

  update("README.md", (text) => insertBefore(text, "## v3.3.3 Command Shell Visual System Balance", readmeBlock));
  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.3.3 Command Shell Visual System Balance", notesBlock));
  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 316. Command Shell Visual System Balance", blueprintBlock));
}

write(dataFile, `${JSON.stringify(data, null, 2)}\n`);
write(docFile, doc);
update(cssFile, appendCssBlock);
update(jsFile, (text) => text.replace(`const releaseBadge = "${previousBadge}";`, `const releaseBadge = "${releaseBadge}";`));
updateBadges();
updateBuildStatus();
updateDocs();

console.log(`${release} ${releaseName} applied.`);
