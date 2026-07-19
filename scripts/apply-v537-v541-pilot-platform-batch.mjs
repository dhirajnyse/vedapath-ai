import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));

const boundary = "Private-pilot platform candidate only; provider and region binding, production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.";

const releases = [
  {
    version: "v5.3.7",
    title: "Provider & Region Selection Gate",
    short: "Selection Gate",
    file: "providerregionselectiongate.html",
    slug: "provider-region-selection-gate",
    bodyClass: "provider-region-selection-gate-page",
    phase: "Phase 5.3.7: Provider & Region Selection Gate",
    summary: "Adds an evidence-complete provider and region comparison gate with residency, rights, privacy, security, rollback, exit, and cost requirements while operational binding remains deferred.",
    goal: "Make provider and region comparison reviewable without silently converting a recommendation into deployment authority.",
    status: "Ready for hosted deployment adapter candidate",
    next: "v5.3.8 Hosted Deployment Adapter Candidate",
    eyebrow: "Decision before binding",
    hero: "Compare the host. Keep authority separate.",
    subhero: "One proposal can be recommended only after residency, rights, privacy, security, rollback, exit, and cost evidence is complete. A recommendation still cannot bind infrastructure.",
    metrics: [["Evidence gates", "6"], ["Cost cap", "Required"], ["Binding", "Deferred"], ["Launch", "Closed"]],
    flow: ["Name one candidate provider and region.", "Review six independent evidence gates.", "Record a bounded recommendation.", "Keep operational binding at false."],
    checks: [["Residency", "Evidence required"], ["Exit plan", "Required before recommendation"], ["Cost", "Explicit monthly cap"], ["Authority", "Recommendation is not binding"]],
    packet: ["decision:recommend-candidate", "evidence:6-gates", "cost-cap:required", "provider-bound:false", "region-bound:false"],
    control: "selection",
    initialInstruction: "Compare complete and incomplete evidence packets; neither path binds a provider or region."
  },
  {
    version: "v5.3.8",
    title: "Hosted Deployment Adapter Candidate",
    short: "Deployment Adapter",
    file: "hosteddeploymentadaptercandidate.html",
    slug: "hosted-deployment-adapter-candidate",
    bodyClass: "hosted-deployment-adapter-candidate-page",
    phase: "Phase 5.3.8: Hosted Deployment Adapter Candidate",
    summary: "Introduces one fetch-compatible provider-neutral adapter with binding-reference validation, redacted diagnostics, no-store responses, and fail-closed request handling.",
    goal: "Prove the hosted service can sit behind a platform adapter without coupling product logic to a vendor or permitting deployment.",
    status: "Ready for durable storage migration candidate",
    next: "v5.3.9 Durable Storage Migration Candidate",
    eyebrow: "One runtime seam",
    hero: "Adapt the request, not the product.",
    subhero: "The hosted API now passes through one small fetch adapter. Platform bindings remain references, diagnostics remain redacted, and an invalid request fails before product logic runs.",
    metrics: [["Interface", "Fetch"], ["Targets", "Neutral"], ["Cache", "No-store"], ["Deploy", "Blocked"]],
    flow: ["Accept a standard Request.", "Resolve reference-only bindings.", "Forward to the hosted contract.", "Return a no-store bounded response."],
    checks: [["Input", "Request required"], ["Bindings", "Names only; values redacted"], ["Product logic", "Unchanged behind adapter"], ["Deployment", "Still unauthorized"]],
    packet: ["interface:fetch", "target:provider-neutral", "bindings:references-only", "response:no-store", "deployment:false"],
    control: "adapter",
    initialInstruction: "Inspect health and source responses, then confirm that a deployment attempt remains blocked."
  },
  {
    version: "v5.3.9",
    title: "Durable Storage Migration Candidate",
    short: "Storage Migration",
    file: "durablestoragemigrationcandidate.html",
    slug: "durable-storage-migration-candidate",
    bodyClass: "durable-storage-migration-candidate-page",
    phase: "Phase 5.3.9: Durable Storage Migration Candidate",
    summary: "Adds a versioned four-table migration plan with checksum verification, transactional commit, rollback on failure, referential integrity, and idempotent replay in a memory-backed candidate store.",
    goal: "Prove migration behavior and rollback before choosing or writing to a real durable database.",
    status: "Ready for production identity integration candidate",
    next: "v5.4.0 Production Identity Integration Candidate",
    eyebrow: "Migrate before cutover",
    hero: "Move every record together, or move none.",
    subhero: "Sources, review tickets, review audit, and consent events share one checked migration. Failure restores the prior snapshot, and retries cannot duplicate the migration.",
    metrics: [["Schema", "v1"], ["Tables", "4"], ["Rollback", "Atomic"], ["Provider", "Unbound"]],
    flow: ["Build a checksummed plan.", "Validate references before commit.", "Commit all tables transactionally.", "Replay safely or restore the snapshot."],
    checks: [["Checksum", "Plan integrity required"], ["References", "Queue source must exist"], ["Failure", "Full rollback"], ["Retry", "One migration record"]],
    packet: ["schema:1", "tables:4", "transactional:true", "idempotent:true", "durable-provider:null"],
    control: "migration",
    initialInstruction: "Run, replay, fail, and restore the candidate migration without touching a real database."
  },
  {
    version: "v5.4.0",
    title: "Production Identity Integration Candidate",
    short: "Signed Identity",
    file: "productionidentityintegrationcandidate.html",
    slug: "production-identity-integration-candidate",
    bodyClass: "production-identity-integration-candidate-page",
    phase: "Phase 5.4.0: Production Identity Integration Candidate",
    summary: "Replaces fixture session headers in the candidate path with signed, expiring issuer-and-audience-bound claims and strict reviewer/participant role enforcement.",
    goal: "Prove the identity verification boundary before selecting an external identity provider or provisioning real accounts.",
    status: "Ready for private pilot operations and observability gate",
    next: "v5.4.1 Private Pilot Operations & Observability Gate",
    eyebrow: "Signed candidate identity",
    hero: "Trust a verified claim, not a convenient header.",
    subhero: "A short-lived signed fixture token carries issuer, audience, subject, role, expiry, and token ID. Tampering, expiry, and role mismatch all fail closed.",
    metrics: [["Signature", "HS256 fixture"], ["Expiry", "Required"], ["Roles", "2"], ["IdP", "Unbound"]],
    flow: ["Verify signature and token type.", "Check issuer, audience, and expiry.", "Resolve reviewer or participant role.", "Reject tampering and role mismatch."],
    checks: [["Tamper", "Rejected"], ["Expiry", "Rejected"], ["Audience", "Exact match"], ["External IdP", "Not selected"]],
    packet: ["claims:signed", "expiry:enforced", "issuer-audience:enforced", "roles:strict", "external-idp:null"],
    control: "identity",
    initialInstruction: "Compare a valid reviewer claim with expired and tampered token outcomes."
  },
  {
    version: "v5.4.1",
    title: "Private Pilot Operations & Observability Gate",
    short: "Pilot Operations",
    file: "privatepilotoperationsobservabilitygate.html",
    slug: "private-pilot-operations-observability-gate",
    bodyClass: "private-pilot-operations-observability-gate-page",
    phase: "Phase 5.4.1: Private Pilot Operations & Observability Gate",
    summary: "Adds reviewer-only technical readiness, redacted request events, bounded incident lifecycle, and rollback evidence while excluding participant content and behavioral telemetry.",
    goal: "Make a private candidate operable and diagnosable without turning participant reflection into telemetry or opening public launch.",
    status: "Ready for hosted provider binding decision",
    next: "v5.4.2 Hosted Provider Binding Decision",
    eyebrow: "Observe the service, not the person",
    hero: "See technical health. Leave private meaning private.",
    subhero: "Operations evidence records route shape, status, latency bucket, request ID, and incidents. Questions, answers, reflections, identity tokens, and behavioral profiles never enter the recorder.",
    metrics: [["Access", "Reviewer"], ["Content", "Excluded"], ["Incidents", "Lifecycle"], ["Public", "Closed"]],
    flow: ["Record redacted technical events.", "Expose detailed health to reviewers only.", "Open and close bounded incidents.", "Keep rollback and launch boundaries visible."],
    checks: [["Participant content", "Never recorded"], ["Authorization", "Never recorded"], ["Ops detail", "Reviewer only"], ["Behavioral telemetry", "Off"]],
    packet: ["operations:redacted", "health:reviewer-only", "incident:lifecycle", "content:false", "public-launch:false"],
    control: "operations",
    initialInstruction: "Inspect healthy operations, open an incident, then close it; no participant content enters the report."
  }
];

const through = args.get("through") || releases.at(-1).version;
const throughIndex = releases.findIndex((release) => release.version === through);
if (throughIndex < 0) throw new Error(`Unknown --through=${through}`);
const selected = releases.slice(0, throughIndex + 1);
const latest = selected.at(-1);
const previousRelease = selected.length > 1 ? selected.at(-2) : { version: "v5.3.6", title: "Consent Ledger Service Candidate" };

function read(file) { return fs.readFileSync(path.join(root, file), "utf8"); }
function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function releaseData(release, index) {
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
    checks: release.checks,
    packet: release.packet,
    control: release.control,
    initialInstruction: release.initialInstruction,
    providerBound: false,
    regionBound: false,
    deploymentAuthorized: false,
    productionCredentials: false,
    productionData: false,
    telemetryEnabled: false,
    liveAi: false,
    publicLaunch: false,
    updated: "2026-07-19"
  };
}

function controls(release) {
  if (release.control === "selection") return `<div class="platform-actions"><button class="platform-primary" type="button" data-platform-action="complete">Review complete packet</button><button type="button" data-platform-action="incomplete">Review incomplete packet</button></div>`;
  if (release.control === "adapter") return `<div class="platform-actions"><button class="platform-primary" type="button" data-platform-action="health">GET health</button><button type="button" data-platform-action="source">GET reviewed source</button><button type="button" data-platform-action="deploy">Attempt deploy</button></div>`;
  if (release.control === "migration") return `<div class="platform-actions"><button class="platform-primary" type="button" data-platform-action="run">Run migration</button><button type="button" data-platform-action="run">Replay migration</button><button type="button" data-platform-action="fail">Simulate failure</button><button type="button" data-platform-action="rollback">Restore snapshot</button></div>`;
  if (release.control === "identity") return `<div class="platform-actions"><button class="platform-primary" type="button" data-platform-action="valid">Verify reviewer token</button><button type="button" data-platform-action="expired">Try expired token</button><button type="button" data-platform-action="tampered">Try tampered token</button></div>`;
  return `<div class="platform-actions"><button class="platform-primary" type="button" data-platform-action="healthy">Read technical health</button><button type="button" data-platform-action="incident">Open incident</button><button type="button" data-platform-action="close">Close incident</button></div>`;
}

function pageHtml(release, data) {
  const metrics = release.metrics.map(([label, value]) => `<article class="platform-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("\n              ");
  const steps = release.flow.map((item, index) => `<article class="platform-step"><span>${index + 1}</span><div><strong>${escapeHtml(item.replace(/\.$/, ""))}</strong><p>${escapeHtml(item)}</p></div></article>`).join("\n              ");
  const checks = release.checks.map(([label, value]) => `<article class="platform-check"><div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div></article>`).join("\n              ");
  const packet = release.packet.map((item) => `<span class="platform-tag">${escapeHtml(item)}</span>`).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(release.summary)}">
    <title>VedaPath ${escapeHtml(release.title)}</title>
    <link rel="stylesheet" href="assets/vedapath-ui.css">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
    <link rel="stylesheet" href="assets/vedapath-pilot-platform.css">
  </head>
  <body class="${release.bodyClass}">
    <main class="page pilot-platform-page" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI"><span><strong>VedaPath AI</strong><small>${escapeHtml(release.title)}</small></span></a>
        <nav class="navlinks nav" aria-label="Primary navigation"><a class="link" href="index.html">Home</a><a class="link" href="build-status.html">Build</a></nav>
      </header>
      <section class="platform-hero">
        <article class="platform-panel platform-intro">
          <span class="platform-kicker">${escapeHtml(release.eyebrow)}</span>
          <h1>${escapeHtml(release.hero)}</h1>
          <p>${escapeHtml(release.subhero)}</p>
          <div class="platform-metrics">${metrics}</div>
        </article>
        <aside class="platform-panel" aria-label="Release flow">
          <span class="platform-kicker">One bounded path</span>
          <h2>${escapeHtml(release.title)}</h2>
          <div class="platform-steps">${steps}</div>
        </aside>
      </section>
      <section class="platform-workspace">
        <article class="platform-panel">
          <span class="platform-kicker">Executable proof</span>
          <h2>${escapeHtml(release.title)} console</h2>
          <p>${escapeHtml(release.summary)}</p>
          <div class="platform-controls">${controls(release)}</div>
          <pre class="platform-output" data-platform-output aria-live="polite">Loading bounded release data.</pre>
        </article>
        <aside class="platform-panel">
          <span class="platform-kicker">Evidence and boundary</span>
          <h2>What this release proves</h2>
          <div class="platform-checks">${checks}</div>
          <div class="platform-packet">${packet}</div>
          <p class="platform-warning"><strong>Still closed:</strong> ${escapeHtml(boundary)}</p>
        </aside>
      </section>
    </main>
    <script id="pilotPlatformData" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
    <script src="assets/vedapath-command-shell.js"></script>
    <script src="assets/vedapath-pilot-platform.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.version} ${release.title}\n\n${release.summary}\n\n## Goal\n\n${release.goal}\n\n## Flow\n\n${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n## Contract checks\n\n${release.checks.map(([label, value]) => `- **${label}:** ${value}`).join("\n")}\n\n## Packet\n\n${release.packet.map((item) => `- \`${item}\``).join("\n")}\n\n## Boundary\n\n${boundary}\n`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} pilot platform";`);
  if (!text.includes('{ title: "Pilot Platform"')) {
    text = text.replace(
      '    { title: "Hosted Candidate", labels: ["Implementation Auth", "Env Bootstrap", "Hosted Source", "Identity Queue", "Consent Service"] },',
      '    { title: "Hosted Candidate", labels: ["Implementation Auth", "Env Bootstrap", "Hosted Source", "Identity Queue", "Consent Service"] },\n    { title: "Pilot Platform", labels: ["Selection Gate", "Deployment Adapter", "Storage Migration", "Signed Identity", "Pilot Operations"] },'
    );
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Implementation Auth": "Hosted Pilot Implementation Authorization",', '    "Implementation Auth": "Hosted Pilot Implementation Authorization",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "hosted-pilot-implementation-authorization-page": "Hosted Pilot Implementation Authorization",', '    "hosted-pilot-implementation-authorization-page": "Hosted Pilot Implementation Authorization",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Implementation Auth", "hostedpilotimplementationauthorization.html"],', '    ["Implementation Auth", "hostedpilotimplementationauthorization.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "hostedpilotimplementationauthorization.html",', '  "hostedpilotimplementationauthorization.html",\n' + line);
  }
  write("scripts/check-static-links.mjs", text);
}

function replaceSummaryTile(text, label, strong, copy) {
  const pattern = new RegExp(`(<article class="tile">\\s*<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>\\s*<p>[\\s\\S]*?<\\/p>(?=\\s*<\\/article>)`, "m");
  return text.replace(pattern, `$1<strong>${strong}</strong>\n          <p>${copy}</p>`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} pilot platform</span>`);
  text = replaceSummaryTile(text, "Current version", latest.version, latest.summary);
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now has a provider-neutral platform seam, checked migration path, signed candidate identity, and redacted private-pilot operations evidence.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "The private candidate is testable end to end, while vendor binding, real durable storage, external identity, production security operations, live AI, and public launch remain closed.");
  text = replaceSummaryTile(text, "Next release", latest.next, "Review the platform evidence before any hosted provider binding, real account provisioning, durable data cutover, or deployment authorization.");
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.summary}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V537-V541 PILOT PLATFORM START -->\n${phases}\n            <!-- V537-V541 PILOT PLATFORM END -->`;
  if (text.includes("<!-- V537-V541 PILOT PLATFORM START -->")) {
    text = text.replace(/            <!-- V537-V541 PILOT PLATFORM START -->[\s\S]*?            <!-- V537-V541 PILOT PLATFORM END -->/, block);
  } else {
    text = text.replace('            <!-- V532-V536 HOSTED CANDIDATE END -->', '            <!-- V532-V536 HOSTED CANDIDATE END -->\n' + block);
  }
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${latest.version} ${latest.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previousRelease.version} ${previousRelease.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${latest.goal}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${latest.status}; ${boundary}</strong></div>`);
  write("build-status.html", text);
}

function updateReadme() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n${release.summary}\n\n- Open: [${release.title}](${release.file})\n- Data: \`data/vedapath-${release.slug}.json\`${release.version === "v5.4.1" ? "\n- Local HTTP proof: `node scripts/smoke-v541-pilot-platform-http.mjs`" : ""}\n- Boundary: ${boundary}\n`).reverse().join("\n");
  let text = read("README.md");
  for (const release of releases) text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
  write("README.md", entries + "\n" + text.trimStart());
}

function updateChangelog() {
  const entries = selected.map((release) => {
    const runtimeFiles = release.version === "v5.4.1"
      ? "\n- `scripts/serve-vedapath-pilot-platform.mjs`\n- `scripts/smoke-v541-pilot-platform-http.mjs`"
      : "";
    const runtimeChecks = release.version === "v5.4.1"
      ? "\n- `node --check scripts/serve-vedapath-pilot-platform.mjs`\n- `node --check scripts/smoke-v541-pilot-platform-http.mjs`\n- `node scripts/smoke-v541-pilot-platform-http.mjs`"
      : "";
    return `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added an interactive ${release.short} room, structured data packet, documentation, and deterministic platform-contract coverage.\n- Preserved the launch boundary: provider/region binding, production credentials and data, behavioral telemetry, live AI, public launch, and production authorization remain false.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`assets/vedapath-pilot-platform.css\`\n- \`assets/vedapath-pilot-platform.js\`\n- \`scripts/vedapath-pilot-platform-contracts.mjs\`\n- \`scripts/check-v537-v541-pilot-platform.mjs\`${runtimeFiles}\n- shared navigation, build status, README, and static-link manifest\n\n### Checks run\n- \`node scripts/apply-v537-v541-pilot-platform-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-pilot-platform-contracts.mjs\`\n- \`node --check scripts/check-v537-v541-pilot-platform.mjs\`\n- \`node scripts/check-v537-v541-pilot-platform.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`${runtimeChecks}\n\n### Known risks\n- ${release.version === "v5.3.7" ? "The comparison packet recommends only a candidate; provider, region, contract, account, and deployment authority are still unresolved." : release.version === "v5.3.8" ? "The adapter is exercised locally and has no provider account, deployment manifest, managed secret, or hosted rollback target." : release.version === "v5.3.9" ? "Migration runs against a transactional memory candidate; no real database, backup service, residency control, or cutover has been selected." : release.version === "v5.4.0" ? "Tokens are signed fixtures, not external-provider identities; provisioning, revocation service, MFA, recovery, and account operations remain unfinished." : "Operations evidence is local and technical only; hosted alert delivery, retention policy, on-call ownership, real rollback automation, and public launch remain unfinished."}\n`;
  }).reverse().join("\n");
  let text = read("CHANGELOG.md");
  for (const release of releases) text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title}[\\s\\S]*?(?=\\n## v|$)`), "");
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

console.log(`applied-pilot-platform ${latest.version} (${selected.length}/5)`);
