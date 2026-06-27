import fs from "node:fs";
import path from "node:path";

const release = "v2.9.9";
const badge = `${release} owner lane`;

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
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}sourceownerapproval.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}proposaldiffreview.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
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
  if (!fs.existsSync(file)) return;
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function diffReviewConfig() {
  return JSON.parse(read("data/vedapath-proposal-diff-review-room.json"));
}

function ownerSampleReviewPacket(config) {
  const proposal = config.sample_proposal;
  const review = config.sample_review;
  return {
    schema_version: config.schema_version,
    release: config.release,
    review_id: "proposal-review-sample-owner-lane",
    local_status: "Ready for source owner",
    production_ready: false,
    proposal_id: proposal.proposal_id,
    source_answer_id: proposal.source_answer_id,
    source_record_id: proposal.source_record_id,
    source: proposal.source,
    source_family: proposal.source_family,
    decision_state: review.decision_state,
    reviewer_name: review.reviewer_name,
    source_owner: review.source_owner,
    second_reviewer: review.second_reviewer,
    review_note: review.review_note,
    revision_reason: review.revision_reason,
    rejection_reason: review.rejection_reason,
    rollback_note: review.rollback_note,
    missing: [],
    blocked: [],
    warnings: [
      "Proposal contains blocked fields; keep them out of owner approval scope.",
      config.review_policy
    ],
    reviewed_diff_count: proposal.diffs.length,
    blocked_field_count: proposal.blocked_fields.length,
    proposal,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeOwnerData() {
  const diffConfig = diffReviewConfig();
  const samplePacket = ownerSampleReviewPacket(diffConfig);
  const data = {
    product: "VedaPath AI",
    release,
    status: "source owner approval lane v1",
    schema_version: "source-owner-approval-lane-v1",
    diff_review_dataset: "data/vedapath-proposal-diff-review-room.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_owner_store: "vedapath-source-owner-approvals-v1",
    warning: "This room records source-owner approval scope only. It does not edit canonical records, publish source data, verify rights, certify scholarship, provide therapy, give ritual instruction, or become spiritual authority.",
    approval_policy: "A source owner may approve a reviewed proposal for implementation queue only when the scope excludes blocked fields, rollback is explicit, and production storage remains separate.",
    decision_states: [
      "Needs owner review",
      "Return to reviewer",
      "Owner rejected",
      "Owner approved for implementation queue"
    ],
    required_by_state: {
      "Needs owner review": ["owner_name", "owner_note"],
      "Return to reviewer": ["owner_name", "owner_note", "return_reason"],
      "Owner rejected": ["owner_name", "owner_note", "rejection_reason"],
      "Owner approved for implementation queue": [
        "owner_name",
        "owner_note",
        "approval_scope",
        "blocked_field_disposition",
        "rollback_instruction",
        "implementation_guard"
      ]
    },
    blocked_owner_conditions: [
      "review packet is not ready for source owner",
      "blocked field disposition does not exclude canonical edits",
      "owner name is blank",
      "rollback instruction is blank",
      "implementation guard is blank"
    ],
    sample_review_packet: samplePacket,
    sample_owner_decision: {
      decision_state: "Owner approved for implementation queue",
      owner_name: "Source reviewer",
      owner_note: "Approve only the editable boundary and readiness path. Canonical citation fields remain unchanged.",
      approval_scope: "Approve review_state, readiness, and boundary language only.",
      blocked_field_disposition: "Exclude the source field from scope; do not edit canonical citation or rights-sensitive text.",
      return_reason: "",
      rejection_reason: "",
      rollback_instruction: "Rollback by discarding this owner approval packet and keeping the existing source-answer record unchanged.",
      implementation_guard: "Implementation queue may draft a non-canonical change packet only; production storage and immutable audit remain required."
    }
  };
  write("data/vedapath-source-owner-approval-lane.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeOwnerCss() {
  write("assets/vedapath-source-owner-approval-lane.css", `/* VedaPath source owner approval lane */
.owner-app,
.owner-head,
.owner-layout,
.owner-form,
.owner-grid,
.owner-list,
.owner-actions,
.owner-rules {
  display: grid;
  gap: 10px;
}

.owner-app {
  gap: 16px;
}

.owner-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.owner-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.owner-mark img {
  display: block;
  width: 100%;
}

.owner-layout {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: start;
}

.owner-form,
.owner-card,
.owner-result,
.owner-packet,
.owner-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.owner-form,
.owner-card,
.owner-result,
.owner-rule {
  padding: 12px;
}

.owner-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.owner-form input,
.owner-form select,
.owner-form textarea,
.owner-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.owner-form textarea,
.owner-packet {
  min-height: 118px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.owner-grid,
.owner-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.owner-card,
.owner-result {
  border-left: 4px solid var(--gold);
}

.owner-card.ready,
.owner-result[data-state="Owner approved for implementation queue"] {
  border-left-color: var(--green);
}

.owner-card.blocked,
.owner-result[data-state="Blocked"],
.owner-result[data-state="Owner rejected"],
.owner-result[data-state="Return to reviewer"] {
  border-left-color: var(--ochre);
}

.owner-card span,
.owner-card strong,
.owner-rule span,
.owner-rule strong {
  display: block;
}

.owner-card span,
.owner-rule span {
  color: var(--muted);
  font-size: 12px;
}

.owner-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.owner-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .owner-head,
  .owner-layout,
  .owner-grid,
  .owner-rules {
    grid-template-columns: 1fr;
  }

  .owner-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .owner-actions,
  .owner-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeOwnerJs() {
  write("assets/vedapath-source-owner-approval-lane.js", `const ownerRoot = document.getElementById("sourceOwnerApprovalLane");

if (ownerRoot) {
  initSourceOwnerApprovalLane().catch((error) => {
    ownerRoot.innerHTML = '<article class="owner-result"><strong>Source owner approval lane could not load.</strong></article>';
    console.error(error);
  });
}

function ownerSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseOwnerJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function sourceOwnerMissingForState(config, decision) {
  const required = config.required_by_state?.[decision.decision_state] || [];
  return required.filter((field) => !String(decision[field] ?? "").trim());
}

function ownerBlockedFields(reviewPacket) {
  const proposal = reviewPacket?.proposal;
  if (proposal && Array.isArray(proposal.blocked_fields)) return proposal.blocked_fields;
  if (Number(reviewPacket?.blocked_field_count || 0) > 0) {
    return [{ field: "blocked fields", reason: "Review packet reports blocked fields." }];
  }
  return [];
}

function dispositionExcludesBlocked(value) {
  return /(exclude|out of scope|do not edit|unchanged|not edit)/i.test(String(value || ""));
}

function sourceOwnerApprove(config, reviewPacket, ownerDecision) {
  const missing = sourceOwnerMissingForState(config, ownerDecision);
  const warnings = [];
  const blocked = [];
  const blockedFields = ownerBlockedFields(reviewPacket);
  const isApproval = ownerDecision.decision_state === "Owner approved for implementation queue";
  const packetStatus = reviewPacket?.local_status || reviewPacket?.decision_state || "";
  const readyForOwner = packetStatus === "Ready for source owner";

  if (!reviewPacket || typeof reviewPacket !== "object") missing.push("review packet");

  if (isApproval && !readyForOwner) {
    blocked.push("review packet is not ready for source owner");
  }

  if (isApproval && blockedFields.length) {
    if (!dispositionExcludesBlocked(ownerDecision.blocked_field_disposition)) {
      blocked.push("blocked field disposition must exclude canonical edits");
    }
    warnings.push("Blocked fields remain outside owner approval scope.");
  }

  if (reviewPacket?.production_ready === true) {
    warnings.push("Owner lane treats production readiness as false until implementation storage exists.");
  }

  const canAdvance = missing.length === 0 && blocked.length === 0;
  const owner_status = !canAdvance ? "Blocked" : ownerDecision.decision_state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    owner_decision_id: "source-owner-decision-" + Date.now(),
    owner_status,
    production_ready: false,
    implementation_queue_ready: owner_status === "Owner approved for implementation queue",
    proposal_id: reviewPacket?.proposal_id || reviewPacket?.proposal?.proposal_id || "",
    source_answer_id: reviewPacket?.source_answer_id || reviewPacket?.proposal?.source_answer_id || "",
    source_record_id: reviewPacket?.source_record_id || reviewPacket?.proposal?.source_record_id || "",
    source_family: reviewPacket?.source_family || reviewPacket?.proposal?.source_family || "",
    source_owner: ownerDecision.owner_name || "",
    decision_state: ownerDecision.decision_state,
    owner_note: ownerDecision.owner_note || "",
    approval_scope: ownerDecision.approval_scope || "",
    blocked_field_disposition: ownerDecision.blocked_field_disposition || "",
    return_reason: ownerDecision.return_reason || "",
    rejection_reason: ownerDecision.rejection_reason || "",
    rollback_instruction: ownerDecision.rollback_instruction || "",
    implementation_guard: ownerDecision.implementation_guard || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.approval_policy
    ],
    review_packet_status: packetStatus || "Unknown",
    reviewed_diff_count: Number(reviewPacket?.reviewed_diff_count || reviewPacket?.proposal?.diffs?.length || 0),
    blocked_field_count: blockedFields.length,
    created_at: new Date().toISOString()
  };
}

function sourceOwnerSnapshot(decisions, config) {
  const byStatus = decisions.reduce((counts, decision) => {
    const key = decision.owner_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: decisions.length,
    blocked: byStatus.Blocked || 0,
    returned: byStatus["Return to reviewer"] || 0,
    rejected: byStatus["Owner rejected"] || 0,
    approved_for_implementation_queue: byStatus["Owner approved for implementation queue"] || 0,
    decisions
  };
}

async function ownerLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readOwnerStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeOwnerStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initSourceOwnerApprovalLane() {
  const config = await ownerLoadJson("data/vedapath-source-owner-approval-lane.json");
  const storeKey = config.local_owner_store;
  let decisions = readOwnerStore(storeKey);
  let activeDecision = null;

  const packetInput = ownerRoot.querySelector("#ownerReviewPacket");
  const decisionSelect = ownerRoot.querySelector("#ownerDecisionState");
  const ownerInput = ownerRoot.querySelector("#ownerName");
  const noteInput = ownerRoot.querySelector("#ownerNote");
  const scopeInput = ownerRoot.querySelector("#ownerScope");
  const dispositionInput = ownerRoot.querySelector("#ownerBlockedDisposition");
  const returnInput = ownerRoot.querySelector("#ownerReturnReason");
  const rejectionInput = ownerRoot.querySelector("#ownerRejectionReason");
  const rollbackInput = ownerRoot.querySelector("#ownerRollback");
  const guardInput = ownerRoot.querySelector("#ownerGuard");
  const resultEl = ownerRoot.querySelector("#ownerResult");
  const packetEl = ownerRoot.querySelector("#ownerPacket");
  const scopeList = ownerRoot.querySelector("#ownerScopeList");
  const rulesEl = ownerRoot.querySelector("#ownerRules");
  const savedEl = ownerRoot.querySelector("#ownerSaved");
  const reviewButton = ownerRoot.querySelector("#reviewOwnerLane");
  const sampleButton = ownerRoot.querySelector("#loadOwnerSample");
  const saveButton = ownerRoot.querySelector("#saveOwnerDecision");
  const clearButton = ownerRoot.querySelector("#clearOwnerDecisions");
  const copyButton = ownerRoot.querySelector("#copyOwnerPacket");

  decisionSelect.innerHTML = (config.decision_states || []).map((state) => '<option value="' + ownerSafe(state) + '">' + ownerSafe(state) + '</option>').join("");

  function loadSample() {
    packetInput.value = JSON.stringify(config.sample_review_packet, null, 2);
    decisionSelect.value = config.sample_owner_decision.decision_state;
    ownerInput.value = config.sample_owner_decision.owner_name;
    noteInput.value = config.sample_owner_decision.owner_note;
    scopeInput.value = config.sample_owner_decision.approval_scope;
    dispositionInput.value = config.sample_owner_decision.blocked_field_disposition;
    returnInput.value = config.sample_owner_decision.return_reason;
    rejectionInput.value = config.sample_owner_decision.rejection_reason;
    rollbackInput.value = config.sample_owner_decision.rollback_instruction;
    guardInput.value = config.sample_owner_decision.implementation_guard;
  }

  function decisionFromForm() {
    return {
      decision_state: decisionSelect.value,
      owner_name: ownerInput.value.trim(),
      owner_note: noteInput.value.trim(),
      approval_scope: scopeInput.value.trim(),
      blocked_field_disposition: dispositionInput.value.trim(),
      return_reason: returnInput.value.trim(),
      rejection_reason: rejectionInput.value.trim(),
      rollback_instruction: rollbackInput.value.trim(),
      implementation_guard: guardInput.value.trim()
    };
  }

  function renderScope(reviewPacket) {
    const diffs = reviewPacket?.proposal?.diffs || [];
    const blocked = ownerBlockedFields(reviewPacket);
    scopeList.innerHTML = [
      ...diffs.map((diff) => (
        '<article class="owner-card ready">' +
          '<span>Reviewable field</span><strong>' + ownerSafe(diff.field) + '</strong>' +
          '<span>Proposed</span><strong>' + ownerSafe(diff.proposed_value) + '</strong>' +
        '</article>'
      )),
      ...blocked.map((field) => (
        '<article class="owner-card blocked">' +
          '<span>Out of scope</span><strong>' + ownerSafe(field.field) + '</strong>' +
          '<span>Reason</span><strong>' + ownerSafe(field.reason) + '</strong>' +
        '</article>'
      ))
    ].join("");
  }

  function renderRules() {
    rulesEl.innerHTML = [
      ["Store", storeKey],
      ["States", (config.decision_states || []).join(", ")],
      ["Production", "Always false in this preview"],
      ["Boundary", config.warning]
    ].map((row) => '<article class="owner-rule"><span>' + ownerSafe(row[0]) + '</span><strong>' + ownerSafe(row[1]) + '</strong></article>').join("");
  }

  function renderSaved() {
    savedEl.innerHTML = decisions.slice(0, 8).map((decision) => (
      '<article class="owner-card">' +
        '<span>' + ownerSafe(decision.created_at) + '</span>' +
        '<strong>' + ownerSafe(decision.owner_status) + '</strong>' +
        '<span>' + ownerSafe((decision.source_answer_id || "proposal") + " | " + decision.source_owner) + '</span>' +
      '</article>'
    )).join("") || '<article class="owner-card"><strong>No owner decisions yet</strong><span>Review and save one owner packet to begin.</span></article>';
  }

  function renderDecision() {
    const reviewPacket = parseOwnerJson(packetInput.value, {});
    const ownerDecision = decisionFromForm();
    const result = sourceOwnerApprove(config, reviewPacket, ownerDecision);
    activeDecision = result;
    resultEl.dataset.state = result.owner_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.owner_status === "Owner approved for implementation queue" ? 'green' : '') + '">' + ownerSafe(result.owner_status) + '</span>',
      '<h2>Owner decision packet</h2>',
      '<p class="muted">' + ownerSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="owner-grid">',
      '<article class="owner-card"><span>Missing</span><strong>' + ownerSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="owner-card"><span>Blocked</span><strong>' + ownerSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="owner-card"><span>Implementation queue</span><strong>' + ownerSafe(result.implementation_queue_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="owner-card"><span>Production ready</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderScope(reviewPacket);
  }

  [packetInput, decisionSelect, ownerInput, noteInput, scopeInput, dispositionInput, returnInput, rejectionInput, rollbackInput, guardInput].forEach((el) => {
    el.addEventListener("input", renderDecision);
    el.addEventListener("change", renderDecision);
  });

  reviewButton.addEventListener("click", renderDecision);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderDecision();
  });
  saveButton.addEventListener("click", () => {
    if (!activeDecision) renderDecision();
    decisions = [activeDecision, ...decisions].slice(0, 24);
    writeOwnerStore(storeKey, decisions);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    decisions = [];
    writeOwnerStore(storeKey, decisions);
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
  renderRules();
  renderSaved();
  renderDecision();
}

if (typeof window !== "undefined") {
  window.vedapathSourceOwnerApprovalLane = {
    sourceOwnerApprove,
    sourceOwnerSnapshot,
    sourceOwnerMissingForState,
    ownerBlockedFields,
    parseOwnerJson
  };
}
`);
}

function writeOwnerPage() {
  write("sourceownerapproval.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Source Owner Approval Lane</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-source-owner-approval-lane.css">
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
            <span>Source owner lane</span>
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

      <main class="workspace" aria-label="VedaPath Source Owner Approval workspace">
        <aside class="panel">
          <span class="eyebrow">Owner control</span>
          <h2>Approve scope before implementation</h2>
          <p class="muted">A source owner can approve a reviewed proposal for implementation queue, return it, or reject it. Canonical records remain untouched.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receive</strong><p>Read the review packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Scope</strong><p>Separate editable fields from blocked fields.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Decide</strong><p>Approve, return, or reject.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Handoff</strong><p>Export owner packet.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="proposaldiffreview.html">Open Diff Review</a>
            <a class="button" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>
          </div>
        </aside>

        <section class="panel owner-app" id="sourceOwnerApprovalLane">
          <div class="owner-head">
            <div>
              <span class="eyebrow">Source owner approval lane</span>
              <h1>Approve implementation scope, not scripture data.</h1>
              <p class="muted">This room turns a reviewed source proposal into an owner decision packet. Approval means the implementation queue may prepare a bounded change packet, not that source data is already changed.</p>
            </div>
            <div class="owner-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath source owner mark"></div>
          </div>

          <section class="owner-layout">
            <div class="owner-form">
              <h2>Owner Decision</h2>
              <label>Review packet<textarea id="ownerReviewPacket"></textarea></label>
              <label>Decision state<select id="ownerDecisionState"></select></label>
              <label>Owner name<input id="ownerName" type="text" placeholder="Source reviewer"></label>
              <label>Owner note<textarea id="ownerNote"></textarea></label>
              <label>Approval scope<textarea id="ownerScope"></textarea></label>
              <label>Blocked field disposition<textarea id="ownerBlockedDisposition"></textarea></label>
              <label>Return reason<textarea id="ownerReturnReason"></textarea></label>
              <label>Rejection reason<textarea id="ownerRejectionReason"></textarea></label>
              <label>Rollback instruction<textarea id="ownerRollback"></textarea></label>
              <label>Implementation guard<textarea id="ownerGuard"></textarea></label>
              <div class="owner-actions">
                <button class="button primary" id="reviewOwnerLane" type="button">Review Owner Lane</button>
                <button class="button safe" id="loadOwnerSample" type="button">Load Sample</button>
                <button class="button" id="saveOwnerDecision" type="button">Save Local</button>
                <button class="button" id="clearOwnerDecisions" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="owner-result" id="ownerResult" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Scope and Blocks</h2>
                <div class="owner-list" id="ownerScopeList"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Owner Rules</h2>
            <div class="owner-rules" id="ownerRules"></div>
          </section>

          <section class="owner-layout">
            <div>
              <div class="owner-actions">
                <button class="button safe" id="copyOwnerPacket" type="button">Copy Owner Packet</button>
                <a class="button" href="data/vedapath-source-owner-approval-lane.json">Open JSON</a>
              </div>
              <textarea class="owner-packet" id="ownerPacket" aria-label="Source owner approval packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Owner Decisions</h2>
              <div class="owner-list" id="ownerSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Owner lane</span>
          <h2 style="margin-top: 14px;">Canonical Boundary</h2>
          <p class="muted">This room can approve implementation scope. It cannot publish source records or rewrite canonical citation fields.</p>
          <div class="progress" aria-label="Source owner approval lane progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>4</strong></div>
            <div class="metric"><span>Production</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Owner Rule</h2>
            <p class="muted">Owner approval creates an implementation-queue packet only. Production still needs durable storage, immutable audit, and rollback controls.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-source-owner-approval-lane.js"></script>
  </body>
</html>
`);
}

function updateReviewFlowLinks() {
  let diff = read("proposaldiffreview.html");
  if (!diff.includes("sourceownerapproval.html")) {
    diff = diff.replace(
      '<a class="button safe" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>\n            <a class="button" href="reviewidentitygate.html">Open Identity Gate</a>',
      '<a class="button primary" href="sourceownerapproval.html">Open Owner Lane</a>\n            <a class="button safe" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>\n            <a class="button" href="reviewidentitygate.html">Open Identity Gate</a>'
    );
  }
  write("proposaldiffreview.html", diff);

  for (const file of ["sourceupdateproposalbridge.html", "reviewqueuepersistence.html", "reviewidentitygate.html"]) {
    let content = read(file);
    if (!content.includes("sourceownerapproval.html") && content.includes("Open Diff Review")) {
      content = content.replace(
        '<a class="button" href="proposaldiffreview.html">Open Diff Review</a>',
        '<a class="button" href="proposaldiffreview.html">Open Diff Review</a>\n            <a class="button safe" href="sourceownerapproval.html">Open Owner Lane</a>'
      );
    }
    write(file, content);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('sourceownerapproval.html">Owner approval')) {
    content = content.replace(
      '<a href="proposaldiffreview.html">Diff review <span>states</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
      '<a href="proposaldiffreview.html">Diff review <span>states</span></a>\n              <a href="sourceownerapproval.html">Owner approval <span>lane</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
    );
  }
  if (!content.includes('sourceownerapproval.html">Owner lane')) {
    content = content.replace(
      '<a href="sourceupdateproposalbridge.html">Proposal <span>bridge</span></a>\n            </div>',
      '<a href="sourceupdateproposalbridge.html">Proposal <span>bridge</span></a>\n              <a href="proposaldiffreview.html">Diff review <span>states</span></a>\n              <a href="sourceownerapproval.html">Owner lane <span>scope</span></a>\n            </div>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace('<strong>v2.9.8</strong>\n          <p>Proposal Diff Review Room: draft source proposals now get decision states, rejection paths, rollback notes, and local review packets.</p>', '<strong>v2.9.9</strong>\n          <p>Source Owner Approval Lane: reviewed source proposals now get owner scope, return/reject paths, rollback instructions, and implementation-queue packets.</p>')
    .replace('<strong>79%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:79%"></div></div>\n          <p>The trust loop now has draft proposal review states before any production storage plan.</p>', '<strong>80%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:80%"></div></div>\n          <p>The trust loop now has owner approval scope before implementation queue handoff.</p>')
    .replace('<strong>Source owner approval lane</strong>\n          <p>Add a dedicated owner-review lane that accepts, rejects, or returns proposal packets.</p>', '<strong>Implementation queue handoff</strong>\n          <p>Turn owner-approved packets into implementation tasks without touching canonical source data.</p>');

  const phase262 = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 262: Proposal Diff Review Room</strong>
                <p>Adds local decision states, source-owner path, revision and rejection reasons, rollback note, and copyable review packets.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  const ownerPhase = `${phase262}
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 263: Source Owner Approval Lane</strong>
                <p>Adds owner scope, return and rejection paths, rollback instructions, implementation guards, and copyable owner packets.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 263: Source Owner Approval Lane")) {
    content = content.replace(phase262, ownerPhase);
    content = content.replace("Phase 263: Production Implementation and Licensed Audio", "Phase 264: Production Implementation and Licensed Audio");
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v2.9.8 Proposal Diff Review Room</strong></div>', '<div class="version-row"><span>Release</span><strong>v2.9.9 Source Owner Approval Lane</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v2.9.7 Source Update Proposal Bridge</strong></div>', '<div class="version-row"><span>Previous</span><strong>v2.9.8 Proposal Diff Review Room</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Review draft source diffs before owner approval.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Let source owners approve implementation scope without editing canonical records.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for source owner approval lane</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for implementation queue handoff</strong></div>')
    .replace(`<li><span class="dot"></span><span>Create a source-owner approval lane.</span></li>
              <li><span class="dot"></span><span>Separate returned, rejected, and accepted proposals.</span></li>
              <li><span class="dot"></span><span>Add owner handoff packet export.</span></li>
              <li><span class="dot"></span><span>Keep canonical records untouched until production storage.</span></li>`, `<li><span class="dot"></span><span>Build implementation queue handoff.</span></li>
              <li><span class="dot"></span><span>Add accepted, returned, and rejected owner lanes to review dashboard.</span></li>
              <li><span class="dot"></span><span>Export owner approval packets with immutable IDs.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records untouched until production storage.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE START -->", "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE END -->", `## ${release} Source Owner Approval Lane

This release adds the owner step after proposal diff review.

- adds \`sourceownerapproval.html\`
- adds \`data/vedapath-source-owner-approval-lane.json\`
- adds owner decision states for approve, return, reject, and blocked
- requires approval scope, blocked-field disposition, rollback instruction, and implementation guard before owner approval
- keeps production readiness false and canonical source records unchanged`, "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE NOTES START -->", "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE NOTES END -->", `## ${release} Source Owner Approval Lane

This phase adds a local owner lane between diff review and implementation queue.

Action taken:

- Added source-owner approval schema.
- Added owner approval, return, rejection, and blocked states.
- Required approval scope, blocked-field disposition, rollback instruction, and implementation guard.
- Added copyable owner decision packets.
- Preserved canonical source data.`, "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE BLUEPRINT START -->", "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE BLUEPRINT END -->", `### 282. Source Owner Approval Lane

VedaPath should separate source-owner approval from production data mutation.

Rules:

- Source owners approve implementation scope, not canonical source records.
- Blocked fields must be explicitly excluded from approval.
- Approval requires rollback instructions and implementation guards.
- Production readiness remains false in preview.
- The next build should create an implementation queue handoff.`, "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/SOURCE_OWNER_APPROVAL_LANE.md", `# VedaPath AI Source Owner Approval Lane

Release: ${release}

This release adds a source-owner decision lane after proposal diff review.

## Files

- \`data/vedapath-source-owner-approval-lane.json\`
- \`sourceownerapproval.html\`
- \`assets/vedapath-source-owner-approval-lane.css\`
- \`assets/vedapath-source-owner-approval-lane.js\`

## What It Adds

The room:

- reads a diff review packet
- separates reviewable fields from blocked fields
- lets the owner approve, return, or reject
- requires approval scope, blocked-field disposition, rollback instruction, and implementation guard
- exports a source-owner packet
- stores local owner history only

## Boundary

Owner approval is not a canonical source edit. It only permits a bounded implementation queue packet in preview. Production storage, immutable audit, and rollback controls still come later.
`);
}

writeOwnerData();
writeOwnerCss();
writeOwnerJs();
writeOwnerPage();
updateAllHtmlShells();
for (const file of ["sourceownerapproval.html", "proposaldiffreview.html", "reviewqueuepersistence.html", "reviewidentitygate.html", "sourceupdateproposalbridge.html"]) {
  activateReviewLane(file);
}
updateReviewFlowLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} source owner approval lane applied.`);
