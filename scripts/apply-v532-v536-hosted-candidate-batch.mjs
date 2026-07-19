import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));

const boundary = "Hosted-pilot candidate only; vendor and region remain unbound, secrets are references only, persistence is ephemeral, telemetry and live AI are off, and public launch and production authorization remain closed.";

const releases = [
  {
    version: "v5.3.2",
    title: "Hosted Pilot Implementation Authorization",
    short: "Implementation Auth",
    file: "hostedpilotimplementationauthorization.html",
    slug: "hosted-pilot-implementation-authorization",
    bodyClass: "hosted-pilot-implementation-authorization-page",
    phase: "Phase 5.3.2: Hosted Pilot Implementation Authorization",
    summary: "Records one founder-reviewed authorization to build and test a provider-neutral hosted candidate while deployment, durable storage, telemetry, live AI, and public launch remain closed.",
    goal: "Turn the minimal-backend evidence into a precise candidate-only implementation authorization.",
    status: "Ready for environment and secret bootstrap",
    next: "v5.3.3 Environment & Secret Bootstrap",
    eyebrow: "Candidate-only authorization",
    hero: "Authorize one bounded candidate.",
    subhero: "The decision permits implementation and private testing of one provider-neutral service contract. It does not permit deployment, production data, telemetry, live AI, or public access.",
    metrics: [["Scope", "Candidate"], ["Provider", "Unbound"], ["Storage", "Ephemeral"], ["Launch", "Closed"]],
    flow: ["Review the minimal-backend evidence.", "Authorize only the hosted-candidate scope.", "Keep provider and region unbound.", "Preserve every production prohibition."],
    checks: [["Scope", "Hosted candidate only"], ["Rollback", "Required before any provider step"], ["Secrets", "References only"], ["Public launch", "Explicitly false"]],
    packet: ["scope:hosted-candidate-only", "pattern:edge-worker-relational", "frontend:static-pages", "secrets:references-only", "storage:ephemeral-adapter", "rollback:required"],
    control: "authorization",
    initialInstruction: "Choose a founder decision and inspect exactly what capability it authorizes."
  },
  {
    version: "v5.3.3",
    title: "Environment & Secret Bootstrap",
    short: "Env Bootstrap",
    file: "environmentsecretbootstrap.html",
    slug: "environment-secret-bootstrap",
    bodyClass: "environment-secret-bootstrap-page",
    phase: "Phase 5.3.3: Environment & Secret Bootstrap",
    summary: "Adds a strict environment schema with HTTPS and CORS boundaries, binding-only secret references, redacted diagnostics, and explicit launch-closed defaults.",
    goal: "Make candidate configuration testable without placing a credential or secret literal in source, output, or browser storage.",
    status: "Ready for hosted Source API candidate",
    next: "v5.3.4 Hosted Source API Candidate",
    eyebrow: "Configuration boundary",
    hero: "Configure without exposing secrets.",
    subhero: "A small profile admits local, preview, and hosted-candidate modes, rejects unknown keys and unsafe origins, and reports configured bindings without revealing their names or values.",
    metrics: [["Modes", "3"], ["Secret refs", "3"], ["Literal secrets", "Blocked"], ["Telemetry", "Off"]],
    flow: ["Choose an explicit environment.", "Require safe origins and CORS allowlists.", "Reference secrets through bindings.", "Redact every diagnostic summary."],
    checks: [["Origin", "HTTPS except local loopback"], ["Bindings", "SESSION, REVIEW, CONSENT"], ["Diagnostics", "Reference names redacted"], ["Unknown keys", "Rejected"]],
    packet: ["environment:local-preview-candidate", "origin:explicit", "cors:allowlist", "secretRefs:binding-only", "diagnostics:redacted"],
    control: "environment",
    initialInstruction: "Validate the safe profile, then enable the unsafe example to see a literal secret rejected."
  },
  {
    version: "v5.3.4",
    title: "Hosted Source API Candidate",
    short: "Hosted Source",
    file: "hostedsourceapicandidate.html",
    slug: "hosted-source-api-candidate",
    bodyClass: "hosted-source-api-candidate-page",
    phase: "Phase 5.3.4: Hosted Source API Candidate",
    summary: "Implements a fetch-compatible read-only Source API candidate with explicit no-source behavior, CORS refusal, request IDs, no-store responses, body limits, and ephemeral rate limiting.",
    goal: "Join the source contract to a deployable runtime shape without enabling answer generation or source mutation.",
    status: "Ready for reviewer identity and queue candidate",
    next: "v5.3.5 Reviewer Identity & Queue Candidate",
    eyebrow: "Read-only hosted route",
    hero: "Return a reviewed source, or no source.",
    subhero: "The candidate exposes health, readiness, and one source lookup route. Unknown records remain ordinary 404 responses, while mutation and generated answers stay unavailable.",
    metrics: [["Routes", "3"], ["Source writes", "0"], ["Answer AI", "Off"], ["Rate limit", "Ephemeral"]],
    flow: ["Accept one bounded source ID.", "Apply origin and rate boundaries.", "Return reviewed fixture fields.", "Return explicit no-source without guessing."],
    checks: [["CORS", "Allowlist only"], ["Cache", "No store"], ["Mutation", "Method rejected"], ["Generated answer", "Always null"]],
    packet: ["GET:/v1/health", "GET:/v1/readiness", "GET:/v1/sources/:id", "answer-generation:false", "mutation-routes:0"],
    control: "source",
    initialInstruction: "Request a reviewed fixture or choose the unknown record to inspect the no-source contract."
  },
  {
    version: "v5.3.5",
    title: "Reviewer Identity & Queue Candidate",
    short: "Identity Queue",
    file: "revieweridentityqueuecandidate.html",
    slug: "reviewer-identity-queue-candidate",
    bodyClass: "reviewer-identity-queue-candidate-page",
    phase: "Phase 5.3.5: Reviewer Identity & Queue Candidate",
    summary: "Adds fixture session verification, reviewer role enforcement, owner-aware queue transitions, idempotency keys, required decision notes, and an append-only audit stream.",
    goal: "Prove the reviewer service boundary before selecting a real identity provider or durable queue store.",
    status: "Ready for consent ledger service candidate",
    next: "v5.3.6 Consent Ledger Service Candidate",
    eyebrow: "Reviewer service boundary",
    hero: "A decision keeps its owner and history.",
    subhero: "Only a reviewer fixture session can read or change the queue. Claims establish ownership, decisions require notes, retries replay safely, and audit events are never rewritten.",
    metrics: [["Role", "Reviewer"], ["Sessions", "Fixture"], ["Audit", "Append-only"], ["Store", "Ephemeral"]],
    flow: ["Verify a reviewer session.", "Claim one open ticket.", "Record a noted decision.", "Replay retries without duplicate events."],
    checks: [["Missing session", "401"], ["Wrong role", "403"], ["Decision note", "Required"], ["Idempotency", "Replay safe"]],
    packet: ["identity:fixture-session-verifier", "role:reviewer", "owner:required", "audit:append-only", "idempotency:required"],
    control: "queue",
    initialInstruction: "Claim a ticket, record a reviewed decision, or reset the in-memory demonstration."
  },
  {
    version: "v5.3.6",
    title: "Consent Ledger Service Candidate",
    short: "Consent Service",
    file: "consentledgerservicecandidate.html",
    slug: "consent-ledger-service-candidate",
    bodyClass: "consent-ledger-service-candidate-page",
    phase: "Phase 5.3.6: Consent Ledger Service Candidate",
    summary: "Completes the hosted-candidate runtime with participant role checks, append-only consent events, idempotent retries, effective-consent projection, and explicit export and deletion requests.",
    goal: "Make every candidate learning or memory action consent-bound before telemetry or durable storage can exist.",
    status: "Ready for provider and region selection gate",
    next: "v5.3.7 Provider and Region Selection Gate",
    eyebrow: "Consent service boundary",
    hero: "Consent stays visible and reversible.",
    subhero: "The service records grant, withdrawal, export, and deletion events under a pseudonymous participant session, then derives the current state without mutating history.",
    metrics: [["Events", "4"], ["Projection", "Effective"], ["Telemetry", "Off"], ["Persistence", "Ephemeral"]],
    flow: ["Verify a participant session.", "Append purpose and scope.", "Derive effective consent.", "Keep export and deletion requests visible."],
    checks: [["Identity", "Pseudonymous fixture"], ["Withdrawal", "Immediate projection"], ["Export/deletion", "Explicit events"], ["Launch", "Still closed"]],
    packet: ["consent:append-only", "projection:effective", "idempotency:required", "telemetry:off", "public-launch:false"],
    control: "consent",
    initialInstruction: "Append consent events and watch the effective state change without rewriting history."
  }
];

const through = args.get("through") || releases.at(-1).version;
const throughIndex = releases.findIndex((release) => release.version === through);
if (throughIndex < 0) throw new Error(`Unknown --through=${through}`);
const selected = releases.slice(0, throughIndex + 1);
const latest = selected.at(-1);
const previousRelease = selected.length > 1 ? selected.at(-2) : { version: "v5.3.1", title: "Consent Ledger Minimal Backend" };

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
  const data = {
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
    checks: release.checks,
    packet: release.packet,
    control: release.control,
    initialInstruction: release.initialInstruction,
    vendor: "not-selected",
    region: "review-required",
    persistence: "ephemeral",
    deploymentAuthorized: false,
    productionStorage: false,
    telemetryEnabled: false,
    liveAi: false,
    publicLaunch: false,
    updated: "2026-07-19"
  };
  if (release.control === "environment") {
    data.profile = {
      environment: "local",
      serviceName: "vedapath-hosted-candidate",
      publicOrigin: "http://127.0.0.1:8101",
      corsAllowlist: ["http://127.0.0.1:8097"],
      secretRefs: {
        sessionVerifier: "binding://SESSION_VERIFIER",
        reviewStore: "binding://REVIEW_STORE",
        consentStore: "binding://CONSENT_STORE"
      },
      vendor: "not-selected",
      region: "review-required",
      persistence: "ephemeral",
      deploymentAuthorized: false,
      productionStorage: false,
      telemetryEnabled: false,
      liveAi: false,
      publicLaunch: false
    };
  }
  if (release.control === "source") {
    data.records = [
      { id: "bg-2-48-steadiness", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 2.48", title: "Steadiness in action", rightsStatus: "reviewed-fixture", excerpt: "Steadiness in action without clinging to results." },
      { id: "bg-11-32-time", family: "Bhagavad Gita | Smriti", citation: "Bhagavad Gita 11.32", title: "Time in the cosmic form", rightsStatus: "reviewed-fixture", excerpt: "The cosmic form is identified with world-transforming Time." }
    ];
  }
  if (release.control === "queue") {
    data.tickets = [
      { id: "review-bg-2-48", sourceId: "bg-2-48-steadiness", status: "open", owner: null },
      { id: "review-bg-11-32", sourceId: "bg-11-32-time", status: "open", owner: null }
    ];
  }
  if (release.control === "consent") {
    data.eventTypes = ["consent.granted", "consent.withdrawn", "export.requested", "deletion.requested"];
    data.defaultScope = ["pilot-session", "source-feedback"];
  }
  return data;
}

function controls(release) {
  if (release.control === "authorization") {
    return `<label class="candidate-field"><span>Founder decision</span><select data-candidate-decision><option value="hold">Hold</option><option value="rework">Rework conditions</option><option value="authorize-candidate">Authorize candidate only</option></select></label><div class="candidate-actions"><button class="candidate-primary" type="button" data-candidate-run>Inspect authorization</button></div>`;
  }
  if (release.control === "environment") {
    return `<label class="candidate-field"><span>Environment</span><select><option>local</option><option>preview</option><option>hosted-candidate</option></select></label><label class="candidate-field"><span><input type="checkbox" data-candidate-unsafe> Demonstrate an unsafe literal secret</span></label><div class="candidate-actions"><button class="candidate-primary" type="button" data-candidate-run>Validate and redact</button></div>`;
  }
  if (release.control === "source") {
    return `<label class="candidate-field"><span>Source record</span><select data-candidate-source></select></label><div class="candidate-actions"><button class="candidate-primary" type="button" data-candidate-run>GET source packet</button></div>`;
  }
  if (release.control === "queue") {
    return `<label class="candidate-field"><span>Review ticket</span><select data-candidate-ticket></select></label><label class="candidate-field"><span>Decision note</span><input data-candidate-note value="Citation and boundary reviewed."></label><div class="candidate-actions"><button class="candidate-primary" type="button" data-queue-transition="claimed">Claim</button><button type="button" data-queue-transition="approved">Approve</button><button type="button" data-queue-transition="changes-requested">Request changes</button><button type="button" data-candidate-reset>Reset demo</button></div>`;
  }
  return `<div class="candidate-actions"><button class="candidate-primary" type="button" data-consent-event="consent.granted">Grant</button><button type="button" data-consent-event="consent.withdrawn">Withdraw</button><button type="button" data-consent-event="export.requested">Request export</button><button type="button" data-consent-event="deletion.requested">Request deletion</button><button type="button" data-candidate-reset>Reset demo</button></div>`;
}

function pageHtml(release, data) {
  const metrics = release.metrics.map(([label, value]) => `<article class="candidate-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("\n              ");
  const steps = release.flow.map((item, index) => `<article class="candidate-step"><span>${index + 1}</span><div><strong>${escapeHtml(item.replace(/\.$/, ""))}</strong><p>${escapeHtml(item)}</p></div></article>`).join("\n              ");
  const checks = release.checks.map(([label, value]) => `<article class="candidate-check"><div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div></article>`).join("\n              ");
  const packet = release.packet.map((item) => `<span class="candidate-tag">${escapeHtml(item)}</span>`).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(release.summary)}">
    <title>VedaPath ${escapeHtml(release.title)}</title>
    <link rel="stylesheet" href="assets/vedapath-ui.css">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
    <link rel="stylesheet" href="assets/vedapath-hosted-candidate.css">
  </head>
  <body class="${release.bodyClass}">
    <main class="page hosted-candidate-page" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI"><span><strong>VedaPath AI</strong><small>${escapeHtml(release.title)}</small></span></a>
        <nav class="navlinks nav" aria-label="Primary navigation"><a class="link" href="index.html">Home</a><a class="link" href="build-status.html">Build</a></nav>
      </header>
      <section class="candidate-hero">
        <article class="candidate-panel candidate-intro">
          <span class="candidate-kicker">${escapeHtml(release.eyebrow)}</span>
          <h1>${escapeHtml(release.hero)}</h1>
          <p>${escapeHtml(release.subhero)}</p>
          <div class="candidate-metrics">${metrics}</div>
        </article>
        <aside class="candidate-panel" aria-label="Release flow">
          <span class="candidate-kicker">One bounded path</span>
          <h2>${escapeHtml(release.title)}</h2>
          <div class="candidate-steps">${steps}</div>
        </aside>
      </section>
      <section class="candidate-workspace">
        <article class="candidate-panel">
          <span class="candidate-kicker">Interactive contract proof</span>
          <h2>${escapeHtml(release.title)} console</h2>
          <p>${escapeHtml(release.summary)}</p>
          <div class="candidate-controls">${controls(release)}</div>
          <pre class="candidate-output" data-candidate-output aria-live="polite">Loading bounded release data.</pre>
        </article>
        <aside class="candidate-panel candidate-boundary">
          <span class="candidate-kicker">Evidence and boundary</span>
          <h2>What this candidate proves</h2>
          <div class="candidate-checks">${checks}</div>
          <div class="candidate-packet">${packet}</div>
          <p class="candidate-warning"><strong>Still closed:</strong> ${escapeHtml(boundary)}</p>
        </aside>
      </section>
    </main>
    <script id="hostedCandidateData" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
    <script src="assets/vedapath-command-shell.js"></script>
    <script src="assets/vedapath-hosted-candidate.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.version} ${release.title}\n\n${release.summary}\n\n## Goal\n\n${release.goal}\n\n## Flow\n\n${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n## Contract checks\n\n${release.checks.map(([label, value]) => `- **${label}:** ${value}`).join("\n")}\n\n## Packet\n\n${release.packet.map((item) => `- \`${item}\``).join("\n")}\n\n## Boundary\n\n${boundary}\n`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} hosted candidate";`);
  if (!text.includes('{ title: "Hosted Candidate"')) {
    text = text.replace(
      '    { title: "Minimal Backend", labels: ["Hosted Review", "Backend Provider", "Source Endpoint", "Review Queue", "Consent Backend"] },',
      '    { title: "Minimal Backend", labels: ["Hosted Review", "Backend Provider", "Source Endpoint", "Review Queue", "Consent Backend"] },\n    { title: "Hosted Candidate", labels: ["Implementation Auth", "Env Bootstrap", "Hosted Source", "Identity Queue", "Consent Service"] },'
    );
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Hosted Review": "Founder Hosted-Pilot Review Gate",', '    "Hosted Review": "Founder Hosted-Pilot Review Gate",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "founder-hosted-pilot-review-gate-page": "Founder Hosted-Pilot Review Gate",', '    "founder-hosted-pilot-review-gate-page": "Founder Hosted-Pilot Review Gate",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Hosted Review", "founderhostedpilotreviewgate.html"],', '    ["Hosted Review", "founderhostedpilotreviewgate.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "consentledgerminimalbackend.html",', '  "consentledgerminimalbackend.html",\n' + line);
  }
  write("scripts/check-static-links.mjs", text);
}

function replaceSummaryTile(text, label, strong, copy) {
  const pattern = new RegExp(`(<article class="tile">\\s*<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>\\s*<p>[\\s\\S]*?<\\/p>(?=\\s*<\\/article>)`, "m");
  return text.replace(pattern, `$1<strong>${strong}</strong>\n          <p>${copy}</p>`);
}

function ensureNextReleaseTile(text) {
  if (text.includes("<span>Next release</span>")) return text;
  const tile = `        <article class="tile">\n          <span>Next release</span>\n          <strong>${latest.next}</strong>\n          <p>Review the hosted-candidate evidence before binding any provider, region, secret, or durable store.</p>\n        </article>\n`;
  return text.replace(/(        <article class="tile">\s*<span>Full vision progress<\/span>[\s\S]*?<\/article>\s*)<\/section>/, `$1${tile}      </section>`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} hosted candidate</span>`);
  text = replaceSummaryTile(text, "Current version", latest.version, latest.summary);
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now has a fetch-compatible candidate for source reads, reviewer decisions, consent events, and launch-closed readiness.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "The candidate runtime is integrated and testable, while provider binding, region selection, production security, durable storage, real identity, rights operations, and launch remain closed.");
  text = ensureNextReleaseTile(text);
  text = replaceSummaryTile(text, "Next release", latest.next, "The founder reviews the provider-neutral candidate before selecting a provider, region, or production-grade service boundary.");
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.summary}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V532-V536 HOSTED CANDIDATE START -->\n${phases}\n            <!-- V532-V536 HOSTED CANDIDATE END -->`;
  if (text.includes("<!-- V532-V536 HOSTED CANDIDATE START -->")) {
    text = text.replace(/            <!-- V532-V536 HOSTED CANDIDATE START -->[\s\S]*?            <!-- V532-V536 HOSTED CANDIDATE END -->/, block);
  } else {
    text = text.replace('            <!-- V527-V531 MINIMAL BACKEND END -->', '            <!-- V527-V531 MINIMAL BACKEND END -->\n' + block);
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
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added a functional ${release.short} browser room, structured packet, documentation, and deterministic hosted-candidate behavior coverage.\n- Preserved the candidate boundary: no provider binding, production secrets, durable storage, live AI, telemetry, public launch, or production authorization.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`assets/vedapath-hosted-candidate.css\`\n- \`assets/vedapath-hosted-candidate.js\`\n- \`scripts/vedapath-hosted-candidate-contracts.mjs\`\n- \`scripts/check-v532-v536-hosted-candidate.mjs\`\n- shared navigation, build status, README, and static-link manifest\n\n### Checks run\n- \`node scripts/apply-v532-v536-hosted-candidate-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-hosted-candidate-contracts.mjs\`\n- \`node --check scripts/check-v532-v536-hosted-candidate.mjs\`\n- \`node scripts/check-v532-v536-hosted-candidate.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`\n\n### Known risks\n- Provider-neutral and ephemeral only; provider and region selection, hosted secret bindings, durable databases, real identity, rights operations, production security and operations, and public launch remain unfinished and intentionally blocked.\n`).reverse().join("\n");
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

updateCommandShell();
updateStaticLinks();
updateBuildStatus();
updateReadme();
updateChangelog();

console.log(`applied-hosted-candidate ${latest.version} (${selected.length}/5)`);
