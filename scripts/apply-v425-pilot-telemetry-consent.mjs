import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const version = "v4.2.5";
const badge = "v4.2.5 consent";
const releaseName = "Pilot Telemetry Consent";
const releaseDate = "July 8, 2026";
const pageFile = "pilottelemetryconsent.html";
const dataFile = "data/vedapath-pilot-telemetry-consent.json";
const docFile = "docs/PILOT_TELEMETRY_CONSENT.md";

function read(file) {
  return readFileSync(file, "utf8");
}

function write(file, value) {
  writeFileSync(file, value.replace(/\r?\n/g, "\n"), "utf8");
}

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Missing expected text for ${label}`);
  }
  return text.replace(from, to);
}

function upsertNav(text, activeLabel = "") {
  if (!text.includes('href="pilottelemetryconsent.html"') && text.includes('href="pilotinvitepacket.html"')) {
    text = text.replace(
      /(<a class="link(?: active)?" href="pilotinvitepacket\.html">Invite<\/a>\s*)/,
      `$1\n        <a class="link" href="pilottelemetryconsent.html">Telemetry</a>`
    );
  }
  if (activeLabel === "Telemetry") {
    text = text.replace('<a class="link" href="pilottelemetryconsent.html">Telemetry</a>', '<a class="link active" href="pilottelemetryconsent.html">Telemetry</a>');
  }
  return text.replace(/<span class="version-pill">v4\.2\.4 invite<\/span>/g, `<span class="version-pill">${badge}</span>`);
}

const navLinks = `
        <a class="link" href="index.html">Home</a>
        <a class="link" href="build-status.html">Build</a>
        <a class="link" href="brand/brand-board.html">Brand</a>
        <a class="link" href="blueprint.html">Blueprint</a>
        <a class="link" href="citedanswerlab.html">Answers</a>
        <a class="link" href="reviewqueuepersistence.html">Review</a>
        <a class="link" href="mantralenslab.html">Mantra</a>
        <a class="link" href="lifecompanionlab.html">Life</a>
        <a class="link" href="conversationcompanionlab.html">Talk</a>
        <a class="link" href="patterncompanionlab.html">Pattern</a>
        <a class="link" href="daily.html">Daily</a>
        <a class="link" href="answerpacketpilot.html">Packet</a>
        <a class="link" href="launchreadinesshub.html">Launch</a>
        <a class="link" href="productionretrievalpilotgate.html">Pilot</a>
        <a class="link" href="verifiedsourcerecordschema.html">Records</a>
        <a class="link" href="retrievalreviewerdesk.html">Desk</a>
        <a class="link" href="first25sourceqapack.html">QA Pack</a>
        <a class="link" href="learneraskflow.html">Ask Flow</a>
        <a class="link" href="citationdeeplinklayer.html">Links</a>
        <a class="link" href="sourceeditionrightsmatrix.html">Rights</a>
        <a class="link" href="reviewerdecisionhistory.html">History</a>
        <a class="link" href="retrievalscoringexplanation.html">Score</a>
        <a class="link" href="publicpilotwaitlistgate.html">Waitlist</a>
        <a class="link" href="sourceeditionintake.html">Edition</a>
        <a class="link" href="rightsreviewdesk.html">Rights Desk</a>
        <a class="link" href="revieweridentitylite.html">Identity</a>
        <a class="link" href="answerpromotionrules.html">Promote</a>
        <a class="link" href="pilotinvitepacket.html">Invite</a>
        <a class="link active" href="pilottelemetryconsent.html">Telemetry</a>
        <span class="version-pill">${badge}</span>`;

const telemetryData = {
  headline: "Measure only what people knowingly allow.",
  copy: "Pilot Telemetry Consent makes VedaPath ask for explicit learning permission before any public-pilot signal is counted. It separates helpful product learning from hidden tracking, private data, accounts, or production storage.",
  boundary: "This remains a static GitHub Pages prototype. Consent records stay in this browser only, do not create accounts, do not identify people, do not enable hidden analytics, and do not grant production measurement authority.",
  metrics: [
    { label: "Signal groups", value: "4" },
    { label: "Storage", value: "Local" },
    { label: "Identity", value: "Off" },
    { label: "Hidden analytics", value: "Off" }
  ],
  consentModes: [
    {
      id: "no-measurement",
      title: "No measurement",
      promise: "Use the pilot without saving product-learning signals.",
      allowed: "No local telemetry entry is saved."
    },
    {
      id: "local-learning",
      title: "Local learning only",
      promise: "Save a visible browser-local signal to prove the consent loop.",
      allowed: "Page, source family, path lane, and one optional feedback note."
    },
    {
      id: "founder-review",
      title: "Founder review packet",
      promise: "Create a copyable pilot-learning summary the founder can review.",
      allowed: "An editable packet only after the user presses copy or save."
    }
  ],
  signals: [
    "Room visited",
    "Source family inspected",
    "Boundary understood",
    "Feedback note offered"
  ],
  gates: [
    "Consent choice is visible before any learning signal.",
    "No personal identity, private profile, payment, or account is collected.",
    "User can clear local preview memory.",
    "Telemetry is product learning, not spiritual, medical, or personal scoring."
  ],
  defaultNote: "I consent to local-only pilot learning for this VedaPath prototype. Do not use this as account storage, hidden analytics, or production telemetry."
};

const telemetryHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${releaseName} | VedaPath AI</title>
  <link rel="icon" href="assets/vedapath-3d-logo-concept.png" />
  <link rel="stylesheet" href="assets/vedapath-ui.css" />
  <link rel="stylesheet" href="assets/vedapath-command-shell.css" />
  <link rel="stylesheet" href="assets/vedapath-pilot-readiness.css" />
</head>
<body class="pilot-telemetry-consent-page pilot-readiness-surface">
  <main class="workspace" id="top">
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="Go to VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <span><strong>VedaPath AI</strong><small>pilot consent</small></span>
      </a>
      <nav class="navlinks nav" aria-label="Primary navigation">
        ${navLinks}
      </nav>
    </header>

    <section class="pr-hero">
      <div class="pr-hero-copy">
        <p class="pr-eyebrow">${version} telemetry consent</p>
        <h1>Pilot Telemetry Consent</h1>
        <p>Measure public-pilot learning only after consent, privacy, and local storage boundaries are visible. VedaPath stays source-first before it becomes data-aware.</p>
      </div>
      <aside class="pr-hero-card">
        <img src="assets/vedapath-3d-logo-concept.png" alt="" />
        <strong>Consent before signal.</strong>
        <span>VedaPath only. Local preview only.</span>
      </aside>
    </section>

    <section class="pr-app" data-pilot-readiness-app data-kind="telemetryConsent" data-data-file="${dataFile}"></section>
  </main>
  <script src="assets/vedapath-command-shell.js"></script>
  <script src="assets/vedapath-pilot-readiness.js"></script>
</body>
</html>
`;

const telemetryDoc = `# ${releaseName}

## Purpose

VedaPath should not learn from pilot behavior until consent is visible. ${releaseName} adds a static prototype room for consent-first pilot learning.

## What It Allows

- Local-only product learning in the current browser.
- A visible consent mode before saving any signal.
- A copyable founder review packet.
- Clear separation between product telemetry and personal, spiritual, medical, or ritual scoring.

## What It Does Not Allow

- Hidden analytics.
- Account creation.
- Private profile storage.
- Payment collection.
- Production telemetry authority.
- Cross-project or cross-product measurement.

## Release Note

This release also adds a VedaPath identity context pill to the command shell so every page stays visibly anchored to the VedaPath AI project.
`;

write(dataFile, JSON.stringify(telemetryData, null, 2));
write(docFile, telemetryDoc);
write(pageFile, telemetryHtml);

// Update every root HTML navigation to expose the new room and current badge.
for (const file of readdirSync(".")) {
  if (!file.endsWith(".html")) continue;
  let text = read(file);
  const next = upsertNav(text, file === pageFile ? "Telemetry" : "");
  if (next !== text) write(file, next);
}

// Command shell: release badge, navigation grouping, page title, and project identity pill.
{
  let text = read("assets/vedapath-command-shell.js");
  text = replaceOnce(text, 'const releaseBadge = "v4.2.4 invite";', `const releaseBadge = "${badge}";`, "command shell badge");
  text = replaceOnce(text, '"Promote", "Invite"]', '"Promote", "Invite", "Telemetry"]', "command shell telemetry group");
  text = replaceOnce(text, '"Invite": "Pilot Invite Packet"', `"Invite": "Pilot Invite Packet",\n    "Telemetry": "Pilot Telemetry Consent"`, "command shell page title");
  text = replaceOnce(text, '"pilot-invite-packet-page": "Pilot Invite Packet"', `"pilot-invite-packet-page": "Pilot Invite Packet",\n    "pilot-telemetry-consent-page": "Pilot Telemetry Consent"`, "command shell body title");
  text = replaceOnce(text, '<span>Local command shell</span><strong>Source first. Calm path.</strong>', '<span>VedaPath command shell</span><strong>Source first. Calm path.</strong>', "rail project note");
  text = replaceOnce(
    text,
    '<span class="vp-command-eyebrow">Source-first companion</span>\' +\n        \'<span class="vp-command-badge">\' + releaseBadge + \'</span>\' +',
    '<span class="vp-command-eyebrow">VedaPath AI</span>\' +\n        \'<span class="vp-command-context">Source-first companion</span>\' +\n        \'<span class="vp-command-badge">\' + releaseBadge + \'</span>\' +',
    "command shell context pill"
  );
  write("assets/vedapath-command-shell.js", text);
}

// Command shell visual identity guardrail.
{
  let text = read("assets/vedapath-command-shell.css");
  text = replaceOnce(
    text,
    `.vp-command-eyebrow,
.vp-command-badge,
.vp-command-memory {`,
    `.vp-command-eyebrow,
.vp-command-context,
.vp-command-badge,
.vp-command-memory {`,
    "command shell pill selector"
  );
  text = replaceOnce(
    text,
    `.vp-command-eyebrow {
  color: var(--vp-command-green);
  background: rgba(19, 92, 74, 0.1);
}

.vp-command-badge {`,
    `.vp-command-eyebrow {
  color: #0f473c;
  border: 1px solid rgba(19, 92, 74, 0.22);
  background: rgba(232, 242, 237, 0.96);
}

.vp-command-context {
  color: #6c3a19;
  border: 1px solid rgba(168, 62, 18, 0.16);
  background: rgba(255, 250, 242, 0.82);
}

.vp-command-badge {`,
    "command shell context style"
  );
  write("assets/vedapath-command-shell.css", text);
}

// Pilot readiness renderer: add telemetry consent room.
{
  let text = read("assets/vedapath-pilot-readiness.js");
  const renderer = `
  function renderTelemetryConsent(data) {
    const key = "vedapathPilotTelemetryConsentV425";
    let selectedId = data.consentModes[1].id;
    function mode() {
      return data.consentModes.find(function (item) { return item.id === selectedId; }) || data.consentModes[0];
    }
    function packet(active, note) {
      return ["VedaPath Pilot Telemetry Consent", "Mode: " + active.title, "Allowed: " + active.allowed, "Note: " + note, "Boundary: " + data.boundary].join("\\n");
    }
    function paint() {
      const saved = safeRead(key);
      const active = mode();
      const left = '<span class="pr-eyebrow">Consent mode</span><h2>Choose measurement</h2><div class="pr-list">' + data.consentModes.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-consent-mode="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div><article class="pr-card"><h3>Project context</h3><p>Signals belong to VedaPath AI only. They do not transfer to another product, profile, or account.</p></article>';
      const signals = data.signals.map(function (item, index) {
        return '<label class="pr-check"><input type="checkbox" data-signal-check ' + (index < 2 ? "checked" : "") + '><span>' + escapeHtml(item) + '</span></label>';
      }).join("");
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Telemetry consent</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.promise) + '</p><p><strong>Allowed:</strong> ' + escapeHtml(active.allowed) + '</p><div class="pr-form">' + signals + '</div><label><span class="pr-muted">Visible consent note</span><textarea class="pr-textarea" data-consent-note>' + escapeHtml(data.defaultNote) + '</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-consent type="button">Save Local Consent</button><button class="pr-button green" data-copy-consent type="button">Copy Consent Packet</button><button class="pr-button" data-clear-consent type="button">Clear Local Consent</button></div></article>';
      const side = '<span class="pr-eyebrow green">Privacy gate</span><h2>Before learning</h2><div class="pr-stack">' + data.gates.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local consent</h3><p>' + saved.length + ' consent preview record' + (saved.length === 1 ? "" : "s") + ' saved in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-consent-mode]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-consent-mode");
          paint();
        });
      });
      app.querySelector("[data-save-consent]")?.addEventListener("click", function () {
        if (selectedId !== "no-measurement") {
          saveLocal(key, { mode: active.title, note: app.querySelector("[data-consent-note]")?.value || "", date: new Date().toISOString() }, 8);
        }
        paint();
      });
      app.querySelector("[data-copy-consent]")?.addEventListener("click", function () {
        copyText(packet(active, app.querySelector("[data-consent-note]")?.value || ""));
      });
      app.querySelector("[data-clear-consent]")?.addEventListener("click", function () {
        localStorage.removeItem(key);
        paint();
      });
    }
    paint();
  }

`;
  text = replaceOnce(text, "  const renderers = {", renderer + "  const renderers = {", "telemetry renderer insert");
  text = replaceOnce(text, "    invite: renderInvite", "    invite: renderInvite,\n    telemetryConsent: renderTelemetryConsent", "telemetry renderer map");
  write("assets/vedapath-pilot-readiness.js", text);
}

// Home page: update public-pilot path and add Telemetry as the next step.
{
  let text = read("index.html");
  text = text.replace(/v4\.2\.4 pilot readiness/g, "v4.2.5 pilot consent");
  text = replaceOnce(
    text,
    "Before a wider pilot, VedaPath now checks edition, rights, reviewer identity, answer promotion, and invite language in one calm path.",
    "Before a wider pilot, VedaPath now checks edition, rights, reviewer identity, answer promotion, invite language, and telemetry consent in one calm path.",
    "home pilot readiness copy"
  );
  text = replaceOnce(
    text,
    '<article class="rp-flow-step"><span class="rp-number">5</span><h3>Invite</h3><p>Create a small, honest public pilot invite without accounts or payment.</p><a class="rp-button green" href="pilotinvitepacket.html">Open</a></article>',
    '<article class="rp-flow-step"><span class="rp-number">5</span><h3>Invite</h3><p>Create a small, honest public pilot invite without accounts or payment.</p><a class="rp-button green" href="pilotinvitepacket.html">Open</a></article>\n          <article class="rp-flow-step"><span class="rp-number">6</span><h3>Telemetry</h3><p>Ask for consent before saving any pilot learning signal.</p><a class="rp-button green" href="pilottelemetryconsent.html">Open</a></article>',
    "home telemetry step"
  );
  write("index.html", text);
}

// Build status: current release, phase, notes, next checklist.
{
  let text = read("build-status.html");
  text = replaceOnce(text, "<strong>v4.2.4</strong>\n          <p>Pilot Invite Packet completes the public-pilot readiness chain: edition intake, rights desk, reviewer identity, promotion rules, and a bounded invite packet.</p>", `<strong>${version}</strong>\n          <p>${releaseName} completes the public-pilot readiness chain by placing explicit, local-only consent before any pilot learning signal.</p>`, "build current tile");
  text = replaceOnce(text, "The clickable MVP now has a pilot-readiness layer from source edition intake to invite packet.", "The clickable MVP now has a consent-first pilot-readiness layer from source edition intake to telemetry boundaries.", "build mvp copy");
  text = replaceOnce(text, "The source layer now shows edition posture, rights lanes, reviewer scope, promotion gates, and invite boundaries before public pilot use.", "The source layer now shows edition posture, rights lanes, reviewer scope, promotion gates, invite boundaries, and telemetry consent before public pilot use.", "build vision copy");
  text = replaceOnce(text, "<strong>v4.2.5 Pilot Telemetry Consent</strong>\n          <p>Measure public-pilot learning only after consent, privacy, and local storage boundaries are visible.</p>", "<strong>v4.2.6 Pilot Learning Signal Review</strong>\n          <p>Review only consented pilot-learning signals before any product decision or public claim.</p>", "build next tile");
  text = replaceOnce(
    text,
    `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 384: Pilot Invite Packet</strong>
                <p>Pilot Invite Packet gives the founder a calm, bounded invitation builder for a small public pilot without account, payment, or production promises.</p>
              </div>
              <div class="percent">100%</div>
            </article>`,
    `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 384: Pilot Invite Packet</strong>
                <p>Pilot Invite Packet gives the founder a calm, bounded invitation builder for a small public pilot without account, payment, or production promises.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 385: Pilot Telemetry Consent</strong>
                <p>Pilot Telemetry Consent makes pilot learning opt-in, local-only, visible, and explicitly tied to VedaPath AI.</p>
              </div>
              <div class="percent">100%</div>
            </article>`,
    "build phase 385"
  );
  text = replaceOnce(
    text,
    `<div class="version-row"><span>Release</span><strong>v4.2.4 Pilot Invite Packet</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.2.3 Answer Promotion Rules</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make the public pilot invite clear, bounded, and source-first before telemetry begins.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for pilot telemetry consent design</strong></div>`,
    `<div class="version-row"><span>Release</span><strong>${version} ${releaseName}</strong></div>
          <div class="version-row"><span>Previous</span><strong>v4.2.4 Pilot Invite Packet</strong></div>
          <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
          <div class="version-row"><span>Goal</span><strong>Make pilot learning consent-first, local-only, and visibly VedaPath-specific.</strong></div>
          <div class="version-row"><span>Status</span><strong>Ready for pilot learning signal review</strong></div>`,
    "build version notes"
  );
  text = replaceOnce(
    text,
    `<li><span class="dot"></span><span>Add consent-first pilot telemetry.</span></li>
            <li><span class="dot"></span><span>Track invite path, source family, and feedback without hidden personal data.</span></li>
            <li><span class="dot"></span><span>Preserve edition, rights, reviewer, promotion, and invite boundaries in every pilot measurement.</span></li>`,
    `<li><span class="dot"></span><span>Review consented pilot-learning signals before product decisions.</span></li>
            <li><span class="dot"></span><span>Keep identity, source family, and boundary fields visible in every learning packet.</span></li>
            <li><span class="dot"></span><span>Do not add hidden analytics, personal profiling, or production telemetry yet.</span></li>`,
    "build checklist"
  );
  write("build-status.html", text);
}

// README and changelog.
{
  let text = read("CHANGELOG.md");
  const entry = `## ${version} ${releaseName}
- Changes made: ${releaseName} adds an opt-in, local-only pilot learning consent room, a copyable consent packet, and a VedaPath identity context pill in the command shell so the project stays unmistakably VedaPath before any telemetry begins.
- Files changed: \`${pageFile}\`, \`${dataFile}\`, \`${docFile}\`, \`assets/vedapath-pilot-readiness.js\`, \`assets/vedapath-command-shell.js\`, \`assets/vedapath-command-shell.css\`, \`index.html\`, \`build-status.html\`, \`README.md\`, \`CHANGELOG.md\`, and \`scripts/check-static-links.mjs\`.
- Checks run: Node syntax checks, JSON parse checks, static link check, and browser visual QA.
- Known risks: telemetry remains browser-local prototype state; production analytics, accounts, consent backend, source rights approval, and live AI retrieval remain disabled.

`;
  text = replaceOnce(text, "# Changelog\n\n", "# Changelog\n\n" + entry, "changelog insert");
  write("CHANGELOG.md", text);
}

{
  let text = read("README.md");
  const entry = `## ${version} ${releaseName}
- ${releaseName} asks for explicit local-only pilot learning consent before any signal is saved.
- Primary files: \`${pageFile}\`, \`${dataFile}\`, \`assets/vedapath-pilot-readiness.js\`, \`assets/vedapath-pilot-readiness.css\`.
- Product note: this remains a static GitHub Pages prototype; no hidden analytics, account storage, source rights approval, live AI retrieval, or production telemetry authority is granted.

`;
  text = entry + text;
  write("README.md", text);
}

// Static link checker: include the new page.
{
  let text = read("scripts/check-static-links.mjs");
  if (!text.includes(`"${pageFile}"`)) {
    text = replaceOnce(text, '  "pilotinvitepacket.html",', `  "pilotinvitepacket.html",\n  "${pageFile}",`, "link checker page list");
  }
  write("scripts/check-static-links.mjs", text);
}

console.log(`${version} ${releaseName} applied`);
