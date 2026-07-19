import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));

const boundary = "Private-pilot deployment readiness only; provider and region activation, managed production credentials, real participant data, behavioral telemetry, live AI, public launch, and production authorization remain closed.";

const releases = [
  {
    version: "v5.4.2",
    title: "Hosted Provider Binding Decision",
    short: "Binding Decision",
    file: "hostedproviderbindingdecision.html",
    slug: "hosted-provider-binding-decision",
    bodyClass: "hosted-provider-binding-decision-page",
    phase: "Phase 5.4.2: Hosted Provider Binding Decision",
    summary: "Adds a checksummed, maker-checker-reviewed hosted binding manifest with eight required evidence gates and reference-only runtime, storage, identity, and secret bindings while operational activation remains false.",
    goal: "Turn the provider recommendation into a reviewable implementation decision without silently binding infrastructure or granting deployment authority.",
    status: "Ready for managed secrets and environment contract",
    next: "v5.4.3 Managed Secrets & Environment Contract",
    eyebrow: "Decision before activation",
    hero: "Approve the manifest. Keep the switch off.",
    subhero: "One reviewed packet names the candidate host, region, runtime profile, evidence, and binding references. Its checksum can be compared; it still cannot activate an account, region, or deployment.",
    metrics: [["Evidence", "8/8"], ["Review", "Maker-checker"], ["Manifest", "Checksummed"], ["Binding", "Off"]],
    flow: ["Name the candidate host and residency region.", "Review eight independent evidence gates.", "Checksum one reference-only binding manifest.", "Keep operational activation and deployment false."],
    checks: [["Residency", "Explicit evidence"], ["Review", "Different maker and checker"], ["Bindings", "References only"], ["Activation", "Still blocked"]],
    packet: ["evidence:8/8", "review:maker-checker", "manifest:checksummed", "operational-binding:false", "deployment:false"],
    control: "binding",
    initialInstruction: "Compare a complete packet with missing evidence; neither path activates infrastructure.",
    risk: "The packet approves only controlled implementation planning; no provider account, legal contract, region, support plan, or deployment credential is actually bound."
  },
  {
    version: "v5.4.3",
    title: "Managed Secrets & Environment Contract",
    short: "Secrets Contract",
    file: "managedsecretsenvironmentcontract.html",
    slug: "managed-secrets-environment-contract",
    bodyClass: "managed-secrets-environment-contract-page",
    phase: "Phase 5.4.3: Managed Secrets & Environment Contract",
    summary: "Introduces a private-pilot environment contract that accepts only named secret references, rejects inline values and secret-like public configuration, and returns non-exportable redacted fixture handles.",
    goal: "Prove the configuration and secret boundary before any managed secret store or production credential is connected.",
    status: "Ready for durable database cutover rehearsal",
    next: "v5.4.4 Durable Database Cutover Rehearsal",
    eyebrow: "References, never values",
    hero: "Configure what is public. Refer to what is secret.",
    subhero: "The environment profile separates ordinary settings from four required secret references. Inline values fail immediately, while fixture resolution returns a redacted non-exportable handle.",
    metrics: [["Profile", "Private pilot"], ["Secret refs", "4"], ["Inline values", "Rejected"], ["Values", "Redacted"]],
    flow: ["Validate the private-pilot public configuration.", "Require four named secret references.", "Reject inline and secret-like public values.", "Resolve only redacted non-exportable fixture handles."],
    checks: [["Origin", "HTTPS required"], ["References", "Strict secret:// format"], ["Diagnostics", "Values redacted"], ["Managed store", "Still unbound"]],
    packet: ["profile:private-pilot", "secret-refs:4", "inline-values:false", "values-exposed:false", "managed-store:false"],
    control: "secrets",
    initialInstruction: "Validate references, try an unsafe inline value, then inspect a redacted fixture handle.",
    risk: "The resolver is a local fixture; managed vault permissions, rotation, break-glass access, audit export, and production credential custody remain unfinished."
  },
  {
    version: "v5.4.4",
    title: "Durable Database Cutover Rehearsal",
    short: "Cutover Rehearsal",
    file: "durabledatabasecutoverrehearsal.html",
    slug: "durable-database-cutover-rehearsal",
    bodyClass: "durable-database-cutover-rehearsal-page",
    phase: "Phase 5.4.4: Durable Database Cutover Rehearsal",
    summary: "Adds a blue-green memory-backed cutover rehearsal with checksummed plans, referential integrity, count and checksum parity, idempotent replay, simulated failure rollback, and explicit return to the blue slot.",
    goal: "Prove the cutover and rollback sequence before selecting or writing to a real durable database.",
    status: "Ready for reviewer identity provisioning rehearsal",
    next: "v5.4.5 Reviewer Identity Provisioning Rehearsal",
    eyebrow: "Rehearse every move",
    hero: "Copy. Compare. Switch. Roll back.",
    subhero: "The blue dataset is copied into a green candidate only when every table validates and count plus checksum parity agree. Failure restores the whole prior state; replay cannot duplicate the run.",
    metrics: [["Pattern", "Blue-green"], ["Parity", "Count + checksum"], ["Replay", "Idempotent"], ["Provider", "Unbound"]],
    flow: ["Snapshot a checked source dataset.", "Copy every related table to green.", "Compare counts, checksum, and references.", "Switch or restore blue as one bounded operation."],
    checks: [["References", "Validated before switch"], ["Parity", "Counts and checksum"], ["Failure", "Full state rollback"], ["Retry", "One completed run"]],
    packet: ["strategy:blue-green", "parity:verified", "idempotent:true", "rollback:true", "durable-provider:null"],
    control: "cutover",
    initialInstruction: "Run, replay, fail, and roll back the database rehearsal without touching a real store.",
    risk: "All rehearsal state is memory-backed; real database schemas, backups, encryption, residency, throughput, retention, and disaster recovery remain unproven."
  },
  {
    version: "v5.4.5",
    title: "Reviewer Identity Provisioning Rehearsal",
    short: "Reviewer Provisioning",
    file: "revieweridentityprovisioningrehearsal.html",
    slug: "reviewer-identity-provisioning-rehearsal",
    bodyClass: "reviewer-identity-provisioning-rehearsal-page",
    phase: "Phase 5.4.5: Reviewer Identity Provisioning Rehearsal",
    summary: "Adds a synthetic reviewer lifecycle with request, independent approval, least-privilege activation, immediate session revocation, and an ordered redacted audit history while real accounts and external identity remain absent.",
    goal: "Prove reviewer account operations and separation of duties before provisioning any real identity.",
    status: "Ready for private pilot deployment readiness gate",
    next: "v5.4.6 Private Pilot Deployment Readiness Gate",
    eyebrow: "Provision with separation",
    hero: "Request. Approve. Activate. Revoke.",
    subhero: "A synthetic reviewer cannot approve their own request. Activation grants only the reviewer role, revocation invalidates the session immediately, and each lifecycle event remains visible in order.",
    metrics: [["Role", "Reviewer only"], ["Approval", "Maker-checker"], ["Revocation", "Immediate"], ["Accounts", "Synthetic"]],
    flow: ["Request one synthetic reviewer identity.", "Require approval from a different actor.", "Activate one least-privilege reviewer session.", "Revoke it and preserve the audit sequence."],
    checks: [["Self-approval", "Rejected"], ["Privilege", "Reviewer only"], ["Session", "Invalid after revoke"], ["External IdP", "Still unbound"]],
    packet: ["identity:synthetic", "approval:maker-checker", "role:reviewer", "revocation:immediate", "external-idp:null"],
    control: "provisioning",
    initialInstruction: "Walk the synthetic reviewer through request, approval, activation, and revocation.",
    risk: "The lifecycle is synthetic; external identity integration, MFA, recovery, joiner-mover-leaver operations, device trust, and real account support remain unfinished."
  },
  {
    version: "v5.4.6",
    title: "Private Pilot Deployment Readiness Gate",
    short: "Deployment Gate",
    file: "privatepilotdeploymentreadinessgate.html",
    slug: "private-pilot-deployment-readiness-gate",
    bodyClass: "private-pilot-deployment-readiness-gate-page",
    phase: "Phase 5.4.6: Private Pilot Deployment Readiness Gate",
    summary: "Aggregates binding, secret, cutover, reviewer provisioning, operations, private-demo, rollback, and founder-review evidence into one reviewer-only decision: private demo ready, hosted deployment blocked, public launch closed.",
    goal: "Give the founder one honest deployment-readiness decision without confusing local proof with production authorization.",
    status: "Ready for founder hosted-pilot activation decision",
    next: "v5.4.7 Hosted Pilot Activation Decision",
    eyebrow: "One honest readiness decision",
    hero: "Private demo ready. Hosted deployment still blocked.",
    subhero: "Five approved evidence packets and three review checks now meet in one gate. The gate names every remaining production dependency and denies deployment attempts until real infrastructure and operational authority exist.",
    metrics: [["Evidence", "5/5"], ["Private demo", "Ready"], ["Hosted deploy", "Blocked"], ["Public launch", "Closed"]],
    flow: ["Aggregate five checksummed evidence packets.", "Verify private demo, rollback, and founder review.", "List every unresolved production dependency.", "Deny deployment and keep public launch closed."],
    checks: [["Evidence", "Five approved packets"], ["Access", "Reviewer only"], ["Attempt", "403 fail-closed"], ["Launch", "No authorization granted"]],
    packet: ["evidence:5/5", "private-demo:true", "hosted-deploy:false", "deployment-authorized:false", "public-launch:false"],
    control: "gate",
    initialInstruction: "Compare complete and incomplete readiness evidence, then confirm a deployment attempt is denied.",
    risk: "This is a local private-demo readiness gate, not deployment approval; hosted accounts, managed secrets, durable storage, external identity, security operations, legal review, and real pilot consent remain unfinished."
  }
];

const through = args.get("through") || releases.at(-1).version;
const throughIndex = releases.findIndex((release) => release.version === through);
if (throughIndex < 0) throw new Error(`Unknown --through=${through}`);
const selected = releases.slice(0, throughIndex + 1);
const latest = selected.at(-1);
const previousRelease = selected.length > 1 ? selected.at(-2) : { version: "v5.4.1", title: "Private Pilot Operations & Observability Gate" };

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
  if (release.control === "binding") return `<div class="platform-actions"><button class="platform-primary" type="button" data-readiness-action="complete">Review complete packet</button><button type="button" data-readiness-action="incomplete">Review incomplete packet</button></div>`;
  if (release.control === "secrets") return `<div class="platform-actions"><button class="platform-primary" type="button" data-readiness-action="validate">Validate references</button><button type="button" data-readiness-action="inline">Try inline value</button><button type="button" data-readiness-action="resolve">Resolve redacted handle</button></div>`;
  if (release.control === "cutover") return `<div class="platform-actions"><button class="platform-primary" type="button" data-readiness-action="rehearse">Run rehearsal</button><button type="button" data-readiness-action="rehearse">Replay</button><button type="button" data-readiness-action="fail">Simulate failure</button><button type="button" data-readiness-action="rollback">Roll back</button></div>`;
  if (release.control === "provisioning") return `<div class="platform-actions"><button class="platform-primary" type="button" data-readiness-action="request">Request</button><button type="button" data-readiness-action="approve">Approve</button><button type="button" data-readiness-action="activate">Activate</button><button type="button" data-readiness-action="revoke">Revoke</button></div>`;
  return `<div class="platform-actions"><button class="platform-primary" type="button" data-readiness-action="evaluate">Evaluate complete evidence</button><button type="button" data-readiness-action="incomplete">Evaluate incomplete evidence</button><button type="button" data-readiness-action="deploy">Attempt deployment</button></div>`;
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
    <main class="page pilot-platform-page deployment-readiness-page" id="top">
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
          <span class="platform-kicker">One controlled path</span>
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
          <pre class="platform-output" data-readiness-output aria-live="polite">Loading bounded release data.</pre>
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
    <script id="deploymentReadinessData" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
    <script src="assets/vedapath-command-shell.js"></script>
    <script src="assets/vedapath-deployment-readiness.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.version} ${release.title}\n\n${release.summary}\n\n## Goal\n\n${release.goal}\n\n## Flow\n\n${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n## Contract checks\n\n${release.checks.map(([label, value]) => `- **${label}:** ${value}`).join("\n")}\n\n## Packet\n\n${release.packet.map((item) => `- \`${item}\``).join("\n")}\n\n## Boundary\n\n${boundary}\n`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} deployment readiness";`);
  const labels = selected.map((release) => `"${release.short}"`).join(", ");
  const group = `    { title: "Deployment Readiness", labels: [${labels}] },`;
  if (/    \{ title: "Deployment Readiness", labels: \[[^\]]*\] \},/.test(text)) {
    text = text.replace(/    \{ title: "Deployment Readiness", labels: \[[^\]]*\] \},/, group);
  } else {
    text = text.replace('    { title: "Pilot Platform", labels: ["Selection Gate", "Deployment Adapter", "Storage Migration", "Signed Identity", "Pilot Operations"] },', '    { title: "Pilot Platform", labels: ["Selection Gate", "Deployment Adapter", "Storage Migration", "Signed Identity", "Pilot Operations"] },\n' + group);
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Pilot Operations": "Private Pilot Operations & Observability Gate",', '    "Pilot Operations": "Private Pilot Operations & Observability Gate",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "private-pilot-operations-observability-gate-page": "Private Pilot Operations & Observability Gate",', '    "private-pilot-operations-observability-gate-page": "Private Pilot Operations & Observability Gate",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Pilot Operations", "privatepilotoperationsobservabilitygate.html"],', '    ["Pilot Operations", "privatepilotoperationsobservabilitygate.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "privatepilotoperationsobservabilitygate.html",', '  "privatepilotoperationsobservabilitygate.html",\n' + line);
  }
  write("scripts/check-static-links.mjs", text);
}

function replaceSummaryTile(text, label, strong, copy) {
  const pattern = new RegExp(`(<article class="tile">\\s*<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>\\s*<p>[\\s\\S]*?<\\/p>(?=\\s*<\\/article>)`, "m");
  return text.replace(pattern, `$1<strong>${strong}</strong>\n          <p>${copy}</p>`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} deployment readiness</span>`);
  text = replaceSummaryTile(text, "Current version", latest.version, latest.summary);
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now has reviewable provider, secret, database cutover, reviewer provisioning, and deployment-readiness evidence without opening hosted activation.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "The private demo path is evidence-complete, while real hosted accounts, managed credentials, durable storage, external identity, production operations, live AI, and public launch remain closed.");
  text = replaceSummaryTile(text, "Next release", latest.next, "Founder review comes before any real provider activation, credential binding, database cutover, account provisioning, or deployment authorization.");

  text = text.replace(/(            <!-- V537-V541 PILOT PLATFORM START -->[\s\S]*?)(<span class="badge active">Active<\/span>)([\s\S]*?            <!-- V537-V541 PILOT PLATFORM END -->)/, '$1<span class="badge done">Done</span>$3');
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.summary}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V542-V546 DEPLOYMENT READINESS START -->\n${phases}\n            <!-- V542-V546 DEPLOYMENT READINESS END -->`;
  if (text.includes("<!-- V542-V546 DEPLOYMENT READINESS START -->")) {
    text = text.replace(/            <!-- V542-V546 DEPLOYMENT READINESS START -->[\s\S]*?            <!-- V542-V546 DEPLOYMENT READINESS END -->/, block);
  } else {
    text = text.replace('            <!-- V537-V541 PILOT PLATFORM END -->', '            <!-- V537-V541 PILOT PLATFORM END -->\n' + block);
  }
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${latest.version} ${latest.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previousRelease.version} ${previousRelease.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${latest.goal}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${latest.status}; ${boundary}</strong></div>`);
  write("build-status.html", text);
}

function updateReadme() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n${release.summary}\n\n- Open: [${release.title}](${release.file})\n- Data: \`data/vedapath-${release.slug}.json\`${release.version === "v5.4.6" ? "\n- Local HTTP proof: `node scripts/smoke-v546-deployment-readiness-http.mjs`" : ""}\n- Boundary: ${boundary}\n`).reverse().join("\n");
  let text = read("README.md");
  for (const release of releases) text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title.replace(/[&]/g, "&")}[\\s\\S]*?(?=\\n## v|$)`), "");
  write("README.md", entries + "\n" + text.trimStart());
}

function updateChangelog() {
  const entries = selected.map((release) => {
    const runtimeFiles = release.version === "v5.4.6"
      ? "\n- `scripts/serve-vedapath-deployment-readiness.mjs`\n- `scripts/smoke-v546-deployment-readiness-http.mjs`"
      : "";
    const runtimeChecks = release.version === "v5.4.6"
      ? "\n- `node --check scripts/serve-vedapath-deployment-readiness.mjs`\n- `node --check scripts/smoke-v546-deployment-readiness-http.mjs`\n- `node scripts/smoke-v546-deployment-readiness-http.mjs`"
      : "";
    return `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added an interactive ${release.short} room, structured data packet, documentation, and deterministic deployment-readiness contract coverage.\n- Preserved the closed boundary: no provider activation, real credentials or participant data, behavioral telemetry, live AI, deployment authorization, or public launch.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`assets/vedapath-deployment-readiness.js\`\n- \`scripts/vedapath-deployment-readiness-contracts.mjs\`\n- \`scripts/check-v542-v546-deployment-readiness.mjs\`\n- \`scripts/apply-v542-v546-deployment-readiness-batch.mjs\`${runtimeFiles}\n- \`assets/vedapath-command-shell.js\`\n- \`scripts/check-static-links.mjs\`\n- \`build-status.html\`\n- \`README.md\`\n- \`CHANGELOG.md\`\n\n### Checks run\n- \`node scripts/apply-v542-v546-deployment-readiness-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-deployment-readiness-contracts.mjs\`\n- \`node --check scripts/check-v542-v546-deployment-readiness.mjs\`\n- \`node --check assets/vedapath-deployment-readiness.js\`\n- \`node scripts/check-v542-v546-deployment-readiness.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`${runtimeChecks}\n\n### Known risks\n- ${release.risk}\n`;
  }).reverse().join("\n");
  let text = read("CHANGELOG.md");
  for (const release of releases) text = text.replace(new RegExp(`## ${release.version.replaceAll(".", "\\.")} ${release.title.replace(/[&]/g, "&")}[\\s\\S]*?(?=\\n## v|$)`), "");
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

console.log(`applied-deployment-readiness ${latest.version} (${selected.length}/5)`);
