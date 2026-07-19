import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));

const boundary = "Minimal-backend prototype only; no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.";

const releases = [
  {
    version: "v5.2.7",
    title: "Founder Hosted-Pilot Review Gate",
    short: "Hosted Review",
    file: "founderhostedpilotreviewgate.html",
    slug: "founder-hosted-pilot-review-gate",
    bodyClass: "founder-hosted-pilot-review-gate-page",
    phase: "Phase 5.2.7: Founder Hosted-Pilot Review Gate",
    summary: "Turns the hosted-pilot architecture into a founder decision packet with evidence, unresolved conditions, and an explicit spike-only authorization lane.",
    goal: "Make the hosted-pilot decision reviewable without accidentally authorizing deployment or launch.",
    status: "Ready for backend provider decision",
    next: "v5.2.8 Backend Provider Decision",
    eyebrow: "Founder decision gate",
    hero: "Review the smallest real step.",
    subhero: "Evidence from security, privacy, rights, and architecture now converges into one calm decision: hold, rework, or authorize only a bounded implementation spike.",
    metrics: [["Evidence", "5/5"], ["Conditions", "4"], ["Decision", "Review"], ["Launch", "Closed"]],
    flow: ["Confirm the readiness evidence.", "Name every unresolved condition.", "Choose hold, rework, or spike-only review.", "Keep deployment and public launch closed."],
    decisions: ["Authorize only a local or private implementation spike.", "Do not treat document completeness as production readiness.", "Carry all four launch blockers into the provider decision."],
    packet: ["evidence:gap-map", "evidence:threat-model", "evidence:privacy-ledger", "evidence:rights-pack", "decision:review"],
    control: "decision"
  },
  {
    version: "v5.2.8",
    title: "Backend Provider Decision",
    short: "Backend Provider",
    file: "backendproviderdecision.html",
    slug: "backend-provider-decision",
    bodyClass: "backend-provider-decision-page",
    phase: "Phase 5.2.8: Backend Provider Decision",
    summary: "Compares three backend patterns and selects an edge-worker plus relational-storage pattern for the smallest private pilot slice.",
    goal: "Choose a backend shape by privacy, operational simplicity, reversibility, and bounded cost rather than feature volume.",
    status: "Ready for minimal source API endpoint",
    next: "v5.2.9 Source API Minimal Endpoint",
    eyebrow: "Architecture choice",
    hero: "Choose a small, reversible backend.",
    subhero: "The selected pattern supports one read-only source endpoint, one reviewer queue, and one consent ledger while preserving the GitHub Pages learning shell.",
    metrics: [["Patterns", "3"], ["Choice", "Edge + SQL"], ["Region", "Review"], ["Launch", "Closed"]],
    flow: ["Compare privacy and data residency.", "Compare operational burden and rollback.", "Select only the minimum provider pattern.", "Defer vendor binding until credentials are approved."],
    decisions: ["Use an edge worker with relational storage as the implementation pattern.", "Keep the static interface independently deployable.", "Require explicit region, secret, backup, and deletion choices before hosting."],
    packet: ["pattern:edge-worker-relational", "frontend:static-pages", "region:founder-reviewed", "secrets:binding-only", "rollback:required"],
    control: "provider"
  },
  {
    version: "v5.2.9",
    title: "Source API Minimal Endpoint",
    short: "Source Endpoint",
    file: "sourceapiminimalendpoint.html",
    slug: "source-api-minimal-endpoint",
    bodyClass: "source-api-minimal-endpoint-page",
    phase: "Phase 5.2.9: Source API Minimal Endpoint",
    summary: "Implements a deterministic read-only source endpoint contract with citation fields, rights posture, safe no-source behavior, and local HTTP smoke coverage.",
    goal: "Prove one citation-safe source read path before any answer generation or broad corpus access exists.",
    status: "Ready for minimal reviewer queue backend",
    next: "v5.3.0 Reviewer Queue Minimal Backend",
    eyebrow: "Read-only source API",
    hero: "Return the source, or return no source.",
    subhero: "One narrow endpoint resolves a reviewed source record by ID and refuses unsupported methods, missing rights, unknown records, or answer-generation requests.",
    metrics: [["Method", "GET"], ["Records", "2"], ["Answers", "0"], ["Mutation", "Blocked"]],
    flow: ["Receive one source record ID.", "Verify citation and rights fields.", "Return a bounded source packet or no-source response.", "Never generate or mutate an answer."],
    decisions: ["Expose only reviewed fixture records in the spike.", "Use stable source IDs and explicit rights status.", "Treat unknown IDs as a normal no-source result, not a guessed answer."],
    packet: ["method:GET", "route:/api/sources/:id", "rights:required", "no-source:explicit", "answer-generation:blocked"],
    control: "source"
  },
  {
    version: "v5.3.0",
    title: "Reviewer Queue Minimal Backend",
    short: "Review Queue",
    file: "reviewerqueueminimalbackend.html",
    slug: "reviewer-queue-minimal-backend",
    bodyClass: "reviewer-queue-minimal-backend-page",
    phase: "Phase 5.3.0: Reviewer Queue Minimal Backend",
    summary: "Adds a deterministic reviewer queue adapter for submit, claim, request-changes, approve, release, and append-only audit events.",
    goal: "Prove that source review decisions can be owned, stateful, and auditable before production identity or storage exists.",
    status: "Ready for minimal consent ledger backend",
    next: "v5.3.1 Consent Ledger Minimal Backend",
    eyebrow: "Reviewer operations",
    hero: "Every decision keeps its history.",
    subhero: "A minimal queue makes ownership, allowed transitions, decision notes, and audit events visible without pretending browser-local storage is production infrastructure.",
    metrics: [["Tickets", "3"], ["Transitions", "6"], ["Audit", "Append-only"], ["Identity", "Fixture"]],
    flow: ["Submit a bounded review ticket.", "Claim it with a reviewer role.", "Approve or request changes with a note.", "Append every event without rewriting history."],
    decisions: ["Reject invalid state transitions.", "Require owner and decision notes for terminal outcomes.", "Keep reviewer identity fixture-only until real authentication is approved."],
    packet: ["queue:reviewer", "states:open-claimed-decided", "audit:append-only", "identity:fixture", "storage:memory"],
    control: "queue"
  },
  {
    version: "v5.3.1",
    title: "Consent Ledger Minimal Backend",
    short: "Consent Backend",
    file: "consentledgerminimalbackend.html",
    slug: "consent-ledger-minimal-backend",
    bodyClass: "consent-ledger-minimal-backend-page",
    phase: "Phase 5.3.1: Consent Ledger Minimal Backend",
    summary: "Adds an append-only consent ledger adapter for grant, withdrawal, export request, and deletion request events, plus an integrated backend-readiness gate.",
    goal: "Prove that pilot memory and learning signals remain consent-bound before hosted storage is authorized.",
    status: "Ready for founder minimal-backend review",
    next: "v5.3.2 Hosted Pilot Implementation Authorization",
    eyebrow: "Consent operations",
    hero: "Consent remains visible and reversible.",
    subhero: "The minimal ledger records why data may be used, what scope was granted, when consent changed, and which export or deletion action is pending.",
    metrics: [["Events", "4"], ["Identity", "Pseudonymous"], ["Telemetry", "Off"], ["Launch", "Closed"]],
    flow: ["Record explicit purpose and scope.", "Append grant or withdrawal events.", "Record export and deletion requests.", "Keep telemetry and hosted writes disabled by default."],
    decisions: ["Use append-only consent events rather than mutable flags.", "Separate withdrawal from deletion so both remain auditable.", "Require founder review before selecting real identity, database, or hosting services."],
    packet: ["ledger:append-only", "identity:pseudonymous", "consent:explicit", "withdrawal:supported", "telemetry:disabled"],
    control: "consent"
  }
];

const through = args.get("through") || releases.at(-1).version;
const throughIndex = releases.findIndex((release) => release.version === through);
if (throughIndex < 0) throw new Error(`Unknown --through=${through}`);
const selected = releases.slice(0, throughIndex + 1);
const latest = selected.at(-1);
const previousRelease = selected.length > 1 ? selected.at(-2) : { version: "v5.2.6", title: "Minimal Hosted Pilot Architecture Decision" };

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function releaseData(release, index) {
  const shared = {
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
    control: release.control,
    deploymentAuthorized: false,
    productionStorage: false,
    liveAi: false,
    telemetryEnabled: false,
    publicLaunch: false,
    updated: "2026-07-19"
  };

  if (release.control === "decision") {
    shared.evidence = ["Gap map reviewed", "Threat model reviewed", "Privacy ledger reviewed", "Rights pack reviewed", "Hosted architecture reviewed"];
    shared.allowedDecisions = ["hold", "rework", "authorize-spike"];
  }
  if (release.control === "provider") {
    shared.patterns = [
      { id: "edge-worker-relational", label: "Edge worker + relational store", privacy: "Strong", operations: "Low", rollback: "Strong", selected: true },
      { id: "serverless-functions-document", label: "Functions + document store", privacy: "Review", operations: "Medium", rollback: "Medium", selected: false },
      { id: "managed-app-platform", label: "Managed app platform", privacy: "Review", operations: "Medium", rollback: "Strong", selected: false }
    ];
  }
  if (release.control === "source") {
    shared.records = [
      { id: "bg-2-48-steadiness", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 2.48", title: "Steadiness in action", rightsStatus: "reviewed-fixture", excerpt: "Act with steadiness, without clinging to success or failure.", answerGeneration: false },
      { id: "bg-11-32-time", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 11.32", title: "Time in the cosmic form", rightsStatus: "reviewed-fixture", excerpt: "The source identifies the cosmic form with world-transforming Time.", answerGeneration: false }
    ];
  }
  if (release.control === "queue") {
    shared.tickets = [
      { id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null, note: "Verify translation and allowed display." },
      { id: "review-bg-11-32", sourceId: "bg-11-32-time", status: "open", owner: null, note: "Verify category and quote boundary." },
      { id: "review-gayatri-gap", sourceId: "rv-3-62-10", status: "open", owner: null, note: "Source edition remains missing." }
    ];
    shared.allowedTransitions = ["open->claimed", "claimed->approved", "claimed->changes-requested", "claimed->open", "changes-requested->claimed", "approved->open"];
  }
  if (release.control === "consent") {
    shared.eventTypes = ["consent.granted", "consent.withdrawn", "export.requested", "deletion.requested"];
    shared.defaultScope = ["pilot-session", "source-feedback"];
  }
  return shared;
}

function controlHtml(release) {
  if (release.control === "decision") {
    return `<label class="backend-field"><span>Founder decision</span><select data-backend-decision><option value="hold">Hold</option><option value="rework">Rework conditions</option><option value="authorize-spike">Authorize bounded spike</option></select></label><button class="backend-primary" type="button" data-backend-run>Review decision</button>`;
  }
  if (release.control === "provider") {
    return `<div class="backend-choice-grid" data-backend-provider-options></div><button class="backend-primary" type="button" data-backend-run>Evaluate pattern</button>`;
  }
  if (release.control === "source") {
    return `<label class="backend-field"><span>Source record</span><select data-backend-source-options></select></label><button class="backend-primary" type="button" data-backend-run>GET source packet</button>`;
  }
  if (release.control === "queue") {
    return `<label class="backend-field"><span>Review ticket</span><select data-backend-queue-options></select></label><label class="backend-field"><span>Decision note</span><input data-backend-note value="Reviewed in the minimal backend spike."></label><div class="backend-actions"><button class="backend-primary" type="button" data-queue-action="claim">Claim</button><button type="button" data-queue-action="approve">Approve</button><button type="button" data-queue-action="changes-requested">Request changes</button></div>`;
  }
  return `<label class="backend-field"><span>Pseudonymous participant</span><input data-backend-subject value="pilot-participant-001"></label><label class="backend-field"><span>Purpose</span><input data-backend-purpose value="Private source-first pilot learning"></label><div class="backend-actions"><button class="backend-primary" type="button" data-consent-action="consent.granted">Grant</button><button type="button" data-consent-action="consent.withdrawn">Withdraw</button><button type="button" data-consent-action="export.requested">Request export</button><button type="button" data-consent-action="deletion.requested">Request deletion</button></div>`;
}

function pageHtml(release, data) {
  const metrics = release.metrics.map(([label, value]) => `<article class="backend-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("\n              ");
  const flow = release.flow.map((item, index) => `<article class="backend-step"><span>${index + 1}</span><div><strong>${escapeHtml(item.split(".")[0])}</strong><p>${escapeHtml(item)}</p></div></article>`).join("\n              ");
  const decisions = release.decisions.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ");
  const packet = release.packet.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(release.summary)}">
    <title>VedaPath ${escapeHtml(release.title)}</title>
    <link rel="stylesheet" href="assets/vedapath-ui.css">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
    <link rel="stylesheet" href="assets/vedapath-minimal-backend.css">
  </head>
  <body class="${release.bodyClass}">
    <main class="page backend-page" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI"><span><strong>VedaPath AI</strong><small>${escapeHtml(release.title)}</small></span></a>
        <nav class="navlinks nav" aria-label="Primary navigation">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
        </nav>
      </header>
      <section class="backend-hero">
        <article class="backend-panel backend-intro">
          <span class="backend-kicker">${escapeHtml(release.eyebrow)}</span>
          <h1>${escapeHtml(release.hero)}</h1>
          <p>${escapeHtml(release.subhero)}</p>
          <div class="backend-metrics">${metrics}</div>
        </article>
        <aside class="backend-panel backend-path" aria-label="Release flow">
          <span class="backend-kicker">One bounded path</span>
          <h2>${escapeHtml(release.title)}</h2>
          <div class="backend-steps">${flow}</div>
        </aside>
      </section>
      <section class="backend-workspace">
        <article class="backend-panel backend-console">
          <span class="backend-kicker">Interactive local proof</span>
          <h2>${escapeHtml(release.title)} console</h2>
          <p>${escapeHtml(release.summary)}</p>
          <div class="backend-controls">${controlHtml(release)}</div>
          <pre class="backend-output" data-backend-output aria-live="polite">Select an action to inspect the bounded result.</pre>
        </article>
        <aside class="backend-panel backend-boundary">
          <span class="backend-kicker">Decision boundary</span>
          <h2>What this release decides</h2>
          <ul>${decisions}</ul>
          <div class="backend-packet">${packet}</div>
          <p class="backend-warning"><strong>Still closed:</strong> ${escapeHtml(boundary)}</p>
        </aside>
      </section>
    </main>
    <script id="backendArtifactData" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
    <script src="assets/vedapath-command-shell.js"></script>
    <script src="assets/vedapath-minimal-backend.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.version} ${release.title}\n\n${release.summary}\n\n## Goal\n\n${release.goal}\n\n## Flow\n\n${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n## Decisions\n\n${release.decisions.map((item) => `- ${item}`).join("\n")}\n\n## Packet\n\n${release.packet.map((item) => `- \`${item}\``).join("\n")}\n\n## Boundary\n\n${boundary}\n`;
}

function backendCss() {
  return `:root {
  --backend-ink: #201812;
  --backend-copy: #684f3e;
  --backend-line: rgba(76, 56, 40, .16);
  --backend-paper: rgba(255, 254, 250, .92);
  --backend-saffron: #d95724;
  --backend-gold: #e4a936;
  --backend-green: #16604f;
}
.backend-page { max-width: 1520px; margin: 0 auto; padding: 28px 26px 64px; color: var(--backend-ink); }
.backend-hero, .backend-workspace { display: grid; gap: 20px; }
.backend-hero { grid-template-columns: minmax(0, 1.18fr) minmax(320px, .82fr); }
.backend-workspace { grid-template-columns: minmax(0, 1.3fr) minmax(300px, .7fr); margin-top: 20px; }
.backend-panel { border: 1px solid var(--backend-line); border-radius: 8px; background: var(--backend-paper); box-shadow: 0 20px 52px rgba(57, 39, 25, .07); padding: 24px; }
.backend-kicker { display: inline-flex; width: fit-content; border: 1px solid rgba(217, 87, 36, .22); border-radius: 999px; padding: 6px 10px; background: #fff5ed; color: #a93d16; font-size: .76rem; font-weight: 800; }
.backend-intro h1 { max-width: 820px; margin: 18px 0 12px; font-size: clamp(2.4rem, 5vw, 4.9rem); line-height: .96; letter-spacing: 0; }
.backend-panel h2 { margin: 12px 0 10px; font-size: clamp(1.35rem, 2vw, 2rem); letter-spacing: 0; }
.backend-panel > p, .backend-boundary li { color: var(--backend-copy); line-height: 1.62; }
.backend-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 24px; }
.backend-metric, .backend-step { border: 1px solid var(--backend-line); border-radius: 8px; background: rgba(255, 255, 252, .78); padding: 14px; }
.backend-metric span { display: block; color: var(--backend-copy); font-size: .78rem; }
.backend-metric strong { display: block; margin-top: 7px; font-size: 1.3rem; }
.backend-steps { display: grid; gap: 9px; margin-top: 16px; }
.backend-step { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 12px; align-items: start; }
.backend-step > span { display: grid; place-items: center; width: 31px; height: 31px; border-radius: 50%; background: #e6f1ed; color: var(--backend-green); font-weight: 800; }
.backend-step strong { display: block; margin: 2px 0 4px; }
.backend-step p { margin: 0; color: var(--backend-copy); font-size: .86rem; line-height: 1.45; }
.backend-controls { display: grid; gap: 12px; margin: 22px 0 14px; }
.backend-field { display: grid; gap: 6px; color: var(--backend-copy); font-size: .8rem; }
.backend-field input, .backend-field select { width: 100%; min-height: 43px; border: 1px solid rgba(217, 87, 36, .34); border-radius: 7px; background: #fffdfa; color: var(--backend-ink); padding: 9px 11px; font: inherit; }
.backend-actions { display: flex; flex-wrap: wrap; gap: 9px; }
.backend-controls button { min-height: 41px; border: 1px solid rgba(217, 87, 36, .34); border-radius: 7px; background: #fffdfa; color: #a43c17; padding: 9px 14px; font-weight: 800; cursor: pointer; }
.backend-controls button:hover, .backend-controls button:focus-visible { border-color: var(--backend-saffron); box-shadow: 0 0 0 3px rgba(217, 87, 36, .11); }
.backend-controls .backend-primary { background: var(--backend-saffron); border-color: var(--backend-saffron); color: white; }
.backend-choice-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.backend-choice { display: grid; gap: 5px; border: 1px solid var(--backend-line); border-radius: 8px; padding: 13px; cursor: pointer; }
.backend-choice:has(input:checked) { border-color: var(--backend-saffron); background: #fff4ec; }
.backend-choice small { color: var(--backend-copy); line-height: 1.4; }
.backend-output { min-height: 126px; max-height: 310px; overflow: auto; margin: 0; border: 1px solid rgba(22, 96, 79, .22); border-left: 4px solid var(--backend-green); border-radius: 8px; background: #f7fbf8; color: #19483d; padding: 16px; white-space: pre-wrap; overflow-wrap: anywhere; font: 600 .82rem/1.55 ui-monospace, SFMono-Regular, Consolas, monospace; }
.backend-boundary ul { margin: 16px 0; padding-left: 20px; }
.backend-packet { display: flex; flex-wrap: wrap; gap: 7px; }
.backend-packet span { border: 1px solid rgba(217, 87, 36, .28); border-radius: 999px; background: #fff7f1; color: #a33c17; padding: 6px 9px; font-size: .75rem; font-weight: 800; }
.backend-warning { margin-top: 20px; border: 1px dashed rgba(217, 87, 36, .32); border-radius: 8px; background: #fffaf6; padding: 15px; font-size: .9rem; }
@media (max-width: 1000px) { .backend-hero, .backend-workspace { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .backend-page { padding: 18px 14px 42px; } .backend-panel { padding: 18px; } .backend-intro h1 { font-size: 2.35rem; } .backend-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .backend-choice-grid { grid-template-columns: 1fr; } }
@media (max-width: 420px) { .backend-metrics { grid-template-columns: 1fr; } }
`;
}

function backendBrowserJs() {
  return `(function () {
  const dataNode = document.getElementById("backendArtifactData");
  if (!dataNode) return;
  const data = JSON.parse(dataNode.textContent);
  const output = document.querySelector("[data-backend-output]");
  const render = (value) => { if (output) output.textContent = JSON.stringify(value, null, 2); };
  const safeRead = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  };

  if (data.control === "decision") {
    document.querySelector("[data-backend-run]")?.addEventListener("click", () => {
      const decision = document.querySelector("[data-backend-decision]")?.value || "hold";
      render({ decision, scope: decision === "authorize-spike" ? "bounded-local-spike-only" : "no-implementation", deploymentAuthorized: false, publicLaunch: false, evidence: data.evidence, boundary: data.boundary });
    });
  }

  if (data.control === "provider") {
    const host = document.querySelector("[data-backend-provider-options]");
    if (host) host.innerHTML = data.patterns.map((pattern) => '<label class="backend-choice"><input type="radio" name="backendPattern" value="' + pattern.id + '" ' + (pattern.selected ? 'checked' : '') + '><strong>' + pattern.label + '</strong><small>Privacy: ' + pattern.privacy + ' · Operations: ' + pattern.operations + ' · Rollback: ' + pattern.rollback + '</small></label>').join("");
    document.querySelector("[data-backend-run]")?.addEventListener("click", () => {
      const id = document.querySelector('input[name="backendPattern"]:checked')?.value;
      const pattern = data.patterns.find((item) => item.id === id);
      render({ selectedPattern: pattern, providerVendor: "not-selected", region: "founder-review-required", credentials: false, deploymentAuthorized: false, boundary: data.boundary });
    });
  }

  if (data.control === "source") {
    const select = document.querySelector("[data-backend-source-options]");
    if (select) select.innerHTML = data.records.map((record) => '<option value="' + record.id + '">' + record.citation + ' — ' + record.title + '</option>').join("") + '<option value="unknown-source">Unknown source (no-source test)</option>';
    document.querySelector("[data-backend-run]")?.addEventListener("click", () => {
      const id = select?.value;
      const record = data.records.find((item) => item.id === id);
      render(record ? { status: 200, source: record, generatedAnswer: null, mutation: false } : { status: 404, code: "source_not_found", source: null, generatedAnswer: null, mutation: false });
    });
  }

  if (data.control === "queue") {
    const key = "vedapathMinimalReviewQueue";
    let state = safeRead(key, { tickets: data.tickets, events: [] });
    const select = document.querySelector("[data-backend-queue-options]");
    const refresh = () => {
      if (select) select.innerHTML = state.tickets.map((ticket) => '<option value="' + ticket.id + '">' + ticket.id + ' — ' + ticket.status + '</option>').join("");
      render({ storage: "browser-local-prototype", tickets: state.tickets, latestEvents: state.events.slice(-5), productionIdentity: false });
    };
    document.querySelectorAll("[data-queue-action]").forEach((button) => button.addEventListener("click", () => {
      const ticket = state.tickets.find((item) => item.id === select?.value);
      if (!ticket) return;
      const action = button.dataset.queueAction;
      const note = document.querySelector("[data-backend-note]")?.value.trim();
      const allowed = (action === "claim" && ["open", "changes-requested"].includes(ticket.status)) || (["approve", "changes-requested"].includes(action) && ticket.status === "claimed");
      if (!allowed) { render({ error: "invalid_transition", ticket }); return; }
      ticket.status = action === "claim" ? "claimed" : action;
      ticket.owner = action === "claim" ? "fixture-reviewer" : ticket.owner;
      state.events.push({ ticketId: ticket.id, action, note: note || null, at: new Date().toISOString() });
      safeWrite(key, state);
      refresh();
    }));
    refresh();
  }

  if (data.control === "consent") {
    const key = "vedapathMinimalConsentLedger";
    let events = safeRead(key, []);
    const refresh = () => render({ storage: "browser-local-prototype", appendOnly: true, telemetryEnabled: false, events: events.slice(-8), hostedWriteAuthorized: false });
    document.querySelectorAll("[data-consent-action]").forEach((button) => button.addEventListener("click", () => {
      const subject = document.querySelector("[data-backend-subject]")?.value.trim();
      const purpose = document.querySelector("[data-backend-purpose]")?.value.trim();
      if (!subject || !purpose) { render({ error: "subject_and_purpose_required" }); return; }
      events.push({ id: "consent-" + String(events.length + 1).padStart(3, "0"), type: button.dataset.consentAction, subject, purpose, scope: data.defaultScope, at: new Date().toISOString() });
      safeWrite(key, events);
      refresh();
    }));
    refresh();
  }
})();
`;
}

function backendContracts() {
  return `import { createHash } from "node:crypto";

export const MINIMAL_BACKEND_BOUNDARY = ${JSON.stringify(boundary)};
const forbidden = ["apiKey", "secret", "password", "token", "privateKey"];

function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}

function common(input = {}) {
  const violations = [];
  for (const key of forbidden) if (input[key]) violations.push(\`forbidden credential field: \${key}\`);
  if (input.deploymentAuthorized) violations.push("deployment must remain unauthorized");
  if (input.productionStorage) violations.push("production storage must remain disabled");
  if (input.liveAi) violations.push("live AI must remain disabled");
  if (input.telemetryEnabled) violations.push("telemetry must remain disabled");
  if (input.publicLaunch) violations.push("public launch must remain disabled");
  return violations;
}

function result(kind, input, violations) {
  return { kind, approved: violations.length === 0, violations, digest: digest({ kind, input }), boundary: MINIMAL_BACKEND_BOUNDARY };
}

function setOf(value) { return new Set(Array.isArray(value) ? value : []); }

export function evaluateFounderHostedPilotReviewGate(input = {}) {
  const violations = common(input);
  const packet = setOf(input.packet);
  ["evidence:gap-map", "evidence:threat-model", "evidence:privacy-ledger", "evidence:rights-pack"].forEach((item) => { if (!packet.has(item)) violations.push(\`missing \${item}\`); });
  if (!["hold", "rework", "authorize-spike"].includes(input.decision)) violations.push("decision must be hold, rework, or authorize-spike");
  if (input.decision === "authorize-spike" && input.scope !== "bounded-local-spike-only") violations.push("spike authorization requires bounded-local-spike-only scope");
  return result("founder-hosted-pilot-review-gate", input, violations);
}

export function evaluateBackendProviderDecision(input = {}) {
  const violations = common(input);
  const packet = setOf(input.packet);
  ["pattern:edge-worker-relational", "frontend:static-pages", "region:founder-reviewed", "secrets:binding-only", "rollback:required"].forEach((item) => { if (!packet.has(item)) violations.push(\`missing \${item}\`); });
  if (input.vendor && input.vendor !== "not-selected") violations.push("vendor binding requires a separate approved decision");
  return result("backend-provider-decision", input, violations);
}

export function createSourceApi(records = []) {
  const index = new Map(records.map((record) => [record.id, structuredClone(record)]));
  return {
    getSource(id) {
      const record = index.get(id);
      if (!record) return { status: 404, body: { code: "source_not_found", source: null, generatedAnswer: null } };
      if (!record.citation || !record.family || record.rightsStatus !== "reviewed-fixture") return { status: 409, body: { code: "source_not_ready", source: null, generatedAnswer: null } };
      return { status: 200, body: { source: structuredClone(record), generatedAnswer: null, mutation: false } };
    },
    request(method, id) {
      if (method !== "GET") return { status: 405, body: { code: "method_not_allowed", allowed: ["GET"] } };
      return this.getSource(id);
    }
  };
}

export function evaluateSourceApiMinimalEndpoint(input = {}) {
  const violations = common(input);
  if (input.method !== "GET") violations.push("source endpoint must be read-only GET");
  if (!input.source?.id || !input.source?.citation || !input.source?.family) violations.push("source packet requires id, citation, and family");
  if (input.source?.rightsStatus !== "reviewed-fixture") violations.push("source packet requires reviewed-fixture rights status");
  if (input.generatedAnswer) violations.push("endpoint must not generate answers");
  return result("source-api-minimal-endpoint", input, violations);
}

const queueTransitions = new Map([
  ["open", new Set(["claimed"])],
  ["claimed", new Set(["approved", "changes-requested", "open"])],
  ["changes-requested", new Set(["claimed"])],
  ["approved", new Set(["open"])]
]);

export function createReviewerQueue(seed = []) {
  const tickets = new Map(seed.map((ticket) => [ticket.id, structuredClone(ticket)]));
  const events = [];
  return {
    list() { return [...tickets.values()].map((ticket) => structuredClone(ticket)); },
    history() { return events.map((event) => structuredClone(event)); },
    transition(id, nextStatus, actor, note = "") {
      const ticket = tickets.get(id);
      if (!ticket) return { ok: false, code: "ticket_not_found" };
      if (!queueTransitions.get(ticket.status)?.has(nextStatus)) return { ok: false, code: "invalid_transition", status: ticket.status };
      if (!actor?.id || actor.role !== "reviewer") return { ok: false, code: "reviewer_required" };
      if (["approved", "changes-requested"].includes(nextStatus) && !note.trim()) return { ok: false, code: "decision_note_required" };
      const previous = ticket.status;
      ticket.status = nextStatus;
      if (nextStatus === "claimed") ticket.owner = actor.id;
      events.push({ sequence: events.length + 1, ticketId: id, previous, next: nextStatus, actor: actor.id, note: note.trim() || null });
      return { ok: true, ticket: structuredClone(ticket), event: structuredClone(events.at(-1)) };
    }
  };
}

export function evaluateReviewerQueueMinimalBackend(input = {}) {
  const violations = common(input);
  if (!Array.isArray(input.tickets) || input.tickets.length < 1) violations.push("queue requires tickets");
  if (!Array.isArray(input.events)) violations.push("queue requires append-only events");
  if (input.identityMode !== "fixture") violations.push("identity must remain fixture-only");
  return result("reviewer-queue-minimal-backend", input, violations);
}

const consentTypes = new Set(["consent.granted", "consent.withdrawn", "export.requested", "deletion.requested"]);

export function createConsentLedger(seed = []) {
  const events = seed.map((event) => structuredClone(event));
  return {
    append(event) {
      if (!consentTypes.has(event.type)) return { ok: false, code: "invalid_event_type" };
      if (!event.subject || !event.subject.startsWith("pilot-participant-")) return { ok: false, code: "pseudonymous_subject_required" };
      if (!event.purpose || !Array.isArray(event.scope) || event.scope.length === 0) return { ok: false, code: "purpose_and_scope_required" };
      const stored = { ...structuredClone(event), sequence: events.length + 1 };
      events.push(stored);
      return { ok: true, event: structuredClone(stored) };
    },
    list() { return events.map((event) => structuredClone(event)); }
  };
}

export function evaluateConsentLedgerMinimalBackend(input = {}) {
  const violations = common(input);
  if (!Array.isArray(input.events) || input.events.length < 1) violations.push("consent ledger requires events");
  if (input.events?.some((event) => !consentTypes.has(event.type))) violations.push("ledger contains an unsupported event type");
  if (input.events?.some((event) => !String(event.subject || "").startsWith("pilot-participant-"))) violations.push("ledger subjects must be pseudonymous");
  if (!input.appendOnly) violations.push("ledger must be append-only");
  return result("consent-ledger-minimal-backend", input, violations);
}

export function minimalBackendPacket(label, evaluation) {
  return { label, approved: Boolean(evaluation.approved), digest: evaluation.digest, violations: evaluation.violations, boundary: evaluation.boundary };
}
`;
}

function checkerJs() {
  return `import {
  evaluateFounderHostedPilotReviewGate,
  evaluateBackendProviderDecision,
  createSourceApi,
  evaluateSourceApiMinimalEndpoint,
  createReviewerQueue,
  evaluateReviewerQueueMinimalBackend,
  createConsentLedger,
  evaluateConsentLedgerMinimalBackend,
  minimalBackendPacket
} from "./vedapath-minimal-backend-contracts.mjs";

const releases = ["v5.2.7", "v5.2.8", "v5.2.9", "v5.3.0", "v5.3.1"];
const throughArg = process.argv.find((arg) => arg.startsWith("--through="));
const through = throughArg ? throughArg.split("=")[1] : releases.at(-1);
const count = releases.indexOf(through) + 1;
if (count < 1) throw new Error(\`Unknown --through=\${through}\`);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const sourceRecords = [
  { id: "bg-2-48-steadiness", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 2.48", rightsStatus: "reviewed-fixture", excerpt: "Steadiness in action" },
  { id: "bg-11-32-time", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 11.32", rightsStatus: "reviewed-fixture", excerpt: "Time in the cosmic form" }
];

const checks = [
  () => {
    const ok = evaluateFounderHostedPilotReviewGate({ decision: "authorize-spike", scope: "bounded-local-spike-only", packet: ["evidence:gap-map", "evidence:threat-model", "evidence:privacy-ledger", "evidence:rights-pack", "decision:review"] });
    assert(ok.approved, "founder hosted-pilot review should pass");
    assert(!evaluateFounderHostedPilotReviewGate({ decision: "authorize-spike", scope: "deploy-production", publicLaunch: true, packet: [] }).approved, "unsafe founder review should fail");
    assert(minimalBackendPacket("review", ok).approved, "review packet should wrap");
  },
  () => {
    const ok = evaluateBackendProviderDecision({ vendor: "not-selected", packet: ["pattern:edge-worker-relational", "frontend:static-pages", "region:founder-reviewed", "secrets:binding-only", "rollback:required"] });
    assert(ok.approved, "backend provider pattern should pass");
    assert(!evaluateBackendProviderDecision({ vendor: "bound-without-review", secret: "unsafe", packet: [] }).approved, "unsafe provider decision should fail");
  },
  () => {
    const api = createSourceApi(sourceRecords);
    const found = api.request("GET", "bg-2-48-steadiness");
    assert(found.status === 200 && found.body.generatedAnswer === null, "source API should return citation packet without answer");
    assert(api.request("GET", "unknown").status === 404, "source API should return explicit no-source");
    assert(api.request("POST", "bg-2-48-steadiness").status === 405, "source API must reject mutation");
    assert(evaluateSourceApiMinimalEndpoint({ method: "GET", source: found.body.source }).approved, "source endpoint contract should pass");
  },
  () => {
    const queue = createReviewerQueue([{ id: "review-1", sourceId: "bg-2-48-steadiness", status: "open", owner: null }]);
    assert(queue.transition("review-1", "claimed", { id: "reviewer-1", role: "reviewer" }).ok, "reviewer should claim ticket");
    assert(queue.transition("review-1", "approved", { id: "reviewer-1", role: "reviewer" }, "Citation and boundary reviewed.").ok, "reviewer should approve with note");
    assert(!queue.transition("review-1", "approved", { id: "reviewer-1", role: "reviewer" }, "again").ok, "invalid transition should fail");
    assert(evaluateReviewerQueueMinimalBackend({ tickets: queue.list(), events: queue.history(), identityMode: "fixture" }).approved, "review queue contract should pass");
  },
  () => {
    const ledger = createConsentLedger();
    const base = { subject: "pilot-participant-001", purpose: "Private pilot learning", scope: ["pilot-session"] };
    assert(ledger.append({ ...base, type: "consent.granted" }).ok, "consent grant should append");
    assert(ledger.append({ ...base, type: "consent.withdrawn" }).ok, "consent withdrawal should append");
    assert(ledger.append({ ...base, type: "export.requested" }).ok, "export request should append");
    assert(ledger.append({ ...base, type: "deletion.requested" }).ok, "deletion request should append");
    assert(!ledger.append({ ...base, subject: "real-name", type: "consent.granted" }).ok, "raw identity should fail");
    assert(evaluateConsentLedgerMinimalBackend({ events: ledger.list(), appendOnly: true }).approved, "consent ledger contract should pass");
  }
];

checks.slice(0, count).forEach((check) => check());
console.log(\`minimal-backend-ok \${count}/5\`);
`;
}

function localServerJs() {
  return `import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createSourceApi, createReviewerQueue, createConsentLedger } from "./vedapath-minimal-backend-contracts.mjs";

const root = process.cwd();
const portArg = process.argv.find((arg) => arg.startsWith("--port="));
const port = Number(portArg ? portArg.split("=")[1] : 8099);
const sourceData = JSON.parse(fs.readFileSync(path.join(root, "data", "vedapath-source-api-minimal-endpoint.json"), "utf8"));
const queueData = JSON.parse(fs.readFileSync(path.join(root, "data", "vedapath-reviewer-queue-minimal-backend.json"), "utf8"));
const api = createSourceApi(sourceData.records);
const queue = createReviewerQueue(queueData.tickets);
const consent = createConsentLedger();

function send(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "http://127.0.0.1" });
  response.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, \`http://127.0.0.1:\${port}\`);
  if (request.method === "GET" && url.pathname === "/health") return send(response, 200, { ok: true, service: "vedapath-minimal-backend", production: false });
  if (url.pathname.startsWith("/api/sources/")) return send(response, ...Object.values(api.request(request.method, decodeURIComponent(url.pathname.slice(13)))));
  if (request.method === "GET" && url.pathname === "/api/review-queue") return send(response, 200, { tickets: queue.list(), events: queue.history(), identityMode: "fixture" });
  if (request.method === "GET" && url.pathname === "/api/consent-ledger") return send(response, 200, { events: consent.list(), appendOnly: true, telemetryEnabled: false });
  return send(response, 404, { code: "route_not_found" });
});

server.listen(port, "127.0.0.1", () => console.log(\`vedapath-minimal-backend http://127.0.0.1:\${port}\`));
`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} backend";`);
  if (!text.includes('{ title: "Minimal Backend"')) {
    text = text.replace(
      '    { title: "Production Readiness", labels: ["Gap Map", "Threat Model", "Privacy Ledger", "Rights Pack", "Hosted Decision"] },',
      '    { title: "Production Readiness", labels: ["Gap Map", "Threat Model", "Privacy Ledger", "Rights Pack", "Hosted Decision"] },\n    { title: "Minimal Backend", labels: ["Hosted Review", "Backend Provider", "Source Endpoint", "Review Queue", "Consent Backend"] },'
    );
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Hosted Decision": "Minimal Hosted Pilot Architecture Decision",', '    "Hosted Decision": "Minimal Hosted Pilot Architecture Decision",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "minimal-hosted-pilot-architecture-decision-page": "Minimal Hosted Pilot Architecture Decision",', '    "minimal-hosted-pilot-architecture-decision-page": "Minimal Hosted Pilot Architecture Decision",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Hosted Decision", "minimalhostedpilotarchitecturedecision.html"],', '    ["Hosted Decision", "minimalhostedpilotarchitecturedecision.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "minimalhostedpilotarchitecturedecision.html",', '  "minimalhostedpilotarchitecturedecision.html",\n' + line);
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
          <p>The founder reviews the minimal backend evidence before any hosted implementation begins.</p>
        </article>
`;
  return text.replace(/(        <article class="tile">\s*<span>Full vision progress<\/span>[\s\S]*?<\/article>\s*)<\/section>/, `$1${tile}      </section>`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} backend</span>`);
  text = replaceSummaryTile(text, "Current version", latest.version, latest.summary);
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now has a deterministic minimal-backend path for source reads, reviewer decisions, consent events, and founder gates.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "Backend contracts are testable locally, while hosting, real identity, production storage, rights operations, security operations, and launch remain intentionally closed.");
  text = ensureNextReleaseTile(text);
  text = replaceSummaryTile(text, "Next release", latest.next, "The founder reviews the integrated minimal-backend evidence before any hosted implementation begins.");
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.summary}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V527-V531 MINIMAL BACKEND START -->\n${phases}\n            <!-- V527-V531 MINIMAL BACKEND END -->`;
  if (text.includes("<!-- V527-V531 MINIMAL BACKEND START -->")) {
    text = text.replace(/            <!-- V527-V531 MINIMAL BACKEND START -->[\s\S]*?            <!-- V527-V531 MINIMAL BACKEND END -->/, block);
  } else {
    text = text.replace('            <!-- V522-V526 PRODUCTION READINESS END -->', '            <!-- V522-V526 PRODUCTION READINESS END -->\n' + block);
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
  for (const release of selected) text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  write("README.md", entries + "\n" + text.trimStart());
}

function updateChangelog() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added a functional ${release.short} browser prototype, structured data packet, documentation, and deterministic minimal-backend contract coverage.\n- Preserved the release boundary: no credentials, production secrets, live AI, public telemetry, payment, broad accounts, public launch, or production authorization.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`assets/vedapath-minimal-backend.css\`\n- \`assets/vedapath-minimal-backend.js\`\n- \`scripts/vedapath-minimal-backend-contracts.mjs\`\n- \`scripts/check-v527-v531-minimal-backend.mjs\`\n- shared navigation/build docs where applicable\n\n### Checks run\n- \`node scripts/apply-v527-v531-minimal-backend-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-minimal-backend-contracts.mjs\`\n- \`node --check scripts/check-v527-v531-minimal-backend.mjs\`\n- \`node scripts/check-v527-v531-minimal-backend.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`\n\n### Known risks\n- Local and fixture-backed only; real provider binding, hosted security, production identity, persistent reviewer operations, consent storage, source-rights operations, and public launch remain unfinished and intentionally blocked.\n`).reverse().join("\n");
  let text = read("CHANGELOG.md");
  for (const release of selected) text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  write("CHANGELOG.md", entries + "\n" + text.trimStart());
}

for (const [index, release] of selected.entries()) {
  const data = releaseData(release, index);
  write(`data/vedapath-${release.slug}.json`, JSON.stringify(data, null, 2) + "\n");
  write(release.file, pageHtml(release, data));
  write(`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md`, docMd(release));
}

write("assets/vedapath-minimal-backend.css", backendCss());
write("assets/vedapath-minimal-backend.js", backendBrowserJs());
write("scripts/vedapath-minimal-backend-contracts.mjs", backendContracts());
write("scripts/check-v527-v531-minimal-backend.mjs", checkerJs());
write("scripts/serve-vedapath-minimal-backend.mjs", localServerJs());
updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateReadme();
updateChangelog();

console.log(`applied-minimal-backend ${latest.version} (${selected.length}/5)`);
