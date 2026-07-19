import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));

const boundary = "Hosted-pilot implementation evidence only; provider activation, managed production credentials, durable production data, real external identities, participant telemetry, live AI, deployment, and public launch remain closed.";

const releases = [
  {
    version: "v5.4.7",
    title: "Founder Hosted-Pilot Activation Decision",
    short: "Founder Activation",
    file: "founderhostedpilotactivationdecision.html",
    slug: "founder-hosted-pilot-activation-decision",
    bodyClass: "founder-hosted-pilot-activation-decision-page",
    phase: "Phase 5.4.7: Founder Hosted-Pilot Activation Decision",
    summary: "Turns the private-demo readiness packet into a checksummed maker-checker founder decision that may authorize implementation preparation while provider activation, deployment, and public launch stay false.",
    goal: "Create one explicit founder decision between evidence-complete private demo work and any hosted implementation preparation.",
    status: "Ready for provider manifest dry run",
    next: "v5.4.8 Provider Manifest Dry Run",
    eyebrow: "Decide before implementation",
    hero: "Authorize preparation. Keep activation closed.",
    subhero: "The founder and an independent reviewer accept the boundary, owners, blockers, rollback posture, and no-launch rule in one deterministic packet. It permits planning, not infrastructure activation.",
    metrics: [["Evidence", "5/5"], ["Attestations", "4/4"], ["Review", "Maker-checker"], ["Activation", "Closed"]],
    flow: ["Read the complete deployment-readiness packet.", "Assign scope, rollback, security, and budget owners.", "Require founder and independent reviewer signatures.", "Authorize preparation while activation remains denied."],
    checks: [["Readiness", "Private demo approved"], ["Owners", "Four named roles"], ["Decision", "Checksummed"], ["Authority", "Preparation only"]],
    packet: ["evidence:5/5", "attestations:4/4", "implementation-preparation:true", "hosted-activation:false", "deployment:false"],
    control: "founder",
    initialInstruction: "Compare a complete maker-checker decision with incomplete evidence; neither result activates hosting.",
    risk: "This founder packet authorizes only implementation preparation; it is not a vendor contract, legal approval, security sign-off, deployment grant, or launch decision."
  },
  {
    version: "v5.4.8",
    title: "Provider Manifest Dry Run",
    short: "Manifest Dry Run",
    file: "providermanifestdryrun.html",
    slug: "provider-manifest-dry-run",
    bodyClass: "provider-manifest-dry-run-page",
    phase: "Phase 5.4.8: Provider Manifest Dry Run",
    summary: "Compiles founder-authorized preparation into a provider-neutral, checksummed manifest dry run that validates four binding references, explicit routes, security headers, and rollback steps without applying anything.",
    goal: "Prove the shape and safety of a hosted manifest before connecting a provider account or executing a deployment command.",
    status: "Ready for managed secret store adapter",
    next: "v5.4.9 Managed Secret Store Adapter",
    eyebrow: "Plan every operation",
    hero: "Compile the manifest. Apply nothing.",
    subhero: "The dry run expands one candidate manifest into five reviewable operations. Wildcard routes, inline credentials, missing bindings, and weak rollback plans fail before a host can be touched.",
    metrics: [["Bindings", "4 refs"], ["Routes", "3 explicit"], ["Operations", "5"], ["Applied", "No"]],
    flow: ["Validate provider-neutral binding references.", "Review explicit private-pilot routes and methods.", "Require no-store headers and a rollback sequence.", "Emit one redacted receipt without applying the plan."],
    checks: [["Secrets", "No inline material"], ["Routes", "No wildcards"], ["Rollback", "Three steps"], ["Provider", "Still unbound"]],
    packet: ["manifest:checksummed", "bindings:4", "routes:3", "applied:false", "provider-bound:false"],
    control: "manifest",
    initialInstruction: "Dry-run the reviewed manifest, try unsafe inline material, and confirm application is denied.",
    risk: "The manifest is provider-neutral and unapplied; provider-specific configuration, billing, network policy, DNS, support, and real rollback behavior remain untested."
  },
  {
    version: "v5.4.9",
    title: "Managed Secret Store Adapter",
    short: "Secret Adapter",
    file: "managedsecretstoreadapter.html",
    slug: "managed-secret-store-adapter",
    bodyClass: "managed-secret-store-adapter-page",
    phase: "Phase 5.4.9: Managed Secret Store Adapter",
    summary: "Adds a reference-only secret-store adapter candidate with registration, independent rotation approval, revocation, non-exportable handles, ordered audit evidence, and strict rejection of submitted secret values.",
    goal: "Prove managed-secret lifecycle semantics without storing, printing, or connecting a production credential.",
    status: "Ready for durable database adapter candidate",
    next: "v5.5.0 Durable Database Adapter Candidate",
    eyebrow: "Lifecycle without values",
    hero: "Register references. Never reveal values.",
    subhero: "The adapter records only secret references and lifecycle metadata. Rotation requires a different reviewer, revocation disables resolution immediately, and every diagnostic stays redacted.",
    metrics: [["Required refs", "4"], ["Rotation", "Maker-checker"], ["Revocation", "Immediate"], ["Values", "Redacted"]],
    flow: ["Register one versioned secret reference.", "Require independent approval for rotation.", "Resolve only a redacted non-exportable handle.", "Revoke the reference and preserve its audit history."],
    checks: [["Input", "References only"], ["Rotation", "Independent approval"], ["Resolution", "Non-exportable"], ["Store", "Still unbound"]],
    packet: ["mode:reference-only", "rotation:maker-checker", "revocation:true", "values-exposed:false", "managed-store:null"],
    control: "secrets",
    initialInstruction: "Register, rotate, and revoke a reference; then prove a submitted value is rejected.",
    risk: "The adapter is memory-backed and reference-only; real vault IAM, value custody, encryption, rotation jobs, break-glass operations, and audit export remain unfinished."
  },
  {
    version: "v5.5.0",
    title: "Durable Database Adapter Candidate",
    short: "Database Adapter",
    file: "durabledatabaseadaptercandidate.html",
    slug: "durable-database-adapter-candidate",
    bodyClass: "durable-database-adapter-candidate-page",
    phase: "Phase 5.5.0: Durable Database Adapter Candidate",
    summary: "Adds a provider-neutral transactional repository candidate with schema versioning, idempotent receipts, optimistic concurrency, atomic rollback, checksummed checkpoints, restore, and synthetic-data enforcement.",
    goal: "Prove durable repository behavior before choosing or binding a production database.",
    status: "Ready for external reviewer identity and integrated activation gate",
    next: "v5.5.1 External Reviewer Identity & Activation Gate",
    eyebrow: "Durability by contract",
    hero: "Transact once. Detect conflict. Restore cleanly.",
    subhero: "A memory-backed adapter now behaves like the future durable repository: revisions prevent lost updates, transaction IDs prevent duplicates, failed writes roll back fully, and checkpoints restore a verified snapshot.",
    metrics: [["Schema", "v1"], ["Writes", "Transactional"], ["Replay", "Idempotent"], ["Provider", "Unbound"]],
    flow: ["Commit one synthetic source transaction.", "Replay safely and reject a stale revision.", "Roll back an unsafe personal-data write.", "Checkpoint, advance, and restore the prior snapshot."],
    checks: [["Concurrency", "Revision guarded"], ["Failure", "Atomic rollback"], ["Restore", "Checksummed"], ["Data", "Synthetic only"]],
    packet: ["schema:1", "transactions:atomic", "idempotency:true", "checkpoints:true", "durable-provider:null"],
    control: "database",
    initialInstruction: "Commit, replay, conflict, checkpoint, and reject unsafe data without touching a durable provider.",
    risk: "All records remain synthetic and memory-backed; real migrations, encryption, backups, residency, query performance, retention, and disaster recovery remain unproven."
  },
  {
    version: "v5.5.1",
    title: "External Reviewer Identity & Activation Gate",
    short: "Identity Gate",
    file: "externalrevieweridentityactivationgate.html",
    slug: "external-reviewer-identity-activation-gate",
    bodyClass: "external-reviewer-identity-activation-gate-page",
    phase: "Phase 5.5.1: External Reviewer Identity & Activation Gate",
    summary: "Adds signed, issuer-and-audience-bound, expiring reviewer claim verification with revocation, then aggregates six evidence packets into one reviewer-only decision: implementation candidate ready, hosted activation blocked.",
    goal: "Close the implementation-evidence loop with fail-closed identity and one honest activation decision while real infrastructure remains absent.",
    status: "Ready for founder production-slice decision; activation remains blocked",
    next: "Founder production-slice decision",
    eyebrow: "Verify identity. Aggregate truth.",
    hero: "Implementation candidate ready. Activation still blocked.",
    subhero: "Signed fixture claims prove issuer, audience, role, expiry, tamper refusal, and revocation. Six approved packets then meet in one gate that names every remaining real-world dependency and denies activation attempts.",
    metrics: [["Evidence", "6/6"], ["Identity", "Fail-closed"], ["Private demo", "Ready"], ["Activation", "Blocked"]],
    flow: ["Verify one short-lived reviewer claim.", "Reject tampered, expired, and revoked sessions.", "Aggregate six independent implementation packets.", "Deny hosted activation and list the production blockers."],
    checks: [["Claims", "Issuer + audience"], ["Sessions", "Expiring + revocable"], ["Access", "Reviewer only"], ["Attempt", "403 fail-closed"]],
    packet: ["identity:signed-fixture", "evidence:6/6", "implementation-ready:true", "hosted-activation:false", "public-launch:false"],
    control: "gate",
    initialInstruction: "Verify identity, evaluate complete and incomplete evidence, and confirm hosted activation is denied.",
    risk: "The signature key, claims, accounts, adapters, and evidence are local fixtures; a real IdP, provider, secret store, database, reviewer operations, security program, legal review, and support model are still required."
  }
];

const through = args.get("through") || releases.at(-1).version;
const throughIndex = releases.findIndex((release) => release.version === through);
if (throughIndex < 0) throw new Error(`Unknown --through=${through}`);
const selected = releases.slice(0, throughIndex + 1);
const latest = selected.at(-1);
const previousRelease = selected.length > 1 ? selected.at(-2) : { version: "v5.4.6", title: "Private Pilot Deployment Readiness Gate" };

function read(file) { return fs.readFileSync(path.join(root, file), "utf8"); }
function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    managedSecretStoreBound: false,
    durableDatabaseBound: false,
    externalIdentityBound: false,
    productionCredentials: false,
    productionData: false,
    telemetryEnabled: false,
    liveAi: false,
    hostedPilotActivatable: false,
    deploymentAuthorized: false,
    publicLaunch: false,
    updated: "2026-07-19"
  };
}

function controls(release) {
  if (release.control === "founder") return `<div class="platform-actions"><button class="platform-primary" type="button" data-activation-action="authorize">Review complete decision</button><button type="button" data-activation-action="incomplete">Review incomplete decision</button></div>`;
  if (release.control === "manifest") return `<div class="platform-actions"><button class="platform-primary" type="button" data-activation-action="dryrun">Run manifest dry run</button><button type="button" data-activation-action="unsafe">Try inline credential</button><button type="button" data-activation-action="apply">Attempt apply</button></div>`;
  if (release.control === "secrets") return `<div class="platform-actions"><button class="platform-primary" type="button" data-activation-action="register">Register reference</button><button type="button" data-activation-action="rotate">Rotate</button><button type="button" data-activation-action="revoke">Revoke</button><button type="button" data-activation-action="value">Submit value</button></div>`;
  if (release.control === "database") return `<div class="platform-actions"><button class="platform-primary" type="button" data-activation-action="transact">Commit transaction</button><button type="button" data-activation-action="replay">Replay</button><button type="button" data-activation-action="conflict">Try stale revision</button><button type="button" data-activation-action="checkpoint">Checkpoint</button><button type="button" data-activation-action="unsafe">Try personal row</button></div>`;
  return `<div class="platform-actions"><button class="platform-primary" type="button" data-activation-action="evaluate">Evaluate complete gate</button><button type="button" data-activation-action="incomplete">Evaluate incomplete gate</button><button type="button" data-activation-action="activate">Attempt activation</button></div>`;
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
    <main class="page pilot-platform-page hosted-activation-page" id="top">
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
          <pre class="platform-output" data-activation-output aria-live="polite">Loading bounded release data.</pre>
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
    <script id="hostedActivationData" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
    <script src="assets/vedapath-command-shell.js"></script>
    <script src="assets/vedapath-hosted-activation.js"></script>
  </body>
</html>
`;
}

function docMd(release) {
  return `# ${release.version} ${release.title}\n\n${release.summary}\n\n## Goal\n\n${release.goal}\n\n## Flow\n\n${release.flow.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n## Contract checks\n\n${release.checks.map(([label, value]) => `- **${label}:** ${value}`).join("\n")}\n\n## Packet\n\n${release.packet.map((item) => `- \`${item}\``).join("\n")}\n\n## Boundary\n\n${boundary}\n`;
}

function updateCommandShell() {
  let text = read("assets/vedapath-command-shell.js");
  text = text.replace(/const releaseBadge = "v[^"]+";/, `const releaseBadge = "${latest.version} hosted activation";`);
  const labels = selected.map((release) => `"${release.short}"`).join(", ");
  const group = `    { title: "Hosted Activation", labels: [${labels}] },`;
  if (/    \{ title: "Hosted Activation", labels: \[[^\]]*\] \},/.test(text)) {
    text = text.replace(/    \{ title: "Hosted Activation", labels: \[[^\]]*\] \},/, group);
  } else {
    text = text.replace('    { title: "Deployment Readiness", labels: ["Binding Decision", "Secrets Contract", "Cutover Rehearsal", "Reviewer Provisioning", "Deployment Gate"] },', '    { title: "Deployment Readiness", labels: ["Binding Decision", "Secrets Contract", "Cutover Rehearsal", "Reviewer Provisioning", "Deployment Gate"] },\n' + group);
  }
  for (const release of selected) {
    const pageTitle = `    "${release.short}": "${release.title}",`;
    if (!text.includes(pageTitle)) text = text.replace('    "Deployment Gate": "Private Pilot Deployment Readiness Gate",', '    "Deployment Gate": "Private Pilot Deployment Readiness Gate",\n' + pageTitle);
    const bodyTitle = `    "${release.bodyClass}": "${release.title}",`;
    if (!text.includes(bodyTitle)) text = text.replace('    "private-pilot-deployment-readiness-gate-page": "Private Pilot Deployment Readiness Gate",', '    "private-pilot-deployment-readiness-gate-page": "Private Pilot Deployment Readiness Gate",\n' + bodyTitle);
    const link = `    ["${release.short}", "${release.file}"],`;
    if (!text.includes(link)) text = text.replace('    ["Deployment Gate", "privatepilotdeploymentreadinessgate.html"],', '    ["Deployment Gate", "privatepilotdeploymentreadinessgate.html"],\n' + link);
  }
  write("assets/vedapath-command-shell.js", text);
}

function updateStaticLinks() {
  let text = read("scripts/check-static-links.mjs");
  for (const release of selected) {
    const line = `  "${release.file}",`;
    if (!text.includes(line)) text = text.replace('  "privatepilotdeploymentreadinessgate.html",', '  "privatepilotdeploymentreadinessgate.html",\n' + line);
  }
  write("scripts/check-static-links.mjs", text);
}

function replaceSummaryTile(text, label, strong, copy) {
  const pattern = new RegExp(`(<article class="tile">\\s*<span>${label}<\\/span>\\s*)<strong>[\\s\\S]*?<\\/strong>\\s*<p>[\\s\\S]*?<\\/p>(?=\\s*<\\/article>)`, "m");
  return text.replace(pattern, `$1<strong>${strong}</strong>\n          <p>${copy}</p>`);
}

function updateBuildStatus() {
  let text = read("build-status.html");
  text = text.replace(/<span class="version-pill">v[^<]+<\/span>/, `<span class="version-pill">${latest.version} hosted activation</span>`);
  text = replaceSummaryTile(text, "Current version", latest.version, latest.summary);
  text = replaceSummaryTile(text, "MVP progress", "100%", "The clickable MVP now carries founder authorization, manifest, secret lifecycle, database, identity, and integrated activation evidence without opening a hosted pilot.");
  text = replaceSummaryTile(text, "Full vision progress", "99%", "The implementation candidate is evidence-complete, while real provider, vault, database, identity, operations, live AI, participant telemetry, deployment, and public launch remain closed.");
  text = replaceSummaryTile(text, "Next release", latest.next, "The next decision must choose one production implementation slice without turning candidate evidence into launch authority.");

  text = text.replace(/(            <!-- V542-V546 DEPLOYMENT READINESS START -->[\s\S]*?)(<span class="badge active">Active<\/span>)([\s\S]*?            <!-- V542-V546 DEPLOYMENT READINESS END -->)/, '$1<span class="badge done">Done</span>$3');
  const phases = selected.map((release) => `            <article class="phase"><span class="badge ${release === latest ? "active" : "done"}">${release === latest ? "Active" : "Done"}</span><div><strong>${release.phase}</strong><p>${release.summary}</p></div><div class="percent">100%</div></article>`).join("\n");
  const block = `            <!-- V547-V551 HOSTED ACTIVATION START -->\n${phases}\n            <!-- V547-V551 HOSTED ACTIVATION END -->`;
  if (text.includes("<!-- V547-V551 HOSTED ACTIVATION START -->")) {
    text = text.replace(/            <!-- V547-V551 HOSTED ACTIVATION START -->[\s\S]*?            <!-- V547-V551 HOSTED ACTIVATION END -->/, block);
  } else {
    text = text.replace('            <!-- V542-V546 DEPLOYMENT READINESS END -->', '            <!-- V542-V546 DEPLOYMENT READINESS END -->\n' + block);
  }
  text = text.replace(/<div class="version-row"><span>Release<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${latest.version} ${latest.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Previous<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>${previousRelease.version} ${previousRelease.title}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>${latest.goal}</strong></div>`);
  text = text.replace(/<div class="version-row"><span>Status<\/span><strong>[\s\S]*?<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>${latest.status}; ${boundary}</strong></div>`);
  write("build-status.html", text);
}

function updateReadme() {
  const entries = selected.map((release) => `## ${release.version} ${release.title}\n\n${release.summary}\n\n- Open: [${release.title}](${release.file})\n- Data: \`data/vedapath-${release.slug}.json\`${release.version === "v5.5.1" ? "\n- Local HTTP proof: `node scripts/smoke-v551-hosted-activation-http.mjs`" : ""}\n- Boundary: ${boundary}\n`).reverse().join("\n");
  let text = read("README.md");
  for (const release of releases) text = text.replace(new RegExp(`## ${escapeRegex(release.version)} ${escapeRegex(release.title)}[\\s\\S]*?(?=\\n## v|$)`), "");
  write("README.md", entries + "\n" + text.trimStart());
}

function updateChangelog() {
  const entries = selected.map((release) => {
    const runtimeFiles = release.version === "v5.5.1" ? "\n- `scripts/serve-vedapath-hosted-activation.mjs`\n- `scripts/smoke-v551-hosted-activation-http.mjs`" : "";
    const runtimeChecks = release.version === "v5.5.1" ? "\n- `node --check scripts/serve-vedapath-hosted-activation.mjs`\n- `node --check scripts/smoke-v551-hosted-activation-http.mjs`\n- `node scripts/smoke-v551-hosted-activation-http.mjs`" : "";
    return `## ${release.version} ${release.title}\n\n### Changes made\n- ${release.summary}\n- Added a focused ${release.short} command-center room, structured data packet, documentation, and deterministic hosted-activation contract coverage.\n- Preserved the closed boundary: no provider activation, credential value, production data, real identity, participant telemetry, live AI, deployment, or public launch.\n\n### Files changed\n- \`${release.file}\`\n- \`data/vedapath-${release.slug}.json\`\n- \`docs/${release.slug.toUpperCase().replace(/-/g, "_")}.md\`\n- \`assets/vedapath-hosted-activation.js\`\n- \`scripts/vedapath-hosted-activation-contracts.mjs\`\n- \`scripts/check-v547-v551-hosted-activation.mjs\`\n- \`scripts/apply-v547-v551-hosted-activation-batch.mjs\`${runtimeFiles}\n- \`assets/vedapath-command-shell.js\`\n- \`scripts/check-static-links.mjs\`\n- \`build-status.html\`\n- \`README.md\`\n- \`CHANGELOG.md\`\n\n### Checks run\n- \`node scripts/apply-v547-v551-hosted-activation-batch.mjs --through=${release.version}\`\n- \`node --check scripts/vedapath-hosted-activation-contracts.mjs\`\n- \`node --check scripts/check-v547-v551-hosted-activation.mjs\`\n- \`node --check assets/vedapath-hosted-activation.js\`\n- \`node scripts/check-v547-v551-hosted-activation.mjs --through=${release.version}\`\n- \`node scripts/check-static-links.mjs\`${runtimeChecks}\n\n### Known risks\n- ${release.risk}\n`;
  }).reverse().join("\n");
  let text = read("CHANGELOG.md");
  for (const release of releases) text = text.replace(new RegExp(`## ${escapeRegex(release.version)} ${escapeRegex(release.title)}[\\s\\S]*?(?=\\n## v|$)`), "");
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

console.log(`applied-hosted-activation ${latest.version} (${selected.length}/5)`);
