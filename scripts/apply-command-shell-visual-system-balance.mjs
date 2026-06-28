import fs from "node:fs";
import path from "node:path";

const release = "v3.3.3";
const releaseName = "Command Shell Visual System Balance";
const releaseBadge = "v3.3.3 visual balance";
const previousRelease = "v3.3.2 Command Shell Aesthetic Harmony";
const cssFile = "assets/vedapath-command-shell.css";
const jsFile = "assets/vedapath-command-shell.js";
const dataFile = "data/vedapath-command-shell-visual-balance.json";
const docFile = "docs/COMMAND_SHELL_VISUAL_SYSTEM_BALANCE.md";

const cssBlock = `/* VEDAPATH COMMAND SHELL VISUAL SYSTEM BALANCE START */
:root {
  --vp-balance-page: #fffaf3;
  --vp-balance-surface: rgba(255, 255, 252, 0.9);
  --vp-balance-surface-soft: rgba(248, 252, 249, 0.78);
  --vp-balance-rail-top: #123c35;
  --vp-balance-rail-mid: #2c2118;
  --vp-balance-rail-bottom: #171c2d;
  --vp-balance-indigo: #29335c;
  --vp-balance-green: #135c4a;
  --vp-balance-saffron: #d65a1f;
  --vp-balance-gold: #e0a83b;
  --vp-balance-ink: #191512;
  --vp-balance-muted: #5c4a3d;
  --vp-balance-line: rgba(35, 69, 63, 0.14);
  --vp-balance-rail-line: rgba(255, 248, 235, 0.13);
}

body.vp-command-shell-ready {
  --vp-command-ink: var(--vp-balance-ink);
  --vp-command-muted: var(--vp-balance-muted);
  --vp-command-green: var(--vp-balance-green);
  background:
    linear-gradient(90deg, rgba(255, 250, 243, 0.98), rgba(248, 252, 249, 0.82) 48%, rgba(255, 249, 239, 0.98)),
    var(--vp-balance-page) !important;
}

body.vp-command-shell-ready .vp-command-rail {
  background:
    linear-gradient(180deg, rgba(224, 168, 59, 0.14), transparent 17%),
    linear-gradient(180deg, var(--vp-balance-rail-top), var(--vp-balance-rail-mid) 48%, var(--vp-balance-rail-bottom)) !important;
  border-right-color: var(--vp-balance-rail-line) !important;
  box-shadow: 14px 0 34px rgba(17, 35, 32, 0.18) !important;
}

body.vp-command-shell-ready.vp-nav-right .vp-command-rail {
  border-left-color: var(--vp-balance-rail-line) !important;
  box-shadow: -14px 0 34px rgba(17, 35, 32, 0.18) !important;
}

body.vp-command-shell-ready .vp-rail-section {
  margin-top: 14px !important;
}

body.vp-command-shell-ready .vp-rail-section-title {
  margin: 0 0 8px !important;
  color: #f3c780 !important;
  font-size: 11px !important;
  line-height: 1 !important;
  font-weight: 900 !important;
  letter-spacing: 0 !important;
  text-transform: uppercase !important;
}

body.vp-command-shell-ready .vp-rail-link {
  min-height: 36px !important;
  color: rgba(255, 247, 235, 0.86) !important;
  background: rgba(255, 255, 255, 0.025) !important;
  border-color: rgba(255, 248, 235, 0.045) !important;
}

body.vp-command-shell-ready .vp-rail-link span:last-child {
  color: inherit !important;
}

body.vp-command-shell-ready .vp-rail-link:hover,
body.vp-command-shell-ready .vp-rail-link:focus-visible {
  color: #fffaf1 !important;
  background: rgba(255, 248, 235, 0.11) !important;
  border-color: rgba(255, 248, 235, 0.14) !important;
}

body.vp-command-shell-ready .vp-rail-link.is-active {
  color: #201713 !important;
  background: linear-gradient(90deg, #fff8ec, #fff0df) !important;
  border-color: rgba(224, 168, 59, 0.4) !important;
  box-shadow: 0 10px 22px rgba(8, 18, 17, 0.2) !important;
}

body.vp-command-shell-ready .vp-rail-link.is-active span:last-child {
  color: #201713 !important;
}

body.vp-command-shell-ready .vp-rail-link.is-active .vp-rail-glyph {
  color: #fffaf1 !important;
  background: var(--vp-balance-saffron) !important;
}

body.vp-command-shell-ready .vp-rail-glyph {
  color: #fff3dd !important;
  background: rgba(255, 248, 235, 0.11) !important;
}

body.vp-command-shell-ready .vp-command-brand {
  border-color: rgba(255, 248, 235, 0.22) !important;
  background:
    linear-gradient(135deg, rgba(255, 250, 242, 0.2), rgba(226, 241, 236, 0.08)) !important;
}

body.vp-command-shell-ready .vp-command-brand span,
body.vp-command-shell-ready .vp-rail-note {
  color: rgba(255, 235, 208, 0.84) !important;
}

body.vp-command-shell-ready .topbar,
body.vp-command-shell-ready header.topbar {
  border-bottom-color: rgba(35, 69, 63, 0.12) !important;
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.98), rgba(248, 252, 249, 0.86)) !important;
  box-shadow: 0 10px 26px rgba(27, 42, 38, 0.035) !important;
}

body.vp-command-shell-ready .vp-command-eyebrow {
  color: var(--vp-balance-green) !important;
  border-color: rgba(19, 92, 74, 0.22) !important;
  background: rgba(226, 241, 236, 0.92) !important;
}

body.vp-command-shell-ready .vp-command-badge {
  color: #9d3b11 !important;
  border-color: rgba(214, 90, 31, 0.24) !important;
  background: rgba(255, 239, 224, 0.86) !important;
}

body.vp-command-shell-ready .vp-command-memory {
  color: #664710 !important;
  border-color: rgba(224, 168, 59, 0.3) !important;
  background: rgba(255, 247, 224, 0.88) !important;
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
  border-color: var(--vp-balance-line) !important;
  box-shadow: 0 10px 28px rgba(42, 50, 44, 0.055), inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
}

body.vp-command-shell-ready .workspace > .panel,
body.vp-command-shell-ready .layout > .panel,
body.vp-command-shell-ready .summary > .tile,
body.vp-command-shell-ready main > section > .panel {
  background:
    linear-gradient(180deg, var(--vp-balance-surface), rgba(255, 252, 247, 0.84)) !important;
}

body.vp-command-shell-ready .panel.tight,
body.vp-command-shell-ready aside.panel,
body.vp-command-shell-ready .side-panel,
body.vp-command-shell-ready .pulse-panel {
  background:
    linear-gradient(180deg, rgba(248, 252, 249, 0.88), rgba(255, 250, 243, 0.84)) !important;
}

body.vp-command-shell-ready .source-block,
body.vp-command-shell-ready .answer-card,
body.vp-command-shell-ready .note {
  border-left-color: var(--vp-balance-green) !important;
}

body.vp-command-shell-ready .button.safe,
body.vp-command-shell-ready button.safe,
body.vp-command-shell-ready input.safe[type="button"],
body.vp-command-shell-ready input.safe[type="submit"] {
  color: #0d5646 !important;
  border-color: rgba(19, 92, 74, 0.28) !important;
  background: linear-gradient(180deg, rgba(255, 255, 252, 0.98), rgba(231, 246, 241, 0.94)) !important;
}

body.vp-command-shell-ready .button.primary,
body.vp-command-shell-ready button.primary,
body.vp-command-shell-ready input.primary[type="button"],
body.vp-command-shell-ready input.primary[type="submit"] {
  background: linear-gradient(180deg, #d95d26, #b94716) !important;
}

body.vp-command-shell-ready input,
body.vp-command-shell-ready textarea,
body.vp-command-shell-ready select {
  border-color: rgba(35, 69, 63, 0.18) !important;
}

body.vp-command-shell-ready .progress .bar,
body.vp-command-shell-ready .bar {
  background: linear-gradient(90deg, var(--vp-balance-saffron), var(--vp-balance-gold)) !important;
}

body.vp-command-shell-ready .badge.done,
body.vp-command-shell-ready .badge.green,
body.vp-command-shell-ready .ticket-chip.green,
body.vp-command-shell-ready span.green {
  color: var(--vp-balance-green) !important;
  border-color: rgba(19, 92, 74, 0.18) !important;
  background: rgba(226, 241, 236, 0.9) !important;
}

body.vp-command-shell-ready .later {
  color: var(--vp-balance-indigo) !important;
  background: rgba(41, 51, 92, 0.09) !important;
}

body.vp-command-shell-ready ::-webkit-scrollbar-thumb {
  border-color: rgba(255, 250, 243, 0.82) !important;
  background: rgba(19, 92, 74, 0.26) !important;
}

@media (max-width: 860px) {
  body.vp-command-shell-ready .vp-rail-section-title {
    margin-top: 10px !important;
    font-size: 10px !important;
  }
}
/* VEDAPATH COMMAND SHELL VISUAL SYSTEM BALANCE END */`;

const data = {
  schema_version: "vedapath-command-shell-visual-balance-v1",
  release,
  title: releaseName,
  generated_at: "2026-06-28T00:00:00.000Z",
  founder_feedback: "Improve design, aesthetics, coherence, and color scheme after v3.3.2.",
  design_intent: "Keep the command-center UX while making the shell feel more balanced, less one-note, more legible, and calmer.",
  changes: [
    "quieter side-rail section labels",
    "stronger active navigation contrast",
    "less brown-heavy rail with green, ink, and indigo depth",
    "balanced Bhagwa, peacock green, and sacred gold accents",
    "calmer top command bar surface",
    "softer panel shadows and cleaner border color",
    "green source emphasis on answer and note blocks",
    "more consistent active, safe, and primary control treatment"
  ],
  boundaries: [
    "Visual-system polish only.",
    "No source data, retrieval, account, storage, authorization, execution, audio, or production behavior changed.",
    "The interface remains source-first, calm, and simple by default."
  ],
  next_release: "Controlled permission execution authorization review decision gate"
};

const doc = `# ${releaseName}

${releaseName} balances the command shell after the aesthetic pass.

Founder feedback:

- The design is improving.
- More coherence, aesthetics, and color-system balance are needed.

What changed:

- Side rail section labels are controlled so START, SOURCE, and PRACTICE no longer behave like page headings.
- Active rail links now have stronger text contrast and a clearer Bhagwa glyph.
- The dark rail is less brown-only, with peacock green, warm ink, and a restrained indigo base.
- Panels, cards, source blocks, and notes use calmer border and shadow behavior.
- The top command bar is quieter and cleaner.
- Safe actions lean green, primary actions remain Bhagwa, and progress remains Bhagwa-to-gold.

Boundary:

This is visual-system polish only. It does not change product logic, source records, retrieval, storage, accounts, authorization, execution, audio, or production behavior.
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
  const stripped = text.replace(/\/\* VEDAPATH COMMAND SHELL VISUAL SYSTEM BALANCE START \*\/[\s\S]*?\/\* VEDAPATH COMMAND SHELL VISUAL SYSTEM BALANCE END \*\//, "").trimEnd();
  return `${stripped}\n\n${cssBlock}\n`;
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
    update(file, (text) => text.replace(/v3\.3\.2 aesthetic/g, releaseBadge));
  }
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text;
    next = replaceFirstOrThrow(
      next,
      /(<span>Current version<\/span>\s*<strong>)[^<]+(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      `$1${release}$2${releaseName}: VedaPath now balances Bhagwa warmth with peacock green, sacred gold, warm ink, and restrained indigo while fixing rail label scale, active nav contrast, and surface depth.$3`,
      "current version tile"
    );
    next = replaceFirstOrThrow(
      next,
      /(<span>Full vision progress<\/span>\s*<strong>)[^<]+(<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>\s*<p>)[\s\S]*?(<\/p>)/,
      "$199%$299%$3The product shell now feels less brown-heavy and more coherent: side rail, top controls, type scale, color accents, and reading surfaces behave like one system.$4",
      "full vision tile"
    );
    next = replaceFirstOrThrow(
      next,
      /(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      "$1Controlled permission execution authorization review decision gate$2Return to the authorization chain after the visual system has a balanced, calmer foundation.$3",
      "next release tile"
    );
    if (!next.includes(`Phase 297: ${releaseName}`)) {
      next = replaceFirstOrThrow(
        next,
        /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 297: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
        `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 297: ${releaseName}</strong>
                <p>Balances rail scale, active contrast, command surfaces, source-green emphasis, Bhagwa-gold progress, and overall color rhythm.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 298: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
        "roadmap phase 297"
      );
    }
    next = replaceFirstOrThrow(
      next,
      /<div class="version-row"><span>Release<\/span><strong>v3\.3\.2 Command Shell Aesthetic Harmony<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.3\.1 Command Shell Typography Coherence<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Make the command shell feel more premium, warm, and visually unified\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready to return to founder review decision gate<\/strong><\/div>/,
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
            <div class="version-row"><span>Goal</span><strong>Make the command shell feel calm, balanced, legible, and visually mature.</strong></div>
            <div class="version-row"><span>Status</span><strong>Ready to return to founder review decision gate</strong></div>`,
      "version notes"
    );
    return next;
  });
}

function updateDocs() {
  const readmeBlock = `## ${release} ${releaseName}

${releaseName} balances the command shell visual system: quieter rail headings, stronger active navigation contrast, less brown-heavy depth, cleaner panels, and Bhagwa accents supported by peacock green, sacred gold, and restrained indigo.

- [${releaseName} Notes](${docFile})
- [${releaseName} Config](${dataFile})`;

  const notesBlock = `## ${release} ${releaseName}

- Keeps the Hyrvia-inspired side rail, but makes START, SOURCE, and PRACTICE small structural labels instead of large headings.
- Improves active rail contrast and the active Bhagwa glyph.
- Balances Bhagwa warmth with peacock green, sacred gold, warm ink, and a restrained indigo rail base.
- Softens surfaces and adds clearer source-green emphasis without changing product behavior.`;

  const blueprintBlock = `### 316. ${releaseName}

${releaseName} makes VedaPath feel more visually balanced without changing the product structure.

Design rules:

- Bhagwa remains the identity color, not the only organizing color.
- Green should signal source, safety, and calm confidence.
- Gold should highlight progress and warmth.
- The side rail should feel grounded, but not heavy or brown-only.
- Section labels in the rail must stay small, structural, and quiet.
- Active navigation must be readable at a glance.`;

  update("README.md", (text) => insertBefore(text, "## v3.3.2 Command Shell Aesthetic Harmony", readmeBlock));
  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.3.2 Command Shell Aesthetic Harmony", notesBlock));
  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 315. Command Shell Aesthetic Harmony", blueprintBlock));
}

write(dataFile, `${JSON.stringify(data, null, 2)}\n`);
write(docFile, doc);
update(cssFile, appendCssBlock);
update(jsFile, (text) => text.replace(/const releaseBadge = "v3\.3\.2 aesthetic";/, `const releaseBadge = "${releaseBadge}";`));
updateBadges();
updateBuildStatus();
updateDocs();

console.log(`${release} ${releaseName} applied.`);
