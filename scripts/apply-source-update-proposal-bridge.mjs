import fs from "node:fs";
import path from "node:path";

const release = "v2.9.7";
const badge = `${release} proposal`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, block, before) {
  const wrapped = `${start}\n${block.trimEnd()}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), wrapped);
  }
  const index = content.indexOf(before);
  if (index === -1) return `${content.trimEnd()}\n\n${wrapped}\n`;
  return `${content.slice(0, index)}${wrapped}\n\n${content.slice(index)}`;
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function pointReviewNavToQueue(content, isBrandPage = false) {
  const prefix = isBrandPage ? "../" : "";
  return content
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}sourceupdateproposalbridge\\.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}reviewqueuepersistence\\.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`);
}

function updateAllHtmlShells() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, pointReviewNavToQueue(updateVersionBadge(read(file))));
  }
  const brandFile = path.join("brand", "brand-board.html");
  if (fs.existsSync(brandFile)) {
    write(brandFile, pointReviewNavToQueue(updateVersionBadge(read(brandFile)), true));
  }
}

function activateReviewLane(file) {
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function writeProposalData() {
  const data = {
    product: "VedaPath AI",
    release,
    status: "source update proposal bridge v1",
    schema_version: "source-update-proposal-bridge-v1",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    identity_gate_dataset: "data/vedapath-review-identity-gate.json",
    queue_dataset: "data/vedapath-review-queue-persistence.json",
    local_proposal_store: "vedapath-source-update-proposals-v1",
    warning: "This bridge creates draft source-update proposals only. It does not edit canonical source records, verify scholarship, approve rights, provide therapy, give ritual instruction, or become spiritual authority.",
    proposal_policy: "Accepted or recommended review packets may create source-update proposals. Production must require durable identity, immutable audit, diff review, source-owner approval, and rollback before any canonical record changes.",
    allowed_packet_actions: ["accept", "recommend-accept"],
    editable_fields: [
      "review_state",
      "readiness",
      "source_note",
      "boundary",
      "caution"
    ],
    blocked_fields: [
      "id",
      "slug",
      "source_record_id",
      "source",
      "source_family",
      "rights_state",
      "tabs"
    ],
    proposal_statuses: [
      "Draft proposal only",
      "Needs diff review",
      "Ready for source owner",
      "Blocked",
      "Rejected"
    ],
    production_requirements: [
      "durable reviewer identity",
      "immutable audit packet",
      "source record diff preview",
      "second reviewer for acceptance",
      "source owner approval",
      "rollback note"
    ],
    sample_audit_packet: {
      schema_version: "review-identity-gate-v1",
      release: "v2.9.6",
      decision_id: "identity-gate-sample-source-update",
      queue_id: "queue-direct-source-candidate",
      ticket_id: "ticket-direct-source-candidate",
      action_id: "accept",
      role_id: "founder-review",
      reviewer_name: "Founder review",
      second_reviewer: "Source reviewer",
      decision_note: "Accept as a proposal for source-record update review, not as a canonical change.",
      evidence_note: "Bhagavad Gita 2.48 record supports calm reflection with a boundary against therapy or guaranteed outcomes.",
      boundary_note: "Keep the result as source-backed reflection support only.",
      gate_status: "Proposal only",
      production_ready: false,
      missing: [],
      warnings: [
        "Accepted local decision remains proposal-only until production storage and identity exist."
      ],
      created_at: "2026-06-27T00:00:00.000Z"
    },
    sample_proposal: {
      source_answer_id: "answer-steady-action-bg-2-48",
      proposed_updates: {
        review_state: "source-update-proposed",
        readiness: "needs-source-owner-review",
        source_note: "Candidate accepted for proposal review after identity gate; canonical record unchanged.",
        boundary: "Reflection support only; not therapy, medical advice, ritual instruction, or spiritual authority.",
        caution: "Do not promise peace, certainty, or guaranteed outcomes."
      },
      blocked_update_attempt: {
        source: "Bhagavad Gita 2.48 - edited directly"
      }
    }
  };
  write("data/vedapath-source-update-proposal-bridge.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeProposalCss() {
  write("assets/vedapath-source-update-proposal-bridge.css", `/* VedaPath source update proposal bridge */
.proposal-app,
.proposal-head,
.proposal-layout,
.proposal-form,
.proposal-grid,
.proposal-diffs,
.proposal-actions,
.proposal-rules,
.proposal-list {
  display: grid;
  gap: 10px;
}

.proposal-app {
  gap: 16px;
}

.proposal-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.proposal-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.proposal-mark img {
  display: block;
  width: 100%;
}

.proposal-layout {
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: start;
}

.proposal-form,
.proposal-result,
.proposal-diff,
.proposal-rule,
.proposal-packet,
.proposal-source-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.proposal-form,
.proposal-result,
.proposal-diff,
.proposal-rule,
.proposal-source-card {
  padding: 12px;
}

.proposal-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.proposal-form select,
.proposal-form textarea,
.proposal-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.proposal-form textarea,
.proposal-packet {
  min-height: 184px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.proposal-grid,
.proposal-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.proposal-source-card {
  border-left: 4px solid var(--bhagwa);
}

.proposal-result {
  border-left: 4px solid var(--gold);
}

.proposal-result[data-status="Draft proposal only"] {
  border-left-color: var(--bhagwa);
}

.proposal-result[data-status="Blocked"] {
  border-left-color: var(--ochre);
}

.proposal-result[data-status="Needs diff review"] {
  border-left-color: var(--green);
}

.proposal-diff {
  display: grid;
  grid-template-columns: minmax(120px, 0.38fr) minmax(0, 0.62fr);
  gap: 10px;
  border-left: 4px solid var(--green);
}

.proposal-diff.blocked {
  border-left-color: var(--ochre);
  background: #fff6f0;
}

.proposal-diff span,
.proposal-diff strong,
.proposal-rule span,
.proposal-rule strong,
.proposal-source-card span,
.proposal-source-card strong {
  display: block;
}

.proposal-diff span,
.proposal-rule span,
.proposal-source-card span {
  color: var(--muted);
  font-size: 12px;
}

.proposal-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.proposal-list {
  max-height: 260px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .proposal-head,
  .proposal-layout,
  .proposal-grid,
  .proposal-rules,
  .proposal-diff {
    grid-template-columns: 1fr;
  }

  .proposal-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .proposal-actions,
  .proposal-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeProposalJs() {
  write("assets/vedapath-source-update-proposal-bridge.js", `const proposalRoot = document.getElementById("sourceUpdateProposalBridge");

if (proposalRoot) {
  initSourceUpdateProposalBridge().catch((error) => {
    proposalRoot.innerHTML = '<article class="proposal-result"><strong>Source update proposal bridge could not load.</strong></article>';
    console.error(error);
  });
}

function proposalSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseProposalJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function findSourceRecord(sourceRecords, id) {
  return (sourceRecords || []).find((record) => record.id === id);
}

function buildSourceProposal(config, sourceRecords, auditPacket, sourceAnswerId, proposedUpdates, blockedAttempt = {}) {
  const record = findSourceRecord(sourceRecords, sourceAnswerId);
  const missing = [];
  const warnings = [];
  const allowedActions = config.allowed_packet_actions || [];

  if (!record) missing.push("known source answer record");
  if (!auditPacket || typeof auditPacket !== "object") missing.push("audit packet");
  if (auditPacket && !allowedActions.includes(auditPacket.action_id)) {
    missing.push("accepted or recommended audit action");
  }
  if (auditPacket && auditPacket.missing && auditPacket.missing.length) {
    missing.push("clear identity gate missing fields");
  }
  if (auditPacket && !auditPacket.second_reviewer && auditPacket.action_id === "accept") {
    warnings.push("Second reviewer should be present before source-owner review.");
  }

  const editable = new Set(config.editable_fields || []);
  const blocked = new Set(config.blocked_fields || []);
  const diffs = [];
  const blocked_fields = [];

  for (const [field, next] of Object.entries(proposedUpdates || {})) {
    if (!editable.has(field)) {
      blocked_fields.push({ field, attempted_value: next, reason: "Field is not editable in this proposal bridge." });
      continue;
    }
    const current = record ? record[field] : undefined;
    if (current !== next) {
      diffs.push({ field, current_value: current ?? "", proposed_value: next });
    }
  }

  for (const [field, next] of Object.entries(blockedAttempt || {})) {
    if (blocked.has(field) || !editable.has(field)) {
      blocked_fields.push({ field, attempted_value: next, reason: "Canonical or rights-sensitive field requires a separate source-owner process." });
    }
  }

  if (!diffs.length) missing.push("at least one editable field change");
  warnings.push(config.proposal_policy);

  const status = missing.length ? "Blocked" : "Draft proposal only";
  return {
    schema_version: config.schema_version,
    release: config.release,
    proposal_id: "source-proposal-" + Date.now(),
    status,
    source_answer_id: sourceAnswerId,
    source_record_id: record ? record.source_record_id : "",
    source: record ? record.source : "",
    source_family: record ? record.source_family : "",
    audit_packet: auditPacket,
    diffs,
    blocked_fields,
    missing,
    warnings,
    production_requirements: config.production_requirements || [],
    created_at: new Date().toISOString()
  };
}

function proposalSnapshot(proposals, config) {
  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: proposals.length,
    proposals
  };
}

async function proposalLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readProposalStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeProposalStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initSourceUpdateProposalBridge() {
  const [config, sourceData, identityData] = await Promise.all([
    proposalLoadJson("data/vedapath-source-update-proposal-bridge.json"),
    proposalLoadJson("data/vedapath-source-answer-foundation.json"),
    proposalLoadJson("data/vedapath-review-identity-gate.json")
  ]);

  const sourceRecords = sourceData.records || [];
  const proposalStore = config.local_proposal_store;
  let proposals = readProposalStore(proposalStore);

  const recordSelect = proposalRoot.querySelector("#proposalRecord");
  const auditInput = proposalRoot.querySelector("#proposalAuditPacket");
  const updatesInput = proposalRoot.querySelector("#proposalUpdates");
  const blockedInput = proposalRoot.querySelector("#proposalBlockedAttempt");
  const resultEl = proposalRoot.querySelector("#proposalResult");
  const sourceEl = proposalRoot.querySelector("#proposalSource");
  const diffsEl = proposalRoot.querySelector("#proposalDiffs");
  const packetEl = proposalRoot.querySelector("#proposalPacket");
  const rulesEl = proposalRoot.querySelector("#proposalRules");
  const savedEl = proposalRoot.querySelector("#proposalSaved");
  const buildButton = proposalRoot.querySelector("#buildProposal");
  const sampleButton = proposalRoot.querySelector("#loadProposalSample");
  const saveButton = proposalRoot.querySelector("#saveProposal");
  const copyButton = proposalRoot.querySelector("#copyProposalPacket");
  const clearButton = proposalRoot.querySelector("#clearProposalStore");

  let activeProposal = null;

  recordSelect.innerHTML = sourceRecords.map((record) => '<option value="' + proposalSafe(record.id) + '">' + proposalSafe(record.source + " | " + record.question) + '</option>').join("");

  function loadSample() {
    recordSelect.value = config.sample_proposal.source_answer_id;
    auditInput.value = JSON.stringify(config.sample_audit_packet || identityData.sample_decision || {}, null, 2);
    updatesInput.value = JSON.stringify(config.sample_proposal.proposed_updates, null, 2);
    blockedInput.value = JSON.stringify(config.sample_proposal.blocked_update_attempt, null, 2);
  }

  function currentRecord() {
    return findSourceRecord(sourceRecords, recordSelect.value);
  }

  function renderSource() {
    const record = currentRecord();
    if (!record) return;
    sourceEl.innerHTML = [
      ["Answer ID", record.id],
      ["Source", record.source],
      ["Family", record.source_family],
      ["Current review state", record.review_state],
      ["Current readiness", record.readiness],
      ["Boundary", record.boundary]
    ].map((row) => '<article class="proposal-source-card"><span>' + proposalSafe(row[0]) + '</span><strong>' + proposalSafe(row[1]) + '</strong></article>').join("");
  }

  function renderRules() {
    rulesEl.innerHTML = [
      ["Editable fields", (config.editable_fields || []).join(", ")],
      ["Blocked fields", (config.blocked_fields || []).join(", ")],
      ["Allowed packets", (config.allowed_packet_actions || []).join(", ")],
      ["Local store", proposalStore]
    ].map((row) => '<article class="proposal-rule"><span>' + proposalSafe(row[0]) + '</span><strong>' + proposalSafe(row[1]) + '</strong></article>').join("");
  }

  function renderSaved() {
    savedEl.innerHTML = proposals.slice(0, 8).map((proposal) => (
      '<article class="proposal-source-card">' +
        '<span>' + proposalSafe(proposal.created_at) + '</span>' +
        '<strong>' + proposalSafe(proposal.source || proposal.source_answer_id) + '</strong>' +
        '<span>' + proposalSafe(proposal.status + " | " + proposal.diffs.length + " proposed changes") + '</span>' +
      '</article>'
    )).join("") || '<article class="proposal-source-card"><strong>No saved proposals yet</strong><span>Build and save one draft proposal to begin.</span></article>';
  }

  function renderProposal(proposal) {
    activeProposal = proposal;
    resultEl.dataset.status = proposal.status;
    resultEl.innerHTML = [
      '<span class="badge ' + (proposal.status === "Blocked" ? '' : 'green') + '">' + proposalSafe(proposal.status) + '</span>',
      '<h2>Source update proposal</h2>',
      '<p class="muted">' + proposalSafe(proposal.source || "No source record") + '</p>',
      '<div class="proposal-grid">',
      '<article class="proposal-source-card"><span>Missing</span><strong>' + proposalSafe(proposal.missing.length ? proposal.missing.join(", ") : "None") + '</strong></article>',
      '<article class="proposal-source-card"><span>Blocked fields</span><strong>' + proposalSafe(proposal.blocked_fields.length) + '</strong></article>',
      '</div>'
    ].join("");
    diffsEl.innerHTML = [
      ...proposal.diffs.map((diff) => (
        '<article class="proposal-diff">' +
          '<div><span>Editable field</span><strong>' + proposalSafe(diff.field) + '</strong></div>' +
          '<div><span>Current</span><strong>' + proposalSafe(diff.current_value) + '</strong><span>Proposed</span><strong>' + proposalSafe(diff.proposed_value) + '</strong></div>' +
        '</article>'
      )),
      ...proposal.blocked_fields.map((field) => (
        '<article class="proposal-diff blocked">' +
          '<div><span>Blocked field</span><strong>' + proposalSafe(field.field) + '</strong></div>' +
          '<div><span>Attempted</span><strong>' + proposalSafe(field.attempted_value) + '</strong><span>Reason</span><strong>' + proposalSafe(field.reason) + '</strong></div>' +
        '</article>'
      ))
    ].join("");
    packetEl.value = JSON.stringify(proposal, null, 2);
  }

  function buildFromInputs() {
    const auditPacket = parseProposalJson(auditInput.value, {});
    const updates = parseProposalJson(updatesInput.value, {});
    const blockedAttempt = parseProposalJson(blockedInput.value, {});
    const proposal = buildSourceProposal(config, sourceRecords, auditPacket, recordSelect.value, updates, blockedAttempt);
    renderProposal(proposal);
  }

  recordSelect.addEventListener("change", () => {
    renderSource();
    buildFromInputs();
  });
  buildButton.addEventListener("click", buildFromInputs);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderSource();
    buildFromInputs();
  });
  saveButton.addEventListener("click", () => {
    if (!activeProposal) buildFromInputs();
    proposals = [activeProposal, ...proposals].slice(0, 24);
    writeProposalStore(proposalStore, proposals);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    proposals = [];
    writeProposalStore(proposalStore, proposals);
    renderSaved();
  });
  copyButton.addEventListener("click", () => {
    packetEl.focus();
    packetEl.select();
    const original = copyButton.textContent;
    const done = () => {
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(packetEl.value).then(done).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      done();
    } catch (error) {}
  });

  loadSample();
  renderSource();
  renderRules();
  renderSaved();
  buildFromInputs();
}

if (typeof window !== "undefined") {
  window.vedapathSourceUpdateProposalBridge = {
    buildSourceProposal,
    proposalSnapshot,
    findSourceRecord,
    parseProposalJson
  };
}
`);
}

function writeProposalPage() {
  write("sourceupdateproposalbridge.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Source Update Proposal Bridge</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-source-update-proposal-bridge.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Source proposal bridge</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link active" href="reviewqueuepersistence.html">Review</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Source Update Proposal Bridge workspace">
        <aside class="panel">
          <span class="eyebrow">Review to source</span>
          <h2>Propose, do not rewrite</h2>
          <p class="muted">Accepted review packets can suggest source-record changes. This bridge keeps every change draft-only until production review exists.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Packet</strong><p>Start from reviewed evidence.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Diff</strong><p>Compare editable fields.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Block</strong><p>Protect canonical fields.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Export</strong><p>Copy proposal packet.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="reviewidentitygate.html">Open Identity Gate</a>
            <a class="button" href="sourcefoundation.html">Open Source Data</a>
          </div>
        </aside>

        <section class="panel proposal-app" id="sourceUpdateProposalBridge">
          <div class="proposal-head">
            <div>
              <span class="eyebrow">Source update proposal bridge</span>
              <h1>Review becomes a draft, not a silent edit.</h1>
              <p class="muted">The bridge reads a reviewed audit packet, compares it with a source answer record, and produces a copyable proposal with blocked fields clearly separated.</p>
            </div>
            <div class="proposal-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath source proposal mark"></div>
          </div>

          <section class="proposal-layout">
            <div class="proposal-form">
              <h2>Proposal Builder</h2>
              <label>Source answer record<select id="proposalRecord"></select></label>
              <label>Audit packet<textarea id="proposalAuditPacket"></textarea></label>
              <label>Proposed editable updates<textarea id="proposalUpdates"></textarea></label>
              <label>Blocked-field attempt<textarea id="proposalBlockedAttempt"></textarea></label>
              <div class="proposal-actions">
                <button class="button primary" id="buildProposal" type="button">Build Proposal</button>
                <button class="button safe" id="loadProposalSample" type="button">Load Sample</button>
                <button class="button" id="saveProposal" type="button">Save Local</button>
                <button class="button" id="clearProposalStore" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="proposal-source-card">
                <span class="badge green">Current source record</span>
                <div class="proposal-grid" id="proposalSource" style="margin-top: 10px;"></div>
              </section>
              <section class="proposal-result" id="proposalResult" data-status="Blocked" style="margin-top: 10px;"></section>
              <section style="margin-top: 10px;">
                <h2>Diff Preview</h2>
                <div class="proposal-diffs" id="proposalDiffs"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Bridge Rules</h2>
            <div class="proposal-rules" id="proposalRules"></div>
          </section>

          <section class="proposal-layout">
            <div>
              <div class="proposal-actions">
                <button class="button safe" id="copyProposalPacket" type="button">Copy Proposal</button>
                <a class="button" href="data/vedapath-source-update-proposal-bridge.json">Open JSON</a>
              </div>
              <textarea class="proposal-packet" id="proposalPacket" aria-label="Source update proposal packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Proposals</h2>
              <div class="proposal-list" id="proposalSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Proposal phase</span>
          <h2 style="margin-top: 14px;">Source Boundary</h2>
          <p class="muted">This room does not mutate source records. It creates a diff packet so a future source owner can review, approve, reject, or roll back.</p>
          <div class="progress" aria-label="Source proposal bridge progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Editable</span><strong>5</strong></div>
            <div class="metric"><span>Blocked</span><strong>7</strong></div>
            <div class="metric"><span>Status</span><strong>Draft</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Production Rule</h2>
            <p class="muted">A source record should change only after durable identity, immutable audit, source-owner approval, diff review, and rollback readiness exist.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-source-update-proposal-bridge.js"></script>
  </body>
</html>
`);
}

function updateReviewPages() {
  for (const file of ["reviewqueuepersistence.html", "reviewidentitygate.html"]) {
    let content = updateVersionBadge(read(file));
    if (!content.includes('href="sourceupdateproposalbridge.html">Open Proposal Bridge')) {
      const anchor = file === "reviewqueuepersistence.html"
        ? '<a class="button" href="reviewidentitygate.html">Open Identity Gate</a>'
        : '<a class="button safe" href="reviewqueuepersistence.html">Open Queue</a>';
      content = content.replace(
        anchor,
        `${anchor}\n            <a class="button" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>`
      );
    }
    write(file, content);
  }
}

function updateIndex() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("index.html")));
  if (!content.includes('href="sourceupdateproposalbridge.html">Source proposal')) {
    content = content.replace(
      '<a href="reviewidentitygate.html">Identity gate <span>audit</span></a>',
      '<a href="reviewidentitygate.html">Identity gate <span>audit</span></a>\n              <a href="sourceupdateproposalbridge.html">Source proposal <span>diff</span></a>'
    );
  }
  if (!content.includes('href="sourceupdateproposalbridge.html">Proposal')) {
    content = content.replace(
      '<a href="reviewidentitygate.html">Identity <span>gate</span></a>',
      '<a href="reviewidentitygate.html">Identity <span>gate</span></a>\n              <a href="sourceupdateproposalbridge.html">Proposal <span>bridge</span></a>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("build-status.html")));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Source Update Proposal Bridge: accepted review packets can now become draft source-record diffs without changing canonical data.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>77%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:77%"></div></div>
          <p>The trust loop now reaches draft source updates while protecting canonical source records.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Proposal diff review room</strong>
          <p>Add reviewer-facing approval states for draft source proposals before production storage.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 261: Source Update Proposal Bridge</strong>
                <p>Turns accepted review packets into draft source-record diffs while blocking canonical and rights-sensitive fields.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 261: Source Update Proposal Bridge")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 261: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 262: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Source Update Proposal Bridge</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.6 Reviewer Identity and Audit Gate</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Convert accepted audit packets into draft source diffs.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for proposal diff review room</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Turn accepted audit packets into draft source updates\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Require source diff preview before save\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep source proposals separate from canonical records\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Preserve the simple review queue as the entry point\.<\/span><\/li>/, `<li><span class="dot"></span><span>Add approval states for draft source proposals.</span></li>
              <li><span class="dot"></span><span>Require source-owner review before production.</span></li>
              <li><span class="dot"></span><span>Add rollback note and rejection reason fields.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records unchanged in preview.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE START -->", "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE END -->", `## ${release} Source Update Proposal Bridge

This release connects review decisions to source data without silently changing source records.

- adds \`data/vedapath-source-update-proposal-bridge.json\`
- adds \`sourceupdateproposalbridge.html\`
- turns accepted or recommended audit packets into draft source diffs
- separates editable fields from blocked canonical and rights-sensitive fields
- stores draft proposals only in browser-local preview memory
- keeps canonical \`data/vedapath-source-answer-foundation.json\` unchanged`, "<!-- VEDAPATH REVIEW IDENTITY GATE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE NOTES START -->", "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE NOTES END -->", `## ${release} Source Update Proposal Bridge

This phase makes the review-to-source handoff explicit.

Action taken:

- Added source update proposal bridge schema.
- Added a focused proposal room linked from Review Queue and Identity Gate.
- Added draft diff generation for editable fields.
- Added blocked-field visibility for canonical and rights-sensitive fields.
- Set the next phase as proposal diff review room.`, "<!-- VEDAPATH REVIEW IDENTITY GATE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE BLUEPRINT START -->", "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE BLUEPRINT END -->", `### 280. Source Update Proposal Bridge

VedaPath should treat accepted review as a proposal, not a source rewrite.

Rules:

- Accepted or recommended review packets may create source-update proposals.
- Canonical and rights-sensitive fields remain blocked in this bridge.
- A proposal must show current value, proposed value, audit packet, warnings, and production requirements.
- Browser-local saved proposals are preview memory only.
- The next build should add proposal approval states, rejection reasons, rollback notes, and source-owner review.`, "<!-- VEDAPATH REVIEW IDENTITY GATE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/SOURCE_UPDATE_PROPOSAL_BRIDGE.md", `# VedaPath AI Source Update Proposal Bridge

Release: ${release}

This release creates a draft-only bridge from reviewed audit packets to source-record update proposals.

## Files

- \`data/vedapath-source-update-proposal-bridge.json\`
- \`sourceupdateproposalbridge.html\`
- \`assets/vedapath-source-update-proposal-bridge.css\`
- \`assets/vedapath-source-update-proposal-bridge.js\`

## What It Adds

The bridge:

- reads a reviewed audit packet
- compares proposed updates with an existing answer record
- shows editable-field diffs
- blocks canonical and rights-sensitive fields
- produces a copyable proposal packet
- stores draft proposals locally for preview only

## Boundary

This bridge does not mutate \`data/vedapath-source-answer-foundation.json\`. Production needs durable identity, immutable audit, source-owner approval, diff review, and rollback before any canonical record changes.
`);
}

writeProposalData();
writeProposalCss();
writeProposalJs();
writeProposalPage();
updateAllHtmlShells();
activateReviewLane("reviewqueuepersistence.html");
activateReviewLane("reviewidentitygate.html");
activateReviewLane("sourceupdateproposalbridge.html");
updateReviewPages();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} source update proposal bridge applied.`);
