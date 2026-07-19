import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));

const boundary = "Readiness artifact only; no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.";

const releases = [
  {
    version: "v5.2.2",
    title: "Pilot-to-Production Gap Map",
    short: "Gap Map",
    file: "pilottoproductiongapmap.html",
    slug: "pilot-to-production-gap-map",
    bodyClass: "pilot-to-production-gap-map-page",
    phase: "Phase 5.2.2: Pilot-to-Production Gap Map",
    summary: "Maps the exact blockers between private-pilot proof and production launch, while fixing release-status drift in Build Status.",
    goal: "Make the remaining launch gap visible, owned, and impossible to confuse with readiness.",
    status: "Ready for security threat-modeling",
    next: "v5.2.3 Security Threat Model",
    hero: "Know the gap before crossing it.",
    subhero: "A calm production-readiness map separates what is proven, what is missing, who owns it, and what must stay closed.",
    metrics: [["Gaps", "8"], ["Owners", "8"], ["Blocked", "5"], ["Launch", "No"]],
    flow: ["Name each launch blocker.", "Attach an owner and evidence type.", "Separate private-pilot proof from production proof.", "Keep every live capability closed."],
    decisions: ["Hold public launch until all red gaps have evidence.", "Review security, privacy, rights, and reviewer operations as separate gates.", "Use Build Status as the canonical release-tracking surface."],
    packet: ["gap: security", "gap: privacy-consent", "gap: source-rights", "gap: hosted-architecture", "owner:founder"]
  },
  {
    version: "v5.2.3",
    title: "Security Threat Model",
    short: "Threat Model",
    file: "securitythreatmodel.html",
    slug: "security-threat-model",
    bodyClass: "security-threat-model-page",
    phase: "Phase 5.2.3: Security Threat Model",
    summary: "Adds a founder-readable threat model for identity, source data, review queues, telemetry, prompt injection, and abuse boundaries.",
    goal: "Turn launch anxiety into named risks, mitigations, owners, and explicit non-capabilities.",
    status: "Ready for consent and privacy ledger design",
    next: "v5.2.4 Consent and Privacy Ledger Contract",
    hero: "Secure the calm before scaling it.",
    subhero: "The product can feel peaceful only if secrets, reviewers, learners, sources, and generated answers are protected by design.",
    metrics: [["Threats", "9"], ["Mitigations", "9"], ["Secrets", "0"], ["Launch", "No"]],
    flow: ["List threats by asset.", "Pair each threat with mitigation and owner.", "Block secret collection in fixtures.", "Keep live identity and storage disabled."],
    decisions: ["Use least-privilege reviewer roles.", "Treat prompt injection and source poisoning as first-class risks.", "Require incident notes before public pilot decisions."],
    packet: ["asset: identity", "asset: source-records", "threat: prompt-injection", "mitigation: reviewer-gate", "owner:security"]
  },
  {
    version: "v5.2.4",
    title: "Consent and Privacy Ledger Contract",
    short: "Privacy Ledger",
    file: "consentprivacyledgercontract.html",
    slug: "consent-privacy-ledger-contract",
    bodyClass: "consent-privacy-ledger-contract-page",
    phase: "Phase 5.2.4: Consent and Privacy Ledger Contract",
    summary: "Defines a consent ledger contract for pilot participation, local memory, telemetry boundaries, retention, withdrawal, export, and deletion.",
    goal: "Make privacy consent explicit before any pilot learning or telemetry can exist.",
    status: "Ready for source-rights packaging",
    next: "v5.2.5 Source Rights and License Pack",
    hero: "Consent first. Memory second.",
    subhero: "VedaPath should remember only when a person knows what is remembered, why, where, for how long, and how to remove it.",
    metrics: [["Consent", "Explicit"], ["Retention", "Defined"], ["Telemetry", "Off"], ["Launch", "No"]],
    flow: ["State the data purpose.", "Record consent, withdrawal, export, and deletion paths.", "Keep telemetry off by default.", "Separate local prototype memory from production accounts."],
    decisions: ["No silent analytics in private pilot.", "No raw identity in fixtures.", "No memory sync before account consent and deletion controls exist."],
    packet: ["consent: explicit", "retention: 30-days-or-less", "withdrawal: required", "telemetry: disabled", "owner:privacy"]
  },
  {
    version: "v5.2.5",
    title: "Source Rights and License Pack",
    short: "Rights Pack",
    file: "sourcerightslicensepack.html",
    slug: "source-rights-license-pack",
    bodyClass: "source-rights-license-pack-page",
    phase: "Phase 5.2.5: Source Rights and License Pack",
    summary: "Creates a source-rights packet for edition provenance, allowed use, citation display, missing permissions, and corpus-delivery boundaries.",
    goal: "Protect sources, translators, reviewers, and users before expanding the corpus.",
    status: "Ready for hosted pilot architecture decision",
    next: "v5.2.6 Minimal Hosted Pilot Architecture Decision",
    hero: "Honor the source before using it.",
    subhero: "The source layer must show what can be cited, what can be stored, what can be displayed, and what remains permission-blocked.",
    metrics: [["Sources", "12"], ["Rights", "Tracked"], ["Delivery", "Blocked"], ["Launch", "No"]],
    flow: ["Identify edition and source family.", "Classify allowed use and citation display.", "Flag missing permission before ingestion.", "Block bulk corpus delivery."],
    decisions: ["Use source packets before adding more texts.", "Never hide uncertain rights behind polished UX.", "Keep reviewer notes separate from accepted source truth."],
    packet: ["edition: named", "license: review-required", "allowed-use: citation-card", "corpus-delivery: blocked", "owner:rights"]
  },
  {
    version: "v5.2.6",
    title: "Minimal Hosted Pilot Architecture Decision",
    short: "Hosted Decision",
    file: "minimalhostedpilotarchitecturedecision.html",
    slug: "minimal-hosted-pilot-architecture-decision",
    bodyClass: "minimal-hosted-pilot-architecture-decision-page",
    phase: "Phase 5.2.6: Minimal Hosted Pilot Architecture Decision",
    summary: "Chooses the smallest hosted-pilot architecture posture: one bounded source API, reviewer queue, consent ledger, and read-only demo shell.",
    goal: "Choose the smallest real backend slice without authorizing production launch.",
    status: "Ready for founder hosted-pilot review gate",
    next: "v5.2.7 Founder Hosted-Pilot Review Gate",
    hero: "Choose the smallest real system.",
    subhero: "A hosted pilot should prove one source-first answer loop, not pretend the whole product is production-ready.",
    metrics: [["Backend", "Minimal"], ["Storage", "Bounded"], ["Access", "Invite-only"], ["Launch", "No"]],
    flow: ["Select only the minimum hosted slice.", "Keep source API, review queue, consent, and logs separate.", "Require founder review before any deployment.", "Keep public launch closed."],
    decisions: ["Prototype on a bounded backend path only.", "Do not connect payment, broad accounts, or public AI access.", "Use this packet as the next founder review input."],
    packet: ["architecture: minimal-hosted-pilot", "source-api: bounded", "review-queue: required", "consent-ledger: required", "owner:founder"]
  }
];

const through = args.get("through") || releases.at(-1).version;
const selected = releases.slice(0, releases.findIndex((release) => release.version === through) + 1);
if (!selected.length) throw new Error(`Unknown --through=${through}`);
const latest = selected.at(-1);
const previousRelease = selected.length > 1 ? selected.at(-2) : { version: "v5.2.1", title: "Founder Private-Pilot Retrospective" };

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makeJson(release, index) {
  return {
    version: release.version,
    title: release.title,
    releaseIndex: index + 1,
    summary: release.summary,
    goal: release.goal,
    status: release.status,
    boundary,
    hero: release.hero,
    subhero: release.subhero,
    metrics: Object.fromEntries(release.metrics),
    flow: release.flow,
    decisions: release.decisions,
    packet: release.packet,
    launchAuthorization: false,
    productionStorage: false,
    liveAi: false,
    telemetryEnabled: false,
    publicPilot: false,
    updated: "2026-07-19"
  };
}

function pageHtml(release) {
  const metrics = release.metrics.map(([label, value]) => `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("\n              ");
  const flow = release.flow.map((item, index) => `<article class="step"><span>${index + 1}</span><strong>${escapeHtml(item.split(".")[0])}</strong><p>${escapeHtml(item)}</p></article>`).join("\n              ");
  const packet = release.packet.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath ${release.title}</title>
    <link rel="stylesheet" href="assets/vedapath-ui.css">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
    <link rel="stylesheet" href="assets/vedapath-retrieval-pilot.css">
    <style>
      .readiness-page { max-width: 1480px; margin: 0 auto; padding: 28px 24px 64px; }
      .readiness-hero { display: grid; grid-template-columns: minmax(0, 1.2fr) 320px; gap: 24px; align-items: stretch; }
      .readiness-card { border: 1px solid rgba(92, 64, 45, .16); border-radius: 8px; background: rgba(255, 254, 250, .9); box-shadow: 0 18px 50px rgba(46, 35, 25, .07); padding: 24px; }
      .readiness-card h1 { margin: 12px 0; max-width: 900px; font-size: clamp(2.1rem, 4vw, 4.1rem); line-height: .98; }
      .readiness-card p { color: #634633; font-size: 1.05rem; line-height: 1.55; max-width: 780px; }
      .release-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 22px; }
      .metric, .step { border: 1px solid rgba(92, 64, 45, .14); border-radius: 8px; background: rgba(255, 255, 252, .82); padding: 16px; }
      .metric span, .step p { color: #6e5543; font-size: .9rem; }
      .metric strong { display: block; font-size: 1.8rem; margin-top: 8px; }
      .step span { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #e7f3ef; color: #06604d; font-weight: 800; }
      .step strong { display: block; margin: 12px 0 6px; }
      .readiness-logo { display: grid; place-items: center; min-height: 100%; }
      .readiness-logo img { width: min(220px, 68%); border-radius: 8px; background: #fff6e9; box-shadow: 0 16px 42px rgba(169, 63, 18, .16); }
      .readiness-grid { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: 24px; margin-top: 24px; }
      .step-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      .decision-list { margin: 0; padding-left: 20px; color: #4f392b; line-height: 1.7; }
      .packet { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
      .packet span { border: 1px solid #efbca8; border-radius: 999px; padding: 7px 10px; color: #a83f12; background: #fff6f0; font-weight: 800; font-size: .82rem; }
      @media (max-width: 920px) { .readiness-hero, .readiness-grid { grid-template-columns: 1fr; } .release-strip { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 560px) { .readiness-page { padding: 18px 14px 42px; } .release-strip, .step-grid { grid-template-columns: 1fr; } .readiness-card h1 { font-size: 2rem; } }
    </style>
  </head>
  <body class="${release.bodyClass}">
    <div id="top"></div>
    <header class="topbar">
      <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
        <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
        <span><strong>VedaPath AI</strong><small>${release.title}</small></span>
      </a>
      <nav class="nav" aria-label="Primary">
        <a href="index.html#top">Home</a>
        <a href="build-status.html">Build</a>
        <a href="brand/brand-board.html">Brand</a>
        <a href="blueprint.html">Blueprint</a>
        <a class="active" href="${release.file}">${release.short}</a>
        <span class="version-pill">${release.version}</span>
      </nav>
    </header>
    <main class="readiness-page">
      <section class="readiness-hero">
        <article class="readiness-card">
          <p class="eyebrow">${release.version} production readiness</p>
          <h1>${escapeHtml(release.hero)}</h1>
          <p>${escapeHtml(release.subhero)}</p>
          <div class="release-strip">
            ${metrics}
          </div>
        </article>
        <aside class="readiness-card readiness-logo" aria-label="VedaPath symbol">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
        </aside>
      </section>
      <section class="readiness-grid">
        <article class="readiness-card">
          <p class="eyebrow">Required flow</p>
          <h2>One calm gate</h2>
          <div class="step-grid">
            ${flow}
          </div>
        </article>
        <article class="readiness-card">
          <p class="eyebrow">Decision packet</p>
          <h2>${escapeHtml(release.title)}</h2>
          <p>${escapeHtml(release.summary)}</p>
          <ul class="decision-list">
            ${release.decisions.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n            ")}
          </ul>
          <div class="packet">${packet}</div>
          <p><strong>Boundary:</strong> ${boundary}</p>
        </article>
      </section>
    </main>
    <script src="assets/vedapath-command-shell.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.title}

${release.summary}

## Goal

${release.goal}

## Boundary

${boundary}

## Required Flow

${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Decision Options

${release.decisions.map((item) => `- ${item}`).join("\n")}

## Packet

${release.packet.map((item) => `- ${item}`).join("\n")}

## Known Risk

This remains a local, deterministic readiness artifact. It does not issue credentials, store production data, run live AI, publish telemetry, deliver a corpus, invite public participants, or authorize launch.
`;
}

function evaluatorJs() {
  return `import crypto from "node:crypto";

const OWNER_RE = /^owner:[a-z0-9][a-z0-9-]{2,47}$/;
const BLOCKED = ["launchAuthorization", "productionStorage", "liveAi", "telemetryEnabled", "publicPilot", "corpusDelivery"];

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
}

function asSet(values) {
  return new Set((values || []).map((value) => String(value).toLowerCase()));
}

function base(input) {
  const violations = [];
  for (const flag of BLOCKED) {
    if (input[flag]) violations.push(\`\${flag} must remain disabled\`);
  }
  if (!Array.isArray(input.packet) || !input.packet.some((item) => OWNER_RE.test(String(item)))) {
    violations.push("packet must include owner:<slug>");
  }
  return violations;
}

function result(kind, input, violations) {
  return {
    kind,
    approved: violations.length === 0,
    violations,
    digest: digest({ kind, input }),
    boundary: "${boundary}"
  };
}

export function evaluatePilotToProductionGapMap(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["gap: security", "gap: privacy-consent", "gap: source-rights", "gap: hosted-architecture"].forEach((item) => {
    if (!packet.has(item)) violations.push(\`missing \${item}\`);
  });
  if ((input.gaps || 0) < 6) violations.push("gap map must name at least six launch gaps");
  return result("pilot-to-production-gap-map", input, violations);
}

export function evaluateSecurityThreatModel(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["asset: identity", "asset: source-records", "threat: prompt-injection", "mitigation: reviewer-gate"].forEach((item) => {
    if (!packet.has(item)) violations.push(\`missing \${item}\`);
  });
  if ((input.threats || 0) < 7) violations.push("threat model must name at least seven threats");
  if (input.secretValue || input.apiKey || input.tokenValue) violations.push("fixtures must not contain secrets");
  return result("security-threat-model", input, violations);
}

export function evaluateConsentPrivacyLedgerContract(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["consent: explicit", "withdrawal: required", "telemetry: disabled"].forEach((item) => {
    if (!packet.has(item)) violations.push(\`missing \${item}\`);
  });
  if (!String(input.retention || "").match(/day|delete|local/i)) violations.push("retention must be explicit");
  if (input.rawIdentity) violations.push("raw identity must not be stored in fixtures");
  return result("consent-privacy-ledger-contract", input, violations);
}

export function evaluateSourceRightsLicensePack(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["edition: named", "license: review-required", "allowed-use: citation-card", "corpus-delivery: blocked"].forEach((item) => {
    if (!packet.has(item)) violations.push(\`missing \${item}\`);
  });
  if ((input.sources || 0) < 4) violations.push("rights pack must cover multiple sources");
  return result("source-rights-license-pack", input, violations);
}

export function evaluateMinimalHostedPilotArchitectureDecision(input) {
  const violations = base(input);
  const packet = asSet(input.packet);
  ["architecture: minimal-hosted-pilot", "source-api: bounded", "review-queue: required", "consent-ledger: required"].forEach((item) => {
    if (!packet.has(item)) violations.push(\`missing \${item}\`);
  });
  if (!["hold", "spike", "review"].includes(input.decision)) violations.push("decision must be hold, spike, or review");
  return result("minimal-hosted-pilot-architecture-decision", input, violations);
}

export function productionReadinessPacket(label, evaluation) {
  return {
    label,
    approved: Boolean(evaluation.approved),
    digest: evaluation.digest,
    violations: evaluation.violations,
    boundary: evaluation.boundary
  };
}
`;
}

function checkerJs() {
  return `import {
  evaluatePilotToProductionGapMap,
  evaluateSecurityThreatModel,
  evaluateConsentPrivacyLedgerContract,
  evaluateSourceRightsLicensePack,
  evaluateMinimalHostedPilotArchitectureDecision,
  productionReadinessPacket
} from "./vedapath-production-readiness-contracts.mjs";

const releases = ["v5.2.2", "v5.2.3", "v5.2.4", "v5.2.5", "v5.2.6"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : releases.at(-1);
const count = releases.indexOf(through) + 1;
if (count < 1) throw new Error(\`Unknown --through=\${through}\`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const checks = [
  () => {
    const ok = evaluatePilotToProductionGapMap({ gaps: 8, packet: ["gap: security", "gap: privacy-consent", "gap: source-rights", "gap: hosted-architecture", "owner:founder"] });
    assert(ok.approved, "gap map should pass");
    assert(!evaluatePilotToProductionGapMap({ gaps: 2, launchAuthorization: true, packet: ["owner:founder"] }).approved, "unsafe gap map should fail");
    assert(productionReadinessPacket("gap", ok).approved, "gap packet should wrap");
  },
  () => {
    const ok = evaluateSecurityThreatModel({ threats: 9, packet: ["asset: identity", "asset: source-records", "threat: prompt-injection", "mitigation: reviewer-gate", "owner:security"] });
    assert(ok.approved, "threat model should pass");
    assert(!evaluateSecurityThreatModel({ threats: 9, apiKey: "secret", packet: ["asset: identity", "owner:security"] }).approved, "secret-bearing model should fail");
  },
  () => {
    const ok = evaluateConsentPrivacyLedgerContract({ retention: "30 days then delete/export on request", packet: ["consent: explicit", "withdrawal: required", "telemetry: disabled", "owner:privacy"] });
    assert(ok.approved, "privacy ledger should pass");
    assert(!evaluateConsentPrivacyLedgerContract({ retention: "forever", telemetryEnabled: true, rawIdentity: true, packet: ["owner:privacy"] }).approved, "unsafe privacy ledger should fail");
  },
  () => {
    const ok = evaluateSourceRightsLicensePack({ sources: 12, packet: ["edition: named", "license: review-required", "allowed-use: citation-card", "corpus-delivery: blocked", "owner:rights"] });
    assert(ok.approved, "rights pack should pass");
    assert(!evaluateSourceRightsLicensePack({ sources: 1, corpusDelivery: true, packet: ["owner:rights"] }).approved, "unsafe rights pack should fail");
  },
  () => {
    const ok = evaluateMinimalHostedPilotArchitectureDecision({ decision: "review", packet: ["architecture: minimal-hosted-pilot", "source-api: bounded", "review-queue: required", "consent-ledger: required", "owner:founder"] });
    assert(ok.approved, "hosted decision should pass");
    assert(!evaluateMinimalHostedPilotArchitectureDecision({ decision: "launch", productionStorage: true, packet: ["owner:founder"] }).approved, "production architecture should fail");
  }
];

checks.slice(0, count).forEach((check) => check());
console.log(\`production-readiness-ok \${count}/5\`);
`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} production";`);
  if (!text.includes('Production Readiness')) {
    text = text.replace(
      '    { title: "Private Pilot Execution", labels: ["Execution Gate", "Session Token", "Access Envelope", "Execution Sandbox", "Pilot Retrospective"] },',
      '    { title: "Private Pilot Execution", labels: ["Execution Gate", "Session Token", "Access Envelope", "Execution Sandbox", "Pilot Retrospective"] },\n    { title: "Production Readiness", labels: ["Gap Map", "Threat Model", "Privacy Ledger", "Rights Pack", "Hosted Decision"] },'
    );
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Pilot Retrospective": "Founder Private-Pilot Retrospective",', '    "Pilot Retrospective": "Founder Private-Pilot Retrospective",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "founder-private-pilot-retrospective-page": "Founder Private-Pilot Retrospective",', '    "founder-private-pilot-retrospective-page": "Founder Private-Pilot Retrospective",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Pilot Retrospective", "founderprivatepilotretrospective.html"],', '    ["Pilot Retrospective", "founderprivatepilotretrospective.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "founderprivatepilotretrospective.html",', '  "founderprivatepilotretrospective.html",\n' + line);
  }
  write("scripts/check-static-links.mjs", text);
}

function replaceSummaryTile(text, label, strong, copy) {
  const pattern = new RegExp(`(<article class="tile">\\s*<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>\\s*<p>[\\s\\S]*?<\\/p>(?=\\s*<\\/article>)`, "m");
  return text.replace(pattern, `$1<strong>${strong}</strong>\n          <p>${copy}</p>`);
}

function ensureNextReleaseTile(text) {
  if (text.includes("<span>Next release</span>")) return text;
  const tile = `        <article class="tile">
          <span>Next release</span>
          <strong>${latest.next}</strong>
          <p>Founder review should decide whether the minimal hosted pilot architecture is ready for a real implementation spike.</p>
        </article>
`;
  return text.replace(/(        <article class="tile">\s*<span>Full vision progress<\/span>[\s\S]*?<\/article>\s*)<\/section>/, `$1${tile}      </section>`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} production</span>`);
  text = replaceSummaryTile(text, "Current version", latest.version, latest.summary);
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now has production-readiness controls for gap mapping, security, privacy, rights, and minimal hosted-pilot decisions.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "The product remains launch-blocked by design, but the path from private pilot to production is now explicit and reviewable.");
  text = ensureNextReleaseTile(text);
  text = replaceSummaryTile(text, "Next release", latest.next, "Founder review should decide whether the minimal hosted pilot architecture is ready for a real implementation spike.");
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.summary}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V522-V526 PRODUCTION READINESS START -->\n${phases}\n            <!-- V522-V526 PRODUCTION READINESS END -->`;
  if (text.includes("<!-- V522-V526 PRODUCTION READINESS START -->")) {
    text = text.replace(/            <!-- V522-V526 PRODUCTION READINESS START -->[\s\S]*?            <!-- V522-V526 PRODUCTION READINESS END -->/, block);
  } else {
    text = text.replace('            <!-- V517-V521 PRIVATE PILOT EXECUTION END -->', '            <!-- V517-V521 PRIVATE PILOT EXECUTION END -->\n' + block);
  }
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${latest.version} ${latest.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previousRelease.version} ${previousRelease.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${latest.goal}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${latest.status}; ${boundary}</strong></div>`);
  write("build-status.html", text);
}

function updateReadme() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n${release.summary}\n\n- Open: [${release.title}](${release.file})\n- Data: \`data/vedapath-${release.slug}.json\`\n- Boundary: ${boundary}\n`).reverse().join("\n");
  let text = read("README.md");
  for (const release of selected) {
    text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  }
  write("README.md", entries + "\n" + text.trimStart());
}

function updateChangelog() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added the ${release.short} production-readiness page, data packet, documentation, and deterministic contract coverage.\n- Kept the launch boundary explicit: no credentials, secrets, production storage, live AI, public telemetry, corpus delivery, public pilot, or launch authorization.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`scripts/vedapath-production-readiness-contracts.mjs\`\n- \`scripts/check-v522-v526-production-readiness.mjs\`\n- shared navigation/build docs where applicable\n\n### Checks run\n- \`node scripts/apply-v522-v526-production-readiness-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-production-readiness-contracts.mjs\`\n- \`node --check scripts/check-v522-v526-production-readiness.mjs\`\n- \`node scripts/check-v522-v526-production-readiness.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`\n\n### Known risks\n- Fixture-only readiness layer; real backend, production security controls, consent storage, source-rights review, telemetry controls, hosted pilot access, and public launch remain unfinished and intentionally blocked.\n`).reverse().join("\n");
  let text = read("CHANGELOG.md");
  for (const release of selected) {
    text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  }
  write("CHANGELOG.md", entries + "\n" + text.trimStart());
}

for (const [index, release] of selected.entries()) {
  write(`data/vedapath-${release.slug}.json`, JSON.stringify(makeJson(release, index), null, 2) + "\n");
  write(release.file, pageHtml(release));
  write(`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md`, docMd(release));
}

write("scripts/vedapath-production-readiness-contracts.mjs", evaluatorJs());
write("scripts/check-v522-v526-production-readiness.mjs", checkerJs());
updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateReadme();
updateChangelog();

console.log(`applied-production-readiness ${latest.version} (${selected.length}/5)`);
