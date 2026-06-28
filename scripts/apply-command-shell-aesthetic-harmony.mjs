import fs from "node:fs";
import path from "node:path";

const release = "v3.3.2";
const releaseName = "Command Shell Aesthetic Harmony";
const releaseBadge = "v3.3.2 aesthetic";
const previousRelease = "v3.3.1 Command Shell Typography Coherence";
const cssFile = "assets/vedapath-command-shell.css";
const jsFile = "assets/vedapath-command-shell.js";
const dataFile = "data/vedapath-command-shell-aesthetic.json";
const docFile = "docs/COMMAND_SHELL_AESTHETIC_HARMONY.md";

const aestheticBlock = `/* VEDAPATH COMMAND SHELL AESTHETIC HARMONY START */
:root {
  --vp-aesthetic-bg: #fff8ee;
  --vp-aesthetic-surface: rgba(255, 253, 248, 0.84);
  --vp-aesthetic-surface-strong: rgba(255, 255, 252, 0.94);
  --vp-aesthetic-quiet: rgba(255, 244, 230, 0.7);
  --vp-aesthetic-line: rgba(114, 66, 36, 0.14);
  --vp-aesthetic-line-strong: rgba(214, 90, 31, 0.28);
  --vp-aesthetic-shadow: 0 18px 40px rgba(85, 42, 16, 0.08);
  --vp-aesthetic-shadow-soft: 0 10px 26px rgba(85, 42, 16, 0.06);
  --vp-aesthetic-inner: inset 0 1px 0 rgba(255, 255, 255, 0.74);
  --vp-aesthetic-focus: rgba(20, 92, 74, 0.2);
}

body.vp-command-shell-ready {
  background:
    linear-gradient(90deg, rgba(255, 249, 239, 0.98), rgba(255, 246, 232, 0.82) 44%, rgba(255, 252, 247, 0.96)),
    var(--vp-aesthetic-bg) !important;
}

body.vp-command-shell-ready::selection {
  color: #fffaf1;
  background: #a83e12;
}

body.vp-command-shell-ready .page,
body.vp-command-shell-ready .shell,
body.vp-command-shell-ready > main {
  padding-top: 18px !important;
  padding-left: 28px !important;
  padding-right: 28px !important;
}

body.vp-command-shell-ready .topbar,
body.vp-command-shell-ready header.topbar {
  border-bottom-color: var(--vp-aesthetic-line) !important;
  background:
    linear-gradient(180deg, rgba(255, 252, 247, 0.98), rgba(255, 247, 236, 0.9)) !important;
  box-shadow: 0 12px 28px rgba(98, 49, 18, 0.045);
}

body.vp-command-shell-ready .vp-command-rail {
  border-right: 1px solid rgba(255, 238, 213, 0.1);
  background:
    linear-gradient(180deg, rgba(255, 238, 213, 0.06), transparent 18%),
    linear-gradient(180deg, #2b170d, #3b1c0f 46%, #1f130d);
  box-shadow: 16px 0 36px rgba(44, 21, 8, 0.18);
}

body.vp-command-shell-ready.vp-nav-right .vp-command-rail {
  border-right: 0;
  border-left: 1px solid rgba(255, 238, 213, 0.1);
  box-shadow: -16px 0 36px rgba(44, 21, 8, 0.18);
}

body.vp-command-shell-ready .vp-command-brand {
  border-color: rgba(255, 244, 230, 0.18);
  background:
    linear-gradient(135deg, rgba(255, 248, 235, 0.18), rgba(255, 248, 235, 0.05));
  box-shadow: inset 0 1px 0 rgba(255, 248, 235, 0.16);
}

body.vp-command-shell-ready .vp-command-brand img,
body.vp-command-shell-ready .brand img,
body.vp-command-shell-ready .mark-stage img,
body.vp-command-shell-ready .logo-card img,
body.vp-command-shell-ready .queue-mark img {
  box-shadow: 0 12px 28px rgba(168, 62, 18, 0.13);
}

body.vp-command-shell-ready .vp-rail-link {
  border-color: rgba(255, 244, 230, 0.02);
  color: #f0d9c6;
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

body.vp-command-shell-ready .vp-rail-link:hover,
body.vp-command-shell-ready .vp-rail-link:focus-visible {
  transform: translateX(1px);
  background: rgba(255, 248, 235, 0.12);
}

body.vp-command-shell-ready.vp-nav-right .vp-rail-link:hover,
body.vp-command-shell-ready.vp-nav-right .vp-rail-link:focus-visible {
  transform: translateX(-1px);
}

body.vp-command-shell-ready .vp-rail-link.is-active {
  background:
    linear-gradient(90deg, rgba(255, 250, 242, 1), rgba(255, 241, 225, 0.95));
  box-shadow: 0 12px 26px rgba(20, 11, 6, 0.2);
}

body.vp-command-shell-ready .vp-rail-glyph,
body.vp-command-shell-ready .step-index,
body.vp-command-shell-ready .number,
body.vp-command-shell-ready .index {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34);
}

body.vp-command-shell-ready .vp-command-eyebrow,
body.vp-command-shell-ready .vp-command-badge,
body.vp-command-shell-ready .vp-command-memory,
body.vp-command-shell-ready .eyebrow,
body.vp-command-shell-ready .badge,
body.vp-command-shell-ready .tag,
body.vp-command-shell-ready .pill {
  border: 1px solid rgba(168, 62, 18, 0.12);
  background: rgba(255, 238, 226, 0.72);
  box-shadow: var(--vp-aesthetic-inner);
}

body.vp-command-shell-ready .vp-command-eyebrow,
body.vp-command-shell-ready .badge.green,
body.vp-command-shell-ready .ticket-chip.green,
body.vp-command-shell-ready span.green {
  color: #135c4a !important;
  border-color: rgba(19, 92, 74, 0.16) !important;
  background: rgba(226, 241, 236, 0.82) !important;
}

body.vp-command-shell-ready .vp-command-memory {
  color: #795016;
  border-color: rgba(224, 168, 59, 0.24);
  background: rgba(255, 247, 225, 0.86);
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
  border-color: var(--vp-aesthetic-line) !important;
  background: var(--vp-aesthetic-surface) !important;
  box-shadow: var(--vp-aesthetic-shadow-soft), var(--vp-aesthetic-inner);
}

body.vp-command-shell-ready .workspace > .panel,
body.vp-command-shell-ready .layout > .panel,
body.vp-command-shell-ready .summary > .tile,
body.vp-command-shell-ready main > section > .panel {
  background: var(--vp-aesthetic-surface-strong) !important;
  box-shadow: var(--vp-aesthetic-shadow), var(--vp-aesthetic-inner);
}

body.vp-command-shell-ready .panel.tight,
body.vp-command-shell-ready aside.panel,
body.vp-command-shell-ready .side-panel,
body.vp-command-shell-ready .pulse-panel {
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.92), rgba(255, 248, 239, 0.78)) !important;
}

body.vp-command-shell-ready .source-block,
body.vp-command-shell-ready .answer-card,
body.vp-command-shell-ready .note {
  border-left-color: var(--vp-command-accent) !important;
  border-left-width: 4px !important;
}

body.vp-command-shell-ready .progress {
  height: 8px !important;
  background: rgba(168, 62, 18, 0.13) !important;
  box-shadow: inset 0 1px 2px rgba(91, 49, 20, 0.08);
}

body.vp-command-shell-ready .bar,
body.vp-command-shell-ready .progress .bar {
  background: linear-gradient(90deg, #d65a1f, #e0a83b) !important;
}

body.vp-command-shell-ready .button,
body.vp-command-shell-ready button,
body.vp-command-shell-ready input[type="button"],
body.vp-command-shell-ready input[type="submit"] {
  border-radius: 8px !important;
  box-shadow: 0 8px 18px rgba(168, 62, 18, 0.08);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
}

body.vp-command-shell-ready .button:hover,
body.vp-command-shell-ready button:hover,
body.vp-command-shell-ready input[type="button"]:hover,
body.vp-command-shell-ready input[type="submit"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(168, 62, 18, 0.11);
}

body.vp-command-shell-ready .button.primary,
body.vp-command-shell-ready button.primary,
body.vp-command-shell-ready input.primary[type="button"],
body.vp-command-shell-ready input.primary[type="submit"] {
  border-color: rgba(214, 90, 31, 0.38) !important;
  background: linear-gradient(180deg, #df642b, #c84d18) !important;
  color: #fffaf1 !important;
}

body.vp-command-shell-ready .button.safe,
body.vp-command-shell-ready button.safe,
body.vp-command-shell-ready input.safe[type="button"],
body.vp-command-shell-ready input.safe[type="submit"] {
  color: #075443 !important;
  border-color: rgba(19, 92, 74, 0.24) !important;
  background: linear-gradient(180deg, rgba(255, 255, 252, 0.98), rgba(237, 250, 246, 0.9)) !important;
}

body.vp-command-shell-ready input,
body.vp-command-shell-ready textarea,
body.vp-command-shell-ready select {
  border-color: rgba(168, 62, 18, 0.22) !important;
  background: rgba(255, 253, 248, 0.9) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

body.vp-command-shell-ready input:focus-visible,
body.vp-command-shell-ready textarea:focus-visible,
body.vp-command-shell-ready select:focus-visible,
body.vp-command-shell-ready .button:focus-visible,
body.vp-command-shell-ready button:focus-visible,
body.vp-command-shell-ready a:focus-visible {
  outline: 3px solid var(--vp-aesthetic-focus) !important;
  outline-offset: 2px;
}

body.vp-command-shell-ready .mark-stage,
body.vp-command-shell-ready .logo-card,
body.vp-command-shell-ready .queue-mark {
  border-color: rgba(224, 168, 59, 0.2) !important;
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.92), rgba(255, 240, 222, 0.66)) !important;
}

body.vp-command-shell-ready hr,
body.vp-command-shell-ready section + section {
  border-color: var(--vp-aesthetic-line) !important;
}

body.vp-command-shell-ready .muted,
body.vp-command-shell-ready .lead,
body.vp-command-shell-ready .source-meta,
body.vp-command-shell-ready .version-row span {
  color: #6a4837 !important;
}

body.vp-command-shell-ready ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

body.vp-command-shell-ready ::-webkit-scrollbar-thumb {
  border: 3px solid rgba(255, 248, 239, 0.8);
  border-radius: 999px;
  background: rgba(91, 70, 56, 0.34);
}

body.vp-command-shell-ready ::-webkit-scrollbar-track {
  background: rgba(255, 248, 239, 0.74);
}

@media (max-width: 860px) {
  body.vp-command-shell-ready .vp-command-rail,
  body.vp-command-shell-ready.vp-nav-right .vp-command-rail {
    border: 0;
  }

  body.vp-command-shell-ready .page,
  body.vp-command-shell-ready .shell,
  body.vp-command-shell-ready > main {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
/* VEDAPATH COMMAND SHELL AESTHETIC HARMONY END */`;

const data = {
  schema_version: "vedapath-command-shell-aesthetic-v1",
  release,
  title: releaseName,
  generated_at: "2026-06-28T00:00:00.000Z",
  founder_feedback: "UI aesthetics need more refinement after the typography polish.",
  design_intent: "Keep the command center structure while making the product feel warmer, more premium, calmer, and more cohesive.",
  changes: [
    "warmer page background",
    "more refined side rail depth",
    "calmer panel surfaces",
    "softer card shadows",
    "clearer form and button states",
    "quieter progress bars",
    "more consistent focus states",
    "subtle green and gold balance against Bhagwa"
  ],
  boundaries: [
    "Design polish only.",
    "No source data, retrieval, account, storage, authorization, execution, audio, or production behavior changed.",
    "The interface remains simple and source-first."
  ],
  next_release: "Controlled permission execution authorization review decision gate"
};

const doc = `# ${releaseName}

${releaseName} adds a quieter aesthetic layer after the command shell and typography work.

Founder feedback:

- The direction looks good.
- The UI still needs more aesthetic refinement.

What changed:

- Warmer page background and cleaner shell depth.
- More refined side rail treatment with better active and hover states.
- Softer card, panel, source block, metric, and queue surfaces.
- Better button, form, focus, and progress-bar treatment.
- Subtle peacock green and sacred gold accents to keep Bhagwa from becoming one-note.

Boundary:

This is visual polish only. It does not change product logic, source records, retrieval, storage, accounts, authorization, execution, audio, or production behavior.
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

function replaceAestheticBlock(text) {
  const stripped = text.replace(/\/\* VEDAPATH COMMAND SHELL AESTHETIC HARMONY START \*\/[\s\S]*?\/\* VEDAPATH COMMAND SHELL AESTHETIC HARMONY END \*\//, "").trimEnd();
  return `${stripped}\n\n${aestheticBlock}\n`;
}

function updateHtmlBadges() {
  for (const file of walk(".")) {
    if (!file.endsWith(".html")) continue;
    update(file, (text) => text.replace(/v3\.3\.1 type polish/g, releaseBadge));
  }
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text;
    next = next.replace(
      /(<span>Current version<\/span>\s*<strong>)[^<]+(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      `$1${release}$2${releaseName}: VedaPath now adds warmer surfaces, refined rail depth, calmer cards, better controls, and more balanced Bhagwa-green-gold accents across the command shell.$3`
    );
    next = next.replace(
      /(<span>Full vision progress<\/span>\s*<strong>)[^<]+(<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>\s*<p>)[\s\S]*?(<\/p>)/,
      "$199%$299%$3The product shell now feels more mature: side rail, top controls, type scale, and aesthetic surfaces are working as one product system.$4"
    );
    next = next.replace(
      /(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      "$1Controlled permission execution authorization review decision gate$2Return to the authorization chain after the command shell has a more polished aesthetic foundation.$3"
    );
    next = next.replace(
      /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 296: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 296: ${releaseName}</strong>
                <p>Refines shell surfaces, side rail depth, cards, buttons, controls, progress bars, focus states, and accent balance.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 297: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
    next = next.replace(
      /<div class="version-row"><span>Release<\/span><strong>v3\.3\.1 Command Shell Typography Coherence<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.3\.0 Command Center Side Rail UX<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Make the command shell feel calmer, more coherent, and easier to scan\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready to return to founder review decision gate<\/strong><\/div>/,
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
            <div class="version-row"><span>Goal</span><strong>Make the command shell feel more premium, warm, and visually unified.</strong></div>
            <div class="version-row"><span>Status</span><strong>Ready to return to founder review decision gate</strong></div>`
    );
    return next;
  });
}

function updateDocs() {
  const readmeBlock = `## ${release} ${releaseName}

${releaseName} adds a warmer, more premium aesthetic layer to the Hyrvia-inspired command shell: refined rail depth, calmer cards, better controls, softer shadows, and balanced Bhagwa, gold, and peacock-green accents.

- [${releaseName} Notes](${docFile})
- [${releaseName} Config](${dataFile})`;

  const notesBlock = `## ${release} ${releaseName}

- Adds a shared aesthetic layer on top of the command shell and typography system.
- Refines side rail, panels, cards, buttons, forms, progress bars, and focus states.
- Balances Bhagwa warmth with green and gold accents so the UI feels calmer and more premium.
- Leaves all source, retrieval, local memory, authorization, and production behavior unchanged.`;

  const blueprintBlock = `### 315. ${releaseName}

${releaseName} makes the product feel more mature without adding visual noise.

Design rules:

- Warm surfaces should support reading, not decorate the page.
- The side rail should feel solid and calm, not heavy.
- Cards and panels should have depth but avoid floating-card clutter.
- Buttons and form controls should feel deliberate and consistent.
- Bhagwa remains the identity color, balanced with green and gold for trust and calm.`;

  update("README.md", (text) => insertBefore(text, "## v3.3.1 Command Shell Typography Coherence", readmeBlock));
  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.3.1 Command Shell Typography Coherence", notesBlock));
  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 314. Command Shell Typography Coherence", blueprintBlock));
}

write(dataFile, `${JSON.stringify(data, null, 2)}\n`);
write(docFile, doc);
update(cssFile, replaceAestheticBlock);
update(jsFile, (text) => text.replace(/const releaseBadge = "v3\.3\.1 type polish";/, `const releaseBadge = "${releaseBadge}";`));
updateHtmlBadges();
updateBuildStatus();
updateDocs();

console.log(`${release} ${releaseName} applied.`);
